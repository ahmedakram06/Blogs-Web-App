import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 👇 Create Express-compatible Nest app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // ✅ Serve static files (for uploaded images)
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // ✅ Apply validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
void bootstrap();
