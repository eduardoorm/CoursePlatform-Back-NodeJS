const hbs = require('hbs');

  hbs.registerHelper('getAnio', ()=>{
    return new Date().getFullYear();
  })
  
  hbs.registerHelper('capitalizar',(text)=>{
    //codigo 
    //return  ____ ;
  })