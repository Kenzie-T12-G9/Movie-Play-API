import { MigrationInterface, QueryRunner } from "typeorm";

export class generateTables1668010800834 implements MigrationInterface {
    name = 'generateTables1668010800834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Episodes" DROP CONSTRAINT "FK_491fe41b8e82503d0e37d7c96db"`);
        await queryRunner.query(`ALTER TABLE "Episodes" RENAME COLUMN "serieId" TO "seriesId"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Episodes" ADD CONSTRAINT "FK_0adffc8f08ac5e4255017f418ab" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Episodes" DROP CONSTRAINT "FK_0adffc8f08ac5e4255017f418ab"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "createdAt" SET DEFAULT '2022-11-09 12:42:01.714'`);
        await queryRunner.query(`ALTER TABLE "Episodes" RENAME COLUMN "seriesId" TO "serieId"`);
        await queryRunner.query(`ALTER TABLE "Episodes" ADD CONSTRAINT "FK_491fe41b8e82503d0e37d7c96db" FOREIGN KEY ("serieId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
