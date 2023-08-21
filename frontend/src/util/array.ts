/** Given an object with this structure as a value: { [property: string]: value (string) },
 * this function iterates over each value, and checks the property value.
 *
 * If duplicated property value found, returns it, otherwise returns null.
 */
function findDuplicatedProperty(obj: object, property: string) {
  const propertyCounts: Record<string, boolean> = {};

  for (const item of Object.values(obj)) {
    const propValue = item?.[property] || undefined;
    if (typeof propValue !== "string") continue;

    if (propertyCounts[propValue]) return propValue;
    propertyCounts[propValue] = true;
  }
  return null;
}

function getUnique<T>(array: T[]) {
  return [...new Set(array)];
}

function partition<T>(array: T[], isValid: (item: T) => boolean) {
  return array.reduce(
    ([pass, fail], item) => {
      if (isValid(item)) pass.push(item);
      else fail.push(item);
      return [pass, fail];
    },
    [Array<T>(), Array<T>()]
  );
}

export { findDuplicatedProperty, getUnique, partition };
