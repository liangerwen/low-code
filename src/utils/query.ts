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
