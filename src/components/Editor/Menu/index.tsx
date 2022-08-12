import { Empty } from "@arco-design/web-react";
import ActionWarp from "./components/ActionWarp";
import ComponentsTab from "./ComponentsTab";
import PageSettingTab from "./PageSettingTab";

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export default (props: IProps) => {
  return (
    <ActionWarp
      options={[
        { title: "组件", key: 1, Form: ComponentsTab },
        {
          title: "模板",
          key: 2,
          Form: () => <Empty className="h-full flex items-center" />,
        },
        { title: "接口信息", key: 3 },
        { title: "页面设置", key: 4, Form: PageSettingTab, props },
      ]}
    />
  );
};
