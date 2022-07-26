import { cloneDeep, difference, pick } from "lodash";

export const produce = <T>(obj: T, update: (obj: T) => void) => {
  const _obj = cloneDeep(obj);
  update(_obj);
  return _obj;
};

export const filterDeep = <T extends Record<string, any>, U extends keyof T>(
  ary: T[],
  key: U,
  collection: (item: T) => boolean
): T[] => {
  return ary.filter(collection).map((item) => ({
    ...item,
    [key]: filterDeep(item[key], key, collection),
  }));
};

export const deepArrayPick = (arr, deepKeys, pickKeys) => {
  if (difference(deepKeys, pickKeys).length > 0) {
    console.error("Error: pickKeys must contain all of deepKeys");
    return arr;
  }
  return arr.map((a) => {
    const ret = pick(a, pickKeys);
    deepKeys.forEach((k) => {
      if (ret[k]) {
        ret[k] = deepArrayPick(ret[k], deepKeys, pickKeys);
      }
    });
    return ret;
  });
};
