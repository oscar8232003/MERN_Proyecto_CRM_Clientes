import jwt from "jsonwebtoken";
import Swal from "sweetalert2";

export const tipos_error = error => {
  if (error === "TokenExpiredError") {
    return "Su Sesion ha Expirado";
  }
  if (error === "JsonWebTokenError") {
    return "Lo siento, hubo un error";
  }
  if (error === "NotBeforeError") {
    return "Lo siento, hubo un error";
  }
};
export const alertaError = error => {
  let timerInterval;
  Swal.fire({
    icon: "error",
    title: tipos_error(error),
    timer: 5000,
    timerProgressBar: true,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        const content = Swal.getContent();
        if (content) {
          const b = content.querySelector("b");
          if (b) {
            b.textContent = Swal.getTimerLeft();
          }
        }
      }, 100);
    },
    onClose: () => {
      clearInterval(timerInterval);
    }
  });
};
export const verificacionToken = Token => {
  try {
    const respuesta = jwt.verify(Token, "LlaveSecreta");
    return respuesta;
  } catch (err) {
    return { error: err.name };
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const verificacionToken2 = () => {
  const token = localStorage.getItem("token");
  try {
    const respuesta = jwt.verify(token, "LlaveSecreta");
    return respuesta;
  } catch (err) {
    return { error: err.name };
  }
};
