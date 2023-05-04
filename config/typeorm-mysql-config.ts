import { registerAs } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Report } from '@/reports/reports.entity';
import { User } from '@/users/users.entity';

export default registerAs(
  'database',
  (): MysqlConnectionOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    entities: [User, Report],
    synchronize: false,
    migrations:
      process.env.DB_PORT === '3306'
        ? [__dirname + 'database/MySQL/migrations/development/*{.ts,.js}']
        : [__dirname + 'database/MySQL/migrations/test/*{.ts,.js}'],
    migrationsTableName:
      process.env.DB_PORT === '3306'
        ? 'migrations_typeorm_dev'
        : 'migrations_typeorm_test',
  }),
);

// export default () => ({
//   database: {
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT, 10) || 3306,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_MYSQL_DATABASE,
//     databaseName: process.env.DB_NAME,
//   },
// });
