import {Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import {User} from "../../user/entity/user.entity";
import {Post} from "../../post/entity/post.entity";

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @ManyToOne(() => Post, (post) => post.id)
    post: Post

    // isWriter로 작성자를 따로 저장할지 고민해보기
}
