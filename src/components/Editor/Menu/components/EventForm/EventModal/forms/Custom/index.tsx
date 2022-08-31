import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import * as monaco from "monaco-editor";
import useMode, {
  getElementMode,
} from "@/components/Settings/ModeSetting/useMode";
import { ModeType } from "@/components/Settings";
import { isEmpty } from "lodash";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/duotone-dark";
import light from "react-syntax-highlighter/dist/esm/styles/prism/duotone-light";
import { Switch } from "@arco-design/web-react";
import { CustomFormType, FormPropsType, FormRefType } from "../../../types";
import EventContentWarp from "../../EventContentWarp";
import MENUKEYS from "../../../keys";
import CodeEditor from "@/components/CodeEditor";

const baseType = import.meta.globEager<string>("./base.d.ts", { as: "raw" })[
  "./base.d.ts"
];
const globalType = import.meta.globEager<string>("./global.d.ts", {
  as: "raw",
})["./global.d.ts"];

const CustomForm = forwardRef<FormRefType, FormPropsType<CustomFormType>>(
  function ({ value = { content: "" } }, ref) {
    const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    const [visible, setVisible] = useState(true);

    const { mode: ThemeMode } = useMode();
    const realMode = useMemo(() => getElementMode(), [ThemeMode]);

    useImperativeHandle(ref, () => ({
      validate: () => {
        return new Promise((resolve, reject) => {
          instance.current.getAction("editor.action.formatDocument").run();
          const makers = monaco.editor.getModelMarkers({});
          if (isEmpty(makers)) {
            resolve({ content: instance.current?.getValue() });
          } else {
            reject(makers);
          }
        });
      },
    }));

    useEffect(() => {
      if (instance.current) {
        instance.current.setValue(value.content);
      }
    }, [value.content]);

    return (
      <EventContentWarp
        desc={
          <>
            通过JavaScript自定义动作逻辑
            <br />
            是否显示类型：
            <Switch
              size="small"
              checked={visible}
              onChange={(v) => setVisible(v)}
            />
            <br />
            {visible && (
              <SyntaxHighlighter
                language="typescript"
                style={realMode === ModeType.LGIHT ? light : dark}
                wrapLines={true}
                className="codeview"
              >
                {`/** =======全局对象current, page, utils类型======= **/\n\n${globalType}`}
              </SyntaxHighlighter>
            )}
          </>
        }
      >
        <CodeEditor
          ref={instance}
          initialValue={value.content}
          language="typescript"
          extraLib={[
            { filename: "lowcode.d.ts", content: baseType + globalType },
          ]}
        />
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.CUSTOM,
  Form: CustomForm,
};
