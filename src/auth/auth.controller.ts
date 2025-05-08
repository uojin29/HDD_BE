import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
    }

    @Get('/logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(@Req() req: any) {
        const userId = req.user.userId;
        return this.authService.logout(userId);
    }
}
