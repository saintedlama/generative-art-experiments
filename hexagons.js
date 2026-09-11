import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import Color from "color";
import { makeNoise2D } from "fast-simplex-noise";
import ngon from "./utils/ngon";
import downloadSvg from "./utils/download-svg";

const width = 1200;
const height = 800;

const container = document.querySelector("#canvas-container") || document.querySelector("#app");
const draw = SVG().addTo(container).size(width, height).viewbox(0, 0, width, height);

// State
const state = {
  count: 800,
  sides: 6,
  baseHue: 310,
};

function generate() {
  draw.clear();
  const noise = makeNoise2D(Math.random);

  // Background with subtle hue variation
  const bgHue = (Math.random() * 40 - 20 + state.baseHue + 360) % 360;
  const bgColor = Color.hsl(bgHue, 50, 12);
  draw.rect(width, height).fill(bgColor.hex());

  for (let i = 0; i < state.count; i++) {
    const radius = 10 + Math.abs(noise(i, 0)) * 32;
    const x = Math.random() * width;
    const y = Math.random() * height;

    const hue = (noise(x, y) * 60 + state.baseHue + 360) % 360;
    const color = Color.hsl(hue, 95, 52).alpha(0.32);

    draw
      .polyline(ngon(state.sides, radius, x, y))
      .fill(color.hsl().string())
      .stroke({ width: 1.5, color: color.darken(0.15).hsl().string() })
      .rotate(Math.random() * 360);
  }
}

// Initial render
generate();

// Interactive Controls
const countInput = document.querySelector("#inputCount");
const countVal = document.querySelector("#countVal");
if (countInput && countVal) {
  countInput.addEventListener("input", (e) => {
    state.count = Number(e.target.value);
    countVal.textContent = state.count;
    generate();
  });
}

const sidesInput = document.querySelector("#inputSides");
if (sidesInput) {
  sidesInput.addEventListener("change", (e) => {
    state.sides = Number(e.target.value);
    generate();
  });
}

const hueInput = document.querySelector("#inputHue");
const hueVal = document.querySelector("#hueVal");
if (hueInput && hueVal) {
  hueInput.addEventListener("input", (e) => {
    state.baseHue = Number(e.target.value);
    hueVal.textContent = `${state.baseHue}°`;
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
    downloadSvg(svgEl, `hexagons-${state.baseHue}deg-${Date.now()}.svg`);
  });
}

// Keyboard shortcut: Spacebar to regenerate
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "SELECT") {
    e.preventDefault();
    generate();
  }
});
