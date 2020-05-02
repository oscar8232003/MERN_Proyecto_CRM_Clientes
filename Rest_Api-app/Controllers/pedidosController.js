//Modelos
const Pedidos = require("../Models/Pedidos");

//POST ''
exports.nuevoPedido = async (req, res, next) => {
  const pedidos = new Pedidos(req.body);
  try {
    await pedidos.save();
    res.json({ mensaje: "Se agrego un nuevo pedido" });
  } catch (e) {
    console.log(e);
    next();
  }
};

//GET '/pedidos'
exports.mostrarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.find({})
      .populate("cliente")
      .populate({
        path: "pedido.producto",
        model: "Productos"
      });
    res.json(pedidos);
  } catch (e) {
    console.log(e);
    next();
  }
};

//GET '/pedidos/:id'
exports.mostrarPedido = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.findById(req.params.id)
      .populate("cliente")
      .populate({
        path: "pedido.producto",
        model: "Productos"
      });
    res.json(pedidos);
  } catch (e) {
    res.json({ mensaje: "Ese pedido no existe" });
    next();
  }
};

//PUT '/pedidos/:id'
exports.actualizarPedido = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true
      }
    )
      .populate("cliente")
      .populate({
        path: "pedido.producto",
        model: "Productos"
      });
    res.json(pedidos);
  } catch (e) {
    console.log(e);
    next();
  }
};

//DELETE '/pedidos/:id'
exports.eliminarPedido = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.findByIdAndDelete({ _id: req.params.id });
    res.json({ mensaje: "Pedido eliminado" });
  } catch (e) {
    console.log(e);
    next();
  }
};
