import { Layout, Message } from "@arco-design/web-react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { createContext, useState } from "react";
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from "react-beautiful-dnd";
import { findComponent, updateObject } from "../../utils";
import EditorContainer, { PAGE_FLAG } from "./EditorContainer";
import EditorMenu from "./EditorMenu";
import { MENU_TYPE } from "./EditorMenu/ComponentsTab";
import { getJsonByName } from "./EditorMenu/data";
import styles from "./styles/index.module.less";

interface IProps {
  schema: ISchema;
  onChange: (value: ISchema) => void;
}

interface IProvider {
  setActiveComponent: (component: null | IComponent) => void;
  activeComponent: null | IComponent;
  movingComponent: null | IComponent;
  position: { id: string; index: number };
}

export const LcEditorContext = createContext<IProvider>({
  setActiveComponent: () => {},
  activeComponent: null,
  movingComponent: null,
  position: { id: "-1", index: -1 },
});

export default (props: IProps) => {
  const [activeComponent, setActiveComponent] = useState<IComponent | null>(
    null
  );
  const [movingComponent, setMovingComponent] = useState<IComponent | null>(
    null
  );
  const [position, setPosition] = useState<{ id: string; index: number }>({
    id: "-1",
    index: -1,
  });

  const onDragEnd = (data: DropResult) => {
    console.log("onDragEnd", data);
    setMovingComponent(null);
    setPosition({ id: "-1", index: -1 });
    const {
      source: { droppableId: scoureId, index: scoureIndex },
      destination,
      draggableId,
    } = data;
    if (!destination) return;
    const { droppableId: targetId, index: targetIndex } = destination;
    if (targetId === draggableId) return;
    // const dragComponent = findComponent(
    //   props.schema,
    //   (c) => c.id === draggableId
    // );
    // const targetComponent = dragComponent
    //   ? findComponent(
    //       dragComponent?.children as ISchema,
    //       (c) => c.id === targetId
    //     )
    //   : null;
    // console.log(targetComponent);
    // if (targetComponent) return;
    if (!movingComponent) {
      Message.error(`发生意料之外的错误`);
      return;
    }
    // 新增组件
    let newSchema: ISchema;
    if (draggableId.startsWith(MENU_TYPE)) {
      newSchema = updateObject(props.schema, (schema) => {
        if (targetId === PAGE_FLAG) {
          schema.splice(targetIndex, 0, movingComponent);
        } else {
          const targetComponent = findComponent(
            schema,
            (c) => c.id === targetId
          );
          if (targetComponent) {
            if (targetComponent?.children) {
              targetComponent.children.splice(targetIndex, 0, movingComponent);
            } else {
              targetComponent.children = [movingComponent];
            }
          }
        }
      });
    } else {
      // 移动组件
      newSchema = updateObject(props.schema, (schema) => {
        if (scoureId === PAGE_FLAG) {
          schema.splice(scoureIndex, 1);
        } else {
          const sourceComponent = findComponent(
            schema,
            (c) => c.id === scoureId
          );
          if (sourceComponent?.children) {
            sourceComponent.children.splice(scoureIndex, 1);
          }
        }
        if (targetId === PAGE_FLAG) {
          schema.splice(targetIndex, 0, movingComponent);
        } else {
          const targetComponent = findComponent(
            schema,
            (c) => c.id === targetId
          );
          if (targetComponent) {
            if (targetComponent?.children) {
              targetComponent.children.splice(targetIndex, 0, movingComponent);
            } else {
              targetComponent.children = [movingComponent];
            }
          }
        }
      });
    }
    props.onChange(newSchema);
  };

  const onDragStart = (data: DragStart) => {
    const { draggableId } = data;
    if (draggableId.startsWith(MENU_TYPE)) {
      const regx = new RegExp(`^${MENU_TYPE}_(.+)$`);
      const name = draggableId.replace(regx, "$1");
      const json = getJsonByName(name);
      if (!json) {
        Message.error(`找不到名为 ${name} 的组件`);
        return;
      }
      setMovingComponent({ ...json, id: uuidv4() });
    } else {
      const changeComponent = findComponent(
        props.schema,
        (c) => c.id === draggableId
      );
      if (!changeComponent) {
        Message.error(`找不到id为 ${draggableId} 的组件`);
        return;
      }
      setMovingComponent(changeComponent);
    }
  };

  const onDragUpdate = (data: DragUpdate) => {
    const {
      destination,
      source: { droppableId: scoureId, index: scoureIndex },
    } = data;
    if (!destination) return;
    const { droppableId: targetId, index: targetIndex } = destination;
    setPosition({
      id: targetId,
      index:
        scoureId === targetId && targetIndex >= scoureIndex
          ? targetIndex + 1
          : targetIndex,
    });
  };

  return (
    <LcEditorContext.Provider
      value={{
        setActiveComponent: (component) => setActiveComponent(component),
        activeComponent,
        movingComponent,
        position,
      }}
    >
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
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
      </DragDropContext>
    </LcEditorContext.Provider>
  );
};
