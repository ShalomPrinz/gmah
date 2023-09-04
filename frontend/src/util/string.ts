function getLines(str: string) {
  return str.trim().replaceAll("\r", "").split("\n");
}

function isString(str: any) {
  return typeof str === "string" || str instanceof String;
}

function concatArray(...values: any[]) {
  return values.reduce((acc, curr) => `${acc}${curr}`, "") as string;
}

function trimObject(obj: any) {
  if (!obj || typeof obj !== "object") return obj;

  let trimmedObj: any = {};

  for (const key in obj) {
    if (typeof obj[key] === "number") obj[key] = obj[key].toString();
    if (typeof obj[key] !== "string") continue;

    trimmedObj[key] = obj[key].trim();
  }

  return trimmedObj;
}

export { concatArray, getLines, isString, trimObject };
