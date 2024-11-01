import { MathJsInstance } from "mathjs";

function setupCurrencies(math: MathJsInstance): void {
  // Allow for currency symbols to be used
  const isAlphaOriginal = math.Unit.isValidAlpha;
  math.Unit.isValidAlpha = function (c) {
    return isAlphaOriginal(c) || ["$"].includes(c);
  };

  // Create the units
  math.createUnit({
    USD: {
      prefixes: "none",
      aliases: ["usd", "dollar", "dollars", "$"],
    },
  });
}

export function setupUnits(math: MathJsInstance): void {
  setupCurrencies(math);
}

export const exportedForTesting = {
  setupCurrencies,
};
