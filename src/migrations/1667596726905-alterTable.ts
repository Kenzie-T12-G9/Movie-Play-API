import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTable1667596726905 implements MigrationInterface {
    name = 'alterTable1667596726905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "watch_later" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "moviesId" uuid, "seriesId" uuid, CONSTRAINT "REL_f971d015c35cf30740e90e183e" UNIQUE ("userId"), CONSTRAINT "PK_6b5e31210dfa78b187b51c5f1e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "History" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "Movies" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Series" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "watch_later" ADD CONSTRAINT "FK_f971d015c35cf30740e90e183eb" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watch_later" ADD CONSTRAINT "FK_fd9456126275e22d8a6216a4774" FOREIGN KEY ("moviesId") REFERENCES "Movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "watch_later" ADD CONSTRAINT "FK_cde692e8eb73549bc11abe6cf1a" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watch_later" DROP CONSTRAINT "FK_cde692e8eb73549bc11abe6cf1a"`);
        await queryRunner.query(`ALTER TABLE "watch_later" DROP CONSTRAINT "FK_fd9456126275e22d8a6216a4774"`);
        await queryRunner.query(`ALTER TABLE "watch_later" DROP CONSTRAINT "FK_f971d015c35cf30740e90e183eb"`);
        await queryRunner.query(`ALTER TABLE "Series" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "Movies" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "History" ADD "comment" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "watch_later"`);
    }

}
