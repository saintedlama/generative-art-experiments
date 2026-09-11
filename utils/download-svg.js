/**
 * Triggers a client-side download of an SVG element as a standalone SVG file.
 *
 * @param {SVGElement} svgElement
 * @param {string} [filename='artwork.svg']
 */
export default function downloadSvg(svgElement, filename = "artwork.svg") {
  if (!svgElement) {
    console.error("downloadSvg: No SVG element provided");
    return;
  }

  // Clone so we do not mutate the live DOM
  const clone = svgElement.cloneNode(true);

  // Ensure standard SVG namespaces
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  if (!clone.getAttribute("xmlns:xlink")) {
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  }

  const svgData = '<?xml version="1.0" encoding="utf-8"?>\n' + clone.outerHTML;
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = filename.endsWith(".svg") ? filename : `${filename}.svg`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
