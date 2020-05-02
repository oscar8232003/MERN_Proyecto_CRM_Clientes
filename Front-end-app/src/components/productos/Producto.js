import React from "react";
import { Link, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { verificacionToken } from "../../config/jwt";

const Producto = ({ producto, consultarAPI, history }) => {
  //Destructuring
  const { _id, nombre, precio, imagen } = producto;
  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  //Funcion para eliminar producto
  const eliminarProducto = id => {
    Swal.fire({
      title: "Estas de segur@ de eliminar este producto?",
      text: "Si lo eliminas, no volveras a recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borrar",
      cancelButtonText: "Me arrepenti"
    }).then(result => {
      if (result.value) {
        clienteAxios
          .delete(`/productos/${id}`, {
            headers: {
              Authorization: `Bearer ${Token}`
            }
          })
          .then(response => {
            consultarAPI();
            Swal.fire("Listo!", "El producto ha sido eliminado", "success");
          })
          .catch(response => {
            Swal.fire("Lo siento!", "El producto no pudo eliminarse", "error");
            if (verificar.error) {
              history.push("/iniciar-sesion");
            }
          });
      }
    });
  };

  return (
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{nombre}</p>
        <p className="precio">${precio}</p>
        {imagen ? (
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`}
            alt={nombre}
          />
        ) : null}
      </div>
      <div className="acciones">
        <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarProducto(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
};

export default withRouter(Producto);
