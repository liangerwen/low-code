import { CustomRoutes } from "@/Router";
import { concatPath } from "./url";

export const getParentRoute = (routes: CustomRoutes[], path: string) => {
  let ret, transferPath;
  const depRoutes = (rs, basePath = "") => {
    const len = rs.length;
    for (let i = 0; i < len; i++) {
      const r = rs[i];
      const nextPath = concatPath(basePath, r.path);
      if (!path.startsWith(nextPath)) continue;
      if (path === nextPath) {
        ret = transferPath;
        break;
      }
      transferPath = nextPath;
      r.children && !ret && depRoutes(r.children, nextPath);
    }
    transferPath = undefined;
  };
  depRoutes(routes);
  return ret;
};
