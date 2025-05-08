import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {User} from "../user/entity/user.entity";
import {Post} from "../post/entity/post.entity";
import {Comment} from "./entity/comment.entity";
import {Notification} from "../notification/entity/notification.entity";
import {NotificationType} from "../notification/enum/notification-type.enum";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    async create(userId: number, createCommentDto: CreateCommentDto) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }
        const post = await this.postRepository.findOne({
            where: {
                id: createCommentDto.postId,
                deletedAt: IsNull()
            },
            relations: ['user'],
        });
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }
        const comment = this.commentRepository.create(createCommentDto);
        comment.user = user;
        comment.post = post;

        post.commentCount += 1;
        await this.postRepository.save(post);

        // 댓글 작성자와 게시물 작성자가 다를 경우 알림 생성
        if (user.id != post.user.id) {
            const notification = this.notificationRepository.create({
                user: post.user,
                isRead: false,
                type: NotificationType.COMMENT,
            });
            await this.notificationRepository.save(notification);
        }

        return await this.commentRepository.save(comment);
    }

    // 게시물 내 모든 댓글 조회
    async findCommentsByPostId(postId: number) {
        const post = await this.findPost(postId);
        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        const comments = await this.commentRepository.find({
            where: { post: { id: postId } } ,
            relations: ['post'],
        });

        if(comments.length == 0) {
            throw new NotFoundException('댓글이 존재하지 않습니다');
        }
        return comments;
    }

    async update(userId: number, id: number, updateCommentDto: UpdateCommentDto) {
        const user = await this.findUserByUserId(userId);
        const post = await this.findPost(updateCommentDto.postId);

        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }
        if (post.user.id != user.id) {
            throw new NotFoundException('작성자만 수정 가능합니다.');
        }
        const { postId,...updateData } = updateCommentDto;
        await this.commentRepository.update(id, updateData);

        return await this.commentRepository.findOne({ where: { id } });
    }

    async softDelete(userId: number, id: number) {
        const user = await this.findUserByUserId(userId);
        const comment = await this.findOne(id);
        const post = await this.postRepository.findOne({
            where: { id: comment.post.id },
        });

        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }
        if (comment.user.id != user.id) {
            throw new NotFoundException('작성자만 삭제 가능합니다.');
        }
        await this.commentRepository.update(id, {
            deletedAt: new Date(),
        });

        post.commentCount -= 1;
        await this.postRepository.save(post);

        return ('댓글이 삭제되었습니다.');
    }

    async findPost(id: number) {
        const post = await this.postRepository.findOne({
            where: {
                id: id,
                deletedAt: IsNull()
            },
            relations: ['user'],
        });

        if (!post) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        await this.postRepository.save(post);

        return post;
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

    async findOne(id: number) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: id,
                deletedAt: IsNull()
            },
            relations: ['user', 'post'],
        });

        if (!comment) {
            throw new NotFoundException('존재하지 않는 댓글입니다.');
        }

        return comment;
    }
}
