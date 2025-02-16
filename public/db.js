// filepath: /c:/Users/PC/Documents/RAFAEL/Estudos/EBAC/codigo-base_m07/db.js
const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3050,
    database: 'C:\Users\VENILTON GOMES\Downloads\fronte-and-42338c977641e5b94dd78f2745fda491f369bba2\BD.FDB', // Caminho absoluto
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: null,
    pageSize: 4096
};

function connect(callback) {
    Firebird.attach(options, function(err, db) {
        if (err) {
            console.error('Connection error:', err);
            return;
        }
        callback(db);
    });
}

module.exports = { connect };