import { isArray, isObject } from "lodash";
import EditorIcon from "../Menu/components/EditorIcon";
import { createAction, IGlobal } from "./events";

export const parseProps = (
  props: Record<string, any>,
  global: Partial<IGlobal>
): Record<string, any> => {
  const ret = {};
  Object.keys(props).forEach((k) => {
    const prop = props[k];
    if (prop?.isIcon) {
      ret[k] = <EditorIcon name={(prop as IconType).name} />;
    } else if (prop.isEvent) {
      ret[k] = createAction(prop.actions, global);
    } else if (prop?.isBind) {
      ret[k] = global.data?.[prop.name];
    } else if (isObject(prop)) {
      ret[k] = parseProps(prop, global);
    } else {
      ret[k] = prop;
    }
  });
  return ret;
};

export const parseChildren = (children) => {
  if (!children) return null;
  if (!isArray(children)) return children;
  return children.map((child) => {
    if (child?.isIcon) {
      return <EditorIcon name={child.name} />;
    }
    if (child?.isBind) {
      return child.name;
    }
    return child;
  });
};
