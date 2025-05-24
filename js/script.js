const kanji2Input = document.getElementById("kanji2");
const kanji4Input = document.getElementById("kanji4");
const katakanaInput = document.getElementById("katakana");
const styleSelectButtons = {
  index: document.getElementById("indexBtn"),
  railgun: document.getElementById("railgunBtn"),
};
const svgText = document.getElementById("svgText");
const logoSVG = document.getElementById("logoSVG");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");

const downloadSVGBtn = document.getElementById("downloadSVG");
const downloadPNGBtn = document.getElementById("downloadPNG");

let currentStyle = "index";

function convertToKatakana(str) {
  return str.replace(/[\u3041-\u3096]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0x60)
  );
}

function updateGradient() {
  const stop1 = document.querySelector("#railgun-gradient stop:nth-child(1)");
  const stop2 = document.querySelector("#railgun-gradient stop:nth-child(2)");
  stop1.setAttribute("stop-color", color1.value);
  stop2.setAttribute("stop-color", color2.value);
}

function updateLogo() {
  const kanji2 = kanji2Input.value.trim();
  const kanji4 = kanji4Input.value.trim();
  const katakanaRaw = katakanaInput.value.trim();

  const isComplete = kanji2 && kanji4 && katakanaRaw;
  if (!isComplete) {
    logoSVG.style.display = "none";
    return;
  }

  logoSVG.style.display = "block";
  const katakana = convertToKatakana(katakanaRaw);
  svgText.textContent = `とある${kanji2}の${kanji4}${katakana}`;
  svgText.setAttribute(
    "class",
    currentStyle === "index" ? "style-index" : "style-railgun"
  );

  updateGradient();
}

function setStyle(style) {
  currentStyle = style;
  if (style === "index") {
    // 禁書目録グラデーションカラー
    color1.value = "#337ab7";
    color2.value = "#23527c";
  } else {
    // 超電磁砲グラデーションカラー
    color1.value = "#ff9900";
    color2.value = "#cc0000";
  }
  updateLogo();
}

function downloadSVG() {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(logoSVG);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "toaru-logo.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPNG() {
  const serializer = new XMLSerializer();
  const svgData = serializer.serializeToString(logoSVG);
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// イベントリスナー登録
kanji2Input.addEventListener("input", updateLogo);
kanji4Input.addEventListener("input", updateLogo);
katakanaInput.addEventListener("input", updateLogo);
color1.addEventListener("input", updateLogo);
color2.addEventListener("input", updateLogo);

styleSelectButtons.index.addEventListener("click", () => setStyle("index"));
styleSelectButtons.railgun.addEventListener("click", () => setStyle("railgun"));

downloadSVGBtn.addEventListener("click", downloadSVG);
downloadPNGBtn.addEventListener("click", downloadPNG);

// 初期設定
setStyle("index");
