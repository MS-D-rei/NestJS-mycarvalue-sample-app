import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import cookieSession from 'cookie-session';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { ReportsModule } from '@/reports/reports.module';
import mysqlConfig from '@/../config/typeorm-mysql-config';
import { AuthModule } from '@/auth/auth.module';

console.log(process.env.DB_PORT);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mysqlConfig],
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
      dataSourceFactory: async (options: any) => {
        // console.log(`dataSourceFactory options: ${JSON.stringify(options)}`);
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          name: 'session',
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
