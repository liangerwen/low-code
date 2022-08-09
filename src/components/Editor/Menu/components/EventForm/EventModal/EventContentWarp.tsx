import { ReactNode } from "react";
import { Empty, Typography } from "@arco-design/web-react";
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
    <Paragraph>基础配置</Paragraph>
    <div className="ml-4">{children || <Empty description="暂无配置内容" />}</div>
  </>
);
