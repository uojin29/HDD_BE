import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import {CreateLikeDto} from "./dto/create-like.dto";
import {LikeService} from "./like.service";
import {DeleteLikeDto} from "./dto/delete-like.dto";

@Controller('likes')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    // 게시물 추가
    @Post()
    create(@Body() createLikeDto: CreateLikeDto) {
        return this.likeService.create(createLikeDto);
    }

    // 게시물 내 좋아요 수
    @Get(':id')
    increaseViewCount(@Param('id') id: number) {
        return this.likeService.countLikesByPostId(id);
    }

    // 게시물 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch(':id/delete')
    softDelete(@Param('id') id: number, @Body() deleteLikeDto: DeleteLikeDto) {
        return this.likeService.softDelete(id, deleteLikeDto);
    }
}
