// Capas del fondo, de atrás hacia adelante.
// depth: píxeles máximos de desplazamiento con el mouse (más alto = se siente más cerca).
// fit: object-fit de la imagen. fade: difumina bordes derecho e inferior. bleed: px extra por arriba/izquierda para que no se vean bordes al moverse.
// class: clase extra para posicionar/estilar la capa desde el CSS de una página.
// Un post puede reemplazar estas capas definiendo `backdrop:` en su front matter.
module.exports = [
  { src: "/assets/img/nana-hachi-dithered.png", depth: 10, fit: "cover", position: "center 30%", fade: true, bleed: 40 },
  { src: "/assets/img/grid.svg", depth: 18, fit: "none", position: "0 0" }
];
