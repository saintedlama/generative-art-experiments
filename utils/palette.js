// Neon colors curated from https://simplicable.com/new/neon-colors
export const brightChartreuse = "#dfff11";
export const brightGreen = "#66ff00";
export const brightMagenta = "#ff08e8";
export const brightPink = "#fe01b1";
export const brightPurple = "#be03fd";
export const brightRed = "#ff000d";
export const brightSaffron = "#ffcf09";
export const brightScarlet = "#fc0e34";
export const brightTeal = "#01f9c6";
export const electricCrimson = "#ff003f";
export const electricCyan = "#0ff0fc";
export const electricFlamingo = "#fc74fd";
export const electricGreen = "#21fc0d";
export const electricIndigo = "#6600ff";
export const electricLime = "#ccff00";
export const electricOrange = "#ff3503";
export const electricPink = "#ff0490";
export const electricPurple = "#bf00ff";
export const electricRed = "#e60000";
export const electricSheep = "#55ffff";
export const electricViolet = "#8f00f1";
export const electricYellow = "#fffc00";
export const fluorescentGreen = "#08ff08";
export const fluorescentOrange = "#ffcf00";
export const fluorescentPink = "#fe1493";
export const fluorescentRed = "#ff5555";
export const fluorescentRedOrange = "#fc8427";
export const fluorescentTurquoise = "#00fdff";
export const fluorescentYellow = "#ccff02";
export const lightNeonPink = "#ff11ff";
export const neonBlue = "#04d9ff";
export const neonCarrot = "#ff9933";
export const beonCarrot = "#ff9933"; // Backward compatibility alias
export const neonFuchsia = "#fe4164";
export const neonGreen = "#39ff14";
export const neonPink = "#fe019a";
export const neonPurple = "#bc13fe";
export const neonRed = "#ff073a";
export const neonYellow = "#cfff04";
export const pinkishRedNeon = "#ff0055";

export const bluish = [
  brightPurple,
  brightTeal,
  electricCyan,
  electricFlamingo,
  electricIndigo,
  electricPurple,
  electricSheep,
  electricViolet,
  fluorescentTurquoise,
  neonBlue,
  neonPurple,
];

export const redish = [
  brightMagenta,
  brightPink,
  brightRed,
  brightScarlet,
  electricCrimson,
  electricOrange,
  electricPink,
  electricRed,
  fluorescentPink,
  fluorescentRed,
  fluorescentRedOrange,
  lightNeonPink,
  neonFuchsia,
  neonPink,
  neonRed,
  pinkishRedNeon,
];

export const yellowish = [brightChartreuse, brightSaffron, electricLime, electricYellow, fluorescentOrange, fluorescentYellow, neonYellow];

export const greenish = [brightGreen, brightTeal, electricGreen, electricLime, fluorescentGreen, neonGreen];

export const neonColors = [
  brightChartreuse,
  brightGreen,
  brightMagenta,
  brightPink,
  brightPurple,
  brightRed,
  brightSaffron,
  brightScarlet,
  brightTeal,
  electricCrimson,
  electricCyan,
  electricFlamingo,
  electricGreen,
  electricIndigo,
  electricLime,
  electricOrange,
  electricPink,
  electricPurple,
  electricRed,
  electricSheep,
  electricViolet,
  electricYellow,
  fluorescentGreen,
  fluorescentOrange,
  fluorescentPink,
  fluorescentRed,
  fluorescentRedOrange,
  fluorescentTurquoise,
  fluorescentYellow,
  lightNeonPink,
  neonBlue,
  neonCarrot,
  neonFuchsia,
  neonGreen,
  neonPink,
  neonPurple,
  neonRed,
  neonYellow,
  pinkishRedNeon,
];

export const themes = {
  cyberpunk: [electricCrimson, neonBlue, brightPurple, electricYellow],
  synthwave: [neonPink, electricViolet, electricCyan, fluorescentOrange],
  acidMatrix: [brightGreen, electricLime, fluorescentTurquoise, electricYellow],
  sunset: [fluorescentRedOrange, neonFuchsia, electricPurple, brightSaffron],
  deepOcean: [neonBlue, brightTeal, electricIndigo, electricSheep],
};

/**
 * Pick a random color from an array of hex colors.
 * @param {string[]} [palette=neonColors]
 * @returns {string}
 */
export function randomColor(palette = neonColors) {
  return palette[Math.floor(Math.random() * palette.length)];
}
