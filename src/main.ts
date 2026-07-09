import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimină datele care nu sunt în DTO (securitate)
    forbidNonWhitelisted: true, // Trimite eroare dacă cineva trimite date în plus
    transform: true, // Convertește automat tipurile de date (ex: string la number)
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
