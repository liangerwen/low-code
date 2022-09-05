import axios from "axios";
import { cloneDeep, cloneDeepWith, difference, pick } from "lodash";

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

// 根据内容下载文件
export const downloadByContent = (option: {
  fileName: string;
  content: string;
}) => {
  const { fileName, content } = option;
  const file = new Blob([content], { type: "application/json" });
  const fileUrl = URL.createObjectURL(file);
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", fileUrl);
  linkElement.setAttribute("download", fileName);
  linkElement.click();
  URL.revokeObjectURL(fileUrl);
};

// 根据链接下载文件
export const downloadByUrl = (fileName: string, url: string) => {
  axios
    .get(url, {
      responseType: "blob",
    })
    .then(({ data, headers }) => {
      const file = new Blob([data], {
        type: headers["content-type"] || "text/plain",
      });
      const href = URL.createObjectURL(file);
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", href);
      linkElement.setAttribute("download", fileName);
      linkElement.click();
      URL.revokeObjectURL(href);
    });
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

export const isColor = (val: string) => {
  if (!val) return false;
  let type = "";
  if (/^rgb\(/.test(val)) {
    //如果是rgb开头，200-249，250-255，0-199
    type =
      "^[rR][gG][Bb][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[)]{1}$";
  } else if (/^rgba\(/.test(val)) {
    //如果是rgba开头，判断0-255:200-249，250-255，0-199 判断0-1：0 1 1.0 0.0-0.9
    type =
      "^[rR][gG][Bb][Aa][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0.[0-9])[\\s]*[)]{1}$";
  } else if (/^#/.test(val)) {
    //六位或者三位
    type = "^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$";
  } else if (/^hsl\(/.test(val)) {
    //判断0-360 判断0-100%(0可以没有百分号)
    type =
      "^[hH][Ss][Ll][(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[)]$";
  } else if (/^hsla\(/.test(val)) {
    type =
      "^[hH][Ss][Ll][Aa][(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0.[0-9])[\\s]*)[)]$";
  }
  if (!type) return false;
  const re = new RegExp(type);
  return !!val.match(re);
};
