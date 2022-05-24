import { Layout } from "@arco-design/web-react";
import classNames from "classnames";
import EditorContainer from "./EditorContainer";
import EditorMenu from "./EditorMenu";
import styles from "./styles/index.module.less";

interface IProps {
  schema: ISchema;
  onChange: (value: ISchema) => void;
}

export default (props: IProps) => {
  return (
    <Layout className={classNames(styles["lc-layout"], "p-2")}>
      <Layout.Sider
        width={300}
        className={classNames(styles["lc-container"], "mr-2")}
      >
        <EditorMenu />
      </Layout.Sider>
      <Layout.Content className={styles["lc-container"]}>
        <EditorContainer />
      </Layout.Content>
    </Layout>
  );
};
