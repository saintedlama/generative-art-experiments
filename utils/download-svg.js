export default function downloadSvg(svgElement, filename) {
  const svgBlob = new Blob([svgElement.outerHTML], { type: "application/svg" });
  const url = URL.createObjectURL(svgBlob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
