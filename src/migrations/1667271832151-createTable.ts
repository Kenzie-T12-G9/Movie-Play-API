import { MigrationInterface, QueryRunner } from "typeorm";

export class createTable1667271832151 implements MigrationInterface {
    name = 'createTable1667271832151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Episodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "season" integer NOT NULL, "episode" integer NOT NULL, "name" character varying NOT NULL, "duration" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c8a4205985bcb1a630ca98f7ca3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "description" character varying NOT NULL, "direction" character varying NOT NULL, CONSTRAINT "PK_3c3d780a38fe84af75495a4099f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Series" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "direction" character varying NOT NULL, "espisodeIdId" uuid, CONSTRAINT "PK_c2b16b9595c21f34d4f31067d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PaymentMethods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(45) NOT NULL, "cpf" character varying(11) NOT NULL, "number" character varying(16) NOT NULL, "dueDate" TIMESTAMP NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_0981b742c60ac062ed17718cca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "paymentMethodsId" uuid, CONSTRAINT "REL_9393640c776c8917f188b42a8d" UNIQUE ("paymentMethodsId"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "History" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "watchedAt" TIMESTAMP NOT NULL DEFAULT now(), "comment" character varying NOT NULL, "seriesIdId" uuid, "movieIdId" uuid, CONSTRAINT "PK_ba2fff4418f12dffa3d21157008" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" integer NOT NULL, "comment" character varying NOT NULL, "userIdId" uuid, "movieIdId" uuid, "seriesIdId" uuid, CONSTRAINT "PK_ee6436ff188c9bb00cc70fc447a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Series" ADD CONSTRAINT "FK_d6e190b2ede433b4d35616b578a" FOREIGN KEY ("espisodeIdId") REFERENCES "Episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_9393640c776c8917f188b42a8d3" FOREIGN KEY ("paymentMethodsId") REFERENCES "PaymentMethods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "History" ADD CONSTRAINT "FK_7e24232b9c7cce577a32f6a448f" FOREIGN KEY ("seriesIdId") REFERENCES "Series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "History" ADD CONSTRAINT "FK_092665fbc05e71cca1d98efa80a" FOREIGN KEY ("movieIdId") REFERENCES "Movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_f110e3733bb157d5b18852aecbe" FOREIGN KEY ("userIdId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_9b5c4f05673c2d2c18acdf7dbad" FOREIGN KEY ("movieIdId") REFERENCES "Movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Ratings" ADD CONSTRAINT "FK_6580d0c2925178f54504799a9c1" FOREIGN KEY ("seriesIdId") REFERENCES "Series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_6580d0c2925178f54504799a9c1"`);
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_9b5c4f05673c2d2c18acdf7dbad"`);
        await queryRunner.query(`ALTER TABLE "Ratings" DROP CONSTRAINT "FK_f110e3733bb157d5b18852aecbe"`);
        await queryRunner.query(`ALTER TABLE "History" DROP CONSTRAINT "FK_092665fbc05e71cca1d98efa80a"`);
        await queryRunner.query(`ALTER TABLE "History" DROP CONSTRAINT "FK_7e24232b9c7cce577a32f6a448f"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_9393640c776c8917f188b42a8d3"`);
        await queryRunner.query(`ALTER TABLE "Series" DROP CONSTRAINT "FK_d6e190b2ede433b4d35616b578a"`);
        await queryRunner.query(`DROP TABLE "Ratings"`);
        await queryRunner.query(`DROP TABLE "History"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "PaymentMethods"`);
        await queryRunner.query(`DROP TABLE "Series"`);
        await queryRunner.query(`DROP TABLE "Movies"`);
        await queryRunner.query(`DROP TABLE "Episodes"`);
    }

}
