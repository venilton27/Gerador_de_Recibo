const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para adicionar uma nova empresa
app.post('/empresa', (req, res) => {
    const { nomeEmpresa, cnpj, logo } = req.body;
    const dataCadastro = new Date().toISOString().split('T')[0];
    const horaCadastro = new Date().toTimeString().split(' ')[0];

    connect((db) => {
        const query = 'INSERT INTO EMPRESAS (NOME_EMPRESA, CNPJ, LOGO, DATA_CADASTRO, HORA_CADASTRO) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nomeEmpresa, cnpj, logo, dataCadastro, horaCadastro], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Erro ao adicionar a empresa');
                return;
            }
            res.send('Empresa adicionada com sucesso');
            db.end();
        });
    });
});

// Rota para adicionar um novo usuário
app.post('/usuario', (req, res) => {
    const { email, senha, empresaId } = req.body;

    connect((db) => {
        const query = 'INSERT INTO USUARIOS (EMAIL, SENHA, EMPRESA_ID) VALUES (?, ?, ?)';
        db.query(query, [email, senha, empresaId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Erro ao adicionar o usuário');
                return;
            }
            res.send('Usuário adicionado com sucesso');
            db.end();
        });
    });
});

// Rota para obter todas as empresas
app.get('/empresas', (req, res) => {
    connect((db) => {
        const query = 'SELECT * FROM EMPRESAS';
        db.query(query, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Erro ao buscar as empresas');
                return;
            }
            res.json(result);
            db.end();
        });
    });
});

// Rota para obter todos os usuários
app.get('/usuarios', (req, res) => {
    connect((db) => {
        const query = 'SELECT * FROM USUARIOS';
        db.query(query, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Erro ao buscar os usuários');
                return;
            }
            res.json(result);
            db.end();
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});