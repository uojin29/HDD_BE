import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from 'src/user/entity/user.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User

  @Column()
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;
}
