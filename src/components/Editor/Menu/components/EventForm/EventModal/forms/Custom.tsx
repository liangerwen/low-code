import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as monaco from "monaco-editor";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { CustomFormType, FormPropsType, FormRefType } from "../../types";
import useMode, {
  getElementMode,
} from "@/components/Settings/ModeSetting/useMode";
import { ModeType } from "@/components/Settings";
import { isEmpty } from "lodash";

const CustomForm = forwardRef<FormRefType, FormPropsType<CustomFormType>>(
  function ({ value = { content: "" } }, ref) {
    const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    const container = useRef<HTMLDivElement>(null);

    const { mode: ThemeMode } = useMode();
    const realMode = useMemo(() => getElementMode(), [ThemeMode]);

    useImperativeHandle(ref, () => ({
      validate: () => {
        return new Promise((resolve, reject) => {
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

    useEffect(() => {
      instance.current = monaco.editor.create(container.current, {
        value: value.content,
        language: "javascript",
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        autoDetectHighContrast: false,
        wordWrap: "wordWrapColumn",
      });
      const completionItemProvider =
        monaco.languages.registerCompletionItemProvider("javascript", {
          provideCompletionItems(model, position) {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            };
            return {
              suggestions: [
                {
                  label: "doAction",
                  insertText: `doAction({ name: "message", form: { content: "" } });`,
                  documentation: `(method) doAction(): void;\n执行动作，包括消息提醒、路由跳转、操作组件等`,
                  kind: monaco.languages.CompletionItemKind.Function,
                  range,
                },
                {
                  label: "pageData",
                  insertText: `pageData`,
                  documentation: `var targetEvent;\n页面全局变量`,
                  kind: monaco.languages.CompletionItemKind.Function,
                  range,
                },
                {
                  label: "targetEvent",
                  insertText: `targetEvent`,
                  documentation: `var targetEvent;\n当前事件Event对象`,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  range,
                },
              ],
            };
          },
          triggerCharacters: ["d", "p", "t"],
        });
      const documentFormattingEditProvider =
        monaco.languages.registerDocumentFormattingEditProvider("javascript", {
          async provideDocumentFormattingEdits(model) {
            const prettier = await import("prettier/standalone");
            const babel = await import("prettier/parser-babel");
            const text = prettier.format(model.getValue(), {
              parser: "babel",
              plugins: [babel],
              singleQuote: true,
              tabWidth: 2,
            });
            return [
              {
                range: model.getFullModelRange(),
                text,
              },
            ];
          },
        });
      return () => {
        completionItemProvider.dispose();
        documentFormattingEditProvider.dispose();
        instance.current && instance.current.dispose();
      };
    }, []);

    useEffect(() => {
      monaco.editor.setTheme(realMode === ModeType.DARK ? "vs-dark" : "vs");
    }, [realMode]);

    return (
      <EventContentWarp
        desc={
          <>
            通过JavaScript自定义动作逻辑
            <br />
            自定义JS使用说明：
            <br />
            1.动作执行函数doAction，可以执行所有类型的动作
            <br />
            2.页面变量pageData
            <br />
            3.事件对象targetEvent，在doAction之后执行event.stopPropagation =
            true;可以阻止后续动作执行
          </>
        }
      >
        <div
          className="h-300px border-[rgb(var(--gray-3))] border-1"
          ref={container}
        />
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.CUSTOM,
  Form: CustomForm,
};
