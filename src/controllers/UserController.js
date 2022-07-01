import db from "../dbStrategy/mongodb.js";

export async function postCadastro(request, response) {

    const novoCadastro = request.body;

    const passwordCriptografado = bcrypt.hashSync(novoCadastro.senha, 10);

    await db.collection('usuarios').insertOne({ ...novoCadastro, senha: passwordCriptografado })
    response.sendStatus(201)

}

export async function postLogin(request, response) {
    const user = response.locals.user;
    const token = response.locals.token;
    response.status(201).send({ ...user, token })
}

export async function deleteLogoff(request, response) {

    const sessao = response.locals.sessao;

    await db.collection('sessoes').deleteOne(sessao);
    response.sendStatus(204)
}

export async function getUsuarios(request, response) {
    const usuarios = await db.collection('usuarios').find().toArray();
    response.status(200).send(usuarios)
}