import { cloneDeep } from "lodash";

export const updateObject = <T>(obj: T, update: (obj: T) => void) => {
  const _obj = cloneDeep(obj);
  update(_obj);
  return _obj;
};
