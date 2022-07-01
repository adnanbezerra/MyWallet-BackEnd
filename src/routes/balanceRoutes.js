import { getExtrato, postExtrato } from '../controllers/ExtratoController.js';
import { Router } from 'express'
import validateSession from '../middlewares/validateSession.js';
import validateBalanceEntrance from '../middlewares/validateBalanceEntrance.js';

const router = Router();

// Rotas que tratam das movimentações na conta e do retorno das despesas
router.post('/extrato', validateSession, validateBalanceEntrance, postExtrato);
router.get('/extrato', validateSession, getExtrato);

export default router;