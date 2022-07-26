import ActionWarp from "./components/ActionWarp";
import ComponentsTab from "./ComponentsTab";
import PageSettingTab from "./PageSettingTab";

export default () => {
  return (
    <ActionWarp
      options={[
        { title: "组件", key: 1, Form: ComponentsTab },
        { title: "模板", key: 2 },
        { title: "接口信息", key: 3 },
        { title: "页面设置", key: 4, Form: PageSettingTab },
      ]}
    />
  );
};
