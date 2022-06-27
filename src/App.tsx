import { useRoutes } from "react-router-dom";
import Editor from "./pages/Editor";
import Home from "./pages/Home/index";
import NotFind from "./pages/404";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Projects from "./pages/Home/Projects";
import Templates from "./pages/Home/Templates";
import { filterFlatDeep } from "./utils";
import { IconApps } from "@arco-design/web-react/icon";
import { SettingProvider } from "./components/Settings";
import useMode from "./components/Settings/ModeSetting/useMode";
import useTheme from "./components/Settings/ThemeSetting/useTheme";

export interface CustomRoutes {
  name: string;
  path?: string;
  children?: CustomRoutes[];
  element?: React.ReactElement;
  icon?: React.ReactElement;
}

export const MenuRoutes: CustomRoutes[] = [
  {
    name: "项 目",
    icon: <IconApps />,
    children: [
      {
        name: "全部项目",
        path: "projects",
        element: <Projects />,
        icon: (
          <i className="arco-icon arco-icon-select-all i-ant-design-project-outlined" />
        ),
      },
      {
        name: "项目模板",
        path: "templates",
        element: <Templates />,
        icon: <i className="arco-icon arco-icon-select-all i-gg-template" />,
      },
    ],
  },
];

const filterMenuRoutes = filterFlatDeep(
  MenuRoutes,
  "children",
  (item) => !!item.element
);

export default function App() {
  // 初始化模式
  useMode();
  // 初始化主题
  useTheme();

  const element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "home",
          element: <Home />,
          children: filterMenuRoutes,
        },
        {
          path: "editor/:id",
          element: <Editor />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <NotFind />,
    },
  ]);

  return <SettingProvider>{element}</SettingProvider>;
}
