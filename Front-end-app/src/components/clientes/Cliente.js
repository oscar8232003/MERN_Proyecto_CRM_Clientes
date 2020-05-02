import React from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import {
  verificacionToken,
  verificacionToken2,
  getToken
} from "../../config/jwt";

const Cliente = ({ cliente, consultarAPI, history }) => {
  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  //const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken2();
  console.log("1° primero");
  //Eliminar Cliente
  const eliminarCliente = id => {
    Swal.fire({
      title: "Estas de seguro de eliminar este cliente?",
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
          .delete(`/clientes/${id}`, {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          })
          .then(response => {
            consultarAPI();
            Swal.fire("Listo!", "El cliente ha sido eliminado", "success");
          })
          .catch(response => {
            Swal.fire("Lo siento!", "El cliente no pudo eliminarse", "error");
            if (verificar.error) {
              history.push("/iniciar-sesion");
            }
          });
      }
    });
  };

  return (
    <li className="cliente">
      {console.log("2° segundo")}
      <div className="info-cliente">
        <p className="nombre">{`${cliente.nombre} ${cliente.apellido}`}</p>
        <p className="empresa">{cliente.empresa}</p>
        <p>{cliente.email}</p>
        <p>Tel: {cliente.telefono}</p>
      </div>
      <div className="acciones">
        <Link to={`/clientes/editar/${cliente._id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Cliente
        </Link>
        <Link to={`/pedidos/nuevo/${cliente._id}`} className="btn btn-amarillo">
          <i className="fas fa-plus"></i>
          Nuevo Pedido
        </Link>
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={() => eliminarCliente(cliente._id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
};

export default withRouter(Cliente);
