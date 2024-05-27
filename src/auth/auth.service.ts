import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    const validUsername = this.configService.get<string>('AUTH_USERNAME');
    const validPassword = this.configService.get<string>('AUTH_PASSWORD');
    
    if (username === validUsername && password === validPassword) {
      return true;
    }
    return false;
  }

  async signIn(username: string, password: string): Promise<string> {
    if (await this.validateUser(username, password)) {
      const payload = { username };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '60m',
      });
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
