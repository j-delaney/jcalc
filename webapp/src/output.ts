import { BigNumber, MathJsInstance } from "mathjs";

// Significant digits shown to the user. Well below BigNumber's internal
// precision (64), so artifacts like 5.000...002 display as 5.
const DISPLAY_PRECISION = 14;

// math.js renders currency as a suffix unit ("5 $ / hour"); display it in the
// conventional prefix position ("$5 / hour"), keeping any sign in front.
const suffixCurrencyRegex = /^(-?)([\d.,]+(?:e[+-]?\d+)?) \$/;

function prefixCurrencySymbol(formatted: string): string {
  return formatted.replace(suffixCurrencyRegex, "$1$$$2");
}

// Magnitude at which numbers switch from comma-separated to exponential.
const EXPONENT_THRESHOLD = 9;
// Decimal places of the mantissa in exponential notation ("1.234e+9").
const EXPONENT_DECIMALS = 3;
// Decimal.ROUND_DOWN from decimal.js (mathjs's BigNumber backend): truncate
// rather than round, so 1.23456789e9 displays as 1.234e+9.
const ROUND_DOWN = 1;

function addThousandsSeparators(str: string): string {
  const [integer, fraction] = str.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

function formatBigNumber(value: BigNumber): string {
  if (value.e >= EXPONENT_THRESHOLD) {
    return value.toExponential(EXPONENT_DECIMALS, ROUND_DOWN);
  }

  return addThousandsSeparators(
    value.toSignificantDigits(DISPLAY_PRECISION).toString(),
  );
}

export function formatOutput(math: MathJsInstance, result: unknown): string {
  // instanceof Unit fails here: `math` is its own instance from create(), so
  // its Unit class differs from the one exported by the mathjs module.
  if (math.isUnit(result)) {
    // Format the numeric part with the same rules as bare numbers.
    // toNumeric() is null for valueless units (e.g. a bare "hour").
    const value = result.toNumeric();
    if (math.isBigNumber(value)) {
      return prefixCurrencySymbol(
        `${formatBigNumber(value)} ${result.formatUnits()}`,
      );
    }
    return prefixCurrencySymbol(
      result.format({ fraction: "decimal", precision: DISPLAY_PRECISION }),
    );
  }

  if (math.isBigNumber(result)) {
    return formatBigNumber(result);
  }

  return math.format(result, {
    fraction: "decimal",
    precision: DISPLAY_PRECISION,
  });
}
