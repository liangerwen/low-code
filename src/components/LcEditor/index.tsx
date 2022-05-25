import { Layout } from "@arco-design/web-react";
import classNames from "classnames";
import { createContext, useState } from "react";
import EditorContainer from "./EditorContainer";
import EditorMenu from "./EditorMenu";
import styles from "./styles/index.module.less";

interface IProps {
  schema: ISchema;
  onChange: (value: ISchema) => void;
}

interface IProvider {
  setMoveComponent: (component: null | IComponent) => void;
  moveComponent: null | IComponent;
  setActiveComponent: (component: null | IComponent) => void;
  activeComponent: null | IComponent;
}

export const LcEditorContext = createContext<IProvider>({
  setMoveComponent: () => {},
  moveComponent: null,
  setActiveComponent: () => {},
  activeComponent: null,
});

export default (props: IProps) => {
  const [activeComponent, setActiveComponent] = useState<IComponent | null>(
    null
  );
  const [moveComponent, setMoveComponent] = useState<IComponent | null>(null);

  return (
    <LcEditorContext.Provider
      value={{
        setMoveComponent: (component) => setMoveComponent(component),
        moveComponent,
        setActiveComponent: (component) => setActiveComponent(component),
        activeComponent,
      }}
    >
      <Layout className={classNames(styles["lc-layout"], "p-2")}>
        <Layout.Sider
          width={300}
          className={classNames(styles["lc-container"], "mr-2")}
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
    </LcEditorContext.Provider>
  );
};
