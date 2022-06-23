export type IParams = Record<string, string | number | (string | number)[]>;

export function queryParse(params: IParams) {
  const retAry: string[] = [];
  Object.keys(params).forEach((k) => {
    if (Array.isArray(params[k])) {
      retAry.push(
        ...(params[k] as (string | number)[]).map((i) => `${k}[]=${i}`)
      );
    } else {
      retAry.push(`${k}=${params[k]}`);
    }
  });
  return retAry.join("&");
}

export function parseUrlParams(url: string, params: IParams | undefined) {
  if (!params) return url;
  const hasQuery = url.indexOf("?") >= 0;
  const endWithAND = url.endsWith("&");
  if (hasQuery) {
    if (endWithAND) {
      return url + queryParse(params);
    }
    return url + "&" + queryParse(params);
  }
  return url + "?" + queryParse(params);
}
