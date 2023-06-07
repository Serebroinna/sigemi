import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import methodOverride from 'method-override';
import indexRoutes from './routes/index.routes.js';
import session from 'express-session';

const app = express();

//configuraciones
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false})) //este metodo entiende los datos que vienen desde los forms
app.use(methodOverride('_method')) //midleware para sobreecribir los metodos put y push 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


//rutas
app.use(indexRoutes)
app.use((req,res,next)=>{
    res.redirect('/')
});

export default app;

