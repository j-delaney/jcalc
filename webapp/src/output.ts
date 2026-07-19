import { MathJsInstance, Unit } from "mathjs";

export function formatOutput(math: MathJsInstance, result: unknown): string {
  if (result instanceof Unit) {
    return result.format({ fraction: "decimal" });
  }

  return math.format(result, { fraction: "decimal" });
}
