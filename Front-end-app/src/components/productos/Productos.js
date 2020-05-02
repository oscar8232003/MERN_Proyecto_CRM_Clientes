import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { Link, withRouter } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { verificacionToken } from "../../config/jwt";

//Componente Producto
import Producto from "./Producto";

const Productos = props => {
  //Estados
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Traer Productos
  const consultarAPI = async () => {
    const productosData = await clienteAxios.get("/productos", {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    });
    setProductos(productosData.data);
  };

  //useEffect
  useEffect(() => {
    if (verificar.error) {
      props.history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
    consultarAPI();
  }, []);

  if (!productos.length) return <Spinner />;

  return (
    <>
      <h2>Productos</h2>

      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos"></ul>
      {productos.map(producto => (
        <Producto
          producto={producto}
          key={producto._id}
          consultarAPI={consultarAPI}
        ></Producto>
      ))}
    </>
  );
};

export default withRouter(Productos);
