import { PostListDto } from "./post-list.dto";

export class PostSearchDto extends PostListDto {
  title: string;
  content: string;
  nickname: string;
}