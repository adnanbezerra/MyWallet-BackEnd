import db from '../dbStrategy/mongodb.js'

async function validateUserExistance(req, res, next) {
    const listaDeUsuarios = await db.collection('usuarios').find().toArray();

    for (let usuario of listaDeUsuarios) {
        if (usuario.email === req.body.email) next();
    }

    return res.sendStatus(409);
}

export default validateUserExistance;