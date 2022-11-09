import { MigrationInterface, QueryRunner } from "typeorm";

export class generateTables1667997716703 implements MigrationInterface {
    name = 'generateTables1667997716703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "History" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "createdAt" SET DEFAULT '2022-11-09T12:42:01.714Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "History" DROP COLUMN "isActive"`);
    }

}
