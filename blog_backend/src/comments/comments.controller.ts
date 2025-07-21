import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  Delete,
  //ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCommentDto, @Request() req: UserRequest) {
    return this.commentsService.create(dto, req.user.id);
  }

  // @Get('blog/:blogId')
  // findByBlog(@Param('blogId', ParseIntPipe) blogId: string) {
  //   return this.commentsService.findByBlog(blogId);
  // }

  @Get('blog/:blogId')
  findByBlog(@Param('blogId') blogId: string) {
    return this.commentsService.findByBlog(blogId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Request() req: UserRequest,
  ) {
    return this.commentsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: UserRequest) {
    return this.commentsService.remove(id, req.user.id);
  }
}
