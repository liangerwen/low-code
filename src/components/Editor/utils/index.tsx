import { updateObject } from "@/utils";
import EditorIcon from "../EditorMenu/data/icons";

type ICondition = (component: IComponent) => boolean;
type ICallback = (component: IComponent) => void;

export const findComponents = (schema: ISchema, condition: ICondition) => {
  const ret: IComponent[] = [];
  schema.forEach((component) => {
    if (condition(component)) {
      ret.push(component);
    }
    if (component.container && component.children) {
      ret.push(...findComponents(component.children as ISchema, condition));
    }
  });
  return ret;
};

export const findComponent = (
  schema: ISchema,
  condition: ICondition
): IComponent | null => {
  for (const component of schema) {
    if (condition(component)) {
      return component;
    }
    if (component.container && component.children) {
      const ret = findComponent(component.children as ISchema, condition);
      if (ret) return ret;
    }
  }
  return null;
};

export const diffSchema = (schema: ISchema, callback: ICallback) => {
  for (const component of schema) {
    callback(component);
    if (component.container && component.children) {
      diffSchema(component.children as ISchema, callback);
    }
  }
};

export const filterComponent = (
  schema: ISchema,
  condition: ICondition
): ISchema =>
  (schema || []).filter(condition).map((s) => {
    if (s.container) {
      return {
        ...s,
        children: filterComponent(s.children as ISchema, condition),
      };
    }
    return s;
  });

export const findWarpper = (schema: ISchema, id: string | number) => {
  const rootIdx = schema.findIndex((component) => component.id === id);
  if (rootIdx >= 0) {
    return { warpper: schema, index: rootIdx };
  }
  const warpperComponent = findComponent(
    schema,
    (c) =>
      !!c.container &&
      !!c.children &&
      (c.children as IComponent[]).find((child) => child.id === id) !==
        undefined
  );
  if (!warpperComponent) return null;
  const warpperIdx = (warpperComponent.children as IComponent[])!.findIndex(
    (component) => component.id === id
  );
  return { warpper: warpperComponent.children as ISchema, index: warpperIdx };
};

export const formatSchemaIcon = (
  schema: IComponent | IComponent[],
  type: "from" | "to" = "from"
) => {
  if (Array.isArray(schema)) {
    return schema.map((s) => formatSchemaIcon(s, type));
  }
  const iconKeyReg = /^\$\$(\w+)$/;
  return updateObject(schema as IComponent, (ic) => {
    const props = ic.props || {};
    Object.keys(props).forEach((k) => {
      if (type === "from") {
        const isIconProp = props[k]?.isIcon;
        if (isIconProp && !iconKeyReg.test(k)) {
          props[`$$${k}`] = props[k];
          props[k] = <EditorIcon name={props[k].name} />;
        }
      } else if (iconKeyReg.test(k) && type === "to") {
        const realKey = k.replace(iconKeyReg, "$1");
        props[realKey] = props[k];
        delete props[k];
      }
    });
    if (type === "from") {
      const $$children = [];
      schema.children?.forEach((c, i) => {
        // @ts-ignore
        if (c.isIcon) {
          $$children.push({ idx: i, value: c });
        }
      });
      if ($$children.length > 0) {
        schema.$$children = $$children;
        $$children.forEach(($c) => {
          // @ts-ignore
          schema.children[$c.idx] = <EditorIcon name={$c.value.name} />;
        });
      }
    } else {
      if (schema.$$children) {
        schema.$$children.forEach(($c) => {
          // @ts-ignore
          schema.children[$c.idx] = <EditorIcon name={$c.value.name} />;
        });
        delete schema.$$children;
      }
    }
  });
};
