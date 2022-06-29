import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config()

const MONGO = process.env.MONGO_CONNECTION;
const PORTA = process.env.PORTA_LOCALHOST;

// Configurações básicas do servidor backend
const server = express();
server.use(cors());
server.use(express.json());

// Conexão com o banco de dados
const mongoClient = new MongoClient(MONGO);
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("mywallet")
})

// Início das funções de requisições no servidor

// Funções que tratam das movimentações na conta e do retorno das despesas
server.post('/extrato', async (request, response) => {

    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return response.sendStatus(401);

    const novaEntrada = request.body;

    if (validarDadosDoExtrato(novaEntrada)) return response.sendStatus(422);

    await db.collection('extrato').insertOne({ ...novaEntrada, usuario: new ObjectId(sessao.userId) });
    response.sendStatus(201);

});

server.get('/extrato', async (request, response) => {

    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return response.sendStatus(401);

    const extrato = await db.collection('extrato').find({ usuario: new ObjectId(sessao.userId) }).toArray();

    response.send(extrato).status(200)
})

// Funções que tratam do usuário
server.post('/cadastro', async (request, response) => {

    const novoCadastro = request.body;

    if (validarDadosDoCadastro(novoCadastro)) return response.sendStatus(422);
    if (await verificarExistenciaDoUsuario(novoCadastro)) return response.sendStatus(409)

    const passwordCriptografado = bcrypt.hashSync(novoCadastro.senha, 10);

    await db.collection('usuarios').insertOne({ ...novoCadastro, senha: passwordCriptografado })
    response.sendStatus(201)

})

server.post('/login', async (request, response) => {

    const login = request.body;

    if (validarDadosDoLogin(login)) return response.sendStatus(422);

    const user = await db.collection('usuarios').findOne({ email: login.email });
    if (!user) return response.sendStatus(404);

    if (user && bcrypt.compareSync(login.senha, user.senha )) {
        const token = uuid()

        await db.collection('sessoes').insertOne({
            token,
            userId: user._id
        })

        response.status(201).send({...user, token})

    } else {
        response.sendStatus(401);

    }
})

server.get('/usuarios', async (request, response) => {
    const usuarios = await db.collection('usuarios').find().toArray();
    response.status(200).send(usuarios)
})

server.delete('/logoff', async (request, response) => {
    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return response.sendStatus(401);

    await db.collection('sessoes').deleteOne(sessao);
    response.sendStatus(204)
})


// Daqui em diante, temos funções auxiliares para o resto da aplicação

function validarDadosDoLogin(login) {
    const validationSchema = joi.object({
        email: joi.string().email().required(),
        senha: joi.string().required()
    })

    return validar(validationSchema, login);
}

function validarDadosDoExtrato(novaEntrada) {
    const validationSchema = joi.object({
        valor: joi.number().required(),
        descricao: joi.string().required(),
        data: joi.string().required(),
        tipo: joi.string().valid('entrada', 'saida')
    })

    return validar(validationSchema, novaEntrada);
}

function validarDadosDoCadastro(novoCadastro) {
    const validationSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required()
    });

    return validar(validationSchema, novoCadastro);
}

function validar(validationSchema, validando) {
    const validate = validationSchema.validate(validando)

    return validate.error;
}

// Tenho dó de quem for rodar essa função em um servidor grande
async function verificarExistenciaDoUsuario(novoCadastro) {
    const listaDeUsuarios = await db.collection('usuarios').find().toArray();

    for (let usuario of listaDeUsuarios) {
        if (usuario.email === novoCadastro.email) return true;
    }
    return false;
}

server.listen(PORTA, () => {
    console.log("It's alive!");
});