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

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.userRepository.update(id, updateUserDto);

        return await this.findOne(id);
    }

    async softDelete(id: number) {
        await this.userRepository.update(id, {
            deletedAt: new Date(),
        });

        return await this.findOne(id);
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

    async postList(id: number){
        const postList = await this.postRepository.find({
            where: { user: { id } },
            relations: ['user'],
        });
        if (postList.length == 0) {
            throw new NotFoundException('작성한 글이 없습니다.');
        }

        return postList;
    }

    async commentList(id: number){
        const commentList = await this.commentRepository.find({
            where: { user: { id } },
            relations: ['user'],
        });
        if (commentList.length == 0) {
            throw new NotFoundException('작성한 댓글이 없습니다.');
        }

        return commentList;
    }
}
