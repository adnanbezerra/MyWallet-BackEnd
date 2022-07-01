import db from "../dbStrategy/mongodb.js";
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid";

async function validatePasswordLogin(req, res, next) {
    const login = req.body;

    const user = await db.collection('usuarios').findOne({ email: login.email });
    if (!user) return res.sendStatus(404);

    if (user && bcrypt.compareSync(login.senha, user.senha)) {
        const token = uuid()

        await db.collection('sessoes').insertOne({
            token,
            userId: user._id
        })

        res.locals.user = user;
        res.locals.token = token;
        next();

    } else {
        res.sendStatus(401);

    }
}

export default validatePasswordLogin;