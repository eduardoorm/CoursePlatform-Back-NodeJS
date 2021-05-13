require('../config/config'); 
const express = require ('express'); 
const app= express(); 
const {pool} = require('../config/configDB');
const { verificaAdmin } = require('../middlewares/admin');
const { verificaToken } = require('../middlewares/autenticacion');

app.get('/getCategorias',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`Select * From categoria`,(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.get('/getCategoriasPorID/:id',verificaToken,verificaAdmin,(req,res)=>{
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`Select * From categoria where id_categoria = ? `,[req.params.id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
})

app.post('/addCategoria',verificaToken,verificaAdmin,(req,res)=>{
    let body= req.body;
   
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`INSERT INTO categoria SET ?`,[body],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
})

app.put('/putCategoria',verificaToken,verificaAdmin,(req,res)=>{
    let {nombre,id}= req.body;
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`UPDATE categoria SET nom_cate = ? where id_categoria= ?`,[nombre,id],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
})

app.delete('/deleteCategoria/:id',verificaToken,verificaAdmin,(req,res)=>{

    pool.getConnection((err,connection)=>{
           if(err) throw err
           connection.query('DELETE from categoria WHERE id_categoria = ?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(`La persona con el id ${req.params.id} fue removido`);
            }else{
                console.log(err);
            }
        })
    })
})

module.exports=app;