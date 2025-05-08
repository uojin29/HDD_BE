import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {Post} from "./entity/post.entity";
import {User} from "../user/entity/user.entity";
import { PostListDto } from './dto/post-list.dto';
import { TitleSearchDto } from './dto/title-search.dto';
import { ContentSearchDto } from './dto/content-search.dto';
import { NicknameSearchDto } from './dto/nickname-search.dto';
import { PostSearchDto } from './dto/post-search.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(userId: number, createPostDto: CreatePostDto, file: Express.Multer.File) {
        const user = await this.findUserByUserId(userId);

        // 파일이 존재하는 경우
        if (file) {
            createPostDto.filePath = file.path;
        }

        const post = this.postRepository.create(createPostDto);
        post.user = user;
        post.likeCount = 0;
        post.commentCount = 0;
        post.viewCount = 0;
        post.filePath = file ? file.path : '';

        return await this.postRepository.save(post);
    }

    // 모든 게시물 조회(삭제된 게시물 포함)
    async findAll() {
        return await this.postRepository.find({
            withDeleted: true,
        });
    }

    async update(userId: number, id: number, updatePostDto: UpdatePostDto) {
        const user = await this.findUserByUserId(userId);
        const post = await this.findOne(id);

        if (post.user.id != user.id) {
            throw new NotFoundException('작성자만 수정 가능합니다.');
        }
        const { ...updateData } = updatePostDto;
        await this.postRepository.update(id, updateData);

        return await this.findOne(id);
    }

    async softDelete(userId: number, id: number) {
        const user = await this.findUserByUserId(userId);
        const post = await this.findOne(id);

        if (post.user.id != user.id) {
            throw new NotFoundException('작성자만 삭제 가능합니다.');
        }
        await this.postRepository.update(id, {
            deletedAt: new Date(),
        });

        return ('게시물이 삭제되었습니다.');
    }

    async findOne(id: number) {
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

    // viewCount 1 증가
    async increaseViewCount(id: number) {
        const post = await this.findOne(id);
        post.viewCount += 1;
        await this.postRepository.save(post);

        return post;
    }

    // 게시물 목록 조회
    async findPostList(postListDto: PostListDto) {
        const where = {
            deletedAt: IsNull(),
        };

        return this.paginate(postListDto, where);
    }

    async searchByTitle(titleSearchDto: TitleSearchDto) {
        const where = {
            title: titleSearchDto.title,
            deletedAt: IsNull(),
        };

        return this.paginate(titleSearchDto, where);
    }

    async searchByContent(contentSearchDto: ContentSearchDto) {
        const where = {
            content: contentSearchDto.content,
            deletedAt: IsNull(),
        };

        return this.paginate(contentSearchDto, where);
    }

    async searchByNickname(nicknameSearchDto: NicknameSearchDto) {
        const where = {
            user: { nickname: nicknameSearchDto.nickname },
            deletedAt: IsNull(),
        };

        return this.paginate(nicknameSearchDto, where);
    }

    async searchAll(postSearchDto: PostSearchDto) {
        const where = {
            deletedAt: IsNull(),
            title: postSearchDto.title,
            content: postSearchDto.content,
            user: { nickname: postSearchDto.nickname },
        };

        return this.paginate(postSearchDto, where);
    }

    async paginate(postListDto: PostListDto, where: any) {
        const {
            page = 1,
            limit = 10,
            orderBy = 'createdAt',
            order = 'DESC',
        } = postListDto;

        const [data, total] = await this.postRepository.findAndCount({
            where,
            relations: ['user'],
            order: {
                [orderBy]: order,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        if(!data || data.length === 0) {
            throw new NotFoundException('존재하지 않는 게시물입니다.');
        }

        return {
            data,
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        };
    }
}
