import { Menu } from "..";

const fileExamples = import.meta.globEager<Module<Menu>>("./*.ts(x)?");

const folderExamples = import.meta.globEager<Module<Menu>>("./*/index.ts(x)?");

const menuData = { ...fileExamples, ...folderExamples };

export default {
  idx: 1,
  type: "布局",
  menus: Object.keys(menuData).map((key) => menuData[key].default),
};
