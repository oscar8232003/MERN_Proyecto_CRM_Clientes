//Modelos
const Productos = require("../Models/Productos");

const multer = require("multer");
const shortid = require("shortid");

const configuracionMulter = {
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../uploads/");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    }
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato No válido"));
    }
  }
};

// pasar la configuración y el campo
const upload = multer(configuracionMulter).single("imagen");

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
  upload(req, res, function(error) {
    if (error) {
      res.json({ mensaje: error });
    }
    return next();
  });
};

//POST '/productos'
exports.nuevoProducto = async (req, res, next) => {
  const producto = new Productos(req.body);
  console.log(req.body);
  try {
    if (req.file) {
      producto.imagen = req.file.filename;
    }
    await producto.save();
    res.json({ mensaje: "Se agrego un nuevo Producto" });
  } catch (error) {
    console.log(error);
    return next();
  }
};

//GET '/productos'
exports.mostrarProductos = async (req, res, next) => {
  try {
    const productos = await Productos.find({});
    return res.json(productos);
  } catch (e) {
    console.log(e);
    return next();
  }
};

//GET '/productos/:id'
exports.mostrarProducto = async (req, res, next) => {
  try {
    const producto = await Productos.findById(req.params.id);
    return res.json(producto);
  } catch (error) {
    res.json({ mensaje: "No se encuentra dicho producto" });
    return next();
  }
};

//PUT '/productos/:id'
exports.actualizarProducto = async (req, res, next) => {
  try {
    //Construir el nuevo producto
    let nuevoProducto = req.body;

    //verificar si hay imagen nueva
    if (req.file) {
      nuevoProducto.imagen = req.file.filename;
    } else {
      let productoAnterior = await Productos.findById(req.params.id);
      nuevoProducto.imagen = productoAnterior.imagen;
    }

    let producto = await Productos.findByIdAndUpdate(
      { _id: req.params.id },
      nuevoProducto,
      {
        new: true
      }
    );
    res.json(producto);
  } catch (error) {
    console.log(error);
    return next();
  }
};

//DELETE '/productos/:id'
exports.eliminarProducto = async (req, res, next) => {
  try {
    await Productos.findByIdAndDelete({ _id: req.params.id });
    return res.json({ mensaje: "Producto eliminado con exito" });
  } catch (error) {
    console.log(error);
    return next();
  }
};

//POST '/productos/buscar/:query'
exports.buscarProducto = async (req, res, next) => {
  const parametro = req.params.query;
  try {
    const productosFiltrados = await Productos.find({
      nombre: new RegExp(parametro, "i")
    });
    return res.json(productosFiltrados);
  } catch (error) {
    res.json(error);
    return next();
  }
};
