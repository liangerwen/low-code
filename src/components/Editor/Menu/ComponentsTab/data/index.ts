import ErrorComp from "@/components/Editor/components/ErrorComp";
import { IconProps } from "@arco-design/web-react/icon";
import { FC } from "react";

const examples = import.meta.globEager<
  Module<{ type: string; menus: Menu[]; idx: number }>
>("./*/index.ts(x)?");

const components = Object.values(examples)
  .map((e) => e.default.menus)
  .flat();

type Mapping = {
  [key: string]: React.FC<any>;
};

export interface ActionProps {
  component: IComponent;
  schema: ISchema;
  onChange: (component: IComponent) => void;
}

export type Menu = {
  name: string;
  componentMap: { [name: string]: FC<any> };
  icon: FC<IconProps>;
  demo: IComponent[];
  defaultSchema: IComponent;
  Action?: FC<ActionProps>;
};

/**
 * 根据名称获取对应React组件
 * @param name 组件名称
 * @returns React组件
 */
export const getComponentByName = (name: string): FC<any> => {
  const mappingArr = Object.values(components);
  const mapping = mappingArr.reduce<Mapping>((acc, cur) => {
    acc = { ...acc, ...cur.componentMap };
    return acc;
  }, {});
  return mapping[name] || ErrorComp;
};

/**
 * 根据名称获取对应默认json
 * @param name
 * @returns json对象
 */
export const getJsonByName = (name: string) => {
  const modulesArr = Object.keys(examples).map(
    (key) => components[key].default
  );
  const mapping = modulesArr.reduce<{ [key: string]: IComponent }>(
    (acc, cur: Menu) => {
      const component = cur.defaultSchema;
      acc[component.name] = component;
      return acc;
    },
    {}
  );
  return mapping[name];
};

/**
 * 根据名称获取对应Action组件
 * @param name
 * @returns Action组件
 */
export const getRenderActionByName = (name: string) => {
  const mappingArr = Object.values(components);
  const component = mappingArr.find((cur) => cur.name === name);
  return component?.Action;
};

/**
 * 根据名称获取对应Icon
 * @param name
 * @returns Icon
 */
export const getIconByName = (name: string) => {
  const mappingArr = Object.values(components);
  const component = mappingArr.find((cur) => cur.name === name);
  return component?.icon;
};

export default Object.values(examples)
  .map((e) => e.default)
  .sort((a, b) => a.idx - b.idx);
