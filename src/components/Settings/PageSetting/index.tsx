import { cloneElement, useState } from "react";
import { Drawer } from "@arco-design/web-react";
import { IconSettings } from "@arco-design/web-react/icon";
import Block from "./block";
import ColorPanel from "./color";
import useLocale from "@/hooks/useLocale";
import IconButton from "@/components/IconButton";

interface SettingProps {
  trigger?: React.ReactElement;
}

export default function PageSetting(props: SettingProps) {
  const { trigger, ...rest } = props;
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();

  return (
    <>
      {trigger ? (
        cloneElement(trigger as React.ReactElement, {
          onClick: () => {
            setVisible(true);
          },
        })
      ) : (
        <IconButton
          {...rest}
          icon={<IconSettings />}
          onClick={() => setVisible(true)}
        />
      )}
      <Drawer
        width={300}
        title={
          <>
            <IconSettings />
            {t("settings.page.title")}
          </>
        }
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Block title={t("settings.page.themeColor")}>
          <ColorPanel />
        </Block>
        <Block
          title={t("settings.page.content")}
          options={[
            { name: "settings.page.navbar", value: "navbar" },
            { name: "settings.page.menu", value: "menu" },
            { name: "settings.page.footer", value: "footer" },
            {
              name: "settings.page.menuWidth",
              value: "menuWidth",
              type: "number",
            },
          ]}
        />
        <Block
          title={t("settings.page.otherSettings")}
          options={[{ name: "settings.page.colorWeek", value: "colorWeek" }]}
          withDivider={false}
        />
      </Drawer>
    </>
  );
}
