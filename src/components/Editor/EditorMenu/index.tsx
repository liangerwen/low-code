import { Tabs } from "@arco-design/web-react";
import ComponentsTab from "./ComponentsTab";

export default () => {
  return (
    <Tabs>
      <Tabs.TabPane title="组件" key="1">
        <ComponentsTab />
      </Tabs.TabPane>
      <Tabs.TabPane title="模板" key="2">
        模板
      </Tabs.TabPane>
      <Tabs.TabPane title="接口信息" key="3">
        接口信息
      </Tabs.TabPane>
      <Tabs.TabPane title="页面设置" key="4">
        页面设置
      </Tabs.TabPane>
    </Tabs>
  );
};
