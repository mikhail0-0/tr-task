import { MigrationInterface, QueryRunner } from "typeorm";

export class TestUser1724673648144 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "users" ( "email", "password") VALUES 
            ('test@mail.com', '$2b$10$GiFWf1aXWHRw6ReLds5tyOy36F3ezcVJ/0.99wThOcWlL9.J7I5ue');  
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
