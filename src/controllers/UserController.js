import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid";
import db from "../databases/mongodb.js";

export async function postCadastro(request, response) {

    const novoCadastro = request.body;

    if (validarDadosDoCadastro(novoCadastro)) return response.sendStatus(422);
    if (await verificarExistenciaDoUsuario(novoCadastro)) return response.sendStatus(409)

    const passwordCriptografado = bcrypt.hashSync(novoCadastro.senha, 10);

    await db.collection('usuarios').insertOne({ ...novoCadastro, senha: passwordCriptografado })
    response.sendStatus(201)

}

export async function postLogin(request, response) {
    const login = request.body;

    if (validarDadosDoLogin(login)) return response.sendStatus(422);

    const user = await db.collection('usuarios').findOne({ email: login.email });
    if (!user) return response.sendStatus(404);

    if (user && bcrypt.compareSync(login.senha, user.senha)) {
        const token = uuid()

        await db.collection('sessoes').insertOne({
            token,
            userId: user._id
        })

        response.status(201).send({ ...user, token })

    } else {
        response.sendStatus(401);

    }
}

export async function deleteLogoff(request, response) {
    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return response.sendStatus(401);

    await db.collection('sessoes').deleteOne(sessao);
    response.sendStatus(204)
}

export async function getUsuarios(request, response) {
    const usuarios = await db.collection('usuarios').find().toArray();
    response.status(200).send(usuarios)
}

// Funções auxiliares

function validarDadosDoLogin(login) {
    const validationSchema = joi.object({
        email: joi.string().email().required(),
        senha: joi.string().tri().required()
    })

    return validar(validationSchema, login);
}

function validarDadosDoCadastro(novoCadastro) {
    const validationSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().trim().required()
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