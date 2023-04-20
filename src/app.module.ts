import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/users/users.module';
import { User } from '@/users/users.entity';
import { ReportsModule } from '@/reports/reports.module';
import mysqlConfig from 'mysql-configuration';
import { Report } from '@/reports/reports.entity';
import { AuthModule } from './auth/auth.module';

console.log(process.env.DB_PORT);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mysqlConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Report],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
