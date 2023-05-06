import { registerAs } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Report, User } from '@/entities';

export default registerAs('database', (): MysqlConnectionOptions => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_MYSQL_DATABASE,
        entities: [User, Report],
        synchronize: false,
        migrations: [
          __dirname + 'database/MySQL/migrations/development/*{.ts,.js}',
        ],
        migrationsTableName: 'migrations_typeorm_dev',
      };
    case 'test':
      return {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3307,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_MYSQL_DATABASE,
        entities: [User, Report],
        synchronize: false,
        migrations: [__dirname + 'database/MySQL/migrations/test/*{.ts,.js}'],
        migrationsTableName: 'migrations_typeorm_test',
      };
  }
});

// return {
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10) || 3306,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_MYSQL_DATABASE,
//   // entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   entities: [User, Report],
//   synchronize: false,
//   migrations:
//     process.env.DB_PORT === '3306'
//       ? [__dirname + 'database/MySQL/migrations/development/*{.ts,.js}']
//       : [__dirname + 'database/MySQL/migrations/test/*{.ts,.js}'],
//   migrationsTableName:
//     process.env.DB_PORT === '3306'
//       ? 'migrations_typeorm_dev'
//       : 'migrations_typeorm_test',
// };
