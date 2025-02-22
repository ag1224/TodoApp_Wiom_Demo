import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    // Simulating a user for demonstration (usually, you would use a database here)
    private readonly users = [
        {
            id: '1',
            username: 'user',
            password: '$2b$10$ykh1Ugfq1fzTeVJkbITXseS1//zjYOquHF7HmlJFl5j.0y.LmQQz6', // "password" hashed
        },
    ];

    async validateUser(username: string, password: string): Promise<any> {
        const user = this.users.find((u) => u.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signup(username: string, password: string) {
        const existingUser = this.users.find((user) => user.username === username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password before storing it

        const newUser = {
            id: (this.users.length + 1).toString(), // Generate a new ID for the user
            username,
            password: hashedPassword,
        };

        this.users.push(newUser);
        return newUser; // Return the new user (you can also return a success message if needed)
    }
}
