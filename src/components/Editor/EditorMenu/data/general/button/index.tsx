import { updateObject } from "@/utils";
import { Button, Tabs } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";
import EventForm from "../../../components/EventForm";
import PropForm from "./PropForm";

const name = "a-button";

const defaultSchema = {
  name,
  title: "按钮",
  attrs: {
    type: "primary",
  },
  children: ["按钮"],
  inline: true,
};

const action = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  return (
    <Tabs justify>
      <Tabs.TabPane title="属性" key="1" className="px-2 overflow-auto">
        <PropForm {...props} />
      </Tabs.TabPane>
      <Tabs.TabPane title="事件" key="2" className="px-2 overflow-auto">
        <EventForm
          options={[
            { label: "点击", value: "onClick" },
            { label: "鼠标移入", value: "onMouseEnter" },
            { label: "鼠标移出", value: "onMouseLeave" },
          ]}
          value={props.schema.events}
          onChange={(val) => {
            props.onChange({ ...props.schema, events: val });
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default {
  name,
  componentMap: { [name]: Button },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
  action,
};
