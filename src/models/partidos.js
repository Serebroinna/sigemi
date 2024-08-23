import { Schema, model } from "mongoose";

const partidosSchema = new Schema({
    nombre:{type:String,require: true},
    candidato:{type:String,require: true}
});

export default model('partidos', partidosSchema)
