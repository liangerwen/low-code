import { Layout } from "@arco-design/web-react";
import LcEditor from "./components/LcEditor";
import LcToolBar from "./components/LcToolBar";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import styles from "./App.module.less";
import "@arco-design/web-react/dist/css/arco.css";
import { useState } from "react";

export default () => {
  const [schema, setSchema] = useState<ISchema>([
    {
      id: uuidv4(),
      name: "a-row",
      container: true,
      children: [
        {
          id: uuidv4(),

          name: "a-button",
          props: {
            type: "primary",
          },
          children: ["按钮"],
          inline: true,
        },
      ],
    },
  ]);

  return (
    <Layout className={classNames(styles["lc-body"], "overflow-hidden")}>
      <Layout.Header className="bg-white h-14 box-border p-2 border-gray-200 border-b">
        <LcToolBar />
      </Layout.Header>
      <LcEditor
        schema={schema}
        onChange={(schema) => {
          setSchema(schema);
        }}
      />
    </Layout>
  );
};
