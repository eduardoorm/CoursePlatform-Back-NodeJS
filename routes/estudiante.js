require('../config/config'); 
const express = require ('express'); 
const app= express(); 
const {pool} = require('../config/configDB')
const {verificaToken} = require('../middlewares/autenticacion')
const {verificaAdmin} = require('../middlewares/admin')

app.get('/getEstudiante',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`select e.id_persona,e.id_estudiante,nombre,apellidos,email,role 
        from estudiante as e 
        INNER JOIN persona as p 
        ON e.id_persona = p.id_persona`,(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.get('/getLastFiveStudents',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`select e.id_persona,e.id_estudiante,nombre,apellidos,email,role 
        from estudiante as e 
        INNER JOIN persona as p 
        ON e.id_persona = p.id_persona  ORDER BY id_persona DESC LIMIT 5`,(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.get('/getEstudiantePorID/:id',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`select e.id_persona,
         e.id_estudiante,nombre,apellidos,email,role from estudiante as e
         INNER JOIN persona as p 
         ON e.id_persona = p.id_persona 
         WHERE id_estudiante=? `,[req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

module.exports=app;