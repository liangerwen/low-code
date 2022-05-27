import ErrorComponent from "../../ErrorComponent";

const generalExamples = import.meta.globEager<Module<Menu>>("./general/*.ts");
const datashowExamples = import.meta.globEager<Module<Menu>>("./datashow/*.ts");
const dataInputExamples = import.meta.globEager<Module<Menu>>(
  "./datainput/*.ts"
);

const dataMapping = import.meta.globEager<Module<Mapping>>("./**/index.ts");

type Mapping = {
  [key: string]: React.FC<any>;
};

export type Menu = {
  icon: string;
  text: string;
  demo: {
    title: string;
    components: IComponent[];
  };
  component: IComponent;
};

const getExamplesData = (example: Record<string, Module<Menu>>) =>
  Object.keys(example)
    .filter((key) => !/^.\/\w+\/index.ts$/.test(key))
    .map((key) => example[key].default);

export const getComponentByName = (name: string) => {
  const mappingArr = Object.values(dataMapping);
  const mapping = mappingArr.reduce<Mapping>((acc, cur) => {
    acc = { ...acc, ...cur.default };
    return acc;
  }, {});
  return mapping[name] || ErrorComponent;
};

export const getJsonByName = (name: string) => {
  const modules = {
    ...generalExamples,
    ...datashowExamples,
    ...dataInputExamples,
  };
  const modulesArr = Object.keys(modules)
    .filter((key) => !/^.\/\w+\/index.ts$/.test(key))
    .map((key) => modules[key].default);
  const mapping = modulesArr.reduce<{ [key: string]: IComponent }>(
    (acc, cur: Menu) => {
      const component = cur.component;
      acc[component.name] = component;
      return acc;
    },
    {}
  );
  return mapping[name];
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
