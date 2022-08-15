import { produce } from "@/utils";
import { Empty, Space, Tooltip, Tree } from "@arco-design/web-react";
import { IconCopy, IconDelete, IconPaste } from "@arco-design/web-react/icon";
import { isEmpty } from "lodash";
import { useCallback, useContext, useMemo } from "react";
import { EditorContext } from "../..";
import { findComponent, findWarpper } from "../../utils";
import { getIconByName } from "../ComponentsTab/data";

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export default function PageNodeTree(props: IProps) {
  const { onDelete, onCopy, onPaste, setActiveComponent, activeComponent } =
    useContext(EditorContext);
  const createTreeData = useCallback((treeNodes: IComponent[]) => {
    return treeNodes.map((t) => {
      const Icon = getIconByName(t.name);
      const icons =
        t.container && !isEmpty(t.children)
          ? {}
          : { switcherIcon: <Icon style={{ fontSize: 12 }} /> };
      return {
        key: t.id,
        title: t.title,
        icons,
        children: t.container
          ? createTreeData((t.children as IComponent[]) || [])
          : [],
      };
    });
  }, []);

  const treeData = useMemo(
    () => createTreeData(props.schema.body),
    [props.schema.body]
  );
  const actions = useMemo(
    () => [
      {
        element: IconDelete,
        tip: "删除",
        onClick: onDelete,
        color: "rgb(var(--danger-6))",
      },
      {
        element: IconPaste,
        tip: "粘贴",
        onClick: (id) => {
          onPaste(findComponent(props.schema.body, (c) => c.id === id));
        },
        color: "rgb(var(--primary-5))",
      },
      {
        element: IconCopy,
        tip: "复制",
        onClick: (id) => {
          onCopy(findComponent(props.schema.body, (c) => c.id === id));
        },
        color: "rgb(var(--primary-5))",
      },
    ],
    [onDelete, onPaste, onCopy]
  );
  return (
    <>
      {isEmpty(treeData) ? (
        <Empty className="h-full flex items-center" />
      ) : (
        <Tree
          blockNode
          showLine
          draggable
          treeData={treeData}
          icons={{ dragIcon: null }}
          selectedKeys={activeComponent ? [activeComponent.id] : []}
          renderExtra={(node) => {
            return actions.map((a, idx) => {
              const Icon = a.element;
              return (
                <Tooltip content={a.tip}>
                  <Icon
                    style={{
                      position: "absolute",
                      right: 8 + 16 * idx,
                      fontSize: 14,
                      top: 10,
                      color: a.color,
                    }}
                    onClick={() => a.onClick(node._key)}
                  />
                </Tooltip>
              );
            });
          }}
          onSelect={(selectKeys) => {
            const activeId = selectKeys[0];
            setActiveComponent(
              findComponent(props.schema.body, (c) => c.id === activeId)
            );
          }}
          allowDrop={({ dropNode, dropPosition }) => {
            const { key: dropId } = dropNode;
            const dropComponent = findComponent(
              props.schema.body,
              (c) => c.id === dropId
            );
            return dropComponent?.container ? true : dropPosition !== 0;
          }}
          onDrop={({ dragNode, dropNode, dropPosition }) => {
            const { key: dragId } = dragNode,
              { key: dropId } = dropNode;
            const newSchema = produce(props.schema, (schema) => {
              const body = schema.body;
              const dragComponent = findComponent(body, (c) => c.id === dragId);
              const { warpper: dragComponentWarpper, index: dragWarpperIdx } =
                findWarpper(body, dragId);
              dragComponentWarpper.splice(dragWarpperIdx, 1);
              if (dropPosition === 0) {
                const dropComponent = findComponent(
                  body,
                  (c) => c.id === dropId
                );
                dropComponent.children = [
                  ...(dropComponent.children || []),
                  dragComponent,
                ];
              } else {
                const { warpper: dropComponentWarpper, index: dropWarpperIdx } =
                  findWarpper(body, dropId);
                dropComponentWarpper.splice(
                  dropPosition === -1 ? dropWarpperIdx : dropWarpperIdx + 1,
                  0,
                  dragComponent
                );
              }
            });
            props.onChange(newSchema);
          }}
        />
      )}
    </>
  );
}
