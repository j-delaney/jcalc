import { describe, expect, test } from "@jest/globals";
import { sanitizeLine } from "./identifier.ts";

describe("type conversion using to", () => {
  test("between two variables", () => {
    expect(sanitizeLine("x to y")).toBe("x to y");
  });
  test("between a variable and a number", () => {
    expect(sanitizeLine("x to 1")).toBe("x to 1");
  });
  test("between two multi-word variables", () => {
    expect(sanitizeLine("first second to third fourth")).toBe(
      "first_second to third_fourth",
    );
  });
  test("between a variable and a multi-word variable", () => {
    expect(sanitizeLine("x to first second")).toBe("x to first_second");
  });
});
