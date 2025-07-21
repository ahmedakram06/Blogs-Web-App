import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1752737932127 implements MigrationInterface {
    name = 'Initial1752737932127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "myname" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "myname"`);
    }

}
