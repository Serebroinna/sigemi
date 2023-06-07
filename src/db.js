import {createPool} from 'mysql2/promise'

export const pool = createPool({
    user: 'root',
    password: 'murc13l@g0',
    host: 'localhost',
    port: 3306,
    database: 'sistema_elecciones'
});