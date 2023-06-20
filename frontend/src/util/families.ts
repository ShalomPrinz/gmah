const original = "'";
const valid = "$";

const prepareKey = (key: string) => key.replace(original, valid);
const reverseKeyPreparation = (key: string) => key.replace(valid, original);

const transform = (family: any, func: (key: string) => string) =>
  Object.entries(family).reduce(
    (acc, [key, value]) => ({ ...acc, [func(key)]: value }),
    {}
  );

const prepareFamily = (family: any) => transform(family, prepareKey);
const reverseFamilyPreparation = (family: any) =>
  transform(family, reverseKeyPreparation);

export {
  prepareFamily,
  reverseFamilyPreparation,
  reverseKeyPreparation as formatFamilyKey,
};
