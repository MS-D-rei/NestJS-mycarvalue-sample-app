import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      name: 'session',
      keys: ['key1'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, enableDebugMessages: true }),
  );
  await app.listen(3000);
}
bootstrap();
