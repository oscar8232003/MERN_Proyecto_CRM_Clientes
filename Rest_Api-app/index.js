const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "variables.env" });

// Cors permite que un cliente se conecta a otro servidor para el intercambio de recursos
const cors = require("cors");

//Conectar mongo
mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

//Crear el servidor
const app = express();

//Estaticos
app.use(express.static("uploads"));

//Habilitar bodyparser, este tiene que estar SIEMPRE antes de las RUTAS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Definir un dominio para poder mandar el proyecto a produccion
//El withelist define las urls a las cuales se tiene permitido ingresar sus peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    //Revisar si la peticion viene de un servidor que esta en whitelist
    const existe = whitelist.some(dominio => dominio === origin);
    if (existe) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  }
};

// Habilitar cors
app.use(cors(corsOptions));

//Agregar las rutas
app.use("/", routes());

//Variable del host
const host = process.env.HOST || "0.0.0.0";
const port = 5000;

app.listen(port, host, () => {
  console.log("el servidor esta funcionando en el puerto " + port);
});

//Puerto del proyecto
//app.listen(5000);

//Enlace al git
//https://github.com/juanpablogdl/restapis_crm
