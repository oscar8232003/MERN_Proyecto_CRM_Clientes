import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { verificacionToken } from "../../config/jwt";
import { withRouter } from "react-router-dom";

//Import de componentes
import Pedido from "./Pedido";

const Pedidos = props => {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  const consultarAPI = async () => {
    const resultado = await clienteAxios.get("/pedidos", {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    });
    setPedidos(resultado.data);
  };

  useEffect(() => {
    if (verificar.error) {
      props.history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
    consultarAPI();
  }, []);

  return (
    <>
      <h2>Pedidos</h2>

      <ul className="listado-pedidos">
        {pedidos.map(pedido => (
          <>
            <h2>pedido</h2>
            <Pedido pedido={pedido} key={pedido._id}></Pedido>
          </>
        ))}
      </ul>
    </>
  );
};

export default withRouter(Pedidos);
