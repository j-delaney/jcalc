import { create, all } from "mathjs";
import CodeFlask from "codeflask";

const config = {
  number: "BigNumber",
  // Number of significant digits for BigNumbers
  // precision: 20
};
const math = create(all, config);
const flask = new CodeFlask(".code-editor", {
  language: "js",
  lineNumbers: true,
  rightSidebar: true,
});
console.log(flask.getCode());

console.log(math.evaluate("1+1"));
