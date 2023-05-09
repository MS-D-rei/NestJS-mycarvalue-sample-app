import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationDev1683617797062 implements MigrationInterface {
  name = 'MigrationDev1683617797062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD \`approved\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`approved\``);
  }
}
