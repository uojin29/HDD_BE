import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {User} from "../../user/entity/user.entity";

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.auths)
  @JoinColumn()
  user: User;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}
