import { Router } from 'express'
import {pool} from '../db.js'
import bcrypt from 'bcrypt'
import fetch from 'node-fetch'


export const login = async (req,res) => {
    if(req.session.loggedin != true){
        res.render('login',{error: ''})
    }else{
        res.redirect('/home')
    }
}

export const logout = async (req,res) => {
    if(req.session.loggedin == true){
        req.session.destroy();
        res.render('index')
    }else{
        res.render('login', {error: 'No has iniciado sesion'})
    } 
}    

export const autentificar = async (req, res) => {
    const data = req.body
    //encriptamos contraseña
    /* bcrypt.hash(data.password, 12).then(hash =>{
        data.password = hash;
    }) */
    const [usuario] = await pool.query('select * from users where email = ?',[data.email])
    if (usuario.length > 0){
        usuario.forEach(element => {
            bcrypt.compare(data.password, element.contrasena, (err, isMatch) => {
                if(!isMatch){
                    res.render("login", {error: "Contraseña incorrecta"})
                }else{
                    //inicia sesion 
                    req.session.loggedin = true;
                    req.session.name = element.nombre
                    res.redirect('/home')
                }
            })
        })
    }else {
        res.render("login", {error: "El usuario no existe"})
        console.log("Usuario NO EXISTE")
    }
}

export const getRegistros = async (req, res) => {
    if(req.session.loggedin != true){
        res.render('login',{error: ''})
    }else {
        try{
            const [registros] = await pool.query("select * from afiliados");
            const [usuarios] = await pool.query("select * from lideres");
            res.render("home", {registros: registros, usuarios: usuarios})
        } catch (error){
            console.log(error)
            return res.status(500).json('Algo ha salido mal ):')
        } 
    }
}

export const postRegistros = async (req, res) => {
    let lat,lon;
    try{
        const {nombre,paterno,materno,calle,numero,municipio,estado,telefono,lider} = req.body;
        //geocoding
        let direccion = calle+' '+numero+', '+municipio+', '+estado;
        let URL = "https://api.mymappi.com/v2/geocoding/direct?apikey=6eaf4e33-efbc-4115-8beb-54ea4da971c3&q="+direccion;
        fetch(URL).then((ubicacion)=>{
            return ubicacion.json()
        }).then((data)=>{
            lat = data.data[0]['lat']
            lon = data.data[0]['lon']
            pool.query('insert into afiliados (nombre,paterno,materno,latitud,longitud,telefono,lider) values (?,?,?,?,?,?,?)',[nombre,paterno,materno,lat,lon,telefono,lider])
            console.log("Inserado(: o eso creemos")
        })
        res.redirect('/home')
    }catch (error){
        res.sendStatus(500).json('No se puedo completar el registro')
    }
}