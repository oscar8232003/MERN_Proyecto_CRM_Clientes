import React from "react";

const pedido = props => {
  const { _id, cliente, pedido, total } = props.pedido;

  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {_id}</p>
        <p className="nombre">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {pedido.map(articulos => (
              <li key={_id + articulos.producto._id}>
                <p>{articulos.producto.nombre}</p>
                <p>Precio: ${articulos.producto.precio}</p>
                <p>Cantidad: {articulos.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="total">Total: ${total} </p>
      </div>
      <div className="acciones">
        <a href="#" className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Pedido
        </a>

        <button type="button" className="btn btn-rojo btn-eliminar">
          <i className="fas fa-times"></i>
          Eliminar Pedido
        </button>
      </div>
    </li>
  );
};

export default pedido;
