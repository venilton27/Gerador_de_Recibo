const mysql = require('mysql');

// Configuração do pool de conexões
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recibodb',
    connectionLimit: 10 // Número máximo de conexões no pool
});

// Função para obter uma conexão do pool
function getConnection(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err.message);
            return callback(err, null);
        }
        console.log('Connection obtained from pool.');
        callback(null, connection);
    });
}

// Exportar a função para uso em outros módulos
module.exports = { getConnection };