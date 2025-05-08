import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {Post} from "./entity/post.entity";
import {User} from "../user/entity/user.entity";
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        TypeOrmModule.forFeature([User]),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadDir = './uploads';
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir);
                    }
                    cb(null, uploadDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + file.originalname;
                    cb(null, uniqueSuffix);
                },
            }),
        }),
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
