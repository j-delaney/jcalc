const variableRegex = /[a-zA-Z][\w ]* [\w ]*\w/g;

// (data rate * 3) to MB/s

export function transformLine(line: string): string {
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
