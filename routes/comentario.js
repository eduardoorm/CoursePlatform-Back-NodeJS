    require('../config/config');
    const express = require ('express');
    const app= express();
    const {pool} = require('../config/configDB');
    const { verificaToken } = require('../middlewares/autenticacion');
    const comentario = require('../config/config');
const { Comentario,Persona } = require('../DB/schema');
    const convertirFecha=(date)=>{
       const fecha_respuesta= `${date.getUTCFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
       return fecha_respuesta;
    }

    app.post('/comentario',verificaToken,(req,res)=>{
        let body=req.body;
        const {id_persona}=req.usuario;
        const {fecha_comentario}= req.body; 
        const date = new Date(Number(fecha_comentario)); 
        const fecha = convertirFecha(date);
        body.id_persona= id_persona;
        body.fecha_comentario=fecha;
        pool.query('INSERT INTO comentario SET ?',[body],(err,rows)=>{
        
            if(err) throw err;
              res.json({
                  ok:true, 
                  id_comentario: rows.insertId
              })
        })
    })
    

    app.get('/getComentarios',(req,res)=>{   
        pool.getConnection((err,connection)=>{
            if(err) throw err
            connection.query(` SELECT id_comentario,comentario,nombre,apellidos,fecha_comentario from comentario 
            JOIN persona ON persona.id_persona=comentario.id_persona ORDER BY id_comentario DESC;`,(err,rows)=>{
                if(!err){
                    res.send(rows);
                }else{
                    console.log(err);
                }
            })
        })
    })

    app.post('/curso/:id_video/:id_comentario/like',(req,res)=>{
    })

    app.delete('/curso/:id_video/:id_comentario',(req,res)=>{
    })

    app.post('/respuesta',verificaToken,async(req,res)=>{
      let body= req.body;
      const {fecha_respuesta}= req.body; 
      const date = new Date(Number(fecha_respuesta));
      const fecha_resp = convertirFecha(date);
      body.fecha_respuesta = fecha_resp;
      body.id_persona=req.usuario.id_persona;
      pool.getConnection((err,connection)=>{
           if(err) throw err
          connection.query('INSERT INTO respuesta SET ?',[body],(err,rows)=>{
            if(err) throw err;
            connection.release();
            res.json({
                ok:true,
                id_respuesta: rows.insertId,
            })
          })
      })
    })

    app.get('/getRespuestas/:id', async (req,res)=>{
        try {
            await pool.getConnection((err,connection)=>{  
                if(err) throw err
                connection.release();
                connection.query(
                    `Select DISTINCT res.id_respuesta,p.id_persona,p.imageUrl,nombre,apellidos,respuesta,fecha_respuesta,res.id_comentario from respuesta as res 
                    INNER JOIN persona as p ON res.id_persona=p.id_persona 
                    INNER JOIN comentario as c 
                    WHERE res.id_comentario=?
                    ORDER BY res.id_respuesta `
                   ,req.params.id,(err,rows)=>{
                     if(!err){
                         res.send(rows);
                     }else{
                         console.log(err);
                     }
                })
            })
        } catch (error) {   
          console.log();      
        }    
    })

    app.get('/getComentariosPorVideo/:id', async (req,res)=>{
    //    const ruta_video =req.params.id;   
    //     try {
    //         let containerComment = Comentario.findOne({
    //             include:{
    //                 model: Persona,
    //                 as: 'Persona',
    //                 where:{
    //                     ruta_video
    //                 }
    //             }
    //         });

    //         return res.json(containerComment)
    //     } catch (error) {
            
    //     }
    // }  
        try {
            await pool.getConnection((err,connection)=>{  
                if(err) throw err
                connection.release();
                connection.query(
                    ` SELECT id_comentario,comentario,fecha_comentario,likes_coment,id_video,c.id_persona,id_curso,nombre,apellidos,imageUrl
                     from comentario as c 
                     INNER JOIN persona as p 
                     ON p.id_persona=c.id_persona 
                     where c.ruta_video=?`
                   ,req.params.id,(err,rows)=>{
                     if(!err){
                         res.send(rows);
                     }else{
                         console.log(err);
                     }
                })
            })
        } catch (error) {   
          console.log();      
        }    
    })
    
    app.put('/putComentario/:id',(req,res)=>{
        let body= req.body;
        pool.getConnection((err,connection)=>{
            if(err) throw err
            connection.query(`UPDATE comentario SET ? where id_comentario= ?`,[body,req.params.id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.json(({
                    ok:true,
                }))
            })
        })
    })

    app.delete('/deleteComentario/:id',verificaToken,(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err
            connection.query('DELETE from comentario WHERE id_comentario = ?',[req.params.id],(err,rows)=>{
                if(!err){
                    connection.release();
                    return res.json(({
                        ok:true,
                    }))
                }else{
                    console.log(err);
                }
            })
        })
    })

    app.delete('/deleteRespuesta/:id',verificaToken,(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err
            connection.query('DELETE from respuesta WHERE id_respuesta = ?',[req.params.id],(err,rows)=>{
                if(!err){
                    connection.release();
                    return res.json(({
                        ok:true,
                    }))
                }else{
                    console.log(err);
                }
            })
        })
    })

module.exports=app;
