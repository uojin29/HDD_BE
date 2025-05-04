import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {Post} from "../post/entity/post.entity";
import {User} from "../user/entity/user.entity";
import {Comment} from "./entity/comment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Comment]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
