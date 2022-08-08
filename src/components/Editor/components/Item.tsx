import { Divider, Grid, Space } from "@arco-design/web-react";
import { IconDragDot } from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { isArray } from "lodash";
import {
  FC,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Direction, EditorContext } from "..";
import EditorIcon from "../Menu/components/EditorIcon";
import { getComponentByName } from "../Menu/ComponentsTab/data";
import { parseChildren, parseProps } from "../utils/parse";
import ErrorComp from "./ErrorComp";

import styles from "./styles/item.module.less";

const { Col } = Grid;

interface IProps {
  item: IComponent;
  index: number;
}

export function CommonItem({ item, disabled = false }) {
  const { id, name, props: p = {}, children } = item as IComponent;

  const props = parseProps(p, { window });

  const Comp = getComponentByName(name);
  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      <Comp
        {...props}
        className={classNames(props?.className, {
          "pointer-events-none select-none": disabled,
        })}
      >
        {isArray(children) && parseChildren(children)}
      </Comp>
    </ErrorBoundary>
  );
}

const ItemWarp = forwardRef<
  HTMLDivElement,
  {
    inline?: boolean;
    span: number;
    children?: ReactNode;
    [key: string]: any;
  }
>(
  (
    props = {
      inline: false,
      span: 24,
    },
    ref
  ) => {
    const { inline, span, children, ...resetProps } = props;
    return inline ? (
      <div ref={ref} {...resetProps}>
        {children}
      </div>
    ) : (
      <Col ref={ref} span={span} {...resetProps}>
        {children}
      </Col>
    );
  }
);

const Item = (props: IProps) => {
  const { item, index } = props;
  const { id, inline, container, name, props: p, children } = item;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id,
    data: item,
    attributes: { tabIndex: index },
  });
  const { setNodeRef: setDropRef } = useDroppable({
    id,
    data: item,
  });
  const Comp = getComponentByName(name);
  const { activeComponent, setActiveComponent, movingComponent, position } =
    useContext(EditorContext);

  const renderDivider = useCallback(() => {
    const isVertical = inline && movingComponent?.inline;
    return (
      <Divider
        className={classNames(
          styles["lc-item-driver"],
          isVertical
            ? styles["lc-item-driver__vertical"]
            : styles["lc-item-driver__horizontal"]
        )}
        style={
          isVertical
            ? {
                height: position!.height + 10,
              }
            : { width: position!.width }
        }
        type={isVertical ? "vertical" : "horizontal"}
      />
    );
  }, [position, inline]);

  const isActive = useMemo(
    () => activeComponent?.id === id,
    [activeComponent, id]
  );
  const isEnter = useMemo(
    () =>
      container &&
      position &&
      position.id === id &&
      position.direction === Direction.MIDDLE,
    [position]
  );

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      {position &&
        position.id === id &&
        position.direction === Direction.PREV &&
        renderDivider()}
      <ItemWarp
        {...attributes}
        className={classNames(styles["lc-item"], {
          [styles["lc-item__inline"]]: inline,
          [styles["lc-item__dragging"]]: isDragging,
          [styles["lc-item__hover"]]: !movingComponent,
          [styles["lc-item__active"]]: isActive,
          [styles["lc-item__enter"]]: isEnter,
        })}
        inline={inline}
        span={24}
        ref={setDragRef}
        onClick={(e: Event) => {
          e.stopPropagation();
          setActiveComponent(item);
        }}
      >
        {!movingComponent && (
          <div className={styles["lc-item-action"]}>
            <Space>
              <IconDragDot {...listeners} />
            </Space>
          </div>
        )}
        <div
          ref={setDropRef}
          className={classNames(styles["lc-item-content"], {
            [styles["lc-item-content__drop"]]: container,
          })}
        >
          {container ? (
            <>
              <Comp
                {...parseProps(p, { window })}
                className={classNames(
                  styles["lc-item-content-main"],
                  p?.className
                )}
              >
                {isArray(children) &&
                  (children as IComponent[]).map((c, idx) => (
                    <Item item={c} key={idx} index={idx} />
                  ))}
              </Comp>
              {position &&
                position.id === id &&
                position.direction === Direction.MIDDLE &&
                renderDivider()}
              <p className={styles["lc-item-content-tip"]}>拖动组件到此处</p>
            </>
          ) : (
            <CommonItem item={item} disabled={true} key={item.id} />
          )}
        </div>
      </ItemWarp>
      {position &&
        position.id === id &&
        position.direction === Direction.NEXT &&
        renderDivider()}
    </ErrorBoundary>
  );
};

export default Item;
