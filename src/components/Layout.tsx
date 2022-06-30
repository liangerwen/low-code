import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Layout as ArcoLayout,
  Menu,
  Message,
} from "@arco-design/web-react";
import NavBar from "../components/NavBar";
import {
  cloneElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isLogin } from "../utils/auth";
import routes, { CustomRoutes } from "@/Router";
import Footer from "./Footer";
import useLocale from "@/hooks/useLocale";
import { useSettings } from "./Settings";
import { concatPath } from "@/utils";
import classNames from "classnames";
import { getParentRoute } from "@/utils/route";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

interface IProps {
  widthRouter?: boolean;
  menu?: boolean;
  footer?: boolean;
  navbar?: boolean;
  children?: ReactNode;
}

export default function Layout(props: IProps) {
  const {
    widthRouter = false,
    menu = false,
    footer = true,
    navbar = true,
    children,
  } = props;

  const [breadcrumb, setBreadcrumb] = useState<React.ReactNode[]>([]);
  const breadcrumbMap = useRef<Map<string, React.ReactNode[]>>(new Map());
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useLocale();
  const { pageSetting } = useSettings();

  useEffect(() => {
    const path = location.pathname;
    if (!isLogin()) {
      Message.error("请先登录");
      navigate(`/login?redirect=${path}`, { replace: true });
      return;
    }
    setSelectedKeys([path]);
    const openKey = getParentRoute(routes, path);
    if (openKey) {
      setOpenKeys([openKey]);
    }
  }, [location]);

  useEffect(() => {
    setBreadcrumb(breadcrumbMap.current.get(location.pathname) || []);
  }, [location, t]);

  const renderMenus = useCallback(
    (routes: CustomRoutes[], basePath = "") => {
      const menus = routes.map((item) => {
        const path = concatPath(basePath, item.path);
        if (item.inMenu !== false && item.breadcrumb !== false) {
          const preRoutes = breadcrumbMap.current.get(basePath) || [];
          breadcrumbMap.current.set(path, [
            ...preRoutes,
            <>
              {cloneElement(item.icon, {
                className: classNames(item.icon.props.className, "mr-2"),
              })}
              {t(item.name)}
            </>,
          ]);
        }
        if (item.children) {
          if (item.inMenu === false) return renderMenus(item.children, path);
          return (
            <SubMenu
              key={path}
              title={
                <>
                  {item.icon} {t(item.name)}
                </>
              }
            >
              {renderMenus(item.children, path)}
            </SubMenu>
          );
        }
        if (item.inMenu === false) return null;
        return (
          <MenuItem key={path}>
            {item.icon} {t(item.name)}
          </MenuItem>
        );
      });
      breadcrumbMap.current.delete(basePath);
      return menus;
    },
    [t]
  );

  return (
    <ArcoLayout className="overflow-hidden bg-[rgb(var(--gray-2))] h-[100vh]">
      {navbar && (
        <ArcoLayout.Header>
          <NavBar />
        </ArcoLayout.Header>
      )}
      <ArcoLayout.Content>
        {menu ? (
          <ArcoLayout className="h-full">
            {pageSetting.menu && (
              <ArcoLayout.Sider width="auto">
                <Menu
                  className="w-full h-full"
                  style={{ width: pageSetting.menuWidth }}
                  selectedKeys={selectedKeys}
                  openKeys={openKeys}
                  onClickSubMenu={(key) =>
                    setOpenKeys(openKeys.includes(key) ? [] : [key])
                  }
                  onClickMenuItem={(path) => {
                    if (location.pathname !== path) {
                      navigate(path);
                    }
                  }}
                  hasCollapseButton
                >
                  {renderMenus(routes)}
                </Menu>
              </ArcoLayout.Sider>
            )}
            <ArcoLayout.Content className="bg-[var(--color-fill-2)] p-4 flex flex-col min-h-full box-border">
              <ArcoLayout>
                <Breadcrumb>
                  {breadcrumb.map((b, idx) => (
                    <Breadcrumb.Item key={idx}>{b}</Breadcrumb.Item>
                  ))}
                </Breadcrumb>
                <ArcoLayout.Content>
                  {widthRouter ? <Outlet /> : children}
                </ArcoLayout.Content>
                {footer && (
                  <ArcoLayout.Footer>
                    <Footer />
                  </ArcoLayout.Footer>
                )}
              </ArcoLayout>
            </ArcoLayout.Content>
          </ArcoLayout>
        ) : (
          <>{widthRouter ? <Outlet /> : children}</>
        )}
      </ArcoLayout.Content>
      {footer && !menu && (
        <ArcoLayout.Footer>
          <Footer />
        </ArcoLayout.Footer>
      )}
    </ArcoLayout>
  );
}
