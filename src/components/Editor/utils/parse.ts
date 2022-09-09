import { get, isArray, isEmpty, isPlainObject, noop } from "lodash";
import { createElement } from "react";
import EditorIcon from "../Menu/components/EditorIcon";
import { doActions } from "./events";

type ParseFunction = (...args: any[]) => any;

const execParses = (parses: ParseFunction[], ...args) => {
  for (let i = 0; i < parses.length; i++) {
    const parse = parses[i];
    const parseRet = parse(...args);
    if (parseRet !== undefined) {
      return parseRet;
    }
  }
};

const _parseChildren = (parses: ParseFunction[]) => {
  return (children, options) => {
    if (isEmpty(children)) return null;
    const ret = children.map(
      (child, idx) => execParses(parses, child, options, idx) || child
    );
    if (ret.length === 1) {
      return ret[0];
    }
    return ret;
  };
};

const _parseProps = (parses: ParseFunction[]) => {
  return (props, options) => {
    if (!isPlainObject(props)) return props;
    const ret = {};
    Object.keys(props).forEach((k) => {
      const prop = props[k];
      ret[k] = prop;
      const parseRet = execParses(parses, prop, options);
      if (parseRet !== undefined) {
        ret[k] = parseRet;
      }
    });
    return ret;
  };
};

// 解析绑定变量
const parseBind = (prop, options) => {
  if (prop?.isBind) {
    return get(options.data, prop.path);
  }
};
// 解析图标
const parseIcon = (prop) => {
  if (prop?.isIcon) return createElement(EditorIcon, { name: prop.name });
};
// 解析事件
const parseEventForViewer = (prop, options) => {
  if (prop?.isEvent) {
    return (...args) => doActions(prop.actions, options, args);
  }
};
// editor不需要触发事件
const parseEventForEditor = (prop) => {
  if (prop?.isEvent) {
    return noop;
  }
};
// 解析正则
const parseRegexp = (prop) => {
  if (prop?.isRegExp) {
    return new RegExp(prop.source);
  }
};
// 解析对象
const parsePlainObject = (prop, options) => {
  if (isPlainObject(prop)) {
    return parsePropsForViewer(prop, options);
  }
};
// 解析数组
const parseArray = (prop, options) => {
  if (isArray(prop)) {
    return prop.map((i) => parsePropsForViewer(i, options));
  }
};
// 解析基础类型
const parsePrimitive = (child) => {
  const type = Object.prototype.toString.call(child);
  const isPrimitive = [
    "String",
    "Number",
    "Boolean",
    "BigInt",
    "Null",
    "Undefined",
    "Symbol",
  ]
    .map((i) => `[object ${i}]`)
    .includes(type);
  if (isPrimitive) {
    return String(child);
  }
};
// 解析自定义渲染
const parseRender = (child, options, idx) => {
  const { render } = options;
  if (render && child?.name) {
    return render(child, idx);
  }
};
export const parsePropsForEditor = _parseProps([
  parseBind,
  parseIcon,
  parseEventForEditor,
  parseRegexp,
  parsePlainObject,
  parseArray,
]);
export const parsePropsForViewer = _parseProps([
  parseBind,
  parseIcon,
  parseEventForViewer,
  parseRegexp,
  parsePlainObject,
  parseArray,
]);
export const parseChildren = _parseChildren([
  parsePrimitive,
  parseBind,
  parseIcon,
  parseRender,
]);
