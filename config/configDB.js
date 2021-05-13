
const mysql = require('mysql');
const CONFIG = require('../index.json')
//====================================
//Base de datos 
//===================================
const pool = mysql.createPool({
    host: CONFIG.database.host,
    user: CONFIG.database.user,
    password:CONFIG.database.password,
    database: CONFIG.database.database,
    multipleStatements:true,
    connectionLimit : 1000,
});



module.exports={
    pool
}