import { Space, Trigger } from "@arco-design/web-react";
import { IconQuestionCircle } from "@arco-design/web-react/icon";
import { useDraggable } from "@dnd-kit/core";
import classNames from "classnames";
import { v1 as uuidv1 } from "uuid";
import { renderCommonComponents } from "../Item";
import { getComponentByName, Menu } from "./data";
import styles from "./styles/menu-item.module.less";

const MENUTYPE = "MENU_ITEM";

export const isAdd = (id: string | number) => String(id).startsWith(MENUTYPE);

export default (props: Menu) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${MENUTYPE}_${uuidv1()}`,
    data: props.component,
  });
  const Icon = getComponentByName(props.icon);

  return (
    <Space
      className={classNames(
        styles["lc-menu-item-btn"],
        "cursor-pointer flex justify-between text-sm",
        {
          "opacity-80": isDragging,
        }
      )}
      align="center"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <Icon />
      {props.text}
      {/* @ts-ignore */}
      <Trigger
        position="top"
        popup={() => (
          <div className={styles["demo-basic"]}>
            <h4 className="text-center">{props.demo.title}</h4>
            <div>{renderCommonComponents(props.demo.components)}</div>
          </div>
        )}
      >
        <IconQuestionCircle style={{ fontSize: 16 }} />
      </Trigger>
    </Space>
  );
};
