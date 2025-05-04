import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {User} from "../../user/entity/user.entity";
import {Comment} from "../../comment/entity/comment.entity";

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    likeCount: number;

    @Column()
    commentCount: number;

    @Column()
    viewCount: number;

    @Column({nullable: true})
    filePath: string;
}
