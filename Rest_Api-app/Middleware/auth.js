const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Autorizacion por el header
  //El front-end envia el token por medio de header con la key de Authorization y de value el token
  const authHeader = req.get("Authorization");

  //Aqui se verifica si se envio el token
  if (!authHeader) {
    const error = new Error("No autenticado, no hay JWT");
    error.statusCode = 401;
    throw error;
  }

  //Aqui se obtiene el token, este token se tiene que limpiar un poco para poder ser analizado
  const token = authHeader.split(" ")[1];
  let revisarToken;
  try {
    revisarToken = jwt.verify(token, "LlaveSecreta");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  //Si es un Token valido pero tiene algun problema, este es detenido aqui
  if (!revisarToken) {
    const error = new Error("No autenticado");
    error.statusCode = 401;
    throw error;
  }

  //En el caso que el token este bueno y no tengra problemas, este sigue hacia el siguiente middleware
  next();
};
