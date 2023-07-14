function getLines(str: string) {
  return str.trim().replaceAll("\r", "").split("\n");
}

function isString(str: any) {
  return typeof str === "string" || str instanceof String;
}

function concatArray(...values: any[]) {
  return values.reduce((acc, curr) => `${acc}${curr}`, "") as string;
}

export { concatArray, getLines, isString };
