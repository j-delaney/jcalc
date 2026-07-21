import CodeFlask from "codeflask";
import { compress, decompress } from "./compress.ts";
import { DEMO_SCRIPT } from "./demo.ts";
import { evaluateLines } from "./line.ts";
import { DEFAULT_OUTPUT_SETTINGS, OutputSettings } from "./output.ts";

// TODO: "as percent of"
// TODO: "to percent"

const flask = new CodeFlask(".code-editor", {
  language: "js",
  lineNumbers: true,
  rightSidebar: true,
});

const OUTPUT_SETTINGS_KEY = "outputSettings";

function loadOutputSettings(): OutputSettings {
  const saved = localStorage.getItem(OUTPUT_SETTINGS_KEY);
  if (!saved) {
    return { ...DEFAULT_OUTPUT_SETTINGS };
  }

  try {
    return { ...DEFAULT_OUTPUT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return { ...DEFAULT_OUTPUT_SETTINGS };
  }
}

let outputSettings = loadOutputSettings();

const settingsFields: {
  key: keyof OutputSettings;
  el: HTMLInputElement | null;
}[] = [
  {
    key: "displayPrecision",
    el: document.querySelector("#display-precision"),
  },
  {
    key: "exponentThreshold",
    el: document.querySelector("#exponent-threshold"),
  },
  {
    key: "exponentDecimals",
    el: document.querySelector("#exponent-decimals"),
  },
];

settingsFields.forEach(({ key, el }) => {
  if (!el) {
    return;
  }

  el.value = outputSettings[key].toString();
  el.addEventListener("change", () => {
    const parsed = parseInt(el.value, 10);
    outputSettings = {
      ...outputSettings,
      [key]: Number.isNaN(parsed) ? DEFAULT_OUTPUT_SETTINGS[key] : parsed,
    };
    el.value = outputSettings[key].toString();
    localStorage.setItem(OUTPUT_SETTINGS_KEY, JSON.stringify(outputSettings));
    renderOutput();
  });
});

function renderOutput() {
  evaluateLines(flask.getCode().split("\n"), outputSettings).forEach(
    (result, i) => {
      flask.elRightSidebarLines[i].innerText = result;
    },
  );
}

function saveCode() {
  window.location.hash = compress(flask.getCode());
  updateSaveButton();
}

flask.onUpdate(() => {
  renderOutput();

  const autosaveCheckbox = document.querySelector(
    "#autosave",
  ) as HTMLInputElement;
  if (autosaveCheckbox?.checked) {
    saveCode();
  } else {
    updateSaveButton();
  }
});

const hash = window.location.hash;
if (hash !== "") {
  const code = decompress(hash.substring(1));
  flask.updateCode(code);
}

const autosaveCheckbox = document.querySelector(
  "#autosave",
) as HTMLInputElement;
if (autosaveCheckbox) {
  const savedAutosave = localStorage.getItem("autosave");
  if (savedAutosave === "true") {
    autosaveCheckbox.checked = true;
  }

  autosaveCheckbox.addEventListener("change", () => {
    localStorage.setItem("autosave", autosaveCheckbox.checked.toString());
  });
}

function hasUnsavedChanges(): boolean {
  const currentCode = flask.getCode();
  const currentHash = window.location.hash;
  if (currentHash === "") {
    return currentCode.trim() !== "";
  }
  return compress(currentCode) !== currentHash.substring(1);
}

function updateSaveButton() {
  const saveBtn = document.querySelector("#save");
  if (saveBtn) {
    if (hasUnsavedChanges()) {
      saveBtn.textContent = "Save *";
      saveBtn.classList.add("unsaved");
    } else {
      saveBtn.textContent = "Save";
      saveBtn.classList.remove("unsaved");
    }
  }
}

document.querySelector("#save")?.addEventListener("click", () => {
  saveCode();
});

document.querySelector("#demo")?.addEventListener("click", () => {
  if (
    !hasUnsavedChanges() ||
    confirm("Replace current editor contents with the demo?")
  ) {
    flask.updateCode(DEMO_SCRIPT);
  }
});

window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    return "";
  }
});

export const exportedForTesting = {
  evaluateLines,
};
