const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const svgText = document.getElementById("svgText");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const orientationRadios = document.querySelectorAll('input[name="orientation"]');

function updateLogo() {
  const part1 = input1.value.trim();
  const part2 = input2.value.trim();
  let part3 = input3.value.trim();

  // カタカナ強制変換
  part3 = part3.replace(/[\u3041-\u3096]/g, s =>
    String.fromCharCode(s.charCodeAt(0) + 0x60)
  );

  svgText.textContent = `とある${part1}の${part2}${part3}`;

  const orientation = [...orientationRadios].find(r => r.checked).value;
  if (orientation === "vertical") {
    svgText.setAttribute("transform", "rotate(-90 300 200)");
  } else {
    svgText.removeAttribute("transform");
  }

  updateGradient();
}

function updateGradient() {
  const stops = document.querySelectorAll("#logo-gradient stop");
  stops[0].setAttribute("stop-color", color1.value);
  stops[1].setAttribute("stop-color", color2.value);
}

function applyPreset(type) {
  if (type === "index") {
    color1.value = "#337ab7";
    color2.value = "#23527c";
  } else if (type === "railgun") {
    color1.value = "#ff9900";
    color2.value = "#cc0000";
  }
  updateLogo();
}

function downloadSVG() {
  const svg = document.getElementById("logoSVG");
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "toaru-logo.svg";
  a.click();
}

function downloadPNG() {
  const svg = document.getElementById("logoSVG");
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
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
    a.click();
  };
  img.src = url;
}

[input1, input2, input3, color1, color2].forEach(el => {
  el.addEventListener("input", updateLogo);
});
orientationRadios.forEach(r => r.addEventListener("change", updateLogo));

updateLogo();
