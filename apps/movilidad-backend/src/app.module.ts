import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
import { AuthModule } from 'apps/auth/src/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from 'apps/auth/src/auth.controller';
import { AuthService } from '../../auth/src/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      { name: 'USERS_SERVICE', transport: Transport.TCP },
    ]),
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
