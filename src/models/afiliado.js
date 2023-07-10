import {Schema, model} from "mongoose"


const afiliadosSchema = new Schema({
    nombre:{type:String,require: true},
    paterno:{type:String,require: true},
    materno:{type:String,require: true},
    domicilio:{type:String,require: true},
    latitud:{type:String,require: true},
    longuitud:{type:String,require: true},
    telefono:{type:String,require: true},
    partido:{type:String,require: true},
    lider:{type:String,require: true}
})

export default model('afiliados', afiliadosSchema)