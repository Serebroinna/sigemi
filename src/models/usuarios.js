import {Schema, model} from "mongoose"


const usuarioSchema= new Schema({
    nombre:{type:String,require: true},
    paterno:{type:String,require: true},
    materno:{type:String,require: true},
    email:{type:String,require: true},
    password:{type:String,require: true}
});

export default model('usuarios', usuarioSchema) ;
