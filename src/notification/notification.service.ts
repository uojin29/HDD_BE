import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';


@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async read(userId: number, id: number) {
    const notifications = await this.notificationRepository.find({
      where: {
        id: id,
        user: { id: userId },
        isRead: false,
        deletedAt: IsNull(),
      },
      relations: ['user'],
    });

    if (notifications.length === 0) {
      throw new NotFoundException('읽지 않은 알림이 없습니다.');
    }

    notifications.forEach(notification => {
      notification.isRead = true;
    });

    await this.notificationRepository.save(notifications);

    return notifications;
  }

  async findReadStatus(userId: number, status: boolean) {
    const notifications = await this.notificationRepository.find({
      where: {
        user: { id: userId },
        isRead: status,
        deletedAt: IsNull(),
      },
      relations: ['user'],
    });

    if (notifications.length === 0) {
      throw new NotFoundException('알림이 없습니다.');
    }

    return notifications;
  }
}
