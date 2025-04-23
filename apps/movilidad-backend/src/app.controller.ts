import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../auth/src/auth.service'; // <-- ajustá según tu estructura real

@Controller('auth/vedi')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Intercambia un sesionId por el token de VeDi,
   * luego genera un JWT propio y devuelve ambos tokens + datos del usuario
   */
  @Post()
  async validarSesion(@Body('sesionId') sesionId: string) {
    return this.authService.validarTokenSesion(sesionId); // que internamente llama ambas funciones
  }

}
