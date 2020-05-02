import React, { useState, useRef, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import { verificacionToken } from "../../config/jwt";

const EditarCliente = props => {
  //Obtener id
  const { id } = props.match.params;

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
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Funcion para traer datos de la api
  const traerDatos = async () => {
    const clienteConsulta = await clienteAxios.get(`/clientes/${id}`, {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    });
    setCliente(clienteConsulta.data);
  };

  //Traer datos de la api
  useEffect(() => {
    if (verificar.error) {
      props.history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
    traerDatos();
  }, []);

  /*2° Opcion 
  //Use ref para tomar los datos del formulario
  const nombreRef = useRef("");
  const apellidoRef = useRef("");
  const emailRef = useRef("");
  const empresaRef = useRef("");
  const telefonoRef = useRef("");
    */

  //Codigo de actualizacion del cliente
  const actualizarCliente = e => {
    e.preventDefault();

    //Enviar peticion para la actualizacion
    clienteAxios
      .put(`/clientes/${cliente._id}`, cliente, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      })
      .then(response => {
        Swal.fire({
          title: "Cliente Modificado",
          text: "Se Modifico correctamente el cliente al sistema",
          icon: "success",
          confirmButtonText: "Perfecto",
          showCloseButton: true
        }).then(() => {
          //Redireccionar
          props.history.push("/");
        });
      })
      .catch(error => {
        Swal.fire({
          title: "Hubo un error",
          text: "No se pudo modificar el cliente",
          icon: "error",
          confirmButtonText: "Bueno",
          showCloseButton: true
        }).then(() => {
          //Redireccionar
          props.history.push("/");
        });
      });
  };

  //Validacion del formulario
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

  //Actualizar el state
  const actualizarState = e => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <h2>Editar cliente</h2>
      <form onSubmit={actualizarCliente}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Cliente"
            name="nombre"
            //ref={nombreRef}
            defaultValue={cliente.nombre}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            placeholder="Apellido Cliente"
            name="apellido"
            //ref={apellidoRef}
            defaultValue={cliente.apellido}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            placeholder="Empresa Cliente"
            name="empresa"
            //ref={empresaRef}
            defaultValue={cliente.empresa}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email Cliente"
            name="email"
            //ref={emailRef}
            defaultValue={cliente.email}
            onChange={actualizarState}
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="text"
            placeholder="Teléfono Cliente"
            name="telefono"
            //ref={telefonoRef}
            defaultValue={cliente.telefono}
            onChange={actualizarState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={validarCliente()}
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(EditarCliente);
