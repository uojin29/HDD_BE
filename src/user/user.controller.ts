import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 새로운 유저 추가
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    // 모든 유저 조회
    @Get()
    findAll() {
        return this.userService.findAll();
    }



    // 유저 정보 수정
    @Patch()
    @UseGuards(AuthGuard('jwt'))
    update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
        console.log(req)
        const userId = req.user.userId;
        console.log(userId);
        console.log(updateUserDto);
        return this.userService.update(userId, updateUserDto);
    }

    // 유저 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch('/delete')
    @UseGuards(AuthGuard('jwt'))
    softDelete(@Req() req: any) {
        const userId = req.user.userId;
        return this.userService.softDelete(userId);
    }

    // 다른 유저의 프로필 조회 (Response로 profileUserDto 반환)
    @Get(':id/profile')
    profile(@Param('id') id: number){
        return this.userService.profile(id);
    }

    // 자신이 작성한 글 목록 조회
    // postList를 반환할 때 user의 정보를 함께 반환할 것인지? postListDto를 만들어야 할지 고민해보기
    @Get('/postList')
    @UseGuards(AuthGuard('jwt'))
    postList(@Req() req: any){
        const userId = req.user.userId;
        return this.userService.postList(userId);
    }

    // 자신이 작성한 댓글 목록 조회
    // commentList를 반환할 때 user의 정보를 함께 반환할 것인지? commentListDto를 만들어야 할지 고민해보기
    // 어떤 게시물에 대한 댓글인지도 함께 보여줄 것인가?
    @Get('/commentList')
    @UseGuards(AuthGuard('jwt'))
    commentList(@Req() req: any){
        const userId = req.user.userId;
        return this.userService.commentList(userId);
    }

    // 유저 조회
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }
}
