import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Layout as ArcoLayout,
  Menu,
  Message,
  Grid,
  Divider,
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
import classNames from "classnames";
import { getParentRoute } from "@/utils/route";
import { concatPath } from "@/utils/url";
import { IconPlus } from "@arco-design/web-react/icon";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const Row = Grid.Row;

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

  const contentClass =
    "bg-[var(--color-bg-2)] rounded-[8px] shadow-[rgba(0,0,0,0.08)] shadow";

  return (
    <ArcoLayout className="overflow-hidden h-[100vh]">
      {navbar && (
        <ArcoLayout.Header>
          <NavBar />
        </ArcoLayout.Header>
      )}
      <ArcoLayout.Content className="h-[calc(100vh-56px)] bg-[rgb(var(--gray-2))]">
        {menu ? (
          <ArcoLayout className="h-full p-[6px] box-border">
            {pageSetting.menu && (
              <ArcoLayout.Sider
                width="auto"
                className={classNames(contentClass, "mr-[8px] overflow-hidden")}
              >
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
                  // hasCollapseButton
                >
                  <Row justify="center" className="py-8">
                    <Button
                      type="outline"
                      icon={<IconPlus />}
                      onClick={() => {
                        navigate("/new");
                      }}
                    >
                      新建
                    </Button>
                  </Row>
                  <Divider className="mt-0" />
                  {renderMenus(routes)}
                </Menu>
              </ArcoLayout.Sider>
            )}
            <ArcoLayout.Content className="flex flex-col min-h-full box-border">
              <ArcoLayout>
                <Breadcrumb className={classNames(contentClass, "p-2")}>
                  {breadcrumb.map((b, idx) => (
                    <Breadcrumb.Item key={idx}>{b}</Breadcrumb.Item>
                  ))}
                </Breadcrumb>
                <ArcoLayout.Content
                  className={classNames(contentClass, "my-2 p-2")}
                >
                  {widthRouter ? <Outlet /> : children}
                </ArcoLayout.Content>
                {footer && (
                  <ArcoLayout.Footer className={contentClass}>
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
