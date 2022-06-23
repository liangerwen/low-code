import Editor from "../components/Editor";
import "@arco-design/web-react/dist/css/arco.css";
import { useState } from "react";

export default () => {
  const [schema, setSchema] = useState<ISchema>([]);

  return (
    <Editor
      schema={schema}
      onChange={(schema) => {
        setSchema(schema);
      }}
    />
  );
};
