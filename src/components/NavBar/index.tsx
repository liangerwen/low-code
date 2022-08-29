import {
  Avatar,
  Button,
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
import LangSetting from "../Settings/LocaleSetting";
import ModeSetting from "../Settings/ModeSetting";
import PageSetting from "../Settings/PageSetting";
import OnlineTheme from "../Settings/ThemeSetting";
import useLocale from "@/hooks/useLocale";
import { useSettings } from "../Settings";

const Row = Grid.Row;

enum MenuKeys {
  GITHUB = "github",
  SETTING = "setting",
  LOGOUT = "logout",
}

export default function () {
  const navigate = useNavigate();
  const { t } = useLocale();
  const {
    pageSetting: { navbar },
  } = useSettings();

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
          {t("navbar.menus.github")}
        </Menu.Item>
        <Menu.Item key={MenuKeys.SETTING}>
          <IconSettings className="mr-2" />
          {t("navbar.menus.settings")}
        </Menu.Item>
        <Divider className="important-my-1" />
        <Menu.Item key={MenuKeys.LOGOUT}>
          <IconExport className="mr-2" />
          {t("navbar.menus.logout")}
        </Menu.Item>
      </Menu>
    ),
    [t]
  );

  return navbar ? (
    <Row
      className={styles["toolbar-wrapper"]}
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
        <Tooltip content={t("navbar.lang")}>
          <LangSetting />
        </Tooltip>
        <ModeSetting />
        <Tooltip content={t("navbar.theme")}>
          <OnlineTheme />
        </Tooltip>
        <Tooltip content={t("navbar.settings")}>
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
  ) : (
    <PageSetting
      trigger={
        <Button
          type="primary"
          icon={<IconSettings fontSize={24} />}
          className="important-fixed top-[250px] right-0 important-w-[42px] important-h-[42px] important-flex justify-center items-center z-[1]"
        />
      }
    />
  );
}
