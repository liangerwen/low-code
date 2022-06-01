import { Layout } from "@arco-design/web-react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { createContext, useCallback, useState } from "react";
import EditorContainer, { PAGE_FLAG } from "./EditorContainer";
import EditorMenu from "./EditorMenu";
import styles from "./styles/index.module.less";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { isAdd } from "./EditorMenu/MenuItem";
import { isEqual } from "lodash";
import { updateObject } from "../../utils";
import { filterComponent, findComponent, getWarpper } from "./utils";

interface IProps {
  schema: ISchema;
  onChange: (value: ISchema) => void;
}

export enum Direction {
  PREV,
  MIDDLE,
  NEXT,
}

type PositionType = {
  id: string | number; // 当前位置的元素的id
  direction: Direction; // 是否为上一个元素 反之为下一个
  height: number; // 当前元素的高度
  width: number; // 当前元素的宽度
} | null;
interface IProvider {
  setActiveComponent: (component: null | IComponent) => void;
  activeComponent: null | IComponent;
  movingComponent: null | IComponent;
  position: PositionType;
}

export const LcEditorContext = createContext<IProvider>({
  setActiveComponent: () => {},
  activeComponent: null,
  movingComponent: null,
  position: null,
});

export default (props: IProps) => {
  const [activeComponent, setActiveComponent] = useState<IComponent | null>(
    null
  );
  const [movingComponent, setMovingComponent] = useState<IComponent | null>(
    null
  );
  const [position, setPosition] = useState<PositionType>(null);

  const [active, setActive] = useState<null | string>(null);

  const onDragStart = useCallback((e: DragStartEvent) => {
    const {
      active: { id },
    } = e;
    if (isAdd(id)) {
      setMovingComponent({
        ...(e.active.data.current as IComponent),
        id: uuidv4(),
      });
    } else {
      setMovingComponent(e.active.data.current as IComponent);
    }
    setActive(e.active.data.current?.name);
  }, []);

  const onDragMove = useCallback(
    (e: DragMoveEvent) => {
      const {
        activatorEvent,
        delta,
        over,
        active: { id: activeId },
      } = e;
      const { x, y } = activatorEvent as PointerEvent;
      // 当前坐标为原始坐标加上拖动的偏移量
      const currentX = x + delta.x,
        currentY = y + delta.y;
      if (over) {
        const {
          id: overId,
          rect: { top, left, height, width },
          data: { current },
        } = over;

        // 当前元素是目标元素的祖父
        const currentComponent = findComponent(
          props.schema,
          (c) => c?.id === activeId
        );
        if (
          currentComponent &&
          findComponent([currentComponent], (c) => c?.id === over?.id)
        ) {
          setPosition(null);
          return;
        }
        // 当前元素的中心位置
        const middleX = left + width / 2,
          middleY = top + height / 2;
        // 当前元素y坐标分为三份 为上中下
        const middleTop = top + height / 3,
          middleBottom = top + height * (2 / 3);
        let direction: Direction;
        if ((current as IComponent)?.inline && movingComponent?.inline) {
          // inline组件以x轴区分方向
          direction = middleX > currentX ? Direction.PREV : Direction.NEXT;
        } else if ((current as IComponent)?.container) {
          // container组件以y轴分为上中下分方向
          direction =
            currentY < middleTop
              ? Direction.PREV
              : currentY > middleBottom
              ? Direction.NEXT
              : Direction.MIDDLE;
        } else {
          // 其他组件以y轴分方向
          direction = middleY > currentY ? Direction.PREV : Direction.NEXT;
        }
        const currentPosition = {
          id: overId,
          direction,
          height,
          width,
        };
        if (!isEqual(currentPosition, position)) {
          setPosition(currentPosition);
        }
      } else {
        setPosition(null);
      }
    },
    [position]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const {
        active: { id },
      } = e;
      if (position && movingComponent) {
        let newSchema = props.schema;
        const targetId = position.id,
          targetDirection = position.direction;
        // 如果不是新增就先移除当前组件
        if (!isAdd(id)) {
          newSchema = filterComponent(newSchema, (c) => c?.id !== id);
        }
        // 根页面直接push
        if (targetId === PAGE_FLAG) {
          newSchema = [...newSchema, movingComponent];
        } else {
          newSchema = updateObject(newSchema, (schema) => {
            const targetComponent = findComponent(
              schema,
              (c) => c?.id === targetId
            );
            if (targetComponent) {
              // 目标组件是容器组件时就放置到此组件中
              if (targetDirection === Direction.MIDDLE) {
                targetComponent.children = [
                  ...(targetComponent.children || []),
                  movingComponent!,
                ];
              } else {
                // 找到目标组件的warpper组件并根据方向进行前插或后插
                const warpperInfo = getWarpper(schema, targetId);
                if (warpperInfo) {
                  const { warpper, index } = warpperInfo;
                  if (targetDirection === Direction.PREV) {
                    warpper.splice(index, 0, movingComponent);
                    // 放置到目标组件的后一个
                  } else if (targetDirection === Direction.NEXT) {
                    warpper.splice(index + 1, 0, movingComponent);
                  }
                }
              }
            }
          });
        }
        if (!isEqual(props.schema, newSchema)) {
          props.onChange(newSchema);
          if (isAdd(id)) {
            setActiveComponent(movingComponent);
          }
        }
      }
      setActive(null);
      setPosition(null);
      setMovingComponent(null);
    },
    [props.schema, position, movingComponent]
  );

  return (
    <LcEditorContext.Provider
      value={{
        setActiveComponent: (component) => setActiveComponent(component),
        activeComponent,
        movingComponent,
        position,
      }}
    >
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
      >
        <Layout className={classNames(styles["lc-layout"], "p-2")}>
          <Layout.Sider
            width={300}
            className={classNames(styles["lc-container"], "p-0 mr-2")}
          >
            <EditorMenu />
          </Layout.Sider>
          <Layout.Content className={styles["lc-container"]}>
            <EditorContainer
              schema={props.schema}
              onChange={(schema) => props.onChange(schema)}
            />
          </Layout.Content>
        </Layout>
        {createPortal(
          <DragOverlay>
            {active ? (
              <div
                className={classNames(styles["dragging-btn"], "cursor-move")}
              >
                {active}
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </LcEditorContext.Provider>
  );
};
