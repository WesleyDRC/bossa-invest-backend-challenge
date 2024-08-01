import { DataSource } from "typeorm"
import { createConnection } from "mysql2/promise"

// Entities
import { User } from "../../modules/users/entities/User"
import { Skill } from "../../modules/skills/entities/Skill"
import { MentoringSession } from "../../modules/mentoring/entities/MentoringSession"
import { MentorAvailability } from "../../modules/mentoring/entities/MentorAvailability"
import { MentoringAssessment } from "../../modules/mentoring/entities/MentoringAssessment"

const createDatabaseIfNotExists = async () => {

    const connection = await createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS db_mentoring`);

    await connection.end();
};

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [
        User,
        Skill,
        MentoringSession,
        MentorAvailability,
        MentoringAssessment
    ]
})

createDatabaseIfNotExists()
    .then(() => AppDataSource.initialize())
    .then(() => {
        console.log(`Database connected!\n Host: ${process.env.DB_HOST}`)
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })