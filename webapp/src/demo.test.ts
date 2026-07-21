import { describe, expect, test } from "@jest/globals";
import { DEMO_SCRIPT } from "./demo.ts";
import { evaluateLines } from "./line.ts";

describe("DEMO_SCRIPT", () => {
  test("evaluates every non-blank, non-comment line without error", () => {
    const lines = DEMO_SCRIPT.split("\n");
    const results = evaluateLines(lines);

    results.forEach((result, i) => {
      const line = lines[i].trim();
      const isCommentOrHeader = line.startsWith("#") || line === "";
      if (isCommentOrHeader) {
        return;
      }

      expect(result).not.toBe("");
      expect(result.toLowerCase()).not.toMatch(/error|undefined|unexpected/);
    });
  });
});
