const input = document.getElementById("hex-input");
const renderButton = document.getElementById("render-btn");
const palette = document.getElementById("palette");
const status = document.getElementById("status");
const count = document.getElementById("count");

const HEX_REGEX = /#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})/g;

const updateStatus = (message, tone = "default") => {
  status.textContent = message;
  status.dataset.tone = tone;
};

const setCount = (total) => {
  count.textContent = `${total} color${total === 1 ? "" : "s"}`;
};

const normalizeHex = (value) => {
  if (!value) return null;
  return value.startsWith("#") ? value : `#${value}`;
};

const extractHexCodes = (text) => {
  if (!text) return [];
  const matches = [...text.matchAll(HEX_REGEX)];
  return matches.map((match) => normalizeHex(match[0]));
};

const renderPalette = (hexCodes) => {
  palette.innerHTML = "";

  if (!hexCodes.length) {
    palette.innerHTML = "<div class=\"empty-state\">No hex codes found yet. Paste some and hit render.</div>";
    setCount(0);
    return;
  }

  const fragment = document.createDocumentFragment();
  hexCodes.forEach((hex, index) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";

    const colorBlock = document.createElement("div");
    colorBlock.className = "swatch-color";
    colorBlock.style.background = hex;

    const meta = document.createElement("div");
    meta.className = "swatch-meta";
    meta.innerHTML = `<span>${hex.toUpperCase()}</span><span>#${index + 1}</span>`;

    swatch.append(colorBlock, meta);
    fragment.appendChild(swatch);
  });

  palette.appendChild(fragment);
  setCount(hexCodes.length);
};

const handleRender = () => {
  const hexCodes = extractHexCodes(input.value);

  if (!input.value.trim()) {
    updateStatus("Paste some text with hex codes to begin.", "warning");
  } else if (!hexCodes.length) {
    updateStatus("No hex codes found in that text.", "warning");
  } else {
    updateStatus(`Rendered ${hexCodes.length} color${hexCodes.length === 1 ? "" : "s"}.`);
  }

  renderPalette(hexCodes);
};

renderButton.addEventListener("click", handleRender);
input.addEventListener("input", () => {
  if (!input.value.trim()) {
    updateStatus("Waiting for input.");
    renderPalette([]);
    return;
  }

  const hexCodes = extractHexCodes(input.value);
  updateStatus(`Found ${hexCodes.length} hex code${hexCodes.length === 1 ? "" : "s"}.`);
  renderPalette(hexCodes);
});

renderPalette([]);
