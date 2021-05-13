//====================================
//Puerto
//====================================
process.env.PORT= process.env.PORT || 3001 ;

//====================================
//Entorno  (AGREGAR*)
//====================================
process.env.NODE_ENV= process.env.NODE_ENV|| 3001 ;

//====================================
//Vencimiento del Token
//====================================
//60 segundos
//60 minutos
//60 horas
//30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 *24 *40;
//====================================
//SEED de autenticaión
//====================================
process.env.SEED= process.env.SEED || 'este-es-el-sedd-desarrollo';
//SEED DE RESET CONTRASEÑA
process.env.JWTSecretReset = process.env.JWTSecretReset || 'BDPEK@123'
