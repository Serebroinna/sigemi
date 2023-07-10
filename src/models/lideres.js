import {Schema, model} from "mongoose"


const lideresSchema = new Schema({
    nombre:{type:String,require: true},
    paterno:{type:String,require: true},
    materno:{type:String,require: true},
    colonia:{type:String,require: true},
    telefono:{type:String,require: true}
})

export default model('lideres', lideresSchema)