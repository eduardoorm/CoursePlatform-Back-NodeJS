require('../config/config'); 
const express = require ('express'); 
const app= express(); 
const {pool} = require('../config/configDB');
const { verificaAdmin } = require('../middlewares/admin');
const { verificaToken } = require('../middlewares/autenticacion');

app.get('/getSuscripciones',verificaToken,verificaAdmin ,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
           connection.query(`select p.nombre from persona_curso as pc JOIN persona as p ON pc.id_persona=p.id_persona`,(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.get('/getSubsPorCurso/:id',verificaToken,verificaAdmin ,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
           connection.query(`select p.email , p.nombre , p.apellidos, c.nom_curso from persona_curso as pc
            INNER JOIN persona as p ON pc.id_persona = p.id_persona 
           INNER JOIN curso as c ON c.id_curso =pc.id_curso 
            where pc.ruta_curso=?`,[req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

module.exports=app;