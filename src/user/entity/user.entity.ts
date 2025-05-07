import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {Post} from "../../post/entity/post.entity";
import {Comment} from "../../comment/entity/comment.entity";


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    nickname: string;

    @Column()
    password: string;
}
