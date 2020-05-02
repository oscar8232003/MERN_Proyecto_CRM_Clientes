export const urlsLibres = () => {
  const urls = ["/iniciar-sesion", "/404", "/registro"];
  return urls;
};

export const verificarUrl = (url, arrayUrls) => {
  let validador = false;
  for (let x of arrayUrls) {
    if (x === url) {
      validador = true;
    }
  }
  return validador;
};
