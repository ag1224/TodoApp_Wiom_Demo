import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtPassportStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'your-secret-key', // Same key used in JwtModule
        });
    }

    async validate(payload: any) {
        // You can perform additional checks if necessary, e.g., checking user existence
        return { userId: payload.sub, username: payload.username };
    }
}
