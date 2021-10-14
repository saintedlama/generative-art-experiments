import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import * as Color from "color";
import { makeNoise2D } from "fast-simplex-noise";
import addEventListener from "./utils/add-event-listener";
import downloadSvg from "./utils/download-svg";

const width = 280;
const height = 200;
const cx = width / 2;
const cy = height / 2;

const colorBase = {
  h: 240,
  s: 100,
  l: 50,
};

function drawRobot() {
  const bgColor = Color.hsl(Math.random() * 80 + colorBase.h, colorBase.s, colorBase.l);

  const draw = SVG().addTo("#app").size(width, height);
  const g = draw.group().translate(0, 0);

  g.rect(width - 20, height - 20)
    .x(10)
    .y(10)
    .radius(20)
    .fill(bgColor.hsl().string())
    .stroke({ width: 6, color: "#333" });

  drawEye(g, 70 + Math.random() * 10, 80 + Math.random() * 5, 50 + Math.random() * 20);
  drawEye(g, 210 - Math.random() * 10, 80 + Math.random() * 5, 50 + Math.random() * 20);

  drawMouth(g, cx + (Math.random() * 20 - 10), height * 0.75 + (Math.random() * 20 - 10), width * (0.2 + Math.random() * 0.2));
}

function drawMouth(g, cx, cy, width) {
  g.rect(width, 20).cx(cx).cy(cy).radius(5).fill("#000");
}

function drawEye(g, x, y, r) {
  const r1 = r;
  const r2 = r1 / 2;

  g.circle(r1)
    .cx(x)
    .cy(y)
    .fill("#fff")
    .stroke({ width: r1 / 10, color: "#000" });
  g.circle(r2).cx(x).cy(y).fill("#000");
}

for (let i = 0; i < 10; i++) {
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
  drawRobot();
}


addEventListener("#btnDownload", "click", () => {
  const svgs = document.querySelectorAll("svg");

  for (const svg of svgs) {
    downloadSvg(svg, "robot.svg");
  }
});
