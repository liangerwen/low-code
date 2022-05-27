import {
  Alert,
  Collapse,
  Space,
  Grid,
  Input,
  Trigger,
} from "@arco-design/web-react";
import { IconQuestionCircle } from "@arco-design/web-react/icon";
import chunk from "lodash/chunk";
import data, { getComponentByName, Menu } from "./data";
import styles from "./styles/component-tab.module.less";
import "./styles/component-tab.less";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import classNames from "classnames";

const { Row, Col } = Grid;

const iconProps = { style: { fontSize: 16 } };

const renderIcon = (name: string, props = iconProps) => {
  return <IconQuestionCircle {...props} />;
};

const renderDemo = (demo: (IComponent | string)[]) => {
  return demo.map((component, idx) => {
    if (typeof component === "string") return component;
    const Demo = getComponentByName(component.name);
    return (
      <Demo {...component.props} key={idx}>
        {component?.children?.length && renderDemo(component.children)}
      </Demo>
    );
  });
};

export const MENU_TYPE = "menu";

const renderItem = (col: Menu, isDragging = false) =>
  isDragging ? (
    <>{renderIcon(col.icon, { style: { fontSize: 20 } })}</>
  ) : (
    <Space className="flex justify-between" align="center">
      {renderIcon(col.icon)}
      {col.text}
      {/* @ts-ignore */}
      <Trigger
        position="top"
        popup={() => (
          <div className={styles["demo-basic"]}>
            <h4 className="text-center">{col.demo.title}</h4>
            <div>{renderDemo(col.demo.components)}</div>
          </div>
        )}
      >
        <IconQuestionCircle {...iconProps} />
      </Trigger>
    </Space>
  );

export default () => {
  const defaultActiveKeys = data.map((_item, idx) => String(idx));

  const [activeKeys, setActiveKeys] = useState(defaultActiveKeys);

  const onChange = (_key: string, activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };

  return (
    <Space direction="vertical" className="flex">
      <Input.Search placeholder="输入关键字过滤组件" />
      <Alert
        content={<span className="text-blue-500">请选择组件拖入容器中</span>}
        closable
      />
      <Collapse
        activeKey={activeKeys}
        defaultActiveKey={defaultActiveKeys}
        expandIconPosition="right"
        bordered={false}
        onChange={onChange}
      >
        {data.map((d, key) => (
          <Collapse.Item
            key={key}
            name={String(key)}
            header={d.type}
            className={styles["lc-menu-item"]}
          >
            <Space direction="vertical" className="flex">
              {chunk(d.menus, 2).map((row, rowIdx) => (
                <Droppable
                  droppableId={`${MENU_TYPE}_${key}_${rowIdx}`}
                  isDropDisabled
                  key={rowIdx}
                >
                  {(provide, snapshot) => (
                    <Row
                      key={rowIdx}
                      gutter={12}
                      ref={provide.innerRef}
                      {...provide.droppableProps}
                    >
                      {row.map((col, colIdx) => (
                        <Draggable
                          key={colIdx}
                          draggableId={`${MENU_TYPE}_${col.component.name}`}
                          index={colIdx}
                        >
                          {(p, s) => (
                            <Col span={12}>
                              <div
                                className={classNames(
                                  styles["lc-menu-item-btn"],
                                  { [styles["dragging"]]: s.isDragging }
                                )}
                                {...p.draggableProps}
                                {...p.dragHandleProps}
                                // 防止克隆时附近的元素发生transform
                                style={
                                  snapshot.draggingFromThisWith
                                    ? `${MENU_TYPE}_${col.component.name}` !==
                                      snapshot.draggingFromThisWith
                                      ? {
                                          ...p.draggableProps.style,
                                          transform: "none !important",
                                        }
                                      : p.draggableProps.style
                                    : {}
                                }
                                ref={p.innerRef}
                              >
                                {renderItem(col, s.isDragging)}
                              </div>
                              {/* 克隆元素 */}
                              {s.isDragging && (
                                <div className={styles["lc-menu-item-btn"]}>
                                  {renderItem(col)}
                                </div>
                              )}
                            </Col>
                          )}
                          {/* 防止克隆时会留有空白 所以不需要placeholder */}
                          {/* {provide.placeholder} */}
                        </Draggable>
                      ))}
                    </Row>
                  )}
                </Droppable>
              ))}
            </Space>
          </Collapse.Item>
        ))}
      </Collapse>
    </Space>
  );
};
