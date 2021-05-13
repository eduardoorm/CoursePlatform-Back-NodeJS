require('../config/config'); 
const express = require ('express'); 
const app= express(); 
const {pool} = require('../config/configDB');
const { verificaAdmin } = require('../middlewares/admin');
const { verificaToken } = require('../middlewares/autenticacion');

app.get('/getSeccion',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`Select * From modulo`,(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.get('/getSeccionPorCursoID/:id',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
           
        connection.query(`Select * From modulo where ruta_curso = ? `,[req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.get('/getSeccionPorID/:id',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`Select * From modulo where id_modulo = ? `,[req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.post('/postSeccion',verificaToken,verificaAdmin,(req,res)=>{
    let body= req.body;
    pool.getConnection((err,connection)=>{
           if(err) throw err
           
        connection.query(`INSERT INTO modulo SET ?`,[body],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
})

app.put('/putSeccion/:id',verificaToken,verificaAdmin,(req,res)=>{
    let body= req.body;
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`UPDATE modulo SET ? where id_modulo= ?`,[body,req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
})


app.delete('/deleteSeccion/:id',verificaToken,verificaAdmin,(req,res)=>{
    console.log(req.params.id);
    pool.getConnection((err,connection)=>{
           if(err) throw err
           connection.query('DELETE from modulo WHERE id_modulo = ?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(`El modulo ${req.params.id} fue removido`);
            }else{
                console.log(err);
            }
        })
    })
})

module.exports=app;