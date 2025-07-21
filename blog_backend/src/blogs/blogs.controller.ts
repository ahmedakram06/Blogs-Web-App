import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

interface UserRequest extends Request {
  user: {
    id: string;
  };
}

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @Request() req: UserRequest) {
    return this.blogsService.create(createBlogDto, req.user.id);
  }

  @Get('public')
  findAll() {
    return this.blogsService.findAllPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMyBlogs(@Request() req: UserRequest) {
    return this.blogsService.findBlogsByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @Request() req: UserRequest,
  ) {
    return this.blogsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: UserRequest) {
    return this.blogsService.remove(id, req.user.id);
  }
}
