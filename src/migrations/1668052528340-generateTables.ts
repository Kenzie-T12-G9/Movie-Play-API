import { MigrationInterface, QueryRunner } from 'typeorm';

export class generateTables1668052528340 implements MigrationInterface {
  name = 'generateTables1668052528340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Movies" ALTER COLUMN "isActive" SET DEFAULT true`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Movies" ALTER COLUMN "isActive" DROP DEFAULT`
    );
  }
}
