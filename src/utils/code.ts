import { Message } from "@arco-design/web-react";
import { transform } from "@babel/standalone";

// 运行js函数字符串
export const execFnStrByBabel = (code: string) => {
  try {
    const fnBody = transform(code, {
      presets: ["env"],
    }).code;
    const fn = new Function("exports", fnBody);
    const ret: { default?: Function } = {};
    fn(ret);
    ret?.default();
  } catch (e) {
    if (e?.code === "BABEL_PARSE_ERROR") {
      Message.error(`解析错误：${e.reasonCode}`);
    } else {
      Message.error(`运行错误：${e.message}`);
    }
  }
};

// 运行js函数字符串
export const execFnStrByImport = (code: string) => {
  const file = new Blob([code], {
    type: "text/javascript",
  });
  const fileUrl = URL.createObjectURL(file);
  import(fileUrl)
    .then((module: Module<Function>) => {
      try {
        module?.default?.();
      } catch (e) {
        Message.error(`运行错误：${e.message}`);
      }
    })
    .catch((e) => {
      Message.error(`解析错误：${e.message}`);
    });
  URL.revokeObjectURL(fileUrl);
};

// js字符串转EsModule
export const fnStr2JsModuleByBabel = (
  code: string,
  params?: Record<string, any>
) => {
  try {
    const fnBody = transform(code, {
      presets: ["env"],
    }).code;
    const paramsKey = Object.keys(params);
    const paramsValue = Object.values(params);
    const fn = new Function("exports", ...paramsKey, fnBody);
    const ret: { default?: Function } = {};
    fn(ret, ...paramsValue);
    return Promise.resolve(ret);
  } catch (e) {
    return Promise.reject(e);
  }
};

// js字符串转EsModule
export const fnStr2JsModuleByImport = (
  code: string
): Promise<{
  default?: Function;
}> => {
  const file = new Blob([code], {
    type: "text/javascript",
  });
  const fileUrl = URL.createObjectURL(file);
  return import(fileUrl).then((res) => {
    URL.revokeObjectURL(fileUrl);
    return res;
  });
};
