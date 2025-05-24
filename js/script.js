const kanji2Input = document.getElementById("kanji2");
const kanji4Input = document.getElementById("kanji4");
const katakanaInput = document.getElementById("katakana");
const styleSelectButtons = {
  blue: document.getElementById("blueBtn"),
  red: document.getElementById("redBtn"),
};
const svgText = document.getElementById("svgText");
const logoSVG = document.getElementById("logoSVG");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const errorMsg = document.getElementById("errorMsg");

kanji2Input.value = "仮設";
kanji4Input.value = "意匠生成";
katakanaInput.value = "ロゴジェネレータ";

let currentStyle = "blue";

function convertToKatakana(str) {
  return str.replace(/[\u3041-\u3096]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) + 0x60)
  );
}

function checkError(kanji2, kanji4, katakana) {
  const lowerKatakana = katakana.toLowerCase();

  if (
    kanji2 === "魔術" &&
    kanji4 === "禁書目録" &&
    (lowerKatakana === "いんでっくす" || lowerKatakana === "インデックス")
  ) {
    return "「魔術」「禁書目録」「インデックス」の組み合わせは使用できません。";
  }
  if (
    kanji2 === "科学" &&
    kanji4 === "超電磁砲" &&
    (lowerKatakana === "れーるがん" || lowerKatakana === "レールガン")
  ) {
    return "「科学」「超電磁砲」「レールガン」の組み合わせは使用できません。";
  }
  return "";
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
  let katakanaRaw = katakanaInput.value.trim();
  if (!kanji2 || !kanji4 || !katakanaRaw) {
    errorMsg.textContent = "";
    logoSVG.style.display = "none";
    return;
  }

  // 強制カタカナ変換
  katakanaRaw = convertToKatakana(katakanaRaw);

  const error = checkError(kanji2, kanji4, katakanaRaw);
  if (error) {
    errorMsg.textContent = error;
    logoSVG.style.display = "none";
    return;
  } else {
    errorMsg.textContent = "";
  }

  logoSVG.style.display = "block";
  svgText.textContent = `とある${kanji2}の${kanji4}${katakanaRaw}`;
  svgText.setAttribute(
    "class",
    currentStyle === "blue" ? "style-index" : "style-railgun"
  );

  updateGradient();
}

function setStyle(style) {
  currentStyle = style;
  if (style === "blue") {
    // 青系グラデーションカラー
    color1.value = "#337ab7";
    color2.value = "#23527c";
  } else {
    // 赤系グラデーションカラー
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

kanji2Input.addEventListener("input", updateLogo);
kanji4Input.addEventListener("input", updateLogo);
katakanaInput.addEventListener("input", updateLogo);
color1.addEventListener("input", updateLogo);
color2.addEventListener("input", updateLogo);

styleSelectButtons.blue.addEventListener("click", () => setStyle("blue"));
styleSelectButtons.red.addEventListener("click", () => setStyle("red"));

document.getElementById("downloadSVG").addEventListener("click", downloadSVG);
document.getElementById("downloadPNG").addEventListener("click", downloadPNG);

setStyle("blue");
updateLogo();
