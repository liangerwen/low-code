import { transform } from "@babel/standalone";

type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

/**
 * 循环调用hook
 * @param count 调用的次数
 * @param hook 调用的hook
 * @param args hook的参数
 * @returns hook返回值数组
 */
export default function useForHooks<T extends (...args: any) => any>(
  count: number,
  hook: T,
  ...args: any[]
): ReturnType<T>[] | null {
  let code = "";
  const argStr = args.map((_, idx) => `arg${idx}`);
  for (let i = 0; i < count; i++) {
    code += `const hook${i} = useHook(${argStr});\n`;
  }
  code += `export default [${Array.from({ length: count })
    .map((_, idx) => `hook${idx}`)
    .join(",")}]`;
  try {
    const fnBody = transform(code, {
      presets: ["env"],
    }).code;
    const fn = new Function("exports", "useHook", ...argStr, fnBody);
    const ret: { default?: ReturnType<T>[] } = {};
    fn(ret, hook, ...args);
    return ret?.default;
  } catch (e) {
    console.error("useForHooks:" + e);
    return null;
  }
}
