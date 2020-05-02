import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { verificacionToken } from "../../config/jwt";
import { urlsLibres, verificarUrl } from "../../config/urlsLibres";

const Header = ({ location, history, path, setPath }) => {
  const [error, setError] = useState(null);

  //Funcion para cerrar sesion
  const cerrarSesion = () => {
    localStorage.setItem("token", "");
    history.push("/iniciar-sesion");
  };

  //Traemos el Token del localStorage, tiene que ser directo sino toma el token expirado
  const Token = localStorage.getItem("token");
  //Verificamos el Token si es valido o no
  const verificar = verificacionToken(Token);
  //Verificamos si la url actual esta dentro de las urls Libres
  let urlLibre = verificarUrl(location.pathname, urlsLibres());

  useEffect(() => {
    if (verificar.error && error == null) {
      setError(verificar);
      if (!urlLibre) {
        history.push("/iniciar-sesion");
      }
    }
    if (!verificar.error && error !== null) {
      setError(null);
    }
  }, [path]);

  if (path !== location.pathname) {
    setPath(location.pathname);
  }

  return (
    <header className="barra">
      <div className="contenedor">
        <div className="contenido-barra">
          <h1>CRM - Administrador de Clientes</h1>
          {!error && !urlLibre ? (
            <button
              type="button"
              className="btn btn-rojo"
              onClick={cerrarSesion}
            >
              <i className="far fa-times-circle"></i> Cerrar Sesion
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
