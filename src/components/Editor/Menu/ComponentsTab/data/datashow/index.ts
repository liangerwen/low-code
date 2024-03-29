import { Menu } from "..";
import card from "./card";

const fileExamples = import.meta.globEager<Module<Menu>>("./*.ts(x)?");

const folderExamples = import.meta.globEager<Module<Menu>>("./*/index.ts(x)?");

const menuData = { ...fileExamples, ...folderExamples };

export default {
  idx: 3,
  type: "数据展示",
  // menus: Object.keys(menuData).map((key) => menuData[key].default),
  menus: [card],
};
