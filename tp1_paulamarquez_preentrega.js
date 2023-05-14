let images = [  "assets/gradient1.jpg",  "assets/gradient2.jpg",  "assets/gradient3.jpg",  "assets/gradient4.jpg"];
let currentImageIndex = 0;
let img;
let gradient;
let colors = [];
let circleCount = 0; // Contador de cuántos cuadrados se han reemplazado por círculos

function preload() {
  img = loadImage(images[currentImageIndex]);
}

function setup() {
  createCanvas(600,600);
  image(img, 0, 0);

  // Crear la matriz de colores
  for (let x = 0; x < width; x++) {
    colors[x] = [];
    for (let y = 0; y < height; y++) {
      colors[x][y] = img.get(x, y);
    }
  }

  // Crear el gradiente
  gradient = createGradient(colors);

  // Dibujar los cuadrados y los círculos
  noStroke();
  for (let x = 0; x < width; x += 24) {
    for (let y = 0; y < height; y += 24) {
      let c = colors[x][y];
      let index = gradient.indexOf(c);
      fill(c);
      rect(x, y, 24, 24);
      if (circleCount < 10 && y > (height / 2)) { // Cambiar a dibujar círculos si no se han dibujado más de 10 y está en la mitad inferior
        fill(getDifferentColorFromPalette(index));
        ellipse(x + 12, y + 12, 10, 10);
        circleCount++;
      } else {
        fill(getDifferentColorFromPalette(index));
        rect(x + 4, y + 4, 16, 16);
      }
    }
  }
}

function createGradient(colors) {
  let gradient = [];
  for (let i = 0; i < colors[0].length; i++) {
    let row = [];
    for (let j = 0; j < colors.length; j++) {
      row.push(colors[j][i]);
    }
    gradient.push(row);
  }
  return flattenArray(gradient);
}

function getDifferentColorFromPalette(index) {
  let c = gradient[(index + 200) % gradient.length];
  return color(red(c), green(c), blue(c), 200);
}

function flattenArray(arr) {
  return [].concat.apply([], arr);
}

function mouseClicked() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  let newImageIndex = floor(map(d, 0, width / 2, 0, images.length));
  if (newImageIndex >= 0 && newImageIndex < images.length && newImageIndex !== currentImageIndex) {
    currentImageIndex = newImageIndex;
    img = loadImage(images[currentImageIndex], () => {
      // Cambiar la matriz de colores
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          colors[x][y] = img.get(x, y);
        }
      }

      // Crear el gradiente
      gradient = createGradient(colors);

      // Dibujar los cuadrados y los círculos
      clear();
      image(img, 0, 0);
      noStroke();
      for (let x = 0; x < width; x += 24) {
        for (let y = 0; y < height; y += 24) {
          let c = colors[x][y];
          let index = gradient.indexOf(c);
          fill(c);
          rect(x, y, 24, 24);
          if (mouseY > pmouseY) { // Si se va hacia abajo con el mouse, reemplazar algunos cuadrados por círculos
            if (random() < 0.1) { // Cambiar el 10% de los cuadrados
              fill(getDifferentColorFromPalette(index));
              ellipse(x + 12, y + 12, 10, 10);
            }
          } else { // Si se va hacia arriba con el mouse, dibujar solo cuadrados y círculos
            fill(getDifferentColorFromPalette(index));
            ellipse(x + 12, y + 12, 10, 10);
          }
        }
      }
    });
  }
}
