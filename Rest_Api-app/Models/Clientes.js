const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creacion del Schema
//Para opciones de Squema https://mongoosejs.com/docs/schematypes.html
//Para poder utilizar esta BD interna ir a la seccion de bd
//https://docs.google.com/document/d/1v5nNPXXfRvx8i9guWJbSGVo6dffO-QWzSJaiM0t35HY/edit#heading=h.3rexswjixpf
const clientesSchema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  apellido: {
    type: String,
    trim: true
  },
  empresa: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  }
});

//Exportacion del modelo
module.exports = mongoose.model("Clientes", clientesSchema);
