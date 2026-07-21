import { BigNumber, MathJsInstance } from "mathjs";

export interface OutputSettings {
  // Significant digits shown to the user. Well below BigNumber's internal
  // precision (64), so artifacts like 5.000...002 display as 5.
  displayPrecision: number;
  // Magnitude at which numbers switch from comma-separated to exponential.
  exponentThreshold: number;
  // Decimal places of the mantissa in exponential notation ("1.234e+9").
  exponentDecimals: number;
}

export const DEFAULT_OUTPUT_SETTINGS: OutputSettings = {
  displayPrecision: 14,
  exponentThreshold: 9,
  exponentDecimals: 3,
};

// math.js renders currency as a suffix unit ("5 $ / hour"); display it in the
// conventional prefix position ("$5 / hour"), keeping any sign in front.
const suffixCurrencyRegex = /^(-?)([\d.,]+(?:e[+-]?\d+)?) \$/;

function prefixCurrencySymbol(formatted: string): string {
  return formatted.replace(suffixCurrencyRegex, "$1$$$2");
}

// Decimal.ROUND_DOWN from decimal.js (mathjs's BigNumber backend): truncate
// rather than round, so 1.23456789e9 displays as 1.234e+9.
const ROUND_DOWN = 1;

function addThousandsSeparators(str: string): string {
  const [integer, fraction] = str.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

function formatBigNumber(value: BigNumber, settings: OutputSettings): string {
  if (value.e >= settings.exponentThreshold) {
    return value.toExponential(settings.exponentDecimals, ROUND_DOWN);
  }

  return addThousandsSeparators(
    value.toSignificantDigits(settings.displayPrecision).toString(),
  );
}

export function formatOutput(
  math: MathJsInstance,
  result: unknown,
  settings: OutputSettings = DEFAULT_OUTPUT_SETTINGS,
): string {
  // instanceof Unit fails here: `math` is its own instance from create(), so
  // its Unit class differs from the one exported by the mathjs module.
  if (math.isUnit(result)) {
    // Simplify first: formatUnits() renders the unit list as-is (e.g. a
    // result of "$/hour * hours" keeps separate "hour"/"hours" entries
    // instead of cancelling them), unlike Unit.format() which simplifies
    // internally.
    const simplified = result.simplify();
    // Format the numeric part with the same rules as bare numbers.
    // toNumeric() is null for valueless units (e.g. a bare "hour").
    const value = simplified.toNumeric();
    if (math.isBigNumber(value)) {
      return prefixCurrencySymbol(
        `${formatBigNumber(value, settings)} ${simplified.formatUnits()}`,
      );
    }
    return prefixCurrencySymbol(
      simplified.format({
        fraction: "decimal",
        precision: settings.displayPrecision,
      }),
    );
  }

  if (math.isBigNumber(result)) {
    return formatBigNumber(result, settings);
  }

  return math.format(result, {
    fraction: "decimal",
    precision: settings.displayPrecision,
  });
}
