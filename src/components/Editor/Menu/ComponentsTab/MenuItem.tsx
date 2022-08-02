import { Space, Trigger, Typography } from "@arco-design/web-react";
import { IconQuestionCircle } from "@arco-design/web-react/icon";
import { useDraggable } from "@dnd-kit/core";
import classNames from "classnames";
import { useHover } from "react-use";
import { v1 as uuidv1 } from "uuid";
import { renderCommonComponents } from "../../components/Item";
import { Menu } from "./data";
import styles from "./styles/menu-item.module.less";

const MENUTYPE = "MENU_ITEM";

export const isAdd = (id: string | number) => String(id).startsWith(MENUTYPE);

export default (props: Menu) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${MENUTYPE}_${uuidv1()}`,
    data: props.defaultSchema,
  });
  const [hoverElement, isHovering] = useHover((isHovering) => (
    <IconQuestionCircle
      style={{ fontSize: 16 }}
      className={classNames({ "color-[rgb(var(--primary-6))]": isHovering })}
    />
  ));
  const Icon = props.icon;

  return (
    /* @ts-ignore */
    <Trigger
      position="right"
      popupVisible={isHovering}
      showArrow
      popup={() => (
        <div className={styles["demo-warpper"]}>
          <Typography.Title heading={6}>
            {props.defaultSchema.title}
          </Typography.Title>
          {renderCommonComponents(props.demo)}
        </div>
      )}
    >
      <Space
        className={classNames(styles["lc-menu-item-btn"], {
          [styles["lc-menu-item-btn__dragging"]]: isDragging,
        })}
        align="center"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <Icon style={{ fontSize: 16 }} />
        {props.defaultSchema.title}
        {hoverElement}
      </Space>
    </Trigger>
  );
};
