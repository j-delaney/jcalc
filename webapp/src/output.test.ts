import { describe, expect, test } from "@jest/globals";
import { evaluateLine, math } from "./line.ts";
import { DEFAULT_OUTPUT_SETTINGS, formatOutput } from "./output.ts";

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
    { input: "5kg to g", expected: "5,000 g" },
    { input: "$1234567/hour", expected: "$1,234,567 / hour" },
    { input: "$45/hour * 37.5 hours", expected: "$1,687.5" },
  ])("$input", ({ input, expected }) => {
    const parser = math.parser();
    const result = evaluateLine(parser, input);
    expect(formatOutput(math, result)).toBe(expected);
  });
});

describe("formatOutput with configurable settings", () => {
  test.each([
    {
      name: "lower displayPrecision rounds bare numbers",
      input: "123456789",
      settings: { ...DEFAULT_OUTPUT_SETTINGS, displayPrecision: 5 },
      expected: "123,460,000",
    },
    {
      name: "lower displayPrecision rounds currency",
      input: "$123456789",
      settings: { ...DEFAULT_OUTPUT_SETTINGS, displayPrecision: 5 },
      expected: "$123,460,000",
    },
    {
      name: "lower exponentThreshold switches to exponential earlier",
      input: "123456",
      settings: { ...DEFAULT_OUTPUT_SETTINGS, exponentThreshold: 5 },
      expected: "1.234e+5",
    },
    {
      name: "higher exponentThreshold delays exponential notation",
      input: "1234567890",
      settings: { ...DEFAULT_OUTPUT_SETTINGS, exponentThreshold: 10 },
      expected: "1,234,567,890",
    },
    {
      name: "higher exponentDecimals shows more mantissa digits",
      input: "1234567890",
      settings: { ...DEFAULT_OUTPUT_SETTINGS, exponentDecimals: 5 },
      expected: "1.23456e+9",
    },
    {
      name: "lower exponentDecimals shows fewer mantissa digits",
      input: "1234567890",
      settings: { ...DEFAULT_OUTPUT_SETTINGS, exponentDecimals: 1 },
      expected: "1.2e+9",
    },
  ])("$name", ({ input, settings, expected }) => {
    const parser = math.parser();
    const result = evaluateLine(parser, input);
    expect(formatOutput(math, result, settings)).toBe(expected);
  });

  test("omitting settings falls back to DEFAULT_OUTPUT_SETTINGS", () => {
    const parser = math.parser();
    const result = evaluateLine(parser, "1234567890");
    expect(formatOutput(math, result)).toBe(
      formatOutput(math, result, DEFAULT_OUTPUT_SETTINGS),
    );
  });
});
