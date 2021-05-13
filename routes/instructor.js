const express = require ('express');
const app= express();
const {verificaToken} = require('../middlewares/autenticacion')
const {verificaAdmin} = require('../middlewares/admin')
//MySQL
const {pool} = require('../config/configDB');


app.get('/getInstructor',(req,res)=>{
  
    pool.getConnection((err,connection)=>{
        if(err) throw err
        
        connection.query('Select * from instructor',(err,rows)=>{
            if(!err){
                connection.release();
               return res.send(rows)
            }else{
                console.log(err)
            } 
        })
    })
   
})
app.get('/getInstrucorID/:id',(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`Select * From instructor where id_instructor = ? `,[req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.post('/addProfesor',verificaToken,verificaAdmin,(req,res)=>{
    let body= req.body;
   
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`INSERT INTO instructor SET ?`,[body],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
})

app.put('/putProfesor',verificaToken,verificaAdmin,(req,res)=>{
    let {nombre,apellidos,id}= req.body;
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`UPDATE instructor SET nombre = ?,apellidos=? where id_instructor= ?`,[nombre,apellidos,id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
})

app.delete('/deleteInstructor/:id',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
           connection.query('DELETE from instructor WHERE id_instructor = ?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(`El profesor con el id ${req.params.id} fue removido`);
            }else{
                console.log(err);
            }
        })
    })
})

module.exports= app;