import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {Post} from "../../post/entity/post.entity";
import {Comment} from "../../comment/entity/comment.entity";
import {Notification} from "../../notification/entity/notification.entity";
import { Auth } from 'src/auth/entity/auth.entity';


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Auth, (auth) => auth.user)
    auths: Auth[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    nickname: string;

    @Column()
    password: string;
}
