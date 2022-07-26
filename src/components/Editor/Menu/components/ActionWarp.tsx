import { Tabs } from "@arco-design/web-react";
import { FC, ReactNode } from "react";

export default function ({
  options,
}: {
  options: {
    title: ReactNode;
    key: string | number;
    Form?: FC<Record<string, any>>;
    props?: Record<string, any>;
  }[];
}) {
  return (
    <Tabs justify>
      {options.map((op) => (
        <Tabs.TabPane
          title={op.title}
          key={op.key}
          className="px-2 overflow-auto"
        >
          {op.Form && <op.Form {...op.props} />}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}
