import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { TreeRepository, IsNull } from 'typeorm';

export interface CommentTree extends Comment {
  replies: CommentTree[];
}
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: TreeRepository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCommentDto, userId: string) {
    const blog = await this.blogRepo.findOne({ where: { id: dto.blogId } });
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!blog || !user) throw new NotFoundException('Blog or user not found');

    const comment = this.commentRepo.create({
      content: dto.content,
      blog,
      user,
    });

    if (dto.parentId) {
      const parent = await this.commentRepo.findOne({
        where: { id: dto.parentId },
        relations: ['replies'],
      });
      if (!parent) throw new NotFoundException('Parent comment not found');
      comment.parent = parent;
    }

    return this.commentRepo.save(comment);
  }

  // async findByBlog(blogId: string) {
  //   return this.commentRepo.find({
  //     where: { blog: { id: blogId } },
  //     relations: ['user', 'parent', 'replies'],
  //   });
  // }

  // async findByBlog(blogId: string): Promise<Comment[]> {
  //   return this.commentRepo.find({
  //     where: { blog: { id: blogId } },
  //     relations: ['user', 'parent', 'replies'],
  //     order: { createdAt: 'ASC' },
  //   });
  // }

  async findByBlog(blogId: string): Promise<Comment[]> {
    const blog = await this.blogRepo.findOne({ where: { id: blogId } });
    if (!blog) throw new NotFoundException('Blog not found');

    // Step 1: get root comments
    const rootComments = await this.commentRepo.find({
      where: {
        blog: { id: blogId },
        parent: IsNull(),
      },
      relations: ['user'], // only load author for now
      order: { createdAt: 'ASC' },
    });

    // Step 2: for each root, load its entire tree (descendants)
    const fullTrees = await Promise.all(
      rootComments.map((root) =>
        this.commentRepo.findDescendantsTree(root, {
          relations: [
            'user',
            'parent',
            'replies',
            'replies.user',
            'replies.parent',
          ],
        }),
      ),
    );

    // Step 3: return full comment trees
    return fullTrees;
  }

  async findOne(id: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user', 'parent', 'replies', 'blog'],
    });

    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto, userId: string) {
    const comment = await this.findOne(id);
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    Object.assign(comment, dto);
    return this.commentRepo.save(comment);
  }

  async remove(id: string, userId: string) {
    const comment = await this.findOne(id);

    const isCommentOwner = comment.user.id === userId;
    const isBlogAuthor = comment.blog.author.id === userId;

    if (!isCommentOwner && !isBlogAuthor) {
      throw new ForbiddenException(
        'You can only delete your own comments or those on your blog',
      );
    }

    // Load the full tree (comment + all descendants)
    const tree = await this.commentRepo.findDescendantsTree(comment, {
      relations: ['replies'],
    });

    // Flatten the tree into a list for deletion
    const flattenTree = (node: Comment): Comment[] => {
      return [
        ...node.replies.flatMap(flattenTree),
        node, // root last
      ];
    };

    const allToDelete = flattenTree(tree);

    return this.commentRepo.remove(allToDelete);
  }
}
