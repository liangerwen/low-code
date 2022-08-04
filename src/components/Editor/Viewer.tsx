import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Message, Modal, Notification } from "@arco-design/web-react";
import EditorIcon from "./Menu/components/EditorIcon";
import { getComponentByName } from "./Menu/ComponentsTab/data";
import { createEvents } from "./utils/events";
import { copy } from "@/utils";

interface ItemProps {
  item: IComponent;
}

const ViewerItem = (props: ItemProps) => {
  const { item } = props;
  const { container, name, attrs, children = [], events = {} } = item;

  const Common = getComponentByName(name);

  const commomProps = useMemo(() => {
    const p = {};
    Object.keys(attrs).forEach((ak) => {
      p[ak] = attrs[ak]?.isIcon ? (
        <EditorIcon name={attrs[ak].name} />
      ) : (
        attrs[ak]
      );
    });
    return {
      ...p,
      ...createEvents(events, { window }),
    };
  }, [attrs, events]);

  return (
    <>
      {container ? (
        <Common {...commomProps}>
          {children.length > 0 &&
            (children as IComponent[]).map((c, idx) => (
              <ViewerItem item={c} key={idx} />
            ))}
        </Common>
      ) : (
        <Common {...commomProps}>{children}</Common>
      )}
    </>
  );
};

export interface IProps {
  schema: ISchema;
}

export default function EditorViewer(props: IProps) {
  const { schema } = props;

  return (
    <>
      {schema.body.map((component, idx) => (
        <ViewerItem key={idx} item={component} />
      ))}
    </>
  );
}
