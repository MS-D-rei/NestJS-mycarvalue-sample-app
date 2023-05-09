import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationTest1683640789106 implements MigrationInterface {
  name = 'MigrationTest1683640789106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
  }
}
