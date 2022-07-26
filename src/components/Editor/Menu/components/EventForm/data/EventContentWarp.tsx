import { ReactNode } from "react";
import { Typography } from "@arco-design/web-react";
const { Paragraph } = Typography;

export default ({
  desc = "",
  children,
}: {
  desc: ReactNode;
  children?: ReactNode;
}) => (
  <>
    <Paragraph>动作说明</Paragraph>
    <Paragraph className="important-color-[rgb(var(--gray-5))] ml-4">
      {desc}
    </Paragraph>
    {children}
  </>
);
