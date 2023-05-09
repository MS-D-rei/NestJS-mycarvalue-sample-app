import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationTest1683617804310 implements MigrationInterface {
  name = 'MigrationTest1683617804310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD \`approved\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`approved\``);
  }
}
