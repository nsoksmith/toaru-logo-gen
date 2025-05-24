const textInput = document.getElementById("logoText");
const styleSelect = document.getElementById("styleSelect");
const svgText = document.getElementById("svgText");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");

function updateGradient() {
  const stop1 = document.querySelector('#railgun-gradient stop:nth-child(1)');
  const stop2 = document.querySelector('#railgun-gradient stop:nth-child(2)');
  stop1.setAttribute('stop-color', color1.value);
  stop2.setAttribute('stop-color', color2.value);
}

function updateLogo() {
  svgText.textContent = textInput.value || "とある文字";
  svgText.setAttribute("class", styleSelect.value === "index" ? "style-index" : "style-railgun");
  updateGradient();
}

textInput.addEventListener("input", updateLogo);
styleSelect.addEventListener("change", updateLogo);
color1.addEventListener("input", updateLogo);
color2.addEventListener("input", updateLogo);

function downloadSVG() {
  const svg = document.getElementById("logoSVG");
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "toaru-logo.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadPNG() {
  const svg = document.getElementById("logoSVG");
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "toaru-logo.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  img.src = url;
}

updateLogo();
