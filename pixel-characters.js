import "./style.css";
import { SVG } from "@svgdotjs/svg.js";
import downloadSvg from "./utils/download-svg.js";
import { PixelCanvas } from "./utils/pixels.js";
import { Random } from "./utils/random.js";
import {
  randomColor,
  skinTones,
  eyeColors,
  eyeWhite,
  mouthColors,
  hairColors,
  clothColors,
  pantsColors,
  shoeColors,
} from "./utils/palette.js";

export const GRID_WIDTH = 16;
export const GRID_HEIGHT = 35;

const EYE_VARIANTS = ["2x1", "2x2"];
const PLACEMENTS_2X1 = ["left", "right", "inward"];
const PLACEMENTS_2X2 = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
const HAIR_WALKER_STYLES = ["spiky", "flowing", "curly", "bob", "crop"];

const MODULAR_CAPS = ["dome", "flat", "spikes", "afro", "buzz"];
const MODULAR_FRINGES = ["curtains", "blunt", "sideSwept", "widowPeak", "open"];
const MODULAR_SIDES = ["none", "sideburns", "bob", "long"];
const BODY_STYLES = ["tee", "vneck", "hoodie", "sweater", "tank"];

const state = {
  count: 16,
};

/**
 * Helper to check if a coordinate hits an eye region.
 * Protects left eye (5..6, 6..7) and right eye (9..10, 6..7).
 */
function isEyePixel(x, y) {
  return ((x >= 5 && x <= 6) || (x >= 9 && x <= 10)) && y >= 6 && y <= 7;
}

/**
 * Draws the character head on the pixel canvas.
 * Base size: 12x12 (y: 2..13).
 * Symmetrically shrinks both left and right sides by 0..2 pixels:
 * - shrinkSide 0: width 12 (x: 2..13, margin 2px)
 * - shrinkSide 1: width 10 (x: 3..12, margin 3px)
 * - shrinkSide 2: width 8  (x: 4..11, margin 4px)
 *
 * @param {PixelCanvas} pixels
 * @param {object|string} [options]
 */
export function drawHead(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(skinTones) : randomColor(skinTones));
  const shrinkSide = opts.shrinkSide ?? opts.shrinkWidth ?? (rng ? rng.int(0, 2) : Math.floor(Math.random() * 3));
  const headX = 2 + shrinkSide;
  const headWidth = 12 - 2 * shrinkSide;
  const headHeight = 12;
  const headY = 2;

  pixels.drawRect(headX, headY, headWidth, headHeight, color);

  return {
    color,
    x: headX,
    y: headY,
    width: headWidth,
    height: headHeight,
    shrinkSide,
  };
}

/**
 * Draws the neck connecting the head to the body.
 * Positioned under the head at rows y: 14..15.
 *
 * @param {PixelCanvas} pixels
 * @param {object} [options]
 */
export function drawNeck(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || opts.skinColor || skinTones[0];
  const width = opts.width ?? (rng ? rng.pick([4, 6]) : 4);
  const startX = Math.floor((GRID_WIDTH - width) / 2);
  const y = opts.y ?? 14;
  const height = opts.height ?? 2;

  pixels.drawRect(startX, y, width, height, color);

  return { color, startX, y, width, height };
}

/**
 * Draws the elongated body/torso with shoulders, sleeves, shirt, and neckline cutouts in rows y: 16..25 (10 rows).
 *
 * @param {PixelCanvas} pixels
 * @param {object} [options]
 */
export function drawBody(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(clothColors) : randomColor(clothColors));
  const skinColor = opts.skinColor || skinTones[0];
  const style = opts.style || (rng ? rng.pick(BODY_STYLES) : BODY_STYLES[Math.floor(Math.random() * BODY_STYLES.length)]);

  // Row 16: Shoulders start sloping
  pixels.drawRect(4, 16, 8, 1, color);

  // Row 17: Shoulders full width spanning to arm flanks (x: 1..14)
  pixels.drawRect(1, 17, 14, 1, color);

  // Rows 18..23: Chest, torso and arms/sleeves (x: 1..14)
  pixels.drawRect(1, 18, 14, 6, color);

  // Rows 24..25: Lower torso / waist (x: 2..13)
  pixels.drawRect(2, 24, 12, 2, color);

  // Style-specific necklines, cutouts, and accents
  if (style === "tee") {
    // Crew neck cutout showing skin
    pixels.drawRect(7, 16, 2, 1, skinColor);
  } else if (style === "vneck") {
    // V-neck cutout
    pixels.drawRect(7, 16, 2, 1, skinColor);
    pixels.drawRect(7, 17, 2, 1, skinColor);
  } else if (style === "hoodie") {
    // Zipper seam down the center
    const zipperColor = "#e2e8f0";
    for (let y = 17; y <= 25; y++) {
      pixels.setPixel(7, y, zipperColor);
    }
  } else if (style === "tank") {
    // Bare arms on the outer flanks (x: 1 and x: 14)
    for (let y = 17; y <= 23; y++) {
      pixels.setPixel(1, y, skinColor);
      pixels.setPixel(14, y, skinColor);
    }
  }

  return { color, style };
}

/**
 * Draws minimal hands at the flanks in rows y: 24..25.
 * Two 1-pixel wide (or 2-pixel wide) skin-tone blocks at the base of the arms.
 *
 * @param {PixelCanvas} pixels
 * @param {object} [options]
 */
export function drawHands(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || opts.skinColor || skinTones[0];
  const y = opts.y ?? 24;
  const height = opts.height ?? 2;
  const width = opts.width ?? (rng ? rng.pick([1, 2]) : 1);

  const leftX = 1;
  const rightX = width === 2 ? 13 : 14;

  pixels.drawRect(leftX, y, width, height, color);
  pixels.drawRect(rightX, y, width, height, color);

  return { color, leftX, rightX, y, height, width };
}

/**
 * Draws really simple straight legs in rows y: 26..32 (7 rows).
 * Two 3-pixel wide columns (left: x: 4..6, right: x: 9..11) with a 2-pixel gap.
 *
 * @param {PixelCanvas} pixels
 * @param {object} [options]
 */
export function drawLegs(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(pantsColors) : randomColor(pantsColors));
  const y = opts.y ?? 26;
  const height = opts.height ?? 7;
  const legWidth = 3;
  const leftX = 4;
  const rightX = 9;

  pixels.drawRect(leftX, y, legWidth, height, color);
  pixels.drawRect(rightX, y, legWidth, height, color);

  return { color, leftX, rightX, y, height, legWidth };
}

/**
 * Draws really simple feet/shoes at the base in rows y: 33..34 (2 rows).
 * Two 4-pixel wide blocks extending 1 pixel outward (left: x: 3..6, right: x: 9..12).
 *
 * @param {PixelCanvas} pixels
 * @param {object} [options]
 */
export function drawFeet(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(shoeColors) : randomColor(shoeColors));
  const y = opts.y ?? 33;
  const height = opts.height ?? 2;
  const footWidth = 4;
  const leftX = 3;
  const rightX = 9;

  pixels.drawRect(leftX, y, footWidth, height, color);
  pixels.drawRect(rightX, y, footWidth, height, color);

  return { color, leftX, rightX, y, height, footWidth };
}

/**
 * Draws eyes on the character head.
 * Supports both 2x1 and 2x2 white variants with randomized pupil placement:
 * - 2x1 variant: 2x1 white pixels per eye (y: 6) with pupil placed randomly (left, right, or inward).
 * - 2x2 variant: 2x2 white pixels per eye (y: 6..7) with pupil placed in one of the 4 corners independently.
 *
 * Left eye at x: 5, Right eye at x: 9.
 *
 * @param {PixelCanvas} pixels
 * @param {object|string} [options]
 */
export function drawEyes(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const ballColor = opts.color || (rng ? rng.pick(eyeColors) : randomColor(eyeColors));
  const whiteColor = opts.whiteColor || eyeWhite;
  const variant = opts.variant || (rng ? rng.pick(EYE_VARIANTS) : EYE_VARIANTS[Math.floor(Math.random() * EYE_VARIANTS.length)]);
  const y = opts.y ?? 6;

  const leftX = 5;
  const rightX = 9;

  let placement = opts.placement;

  if (variant === "2x1") {
    placement = placement || (rng ? rng.pick(PLACEMENTS_2X1) : PLACEMENTS_2X1[Math.floor(Math.random() * PLACEMENTS_2X1.length)]);

    // Fill both eyes with white using drawRect
    pixels.drawRect(leftX, y, 2, 1, whiteColor);
    pixels.drawRect(rightX, y, 2, 1, whiteColor);

    // Position pupils
    let leftPupilX = leftX;
    let rightPupilX = rightX;

    if (placement === "right") {
      leftPupilX = leftX + 1;
      rightPupilX = rightX + 1;
    } else if (placement === "inward") {
      leftPupilX = leftX + 1;
      rightPupilX = rightX;
    }

    pixels.setPixel(leftPupilX, y, ballColor);
    pixels.setPixel(rightPupilX, y, ballColor);
  } else {
    // 2x2 variant with independent random corner placement for each eye
    const pickCorner = () => (rng ? rng.pick(PLACEMENTS_2X2) : PLACEMENTS_2X2[Math.floor(Math.random() * PLACEMENTS_2X2.length)]);

    const leftPlacement = opts.leftPlacement || (opts.placement ?? pickCorner());
    const rightPlacement = opts.rightPlacement || (opts.placement ?? pickCorner());

    // Fill 2x2 white areas using drawRect
    pixels.drawRect(leftX, y, 2, 2, whiteColor);
    pixels.drawRect(rightX, y, 2, 2, whiteColor);

    function placePupil(startX, startY, cornerName) {
      let pupilX = startX;
      let pupilY = startY;
      if (cornerName === "topRight") {
        pupilX += 1;
      } else if (cornerName === "bottomLeft") {
        pupilY += 1;
      } else if (cornerName === "bottomRight") {
        pupilX += 1;
        pupilY += 1;
      }

      pixels.setPixel(pupilX, pupilY, ballColor);
    }

    placePupil(leftX, y, leftPlacement);
    placePupil(rightX, y, rightPlacement);

    return {
      variant,
      leftPlacement,
      rightPlacement,
      ballColor,
      whiteColor,
      y,
    };
  }

  return {
    variant,
    placement,
    ballColor,
    whiteColor,
    y,
  };
}

/**
 * Draws a mouth on the character head.
 * On a 12x12 head (x: 2..13, y: 2..13), the mouth is rendered as a line at row y: 10.
 * Width is 2 or 4 pixels centered horizontally.
 *
 * @param {PixelCanvas} pixels
 * @param {object|string} [options]
 */
export function drawMouth(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(mouthColors) : randomColor(mouthColors));
  const offsetY = opts.offsetY ?? (rng ? rng.pick([0, 1]) : Math.floor(Math.random() * 2));
  const baseY = opts.y ?? 10;
  const y = baseY + offsetY;
  const width = opts.width ?? (rng ? rng.pick([2, 4]) : 2);

  // Centered horizontally: 2px wide -> x: 7..8, 4px wide -> x: 6..9
  const startX = width === 4 ? 6 : 7;
  pixels.drawRect(startX, y, width, 1, color);

  return { color, startX, y, width, offsetY };
}

/**
 * Option 4: Clustered Growth / Strand Walkers.
 * Walkers sprout from scalp follicle origins and step outward based on growth style.
 *
 * @param {PixelCanvas} pixels
 * @param {object|string} [options]
 */
export function drawHairStrandWalker(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(hairColors) : randomColor(hairColors));
  const style =
    opts.style || (rng ? rng.pick(HAIR_WALKER_STYLES) : HAIR_WALKER_STYLES[Math.floor(Math.random() * HAIR_WALKER_STYLES.length)]);

  const head = opts.head || { x: 2, y: 2, width: 12, height: 12 };
  const headX = head.x;
  const headWidth = head.width;
  const headRight = headX + headWidth - 1;

  function stamp(x, y) {
    if (x >= 0 && x < pixels.width && y >= 0 && y < pixels.height) {
      if (!isEyePixel(x, y)) {
        pixels.setPixel(x, y, color);
      }
    }
  }

  // Base scalp row along crown (y: 2)
  for (let x = headX; x <= headRight; x++) {
    stamp(x, 2);
  }

  const roots = [];
  for (let x = Math.max(0, headX - 1); x <= Math.min(pixels.width - 1, headRight + 1); x++) {
    roots.push({ x, y: 2, type: "crown" });
  }
  for (let y = 3; y <= 5; y++) {
    if (headX - 1 >= 0) roots.push({ x: headX - 1, y, type: "leftSide" });
    if (headRight + 1 < pixels.width) roots.push({ x: headRight + 1, y, type: "rightSide" });
  }

  const walkerCount = style === "flowing" ? 22 : style === "curly" ? 24 : style === "bob" ? 20 : 16;

  for (let w = 0; w < walkerCount; w++) {
    const root = rng ? rng.pick(roots) : roots[Math.floor(Math.random() * roots.length)];
    let cx = root.x;
    let cy = root.y;
    const maxSteps = style === "flowing" ? 8 : style === "crop" ? 3 : 4;

    for (let s = 0; s < maxSteps; s++) {
      stamp(cx, cy);

      if (rng ? rng.bool(0.45) : Math.random() < 0.45) {
        const offset = rng ? rng.pick([-1, 1]) : Math.random() < 0.5 ? -1 : 1;
        stamp(cx + offset, cy);
      }

      if (style === "spiky") {
        cx += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
        cy += rng ? rng.pick([-1, -1, 0]) : Math.random() < 0.67 ? -1 : 0;
      } else if (style === "flowing") {
        if (cx <= 4) {
          cx += rng ? rng.pick([-1, 0]) : Math.random() < 0.5 ? -1 : 0;
          cy += rng ? rng.pick([0, 1, 1]) : Math.random() < 0.33 ? 0 : 1;
        } else if (cx >= 11) {
          cx += rng ? rng.pick([0, 1]) : Math.random() < 0.5 ? 0 : 1;
          cy += rng ? rng.pick([0, 1, 1]) : Math.random() < 0.33 ? 0 : 1;
        } else {
          cx += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
          cy += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
        }
      } else if (style === "bob") {
        if (cx <= 4 || cx >= 11) {
          cy += rng ? rng.pick([0, 1]) : Math.floor(Math.random() * 2);
        } else {
          cy += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
        }
        cx += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
      } else if (style === "curly") {
        cx += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
        cy += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
      } else {
        // crop
        cx += rng ? rng.pick([-1, 0, 1]) : Math.floor(Math.random() * 3) - 1;
        cy += rng ? rng.pick([-1, 0]) : Math.floor(Math.random() * 2) - 1;
      }
    }
  }

  return { color, style };
}

/**
 * Option 1: Parametric Heightfield Profile (Column Sweep).
 * Hair profile is calculated per column using continuous math functions.
 *
 * @param {PixelCanvas} pixels
 * @param {object|string} [options]
 */
export function drawHairParametric(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(hairColors) : randomColor(hairColors));
  const head = opts.head || { x: 2, y: 2, width: 12, height: 12 };
  const headX = head.x;
  const headWidth = head.width;
  const headRight = headX + headWidth - 1;
  const centerX = headX + headWidth / 2;

  const topCurve = opts.topCurve || (rng ? rng.pick(["dome", "flat", "swoop"]) : "dome");
  const fringeCurve = opts.fringeCurve || (rng ? rng.pick(["blunt", "curtain", "asymmetric"]) : "curtain");
  const sideLength = opts.sideLength ?? (rng ? rng.pick([0, 3, 6]) : 3);

  function stamp(x, y) {
    if (x >= 0 && x < pixels.width && y >= 0 && y < pixels.height) {
      if (!isEyePixel(x, y)) {
        pixels.setPixel(x, y, color);
      }
    }
  }

  for (let x = Math.max(0, headX - 1); x <= Math.min(pixels.width - 1, headRight + 1); x++) {
    let yTop = 1;
    if (topCurve === "dome") {
      const dist = Math.abs(x - centerX) / (headWidth / 2);
      yTop = Math.round(dist * dist * 1.8);
    } else if (topCurve === "flat") {
      yTop = 1;
    } else if (topCurve === "swoop") {
      yTop = Math.round(((x - headX) / headWidth) * 1.5);
    }

    let yBottom = 2;
    const isSide = x < 5 || x > 10;
    if (isSide) {
      yBottom = 2 + sideLength;
    } else {
      if (fringeCurve === "blunt") {
        yBottom = 3;
      } else if (fringeCurve === "curtain") {
        yBottom = Math.abs(x - centerX) < 1.5 ? 2 : 4;
      } else if (fringeCurve === "asymmetric") {
        yBottom = 2 + Math.round(((x - 5) / 5) * 2);
      }
    }

    for (let y = Math.max(0, yTop); y <= Math.min(pixels.height - 1, yBottom); y++) {
      stamp(x, y);
    }
  }

  return { color, topCurve, fringeCurve, sideLength };
}

/**
 * Option 2: Multi-Component Archetype Engine (Cap + Fringe + Sides).
 * Combines independent modular hairstyles for clean, retro 16-bit video game character aesthetics.
 *
 * @param {PixelCanvas} pixels
 * @param {object|string} [options]
 */
export function drawHairModular(pixels, options = {}) {
  const opts = typeof options === "string" ? { color: options } : options;
  const rng = opts.random;
  const color = opts.color || (rng ? rng.pick(hairColors) : randomColor(hairColors));
  const head = opts.head || { x: 2, y: 2, width: 12, height: 12 };
  const headX = head.x;
  const headWidth = head.width;
  const headRight = headX + headWidth - 1;

  const cap = opts.cap || (rng ? rng.pick(MODULAR_CAPS) : MODULAR_CAPS[Math.floor(Math.random() * MODULAR_CAPS.length)]);
  const fringe = opts.fringe || (rng ? rng.pick(MODULAR_FRINGES) : MODULAR_FRINGES[Math.floor(Math.random() * MODULAR_FRINGES.length)]);
  const sides = opts.sides || (rng ? rng.pick(MODULAR_SIDES) : MODULAR_SIDES[Math.floor(Math.random() * MODULAR_SIDES.length)]);

  function stamp(x, y) {
    if (x >= 0 && x < pixels.width && y >= 0 && y < pixels.height) {
      if (!isEyePixel(x, y)) {
        pixels.setPixel(x, y, color);
      }
    }
  }

  // 1. Cap (Crown volume in rows 0..2)
  if (cap === "dome") {
    for (let x = headX + 2; x <= headRight - 2; x++) stamp(x, 0);
    for (let x = headX + 1; x <= headRight - 1; x++) stamp(x, 1);
    for (let x = headX; x <= headRight; x++) stamp(x, 2);
  } else if (cap === "flat") {
    for (let x = headX; x <= headRight; x++) {
      stamp(x, 1);
      stamp(x, 2);
    }
  } else if (cap === "spikes") {
    for (let x = headX; x <= headRight; x++) {
      stamp(x, 2);
      stamp(x, 1);
      if ((x - headX) % 2 === 1) stamp(x, 0);
    }
  } else if (cap === "afro") {
    for (let x = Math.max(0, headX - 1); x <= Math.min(pixels.width - 1, headRight + 1); x++) {
      stamp(x, 0);
      stamp(x, 1);
      stamp(x, 2);
    }
  } else {
    // buzz
    for (let x = headX; x <= headRight; x++) {
      stamp(x, 1);
      stamp(x, 2);
    }
  }

  // 2. Fringe / Bangs (Forehead rows 2..4)
  if (fringe === "curtains") {
    for (let y = 2; y <= 4; y++) {
      for (let x = headX; x <= 5; x++) stamp(x, y);
      for (let x = 9; x <= headRight; x++) stamp(x, y);
    }
  } else if (fringe === "blunt") {
    for (let x = headX; x <= headRight; x++) {
      stamp(x, 2);
      stamp(x, 3);
    }
  } else if (fringe === "sideSwept") {
    const dir = rng ? rng.bool() : Math.random() < 0.5;
    for (let x = headX; x <= headRight; x++) {
      const progress = (x - headX) / Math.max(1, headRight - headX);
      const depth = dir ? Math.round(2 + progress * 2) : Math.round(4 - progress * 2);
      for (let y = 2; y <= depth; y++) stamp(x, y);
    }
  } else if (fringe === "widowPeak") {
    const center = (headX + headRight) / 2;
    for (let x = headX; x <= headRight; x++) {
      const distFromCenter = Math.abs(x - center);
      const depth = distFromCenter < 1 ? 4 : distFromCenter < 2.5 ? 3 : 2;
      for (let y = 2; y <= depth; y++) stamp(x, y);
    }
  }

  // 3. Sides / Tails (Cheek, jaw, and shoulder framing outside the eyes)
  const sideDrop = sides === "long" ? 14 : sides === "bob" ? 8 : sides === "sideburns" ? 5 : 2;
  if (sideDrop > 2) {
    for (let y = 3; y <= sideDrop; y++) {
      for (let x = Math.max(0, headX - 1); x < 5; x++) stamp(x, y);
      for (let x = 10; x <= Math.min(pixels.width - 1, headRight + 1); x++) stamp(x, y);
    }
  }

  return { color, cap, fringe, sides };
}

/**
 * Draws a single pixel character card with its own independent PixelCanvas and SVG.
 *
 * @param {HTMLElement} container
 * @param {string|number} seed
 * @param {number} index
 */
export function drawCharacterCard(container, seed, _index) {
  const random = new Random(seed);
  const shortSeed = random.shortSeed;

  const card = document.createElement("div");
  card.className = "character-card";

  const svgMount = document.createElement("div");
  svgMount.className = "character-card-canvas";
  card.appendChild(svgMount);

  const footer = document.createElement("div");
  footer.className = "character-card-footer";
  footer.innerHTML = `
    <span><strong>#${shortSeed}</strong></span>
    <button class="btn btn-secondary btn-sm btn-download-char" type="button" title="Download SVG">
      ↓ SVG
    </button>
  `;
  card.appendChild(footer);

  container.appendChild(card);

  // SVG Canvas for this character
  const draw = SVG().addTo(svgMount).size(160, 350).viewbox(0, 0, GRID_WIDTH, GRID_HEIGHT).addClass("pixel-canvas");

  draw.attr({ "shape-rendering": "crispEdges" });

  // Background
  draw.rect(GRID_WIDTH, GRID_HEIGHT).fill("#0d0f17");

  // Subtle pixel grid lines
  const gridGroup = draw.group();
  for (let i = 0; i <= GRID_WIDTH; i++) {
    gridGroup.line(i, 0, i, GRID_HEIGHT).stroke({ width: 0.05, color: "rgba(255, 255, 255, 0.08)" });
  }
  for (let i = 0; i <= GRID_HEIGHT; i++) {
    gridGroup.line(0, i, GRID_WIDTH, i).stroke({ width: 0.05, color: "rgba(255, 255, 255, 0.08)" });
  }

  // Create an independent pixel canvas for this character
  const pixels = new PixelCanvas(GRID_WIDTH, GRID_HEIGHT);
  const head = drawHead(pixels, { random });
  drawNeck(pixels, { random, skinColor: head.color });
  drawBody(pixels, { random, skinColor: head.color });
  drawHands(pixels, { random, skinColor: head.color });
  drawLegs(pixels, { random });
  drawFeet(pixels, { random });
  drawEyes(pixels, { random });
  drawMouth(pixels, { random });
  drawHairModular(pixels, { random, head });

  // Render pixel canvas into SVG
  const pixelGroup = draw.group();
  for (let x = 0; x < pixels.width; x++) {
    for (let y = 0; y < pixels.height; y++) {
      const color = pixels.getPixel(x, y);
      if (color && color !== 0) {
        pixelGroup.rect(1, 1).move(x, y).fill(color);
      }
    }
  }

  // Individual download handler
  const btnDownloadChar = card.querySelector(".btn-download-char");
  if (btnDownloadChar) {
    btnDownloadChar.addEventListener("click", () => {
      const svgElement = svgMount.querySelector("svg");
      if (svgElement) {
        downloadSvg(svgElement, `pixel-character-${shortSeed}.svg`);
      }
    });
  }

  return { draw, pixels, shortSeed };
}

/**
 * Renders all character cards in the grid.
 *
 * @param {string|number} [masterSeed]
 */
export function renderAll(masterSeed) {
  const grid = document.querySelector("#charactersGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const masterRandom = new Random(masterSeed);
  const masterShortSeed = masterRandom.shortSeed;

  const seedBadge = document.querySelector("#seedBadge");
  if (seedBadge) {
    seedBadge.textContent = `#${masterShortSeed}`;
  }

  for (let i = 0; i < state.count; i++) {
    const charSeed = masterRandom.int(1, 2147483647);
    drawCharacterCard(grid, charSeed, i);
  }
}

// Initial render of 16 characters
renderAll();

// Controls
const inputCount = document.querySelector("#inputCount");
if (inputCount) {
  inputCount.addEventListener("change", (e) => {
    state.count = Number(e.target.value);
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
    const firstSvg = document.querySelector("#charactersGrid svg");
    if (firstSvg) {
      downloadSvg(firstSvg, `pixel-character-${Date.now()}.svg`);
    }
  });
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && (e.target === document.body || e.target === document.documentElement)) {
    e.preventDefault();
    renderAll();
  }
});
