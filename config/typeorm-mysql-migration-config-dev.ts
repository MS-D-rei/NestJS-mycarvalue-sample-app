import { DataSource } from 'typeorm';
import { Report, User } from '@/entities';
import { MigrationDev1683365063141 } from '@/../database/MySQL/migrations/development';

// console.log(__dirname + '/database/MySQL/migrations/development/');

const MysqlDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MYSQL_DATABASE,
  entities: [User, Report],
  synchronize: false,
  // migrations: [__dirname + '/database/MySQL/migrations/development/*.ts'],
  migrations: [MigrationDev1683365063141],
  migrationsTableName: 'migrations_mysql_dev',
});

export default MysqlDataSource;
