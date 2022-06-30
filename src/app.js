import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getExtrato, postExtrato } from './controllers/ExtratoController.js';
import { deleteLogoff, getUsuarios, postCadastro, postLogin } from './controllers/UserController.js';

dotenv.config()

const PORTA = process.env.PORTA_LOCALHOST;

// Configurações básicas do servidor backend
const server = express();
server.use(cors());
server.use(express.json());

// Início das Rotas de requisições no servidor

// Rotas que tratam das movimentações na conta e do retorno das despesas
server.post('/extrato', postExtrato);
server.get('/extrato', getExtrato);

// Rotas que tratam do usuário
server.post('/cadastro', postCadastro);
server.post('/login', postLogin);
server.delete('/logoff', deleteLogoff);

// Essa rota serve apenas para fins de teste
server.get('/usuarios', getUsuarios);

server.listen(PORTA, () => {
    console.log("It's alive!");
});