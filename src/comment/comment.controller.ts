import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // 댓글 추가
    @Post()
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(createCommentDto);
    }

    // 게시물 내 모든 댓글 조회
    @Get(':id')
    findByPostId(@Param('id') id: number) {
        return this.commentService.findCommentsByPostId(id);
    }

    // 댓글 수정
    @Patch(':id')
    update(@Param('id') id: number, @Body() updatePostDto: UpdateCommentDto) {
        return this.commentService.update(id, updatePostDto);
    }

    // 댓글 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch(':id/delete')
    softDelete(@Param('id') id: number, @Body('userId') userId: number) {
        return this.commentService.softDelete(id, userId);
    }
}
