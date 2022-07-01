import joi from "joi";

function validateBalanceEntrance(req, res, next) {
    const validationSchema = joi.object({
        valor: joi.number().required(),
        descricao: joi.string().required(),
        data: joi.string().required(),
        tipo: joi.string().valid('entrada', 'saida')
    })

    const validate = validationSchema.validate(req.body)

    if(validate.error) return res.sendStatus(422);
    
    next()
}

export default validateBalanceEntrance;