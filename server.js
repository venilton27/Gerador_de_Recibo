// filepath: /c:/Users/PC/Documents/RAFAEL/Estudos/EBAC/codigo-base_m07/server.js
const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/deposito', (req, res) => {
    const { nomeBeneficiario, valorDeposito, numeroConta, descricao } = req.body;

    connect((db) => {
        const query = 'INSERT INTO DEPOSITOS (NOME, NUMCONTA, VALOR, DESCRICAO) VALUES (?, ?, ?, ?)';
        db.query(query, [nomeBeneficiario, numeroConta, valorDeposito, descricao], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Erro ao realizar o depósito');
                return;
            }
            res.send('Montante de R$ ' + valorDeposito + ' depositado com sucesso na conta ' + numeroConta + ' de ' + nomeBeneficiario);
            db.detach();
        });
    });
});

app.get('/depositos', (req, res) => {
    connect((db) => {
        const query = 'SELECT * FROM DEPOSITOS';
        db.query(query, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Erro ao buscar os depósitos');
                return;
            }
            res.json(result);
            db.detach();
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});