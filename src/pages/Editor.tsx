import LcEditor from "../components/LcEditor";
import "@arco-design/web-react/dist/css/arco.css";
import { useState } from "react";

export default () => {
  const [schema, setSchema] = useState<ISchema>([]);

  return (
    <LcEditor
      schema={schema}
      onChange={(schema) => {
        setSchema(schema);
      }}
    />
  );
};
