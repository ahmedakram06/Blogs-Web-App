import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID()
  blogId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string; // for nested replies
}
