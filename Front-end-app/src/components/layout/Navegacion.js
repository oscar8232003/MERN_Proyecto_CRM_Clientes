import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { verificacionToken } from "../../config/jwt";

const Navegacion = props => {
  const [error, setError] = useState(null);

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);

  useEffect(() => {
    if (verificar.error && error == null) {
      setError(verificar);
    }
    if (!verificar.error && error !== null) {
      setError(null);
    }
  }, [props.path]);

  return (
    <>
      {!error && (
        <aside className="sidebar col-3">
          <h2>Administración</h2>

          <nav className="navegacion">
            <Link to={"/"}>
              <i className="fas fa-user-friends"></i> Clientes
            </Link>
            <Link to={"/productos"}>
              <i className="fab fa-product-hunt"></i> Productos
            </Link>
            <Link to={"/pedidos"}>
              <i className="fas fa-pen"></i> Pedidos
            </Link>
          </nav>
        </aside>
      )}
    </>
  );
};

export default withRouter(Navegacion);
