import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_CATALOG,
    multipleStatements: true,
});

export default db;
