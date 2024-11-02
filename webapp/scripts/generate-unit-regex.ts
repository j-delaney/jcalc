import * as math from "mathjs";
import Benny from "benny";

const prefixesToUnits: Record<string, string[]> = {};
for (const unitName in math.Unit.UNITS) {
  const unit = math.Unit.UNITS[unitName];
  // @ts-expect-error unit.prefixes is definitely real and works
  const key = Object.keys(unit.prefixes).sort().toString();
  prefixesToUnits[key] = prefixesToUnits[key] || [];
  prefixesToUnits[key].push(unitName);
}

const trailingLeadingCommaRegex = /(^,)|(,$)/g;

/*
We iterate through each of the (prefixes, units) tuples and assemble a regex to match them. For each tuple we'll
assemble three different styles of regexes. Each of these starts with the same (prefixA|prefixB|...)? and the various
optimizations they take are around how they match units.   
1. Simple: Just listing out the possible units
   `(unitA|unitB|unitC)`
2. CombinedS: Groups units by whether they can end in "s"
   `(singularUnitA|singularUnitB|...)|(pluralUnitA|pluralUnitB|...)s?`
3. IndividualS: Adds an optional "s" to plural units
   `(singularUnitA|singularUnitB|...|pluralUnitAs?|pluralUnitBs?|...)`
 */

function simpleUnitRegex(units: string[]): string {
  return units.join("|");
}

type classifiedUnits = {
  plural: string[];
  singular: string[];
};

function classifyUnits(sortedUnits: string[]): classifiedUnits {
  const singular: string[] = [];
  const plural: string[] = [];
  for (let i = 0; i < sortedUnits.length; i++) {
    const unit = sortedUnits[i];
    if (i + 1 < sortedUnits.length) {
      const nextUnit = sortedUnits[i + 1];
      if (unit + "s" === nextUnit) {
        plural.push(unit);
        i++;
        continue;
      }
    }
    singular.push(unit);
  }
  return {
    plural,
    singular,
  };
}

function combinedSUnitRegex(units: classifiedUnits): string {
  // Both plural and singular units are empty
  if (units.plural.length === 0 && units.singular.length === 0) {
    return "";
  }

  // There are plural units but no singular
  if (units.plural.length > 0 && units.singular.length === 0) {
    return `(?:${units.plural.join("|")})s?`;
  }

  // There are singular units but not plural
  if (units.plural.length === 0 && units.singular.length > 0) {
    return simpleUnitRegex(units.singular);
  }

  // There are both singular and plural units
  return `${simpleUnitRegex(units.singular)}|(?:${units.plural.join("|")})s?`;
}

function individualSUnitRegex(units: classifiedUnits): string {
  const singularRegex = simpleUnitRegex(units.singular);
  const pluralRegex = units.plural.map((unit) => `${unit}s?`).join("|");

  // Both plural and singular units are empty
  if (pluralRegex.length === 0 && singularRegex.length === 0) {
    return "";
  }

  // There are plural units but no singular
  if (pluralRegex.length > 0 && singularRegex.length === 0) {
    return pluralRegex;
  }

  // There are singular units but not plural
  if (pluralRegex.length === 0 && singularRegex.length > 0) {
    return singularRegex;
  }

  // There are both singular and plural units
  return `${singularRegex}|${pluralRegex}`;
}

const simpleRegexes: string[] = [];
const combinedSRegexes: string[] = [];
const individualSRegexes: string[] = [];
const possibleUnits: string[] = [];
for (let prefixList in prefixesToUnits) {
  const units = prefixesToUnits[prefixList].sort();
  const classified = classifyUnits(units);

  const simple = simpleUnitRegex(units);
  const combinedS = combinedSUnitRegex(classified);
  const individualS = individualSUnitRegex(classified);

  if (prefixList === "") {
    simpleRegexes.push(`(?:${simple})`);
    combinedSRegexes.push(`(?:${combinedS})`);
    individualSRegexes.push(`(?:${individualS})`);
    for (const unit of units) {
      possibleUnits.push(unit);
    }
    continue;
  }

  prefixList = prefixList.replace(trailingLeadingCommaRegex, "");
  const prefixRegexOr = prefixList.replaceAll(",", "|"); // e.g. "giga|kibi|kilo"

  for (const prefix of prefixList.split(",")) {
    for (const unit of units) {
      possibleUnits.push(prefix + unit);
    }
  }

  simpleRegexes.push(`(?:(?:${prefixRegexOr})?(?:${simple}))`);
  combinedSRegexes.push(`(?:(?:${prefixRegexOr})?(?:${combinedS}))`);
  individualSRegexes.push(`(?:(?:${prefixRegexOr})?(?:${individualS}))`);
}

// console.log(regexGroupsSimple[0]);

const simpleRegex = new RegExp(simpleRegexes.join("|"));
const combinedSRegex = new RegExp(combinedSRegexes.join("|"));
const individualSRegex = new RegExp(individualSRegexes.join("|"));

// Validate them
function validateRegex(name: string, regex: RegExp): boolean {
  const failures: string[] = [];
  for (const possibleUnit of possibleUnits) {
    if (!regex.test(possibleUnit)) {
      failures.push(possibleUnit);
    }
  }

  if (failures.length > 0) {
    console.error(
      `${name}: failed ${failures.length} validations: ${failures.slice(0, 10).join(", ")}`,
    );
    return false;
  }

  return true;
}

console.log("Running validations...");
if (
  !validateRegex("Simple", simpleRegex) ||
  !validateRegex("CombinedS", combinedSRegex) ||
  !validateRegex("IndividualS", individualSRegex)
) {
  process.exit(1);
}
console.log("All validations passed!");

const testStrs = [
  "5 kB/hour * 4centibytes",
  "24 meters per decayears per milliseconds",
  "data size = 5 feet per chain",
  "cool cat * five dogs * gigachad",
];

console.log("Simple", simpleRegex.toString());

Benny.suite(
  "regexes",
  Benny.configure({}),
  Benny.add("Simple", () => {
    for (const s of testStrs) {
      s.match(simpleRegex);
    }
  }),
  Benny.add("CombinedS", () => {
    for (const s of testStrs) {
      s.match(combinedSRegex);
    }
  }),
  Benny.add("IndividualS", () => {
    for (const s of testStrs) {
      s.match(individualSRegex);
    }
  }),
  Benny.cycle(),
  Benny.complete(),
);
