import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { setupGlobal } from '@/utils/setupGlobal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // move to module
  // app.use(
  //   cookieSession({
  //     name: 'session',
  //     keys: ['key1'],
  //   }),
  // );
  setupGlobal(app);
  await app.listen(3000);
}
bootstrap();
