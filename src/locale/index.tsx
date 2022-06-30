const componentsLocale = import.meta.globEager<Module<ILocale>>(
  "../components/**/locale/index.(js|ts)"
);
const pagesLocale = import.meta.globEager<Module<ILocale>>(
  "../pages/**/locale/index.(js|ts)"
);

interface ILocale {
  "en-US": Record<string, string>;
  "zh-CN": Record<string, string>;
}

const combineLocales = (
  ...modules: Record<string, Module<ILocale>>[]
): ILocale => {
  let ret = { "en-US": {}, "zh-CN": {} };
  modules.forEach((module) => {
    Object.keys(module).forEach((m) => {
      const locale = module[m].default;
      if (!locale) return;
      if (locale["en-US"]) {
        ret["en-US"] = { ...ret["en-US"], ...locale["en-US"] };
      }
      if (locale["zh-CN"]) {
        ret["zh-CN"] = { ...ret["zh-CN"], ...locale["zh-CN"] };
      }
    });
  });
  return ret;
};

const locales = combineLocales(componentsLocale, pagesLocale);

export default locales;
