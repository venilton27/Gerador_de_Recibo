const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recibodb'
});

function connect(callback) {
    connection.connect((err) => {
        if (err) {
            console.error('Connection error:', err.message);
            return callback(err, null);
        }
        console.log('Connected to MySQL database.');
        callback(null, connection);
    });
}

// Para testar a conexão diretamente
if (require.main === module) {
    connect((err, conn) => {
        if (!err) {
            console.log('Database connection successful!');
            conn.end(); // Fecha a conexão após o teste
        }
    });
}

module.exports = { connect };