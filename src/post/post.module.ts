import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {Post} from "./entity/post.entity";
import {User} from "../user/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post]),
        TypeOrmModule.forFeature([User])],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
