import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationDev1683365063141 implements MigrationInterface {
  name = 'MigrationDev1683365063141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`report\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`make\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`year\` int NOT NULL, \`longitude\` int NOT NULL, \`latitude\` int NOT NULL, \`mileage\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_e347c56b008c2057c9887e230aa\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_e347c56b008c2057c9887e230aa\``,
    );
    await queryRunner.query(`DROP TABLE \`report\``);
  }
}
