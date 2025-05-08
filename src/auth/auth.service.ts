import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { User } from 'src/user/entity/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
      @InjectRepository(Auth)
      private authRepository: Repository<Auth>,

      @InjectRepository(User)
      private userRepository: Repository<User>,
    ) {}

    async login(loginAuthDto: LoginAuthDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginAuthDto.email},
        });

        if (!user) {
            throw new NotFoundException('존재하지 않는 유저입니다.');
        }

        const isPasswordMatched = await bcrypt.compare(loginAuthDto.password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        const payload = { sub: user.id };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });

        const existingAuth = await this.authRepository.findOne({
            where: {
                user: { id: user.id },
                deletedAt: IsNull()
            },
        });

        if (existingAuth) {
            existingAuth.accessToken = accessToken;
            existingAuth.refreshToken = refreshToken;
            await this.authRepository.save(existingAuth);
            return { accessToken, refreshToken };
        }

        await this.authRepository.save({ user, accessToken, refreshToken });
        return { accessToken, refreshToken };
    }

    async logout(userId: number) {
        const auth = await this.authRepository.findOne({
            where: { user: { id: userId} },
        });

        if (!auth) {
            throw new NotFoundException('로그인된 유저가 아닙니다.');
        }

        await this.authRepository.update(auth.id, {
            accessToken: '',
            refreshToken: '',
            deletedAt: new Date(),
        });

        return ('로그아웃 되었습니다.');
    }
}
