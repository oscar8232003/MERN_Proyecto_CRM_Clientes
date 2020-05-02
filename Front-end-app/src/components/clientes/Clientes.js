import React, { useEffect, useState } from "react";
import clienteAxios from "../../config/axios";
import { Link, withRouter } from "react-router-dom";
import { verificacionToken } from "../../config/jwt";

//Componentes
import Cliente from "./Cliente";

const Clientes = props => {
  //States
  const [clientes, setClientes] = useState([]);
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Consulta GET de datos
  const consultarAPI = async () => {
    try {
      const clientesConsulta = await clienteAxios.get("/clientes", {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      setClientes(clientesConsulta.data);
    } catch (e) {
      console.log(e);
    }
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
      <h2>Clientes</h2>

      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
        <i className="fas fa-plus-circle"></i> Nuevo Cliente
      </Link>

      <ul className="listado-clientes">
        {clientes.map(cliente => (
          <Cliente
            cliente={cliente}
            key={cliente._id}
            consultarAPI={consultarAPI}
          ></Cliente>
        ))}
      </ul>
    </>
  );
};

export default withRouter(Clientes);
