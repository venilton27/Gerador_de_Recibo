// filepath: /c:/Users/PC/Documents/RAFAEL/Estudos/EBAC/codigo-base_m07/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database'
});

function connect(callback) {
    connection.connect((err) => {
        if (err) {
            console.error('Connection error:', err);
            return;
        }
        callback(connection);
    });
}

module.exports = { connect };