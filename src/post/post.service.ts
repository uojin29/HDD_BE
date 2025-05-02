import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {Post} from "./entity/post.entity";
import {User} from "../user/entity/user.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

    ) {}

    async create(createPostDto: CreatePostDto) {
        const user = await this.userRepository.findOne({
            where: { id: createPostDto.userId },
        });
        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }
        const post = this.postRepository.create(createPostDto);
        post.user = user;
        post.likeCount = 0;
        post.commentCount = 0;
        post.viewCount = 0;
        return await this.postRepository.save(post);
    }

    // 모든 게시물 조회(삭제된 게시물 포함)
    async findAll() {
        return await this.postRepository.find({
            withDeleted: true,
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const user = await this.findUserByUserId(updatePostDto.userId);

        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }
        if (post.user.id != user.id) {
            throw new NotFoundException('작성자만 수정 가능합니다.');
        }
        const { userId, ...updateData } = updatePostDto;
        return await this.postRepository.update(id, updateData);
    }

    async softDelete(id: number, userId: number) {
        const user = await this.findUserByUserId(userId);
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }
        if (post.user.id != user.id) {
            throw new NotFoundException('작성자만 삭제 가능합니다.');
        }
        return await this.postRepository.update(id, {
            deletedAt: new Date(),
        });
    }

    async findOne(id: number) {
        const post = await this.postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        post.viewCount += 1;
        await this.postRepository.save(post);

        return post;
    }

    async findUserByUserId(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }
        return user;
    }
}
