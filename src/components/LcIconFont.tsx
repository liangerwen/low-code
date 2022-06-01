import { Icon } from "@arco-design/web-react";
import { IconProps } from "@arco-design/web-react/icon";
import React, { createContext, FC, ReactNode, useContext } from "react";

const LcIconFontContext = createContext<string[]>([]);

export const LcIconFontProvider: React.FC<{
  children: ReactNode;
  urls: string[];
}> = ({ children, urls }) => {
  return (
    <LcIconFontContext.Provider value={urls}>
      {children}
    </LcIconFontContext.Provider>
  );
};

export default (props: {
  spin?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const urls = useContext(LcIconFontContext);
  if (!urls || urls.length === 0) {
    console.error("LcIconFont: no icon font provider found");
    return null;
  }
  let IconFont: FC<IconProps>;
  urls.forEach((u) => {
    IconFont = Icon.addFromIconFontCn({ src: u });
  });
  // @ts-ignore
  return <IconFont {...props} />;
};
