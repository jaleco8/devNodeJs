const milisegundosAMinutosYSegundos = (milisegundos) => {
  const minutos = parseInt(milisegundos / 1000 / 60);
  milisegundos -= minutos * 60 * 1000;
  const segundos = milisegundos / 1000;
  return `${minutos}:${segundos}`;
};

module.exports = milisegundosAMinutosYSegundos;