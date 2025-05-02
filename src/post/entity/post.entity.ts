import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {User} from "../../user/entity/user.entity";

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User

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
