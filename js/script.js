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

// イベントリスナー登録
kanji2Input.addEventListener("input", updateLogo);
kanji4Input.addEventListener("input", updateLogo);
katakanaInput.addEventListener("input", updateLogo);
color1.addEventListener("input", updateLogo);
color2.addEventListener("input", updateLogo);

styleSelectButtons.index.addEventListener("click", () => setStyle("index"));
styleSelectButtons.railgun.addEventListener("click", () => setStyle("railgun"));

// 初期設定
setStyle("index");
