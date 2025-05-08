import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import {CreateLikeDto} from "./dto/create-like.dto";
import {LikeService} from "./like.service";
import {DeleteLikeDto} from "./dto/delete-like.dto";
import { AuthGuard } from '@nestjs/passport';

@Controller('likes')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    // 좋아요 추가
    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Req() req: any, @Body() createLikeDto: CreateLikeDto) {
        const userId = req.user.userId;
        return this.likeService.create(userId, createLikeDto);
    }

    // 게시물 내 좋아요 수
    @Get(':id')
    increaseViewCount(@Param('id') postId: number) {
        return this.likeService.countLikesByPostId(postId);
    }

    // 좋아요 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch('/delete')
    @UseGuards(AuthGuard('jwt'))
    softDelete(@Req() req: any, @Body() deleteLikeDto: DeleteLikeDto) {
        const userId = req.user.userId;
        return this.likeService.softDelete(userId, deleteLikeDto);
    }
}
