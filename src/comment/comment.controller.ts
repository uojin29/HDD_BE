import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // 댓글 추가
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
        const userId = req.user.userId;
        return this.commentService.create(userId, createCommentDto);
    }

    // 게시물 내 모든 댓글 조회
    @Get(':id')
    findByPostId(@Param('id') id: number) {
        return this.commentService.findCommentsByPostId(id);
    }

    // 댓글 수정
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Req() req: any, @Param('id') id: number, @Body() updatePostDto: UpdateCommentDto) {
        const userId = req.user.userId;
        return this.commentService.update(userId, id, updatePostDto);
    }

    // 댓글 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch(':id/delete')
    @UseGuards(AuthGuard('jwt'))
    softDelete(@Req() req: any, @Param('id') id: number) {
        const userId = req.user.userId;
        return this.commentService.softDelete(id, userId);
    }
}
