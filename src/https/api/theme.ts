import HTTP from "../index";

export type GetThemeOptions = {
  pageSize: number;
  currentPage: number;
  keyword?: string;
};

export type ThemeType = {
  author: string;
  cover: string;
  packageName: string;
  themeId: number | string;
  themeName: string;
  unpkgHost: string;
  version: string;
  _id: string;
};
export const getTheme = (
  options: GetThemeOptions = { pageSize: 6, currentPage: 1 }
) => {
  const url = "https://arco.design/themes/api/open/themes/list";
  return HTTP.get<{ list: ThemeType[]; total: number }>(url, {
    params: { ...options, depLibrary: "@arco-design/web-react" },
  });
};
