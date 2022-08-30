import { FormInstance } from "@arco-design/web-react";
import { get, isArray, isEmpty, isPlainObject } from "lodash";
import { createElement } from "react";
import { NavigateFunction, Params } from "react-router-dom";
import EditorIcon from "../Menu/components/EditorIcon";
import { doActions } from "./events";

/**
 * 根据属性转换icon bind event等属性
 * @param props 属性
 * @param global 全局方法与变量
 * @returns 属性
 */
export const parsePropsForEditor = (
  props: Record<string, any>
): Record<string, any> => {
  if (!isPlainObject(props)) return {};
  const ret = {};
  Object.keys(props).forEach((k) => {
    const prop = props[k];
    if (prop?.isIcon) {
      ret[k] = createElement(EditorIcon, { name: (prop as IconType).name });
    } else if (prop?.isEvent) {
      ret[k] = undefined;
    } else if (prop?.isBind) {
      ret[k] = "${" + prop.path.join(".") + "}";
    } else if (prop?.isRegExp) {
      ret[k] = new RegExp(prop.source);
    } else if (isPlainObject(prop)) {
      ret[k] = parsePropsForEditor(prop);
    } else if (isArray(prop)) {
      ret[k] = prop.map((i) => parsePropsForEditor(i));
    } else ret[k] = prop;
  });
  return ret;
};

/**
 * 根据属性转换icon bind event等属性
 * @param props 属性
 * @param global 全局方法与变量
 * @returns 属性
 */
export const parsePropsForViewer = (
  props: Record<string, any>,
  options: {
    navigate: NavigateFunction;
    params: Params<string>;
    current: IComponent | null;
    schema: ISchema;
    forms: Record<string, FormInstance>;
    data: Record<string, any>;
    setData: SetDataFunction;
  }
): Record<string, any> => {
  if (!isPlainObject(props)) return {};
  const ret = {};
  Object.keys(props).forEach((k) => {
    const prop = props[k];
    if (prop?.isIcon) {
      ret[k] = createElement(EditorIcon, { name: (prop as IconType).name });
    } else if (prop?.isEvent) {
      ret[k] = (...args) => doActions(prop.actions, options, args);
    } else if (prop?.isBind) {
      ret[k] = get(options.data, prop.path);
    } else if (prop?.isRegExp) {
      ret[k] = new RegExp(prop.source);
      JSON.stringify;
    } else if (isPlainObject(prop)) {
      ret[k] = parsePropsForViewer(prop, options);
    } else if (isArray(prop)) {
      ret[k] = prop.map((i) => parsePropsForViewer(i, options));
    } else ret[k] = prop;
  });
  return ret;
};

export const parseChildrenForEditor = (
  children,
  options: {
    render?: (child: any, idx?: number) => void;
  } = {}
) => {
  const { render } = options;
  if (isEmpty(children)) return null;
  const ret = children.map((child, idx) => {
    if (typeof child === "string") {
      return child;
    }
    if (child?.isIcon) {
      return createElement(EditorIcon, { name: child.name });
    }
    if (child?.isBind) {
      return "${" + child.name + "}";
    }
    if (render) return render(child, idx);
  });
  if (ret.length === 1) {
    return ret[0];
  }
  return ret;
};

export const parseChildrenForViewer = (
  children,
  options: {
    render?: (child: any, idx?: number) => void;
    data: Record<string, any>;
  } = { data: {} }
) => {
  const { render } = options;
  if (isEmpty(children)) return null;
  const ret = children.map((child, idx) => {
    if (typeof child === "string") {
      return child;
    }
    if (child?.isIcon) {
      return createElement(EditorIcon, { name: child.name });
    }
    if (child?.isBind) {
      return options.data[child.name];
    }
    if (render) return render(child, idx);
  });
  if (ret.length === 1) {
    return ret[0];
  }
  return ret;
};
