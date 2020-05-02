import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import { verificacionToken } from "../../config/jwt";

const NuevoProducto = ({ history }) => {
  //Estados
  const [producto, setProducto] = useState({
    nombre: "",
    precio: ""
  });
  const [archivo, setArchivo] = useState("");
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Leer los datos del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    if (!producto.nombre || !producto.precio || !archivo) {
      Swal.fire({
        icon: "error",
        title: "Lo siento, todos los campos deben estar llenos",
        text: ""
      });
      return null;
    }

    // crear un formdata
    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);

    // almacenarlo en la BD
    try {
      const res = await clienteAxios.post("/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Token}`
        }
      });

      // Lanzar una alerta
      if (res.status === 200) {
        Swal.fire("Agregado Correctamente", res.data.mensaje, "success");
      }

      // redireccionar
      history.push("/productos");
    } catch (error) {
      console.log(error);
      // lanzar alerta
      Swal.fire({
        icon: "error",
        title: "Hubo un error",
        text: "Vuelva a intentarlo"
      });

      if (verificar.error) {
        history.push("/iniciar-sesion");
      }
    }
  };

  //Leer informacion de los productos
  const leerInformacionProducto = async e => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  //Coloca la imagen en el state
  const leerArchivo = e => {
    setArchivo(e.target.files[0]);
  };

  //Validar que el formulario no este vacio
  const validarFormulario = () => {
    let validador = !producto.nombre || !producto.precio || !archivo;
    return validador;
  };

  //useEffect
  useEffect(() => {
    if (verificar.error) {
      history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
  }, []);

  return (
    <>
      <h2>Nuevo Producto</h2>

      <form onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="0.01"
            placeholder="Precio"
            onChange={leerInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input type="file" name="imagen" onChange={leerArchivo} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Producto"
            disabled={validarFormulario()}
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(NuevoProducto);
