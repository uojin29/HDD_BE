export class PostListDto{
  page: number;
  limit: number;
  orderBy?: 'createdAt' | 'likeCount';
  order?: 'ASC' | 'DESC';
}