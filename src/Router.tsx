import NotFind from "./pages/404";
import Login from "./pages/Login";
import { IconApps } from "@arco-design/web-react/icon";
import { Spin } from "@arco-design/web-react";
import { lazy, Suspense, useEffect } from "react";
import Layout from "./components/Layout";
import { useNavigate } from "react-router-dom";

const lazyload = (importFn, props = {}) => {
  const LazyComp = lazy(importFn);
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Spin />
        </div>
      }
    >
      <LazyComp {...props} />
    </Suspense>
  );
};

function Redirect({ to }) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, []);
  return null;
}

export interface CustomRoutes {
  name?: string;
  path: string;
  children?: CustomRoutes[];
  element?: React.ReactElement;
  icon?: React.ReactElement;
  inMenu?: boolean;
  breadcrumb?: boolean;
}

const routes: CustomRoutes[] = [
  {
    path: "/",
    inMenu: false,
    element: <Layout widthRouter menu />,
    children: [
      {
        path: "",
        element: <Redirect to="/workspace/projects" />,
        inMenu: false,
      },
      {
        path: "workspace",
        name: "page.workspace",
        icon: <IconApps />,
        children: [
          {
            name: "page.workspace.projects",
            path: "projects",
            element: lazyload(() => import("./pages/Home/Projects")),
            icon: (
              <i className="arco-icon arco-icon-select-all i-ant-design-project-outlined" />
            ),
          },
          {
            name: "page.workspace.templates",
            path: "templates",
            element: lazyload(() => import("./pages/Home/Templates")),
            icon: (
              <i className="arco-icon arco-icon-select-all i-gg-template" />
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/new",
    element: (
      <Layout footer={false}>{lazyload(() => import("./pages/Editor"))}</Layout>
    ),
    inMenu: false,
  },
  {
    path: "/login",
    element: <Login />,
    inMenu: false,
  },
  {
    path: "*",
    element: (
      <Layout navbar={false}>
        <NotFind />
      </Layout>
    ),
    inMenu: false,
  },
];

export default routes;
