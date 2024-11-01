import { create, all, ConfigOptions } from "mathjs";
import CodeFlask from "codeflask";
import { compress, decompress } from "./compress.ts";
import { sanitizeLine } from "./identifier.ts";

const config: ConfigOptions = {
  number: "BigNumber",
  // Number of significant digits for BigNumbers
  // precision: 20
};
const math = create(all, config);

const isAlphaOriginal = math.Unit.isValidAlpha;
math.Unit.isValidAlpha = function (c) {
  return isAlphaOriginal(c) || ["$"].includes(c);
};
math.createUnit({
  USD: {
    prefixes: "none",
    aliases: ["usd", "dollar", "dollars", "$"],
  },
});

// TODO: "as percent of"
// TODO: "to percent"

const flask = new CodeFlask(".code-editor", {
  language: "js",
  lineNumbers: true,
  rightSidebar: true,
});
flask.onUpdate((lines) => {
  const parser = math.parser();

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Ignore comments and headers
    // TODO: comments at end of line
    // TODO: syntax highlighting for headers
    if (line.startsWith("//") || line.startsWith("#")) {
      continue;
    }

    // TODO: remove commas between numbers

    line = sanitizeLine(lines[i]);
    try {
      const r = parser.evaluate(line);
      if (r) {
        // TODO: better formatting of output
        console.log({ line, r });
        // @ts-expect-error need to fix export type in codeflask
        flask.elRightSidebarLines[i].innerText = r.toString();
      }
    } catch (e) {
      // @ts-expect-error need to fix export type in codeflask
      flask.elRightSidebarLines[i].innerText = e.message;
    }
  }
});

const hash = window.location.hash;
if (hash !== "") {
  const code = decompress(hash.substring(1));
  flask.updateCode(code);
}

// TODO: some indicator of unsaved work?
document.querySelector("#save")?.addEventListener("click", () => {
  window.location.hash = compress(flask.getCode());
});