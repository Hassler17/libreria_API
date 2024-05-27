import { Controller, Post, Body, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener un token de acceso' })
  @ApiBody({ schema: { properties: { username: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Token de acceso obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body('username') username: string, @Body('password') password: string) {
    try {
      const token = await this.authService.signIn(username, password);
      return { access_token: token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
