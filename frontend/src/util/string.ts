function getLines(str: string) {
  return str.trim().replaceAll("\r", "").split("\n");
}

function isString(str: any) {
  return typeof str === "string" || str instanceof String;
}

export { getLines, isString };
