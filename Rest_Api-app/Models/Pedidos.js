const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pedidosSchema = new Schema({
  cliente: {
    type: Schema.ObjectId,
    ref: "Clientes"
  },
  pedido: [
    {
      productos: {
        type: Schema.ObjectId,
        ref: "Productos"
      },
      cantidad: Number
    }
  ],
  total: {
    type: Number
  }
});

module.exports = mongoose.model("Pedidos", pedidosSchema);
