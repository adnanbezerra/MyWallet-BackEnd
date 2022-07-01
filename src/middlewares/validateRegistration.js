import joi from 'joi';

function validateRegistration(req, res, next) {

    const validationSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().trim().required()
    });

    const validate = validationSchema.validate(req.body)

    if(validate.error) return res.sendStatus(422);

    next()
}

export default validateRegistration;