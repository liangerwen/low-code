import { cloneDeep, cloneDeepWith, difference, pick } from "lodash";

export const produce = <T>(obj: T, update: (obj: T) => void) => {
  const _obj = cloneDeep(obj);
  update(_obj);
  return _obj;
};

export const deepProduce = <T>(
  obj: T,
  update: (
    value: any,
    key: number | string | undefined,
    object: T | undefined
  ) => void
) => {
  return cloneDeepWith(
    cloneDeep(obj),
    (value: any, key: number | string | undefined, object: T | undefined) => {
      update(value, key, object);
    }
  );
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

// 下载文件
export const download = (option: { fileName: string; content: string }) => {
  const { fileName, content } = option;
  const file = new Blob([content], { type: "application/json" });
  const fileUrl = URL.createObjectURL(file);
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", fileUrl);
  linkElement.setAttribute("download", fileName);
  linkElement.click();
};

// 复制文字
export const copy = (content: string) => {
  return navigator.clipboard
    .writeText(content)
    .then(() => {
      return;
    })
    .catch(() => {
      const container = document.createElement("textarea");
      container.innerHTML = JSON.stringify(content);
      document.body.appendChild(container);
      container.select();
      document.execCommand("copy");
      document.body.removeChild(container);
      return;
    });
};
