import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { verificacionToken } from "../../config/jwt";

const EditarProducto = props => {
  //Obtener id del producto
  const { id } = props.match.params;

  //States
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    imagen: ""
  });
  const [archivo, setArchivo] = useState("");
  const [usuario, setUsuario] = useState({});

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Consultar la API
  const consultarAPI = async () => {
    const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
      headers: {
        Authorization: `Bearer ${Token}`
      }
    });
    setProducto(productoConsulta.data);
  };

  useEffect(() => {
    if (verificar.error) {
      props.history.push("/iniciar-sesion");
    }
    setUsuario(verificar);
    consultarAPI();
  }, []);

  //Editar el producto
  const handleSubmit = async e => {
    e.preventDefault();
    if (!producto.nombre || !producto.precio || !producto.imagen) {
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
      const res = await clienteAxios.put(
        `/productos/${producto._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Token}`
          }
        }
      );

      // Lanzar una alerta
      if (res.status === 200) {
        Swal.fire("Editado Correctamente", res.data.mensaje, "success");
      }

      // redireccionar
      props.history.push("/productos");
    } catch (error) {
      console.log(error);
      // lanzar alerta
      Swal.fire({
        icon: "error",
        title: "Hubo un error",
        text: "Vuelva a intentarlo"
      });
      if (verificar.error) {
        props.history.push("/iniciar-sesion");
      }
    }
  };

  //Leer informacion de los inputs de texto/enteros
  const leerInformacionProducto = e => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  //Coloca la imagen en el state
  const leerArchivo = e => {
    setArchivo(e.target.files[0]);
  };

  //Spinner de Carga
  if (!producto.nombre) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Editar Producto</h2>

      <form onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={leerInformacionProducto}
            defaultValue={producto.nombre}
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
            defaultValue={producto.precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {producto.imagen ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${producto.imagen}`}
              alt={producto.imagen}
              width="300"
            />
          ) : null}
          <input
            type="file"
            name="imagen"
            onChange={leerArchivo}
            onChange={leerArchivo}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Producto"
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(EditarProducto);
