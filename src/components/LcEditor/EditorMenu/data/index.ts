import { FC, ReactNode } from "react";
import ErrorComponent from "../../ErrorComponent";

const generalExamples = import.meta.globEager<Module<Menu>>(
  "./general/*.ts(x)?"
);
const datashowExamples = import.meta.globEager<Module<Menu>>(
  "./datashow/*.ts(x)?"
);
const dataInputExamples = import.meta.globEager<Module<Menu>>(
  "./datainput/*.ts(x)?"
);

const modules = {
  ...generalExamples,
  ...datashowExamples,
  ...dataInputExamples,
};

type Mapping = {
  [key: string]: React.FC<any>;
};

export type Menu = {
  name: string;
  componentMap: { [name: string]: FC<any> };
  icon: FC<any>;
  demo: IComponent[];
  defaultSchema: IComponent;
  action?: FC<{ schema: IComponent }>;
};

const getExamplesData = (example: Record<string, Module<Menu>>) =>
  Object.keys(example).map((key) => example[key].default);

export const getComponentByName = (name: string) => {
  const mappingArr = Object.values(modules);
  const mapping = mappingArr.reduce<Mapping>((acc, cur) => {
    acc = { ...acc, ...cur.default.componentMap };
    return acc;
  }, {});
  return mapping[name] || ErrorComponent;
};

export const getJsonByName = (name: string) => {
  const modulesArr = Object.keys(modules).map((key) => modules[key].default);
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
  const mappingArr = Object.values(modules);
  const component = mappingArr.find((cur) => cur.default.name === name);
  return component?.default?.action;
};

export default [
  {
    type: "通用",
    menus: getExamplesData(generalExamples),
  },
  {
    type: "数据展示",
    menus: getExamplesData(datashowExamples),
  },
  {
    type: "数据输入",
    menus: getExamplesData(dataInputExamples),
  },
];
