import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setupGlobal = async (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, enableDebugMessages: true }),
  );
};
