import { MigrationInterface, QueryRunner } from "typeorm";

export class generateTables1668054373145 implements MigrationInterface {
    name = 'generateTables1668054373145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Series" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Series" ALTER COLUMN "isActive" DROP DEFAULT`);
    }

}
