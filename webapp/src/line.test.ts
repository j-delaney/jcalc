import { describe, expect, test } from "@jest/globals";
import { exportedForTesting } from "./line.ts";

const { multiWordVariables } = exportedForTesting;

describe("multiWordVariables", () => {
  test.each([
    { line: "hello", expected: "hello" },
    { line: "", expected: "" },
    { line: "x = y", expected: "x = y" },
    { line: "foo bar = baz", expected: "foo_bar = baz" },
    { line: "foo bar = baz bin", expected: "foo_bar = baz_bin" },
    { line: "foo bar = baz bin bin", expected: "foo_bar = baz_bin_bin" },
    {
      line: "foo bar = alpha beta + gamma delta",
      expected: "foo_bar = alpha_beta + gamma_delta",
    },
    { line: "a b", expected: "a_b" },
    { line: "a b + c d + e f g", expected: "a_b + c_d + e_f_g" },
    { line: "a1b c2d", expected: "a1b_c2d" },
    { line: "x to y", expected: "x to y" },
    { line: "x to 1", expected: "x to 1" },
    {
      line: "first second to third fourth",
      expected: "first_second to third_fourth",
    },
    { line: "x to first second", expected: "x to first_second" },
    { line: "x=one two", expected: "x=one_two" },
    { line: "total cost to $/year", expected: "total_cost to $/year" },
    {
      line: "total cost to dollar/year",
      expected: "total_cost to dollar/year",
    },
    { line: "(data rate * 3) to MB/s", expected: "(data_rate * 3) to MB/s" },
    {
      line: "subset str = substr str rate",
      expected: "subset_str = substr_str_rate",
    },
  ])("multiWordVariables($line)", ({ line, expected }) => {
    expect(multiWordVariables(line)).toBe(expected);
  });
});
