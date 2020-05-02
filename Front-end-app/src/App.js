import React, { useState } from "react";

//Routing
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Layout
import Header from "./components/layout/Header";
import Navegacion from "./components/layout/Navegacion";
import Error from "./components/layout/Error";

//Clientes
import Cliente from "./components/clientes";
import NuevoCliente from "./components/clientes/NuevoCliente";
import EditarCliente from "./components/clientes/EditarCliente";

//Pedidos
import Pedidos from "./components/pedidos";
import NuevoPedido from "./components/pedidos/NuevoPedido";

//Productos
import Productos from "./components/productos";
import NuevoProducto from "./components/productos/NuevoProducto";
import EditarProducto from "./components/productos/EditarProducto";

//Auth
import Login from "./components/auth/Login";

function App() {
  //Estado para poder actualizar el path, este sirve de referencia para actualizar los componentes estaticos
  const [path, setPath] = useState("");

  return (
    <Router>
      <Header path={path} setPath={setPath} />
      <div className="grid contenedor contenido-principal">
        <Navegacion path={path} setPath={setPath}></Navegacion>

        <main className="caja-contenido col-9">
          <Switch>
            {/**Clientes */}
            <Route exact path="/" render={() => <Cliente></Cliente>} />
            <Route
              exact
              path="/clientes/nuevo"
              render={() => <NuevoCliente></NuevoCliente>}
            />
            <Route
              exact
              path="/clientes/editar/:id"
              render={() => <EditarCliente></EditarCliente>}
            />

            {/** Productos*/}
            <Route
              exact
              path="/productos"
              render={() => <Productos></Productos>}
            />
            <Route
              exact
              path="/productos/nuevo"
              render={() => <NuevoProducto></NuevoProducto>}
            />
            <Route
              exact
              path="/productos/editar/:id"
              render={() => <EditarProducto></EditarProducto>}
            />

            {/** Pedidos*/}
            <Route exact path="/pedidos" render={() => <Pedidos></Pedidos>} />
            <Route
              exact
              path="/pedidos/nuevo/:id"
              render={() => <NuevoPedido></NuevoPedido>}
            ></Route>

            {/**Auth */}
            <Route exact path={"/iniciar-sesion"} render={() => <Login />} />

            {/**Sistema */}
            <Route exact path="/404" render={() => <Error />} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
