import { Router } from "express";
import { getRegistros, postRegistros, autentificar, login, logout, deleteRegistros, editRegistros, RegistroEditado} from "../controllers/index.controllers.js";
const router = Router();

//Ruta inicial
router.get('/', (req, res) =>{
    res.render('index')
});
//Ruta de login
router.get('/login', login);
router.post('/login', autentificar);
router.get('/logout', logout);
//Rutas de CRUD
router.get('/home', getRegistros);
router.post('/home', postRegistros);
router.delete('/home/:id', deleteRegistros);
router.post('/edit/:id', editRegistros);
router.post('/editar/:id', RegistroEditado)



export default router;

