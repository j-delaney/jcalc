import { describe, expect, test } from "@jest/globals";
import { evaluateLine, math } from "./line.ts";
import { formatOutput } from "./output.ts";

describe("formatOutput", () => {
  test.each([
    { input: "$5", expected: "5 $" },
    { input: "$5/hour", expected: "5 $ / hour" },
    {
      input: "5kg/day",
      expected:
        "5.000000000000000000000000000000000000000000000000000000000000002 kg / day",
    },
    { input: "1", expected: "1" },
    { input: "12", expected: "12" },
    { input: "123", expected: "123" },
    { input: "1234", expected: "1234" },
    { input: "12345", expected: "12345" },
    { input: "123456", expected: "1.23456e+5" },
  ])("$input", ({ input, expected }) => {
    const parser = math.parser();
    const result = evaluateLine(parser, input);
    expect(formatOutput(math, result)).toBe(expected);
  });
});
