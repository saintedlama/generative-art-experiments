import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import Color from "color";
import { makeNoise2D } from "fast-simplex-noise";
import { themes } from "./utils/palette";
import downloadSvg from "./utils/download-svg";

const width = 1200;
const height = 800;

const container = document.querySelector("#canvas-container") || document.querySelector("#app");
const draw = SVG().addTo(container).size(width, height).viewbox(0, 0, width, height);

const state = {
  grid: 32,
  deviation: 25,
  paletteName: "cyberpunk",
};

function generate() {
  draw.clear();

  const columns = state.grid;
  const rows = state.grid;
  const deviation = state.deviation;
  const noise = makeNoise2D(Math.random);

  const paletteColors = themes[state.paletteName] || themes.cyberpunk;
  const colorEdges = paletteColors.map((c) => Color(c));

  // Generate matrix points with boundary clamping
  const matrix = [];
  const colStep = width / columns;
  const rowStep = height / rows;

  for (let row = 0; row <= rows; row++) {
    const rowPoints = [];
    for (let col = 0; col <= columns; col++) {
      let x = col * colStep;
      let y = row * rowStep;

      // Add interior noise deviation, keep borders straight
      if (col > 0 && col < columns && row > 0 && row < rows) {
        const nX = noise(col * 0.15, row * 0.15);
        const nY = noise((col + 50) * 0.15, (row + 50) * 0.15);
        x += nX * deviation;
        y += nY * deviation;
      }

      rowPoints.push({ x, y });
    }
    matrix.push(rowPoints);
  }

  // Draw quads
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= columns; col++) {
      const p1 = matrix[row][col];
      const p2 = matrix[row - 1][col];
      const p3 = matrix[row - 1][col - 1];
      const p4 = matrix[row][col - 1];

      const u = col / columns;
      const v = row / rows;

      // Bilinear color interpolation across 4 corner colors
      const topColor = colorEdges[0].mix(colorEdges[1], u);
      const bottomColor = colorEdges[2].mix(colorEdges[3], u);
      const cellColor = topColor.mix(bottomColor, v);

      draw
        .polygon([
          [p1.x, p1.y],
          [p2.x, p2.y],
          [p3.x, p3.y],
          [p4.x, p4.y],
        ])
        .fill(cellColor.hsl().string())
        .stroke({ width: 0.75, color: cellColor.hsl().string() });
    }
  }
}

// Initial render
generate();

// Controls
const inputGrid = document.querySelector("#inputGrid");
if (inputGrid) {
  inputGrid.addEventListener("change", (e) => {
    state.grid = Number(e.target.value);
    generate();
  });
}

const inputDeviation = document.querySelector("#inputDeviation");
const deviationVal = document.querySelector("#deviationVal");
if (inputDeviation && deviationVal) {
  inputDeviation.addEventListener("input", (e) => {
    state.deviation = Number(e.target.value);
    deviationVal.textContent = `${state.deviation}px`;
    generate();
  });
}

const inputPalette = document.querySelector("#inputPalette");
if (inputPalette) {
  inputPalette.addEventListener("change", (e) => {
    state.paletteName = e.target.value;
    generate();
  });
}

const btnRegenerate = document.querySelector("#btnRegenerate");
if (btnRegenerate) {
  btnRegenerate.addEventListener("click", () => generate());
}

const btnDownload = document.querySelector("#btnDownload");
if (btnDownload) {
  btnDownload.addEventListener("click", () => {
    const svgEl = document.querySelector("svg");
    downloadSvg(svgEl, `gradient-mesh-${state.paletteName}-${Date.now()}.svg`);
  });
}

// Space to regenerate
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "SELECT") {
    e.preventDefault();
    generate();
  }
});
