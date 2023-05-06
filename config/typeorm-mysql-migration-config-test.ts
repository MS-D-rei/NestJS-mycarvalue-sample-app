import { DataSource } from 'typeorm';
import { Report, User } from '@/entities';
import { MigrationTest1683367319178 } from 'database/MySQL/migrations/test';

const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MYSQL_DATABASE,
  entities: [User, Report],
  synchronize: false,
  // migrations: [__dirname + '/database/MySQL/migrations/test/*.ts'],
  migrations: [MigrationTest1683367319178],
  migrationsTableName: 'migrations_mysql_test',
});

export default MysqlDataSource;
