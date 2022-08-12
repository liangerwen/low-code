import Editor from "../components/Editor";
import { useEvent, useLocalStorage } from "react-use";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { LocalKeys } from "@/utils/storage";
import { useCallback, useEffect } from "react";
import { produce } from "@/utils";

const defaultSchema: ISchema = {
  name: "page",
  inMenu: true,
  body: [],
};

export default () => {
  const params = useParams();
  const navigate = useNavigate();
  const [schemas, setSchemas] = useLocalStorage<
    {
      id: string;
      name: string;
      schema: ISchema;
      date: number;
      publish: boolean;
    }[]
  >(LocalKeys.SCHEMA_KEY, []);

  const [schema, setSchema, clearSchema] = useLocalStorage<ISchema>(
    LocalKeys.CURRENT_SCHEMA_KEY,
    schemas.find((i) => i.id === params.id)?.schema || defaultSchema
  );

  useEffect(() => {
    return clearSchema;
  }, []);

  const onCloseBoswer = useCallback((e) => {
    e.preventDefault();
    e.returnValue = "离开后系统不会保存您所做的更改。";
  }, []);

  // useEvent("beforeunload", onCloseBoswer);
  return (
    <Editor
      onSave={(newSchema) => {
        if (params.id) {
          setSchemas(
            produce(schemas, (schemas) => {
              const schema = schemas.find((i) => i.id === params.id);
              if (schema) {
                schema.schema = newSchema;
                schema.date = Date.now();
              }
            })
          );
          navigate("/workspace/projects", { replace: true });
        } else {
          const name = window.prompt("项目名称");
          if (name) {
            setSchemas([
              ...schemas,
              {
                id: uuidv4(),
                name: name,
                schema: newSchema,
                date: Date.now(),
                publish: false,
              },
            ]);
            navigate("/workspace/projects", { replace: true });
          }
        }
      }}
      value={schema}
      onChange={setSchema}
      onPreview={(schema) => {
        const url = schema.inMenu ? `/preview-menu` : `/preview`;
        window.open(`${window.location.origin}/#${url}`);
      }}
    />
  );
};
