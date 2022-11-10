import { MigrationInterface, QueryRunner } from "typeorm";

export class generateTables1668058132528 implements MigrationInterface {
    name = 'generateTables1668058132528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "History" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "History" ALTER COLUMN "isActive" DROP DEFAULT`);
    }

}
