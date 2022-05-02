const express = require('express');
require('dotenv').config()
const app = express();
const con = require('./model/conexao')
const jwt = require('jsonwebtoken');
const {obterAlunos} = require('./model/alunosModel');
const {obterEncontros} = require('./model/encontrosModel');
const {obterAssuntos} = require('./model/assuntosModel');

/* Informa ao express que vai ser recebido JSON */
app.use(express.json());

/*Rota para login */
app.post('/login', (req, res) => {
    if (req.body.user === 'antoniofilho' && req.body.pass === '123456') {
        const id = 1;
        var token = jwt.sign({id}, process.env.APP_KEY, {expiresIn: 3000});
        res.set("x-access-token", token);
        res.json({auth: true, token: token});
    } else {
        res.status(500).json({mensagem: 'Login inválido'});
    }
});

function verifyJWT (req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({auth: false, mensagem: 'Sem token de verificação'});
    }

    jwt.verify(token, process.env.APP_KEY , function (error, decoded) {
        if (error) {
            return res.status(500).json({mensagem: 'Token inválido'});
        }
        next();
    });
}


/* CRUD alunos*/

/* Rota get para obter todos os alunos */
app.get('/bd/alunos', verifyJWT, async (req, res) => {
    try{
        const resultado = await obterAlunos(req, res);
        const dados =  resultado.rows;
        res.json(dados);
    } catch(erro) {
        res.json({'mensagem': 'Erro na obteção dos dados'});
    }
})


/* Rota POST protegida para cadastrar um novo aluno */
app.post('/bd/cadastrarAluno', verifyJWT, async (req, res) => {
    const { nome, telefone} = req.body;
    const resultado = await con.query(`insert into alunos(nome, telefone) values('${nome}', '${telefone}')`);
    return res.json(({mensagem: 'Usuário Cadastrado com Sucesso'}))
});

/* E. Rota PUT protegida para atualizar um aluno */
app.put('/bd/atualizarAluno:id', verifyJWT , async (req, res) => {
    const identificador = req.params.id;
    const {id, nome, telefone } = req.body;
    const resultado = await con.query(`UPDATE alunos set nome = '${nome}', telefone = '${telefone}' WHERE id = ${identificador};`);
    return res.json(({mensagem: 'Usuário Atualizado com Sucesso'}))
});

/* F. Rota DELETE protegida para excluir um aluno */
app.delete('/bd/deletarAluno:id', verifyJWT , async (req, res) => {
    const identificador = req.params.id
    const resultado = await con.query(`DELETE from alunos where id = ${identificador};`);
    return res.json(({mensagem: 'Usuário Deletado com Sucesso'}))
});


/* CRUD assuntos*/

/* Rota POST Criar assunto*/
app.post('/bd/cadastrarAssunto', verifyJWT, async (req, res) => {
    try {
        const {nome, dificuldade, tempoNecessario} = req.body;
        const resultado = await con.query(`insert into assunto(nome, dificuldade, tempoNecessario) values ('${nome}', 
        '${dificuldade}', '${tempoNecessario};')`);
        return res.json(({mensagem: 'Assunto Cadastrado com Sucesso!!'}));
    } catch (error) {
        res.json({'mensagem': 'Erro no cadastro de assunto!!'});
    }
});

/* Rota get para obter todos os assuntos */
app.get('/bd/assuntos', verifyJWT, async (req, res) => {
    try{
        const resultado = await obterAssuntos(req, res);
        const dados =  resultado.rows;
        res.json(dados);
    } catch(erro) {
        res.json({'mensagem': 'Erro na obteção dos dados!!'});
    }
});

/* Rota PUT protegida para atualizar assunto*/
app.put('/bd/atualizarAssunto:id', verifyJWT , async (req, res) => {
    try {
        const identificador = req.params.id;
        const {nome, dificuldade, tempoNecessario} = req.body;
        const resultado = await con.query(`UPDATE assunto set  nome = '${nome}', dificuldade = '${dificuldade}', tempoNecessario = '${tempoNecessario}' WHERE id = ${identificador};`);
        return res.json(({mensagem: 'Assunto Atualizado com Sucesso!!'}));
    } catch (error) {
        res.json({'mensagem': 'Erro na atualização dos dados!!'});
    }
});

/* F. Rota DELETE protegida para excluir um assunto */
app.delete('/bd/deletarAssunto:id', verifyJWT , async (req, res) => {
    try {
        const identificador = req.params.id
        const resultado = await con.query(`DELETE from assunto where id = ${identificador};`);
        return res.json(({mensagem: 'Assunto Deletado com Sucesso'}))
    } catch (error) {
        res.json({'mensagem': 'Erro na exclusão do assunto!!'});
    }
});


/* CRUD encontros*/

/* Rota POST Criar encontro*/
app.post('/bd/cadastrarEncontro', verifyJWT, async (req, res) => {
    try {
        const {alunos, data, assunto_id} = req.body;
        const resultado = await con.query(`INSERT INTO encontros(alunos, data, assunto_id) VALUES ( ARRAY ['${alunos}'], ''${data}'', '${assunto_id}');`);
        return res.json(({mensagem: 'Encontro Cadastrado com Sucesso!!'}));
    } catch (error) {
        res.json({'mensagem': 'Erro no cadastro de encontro!!'});
    }
});

/* Rota get para obter todos os encontros */
app.get('/bd/encontros', verifyJWT, async (req, res) => {
    try{
        const resultado = await obterEncontros(req, res);
        const dados =  resultado.rows;
        res.json(dados);
    } catch(erro) {
        res.json({'mensagem': 'Erro na obteção dos dados!!'});
    }
});

/* Rota PUT protegida para atualizar encontro*/
app.put('/bd/atualizarEncontro:id', verifyJWT , async (req, res) => {
    try {
        const identificador = req.params.id;
        const {id, alunos, data, assunto_id } = req.body;
        const resultado = await con.query(`UPDATE encontros set  alunos = '${alunos}', data = '${data}', assunto = '${assunto_id}' WHERE id = ${identificador};`);
        return res.json(({mensagem: 'Encontro Atualizado com Sucesso!!'}));
    } catch (error) {
        res.json({'mensagem': 'Erro na atualização dos dados!!'});
    }
});

/* F. Rota DELETE protegida para excluir um encontro */
app.delete('/bd/deletarEncontro:id', verifyJWT , async (req, res) => {
    try {
        const identificador = req.params.id
        const resultado = await con.query(`DELETE from encontros where id = ${identificador};`);
        return res.json(({mensagem: 'Encontro Deletado com Sucesso'}))
    } catch (error) {
        res.json({'mensagem': 'Erro na exclusão do encontro!!'});
    }
});


app.listen(process.env.PORT || 3000, function () {console.log("Servidor Rodando!");});