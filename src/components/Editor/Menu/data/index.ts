import { IconProps } from "@arco-design/web-react/icon";
import { FC } from "react";
import ErrorComponent from "../../components/ErrorComponent";

const examples = import.meta.globEager<
  Module<{ type: string; menus: Menu[]; idx: number }>
>("./*/index.ts(x)?");

const components = Object.values(examples)
  .map((e) => e.default.menus)
  .flat();

type Mapping = {
  [key: string]: React.FC<any>;
};

export type Menu = {
  name: string;
  componentMap: { [name: string]: FC<any> };
  icon: FC<IconProps>;
  demo: IComponent[];
  defaultSchema: IComponent;
  action?: FC<{ schema: IComponent; onChange: (schema: IComponent) => void }>;
};

export const getComponentByName = (name: string) => {
  const mappingArr = Object.values(components);
  const mapping = mappingArr.reduce<Mapping>((acc, cur) => {
    acc = { ...acc, ...cur.componentMap };
    return acc;
  }, {});
  return mapping[name] || ErrorComponent;
};

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

export const getRenderActionByName = (name: string) => {
  const mappingArr = Object.values(components);
  const component = mappingArr.find((cur) => cur.name === name);
  return component?.action;
};

export default Object.values(examples)
  .map((e) => e.default)
  .sort((a, b) => a.idx - b.idx);
