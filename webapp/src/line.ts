import { all, ConfigOptions, create, Parser } from "mathjs";
import { setupUnits } from "./units.ts";
import {
  DEFAULT_OUTPUT_SETTINGS,
  formatOutput,
  OutputSettings,
} from "./output.ts";

const config: ConfigOptions = {
  number: "BigNumber",
  // Number of significant digits for BigNumbers
  // precision: 20
};
export const math = create(all, config);
setupUnits(math);

export function evaluateLine(parser: Parser, line: string): unknown {
  const transformed = transformLine(line);
  return parser.evaluate(transformed);
}

export function evaluateLines(
  lines: string[],
  settings: OutputSettings = DEFAULT_OUTPUT_SETTINGS,
): string[] {
  const parser = math.parser();
  const results: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      results.push("");
      continue;
    }

    try {
      const r = evaluateLine(parser, lines[i]);
      console.log(i, lines[i], r);
      if (r) {
        results.push(formatOutput(math, r, settings));
      } else {
        results.push("");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(i, lines[i], e);
        results.push(e.message);
      } else {
        results.push("<unknown error>");
      }
    }
  }

  return results;
}

const variableRegex = /[a-zA-Z][\w ]* [\w ]*\w/g;
function multiWordVariables(line: string): string {
  const reResults = line.match(variableRegex);
  if (!reResults) {
    return line;
  }

  reResults.forEach((result) => {
    const parts = result.split(" to ", 2);
    if (parts.length === 2) {
      const replacement =
        transformLine(parts[0]) + " to " + transformLine(parts[1]);
      line = line.replace(result, replacement);
    } else {
      if (result.startsWith("to ")) {
        return;
      }
      if (result.endsWith(" to")) {
        // "total cost to $/year"
        line = line.replace(
          result,
          transformLine(result.split(" to", 1)[0]) + " to",
        );
        return;
      }
      const replacement = result.replaceAll(" ", "_");
      line = line.replace(result, replacement);
    }
  });
  return line;
}

const commaNumberRegex = /\b\d[\d,]+/g;

function numberWithCommas(line: string): string {
  return line.replaceAll(commaNumberRegex, (match) => {
    return match.replaceAll(",", "");
  });
}

const prefixCurrencyRegex = /\B(\$)(\d+\.\d+|\.\d+|\d+)\b/g;
// Transform cases where the currency symbol is used as a prefix to it being used as a suffix. e.g. "$5" -> "5$".
// Assumes that commas have already been removed from numbers.
function prefixCurrency(line: string): string {
  return line.replaceAll(
    prefixCurrencyRegex,
    (match, currencySymbol: string, num: string) => {
      return num + currencySymbol;
    },
  );
}

const commentRegex = /\/\/.*$/;
function stripCommentsAndHeaders(line: string): string {
  // Completely clear lines that are headers or comments
  if (line.startsWith("//") || line.startsWith("#")) {
    return "";
  }

  return line.replace(commentRegex, "");
}

export function transformLine(line: string): string {
  line = stripCommentsAndHeaders(line);
  line = numberWithCommas(line);
  line = prefixCurrency(line);
  return multiWordVariables(line);
}

export const exportedForTesting = {
  multiWordVariables,
  numberWithCommas,
  prefixCurrency,
  stripCommentsAndHeaders,
};
