import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {User} from "../../user/entity/user.entity";
import {Post} from "../../post/entity/post.entity";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post

    @Column()
    content: string;

    @Column({nullable: true})
    commentId: number;
}
