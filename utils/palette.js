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
 * @param {Function|object} [random=Math.random]
 * @returns {string}
 */
export function randomColor(palette = neonColors, random = Math.random) {
  if (typeof random?.pick === "function") {
    return random.pick(palette);
  }
  return palette[Math.floor(random() * palette.length)];
}

// Skin tones
export const skinFair = "#f5caa6";
export const skinPeach = "#f1b38e";
export const skinOlive = "#cca172";
export const skinAmber = "#b57843";
export const skinBronze = "#8c4f26";
export const skinDeepBrown = "#562e16";

export const skinTones = [skinFair, skinPeach, skinOlive, skinAmber, skinBronze, skinDeepBrown];

// Eye colors & whites
export const eyeWhite = "#ffffff";
export const eyeDark = "#1a1c23";
export const eyeBrown = "#5a3825";
export const eyeDarkBrown = "#2e1a0f";
export const eyeBlue = "#2563eb";
export const eyeSkyBlue = "#38bdf8";
export const eyeGreen = "#16a34a";
export const eyeHazel = "#854d0e";
export const eyeGrey = "#64748b";
export const eyeAmber = "#d97706";

export const eyeColors = [eyeDark, eyeBrown, eyeDarkBrown, eyeBlue, eyeSkyBlue, eyeGreen, eyeHazel, eyeGrey, eyeAmber];

// Mouth / lip colors
export const mouthDark = "#451a03";
export const mouthRose = "#9f1239";
export const mouthBerry = "#881337";
export const mouthCoral = "#be123c";
export const mouthDeepRed = "#7f1d1d";
export const mouthNeutral = "#5c2e14";

export const mouthColors = [mouthDark, mouthRose, mouthBerry, mouthCoral, mouthDeepRed, mouthNeutral];

// Hair colors
export const hairBlack = "#18181b";
export const hairDarkBrown = "#2e1a0f";
export const hairChestnut = "#5a2d0c";
export const hairGinger = "#c2410c";
export const hairBlonde = "#eab308";
export const hairPlatinum = "#cbd5e1";
export const hairPink = "#ec4899";
export const hairPurple = "#8b5cf6";
export const hairCyan = "#06b6d4";

export const hairColors = [hairBlack, hairDarkBrown, hairChestnut, hairGinger, hairBlonde, hairPlatinum, hairPink, hairPurple, hairCyan];

// Clothing / fabric colors
export const clothNavy = "#1e3a8a";
export const clothTeal = "#0f766e";
export const clothEmerald = "#047857";
export const clothCrimson = "#b91c1c";
export const clothViolet = "#6d28d9";
export const clothAmber = "#b45309";
export const clothCharcoal = "#334155";
export const clothWhite = "#f8fafc";
export const clothDenim = "#2563eb";
export const clothRose = "#e11d48";
export const clothOlive = "#4d7c0f";
export const clothBlack = "#0f172a";

export const clothColors = [
  clothNavy,
  clothTeal,
  clothEmerald,
  clothCrimson,
  clothViolet,
  clothAmber,
  clothCharcoal,
  clothWhite,
  clothDenim,
  clothRose,
  clothOlive,
  clothBlack,
];

// Pants / trousers colors
export const pantsColors = [clothNavy, clothDenim, clothCharcoal, clothBlack, clothAmber, clothOlive];

// Shoe / footwear colors
export const shoeBlack = "#0f172a";
export const shoeDarkSlate = "#1e293b";
export const shoeBrown = "#451a03";
export const shoeTan = "#78350f";
export const shoeWhite = "#f8fafc";
export const shoeRed = "#b91c1c";

export const shoeColors = [shoeBlack, shoeDarkSlate, shoeBrown, shoeTan, shoeWhite, shoeRed];
