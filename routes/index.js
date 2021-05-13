const express = require ('express');
const app= express();  

  app.use(require('../DB/request'))
  app.use(require('./login'))
  app.use(require('./video'))
  app.use(require('./comentario'))
  app.use(require('./categoria'))
  app.use(require('./estudiante'))
  app.use(require('./curso'))
  app.use(require('./modulo'))
  app.use(require('./suscripciones'))
  app.use(require('./certificado'))
  app.use(require('./instructor'))
 
  module.exports= app;