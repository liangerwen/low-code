import { Alert, Collapse, Space, Grid, Input } from "@arco-design/web-react";
import chunk from "lodash/chunk";
import { useMemo, useState } from "react";
import MenuItem from "./MenuItem";
import data from "./data";
import styles from "./styles/component-tab.module.less";
import "./styles/component-tab.less";

const { Row, Col } = Grid;

export const MENU_TYPE = "menu";

export default () => {
  const defaultActiveKeys = data.map((_item, idx) => String(idx));

  const [keyWords, setKeyWords] = useState("");

  const menuData = useMemo(() => {
    if (!keyWords) return data;
    return data
      .map((item) => ({
        ...item,
        menus: item.menus.filter(
          (menu) =>
            menu.name.includes(keyWords) ||
            menu.defaultSchema?.title?.includes(keyWords) ||
            keyWords.includes(menu.name) ||
            keyWords.includes(menu.defaultSchema?.title || "")
        ),
      }))
      .filter((item) => item.menus.length);
  }, [keyWords]);

  const [activeKeys, setActiveKeys] = useState(defaultActiveKeys);

  const onChange = (_key: string, activeKeys: string[]) => {
    setActiveKeys(activeKeys);
  };

  return (
    <Space direction="vertical" className="flex">
      <Input.Search
        placeholder="输入关键字过滤组件"
        value={keyWords}
        onChange={(value) => setKeyWords(value)}
      />
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
        {menuData.map((d, key) => (
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
                      <MenuItem {...col} />
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
