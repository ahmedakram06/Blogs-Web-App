import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1752738007711 implements MigrationInterface {
    name = 'Initial1752738007711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "myname"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "myname" character varying`);
    }

}
