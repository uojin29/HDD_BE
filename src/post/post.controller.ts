import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PostListDto } from './dto/post-list.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TitleSearchDto } from './dto/title-search.dto';
import { ContentSearchDto } from './dto/content-search.dto';
import { NicknameSearchDto } from './dto/nickname-search.dto';
import { PostSearchDto } from './dto/post-search.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    // 게시물 추가
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.userId;
        return this.postService.create(userId, createPostDto, file);
    }

    // 게시물 목록 조회
    @Get('/postList')
    findPostList(@Query() postListDto: PostListDto) {
        return this.postService.findPostList(postListDto);
    }

    // 모든 게시물 조회
    @Get()
    findAll(@Req() req: any) {
        return this.postService.findAll();
    }

    // 게시물 조회
    @Get(':id')
    increaseViewCount(@Param('id') id: number) {
        return this.postService.increaseViewCount(id);
    }

    // 게시물 수정
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Req() req: any, @Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
        const userId = req.user.userId;
        return this.postService.update(userId, id, updatePostDto);
    }

    // 게시물 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch(':id/delete')
    @UseGuards(AuthGuard('jwt'))
    softDelete(@Req() req: any, @Param('id') id: number) {
        const userId = req.user.userId;
        return this.postService.softDelete(id, userId);
    }

    // 제목으로 게시물 검색
    @Get('/search/title')
    searchByTitle(@Body() titleSearchDto: TitleSearchDto) {
        return this.postService.searchByTitle(titleSearchDto);
    }

    // 내용으로 게시물 검색
    @Get('/search/content')
    searchByContent(@Body() contentSearchDto: ContentSearchDto) {
        return this.postService.searchByContent(contentSearchDto);
    }

    // 작성자 닉네임으로 게시물 검색
    @Get('/search/nickname')
    searchByNickname(@Body() nicknameSearchDto: NicknameSearchDto) {
        return this.postService.searchByNickname(nicknameSearchDto);
    }

    // 제목/내용/닉네임으로 게시물 검색
    @Get('/search/all')
    searchAll(@Body() postSearchDto: PostSearchDto) {
        return this.postService.searchAll(postSearchDto);
    }
}
