import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import cookieSession from 'cookie-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from '@/../config/typeorm-mysql-config';
import { User } from '@/entities/users.entity';
import { AppModule } from '@/app.module';

describe('AuthController (e2e)', () => {
  const newUserInput: Partial<User> = {
    username: 'newUser1',
    email: 'newUser1@email.com',
    password: 'newUser1Password',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [mysqlConfig],
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            configService.get('database'),
          dataSourceFactory: (options) => new DataSource(options).initialize(),
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieSession({ name: 'session', keys: ['key1'] }));
    await app.init();

    // before all, clear all tables
    const dataSource = app.get(DataSource);
    // const entities = dataSource.entityMetadatas;
    // for (const entity of entities) {
    //   const repository = dataSource.getRepository(entity.name);
    //   await repository.query(`DROP FROM ${entity.tableName}`);
    // }
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.createQueryBuilder().delete().execute();
    }
  });

  afterEach(async () => {
    // after each, clear all tables
    const dataSource = app.get(DataSource);
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.createQueryBuilder().delete().execute();
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST: /auth/signup', () => {
    it('with valid input, return 201 Created and res.body has {id, username, email} info', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUserInput)
        .expect(201);

      // console.log(`response body: ${JSON.stringify(response.body)}`);

      expect(response.body).toEqual(
        expect.objectContaining<Partial<User>>({
          id: expect.any(Number),
          username: newUserInput.username,
          email: newUserInput.email,
        }),
      );
    });
  });

  describe('POST: /auth/login', () => {
    it('with valid input, return 200 OK and res.body has {id, username, email} info ', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUserInput)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: newUserInput.email, password: newUserInput.password })
        .expect(200);

      // console.log(`response body: ${JSON.stringify(response.body)}`);
      // response body: {"id":14,"username":"newUser1","email":"newUser1@email.com"}

      expect(response.body).toEqual(
        expect.objectContaining<Partial<User>>({
          id: expect.any(Number),
          username: newUserInput.username,
          email: newUserInput.email,
        }),
      );
    });
  });
});
