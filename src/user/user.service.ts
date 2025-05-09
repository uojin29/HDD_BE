import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileUserDto } from './dto/profile-user.dto';
import { Post } from 'src/post/entity/post.entity';
import { Comment } from 'src/comment/entity/comment.entity';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (!existingUser || existingUser.deletedAt != null) {
            // 새로운 유저거나 탈퇴한 유저인 경우

            // password 암호화
            const bcrypt = require('bcryptjs');
            const saltRounds = 10;

            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

            createUserDto.password = hashedPassword;

            const user = this.userRepository.create(createUserDto);
            return await this.userRepository.save(user);
        }
        else
            throw new NotFoundException('이미 존재하는 유저입니다.');
    }

    // 모든 유저 조회(삭제된 유저 포함)
    async findAll() {
        return await this.userRepository.find({
            withDeleted: true,
        });
    }

    async update(userId: number, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(userId, updateUserDto);

        return await this.findOne(userId);
    }

    async softDelete(userId: number) {
        if (!userId) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }

        await this.userRepository.update(userId, {
            deletedAt: new Date(),
        });


        return ('탈퇴 완료되었습니다.');
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }

        return user;
    }

    async profile(id: number){
        const user = await this.findOne(id);
        const userProfile = new ProfileUserDto();

        userProfile.name = user.name;
        userProfile.nickname = user.nickname;

        return userProfile;
    }

    async postList(userId: number){
        const postList = await this.postRepository.find({
            where: { user: { id:userId } },
            relations: ['user'],
        });
        if (postList.length == 0) {
            throw new NotFoundException('작성한 글이 없습니다.');
        }

        return postList;
    }

    async commentList(userId: number){
        const commentList = await this.commentRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
            withDeleted: true,
        });

        if (commentList.length == 0) {
            throw new NotFoundException('작성한 댓글이 없습니다.');
        }

        // comment의 commentId가 null이면 content를 변경, 그 외에는 제거
        for (let i = 0; i < commentList.length; i++) {
            if (commentList[i].deletedAt != null && commentList[i].commentId != null) {
                commentList[i].content = '이미 삭제된 댓글입니다.';
            }
            else if (commentList[i].deletedAt != null && commentList[i].commentId == null){
                commentList.splice(i, 1);
                i--;
            }
        }
        return commentList;
    }
}
