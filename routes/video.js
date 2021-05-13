    require('../config/config');
    const express = require ('express');
    const app= express();
    const {pool} = require('../config/configDB')
    const { verificaAdmin } = require('../middlewares/admin');
    const { verificaToken } = require('../middlewares/autenticacion');

    app.get('/getVideosPorCurso/:id',(req,res)=>{
        pool.getConnection((err,connection)=>{
               if(err) throw err
               const {id} = req.params;
            connection.query(`select * from video where ruta_curso=? ORDER BY id_modulo;`,[id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })

    app.get('/getVideosPorModulo/:id',(req,res)=>{
         pool.getConnection((err,connection)=>{
                if(err) throw err
                const {id} = req.params;
             connection.query(`select * from video where id_modulo=?`,[id],(err,rows)=>{
                 if(err) throw err
                 connection.release();
                 return res.send(rows)
             })
         })
    })
 
    app.post('/postLeccion/:id',verificaToken,verificaAdmin,(req,res)=>{
    let body= req.body;
    console.log(body)
    body.id_curso=req.params.id;
    
    pool.getConnection((err,connection)=>{
           if(err) throw err
        connection.query(`INSERT INTO video SET ?`,[body],(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.json(({
                ok:true,
            }))
        })
    })
    })

    app.get('/getLecciones',(req,res)=>{

        pool.getConnection((err,connection)=>{
            if(err) throw err
        connection.query(`Select * From video`,(err,rows)=>{
            if(err) throw err
            connection.release();
            return res.send(rows)
        })
    })
    })

    app.put('/putLeccion/:id',verificaToken,verificaAdmin,(req,res)=>{
        let body= req.body;
        pool.getConnection((err,connection)=>{
            if(err) throw err
            connection.query(`UPDATE video SET ? where ruta_video= ?`,[body,req.params.id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.json(({
                    ok:true,
                }))
            })
        })
    })

    app.delete('/deleteLeccion/:id',verificaToken,verificaAdmin,(req,res)=>{
        console.log(req.params.id);
        pool.getConnection((err,connection)=>{
               if(err) throw err
               connection.query('DELETE from video WHERE id_video = ?',[req.params.id],(err,rows)=>{
                if(!err){
                    connection.release();
                    res.send(`El video ${req.params.id} fue removido`);
                }else{
                    console.log(err);
                }
            })
        })
    })

    app.get('/getVideoPorID/:id',(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err
            const {id} = req.params;
            connection.query(`select * from video where ruta_video =?`,[id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })

    app.get('/getModulo/:id',(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err
            const {id} = req.params;
            connection.query(`select * from modulo where ruta_curso=?`,[id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })

    module.exports= app