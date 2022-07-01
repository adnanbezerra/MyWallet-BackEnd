import { ObjectId } from "mongodb";
import db from "../dbStrategy/mongodb.js";

export async function postExtrato(request, response) {

    const sessao = response.locals.sessao;

    const novaEntrada = request.body;

    await db.collection('extrato').insertOne({ ...novaEntrada, usuario: new ObjectId(sessao.userId) });
    response.sendStatus(201);

}

export async function getExtrato(request, response) {
    const sessao = response.locals.sessao;

    const extrato = await db.collection('extrato').find({ usuario: new ObjectId(sessao.userId) }).toArray();

    response.send(extrato).status(200)
}