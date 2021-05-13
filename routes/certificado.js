require('../config/config'); 
const express = require ('express'); 
const app= express();
const {pool} = require('../config/configDB');
const { verificaAdmin } = require('../middlewares/admin');
const { verificaToken } = require('../middlewares/autenticacion');

    app.get('/getCertificado',verificaToken,verificaAdmin,(req,res)=>{
        pool.getConnection((err,connection)=>{
               if(err) throw err
            connection.query(` 
            select c.id_certificado,p.id_persona,c.nombre_curso,p.nombre,p.email  
            from certificado as c 
            JOIN persona as p 
            WHERE c.id_persona=p.id_persona`,(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })
    
    app.get('/getCertificadoPorPersonaID/:id',verificaToken,(req,res)=>{
        pool.getConnection((err,connection)=>{
               if(err) throw err
            connection.query(`
             select c.id_certificado,p.id_persona,c.nombre_curso,p.nombre
             from certificado as c 
             JOIN persona as p 
             ON c.id_persona=p.id_persona 
             Where p.id_persona=?`,[req.params.id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })
    
    app.get('/getLastFiveCertificate',verificaToken,verificaAdmin,(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err
            connection.query(`  select c.id_certificado,p.id_persona,c.nombre_curso,p.nombre,p.email  
            from certificado as c 
            JOIN persona as p 
            WHERE c.id_persona=p.id_persona 
            ORDER BY id_persona DESC LIMIT 5`,(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })
    app.get('/getCertificadoPorID/:id',verificaToken,(req,res)=>{
        pool.getConnection((err,connection)=>{
               if(err) throw err
               
            connection.query(`Select * From certificado where id_certificado = ? `,[req.params.id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.send(rows)
            })
        })
    })
    
    app.post('/postCertificado',verificaToken,verificaAdmin,(req,res)=>{
        let body= req.body;
        pool.getConnection((err,connection)=>{
               if(err) throw err
            connection.query(`INSERT INTO certificado SET ?`,[body],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.json(({
                    ok:true,
                }))
            })
        })
    })
    
    app.put('/putCertificado/:id',verificaToken,verificaAdmin,(req,res)=>{
        let body= req.body;
        pool.getConnection((err,connection)=>{
               if(err) throw err
            connection.query(`UPDATE certificado SET ? where id_certificado= ?`,[body,req.params.id],(err,rows)=>{
                if(err) throw err
                connection.release();
                return res.json(({
                    ok:true,
                }))
            })
        })
    })
    
    app.delete('/deleteCertificado/:id',verificaToken,verificaAdmin,(req,res)=>{
        pool.getConnection((err,connection)=>{
               if(err) throw err
               connection.query('DELETE from certificado WHERE id_certificado = ?',[req.params.id],(err,rows)=>{
                if(!err){
                    connection.release();
                    res.send(`El certificado ${req.params.id} fue removido`);
                }else{
                    console.log(err);
                }
            })
        })
    })

    module.exports=app;
