import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';

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

    // 유저 조회
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    // 유저 정보 수정
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    // 유저 삭제 (실제로 삭제가 아니라, delete_at을 현재 시간으로 업데이트)
    @Patch(':id/delete')
    softDelete(@Param('id') id: number) {
        return this.userService.softDelete(id);
    }

    // 다른 유저의 프로필 조회 (Response로 profileUserDto 반환)
    @Get(':id/profile')
    profile(@Param('id') id: number){
        return this.userService.profile(id);
    }

    // 자신이 작성한 글 목록 조회
    // postList를 반환할 때 user의 정보를 함께 반환할 것인지? postListDto를 만들어야 할지 고민해보기
    @Get(':id/postList')
    postList(@Param('id') id: number){
        return this.userService.postList(id);
    }

    // 자신이 작성한 댓글 목록 조회
    // commentList를 반환할 때 user의 정보를 함께 반환할 것인지? commentListDto를 만들어야 할지 고민해보기
    // 어떤 게시물에 대한 댓글인지도 함께 보여줄 것인가?
    @Get(':id/commentList')
    commentList(@Param('id') id: number){
        return this.userService.commentList(id);
    }
}
