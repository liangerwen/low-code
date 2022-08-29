import { Layout, Menu, Message, Modal } from "@arco-design/web-react";
import { useEffect, useRef, useState } from "react";
import { generate as uuid } from "shortid";
import EventFormContent from "./EventFormContent";
import MENUKEYS from "../keys";
import menus from "../menus";
import { FormRefType } from "../types";

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const renderMenus = (menus) =>
  menus.map((m) =>
    m.children && m.children.length > 0 ? (
      <SubMenu key={m.key} title={m.title}>
        {renderMenus(m.children)}
      </SubMenu>
    ) : (
      <MenuItem key={m.key}>{m.title}</MenuItem>
    )
  );

export default function EventModal({
  visible,
  onOk,
  onCancel,
  initialValues,
}: {
  visible: boolean;
  onOk?: (event: ActionType) => void;
  onCancel?: () => void;
  initialValues?: ActionType;
}) {
  const form = useRef<FormRefType>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([
    MENUKEYS.OPEN_PAGE,
  ]);

  useEffect(() => {
    if (initialValues?.name) {
      setSelectedKeys([initialValues.name]);
    }
  }, [initialValues]);

  return (
    <Modal
      title="选择事件"
      style={{ width: 1050 }}
      simple={false}
      maskClosable={false}
      escToExit={false}
      visible={visible}
      mountOnEnter={false}
      onCancel={onCancel}
      onOk={() => {
        if (selectedKeys.length === 0) {
          Message.error("请选择事件");
          return;
        }
        if (!form.current) {
          onOk?.({
            id: uuid(),
            name: selectedKeys[0],
          });
        }
        form.current
          .validate()
          .then((value) => {
            onOk?.({
              id: uuid(),
              name: selectedKeys[0],
              form: value,
            });
          })
          .catch((error) => {
            console.warn(error);
          });
      }}
    >
      <Layout className="h-[420px] rounded border-[rgb(var(--gray-3))] border-1 overflow-hidden">
        <Layout.Sider className="important-shadow-none box-border border-r-1 border-[rgb(var(--gray-3))]">
          <Menu
            accordion
            selectedKeys={selectedKeys}
            defaultOpenKeys={["page"]}
            onClickMenuItem={(key) => {
              setSelectedKeys([key as MENUKEYS]);
            }}
          >
            {renderMenus(menus)}
          </Menu>
        </Layout.Sider>
        <Layout.Content className="p-4">
          <EventFormContent
            name={selectedKeys[0] as MENUKEYS}
            ref={form}
            value={initialValues?.form}
          />
        </Layout.Content>
      </Layout>
    </Modal>
  );
}
