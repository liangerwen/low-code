const generalExamples = import.meta.globEager<Module<Menu>>("./general/*.ts");
const datashowExamples = import.meta.globEager<Module<Menu>>("./datashow/*.ts");
const dataInputExamples = import.meta.globEager<Module<Menu>>(
  "./datainput/*.ts"
);

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
  Object.values(example).map((module) => module.default);

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
