import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import {
  verificacionToken,
  verificacionToken2,
  getToken
} from "../../config/jwt";

const NuevoCliente = ({ history }) => {
  //Estados
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: ""
  });
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  //const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken2();

  const actualizarState = e => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (verificar.error) {
      history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
  }, []);

  //Añade en la REST API un cliente nuevo
  const agregarCliente = e => {
    e.preventDefault();

    //Enviar peticion
    clienteAxios
      .post("/clientes", cliente, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(response => {
        //Validar errores
        if (response.data.code) {
          Swal.fire({
            title: "Hubo un error",
            text: "No se pudo agregar el cliente al sistema",
            icon: "error",
            confirmButtonText: "Bueno",
            showCloseButton: true
          }).then(() => {
            //Redireccionar
            history.push("/");
          });
        } else {
          Swal.fire({
            title: "Cliente Agregado al sistema",
            text: "Se agrego correctamente el cliente al sistema",
            icon: "success",
            confirmButtonText: "Perfecto",
            showCloseButton: true
          }).then(() => {
            //Redireccionar
            history.push("/");
          });
        }
      });
  };

  const validarCliente = () => {
    //Destructuring
    const { nombre, apellido, email, empresa, telefono } = cliente;
    let valido = true;
    //Revisar el contenido en el state
    valido =
      !nombre.length ||
      !apellido.length ||
      !email.length ||
      !empresa.length ||
      !telefono.length;

    return valido;
  };

  return (
    <>
      <h2>Nuevo cliente</h2>
      <form onSubmit={agregarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="text"
            placeholder="Teléfono Cliente"
            name="telefono"
            onChange={actualizarState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Cliente"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(NuevoCliente);
