require('../config/config'); 
const express = require ('express'); 
const app= express(); 
const {pool} = require('../config/configDB');
const { Curso } = require('../DB/schema');
const { verificaAdmin } = require('../middlewares/admin');
const { verificaToken } = require('../middlewares/autenticacion');




const convertirFecha=(date)=>{
    const fecha_respuesta= `${date.getUTCFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    return fecha_respuesta;
}


app.post('/postCurso',verificaAdmin,(req,res)=>{

    console.log(req.body)
    
     const {nom_curso,des_curso,dura_curso,precio_curso,fecha_curso,id_categoria,lecciones,ruta_curso,id_profesor:instructor,calificacion, imagen, public_id}= req.body 
     const date = new Date(Number(fecha_curso)); 
     const fecha = convertirFecha(date);

     const body = {nom_curso,des_curso,dura_curso,precio_curso,fecha_curso:fecha,id_categoria,lecciones,ruta_curso,instructor,calificacion, imagen, public_id};

       pool.getConnection((err,connection)=>{
           if(err) console.log(err);
            connection.query(`INSERT INTO curso SET ?`,[body],(err,rows)=>{
               if(err) console.log(err);
               connection.release();
               return res.json(({
                   ok:true,
               }))
         })
       })
     
})

app.post('/calificationCourse',verificaToken,async (req,res)=>{
    const {ruta_curso,value:calification} = req.body
    let message = "Se agrego la calficación"
    if(!(ruta_curso && calification)){
        return res.status(401).json({message:"Todos los datos son obligatorios"});
    }
    const curso = await Curso.findOne({where : {ruta_curso}})
    const currentCalification = Number (curso.calificacion);
    if(!currentCalification){
        curso.calificacion=calification;
        await curso.save();
        console.log("se agrego correctamente arriba");

        return res.json({message})
    }
    try {
        
        const newCalification = ((currentCalification+Number(calification)))/2;
        console.log(Math.round(newCalification));
        curso.calificacion= Math.round(newCalification);
        await curso.save();
        console.log("se agrego correctamente abajo");
    } catch (error) {
        return res.json({message:"Algo salio mal"})
    }
   
})

app.put('/putCurso/:id',verificaToken,verificaAdmin,(req,res)=>{
     pool.getConnection((err,connection)=>{
         if(err) throw err
          connection.query(`UPDATE curso SET ? where ruta_curso= ?`,[req.body,req.params.id],(err,rows)=>{
          if(err) throw err
          connection.release();
          return res.json({
              ok:true,
          })
      })
    })
})

app.delete('/deleteCurso/:id',verificaToken,verificaAdmin,(req,res)=>{

    pool.getConnection((err,connection)=>{
           if(err) throw err
           connection.query('DELETE from curso WHERE id_curso = ?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(`El curso con el id ${req.params.id} fue removido`);
            }else{
                console.log(err);
            }
        })
    })
})

module.exports=app;