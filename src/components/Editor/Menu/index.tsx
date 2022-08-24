import { Empty } from "@arco-design/web-react";
import ActionWarp from "./components/ActionWarp";
import ComponentsTab from "./ComponentsTab";
import PageNodeTreeTab from "./PageNodeTreeTab";
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
        { title: "大纲", key: 2, Form: PageNodeTreeTab, props },
        { title: "页面设置", key: 3, Form: PageSettingTab, props },
        {
          title: "模板",
          key: 5,
          Form: () => <Empty className="h-full flex items-center" />,
        },
      ]}
    />
  );
};
