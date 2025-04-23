import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('VeDi Auth')
@Controller('auth/vedi')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  @ApiOperation({ summary: 'Decodifica token de VeDi y genera un token JWT propio' })
  @ApiQuery({ name: 'token', required: true })
  @ApiResponse({ status: 200, description: 'Token generado y userVedi decodificado' })
  async obtenerTokenDesdeVedi(@Query('token') vediToken: string) {
    const result = await this.authService.generarTokenDesdeVedi(vediToken);
    return {
      success: true,
      ...result,
    };
  }
}
