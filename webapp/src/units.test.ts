import { describe, expect, test } from "@jest/globals";
import { exportedForTesting } from "./units.ts";
import { all, create } from "mathjs";

const { setupCurrencies } = exportedForTesting;

describe("setupCurrencies", () => {
  const math = create(all);
  setupCurrencies(math);

  test("USD", () => {
    // Make sure nothing throws
    math.unit("5$");
    math.unit("5 USD");
    math.unit("5 usd");
    math.unit("5 dollar");
    math.unit("5 dollars");
  });

  test("add", () => {
    const result = math.evaluate("5$ + 6 USD");
    expect(result.toString()).toEqual("11 $");
  });
});
