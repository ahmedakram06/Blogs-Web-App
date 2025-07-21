import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateBlogDto, userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const blog = this.blogRepo.create({ ...dto, author: user });
    return this.blogRepo.save(blog);
  }

  async findAllPublic() {
    return this.blogRepo.find({
      where: { isPublic: true },
      relations: ['author'],
    });
  }
  async findBlogsByUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.blogRepo.find({
      where: { author: { id: userId } },
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.blogRepo.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
  }

  async update(id: string, dto: UpdateBlogDto, userId: string) {
    const blog = await this.findOne(id);
    if (!blog || blog.author.id !== userId) throw new NotFoundException();
    Object.assign(blog, dto);
    return this.blogRepo.save(blog);
  }

  async remove(id: string, userId: string) {
    const blog = await this.findOne(id);
    if (!blog || blog.author.id !== userId) throw new NotFoundException();
    return this.blogRepo.remove(blog);
  }
}
