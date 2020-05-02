//Modelos
const Clientes = require("../Models/Clientes");

//POST '/clientes'
exports.nuevoCliente = async (req, res, next) => {
  console.log(req.body);
  const cliente = new Clientes(req.body);

  try {
    // almacenar el registro
    await cliente.save();
    res.json({ mensaje: "Se agrego un nuevo cliente" });
  } catch (error) {
    // si hay un error, console.log y next
    res.send(error);
    next();
  }
};

//GET '/clientes'
exports.mostrarClientes = async (req, res) => {
  try {
    const clientes = await Clientes.find({});
    res.json(clientes);
  } catch (error) {
    res.send(error);
    next();
  }
};

//GET '/clientes/:id'
exports.mostrarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findById(req.params.id);
    res.json(cliente);
  } catch (e) {
    res.json({ mensaje: "Ese cliente no existe" });
    next();
  }
};

//PUT '/clientes/:id'
exports.actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true
      }
    );

    res.json(cliente);
  } catch (error) {
    res.json({ mensaje: "El cliente no se pudo modificar" });
  }
};

//DELETE '/clientes/:id'
exports.eliminarCliente = async (req, res, next) => {
  try {
    const cliente = await Clientes.findOneAndDelete({ _id: req.params.id });
    res.json({ mensaje: "El cliente se ha eliminado" });
  } catch (error) {
    res.send(error);
    next();
  }
};
