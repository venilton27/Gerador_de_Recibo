const express = require('express');
const bodyParser = require('body-parser');
const { getConnection } = require('./public/db'); // Importa a função getConnection do db.js

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para adicionar uma nova empresa
app.post('/empresa', (req, res) => {
    const { nomeEmpresa, cnpj, logo, dataCadastro, horaCadastro } = req.body;

    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const query = 'INSERT INTO EMPRESAS (NOME_EMPRESA, CNPJ, LOGO, DATA_CADASTRO, HORA_CADASTRO) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nomeEmpresa, cnpj, logo, dataCadastro, horaCadastro], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao adicionar a empresa');
            }
            res.send({ message: 'Empresa adicionada com sucesso', empresaId: result.insertId });
        });
    });
});

// Rota para adicionar um novo usuário
app.post('/usuario', (req, res) => {
    const { email, senha, empresaId } = req.body;

    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        // Verifica se a empresa existe
        const checkEmpresaQuery = 'SELECT ID FROM EMPRESAS WHERE ID = ?';
        db.query(checkEmpresaQuery, [empresaId], (err, result) => {
            if (err) {
                db.release(); // Libera a conexão de volta para o pool
                console.error('Database error:', err);
                return res.status(500).send('Erro ao verificar a empresa');
            }

            if (result.length === 0) {
                db.release(); // Libera a conexão de volta para o pool
                return res.status(400).send('Empresa não encontrada');
            }

            // Insere o usuário
            const insertUsuarioQuery = 'INSERT INTO USUARIOS (EMAIL, SENHA, EMPRESA_ID) VALUES (?, ?, ?)';
            db.query(insertUsuarioQuery, [email, senha, empresaId], (err, result) => {
                db.release(); // Libera a conexão de volta para o pool
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).send('Erro ao adicionar o usuário');
                }
                res.send('Usuário adicionado com sucesso');
            });
        });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});