require('./config/config');
const express = require ('express');
const app= express();
const cors = require('cors');
const request = require('request')
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');
const { pool } = require('./config/config');

//   fs.unlink('uploads/',err=>{
//       if(err) throw err;
//       console.log('uploads/1613264956776.docx fue eliminado');
//   })
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use((req, res, next) => {

  // Dominio que tengan acceso (ej. 'http://example.com')
     res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Metodos de solicitud que deseas permitir
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Encabecedados que permites (ej. 'X-Requested-With,content-type')
     res.setHeader('Access-Control-Allow-Headers', '*');
  
  next();
  })
 
  require('./hbs/helpers');

//   Elimina archivos de upload
//   require('./routes/fs');

  app.use(express.static(__dirname + '/public'));

  hbs.registerPartials(__dirname + '/views/parciales');

  app.set('view engine', 'hbs');

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
 
  // parse application/json
  app.use(bodyParser.json()) 

  //Configuración global de rutas
  app.use(require('./routes/index'))

  //=========OPTIMIZAR================//

  app.listen(process.env.PORT,()=>{
      console.log('Trabajando en el puerto',process.env.PORT)
  })