  require('../config/config');
  const express = require ('express');
  const app= express();
  const bcrypt = require("bcrypt");
  const {Persona}= require('../DB/schema');
  const jwt = require('jsonwebtoken');
  
  app.post('/loginUser',(req,res)=>{
      let body = req.body;    //
      console.log(req.body);
      Persona.findOne({where:{email: body.email}})
        .then(usuarioDB=>{
                 console.log("usuario: ",usuarioDB.dataValues); // no veo este log

                /* if(!bcrypt.compareSync(body.password,usuarioDB.password)){
                    return res.status(500).json({
                        ok:false,
                        err:{
                            message: 'Usuario o (contraseña) incorrectos'
                            }
                    });
                 } */

                 let token = jwt.sign({
                     usuario: usuarioDB
                 },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN}) //seg , min,hor.dias
                 
                 res.json(
                    {
                        token
                    })
         }).catch(()=>{
              return res.status(400).json({
                 err:{
                     message:"No se encontra el (Usuario)",
                 } 
              })
         })   
  })
  
  module.exports=app;
  
  

