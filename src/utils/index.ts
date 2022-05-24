import cloneDeep from "lodash/cloneDeep";

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

export const findComponent = (schema: ISchema, condition: ICondition): IComponent | null => {
  let ret: IComponent | null = null;
  for (const component of schema) {
    if (condition(component)) {
      return component;
    }
    if (component.container && component.children) {
      ret = findComponent(component.children as ISchema, condition);
    }
  }
  return ret;
};

export const diffSchema = (schema: ISchema, callback: ICallback) => {
  for (const component of schema) {
    callback(component);
    if (component.container && component.children) {
      diffSchema(component.children as ISchema, callback);
    }
  }
};

export const filterComponent = (schema: ISchema, condition: ICondition): ISchema =>
  (schema || []).filter(condition).map((s) => {
    if (s.container) {
      return {
        ...s,
        children: filterComponent(s.children as ISchema, condition),
      };
    }
    return s;
  });

export const updateObject = <T>(obj: T, update: (obj: T) => void) => {
  const _obj = cloneDeep(obj);
  update(_obj);
  return _obj;
};
