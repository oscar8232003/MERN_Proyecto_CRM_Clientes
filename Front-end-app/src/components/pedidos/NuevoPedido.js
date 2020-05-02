import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import { verificacionToken } from "../../config/jwt";

//Componentes
import Error from "../layout/Error";
import ProductoPedido from "./ProductoPedido";

const NuevoPedido = props => {
  //State
  const [cliente, setCliente] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  //const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Traer id del cliente
  const {
    match: {
      params: { id }
    }
  } = props;

  //Consultar la API para traer datos del cliente
  const consultarApiCliente = async () => {
    try {
      const clienteData = await clienteAxios.get(`/clientes/${id}`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      setCliente(clienteData.data);
    } catch (e) {
      setCliente({});
    }
  };

  //Consultar la API para traer productos consultados
  const consultarApiProductos = async prod => {
    try {
      const productosData = await clienteAxios.post(
        `/productos/busqueda/${prod}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        }
      );

      if (productosData.data[0]) {
        let productoResultado = productosData.data[0];
        // agregar la llave "producto" (copia de id)
        productoResultado.producto = productosData.data[0]._id;
        productoResultado.cantidad = 0;
        setProductos([...productos, productoResultado]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lo siento no hay resultados para esa busqueda"
        });
      }
    } catch (e) {
      setProductos([]);
    }
  };

  //UseEffect
  useEffect(() => {
    if (verificar.error) {
      props.history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
    consultarApiCliente();
  }, []);

  useEffect(() => {
    if (verificar.error) {
      props.history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
    actualizarTotal();
  }, [productos]);

  //Funcion para buscar productos
  const buscarProducto = e => {
    e.preventDefault();
    consultarApiProductos(busqueda);
  };

  //Funcion para actualizar la cantidad de productos
  const disminuirProductos = i => {
    //Copiar el arreglo original
    const todosProductos = [...productos];

    //Validamos si esta en 0, no puede bajar de 0
    if (todosProductos[i].cantidad === 0) return;

    //decremento
    todosProductos[i].cantidad--;

    //Almacenarlo en el state
    setProductos(todosProductos);
  };
  const aumentarProductos = i => {
    //Copiar el arreglo original
    const todosProductos = [...productos];

    //aumento
    todosProductos[i].cantidad++;

    //Almacenarlo en el state
    setProductos(todosProductos);
  };

  //Actualizar el total a pagar
  const actualizarTotal = () => {
    if (productos.length === 0) {
      setTotal(0);
      return null;
    }

    let nuevoTotal = 0;
    productos.map(prod => (nuevoTotal += prod.cantidad * prod.precio));
    setTotal(nuevoTotal);
  };

  //Elimina un Producto
  const eliminarProductoPedido = id => {
    const nuevosProductos = productos.filter(prod => prod._id != id);
    setProductos(nuevosProductos);
  };

  //Realizar Pedido
  const realizarPedido = async e => {
    e.preventDefault();
    //Construir el objeto
    const pedido = {
      cliente: id,
      pedido: productos,
      total
    };

    //Alamcenar en la bd
    const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido, {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    });

    //leer resultado
    if (resultado.status === 200) {
      Swal.fire({
        icon: "success",
        title: "El pedido ha sido guardado"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Lo siento, hubo un error"
      });
    }

    //Redireccionar
    props.history.push("/pedidos");
  };

  //Si el cliente no existe
  if (!cliente.nombre) {
    return <Error />;
  }

  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>Nombre: {`${cliente.nombre} ${cliente.apellido}`}</p>
        <p>Telefono: {cliente.telefono}</p>
      </div>

      <form onSubmit={buscarProducto}>
        <legend>Busca un Producto y agrega una cantidad</legend>

        <div className="campo">
          <label>Productos:</label>
          <input
            type="text"
            placeholder="Nombre Productos"
            name="productos"
            required
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <input
          type="submit"
          className="btn btn-azul btn-block"
          value="Buscar Producto"
        />
      </form>

      <ul className="resumen">
        {productos.map((prod, index) => (
          <ProductoPedido
            index={index}
            key={prod.producto}
            producto={prod}
            disminuirProductos={disminuirProductos}
            aumentarProductos={aumentarProductos}
            eliminarProductoPedido={eliminarProductoPedido}
          />
        ))}
      </ul>
      <p className="total">
        Total a Pagar: <span>${total}</span>
      </p>
      {total > 0 ? (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido"
          />
        </form>
      ) : null}
    </>
  );
};

export default withRouter(NuevoPedido);
