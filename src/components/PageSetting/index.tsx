import React, { createContext, useContext, useEffect, useState } from "react";
import { Button, Drawer } from "@arco-design/web-react";
import { IconSettings } from "@arco-design/web-react/icon";
import Block from "./block";
import ColorPanel from "./color";
import { getCustomOrRgb } from "@/utils/theme";
import { useLocale } from "../Locale";

interface SettingProps {
  trigger?: React.ReactElement;
}

function PageSetting(props: SettingProps) {
  const { trigger, ...rest } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger as React.ReactElement, {
          onClick: () => {
            setVisible(true);
          },
        })
      ) : (
        <Button
          {...rest}
          icon={<IconSettings />}
          shape="circle"
          type="secondary"
          onClick={() => setVisible(true)}
        />
      )}
      <Drawer
        width={300}
        title={
          <>
            <IconSettings />
            {t("settings.title")}
          </>
        }
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Block title={t("settings.themeColor")}>
          <ColorPanel />
        </Block>
        <Block
          title={t("settings.content")}
          options={[
            { name: "settings.navbar", value: "navbar" },
            { name: "settings.menu", value: "menu" },
            { name: "settings.footer", value: "footer" },
            {
              name: "settings.menuWidth",
              value: "menuWidth",
              type: "number",
            },
          ]}
        />
        <Block
          title={t("settings.otherSettings")}
          options={[{ name: "settings.colorWeek", value: "colorWeek" }]}
          withDivider={false}
        />
      </Drawer>
    </>
  );
}

interface ISettings {
  colorWeek: boolean;
  navbar: boolean;
  menu: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
}

const SettingContext = createContext({
  settings: {
    colorWeek: false,
    navbar: true,
    menu: true,
    footer: true,
    themeColor: getCustomOrRgb(),
    menuWidth: 250,
  },
  setSettings: (setting: ISettings) => {},
});

export const useSettings = (): [ISettings, (setting: ISettings) => void] => {
  const { settings, setSettings } = useContext(SettingContext);
  return [settings, setSettings];
};

export const SettingProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    colorWeek: false,
    navbar: true,
    menu: true,
    footer: true,
    themeColor: getCustomOrRgb(),
    menuWidth: 250,
  });

  return (
    <SettingContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingContext.Provider>
  );
};

export default PageSetting;
