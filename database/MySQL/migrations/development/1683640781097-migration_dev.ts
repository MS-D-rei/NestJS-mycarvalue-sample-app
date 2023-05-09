import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationDev1683640781097 implements MigrationInterface {
  name = 'MigrationDev1683640781097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
  }
}
