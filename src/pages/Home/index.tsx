import { Button, Divider, Grid, Layout, Menu } from "@arco-design/web-react";
import { IconFolderAdd } from "@arco-design/web-react/icon";
import { useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CustomRoutes, MenuRoutes } from "@/App";
import { concatPath } from "@/utils";
import { useSettings } from "@/components/Settings";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Row = Grid.Row;

const path = "/home";

export default function Home() {
  const location = useLocation();
  const navigator = useNavigate();

  const { pageSetting } = useSettings();

  const renderMenus = useCallback((routes: CustomRoutes[], basePath = path) => {
    return routes.map((item) => {
      const path = concatPath(basePath, item.path!);
      if (item.children) {
        return (
          <SubMenu
            key={path}
            title={
              <>
                {item.icon} {item.name}
              </>
            }
          >
            {renderMenus(item.children, path)}
          </SubMenu>
        );
      }
      return (
        <MenuItem key={path}>
          <Link className="block" to={path}>
            {item.icon} {item.name}
          </Link>
        </MenuItem>
      );
    });
  }, []);

  return (
    <Layout>
      <Layout.Sider width={pageSetting.menuWidth}>
        <Menu
          className="w-full h-full"
          autoOpen
          defaultSelectedKeys={[location.pathname]}
        >
          <Row justify="center" align="center" className="my-8">
            <Button
              type="outline"
              icon={<IconFolderAdd />}
              onClick={() => {
                navigator("/editor/new");
              }}
            >
              新 建
            </Button>
          </Row>
          <Divider />
          {renderMenus(MenuRoutes)}
        </Menu>
      </Layout.Sider>
      <Layout.Content className="bg-[var(--color-bg-3)] p-2">
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
