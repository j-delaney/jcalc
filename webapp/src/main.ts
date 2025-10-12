import CodeFlask from "codeflask";
import { compress, decompress } from "./compress.ts";
import { evaluateLines } from "./line.ts";

// TODO: "as percent of"
// TODO: "to percent"

const flask = new CodeFlask(".code-editor", {
  language: "js",
  lineNumbers: true,
  rightSidebar: true,
});

function saveCode() {
  window.location.hash = compress(flask.getCode());
  updateSaveButton();
}

flask.onUpdate((lines) => {
  evaluateLines(lines).forEach((result, i) => {
    flask.elRightSidebarLines[i].innerText = result;
  });

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

window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    return "";
  }
});

export const exportedForTesting = {
  evaluateLines,
};
