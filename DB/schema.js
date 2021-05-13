const {Sequelize, Model, DataTypes} = require('sequelize');
const CONFIG = require('../index.json')

// Option 1: Passing a connection URI
const connectString = CONFIG.database.sequelizeConnection
console.log( CONFIG.database.sequelizeConnection);
const sequelize = new Sequelize(connectString) 

const configModul ={
    timestamps:false,
    freezeTableName:true
}

/*-------------------------------------------------------------------*/
const Persona =  sequelize.define('persona',{
  id_persona :{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true,
  },
  nombre:  Sequelize.STRING(500),
  apellidos:Sequelize.STRING(500),
  email: {
      type:Sequelize.STRING(500),
      unique:true,
      allowNull: false,
  } ,
  role: {
    type: Sequelize.ENUM('USER ROLE','ADMIN ROLE'),
    defaultValue:"User Role"  , 
  },
  password: Sequelize.STRING(500),
  resetToken: Sequelize.STRING(5000),
  imageUrl: Sequelize.STRING(150)
},configModul)
/*-----------------------------------------es como este en la ddbb - -------------------------*/
const Estudiante = sequelize.define('estudiante',{
    id_estudiante:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
},configModul)
Persona.hasOne(Estudiante,{foreignKey:"id_persona"});
/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Instructor = sequelize.define('Instructor',{
    id_instructor:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    total_estudiante:{
        type: Sequelize.INTEGER,
    }
},configModul)

/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Categoria = sequelize.define('Categoria',{
     id_categoria:{
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement:true,
     },
     nom_cate:{
         type: Sequelize.STRING(500)
     }
},configModul)

/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Modulo = sequelize.define("Modulo",{
      id_modulo:{
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement:true,
      },
       
      nom_modulo:{
          type: Sequelize.STRING(500)
      }
},configModul)

/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Carrito = sequelize.define("Carrito",{
    id_carrito :{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    precio_total:Sequelize.DECIMAL,
    fecha_carrito: Sequelize.DATE,
},configModul)



/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Comentario = sequelize.define('Comentario',{
    id_comentario:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    desc_curso:{
        type: Sequelize.STRING,
    },

    fecha_comentario:{
      type: Sequelize.DATE,
    },
    ruta_video:{
        type: Sequelize.STRING(500),

    },
    id_video:{
        type: Sequelize.INTEGER,
    },
    id_persona:{
        type: Sequelize.INTEGER,
    },
    id_curso:{
        type: Sequelize.INTEGER,
    }
},configModul)

/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Curso = sequelize.define('Curso',{
    id_curso:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    nom_curso: Sequelize.STRING(500),
    des_curso: Sequelize.STRING(500),
    dura_curso: Sequelize.DECIMAL,
    precio_curso: Sequelize.DOUBLE,
    fecha_curso: Sequelize.DATE,
    calificacion: Sequelize.INTEGER,
    imagen:Sequelize.STRING(500),
    public_id:Sequelize.STRING(500),

},configModul)

/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

const Video = sequelize.define('Video',{
    id_video:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom_video:Sequelize.STRING(500),
    dura_video: Sequelize.DECIMAL,
    url_file: Sequelize.STRING(500),
    public_id: Sequelize.STRING(500)
},configModul)

const Persona_curso = sequelize.define('Persona_curso',{
},configModul)

const Detalle_carrito = sequelize.define('Detalle_carrito',{
},configModul)

Persona.hasMany(Comentario,{foreignKey:"id_persona"});

// /*---------------------RELATIONS----------------------------*/

// /*PERSONA -- CURSO  {persona_curso}  */
// Persona.belongsToMany(Curso, { through: 'Persona_curso',foreignKey:'id_curso' });
// Curso.belongsToMany(Persona, { through: 'Persona_curso' ,foreignKey:'id_persona'});

// //CARRITO -- CURSO  {detalle_carrito}
// Curso.belongsToMany(Carrito, { through: 'Detalle_carrito',foreignKey:'id_carrito' });
// Carrito.belongsToMany(Curso, { through: 'Detalle_carrito', foreignKey:'id_curso' });

//  sequelize.sync({alter:true})

// //PERSONA -> INSTRUCTOR
// Persona.hasOne(Instructor,{foreignKey:"id_persona"});












// //ESTUDIANTE -> COMENTARIO
// Estudiante.hasMany(Comentario,{foreignKey:"id_estudiante"});

// //CATEGORIA-> CURSO
// Categoria.hasMany(Curso,{foreignKey:"id_categoria"});

// //CURSO-> video
// Curso.hasMany(Video,{foreignKey:"id_curso"});

// //MODULO-> video
// Modulo.hasMany(Video,{foreignKey:"id_modulo"});

/*-------------------------------------------------*/

/* Verificando conección*/

// Persona.sync({ alter: true });
// Instructor.sync({ alter: true });
// Estudiante.sync({ alter: true }); 
// Comentario.sync({ alter: true });
// Categoria.sync({ alter: true });
// Carrito.sync({ alter: true });
// Modulo.sync({ alter: true });
// Curso.sync({ alter: true });
// Video.sync({alter:true})



module.exports={
    Persona,
    Video,
    Estudiante,
    Comentario,
    Curso,
}

try {
   sequelize.authenticate()
    console.log("Conección con éxito");
} catch (error) {
    console.log("No se pudo conectar",error);
}