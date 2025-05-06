import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { Post } from '../post/entity/post.entity';
import { Comment } from '../comment/entity/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Post]),
        TypeOrmModule.forFeature([Comment])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
