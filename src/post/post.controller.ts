import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    // 게시물 추가
    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto);
    }

    // 모든 게시물 조회
    @Get()
    findAll() {
        return this.postService.findAll();
    }

    // 게시물 조회
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.postService.findOne(id);
    }

    // 게시물 수정
    @Patch(':id')
    update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(id, updatePostDto);
    }

    // 게시물 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch(':id/delete')
    softDelete(@Param('id') id: number, @Body('userId') userId: number) {
        return this.postService.softDelete(id, userId);
    }
}
