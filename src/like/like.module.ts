import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../user/entity/user.entity";
import {Like} from "./entity/like.entity";
import {Post} from "../post/entity/post.entity";
import {LikeController} from "./like.controller";
import {LikeService} from "./like.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Like]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Post]),
    ],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
