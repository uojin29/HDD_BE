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

    async create(userId: number, createLikeDto: CreateLikeDto) {
        const user = await this.findUserByUserId(userId);
        const post = await this.findPostByPostId(createLikeDto.postId);

        // 데이터가 존재하고 deletedAt이 null인 경우
        const existingLike = await this.likeRepository.findOne({
            where: {
                user: { id: user.id },
                post: { id: post.id },
                deletedAt: IsNull(),
            },
            relations: ['user', 'post'],
        });

        if (existingLike) {
            throw new NotFoundException('이미 좋아요를 눌렀습니다.');
        }

        post.likeCount += 1;
        await this.postRepository.save(post);

        const like = this.likeRepository.create({
            user,
            post,
        });

        return await this.likeRepository.save(like);
    }

    async softDelete(userId: number, deleteLikeDto: DeleteLikeDto) {
        const user = await this.findUserByUserId(userId);
        const post = await this.findPostByPostId(deleteLikeDto.postId);
        const like = await this.findOne(user, post);

        await this.likeRepository.update( like.id, {
            deletedAt: new Date(),
        });

        post.likeCount -= 1;
        await this.postRepository.save(post);

        return ('좋아요가 취소되었습니다.');
    }

    async findOne(user: User, post: Post) {
        const like = await this.likeRepository.findOne({
            where: {
                user: { id: user.id },
                post: { id: post.id },
                deletedAt: IsNull()
            },
            relations: ['user', 'post'],
        });
        if (!like) {
            throw new NotFoundException('존재하지 않는 좋아요입니다.');
        }

        return like;
    }

    async findUserByUserId(userId: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
                deletedAt: IsNull()
            },
        });
        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }

        return user;
    }

    async findPostByPostId(postId: number) {
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
                deletedAt: IsNull()
            },
        });
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        return post;
    }

    async countLikesByPostId(postId: number) {
        const post = await this.findPostByPostId(postId);

        return post.likeCount;
    }
}
