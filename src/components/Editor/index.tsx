import { Layout, Message } from "@arco-design/web-react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { createContext, useCallback, useRef, useState } from "react";
import EditorContainer, { PAGE_FLAG } from "./Container";
import EditorMenu from "./Menu";
import styles from "./styles/index.module.less";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { cloneDeep, isEqual, isPlainObject } from "lodash";
import { copy, deepProduce, produce } from "@/utils";
import { filterComponent, findComponent, findWarpper } from "./utils";
import { isAdd } from "./Menu/ComponentsTab/MenuItem";
import Viewer from "./Viewer";
import { useSettings } from "../Settings";

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
  onCopy: (component: null | IComponent) => void;
  onPaste: (component: null | IComponent) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onForward: () => void;
  onBack: () => void;
  onSave: () => void;
  onPreview: () => void;
  globalData: Record<string, any>;
}

export const EditorContext = createContext<IProvider>({
  setActiveComponent: () => {},
  activeComponent: null,
  movingComponent: null,
  position: null,
  onCopy: () => {},
  onPaste: () => {},
  onDelete: () => {},
  onClear: () => {},
  onForward: () => {},
  onBack: () => {},
  onSave: () => {},
  onPreview: () => {},
  globalData: {},
});

interface IProps {
  value: ISchema;
  onChange: (schema: ISchema) => void;
  onSave: (schema: ISchema) => void;
  onPreview: (schema: ISchema) => void;
}

const Editor = (props: IProps) => {
  const { value, onChange, onSave, onPreview } = props;
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
    setActive(e.active.data.current?.title);
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
          value.body,
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
        const edgeHeight = height / 4 > 15 ? 15 : height / 4;
        // 当前元素y坐标分为上中下 上1/4 中1/2 下1/4
        const middleTop = top + edgeHeight,
          middleBottom = top + height - edgeHeight;
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
    [position, value, movingComponent]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const {
        active: { id },
      } = e;
      if (position && movingComponent) {
        let newBody = value.body;
        const targetId = position.id,
          targetDirection = position.direction;
        // 如果不是新增就先移除当前组件
        if (!isAdd(id)) {
          newBody = filterComponent(newBody, (c) => c?.id !== id);
        }
        // 根页面直接push
        if (targetId === PAGE_FLAG) {
          newBody = [...newBody, movingComponent];
        } else {
          newBody = produce(newBody, (schema) => {
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
                const warpperInfo = findWarpper(schema, targetId);
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
        if (!isEqual(value, newBody)) {
          const newSchema = { ...value, body: newBody };
          onChange(newSchema);
          historyRef.current.unshift(newSchema);
          if (historyRef.current.length > 30) {
            historyRef.current.pop();
          }
          if (isAdd(id)) {
            setActiveComponent(movingComponent);
          }
        }
      }
      setActive(null);
      setPosition(null);
      setMovingComponent(null);
    },
    [value, position, movingComponent]
  );

  const historyRef = useRef<ISchema[]>([value]);
  const forwardRef = useRef<ISchema[]>([]);
  const MAXLEN = 30;
  const stackPush = (stack, val) => {
    stack.unshift(val);
    if (stack.length > MAXLEN) {
      stack.pop();
    }
  };

  const copyRef = useRef<IComponent>(null);

  const onCopy = (component: IComponent) => {
    copyRef.current = cloneDeep(component);
    copy(
      JSON.stringify(
        deepProduce(component, (value) => {
          if (isPlainObject(value) && value?.id) {
            delete value.id;
          }
        })
      )
    );
    Message.success("复制成功！");
  };

  const onPaste = (item: IComponent) => {
    if (!copyRef.current) {
      Message.error("请先复制组件！");
      return;
    }
    const parseComponent = deepProduce(copyRef.current, (value) => {
      if (isPlainObject(value) && value?.id) {
        value.id = uuidv4();
      }
    });
    if (!item) {
      const newSchema = {
        ...value,
        body: [...value.body, parseComponent],
      };
      onChange(newSchema);
      stackPush(historyRef.current, newSchema);
    } else {
      const newSchema = produce(value, (schema) => {
        const active = findComponent(
          schema.body,
          (component) => component.id === item.id
        );
        if (active.container) {
          active.children = [...(active.children || []), parseComponent];
        } else {
          const { warpper, index } = findWarpper(schema.body, active.id);
          if (warpper) {
            warpper.splice(index + 1, 0, parseComponent);
          }
        }
      });
      stackPush(historyRef.current, newSchema);
      onChange(newSchema);
    }
  };

  const onClear = () => {
    setActiveComponent(null);
    const newSchema = { ...value, body: [] };
    onChange(newSchema);
    stackPush(historyRef.current, newSchema);
  };

  const onDelete = (id: string) => {
    id === activeComponent?.id && setActiveComponent(null);
    const newSchema = {
      ...value,
      body: filterComponent(value.body, (c) => c.id !== id),
    };
    onChange(newSchema);
    stackPush(historyRef.current, newSchema);
  };

  const onForward = () => {
    const forwardSchema = forwardRef.current.shift();
    if (!forwardSchema) {
      Message.warning("无可恢复的内容");
      return;
    }
    setActiveComponent(null);
    stackPush(historyRef.current, forwardSchema);
    onChange(forwardSchema);
  };

  const onBack = () => {
    if (historyRef.current.length <= 1) {
      Message.warning("无可撤销的内容");
      return;
    }
    setActiveComponent(null);
    stackPush(forwardRef.current, historyRef.current.shift());
    onChange(historyRef.current[0]);
  };

  const { pageSetting } = useSettings();

  return (
    <EditorContext.Provider
      value={{
        setActiveComponent,
        activeComponent,
        movingComponent,
        position,
        onCopy,
        onPaste,
        onDelete,
        onClear,
        onSave: () => onSave(value),
        onPreview: () => onPreview(value),
        onForward,
        onBack,
        globalData: value.data || {},
      }}
    >
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
      >
        <Layout className={styles["lc-layout"]}>
          {pageSetting.menu && (
            <Layout.Sider
              width={pageSetting.menuWidth}
              className={classNames(
                styles["lc-container"],
                "p-0 important-mr-2"
              )}
            >
              <EditorMenu schema={value} onChange={onChange} />
            </Layout.Sider>
          )}
          <Layout.Content className={styles["lc-container"]}>
            <EditorContainer schema={value} onChange={onChange} />
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
    </EditorContext.Provider>
  );
};

Editor.Viewer = Viewer;

export default Editor;
