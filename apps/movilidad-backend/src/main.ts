import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API VeDi Integración')
    .setDescription('Documentación de la API que integra VeDi')
    .setVersion('1.0')
    .addBearerAuth() // Si usás JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
