import { cloneDeep } from "lodash";

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

export const filterFlatDeep = <
  T extends Record<string, any>,
  U extends keyof T
>(
  ary: T[],
  key: U,
  collection: (item: T) => boolean
): T[] => {
  return ary.reduce<T[]>((pre, cur) => {
    if (collection(cur)) {
      const deep = cur[key]
        ? { [key]: filterFlatDeep(cur[key], key, collection) }
        : {};
      pre.push({ ...cur, ...deep });
    } else {
      cur[key] && pre.push(...filterFlatDeep(cur[key], key, collection));
    }
    return pre;
  }, []);
};

export const concatPath = (path: string, ...paths: string[]) => {
  return paths.reduce((pre, cur) => {
    if (cur) {
      return (
        (pre ? pre + "/" : pre) + (cur.startsWith("/") ? cur.slice(1) : cur)
      );
    }
    return pre;
  }, path);
};
