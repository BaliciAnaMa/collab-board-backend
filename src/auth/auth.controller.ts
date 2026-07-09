import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  inregistrare(@Body() dto: RegisterDto) {
    // Trimitem tot obiectul dto către service
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: RegisterDto) {
    return this.authService.login(dto);
  }
}
