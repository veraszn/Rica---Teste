const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

// Inicializa o Express
const app = express();
const port = 3000;

// Conecta ao banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Usuário do MySQL
    password: 'admin',  // Senha do MySQL (se houver)
    database: 'usuarios'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para permitir requisições com corpo em JSON
app.use(bodyParser.json());

// **CRUD de usuários**

/** 1. Criar um novo usuário */
app.post('/usuarios', (req, res) => {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
    }

    // Criptografa a senha antes de salvar
    bcrypt.hash(senha, 10, (err, senhaCriptografada) => {
        if (err) return res.status(500).json({ error: 'Erro ao criptografar a senha' });

        const sql = 'INSERT INTO usuarios (nome, senha) VALUES (?, ?)';
        db.query(sql, [nome, senhaCriptografada], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário:', err);
                return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
            }
            res.status(201).json({ id: result.insertId, nome, senha: senhaCriptografada });
        });
    });
});

/** 2. Consultar todos os usuários */
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT id, nome FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao consultar usuários:', err);
            return res.status(500).json({ error: 'Erro ao consultar no banco de dados' });
        }
        res.status(200).json(results);
    });
});

/** 3. Consultar um usuário pelo ID */
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT id, nome FROM usuarios WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao consultar usuário:', err);
            return res.status(500).json({ error: 'Erro ao consultar no banco de dados' });
        }
        if (!result.length) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(result[0]);
    });
});

/** 4. Atualizar um usuário */
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, senha } = req.body;

    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
    }

    // Criptografar a senha antes de atualizar
    bcrypt.hash(senha, 10, (err, senhaCriptografada) => {
        if (err) return res.status(500).json({ error: 'Erro ao criptografar a senha' });

        const sql = 'UPDATE usuarios SET nome = ?, senha = ? WHERE id = ?';
        db.query(sql, [nome, senhaCriptografada, id], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar no banco de dados' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        });
    });
});

/** 5. Excluir um usuário */
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).json({ error: 'Erro ao excluir no banco de dados' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    });
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
