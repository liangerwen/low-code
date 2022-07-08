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

export function parseSearch<T extends Partial<Record<string, any>>>(
  search: string
): T {
  const ret = {};
  const searchParams = new URLSearchParams(search);
  for (const key of searchParams.keys()) {
    const val = searchParams.getAll(key).map((i) => {
      if (i === "undefined") {
        return undefined;
      }
      try {
        return JSON.parse(i);
      } catch {
        return i;
      }
    });
    const k = key.replace(/^(\w+)\[\]$/, "$1");
    if (val.length > 0) {
      ret[k] = val.length === 1 ? val[0] : val;
    }
  }
  return ret as T;
}
