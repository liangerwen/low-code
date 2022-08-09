import { isArray, isEmpty, isPlainObject } from "lodash";
import { createElement } from "react";
import EditorIcon from "../Menu/components/EditorIcon";
import { createAction } from "./events";
import { IGlobal } from "./useGlobal";

const parsePropsFromArray = (arr, global) => {
  return arr.map((i) =>
    isPlainObject(i)
      ? parseProps(i, global)
      : isArray(i)
      ? parsePropsFromArray(i, global)
      : i
  );
};
/**
 * 根据属性转换icon bind event等属性
 * @param props 属性
 * @param global 全局方法与变量
 * @returns 属性
 */
export const parseProps = (
  props: Record<string, any>,
  global: PowerPartial<IGlobal>
): Record<string, any> => {
  if (!isPlainObject(props)) return {};
  const ret = {};
  Object.keys(props).forEach((k) => {
    const prop = props[k];
    if (prop?.isIcon) {
      ret[k] = createElement(EditorIcon, { name: (prop as IconType).name });
    } else if (prop?.isEvent) {
      ret[k] = createAction(prop.actions, global);
    } else if (prop?.isBind) {
      ret[k] = global.data?.[prop.name];
    } else if (isPlainObject(prop)) {
      ret[k] = parseProps(prop, global);
    } else if (isArray(prop)) {
      ret[k] = parsePropsFromArray(prop, global);
    } else ret[k] = prop;
  });
  return ret;
};

export const parseChildren = (
  children,
  options: {
    render?: (child: any, idx?: number) => void;
  } = {}
) => {
  const { render } = options;
  if (isEmpty(children)) return null;
  return children.map((child, idx) => {
    if (typeof child === "string") {
      return child;
    }
    if (isArray(child)) {
      return parseChildren(child, options);
    }
    if (child?.isIcon) {
      return createElement(EditorIcon, { name: child.name });
    }
    if (child?.isBind) {
      return child.name;
    }
    if (render) return render(child, idx);
  });
};
