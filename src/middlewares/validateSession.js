import db from '../dbStrategy/mongodb.js'

async function validateSession(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const sessao = await db.collection('sessoes').findOne({ token });
    if (!sessao) return res.sendStatus(401);

    res.locals.sessao = sessao;

    next()
}

export default validateSession;