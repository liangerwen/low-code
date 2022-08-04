import Editor from "@/components/Editor";
import { Redirect } from "@/Router";
import { LocalKeys } from "@/utils/storage";
import { Message } from "@arco-design/web-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";

export default function Preview() {
  const params = useParams();

  if (!params.id) {
    Message.error("未找到此ID的项目");
    return <Redirect to="/" />;
  }

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
    () => schemas.find((i) => i.id === params.id)?.schema,
    [params.id, schemas]
  );

  return <Editor.Viewer schema={schema} />;
}
