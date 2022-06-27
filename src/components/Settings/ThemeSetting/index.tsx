import { useState } from "react";
import { IconProps, IconSkin } from "@arco-design/web-react/icon";
import { Button, ButtonProps } from "@arco-design/web-react";
import ThemeModal from "./ThemeModal";
import IconButton from "@/components/IconButton";

export default function OnlineTheme(
  props: { iconOnly?: boolean } & ButtonProps & IconProps
) {
  const { iconOnly = false, ...rest } = props;
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  return (
    <>
      {iconOnly ? (
        <IconSkin {...rest} onClick={() => setThemeModalVisible(true)} />
      ) : (
        <IconButton
          {...rest}
          icon={<IconSkin />}
          onClick={() => setThemeModalVisible(true)}
        />
      )}

      <ThemeModal
        visible={themeModalVisible}
        onClose={() => {
          setThemeModalVisible(false);
        }}
        onConfirm={() => {
          setThemeModalVisible(false);
        }}
      />
    </>
  );
}
