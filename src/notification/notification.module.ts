import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entity/notification.entity';
import { Post } from '../post/entity/post.entity';
import { Comment } from '../comment/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Comment])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
