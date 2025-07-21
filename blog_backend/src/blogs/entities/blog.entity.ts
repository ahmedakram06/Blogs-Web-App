import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, (user) => user.blogs, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
