import { MigrationInterface, QueryRunner } from "typeorm";

export class create1667315767835 implements MigrationInterface {
    name = 'create1667315767835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Episodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "season" integer NOT NULL, "episode" integer NOT NULL, "name" character varying NOT NULL, "duration" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c8a4205985bcb1a630ca98f7ca3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "description" character varying NOT NULL, "direction" character varying NOT NULL, CONSTRAINT "PK_3c3d780a38fe84af75495a4099f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Series" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "direction" character varying NOT NULL, "espisodeId" uuid, CONSTRAINT "PK_c2b16b9595c21f34d4f31067d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PaymentMethods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(45) NOT NULL, "cpf" character varying(11) NOT NULL, "number" character varying(16) NOT NULL, "dueDate" TIMESTAMP NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_0981b742c60ac062ed17718cca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdm" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "paymentMethodsId" uuid, CONSTRAINT "REL_9393640c776c8917f188b42a8d" UNIQUE ("paymentMethodsId"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "History" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "watchedAt" TIMESTAMP NOT NULL DEFAULT now(), "comment" character varying NOT NULL, "seriesId" uuid, "movieId" uuid, CONSTRAINT "PK_ba2fff4418f12dffa3d21157008" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" integer NOT NULL, "comment" character varying NOT NULL, "userIdId" uuid, "movieId" uuid, "seriesId" uuid, CONSTRAINT "PK_ee6436ff188c9bb00cc70fc447a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Series" ADD CONSTRAINT "FK_aa069dfd280cce81f84c570838e" FOREIGN KEY ("espisodeId") REFERENCES "Episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_9393640c776c8917f188b42a8d3" FOREIGN KEY ("paymentMethodsId") REFERENCES "PaymentMethods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "History" ADD CONSTRAINT "FK_36d62dba95bdc2365a8d5d2ce95" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "History" ADD CONSTRAINT "FK_c0e7d44e42763e2e3452977809b" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_f110e3733bb157d5b18852aecbe" FOREIGN KEY ("userIdId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_dbb171faf3d444f292782b1b04b" FOREIGN KEY ("movieId") REFERENCES "Movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_9fa5e778675177ac79215c3d766" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_9fa5e778675177ac79215c3d766"`);
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_dbb171faf3d444f292782b1b04b"`);
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_f110e3733bb157d5b18852aecbe"`);
        await queryRunner.query(`ALTER TABLE "History" DROP CONSTRAINT "FK_c0e7d44e42763e2e3452977809b"`);
        await queryRunner.query(`ALTER TABLE "History" DROP CONSTRAINT "FK_36d62dba95bdc2365a8d5d2ce95"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_9393640c776c8917f188b42a8d3"`);
        await queryRunner.query(`ALTER TABLE "Series" DROP CONSTRAINT "FK_aa069dfd280cce81f84c570838e"`);
        await queryRunner.query(`DROP TABLE "Ratings"`);
        await queryRunner.query(`DROP TABLE "History"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "PaymentMethods"`);
        await queryRunner.query(`DROP TABLE "Series"`);
        await queryRunner.query(`DROP TABLE "Movies"`);
        await queryRunner.query(`DROP TABLE "Episodes"`);
    }

}
