import {createPool} from 'mysql2/promise'
import mongoose from 'mongoose'
import { DB_HOST,DB_NAMEDATABASE,DB_PASSWORD,DB_PORT,DB_USER, MONGODB_CONNECT } from './config.js';


(async () => {
    try{
        const db = mongoose.connect(MONGODB_CONNECT);
        console.log('DB connect success', (await db).connection.name);
    } catch (error){
        console.log(error);
    }
})();


/* export const pool = createPool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAMEDATABASE
}); */