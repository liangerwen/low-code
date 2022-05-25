import {
  Alert,
  Collapse,
  Space,
  Grid,
  Input,
  Button,
  Trigger,
} from "@arco-design/web-react";
import { IconQuestionCircle } from "@arco-design/web-react/icon";
import { v4 as uuidv4 } from "uuid";
import chunk from "lodash/chunk";
import data, { getComponentByName } from "./data";
import styles from "./styles/component-tab.module.less";
import "./styles/component-tab.less";
import { useContext, useState } from "react";
import { LcEditorContext } from "..";

const { Row, Col } = Grid;

const iconStyle = { fontSize: 16 };

const renderIcon = (name: string) => {
  return <IconQuestionCircle style={iconStyle} />;
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

export default () => {
  const { setMoveComponent } = useContext(LcEditorContext);

  const onDragStart = (component: IComponent) => {
    setMoveComponent({ ...component, id: uuidv4() });
  };
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
                <Row key={rowIdx} gutter={12}>
                  {row.map((col, colIdx) => (
                    <Col span={12} key={colIdx}>
                      <Button
                        long
                        type="dashed"
                        draggable
                        onDragStart={() => onDragStart(col.component)}
                      >
                        <Space className="flex justify-between" align="center">
                          {renderIcon(col.icon)}
                          {col.text}
                          {/* @ts-ignore */}
                          <Trigger
                            position="top"
                            popup={() => (
                              <div className={styles["demo-basic"]}>
                                <h4 className="text-center">
                                  {col.demo.title}
                                </h4>
                                <div>{renderDemo(col.demo.components)}</div>
                              </div>
                            )}
                          >
                            <IconQuestionCircle style={iconStyle} />
                          </Trigger>
                        </Space>
                      </Button>
                    </Col>
                  ))}
                </Row>
              ))}
            </Space>
          </Collapse.Item>
        ))}
      </Collapse>
    </Space>
  );
};
