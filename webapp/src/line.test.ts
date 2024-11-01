import { describe, expect, test } from "@jest/globals";
import { exportedForTesting } from "./line.ts";

const { multiWordVariables, numberWithCommas, prefixCurrency } =
  exportedForTesting;

describe("multiWordVariables", () => {
  test.each([
    { line: "hello", expected: "hello" },
    { line: "", expected: "" },
    // Not sure yet what we want to do about this
    // { line: "x 1 2 e", expected: "x 1 2 e" },
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

describe("numberWithCommas", () => {
  test.each([
    { line: "", expected: "" },
    { line: "1", expected: "1" },
    { line: "1,234", expected: "1234" },
    { line: "1,2", expected: "12" },
    { line: "x = 413,300", expected: "x = 413300" },
    { line: "x =1,2", expected: "x =12" },
    { line: "x = 413,300.00", expected: "x = 413300.00" },
    { line: "12,", expected: "12" },
    { line: "1234523", expected: "1234523" },
    { line: "1 + 12", expected: "1 + 12" },
    { line: "1,234+4,321", expected: "1234+4321" },
    { line: "1 + 12,", expected: "1 + 12" },
    { line: "1st", expected: "1st" },
    { line: "a12b", expected: "a12b" },
    { line: "a12", expected: "a12" },
    { line: "a12,34,45", expected: "a12,3445" }, // Not great but at least is an error
    { line: "3.0", expected: "3.0" },
    { line: "3.00949,4", expected: "3.009494" },
    { line: "43.123,434", expected: "43.123434" },
    { line: "12,345-1,2,3,4", expected: "12345-1234" },
    { line: "1,234e27", expected: "1234e27" },
    { line: "1,234.567", expected: "1234.567" },
  ])("multiWordVariables($line)", ({ line, expected }) => {
    expect(numberWithCommas(line)).toBe(expected);
  });
});

describe("prefixCurrency", () => {
  test.each([
    { line: "$foo", expected: "$foo" },
    { line: "$12a", expected: "$12a" },
    { line: "$1234", expected: "1234$" },
    { line: "$1.23", expected: "1.23$" },
    { line: "$12", expected: "12$" },
    { line: "$", expected: "$" },
    { line: "$.12", expected: ".12$" },
    { line: "$0.12", expected: "0.12$" },
    { line: "$12.34", expected: "12.34$" },
    { line: "a$23", expected: "a$23" },
    { line: "($12)", expected: "(12$)" },
    { line: "-$12+$14-4", expected: "-12$+14$-4" },
    { line: "$12+$2", expected: "12$+2$" },
    { line: "$ 5", expected: "$ 5" },
    { line: "12.3$", expected: "12.3$" },
    // TODO: Doesn't work but maybe it should?
    // { line: "$(12)", expected: "(12)$" },
  ])("multiWordVariables($line)", ({ line, expected }) => {
    expect(prefixCurrency(line)).toBe(expected);
  });
});
