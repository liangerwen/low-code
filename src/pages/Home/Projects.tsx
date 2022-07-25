import JsCodeEditor from "@/components/JsCodeEditor";
import { Button, Select } from "@arco-design/web-react";
import { useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { transform } from "@babel/standalone";

export default function Projects() {
  const ref = useRef<monaco.editor.IStandaloneCodeEditor>();

  const [lang, setLang] = useState<"javascript" | "typescript">("javascript");

  return (
    <>
      <Button
        onClick={() => {
          const markers = monaco.editor.getModelMarkers({});
          console.log(markers);
          if (markers.length === 0) {
            const value = ref.current?.getValue();
            const fnBody = transform(value, {
              filename: "customFn.ts",
              presets: ["env", "typescript"],
            }).code;
            const fn = new Function("exports", fnBody);
            const ret = {};
            fn(ret);
            console.log(fnBody);
            console.log(ret);
          }
        }}
      >
        错误
      </Button>
      <Select
        options={[
          { label: "js", value: "javascript" },
          { label: "ts", value: "typescript" },
        ]}
        onChange={(val) => setLang(val)}
      ></Select>
      <JsCodeEditor className="h-full" ref={ref} language={lang} defaultValue={`export default function() {\n\n}`} />;
    </>
  );
}
