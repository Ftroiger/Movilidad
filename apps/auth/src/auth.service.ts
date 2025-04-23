import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly vediUrl: string;
  private readonly vediSecret: string;
  private readonly jwtSecretKey: string;
  private readonly jwtAlgorithm: jwt.Algorithm;
  private readonly jwtExpiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.vediUrl = this.configService.get<string>('VEDI_URL')!;
    this.vediSecret = this.configService.get<string>('VEDI_SECRET')!;
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY')!;
    this.jwtAlgorithm = this.configService.get<string>('JWT_ALGORITHM') as jwt.Algorithm;
    this.jwtExpiresIn = this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRE_MINUTES')!;
  }

  /**
   * Intercambia un sesionId por un token JWT de VeDi
   */
  async validarTokenSesion(sesionId: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const url = `${this.vediUrl}/v1/Usuario/ValidarTokenSesion`;
      const response = await axios.post(url, {
        apiKey: this.vediSecret,
        sesionId,
        permisoComunicacion: false,
      });

      if (!response.data.ok || !response.data.return?.token) {
        throw new UnauthorizedException('Sesión inválida con VeDi');
      }

      return {
        token: response.data.return.token,
        refreshToken: response.data.return.refreshToken,
      };
    } catch (error) {
      console.error('[VeDi] Error al validar sesión:', error.response?.data || error.message);
      throw new InternalServerErrorException('No se pudo validar la sesión con VeDi');
    }
  }

  /**
   * Decodifica un token de VeDi y genera un JWT propio sin roles ni gestor
   */
  async generarTokenDesdeVedi(vediToken: string): Promise<{ token: string; userVedi: any }> {
    try {
      // Verificar el token de VeDi (firmado por la misma app en STAGE)
      const userVedi: any = jwt.verify(vediToken, this.jwtSecretKey, {
        algorithms: [this.jwtAlgorithm],
      });

      const data = userVedi?.data;
      const cuil = data?.representadoSeleccionado?.cuilCuit || data?.cuil;
      const cuil_representante =
        data?.representadoSeleccionado?.cuilCuit !== data?.cuil
          ? data?.cuil
          : null;

      const payload = {
        sub: cuil,
        cuil,
        cuil_representante,
      };

      const signOptions: jwt.SignOptions = {
        algorithm: this.jwtAlgorithm,
        expiresIn: this.jwtExpiresIn * 60, // Convertir minutos a segundos
      };

      const token = jwt.sign(payload, this.jwtSecretKey, signOptions);

      return {
        token,
        userVedi,
      };
    } catch (error) {
      console.error('[JWT] Error al procesar token de VeDi:', error.message);
      throw new UnauthorizedException('El token de VeDi no es válido o ha expirado');
    }
  }
}
