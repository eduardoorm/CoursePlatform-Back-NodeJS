const jwt = require('jsonwebtoken')
// =========================
// Verificar Admin
// ========================


 let verificaAdmin = (req,res,next)=>{
    const token = req.get('Authorization');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:"token Invalido" // Busca tu repo de git de el bakcend
                }
            })
        }
        const {role} = decoded.usuario;
        console.log(role);
        if(!(role === "ADMIN ROLE")){
            return res.status(401).json({
                ok:false,
                err:{
                    message: "Usted no tiene permiso para acceder"
                }
            })
        }

        next();
    }) 
}

module.exports={
    verificaAdmin
}