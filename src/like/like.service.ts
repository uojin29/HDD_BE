import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptionsWhere, IsNull, Repository} from 'typeorm';
import {Like} from './entity/like.entity';
import {Post} from "../post/entity/post.entity";
import {User} from "../user/entity/user.entity";
import {CreateLikeDto} from "./dto/create-like.dto";
import {DeleteLikeDto} from "./dto/delete-like.dto";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private likeRepository: Repository<Like>,

        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createLikeDto: CreateLikeDto) {
        const user = await this.userRepository.findOne({
            where: { id: createLikeDto.userId },
        });
        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }
        const post = await this.postRepository.findOne({
            where: { id: createLikeDto.postId },
        });
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        // 데이터가 존재하고 deletedAt이 null인 경우
        const existingLike = await this.likeRepository.findOne({
            where: {
                user: {id: user.id},
                post: {id: post.id},
                deletedAt: IsNull(),
            } as FindOptionsWhere<Like>,
            relations: ['user', 'post'],
        });

        if (existingLike) {
            throw new NotFoundException('이미 좋아요를 눌렀습니다.');
        }

        const like = this.likeRepository.create({
            user,
            post,
        });

        return await this.likeRepository.save(like);
    }

    async softDelete(id: number, deleteLikeDto: DeleteLikeDto) {
        const post = await this.findPostByPostId(deleteLikeDto.postId);
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        const user = await this.findUserByUserId(deleteLikeDto.userId);
        if (user.id != user.id) {
            throw new NotFoundException('작성자만 취소 가능합니다.');
        }

        await this.likeRepository.update(id, {
            deletedAt: new Date(),
        });

        return await this.findOne(id);
    }

    async findOne(id: number) {
        const like = await this.likeRepository.findOne({
            where: { id },
            relations: ['user', 'post'],
        });

        if (!like) {
            throw new NotFoundException('존재하지 않는 좋아요입니다.');
        }

        return like;
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

    async findPostByPostId(postId: number) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        return post;
    }

    async countLikesByPostId(postId: number) {
        const post = await this.findPostByPostId(postId);

        return await this.likeRepository.count({
            where: {
                post: {id: post.id},
                deletedAt: IsNull(),
            } as FindOptionsWhere<Like>,
        });
    }
}
