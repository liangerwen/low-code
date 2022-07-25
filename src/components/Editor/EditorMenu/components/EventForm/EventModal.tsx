import useLocale from "@/hooks/useLocale";
import { Layout, Menu, Modal } from "@arco-design/web-react";
import { useEffect, useRef, useState } from "react";
import menuData from "./data";
import EventFormContent from "./data/EventFormContent";
import MENUKEYS from "./data/keys";

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
  onOk?: (event: IEvent) => void;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
}) {
  const { t } = useLocale();
  const form = useRef<{ validate: () => Promise<boolean> }>(null);
  const [selectedKeys, setSelectedKeys] = useState<MENUKEYS[]>([
    MENUKEYS.OPEN_PAGE,
  ]);

  useEffect(() => {
    if (initialValues?.name) {
      setSelectedKeys([initialValues.name]);
    }
  }, [initialValues]);

  return (
    <Modal
      title={t("editor.icon.select")}
      style={{ width: 1200 }}
      simple={false}
      maskClosable={false}
      escToExit={false}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        console.log(form.current);
        if (form.current) {
          form.current.validate().then((vaild) => {
            if (vaild) {
              onOk?.({
                name: selectedKeys[0],
              });
            }
          });
        }
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
            {renderMenus(menuData)}
          </Menu>
        </Layout.Sider>
        <Layout.Content className="p-4">
          <EventFormContent name={selectedKeys[0]} ref={form} />
        </Layout.Content>
      </Layout>
    </Modal>
  );
}
