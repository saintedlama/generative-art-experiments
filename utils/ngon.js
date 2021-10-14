export default function ngon(sides, radius, x, y) {
  var points = [];

  for (var i = 0; i <= sides; i++) {
    var angle = (i / sides) * Math.PI * 2;
    points.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)]);
  }

  return points;
}
