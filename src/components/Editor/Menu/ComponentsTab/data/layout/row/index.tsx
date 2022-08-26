import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "@/utils";
import { Grid } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const { Row } = Grid;

const name = "row";

const defaultSchema = {
  name,
  title: "行",
  container: true,
  onlyContainer: true,
};

const Action = (props: ActionProps) => {
  return (
    <ActionWarp
      options={[
        {
          title: "属性",
          key: 1,
          Form: PropForm,
          props,
        },
        {
          title: "样式",
          key: 2,
          Form: StyleForm,
          props: {
            value: pick(props.component.props, "style", "className"),
            onChange: (val) => {
              props.onChange(
                produce(props.component, (component) => {
                  component.props = { ...component.props, ...val };
                })
              );
            },
          },
        },
      ]}
    />
  );
};

export default {
  name,
  componentMap: { [name]: Row },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-mdi:land-rows-horizontal"
      {...props}
    />
  ),
  desc: "栅格行容器。",
  defaultSchema,
  Action,
};
