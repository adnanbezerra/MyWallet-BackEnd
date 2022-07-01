import { deleteLogoff, getUsuarios, postCadastro, postLogin } from '../controllers/UserController.js';
import { Router } from 'express';
import validateRegistration from '../middlewares/validateRegistration.js';
import validateLogin from '../middlewares/validateLogin.js';
import validateUserExistance from '../middlewares/validateUserExistance.js';
import validateSession from '../middlewares/validateSession.js';
import validatePasswordLogin from '../middlewares/validatePasswordLogin.js';

const router = Router();

// Rotas que tratam do usuário
router.post('/cadastro', validateRegistration, validateUserExistance, postCadastro);
router.post('/login', validateLogin, validatePasswordLogin, postLogin);
router.delete('/logoff', validateSession, deleteLogoff);

// Essa rota serve apenas para fins de teste
router.get('/usuarios', getUsuarios);

export default router;