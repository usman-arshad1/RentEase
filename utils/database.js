const mysql = require('mysql2');

const database = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT_DB,
});

database.execute = (statement, args) => {
    return new Promise((resolve, reject) => {
        database.query(statement, args, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports = database;