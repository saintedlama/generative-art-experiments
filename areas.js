import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import * as Color from "color";
import { makeNoise2D } from "fast-simplex-noise";
import * as palette from "./utils/palette";
import downloadSvg from "./utils/download-svg";
import addEventListener from "./utils/add-event-listener";

const width = 1200;
const height = 800;

const columns = 30;
const rows = 30;

const colorBase = {
  h: 310,
  s: 100,
  l: 50,
};

const draw = SVG().addTo("body").size(width, height);
const noise = makeNoise2D(Math.random);

const colorEdges = [Color(palette.electricCrimson), Color(palette.neonBlue), Color(palette.brightPurple), Color(palette.electricYellow)];

// Approach 2: divide the x in columns and add a deviation to each column
const matrix = [];
for (let row = 0; row < rows; row++) {
  const points = [...Array(columns).keys()]
    .map((column) => Math.floor((width / columns) * column))
    .map((x) => x + Math.random() * 40 - 20)
    .map((x) => ({ x, y: Math.floor((height / rows) * row) }))
    .map((point) => ({ x: point.x, y: point.y + Math.random() * 40 - 20 }));

  matrix.push(points);
}

matrix[0] = matrix[0].map((point) => ({ x: point.x, y: 0 }));
matrix[matrix.length - 1] = matrix[matrix.length - 1].map((point) => ({ x: point.x, y: height }));

for (let row = 0; row < matrix.length; row++) {
  const points = matrix[row];
  points[0] = { x: 0, y: points[0].y };
  points[points.length - 1] = { x: width, y: points[points.length - 1].y };
}

for (let row = 1; row < rows; row++) {
  for (let column = 1; column < columns; column++) {
    const point1 = matrix[row][column];
    const point2 = matrix[row - 1][column];
    const point3 = matrix[row - 1][column - 1];
    const point4 = matrix[row][column - 1];

    const c1 = colorEdges[0].mix(colorEdges[1], column / columns);
    const c2 = colorEdges[2].mix(colorEdges[3], row / rows);

    const c = c1.mix(c2);

    draw
      .polygon([
        [point1.x, point1.y],
        [point2.x, point2.y],
        [point3.x, point3.y],
        [point4.x, point4.y],
      ])
      .fill(c.hsl().string())
      .stroke({ width: 1, color: c.hsl().string() });
  }
}

addEventListener("#btnDownload", "click", () => {
  downloadSvg(document.querySelector("svg"), "gradient-area.svg");
});
