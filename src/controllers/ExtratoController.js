import { ObjectId } from "mongodb";
import db from "../databases/mongodb.js";

export async function postExtrato(request, response) {

    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return response.sendStatus(401);

    const novaEntrada = request.body;

    if (validarDadosDoExtrato(novaEntrada)) return response.sendStatus(422);

    await db.collection('extrato').insertOne({ ...novaEntrada, usuario: new ObjectId(sessao.userId) });
    response.sendStatus(201);

}

export async function getExtrato(request, response) {
    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return response.sendStatus(401);

    const extrato = await db.collection('extrato').find({ usuario: new ObjectId(sessao.userId) }).toArray();

    response.send(extrato).status(200)
}

// Funções auxiliares

function validarDadosDoExtrato(novaEntrada) {
    const validationSchema = joi.object({
        valor: joi.number().required(),
        descricao: joi.string().required(),
        data: joi.string().required(),
        tipo: joi.string().valid('entrada', 'saida')
    })

    return validar(validationSchema, novaEntrada);
}

function validar(validationSchema, validando) {
    const validate = validationSchema.validate(validando)

    return validate.error;
}