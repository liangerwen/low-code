import Editor from "@/components/Editor";
import { getLocal, LocalKeys } from "@/utils/storage";
import { Message } from "@arco-design/web-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";

export default function Preview() {
  const params = useParams();
  const navigate = useNavigate();

  const [schemas] = useLocalStorage<
    {
      id: string;
      name: string;
      schema: ISchema;
      date: number;
      publish: boolean;
    }[]
  >(LocalKeys.SCHEMA_KEY, []);

  const schema = useMemo(
    () =>
      params.id
        ? schemas.find((i) => i.id === params.id)?.schema
        : getLocal<ISchema>(LocalKeys.CURRENT_SCHEMA_KEY),
    [params.id, schemas]
  );

  useEffect(() => {
    if (!schema) {
      Message.error("没有预览配置");
      navigate("/", { replace: true });
    }
  }, [schema]);

  return schema && <Editor.Viewer schema={schema} />;
}
