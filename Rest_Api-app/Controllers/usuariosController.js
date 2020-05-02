const Usuario = require("../models/Usuarios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registrarUsuario = async (req, res) => {
  //Leer los datos del usuario y guardarlos en el model
  const usuario = new Usuario(req.body);
  usuario.password = await bcrypt.hash(req.body.password, 12);
  try {
    await usuario.save();
    res.json({ mensaje: "Usuario Creado Correctamente" });
  } catch (e) {
    console.log(e);
    res.json({ mensaje: "hubo un error" });
  }
};

exports.autenticarUsuario = async (req, res, next) => {
  //Buscar el usuario
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    //El usuario buscado no existe
    res.status(401).json({ mensaje: "Ese usuario no existe" });
    return next();
  } else {
    //El usuario existe
    //Verificar si el pass es valido o no
    if (!bcrypt.compareSync(password, usuario.password)) {
      //Si la contraseña no es valida
      res.status(401).json({ mensaje: "Password incorrecta" });
      return next();
    } else {
      //Si la pass es correcta
      const token = jwt.sign(
        {
          email,
          nombre: usuario.nombre,
          _id: usuario._id
        },
        "LlaveSecreta",
        {
          expiresIn: 180
        }
      );
      res.json({ token });
    }
  }
};
