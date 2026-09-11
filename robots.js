import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import Color from "color";
import downloadSvg from "./utils/download-svg";

const robotWidth = 280;
const robotHeight = 220;

const state = {
  count: 12,
  theme: "random",
};

const THEMES = {
  cyberBlue: { h: 200, range: 40, s: 95, l: 50 },
  neonPurple: { h: 270, range: 40, s: 95, l: 52 },
  electricLime: { h: 90, range: 40, s: 90, l: 45 },
  crimsonFire: { h: 345, range: 35, s: 95, l: 50 },
};

function getRobotColor() {
  if (state.theme !== "random" && THEMES[state.theme]) {
    const t = THEMES[state.theme];
    const hue = (t.h + (Math.random() * t.range - t.range / 2) + 360) % 360;
    return Color.hsl(hue, t.s, t.l);
  }
  // Random vibrant neon hue
  return Color.hsl(Math.random() * 360, 90, 52);
}

function randomBotId() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const char = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `BOT-${char}${num}`;
}

function drawRobotCard(container) {
  const botId = randomBotId();

  const card = document.createElement("div");
  card.className = "robot-card";

  const svgMount = document.createElement("div");
  card.appendChild(svgMount);

  const footer = document.createElement("div");
  footer.className = "robot-card-footer";
  footer.innerHTML = `
    <span><strong>${botId}</strong></span>
    <button class="btn btn-secondary btn-sm btn-download-bot" type="button" title="Download SVG">
      ↓ SVG
    </button>
  `;
  card.appendChild(footer);

  container.appendChild(card);

  // SVG Canvas for this robot
  const draw = SVG().addTo(svgMount).size(robotWidth, robotHeight).viewbox(0, 0, robotWidth, robotHeight);
  const g = draw.group();

  const bgColor = getRobotColor();
  const strokeColor = "#1a1c24";
  const strokeWidth = 5;

  const cx = robotWidth / 2;
  const headTop = 40;
  const headWidth = robotWidth - 40;
  const headHeight = robotHeight - 65;

  // Head Antenna / Ears accessories
  drawAntenna(g, cx, headTop, bgColor);

  // Main Head
  const cornerRadius = 15 + Math.random() * 25;
  g.rect(headWidth, headHeight)
    .x(20)
    .y(headTop)
    .radius(cornerRadius)
    .fill(bgColor.hsl().string())
    .stroke({ width: strokeWidth, color: strokeColor });

  // Eyes
  const eyeStyle = Math.random();
  if (eyeStyle < 0.2) {
    // Single Cyclops Eye
    drawEye(g, cx, headTop + 55, 60 + Math.random() * 15, strokeColor);
  } else if (eyeStyle < 0.4) {
    // Visor bar
    g.rect(headWidth - 30, 36)
      .cx(cx)
      .cy(headTop + 55)
      .radius(10)
      .fill("#000000")
      .stroke({ width: 3, color: strokeColor });

    // Inner glowing visor line
    g.rect(headWidth - 50, 10)
      .cx(cx)
      .cy(headTop + 55)
      .radius(5)
      .fill(bgColor.isDark() ? "#00ffff" : "#ff0077");
  } else {
    // Dual Eyes
    const eyeSpacing = 55 + Math.random() * 15;
    const eyeRadius = 40 + Math.random() * 15;
    drawEye(g, cx - eyeSpacing, headTop + 55, eyeRadius, strokeColor);
    drawEye(g, cx + eyeSpacing, headTop + 55, eyeRadius, strokeColor);
  }

  // Cheeks / Status indicators
  if (Math.random() > 0.4) {
    g.circle(16)
      .cx(38)
      .cy(headTop + 85)
      .fill("#ff0066")
      .opacity(0.6);
    g.circle(16)
      .cx(robotWidth - 38)
      .cy(headTop + 85)
      .fill("#ff0066")
      .opacity(0.6);
  }

  // Mouth
  drawMouth(g, cx, headTop + headHeight - 35, headWidth * (0.35 + Math.random() * 0.25), strokeColor);

  // Individual download handler
  const btnDownloadBot = card.querySelector(".btn-download-bot");
  btnDownloadBot.addEventListener("click", () => {
    const svgElement = svgMount.querySelector("svg");
    downloadSvg(svgElement, `${botId.toLowerCase()}.svg`);
  });
}

function drawAntenna(g, cx, headTop, color) {
  const antennaType = Math.random();
  if (antennaType < 0.33) {
    // Single Antenna with bulb
    g.line(cx, headTop, cx, headTop - 25).stroke({ width: 4, color: "#1a1c24" });
    g.circle(16)
      .cx(cx)
      .cy(headTop - 25)
      .fill(color.lighten(0.3).hex())
      .stroke({ width: 3, color: "#1a1c24" });
  } else if (antennaType < 0.66) {
    // Dual Horns / bolts
    g.rect(12, 18)
      .cx(cx - 50)
      .cy(headTop - 8)
      .radius(3)
      .fill("#333")
      .stroke({ width: 3, color: "#1a1c24" });
    g.rect(12, 18)
      .cx(cx + 50)
      .cy(headTop - 8)
      .radius(3)
      .fill("#333")
      .stroke({ width: 3, color: "#1a1c24" });
  } else {
    // Side ears / headphones
    g.rect(14, 30)
      .cx(14)
      .cy(headTop + 50)
      .radius(6)
      .fill("#222")
      .stroke({ width: 3, color: "#1a1c24" });
    g.rect(14, 30)
      .cx(robotWidth - 14)
      .cy(headTop + 50)
      .radius(6)
      .fill("#222")
      .stroke({ width: 3, color: "#1a1c24" });
  }
}

function drawEye(g, x, y, size, strokeColor) {
  const outerR = size;
  const innerR = outerR * (0.4 + Math.random() * 0.2);

  // Outer sclera
  g.circle(outerR).cx(x).cy(y).fill("#ffffff").stroke({ width: 4, color: strokeColor });

  // Pupil
  g.circle(innerR)
    .cx(x + (Math.random() * 4 - 2))
    .cy(y + (Math.random() * 4 - 2))
    .fill("#000000");

  // Catchlight
  g.circle(innerR * 0.35)
    .cx(x - innerR * 0.25)
    .cy(y - innerR * 0.25)
    .fill("#ffffff");
}

function drawMouth(g, cx, cy, width, strokeColor) {
  const mouthType = Math.random();
  if (mouthType < 0.4) {
    // Rounded slot
    g.rect(width, 18).cx(cx).cy(cy).radius(9).fill("#0a0a0f").stroke({ width: 3, color: strokeColor });
  } else if (mouthType < 0.7) {
    // Tooth grid
    const mouthHeight = 20;
    g.rect(width, mouthHeight).cx(cx).cy(cy).radius(4).fill("#ffffff").stroke({ width: 3, color: strokeColor });

    const teethCount = Math.floor(width / 14);
    for (let i = 1; i < teethCount; i++) {
      const tx = cx - width / 2 + (width / teethCount) * i;
      g.line(tx, cy - mouthHeight / 2, tx, cy + mouthHeight / 2).stroke({ width: 2, color: strokeColor });
    }
  } else {
    // Speaker grill slits
    for (let i = -1; i <= 1; i++) {
      g.line(cx - width / 2, cy + i * 7, cx + width / 2, cy + i * 7).stroke({
        width: 3,
        color: "#0a0a0f",
        linecap: "round",
      });
    }
  }
}

function renderAll() {
  const grid = document.querySelector("#robotsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  for (let i = 0; i < state.count; i++) {
    drawRobotCard(grid);
  }
}

// Initial render
renderAll();

// Event Listeners
const inputCount = document.querySelector("#inputCount");
if (inputCount) {
  inputCount.addEventListener("change", (e) => {
    state.count = Number(e.target.value);
    renderAll();
  });
}

const inputTheme = document.querySelector("#inputTheme");
if (inputTheme) {
  inputTheme.addEventListener("change", (e) => {
    state.theme = e.target.value;
    renderAll();
  });
}

const btnRegenerate = document.querySelector("#btnRegenerate");
if (btnRegenerate) {
  btnRegenerate.addEventListener("click", () => renderAll());
}

const btnDownloadFirst = document.querySelector("#btnDownloadFirst");
if (btnDownloadFirst) {
  btnDownloadFirst.addEventListener("click", () => {
    const firstSvg = document.querySelector("#robotsGrid svg");
    if (firstSvg) {
      downloadSvg(firstSvg, `robot-${Date.now()}.svg`);
    }
  });
}

// Space to regenerate
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "SELECT") {
    e.preventDefault();
    renderAll();
  }
});
