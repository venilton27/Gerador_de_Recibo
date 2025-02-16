// filepath: /c:/Users/PC/Documents/RAFAEL/Estudos/EBAC/codigo-base_m07/db.js
const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3050,
    database: 'C:/Users/PC/Documents/RAFAEL/Estudos/EBAC/codigo-base_m07/BDTESTE.FDB', // Caminho absoluto
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