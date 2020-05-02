const express = require("express");
const router = express.Router();

//Controllers
const clienteController = require("../Controllers/clienteController");
const productosController = require("../Controllers/productosController");
const pedidosController = require("../Controllers/pedidosController");
const usuariosController = require("../Controllers/usuariosController");

//Middleware para proteger las rutas
const auth = require("../Middleware/auth");

module.exports = function() {
  //Seccion de Clientes
  //Agregar nuevos clientes POST
  router.post("/clientes", auth, clienteController.nuevoCliente);
  //Obtener todos los clientes
  router.get("/clientes", auth, clienteController.mostrarClientes);
  //Obtener 1 cliente en especifico
  router.get("/clientes/:id", auth, clienteController.mostrarCliente);
  //Actualizar cliente
  router.put("/clientes/:id", auth, clienteController.actualizarCliente);
  //Eliminar cliente
  router.delete("/clientes/:id", auth, clienteController.eliminarCliente);

  //Seccion de Productos
  //Agrega nuevos Productos
  router.post(
    "/productos",
    auth,
    productosController.subirArchivo,
    productosController.nuevoProducto
  );
  //Mostrar Productos
  router.get("/productos", auth, productosController.mostrarProductos);
  //Mostrar Producto por id
  router.get("/productos/:id", auth, productosController.mostrarProducto);
  //Actualizar Producto
  router.put(
    "/productos/:id",
    auth,
    productosController.subirArchivo,
    productosController.actualizarProducto
  );
  //Eliminar Producto
  router.delete("/productos/:id", auth, productosController.eliminarProducto);
  //Buscar Producto
  router.post(
    "/productos/busqueda/:query",
    auth,
    productosController.buscarProducto
  );

  //Seccion de Pedidos
  //Agregar un pedido
  router.post("/pedidos/nuevo/:id", auth, pedidosController.nuevoPedido);
  //Mostrar Pedidos
  router.get("/pedidos", auth, pedidosController.mostrarPedidos);
  //Mostrar 1 Pedido
  router.get("/pedidos/:id", auth, pedidosController.mostrarPedido);
  //Actualizar Pedido
  router.put("/pedidos/:id", auth, pedidosController.actualizarPedido);
  //Eliminar Pedido
  router.delete("/pedidos/:id", auth, pedidosController.eliminarPedido);

  //Usuarios
  //Creacion de cuenta (en desarrollo)
  router.post("/crear-cuenta", usuariosController.registrarUsuario);
  //Inicio de Sesion
  router.post("/iniciar-sesion", usuariosController.autenticarUsuario);
  return router;
};
