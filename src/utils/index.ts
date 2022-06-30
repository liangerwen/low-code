import { cloneDeep, difference, pick } from "lodash";

export const updateObject = <T>(obj: T, update: (obj: T) => void) => {
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

export const concatPath = (path: string, ...paths: string[]) => {
  let ret = paths.reduce((pre, cur) => {
    if (cur) {
      return (
        (pre ? (pre.endsWith("/") ? pre : pre + "/") : pre) +
        (cur.startsWith("/") ? cur.slice(1) : cur)
      );
    }
    return pre;
  }, path);
  return ret.startsWith("/") ? ret || "/" : "/" + ret;
};
