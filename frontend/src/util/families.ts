import type { Family, FormFamily } from "../modules";

const original = "'";
const valid = "$";

const prepareKey = (key: string) => key.replace(original, valid);
const reverseKeyPreparation = (key: string) => key.replace(valid, original);

const prepareFamily = (family: Family) =>
  Object.entries(family).reduce(
    (acc, [key, value]) => ({ ...acc, [prepareKey(key)]: value }),
    {} as FormFamily
  );

const reverseFamilyPreparation = (family: FormFamily) =>
  Object.entries(family).reduce(
    (acc, [key, value]) => ({ ...acc, [reverseKeyPreparation(key)]: value }),
    {} as Family
  );

export {
  prepareFamily,
  reverseFamilyPreparation,
  reverseKeyPreparation as formatFamilyKey,
};
