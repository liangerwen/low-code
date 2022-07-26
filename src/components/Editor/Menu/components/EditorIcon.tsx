import { IconProps } from "@arco-design/web-react/es/Icon";
import * as ArcoIcons from "@arco-design/web-react/icon";
import { useMemo } from "react";

interface IProps {
  name: string;
  iconProps?: IconProps;
}

export default function EditorIcon({ name, iconProps = {} }: IProps) {
  const Icon = useMemo(() => ArcoIcons[name], [name]);
  if (Icon) return <Icon {...iconProps} />;
  return null;
}
