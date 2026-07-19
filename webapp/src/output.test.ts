import { describe, expect, test } from "@jest/globals";
import { evaluateLine, math } from "./line.ts";
import { formatOutput } from "./output.ts";

describe("formatOutput", () => {
  test.each([
    { input: "$5", expected: "$5" },
    { input: "$5/hour", expected: "$5 / hour" },
    {
      input: "5kg/day",
      expected: "5 kg / day",
    },
    { input: "1", expected: "1" },
    { input: "12", expected: "12" },
    { input: "123", expected: "123" },
    { input: "1234", expected: "1,234" },
    { input: "12345", expected: "12,345" },
    { input: "123456", expected: "123,456" },
    { input: "1234567", expected: "1,234,567" },
    { input: "12345678", expected: "12,345,678" },
    { input: "123456789", expected: "123,456,789" },
    { input: "1234567890", expected: "1.234e+9" },
    { input: "12345678901", expected: "1.234e+10" },
    { input: "123456789012", expected: "1.234e+11" },
    { input: "$5000", expected: "$5,000" },
    { input: "$1234567", expected: "$1,234,567" },
    { input: "$1234567890", expected: "$1.234e+9" },
    { input: "1234567 kg", expected: "1,234,567 kg" },
    { input: "$1234567/hour", expected: "$1,234,567 / hour" },
  ])("$input", ({ input, expected }) => {
    const parser = math.parser();
    const result = evaluateLine(parser, input);
    expect(formatOutput(math, result)).toBe(expected);
  });
});
