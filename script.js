const CARD_WIDTH = 744;
const CARD_HEIGHT = 1039;

const canvas = new fabric.Canvas("card-canvas", {
  backgroundColor: "#ffffff",
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  preserveObjectStacking: true,
});

let backgroundRect = null;
let artWindowRect = null;
let rulesBoxRect = null;
let typePlateRect = null;
let ptPlateRect = null;
let namePlateRect = null;
let nameShineRect = null;
let cardName;
let cardType;
let rulesText;
let ptText;

const FONT_CHOICES = {
  cinzel: "'Cinzel', serif",
  cormorant: "'Cormorant Garamond', serif",
  imfell: "'IM Fell English', serif",
  kalam: "'Kalam', cursive",
  shadows: "'Shadows Into Light', cursive",
  nanum: "'Nanum Pen Script', cursive",
  covered: "'Covered By Your Grace', cursive",
  justhand: "'Just Another Hand', cursive",
  singleday: "'Single Day', cursive",
  indie: "'Indie Flower', cursive",
  gochi: "'Gochi Hand', cursive",
  homemade: "'Homemade Apple', cursive",
  patrick: "'Patrick Hand SC', cursive",
  medieval: "'MedievalSharp', cursive",
  jimnight: "'Jim Nightshade', cursive",
  eagle: "'Eagle Lake', cursive",
  uncial: "'Uncial Antiqua', cursive",
  metamorphous: "'Metamorphous', serif",
  inknut: "'Inknut Antiqua', serif",
  beleren: "'Beleren Small Caps', serif",
  belerenRegular: "'Beleren', serif",
};
const DEFAULT_FONT = FONT_CHOICES.belerenRegular;
const BASE_WEIGHTS = {
  name: 600,
  type: 500,
  rules: 400,
  pt: 700,
};
let currentFontFamily = DEFAULT_FONT;
let isBold = false;
let isItalic = false;

const CARD_BORDER_MARGIN = 8;
const OVERLAY_INSET = 36;
const NAME_BLOCK_HEIGHT = 80;
const TYPE_BLOCK_HEIGHT = 64;
const RULES_BLOCK_HEIGHT = 220;
const PT_BLOCK_WIDTH = 120;
const PT_BLOCK_HEIGHT = 58;
const TEXT_PADDING = 26;
let nameFontSize = 45;
let typeFontSize = 33;
let rulesFontSize = 30;
let ptFontSize = 45;
let nameAlignment = "left";
let typeAlignment = "left";
let rulesAlignment = "left";
const RULES_BOTTOM = 1000;
const TYPE_GAP_WITH_RULES = 16;
const TYPE_GAP_WITHOUT_RULES = 100;
const RULES_TEXT_OFFSET = 24;
const PT_TOP_POSITION = 952;

let rulesBoxHeight = RULES_BLOCK_HEIGHT;

const rulesLayout = (showRules) => {
  const nameTop = OVERLAY_INSET;
  const nameTextOffset = Math.max((NAME_BLOCK_HEIGHT - nameFontSize) / 2, 0);
  const nameTextTop = nameTop + nameTextOffset;

  const effectiveRulesHeight = showRules ? rulesBoxHeight : 0;
  const rulesTop = RULES_BOTTOM - effectiveRulesHeight;
  const typeGap = showRules ? TYPE_GAP_WITH_RULES : TYPE_GAP_WITHOUT_RULES;
  const typeTop = rulesTop - typeGap - TYPE_BLOCK_HEIGHT;
  const typeTextOffset = Math.max((TYPE_BLOCK_HEIGHT - typeFontSize) / 2, 0);
  const typeTextTop = typeTop + typeTextOffset;
  const rulesTextTop = showRules ? rulesTop + RULES_TEXT_OFFSET : rulesTop;

  const ptTop = Math.min(
    PT_TOP_POSITION,
    CARD_HEIGHT - CARD_BORDER_MARGIN - PT_BLOCK_HEIGHT - 4
  );

  return {
    nameTop,
    nameTextTop,
    typeTop,
    typeTextTop,
    rulesTop,
    rulesTextTop,
    rulesHeight: effectiveRulesHeight,
    ptTop,
  };
};

const createFrame = () => {
  const layout = rulesLayout(true);
  const overlayShadow = new fabric.Shadow({
    color: "rgba(0, 0, 0, 0.35)",
    blur: 20,
    offsetX: 0,
    offsetY: 14,
  });
  const overlayFill = "rgba(250, 250, 250, 0.92)";
  const overlayStroke = "#000000";

  backgroundRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fill: "#ffffff",
    selectable: false,
    evented: false,
  });

  artWindowRect = new fabric.Rect({
    left: 0,
    top: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    rx: 0,
    ry: 0,
    fill: "#ffffff",
    stroke: null,
    selectable: false,
    evented: false,
    name: "artWindow",
  });

  const overlayLeft = OVERLAY_INSET;
  const overlayWidth = CARD_WIDTH - OVERLAY_INSET * 2;


  namePlateRect = new fabric.Rect({
    left: overlayLeft,
    top: layout.nameTop,
    width: overlayWidth,
    height: NAME_BLOCK_HEIGHT,
    rx: 18,
    ry: 18,
    fill: overlayFill,
    stroke: overlayStroke,
    strokeWidth: 2.5,
    selectable: false,
    evented: false,
    shadow: overlayShadow,
  });

  nameShineRect = new fabric.Rect({
    left: namePlateRect.left + 16,
    top: namePlateRect.top + 12,
    width: namePlateRect.width - 32,
    height: 16,
    rx: 8,
    ry: 8,
    fill: "rgba(255, 255, 255, 0.25)",
    selectable: false,
    evented: false,
  });

  rulesBoxRect = new fabric.Rect({
    left: overlayLeft,
    top: layout.rulesTop,
    width: overlayWidth,
    height: layout.rulesHeight,
    rx: 18,
    ry: 18,
    fill: overlayFill,
    stroke: overlayStroke,
    strokeWidth: 2.5,
    selectable: false,
    evented: false,
    shadow: overlayShadow,
  });

  typePlateRect = new fabric.Rect({
    left: overlayLeft,
    top: layout.typeTop,
    width: overlayWidth,
    height: TYPE_BLOCK_HEIGHT,
    rx: 18,
    ry: 18,
    fill: overlayFill,
    stroke: overlayStroke,
    strokeWidth: 2.5,
    selectable: false,
    evented: false,
    shadow: overlayShadow,
  });

  ptPlateRect = new fabric.Rect({
    left: overlayLeft + overlayWidth - PT_BLOCK_WIDTH + 22,
    top: layout.ptTop,
    width: PT_BLOCK_WIDTH,
    height: PT_BLOCK_HEIGHT,
    rx: 20,
    ry: 20,
    fill: overlayFill,
    stroke: overlayStroke,
    strokeWidth: 2.5,
    selectable: false,
    evented: false,
    shadow: overlayShadow,
  });

  canvas.add(
    backgroundRect,
    artWindowRect,
    rulesBoxRect,
    typePlateRect,
    ptPlateRect,
    namePlateRect,
    nameShineRect
  );
};
let artworkImage = null;

const focusTextLayers = () => {
  [namePlateRect, nameShineRect, typePlateRect, rulesBoxRect, ptPlateRect].forEach(
    (rect) => rect && canvas.bringToFront(rect)
  );
  [cardName, cardType, rulesText, ptText].forEach((text) => text && canvas.bringToFront(text));
};

const syncArtworkToWindow = () => {
  if (!artWindowRect || !artworkImage) {
    return;
  }

  const centerX = artWindowRect.left + artWindowRect.width / 2;
  const centerY = artWindowRect.top + artWindowRect.height / 2;

  artworkImage.set({
    left: centerX,
    top: centerY,
    originX: "center",
    originY: "center",
  });

  const neededScale = Math.max(
    artWindowRect.width / artworkImage.width,
    artWindowRect.height / artworkImage.height
  );

  if (artworkImage.scaleX < neededScale) {
    artworkImage.scale(neededScale);
  }

  const clip = artworkImage.clipPath;
  if (clip) {
    clip.set({
      width: artWindowRect.width,
      height: artWindowRect.height,
      rx: artWindowRect.rx,
      ry: artWindowRect.ry,
      originX: "center",
      originY: "center",
      left: centerX,
      top: centerY,
      absolutePositioned: true,
    });
    clip.dirty = true;
    clip.setCoords();
  }

  artworkImage.setCoords();
};

const applyTextAlignments = (shouldRender = true) => {
  if (cardName) {
    cardName.set({ textAlign: nameAlignment });
    cardName.setCoords();
  }

  if (cardType) {
    cardType.set({ textAlign: typeAlignment });
    cardType.setCoords();
  }

  if (rulesText) {
    rulesText.set({ textAlign: rulesAlignment });
    rulesText.setCoords();
  }

  if (shouldRender) {
    focusTextLayers();
    canvas.requestRenderAll();
  }
};

const alignPTText = () => {
  if (!ptText || !ptPlateRect) {
    return;
  }

  const padding = 8;
  ptText.set({
    width: Math.max(ptPlateRect.width - padding * 2, 20),
    originX: "center",
    textAlign: "center",
    left: ptPlateRect.left + ptPlateRect.width / 2 + 4,
  });

  const scaledHeight =
    typeof ptText.getScaledHeight === "function"
      ? ptText.getScaledHeight()
      : ptText.height || ptPlateRect.height;

  const verticalOffset = Math.max((ptPlateRect.height - scaledHeight) / 2, 0);

  ptText.set({
    originY: "top",
    top: ptPlateRect.top + verticalOffset,
  });

  ptText.setCoords();
};

const applyFontStyles = (shouldRender = true) => {
  const fontStyle = isItalic ? "italic" : "normal";
  const resolveWeight = (key) => (isBold ? 700 : BASE_WEIGHTS[key] || 400);

  if (cardName) {
    cardName.set({
      fontFamily: currentFontFamily,
      fontSize: nameFontSize,
      fontStyle,
      fontWeight: resolveWeight("name"),
    });
    cardName.setCoords();
  }

  if (cardType) {
    cardType.set({
      fontFamily: currentFontFamily,
      fontSize: typeFontSize,
      fontStyle,
      fontWeight: resolveWeight("type"),
    });
    cardType.setCoords();
  }

  if (rulesText) {
    rulesText.set({
      fontFamily: currentFontFamily,
      fontSize: rulesFontSize,
      fontStyle,
      fontWeight: resolveWeight("rules"),
    });
    rulesText.setCoords();
  }

  if (ptText) {
    ptText.set({
      fontFamily: currentFontFamily,
      fontSize: ptFontSize,
      fontStyle,
      fontWeight: resolveWeight("pt"),
    });
    ptText.setCoords();
    alignPTText();
  }

  applyTextAlignments(false);

  if (shouldRender) {
    focusTextLayers();
    canvas.requestRenderAll();
  }
};

const applyCanvasLayout = (showRules) => {
  if (!namePlateRect || !typePlateRect || !ptPlateRect || !rulesBoxRect) {
    return;
  }

  const layout = rulesLayout(showRules);

  namePlateRect.set({ top: layout.nameTop });
  namePlateRect.setCoords();

  if (nameShineRect) {
    nameShineRect.set({
      top: namePlateRect.top + 12,
      left: namePlateRect.left + 16,
      width: namePlateRect.width - 32,
    });
    nameShineRect.setCoords();
  }

  if (cardName) {
    cardName.set({
      top: layout.nameTextTop,
      left: namePlateRect.left + TEXT_PADDING,
      width: namePlateRect.width - TEXT_PADDING * 2,
    });
    cardName.setCoords();
  }

  typePlateRect.set({ top: layout.typeTop });
  typePlateRect.setCoords();

  if (cardType) {
    cardType.set({
      top: layout.typeTextTop,
      left: typePlateRect.left + TEXT_PADDING,
      width: typePlateRect.width - TEXT_PADDING * 2,
    });
    cardType.setCoords();
  }

  rulesBoxRect.set({
    top: layout.rulesTop,
    height: layout.rulesHeight,
    visible: showRules,
    evented: showRules,
  });
  rulesBoxRect.setCoords();

  if (rulesText) {
    rulesText.set({
      top: layout.rulesTextTop,
      left: rulesBoxRect.left + TEXT_PADDING,
      width: rulesBoxRect.width - TEXT_PADDING * 2,
      visible: showRules,
      selectable: showRules,
      evented: showRules,
      editable: showRules,
    });
    rulesText.setCoords();
  }

  ptPlateRect.set({ top: layout.ptTop });
  ptPlateRect.setCoords();

  if (ptText) {
    alignPTText();
  }

  applyTextAlignments(false);
  syncArtworkToWindow();
  focusTextLayers();
  canvas.requestRenderAll();
};
const loadFonts = async () => {
  if (!document.fonts) {
    return;
  }
  try {
    const primaryFamilies = Array.from(new Set(Object.values(FONT_CHOICES).map((family) => family.split(',')[0].trim())));
    const fontPromises = primaryFamilies.flatMap((family) => [
      document.fonts.load(`400 36px ${family}`),
      document.fonts.load(`700 36px ${family}`),
    ]);
    await Promise.all(fontPromises);
  } catch (err) {
    // If fonts fail to load, Fabric will fall back to defaults.
  }
};

const initCard = async () => {
  await loadFonts();
  createFrame();
  const layout = rulesLayout(true);

  cardName = new fabric.Textbox("Spirit Token", {
    left: namePlateRect.left + TEXT_PADDING,
    top: layout.nameTextTop,
    width: namePlateRect.width - TEXT_PADDING * 2,
    fontFamily: currentFontFamily,
    fontSize: nameFontSize,
    fill: "#1a1a1d",
    fontWeight: BASE_WEIGHTS.name,
    fontStyle: isItalic ? "italic" : "normal",
    editable: true,
    textAlign: nameAlignment,
  });

  cardType = new fabric.Textbox("Creature - Spirit", {
    left: typePlateRect.left + TEXT_PADDING,
    top: layout.typeTextTop,
    width: typePlateRect.width - TEXT_PADDING * 2,
    fontFamily: currentFontFamily,
    fontSize: typeFontSize,
    fill: "#1a1a1d",
    fontWeight: BASE_WEIGHTS.type,
    fontStyle: isItalic ? "italic" : "normal",
    editable: true,
    textAlign: typeAlignment,
  });

  rulesText = new fabric.Textbox("Flying\nLifelink", {
    left: rulesBoxRect.left + TEXT_PADDING,
    top: layout.rulesTextTop,
    width: rulesBoxRect.width - TEXT_PADDING * 2,
    fontFamily: currentFontFamily,
    fontSize: rulesFontSize,
    lineHeight: 1.28,
    fill: "#1d1d1d",
    fontWeight: BASE_WEIGHTS.rules,
    fontStyle: isItalic ? "italic" : "normal",
    editable: true,
    textAlign: rulesAlignment,
  });

  ptText = new fabric.Textbox("1/1", {
    left: ptPlateRect.left + ptPlateRect.width / 2,
    top: ptPlateRect.top + ptPlateRect.height / 2,
    width: ptPlateRect.width - 32,
    originX: "center",
    originY: "center",
    fontFamily: currentFontFamily,
    fontSize: ptFontSize,
    fontWeight: BASE_WEIGHTS.pt,
    fontStyle: isItalic ? "italic" : "normal",
    fill: "#1a1a1d",
    textAlign: "center",
    editable: false,
  });

  canvas.add(cardName, cardType, rulesText, ptText);
  applyCanvasLayout(true);
  applyTextAlignments(false);
  applyFontStyles(false);
  focusTextLayers();
  canvas.renderAll();
};

const loadArtwork = (file) => {
  if (!file || !artWindowRect) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    const dataURL = evt.target.result;
    fabric.Image.fromURL(
      dataURL,
      (img) => {
        if (artworkImage) {
          canvas.remove(artworkImage);
        }

        const maxWidth = artWindowRect.width;
        const maxHeight = artWindowRect.height;
        const scale = Math.max(maxWidth / img.width, maxHeight / img.height);

        img.set({
          selectable: true,
          hasBorders: true,
          hasControls: true,
          originX: "center",
          originY: "center",
          controlsAboveOverlay: true,
        });
        img.scale(scale);

        img.filters = [new fabric.Image.filters.Grayscale()];
        img.applyFilters();

        img.clipPath = new fabric.Rect({
          width: artWindowRect.width,
          height: artWindowRect.height,
          rx: artWindowRect.rx,
          ry: artWindowRect.ry,
          originX: "center",
          originY: "center",
          left: artWindowRect.left + artWindowRect.width / 2,
          top: artWindowRect.top + artWindowRect.height / 2,
          absolutePositioned: true,
        });

        artworkImage = img;
        canvas.add(img);
        syncArtworkToWindow();
        canvas.setActiveObject(img);
        focusTextLayers();
        canvas.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  };
  reader.readAsDataURL(file);
};

document
  .getElementById("artwork-input")
  .addEventListener("change", (event) => {
    const [file] = event.target.files;
    loadArtwork(file);
  });

const nameInput = document.getElementById("name-input");
const typeInput = document.getElementById("type-input");
const rulesInput = document.getElementById("rule-input");
const powerInput = document.getElementById("power-input");
const toughnessInput = document.getElementById("toughness-input");
const rulesToggle = document.getElementById("rules-toggle");
const rulesField = document.getElementById("rules-field");
const rulesHeightInput = document.getElementById("rules-height-input");
const nameAlignmentSelect = document.getElementById("name-alignment-select");
const typeAlignmentSelect = document.getElementById("type-alignment-select");
const rulesAlignmentSelect = document.getElementById("rules-alignment-select");
const ptToggle = document.getElementById("pt-toggle");
const fontSelect = document.getElementById("font-select");
const boldToggle = document.getElementById("bold-toggle");
const italicToggle = document.getElementById("italic-toggle");
const nameFontSizeInput = document.getElementById("name-font-size");
const typeFontSizeInput = document.getElementById("type-font-size");
const rulesFontSizeInput = document.getElementById("rules-font-size");
const ptFontSizeInput = document.getElementById("pt-font-size");

const clampNumber = (value, min, max, fallback) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, num));
};

const setupFontSizeControl = (input, min, max, getter, setter) => {
  if (!input) {
    return;
  }
  const commit = () => {
    const value = clampNumber(input.value, min, max, getter());
    setter(value);
    input.value = value;
    if (!cardName) {
      return;
    }
    applyFontStyles(false);
    applyCanvasLayout(rulesToggle ? rulesToggle.checked : true);
    canvas.requestRenderAll();
  };

  input.value = getter();
  input.addEventListener("change", commit);
  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
  });
};


const applyRulesVisibility = (show) => {
  if (rulesField) {
    rulesField.classList.remove("hidden");
  }

  if (rulesInput) {
    rulesInput.disabled = false;
  }

  applyCanvasLayout(show);
};

const applyPTVisibility = (show) => {
  if (ptPlateRect) {
    ptPlateRect.set({ visible: show, evented: show });
  }
  if (ptText) {
    ptText.set({ visible: show, evented: show });
  }
  focusTextLayers();
  canvas.requestRenderAll();
};

setupFontSizeControl(nameFontSizeInput, 12, 96, () => nameFontSize, (value) => {
  nameFontSize = value;
});
setupFontSizeControl(typeFontSizeInput, 10, 80, () => typeFontSize, (value) => {
  typeFontSize = value;
});
setupFontSizeControl(rulesFontSizeInput, 10, 60, () => rulesFontSize, (value) => {
  rulesFontSize = value;
});
setupFontSizeControl(ptFontSizeInput, 12, 80, () => ptFontSize, (value) => {
  ptFontSize = value;
});

if (rulesToggle) {
  rulesToggle.addEventListener("change", (event) => {
    applyRulesVisibility(event.target.checked);
  });
}

if (nameAlignmentSelect) {
  nameAlignmentSelect.value = nameAlignment;
  nameAlignmentSelect.addEventListener("change", (event) => {
    nameAlignment = event.target.value || "left";
    applyTextAlignments();
  });
}

if (typeAlignmentSelect) {
  typeAlignmentSelect.value = typeAlignment;
  typeAlignmentSelect.addEventListener("change", (event) => {
    typeAlignment = event.target.value || "left";
    applyTextAlignments();
  });
}

if (rulesAlignmentSelect) {
  rulesAlignmentSelect.value = rulesAlignment;
  rulesAlignmentSelect.addEventListener("change", (event) => {
    rulesAlignment = event.target.value || "left";
    applyTextAlignments();
  });
}

if (rulesHeightInput) {
  rulesHeightInput.value = rulesBoxHeight;
  const commitRulesHeight = () => {
    const raw = Number(rulesHeightInput.value);
    const value = Math.max(80, Math.min(400, Number.isFinite(raw) ? raw : rulesBoxHeight));
    rulesBoxHeight = value;
    rulesHeightInput.value = value;
    if (rulesBoxRect) {
      rulesBoxRect.set({ height: rulesBoxHeight });
      rulesBoxRect.setCoords();
    }
    applyCanvasLayout(rulesToggle ? rulesToggle.checked : true);
  };

  rulesHeightInput.addEventListener("change", commitRulesHeight);
  rulesHeightInput.addEventListener("blur", commitRulesHeight);
  rulesHeightInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitRulesHeight();
    }
  });
}

if (fontSelect) {
  fontSelect.value = currentFontFamily;
  fontSelect.addEventListener("change", (event) => {
    currentFontFamily = event.target.value || DEFAULT_FONT;
    applyFontStyles();
  });
}

if (boldToggle) {
  boldToggle.checked = isBold;
  boldToggle.addEventListener("change", (event) => {
    isBold = event.target.checked;
    applyFontStyles();
  });
}

if (italicToggle) {
  italicToggle.checked = isItalic;
  italicToggle.addEventListener("change", (event) => {
    isItalic = event.target.checked;
    applyFontStyles();
  });
}

if (ptToggle) {
  ptToggle.addEventListener("change", (event) => {
    applyPTVisibility(event.target.checked);
  });
}

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "token";

nameInput.addEventListener("input", (e) => {
  if (!cardName) {
    return;
  }
  cardName.text = e.target.value || "Unnamed Token";
  focusTextLayers();
  canvas.requestRenderAll();
});

typeInput.addEventListener("input", (e) => {
  if (!cardType) {
    return;
  }
  cardType.text = e.target.value || "Creature";
  focusTextLayers();
  canvas.requestRenderAll();
});

rulesInput.addEventListener("input", (e) => {
  if (!rulesText) {
    return;
  }
  rulesText.text = e.target.value || "";
  focusTextLayers();
  canvas.requestRenderAll();
});

const updatePT = () => {
  if (!ptText) {
    return;
  }
  const power = powerInput.value || "0";
  const toughness = toughnessInput.value || "0";
  ptText.set("text", `${power}/${toughness}`);
  alignPTText();
  focusTextLayers();
  canvas.requestRenderAll();
};

powerInput.addEventListener("input", updatePT);
toughnessInput.addEventListener("input", updatePT);

document.getElementById("center-art-btn").addEventListener("click", () => {
  if (!artworkImage || !artWindowRect) {
    return;
  }
  syncArtworkToWindow();
  focusTextLayers();
  canvas.requestRenderAll();
});

document.getElementById("remove-art-btn").addEventListener("click", () => {
  if (!artworkImage) {
    return;
  }
  canvas.remove(artworkImage);
  artworkImage = null;
  document.getElementById("artwork-input").value = "";
  focusTextLayers();
  canvas.requestRenderAll();
});

document.getElementById("download-btn").addEventListener("click", () => {
  canvas.discardActiveObject();
  focusTextLayers();
  canvas.renderAll();

  const link = document.createElement("a");
  link.download = `${slugify(nameInput.value)}.png`;
  link.href = canvas.toDataURL({
    format: "png",
    multiplier: 2,
    enableRetinaScaling: true,
  });
  link.click();
});

canvas.on("object:added", focusTextLayers);
canvas.on("mouse:down", focusTextLayers);

initCard().then(() => {
  applyRulesVisibility(rulesToggle ? rulesToggle.checked : true);
  applyPTVisibility(ptToggle ? ptToggle.checked : true);
});
