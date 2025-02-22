import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: { username: string; password: string }) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return this.authService.login(user);
    }

    // Signup route for user registration
    @Post('signup')
    async signup(@Body() signupDto: { username: string; password: string }) {
        try {
            const newUser = await this.authService.signup(signupDto.username, signupDto.password);
            return { message: 'User registered successfully', user: newUser };
        } catch (error) {
            return { message: error.message };
        }
    }
}
