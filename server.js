const express = require('express');
const bodyParser = require('body-parser');
const { getConnection } = require('./public/db'); // Importa a função getConnection do db.js

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para adicionar uma nova empresa
app.post('/empresa', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const { nomeEmpresa, cnpj, logo, dataCadastro, horaCadastro } = req.body;
        const query = 'INSERT INTO EMPRESAS (NOME_EMPRESA, CNPJ, LOGO, DATA_CADASTRO, HORA_CADASTRO) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nomeEmpresa, cnpj, logo, dataCadastro, horaCadastro], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao adicionar empresa');
            }
            res.send('Empresa adicionada com sucesso');
        });
    });
});

// Rota para adicionar um novo usuário
app.post('/usuario', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const { email, senha, empresaId } = req.body;
        const query = 'INSERT INTO USUARIOS (EMAIL, SENHA, EMPRESA_ID) VALUES (?, ?, ?)';
        db.query(query, [email, senha, empresaId], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao adicionar usuário');
            }
            res.send('Usuário adicionado com sucesso');
        });
    });
});

// Rota para obter todas as empresas e seus funcionários
app.get('/empresas', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const query = `
            SELECT e.ID as empresaId, e.NOME_EMPRESA, e.CNPJ, e.LOGO, e.DATA_CADASTRO, e.HORA_CADASTRO, 
                   u.ID as usuarioId, u.EMAIL as funcionarioEmail, u.SENHA as funcionarioSenha
            FROM EMPRESAS e
            LEFT JOIN USUARIOS u ON e.ID = u.EMPRESA_ID
        `;

        db.query(query, (err, results) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao obter empresas');
            }

            // Agrupar os resultados por empresa
            const empresas = results.reduce((acc, row) => {
                const empresa = acc.find(e => e.empresaId === row.empresaId);
                if (empresa) {
                    if (row.usuarioId) {
                        empresa.funcionarios.push({
                            id: row.usuarioId,
                            email: row.funcionarioEmail,
                            senha: row.funcionarioSenha
                        });
                    }
                } else {
                    acc.push({
                        empresaId: row.empresaId,
                        nomeEmpresa: row.NOME_EMPRESA,
                        cnpj: row.CNPJ,
                        logo: row.LOGO,
                        dataCadastro: row.DATA_CADASTRO,
                        horaCadastro: row.HORA_CADASTRO,
                        funcionarios: row.usuarioId ? [{
                            id: row.usuarioId,
                            email: row.funcionarioEmail,
                            senha: row.funcionarioSenha
                        }] : []
                    });
                }
                return acc;
            }, []);

            res.json(empresas);
        });
    });
});

// Rota para editar uma empresa
app.put('/empresa/:id', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const { nomeEmpresa, cnpj, logo } = req.body;
        const query = 'UPDATE EMPRESAS SET NOME_EMPRESA = ?, CNPJ = ?, LOGO = ? WHERE ID = ?';
        db.query(query, [nomeEmpresa, cnpj, logo, req.params.id], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao atualizar empresa');
            }
            res.send('Empresa atualizada com sucesso');
        });
    });
});

// Rota para excluir uma empresa
app.delete('/empresa/:id', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const query = 'DELETE FROM EMPRESAS WHERE ID = ?';
        db.query(query, [req.params.id], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao excluir empresa');
            }
            res.send('Empresa excluída com sucesso');
        });
    });
});

// Rota para editar um usuário
app.put('/usuario/:id', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const { email, senha } = req.body;
        const query = 'UPDATE USUARIOS SET EMAIL = ?, SENHA = ? WHERE ID = ?';
        db.query(query, [email, senha, req.params.id], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao atualizar usuário');
            }
            res.send('Usuário atualizado com sucesso');
        });
    });
});

// Rota para excluir um usuário
app.delete('/usuario/:id', (req, res) => {
    getConnection((err, db) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Erro ao conectar ao banco de dados');
        }

        const query = 'DELETE FROM USUARIOS WHERE ID = ?';
        db.query(query, [req.params.id], (err, result) => {
            db.release(); // Libera a conexão de volta para o pool
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Erro ao excluir usuário');
            }
            res.send('Usuário excluído com sucesso');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});