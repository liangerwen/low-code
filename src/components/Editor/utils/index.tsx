type ICondition = (component: IComponent) => boolean;
type ICallback = (component: IComponent) => void;

/**
 * 根据判断条件寻找组件
 * @param schema 组件数组
 * @param condition 条件方法
 * @returns 组件
 */
export const findComponent = (
  schema: IComponent[],
  condition: ICondition
): IComponent | null => {
  for (const component of schema) {
    if (condition(component)) {
      return component;
    }
    if (component.container && component.children) {
      const ret = findComponent(component.children as IComponent[], condition);
      if (ret) return ret;
    }
  }
  return null;
};

export const isParentComponent = (schema: IComponent[], parentId, childId) => {
  if (!parentId || !childId || schema.length === 0) return false;
  const parentComponent = findComponent(schema, (c) => c.id === parentId);
  if (parentComponent.children) {
    const childConponent = findComponent(
      parentComponent.children as IComponent[],
      (c) => c.id === childId
    );
    if (childConponent) return true;
  }
  return false;
};

/**
 * 递归组件执行方法
 * @param schema 组件数组
 * @param callback 所要执行的方法
 * @returns void
 */
export const diffSchema = (schema: IComponent[], callback: ICallback) => {
  for (const component of schema) {
    callback(component);
    if (component.container && component.children) {
      diffSchema(component.children as IComponent[], callback);
    }
  }
};

/**
 * 根据判断条件筛选组件
 * @param schema 组件数组
 * @param condition 条件方法
 * @returns 组件数组
 */
export const filterComponent = (
  schema: IComponent[],
  condition: ICondition
): IComponent[] =>
  (schema || []).filter(condition).map((s) => {
    if (s.container) {
      return {
        ...s,
        children: filterComponent(s.children as IComponent[], condition),
      };
    }
    return s;
  });

/**
 * 根据id找到子组件的父组件
 * @param schema 组件数组
 * @param id 子组件id
 * @returns 父组件孩子数组和子组件对应索引 | 空
 */
export const findWarpper = (schema: IComponent[], id: string | number) => {
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
  return {
    warpper: warpperComponent.children as IComponent[],
    index: warpperIdx,
  };
};
