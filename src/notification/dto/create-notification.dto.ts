export class CreateNotificationDto {
  isRead: boolean;
  type: string;
  postId: number;
  commentId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}