import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    // 알림 확인하기
    @Patch(':id/read')
    @UseGuards(AuthGuard('jwt'))
    read(@Req() req: any, @Param('id') id: number) {
        const userId = req.user.userId;
        return this.notificationService.read(userId, id);
    }

    // 확인한 알림 목록
    @Get('/read')
    @UseGuards(AuthGuard('jwt'))
    findRead(@Req() req: any) {
        const userId = req.user.userId;
        return this.notificationService.findReadStatus(userId, true);
    }

    // 미확인 알림 목록
    @Get('/unread')
    @UseGuards(AuthGuard('jwt'))
    findUnread(@Req() req: any) {
        const userId = req.user.userId;
        return this.notificationService.findReadStatus(userId, false);
    }
}
