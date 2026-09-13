import { makeNoise2D, makeNoise3D, makeNoise4D } from "fast-simplex-noise";

const CHAR_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Generates a human-friendly short character seed string (e.g. "K7M2").
 * @param {number} [length=4]
 * @returns {string}
 */
export function createShortSeed(length = 4) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHAR_ALPHABET[Math.floor(Math.random() * CHAR_ALPHABET.length)];
  }
  return result;
}

/**
 * Hashes a number or string into an unsigned 32-bit integer seed.
 * @param {number|string} [seed]
 * @returns {number}
 */
export function hashSeed(seed) {
  if (typeof seed === "number") {
    return seed >>> 0;
  }
  const str = String(seed ?? Math.random());
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Deterministic PRNG and random utilities class with seed support.
 */
export class Random {
  /**
   * Generates a short character seed string.
   * @param {number} [length=4]
   * @returns {string}
   */
  static shortSeed(length = 4) {
    return createShortSeed(length);
  }

  /**
   * @param {number|string} [seed]
   */
  constructor(seed) {
    this.seed = seed ?? createShortSeed(4);
    this._state = hashSeed(this.seed);
    this.shortSeed =
      typeof this.seed === "string" && this.seed.length <= 8
        ? this.seed.toUpperCase()
        : (this._state >>> 0).toString(36).padStart(4, "0").slice(0, 4).toUpperCase();
  }

  /**
   * Generates a pseudo-random float in [0, 1) using Mulberry32.
   * @returns {number}
   */
  next() {
    let t = (this._state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns an integer in [0, len - 1].
   * @param {number} len
   * @returns {number}
   */
  clamped(len) {
    return Math.floor(this.next() * len);
  }

  /**
   * Returns an integer in [min, max] inclusive.
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns a float in [min, max).
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  range(min, max) {
    return this.next() * (max - min) + min;
  }

  /**
   * Returns a boolean with the specified probability.
   * @param {number} [chance=0.5]
   * @returns {boolean}
   */
  bool(chance = 0.5) {
    return this.next() < chance;
  }

  /**
   * Picks a random item from an array.
   * @template T
   * @param {T[]} arr
   * @returns {T}
   */
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  /**
   * Shuffles an array deterministically.
   * @template T
   * @param {T[]} arr
   * @returns {T[]} A new shuffled array
   */
  shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Creates a deterministic 2D Simplex Noise function linked to this random instance.
   * @returns {(x: number, y: number) => number}
   */
  createNoise2D() {
    return makeNoise2D(() => this.next());
  }

  /**
   * Creates a deterministic 3D Simplex Noise function linked to this random instance.
   * @returns {(x: number, y: number, z: number) => number}
   */
  createNoise3D() {
    return makeNoise3D(() => this.next());
  }

  /**
   * Creates a deterministic 4D Simplex Noise function linked to this random instance.
   * @returns {(x: number, y: number, z: number, w: number) => number}
   */
  createNoise4D() {
    return makeNoise4D(() => this.next());
  }
}

/**
 * Creates a seeded 2D Simplex Noise function.
 * @param {number|string} [seed]
 * @returns {(x: number, y: number) => number}
 */
export function createNoise2D(seed) {
  return new Random(seed).createNoise2D();
}

/**
 * Creates a seeded 3D Simplex Noise function.
 * @param {number|string} [seed]
 * @returns {(x: number, y: number, z: number) => number}
 */
export function createNoise3D(seed) {
  return new Random(seed).createNoise3D();
}

/**
 * Creates a seeded 4D Simplex Noise function.
 * @param {number|string} [seed]
 * @returns {(x: number, y: number, z: number, w: number) => number}
 */
export function createNoise4D(seed) {
  return new Random(seed).createNoise4D();
}

/**
 * Legacy clamped random helper.
 * @param {number} len
 * @returns {number}
 */
export function randomClamped(len) {
  return Math.floor(Math.random() * len);
}
