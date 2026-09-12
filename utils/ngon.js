/**
 * Generates an array of [x, y] coordinates for a regular n-gon polygon.
 *
 * @param {number} sides - Number of sides (e.g. 6 for hexagon)
 * @param {number} radius - Distance from center to vertex
 * @param {number} x - Center X coordinate
 * @param {number} y - Center Y coordinate
 * @param {number} [rotation=0] - Initial rotation angle in radians
 * @returns {Array<[number, number]>}
 */
export default function ngon(sides, radius, x, y, rotation = 0) {
  const points = [];
  const step = (Math.PI * 2) / sides;

  for (let i = 0; i <= sides; i++) {
    const angle = i * step + rotation;
    points.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)]);
  }

  return points;
}
