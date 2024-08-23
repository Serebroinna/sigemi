import { Router } from 'express'
//import {pool} from '../db.js'
import bcrypt from 'bcrypt'
import fetch from 'node-fetch'
import usuarioSchema from '../models/usuarios.js'
import afiliadosSchema from '../models/afiliado.js'
import lideresSchema from '../models/lideres.js'
import partidosSchema from '../models/partidos.js'


//VERIFICAR SI NO SE HA INICIADO SESION
export const login = async (req,res) => {
    if(req.session.loggedin != true){
        res.render('login',{error: ''})
    }else{
        res.redirect('/home')
    }
}

//CERRAR SESION
export const logout = async (req,res) => {
    if(req.session.loggedin == true){
        req.session.destroy();
        res.render('index')
    }else{
        res.render('login', {error: 'No has iniciado sesion'})
    } 
}    

//AUNTENTIFICAR USUARIOS PARA LOGIN
export const autentificar = async (req, res) => {
    const data = req.body
    //encriptamos contraseña
    /* bcrypt.hash(data.password, 12).then(hash =>{
        data.password = hash;
    }) */
    //Queires MySQL
    //const [usuario] = await pool.query('select * from users where email = ?',[data.email])

    //Queries MongoDB
    const usuarios = await usuarioSchema.findOne({email: data.email})
    if (usuarios.email == data.email){
        bcrypt.compare(data.password, usuarios.password, (err, isMatch) => {
            if(!isMatch){
                res.render("login", {error: "Contraseña incorrecta"})
            }else{
                //inicia sesion 
                req.session.loggedin = true;
                req.session.name = usuarios.nombre;
                res.redirect('/home')
            }
        })
    }else {
        res.render('login', {error: 'El usuario no existe'})
    }
}

//MOSTRAR LOS AFILIADOS
export const getRegistros = async (req, res) => {
    if(req.session.loggedin != true){
        res.render('login',{error: ''})
    }else {
        try{
            //Queries MySQL
            //const [registros] = await pool.query("select * from afiliados");
            //const [usuarios] = await pool.query("select * from lideres");

            //Queries MongoDB
            const afiliados = await afiliadosSchema.find()
            const lideres = await lideresSchema.find()
            const partidos = await partidosSchema.find()
            res.render("home", {registros: afiliados, lideres: lideres, partidos: partidos})
        } catch (error){
            return res.status(500).json('Algo ha salido mal ):')
        } 
    }
}

//ANAÑIR AFILIADOS
export const postRegistros = async (req, res) => {
    let latitud,longuitud;
    try{
        //geocoding
        let direccion = req.body.calle+' '+req.body.numero+', '+req.body.municipio+', '+req.body.estado;
        //let URL = "https://api.mymappi.com/v2/geocoding/direct?apikey=6eaf4e33-efbc-4115-8beb-54ea4da971c3&q="+direccion; ESTA API DEJO DE FUNCIONAR
        let URL = "https://nominatim.openstreetmap.org/search?q="+direccion+"&format=geocodejson";
            fetch(URL).then((ubicacion)=>{ 
                return ubicacion.json()
            }).then((data)=>{
                latitud = data.features[0].geometry.coordinates[1]
                longuitud = data.features[0].geometry.coordinates[0]
            //Queries MySQL
            //pool.query('insert into afiliados (nombre,paterno,materno,latitud,longitud,telefono,lider) values (?,?,?,?,?,?,?)',[nombre,paterno,materno,lat,lon,telefono,lider])
                
            //Queries MongoDB
            const afiliado = {
                nombre: req.body.nombre,
                paterno: req.body.paterno,
                materno: req.body.materno,
                domicilio: direccion,
                latitud: latitud,
                longuitud: longuitud,
                telefono: req.body.telefono,
                partido: req.body.partido,
                lider: req.body.lider
            }
            const insertar = afiliadosSchema(afiliado)
            insertar.save()
            })
        res.redirect("/home")
    }catch (error){
        res.status(500).json('No se puedo completar el registro')
        console.log(error)
    }
}

//EDITAR AFILIADO
//abre una vista previa con los datos del registro que se quiere editar
export const editRegistros = async (req, res) => {
    const {id} = req.params
    //const {nombre,paterno,materno,calle,numero,municipio,estado,telefono,partido,lider} = req.body
    const afiliado = await afiliadosSchema.findById(id)
    res.render("edit", {afiliado: afiliado})   
}

export const  RegistroEditado = async (req, res) =>{
    let latitud,longuitud;  
    try{
        const {id} = req.params;
        let direccion = req.body.domicilio;
        let URL = "https://nominatim.openstreetmap.org/search?q="+direccion+"&format=geocodejson";
            fetch(URL).then((ubicacion)=>{ 
                return ubicacion.json()
            }).then(async(data)=>{
                latitud = data.features[0].geometry.coordinates[1]
                longuitud = data.features[0].geometry.coordinates[0]
                const doc = await afiliadosSchema.findById(id)
                    doc.nombre = req.body.nombre,
                    doc.paterno = req.body.paterno,
                    doc.materno = req.body.materno,
                    doc.domicilio = req.body.domicilio,
                    doc.latitud = latitud,
                    doc.longuitud = longuitud,
                    doc.telefono = req.body.telefono,
                    doc.partido = req.body.partido
                    await doc.save()
                })
        res.redirect("home")
    }catch (error){
        res.status(500).json('No se puedo completar el registro')
        console.log(error)
    }   
}

//ELIMAR UN AFILIADO
export const deleteRegistros = async (req, res) => {
    try{
        const {id} = req.params
        await afiliadosSchema.findByIdAndDelete(id)
        res.redirect("/home")
    }catch(error){
        res.status(500).json('No se encontro el registro que intenta borrar')
    }
    
}