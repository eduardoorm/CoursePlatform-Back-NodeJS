const express = require ('express');
const app= express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {verificaToken} = require('../middlewares/autenticacion')
const {verificaAdmin} = require('../middlewares/admin')
const {Persona,Estudiante}= require('../DB/schema');
const {pool} = require('../config/configDB');
const emailer =require('../config/emailer');

app.get('/getUsers',(req,res)=>{
  
    pool.getConnection((err,connection)=>{
        if(err) throw err
        
        connection.query('Select * from persona',(err,rows)=>{
            if(!err){
                connection.release();
              return res.json({
                    usuarios:rows
                })
            }else{
                console.log(err)
            } 
        })
    })
   
})

//Get a person using middlewares
app.get('/Usuario',verificaToken, async(req,res)=>{
        const {email} = req.usuario;
        let message = 'EL usario se logueo correctamente'
        let user = new Persona;
        try {      
             user = await Persona.findOne({where: {email}})
        } catch (error) {
            message = 'Usuario o contraseña incorrectos'
            console.log(error);
        }
        return res.json({user,message})
})

//Get a person by ID
app.get('/getUserId/:id',verificaToken,(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query('Select * from persona WHERE id_persona = ?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(rows);
            }else{
                console.log(err);
            }
        })
    })
})

app.get('/ultimosCursos', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query(`
        SELECT cu.id_curso,cu.nom_curso,cu.des_curso,cu.dura_curso,cu.precio_curso,cu.fecha_curso,
        cu.lecciones,cu.ruta_curso,cu.instructor,cu.calificacion,cu.imagen,
        ca.id_categoria,ca.nom_cate,
        i.nombre,i.apellidos 
        FROM curso as cu    
        INNER JOIN categoria as ca 
        ON cu.id_categoria=ca.id_categoria 
        INNER JOIN instructor as i 
        ON cu.instructor= i.id_instructor 
        ORDER BY id_curso DESC LIMIT 3`,(err,rows)=>{
            if(!err){
                connection.release();
                res.send(rows);
            }else{
                console.log(err);
            }
        })
    })
})

app.get('/cursos', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query(` 
        SELECT cu.id_curso,cu.nom_curso,cu.des_curso,cu.dura_curso,cu.precio_curso,cu.fecha_curso,
        cu.lecciones,cu.ruta_curso,cu.instructor,cu.calificacion,cu.imagen,
        ca.id_categoria,ca.nom_cate,
        i.nombre,i.apellidos 
        FROM curso as cu    
        INNER JOIN categoria as ca 
        ON cu.id_categoria=ca.id_categoria 
        INNER JOIN instructor as i 
        ON cu.instructor= i.id_instructor 
        ORDER BY id_curso DESC;`,(err,rows)=>{
            if(!err){
                connection.release();
                res.send(rows);
            }else{
                console.log(err);
            }
        })
    })
})

app.get('/getCursoID/:id', (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query('SELECT * FROM curso WHERE ruta_curso=?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(rows);
            }else{
                console.log(err);
            }
        })
    })
})

app.get('/personaCurso',verificaToken, (req,res)=>{
    const {id_persona} = req.usuario
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query(`Select nom_curso , des_curso , dura_curso from persona_curso as pc
                          INNER JOIN curso as c ON c.id_curso=pc.id_curso 
                          WHERE pc.id_persona=${id_persona}`
        ,[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send(rows);
            }else{
                console.log(err);
            }
        })
    })
})

app.delete('/deleteUserId/:id',verificaToken,verificaAdmin,(req,res)=>{ 
    pool.getConnection((err,connection)=>{
        if(err) throw err
        connection.query('DELETE from persona WHERE id_persona = ?',[req.params.id],(err,rows)=>{
            if(!err){
                connection.release();
                res.send({
                    ok:true
                });
            }else{
                console.log(err);
            }
        })
    })
})

app.post('/postUser',async(req,res)=>{
        const dataUser = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword= bcrypt.hashSync(dataUser.password, salt);
        dataUser.password = hashedPassword; 
        let message = "Usuario registrado";
        let status = 'OK';
        try {  
            const newPerson = await Persona.create({
                ...dataUser
            });
            console.log(newPerson.dataValues.id_persona);
            //pruebo? si vale
            await Estudiante.create({id_persona:newPerson.dataValues.id_persona});
            return res.json({status,message})

        } catch (error) {
            message = "Hubo un error verifique sus datos 2"
            return res.json({error})
        } // pruebo? guarda los cambios
})

// Update a record / persona
app.put('/putUser',verificaToken,(req,res)=>{
    pool.getConnection(async(err,connection)=>{
        if(err) throw err
        const {id_persona,nombre,apellido,password} = req.body;
        let usuario = req.usuario;
        usuario.password="null";
        connection.query('UPDATE persona SET nombre =? , apellidos=?  WHERE id_persona=?',[nombre,apellido,id_persona],(err,rows)=>{
            if(!err){
                connection.release();
                const token = req.usuario;       
                const usuario = {
                  id_persona,
                  nombre,
                  apellidos:apellido,
                  password : !password?token.password:password,
                  email:token.email,
                  rol:token.rol
                }
                let newToken = jwt.sign({
                  usuario
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})

                res.json({
                    ok:true,
                    newToken
                })
            
            }else{
                console.log(err);
            }
        })
    })
})

app.put('/putUserPassword',verificaToken, (req,res)=>{
    pool.getConnection(async(err,connection)=>{
        if(err) throw err
        const{id_persona,nombre,apellido,password} = req.body;
        const hashPassword = await bcrypt.hash(password,10);
        let usuario = req.usuario
        usuario.password="null";
        connection.query('UPDATE persona SET nombre =? , apellidos=? ,password=? WHERE id_persona=?',[nombre,apellido,hashPassword,id_persona],(err,rows)=>{
            if(!err){
                connection.release();
                res.json({
                    ok:true,
                    usuario
                })
            }else{
                console.log(err);
            }
        })
    })
})

app.put('/new-password',async(req,res)=>{
    const {newPassword} = req.body;
    const resetToken = req.headers.reset; 
    const userRepository= await Persona.findOne({where:{resetToken}})    

    if(!(resetToken && newPassword)){
        return res.status(400).json({message:'Todos los campos son requeridos'})
    }
    
    let jwtPayload;
    let user = new Persona;
    try {
        jwtPayload = jwt.verify(resetToken,process.env.JWTSecretReset);
        user = await Persona.findOne({where:{resetToken}})
    } catch (error) {
        return res.status(401).json({message:'Algo salio mal!'})
    }

    user.password= newPassword;

    try {
        const hashPass =  bcrypt.hashSync(user.password, 13);
        userRepository.password=hashPass;
        userRepository.save()
    } catch (error) {
        return res.status(400).json({message:'Algo salio mal!'})
    }

    return res.json({message: 'Contraseña cambiada',status:'OK'})
})

app.put('/forgotMyPassword',async(req,res)=>{
    const {email} = req.body;
    const message = 'Check your email for a link to reset your password'
    const message2 = 'Algo salio mal'
    if(!(email)){
         return res.status(400).json({message: 'Email is required'})
    }

    let user = new Persona;

    let verificationLink;
    let emailStatus = 'OK';
    const userUpdateToken= await Persona.findOne({where:{email}})    
    try {
        user = await Persona.findOne({where: {email}});    
        user.resetToken=""; 
        const token = jwt.sign({usuario:user},process.env.JWTSecretReset,{expiresIn:'10m'});
        verificationLink = await `http://localhost:3000/new-password/${token}`;
        user.resetToken = token;
    } catch (error) {
        return res.json({message})
    }
    //TODO EMAIL
    try {
        emailer.sendMailResetPassword(user.email,verificationLink);
    } catch (error) {
        emailStatus= error;
        return res.status(400).json({message:"Algo salio mal"})
    }

     try {
            userUpdateToken.resetToken=user.resetToken;      
            userUpdateToken.save();
    } catch (error) {
        return res.json({message2})
    }

    return res.json({message,emailStatus})

})

app.post('/requestToTeach',async(req,res)=>{
   const user= req.body;
   let message='La solicitud fue enviada con exito';

   const {email,nombres,url,curso} = req.body;
   if(!(email,nombres,url,curso)){
       message="Error al enviar, todos los datos son obligatorios"
       return res.json({message})
   }
  
   try {
      await emailer.sendMailTeachesIntesla(user);
      return res.json({message})
   } catch (error) {
       message='Ocurrio un error'
      return res.json({message,error})
   }
  
})


  module.exports= app;
