import {
  Avatar,
  Divider,
  Dropdown,
  Grid,
  Menu,
  Space,
  Tooltip,
} from "@arco-design/web-react";
import {
  IconExport,
  IconGithub,
  IconSettings,
} from "@arco-design/web-react/icon";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@/utils/auth";
import styles from "./styles/index.module.less";
import LangSetting, { useLocale } from "../Locale";
import ModeSetting from "../ModeSetting";
import OnlineTheme from "../OnlineTheme";
import PageSetting from "../PageSetting";

const Row = Grid.Row;

// interface IProps {
//   userMenus?: Boolean;
// }

enum MenuKeys {
  GITHUB = "github",
  SETTING = "setting",
  LOGOUT = "logout",
}

export default function () {
  // const { userMenus = true } = props;
  const navigate = useNavigate();
  const { t } = useLocale();

  const menus = useMemo(
    () => (
      <Menu
        onClickMenuItem={(key) => {
          switch (key) {
            case MenuKeys.GITHUB:
              window.open("https://github.com/liangerwen/low-code");
              break;
            case MenuKeys.SETTING:
              break;
            case MenuKeys.LOGOUT:
              logout();
              navigate("/login");
              break;
            default:
              break;
          }
        }}
      >
        <Menu.Item
          key="avatar"
          className="important-h-[50px] pointer-events-none flex justify-between items-center"
        >
          <Avatar className="mr-2">
            <img
              alt="avatar"
              src="//liangerwen.cc:7001/public/1655285813343.jpg"
            />
          </Avatar>
          <span>liangerwen</span>
        </Menu.Item>
        <Divider className="important-my-1" />
        <Menu.Item key={MenuKeys.GITHUB}>
          <IconGithub className="mr-2" />
          项目地址
        </Menu.Item>
        <Menu.Item key={MenuKeys.SETTING}>
          <IconSettings className="mr-2" />
          个人设置
        </Menu.Item>
        <Divider className="important-my-1" />
        <Menu.Item key={MenuKeys.LOGOUT}>
          <IconExport className="mr-2" />
          退出登录
        </Menu.Item>
      </Menu>
    ),
    []
  );

  return (
    <Row
      className={styles["toolbar-warpper"]}
      justify="space-between"
      align="center"
    >
      <Link to="/" className="no-underline">
        <Space>
          <img
            src="/favicon.ico"
            alt="logo"
            className={styles["toolbar-logo"]}
          />
          <span className={styles["toolbar-title"]}>liangerwen's low code</span>
        </Space>
      </Link>
      <Space className="px-2" align="center" size={20}>
        <Tooltip content={t("navbar.lang.change")}>
          <LangSetting />
        </Tooltip>
        <ModeSetting />
        <Tooltip content="安装主题">
          <OnlineTheme />
        </Tooltip>
        <Tooltip content="设置">
          <PageSetting />
        </Tooltip>

        <Dropdown droplist={menus} position="br">
          <Avatar size={30} className="cursor-pointer">
            <img
              alt="avatar"
              src="//liangerwen.cc:7001/public/1655285813343.jpg"
            />
          </Avatar>
        </Dropdown>
      </Space>
    </Row>
  );
}
