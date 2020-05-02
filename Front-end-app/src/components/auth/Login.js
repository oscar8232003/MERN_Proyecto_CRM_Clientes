import React, { useState } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";

const Login = props => {
  const [credenciales, setCredenciales] = useState({});

  //Leer los datos del formulario
  const leerDatos = e => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  //Iniciar sesion en el servidor
  const iniciarSesion = async e => {
    e.preventDefault();
    //Autenticar el usuario
    try {
      const respuesta = await clienteAxios.post("iniciar-sesion", credenciales);

      //Extraer el token y colocarlo en localstorage
      const { token } = respuesta.data;
      localStorage.setItem("token", token);

      //redireccion
      props.history.push("/");
    } catch (error) {
      //Atento con esta parte, el error.response es de la aplicacion
      //El otro error es de Cors
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: error.response.data.mensaje
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Hubo un error"
        });
      }
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form onSubmit={iniciarSesion}>
          <div className="campo">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email para inicio de sesion"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="campo">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={leerDatos}
            />
          </div>
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn btn-verde btn-block"
          />
        </form>
      </div>
    </div>
  );
};

export default withRouter(Login);
