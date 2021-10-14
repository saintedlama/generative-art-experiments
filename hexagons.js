import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import * as Color from "color";
import { makeNoise2D } from "fast-simplex-noise";
import ngon from "./utils/ngon";
import downloadSvg from "./utils/download-svg";
import addEventListener from "./utils/add-event-listener";

const width = 1200;
const height = 800;
const colorBase = {
  h: 310,
  s: 100,
  l: 50,
}

const draw = SVG().addTo("#app").size(width, height);
const noise = makeNoise2D(Math.random);

const bgColor = Color.hsl(((Math.random() * 40) - 20) + colorBase.h, 50, 15);
draw.rect(width, height).fill(bgColor.hex());

for (var i = 0; i < 800; i++) {
  var radius = 10 + Math.abs(noise(i, 0)) * 30;

  var x = Math.random() * width;
  var y = Math.random() * height;

  const color = Color.hsl((noise(x,y) * 50) + colorBase.h, colorBase.s, colorBase.l).alpha(0.3);

  draw
    .polyline(ngon(5, radius, x, y))
    .fill(color.hsl().string())
    .stroke({ width: 2, color: color.darken(0.05).hsl().string() })
    .rotate(Math.random() * 360);
}

addEventListener("#btnDownload", "click", () => {
  downloadSvg(document.querySelector("svg"), "hexagons.svg");
});
