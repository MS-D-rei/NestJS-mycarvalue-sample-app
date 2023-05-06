import { DataSource } from 'typeorm';
import { Report } from '@/reports/reports.entity';
import { User } from '@/users/users.entity';

const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MYSQL_DATABASE,
  entities: [User, Report],
  synchronize: false,
  migrations: [__dirname + 'database/MySQL/migrations/test/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm_test',
});

export default MysqlDataSource;
