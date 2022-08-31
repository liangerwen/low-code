import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import useMode, {
  getElementMode,
} from "@/components/Settings/ModeSetting/useMode";
import { ModeType } from "@/components/Settings";
import * as monaco from "monaco-editor";

interface IProps {
  initialValue?: string;
  language?: "javascript" | "typescript" | "json" | "css" | "less" | "scss";
  extraLib?: {
    filename: string;
    content: string;
  }[];
}

const CodeEditor = forwardRef<monaco.editor.IStandaloneCodeEditor, IProps>(
  function ({ initialValue = "", language = "javascript", extraLib }, ref) {
    const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    const container = useRef<HTMLDivElement>(null);

    const { mode: ThemeMode } = useMode();
    const realMode = useMemo(() => getElementMode(), [ThemeMode]);

    useImperativeHandle(ref, () => instance.current);

    useEffect(() => {
      instance.current && instance.current.setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      instance.current = monaco.editor.create(container.current, {
        value: initialValue,
        language,
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
        wordWrap: "wordWrapColumn",
      });
      const globalExtraLib: monaco.IDisposable[] = [];
      const isStyle = ["css", "less", "scss"].includes(language),
        isJs = language === "javascript",
        isTs = language === "typescript";
      if (isTs) {
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSuggestionDiagnostics: true,
          onlyVisible: true,
        });
      }
      if (extraLib && (isTs || isJs)) {
        extraLib.forEach((i) => {
          globalExtraLib.push(
            monaco.languages.typescript[language + "Defaults"].addExtraLib(
              i.content,
              i.filename
            )
          );
        });
      }
      let documentFormattingEditProvider;
      if (isJs || isTs || isStyle) {
        documentFormattingEditProvider =
          monaco.languages.registerDocumentFormattingEditProvider(language, {
            async provideDocumentFormattingEdits(model) {
              const prettier = await import("prettier/standalone");
              let plugin,
                parserName: string = language;
              if (isJs || isTs) {
                plugin = await import("prettier/parser-babel");
                parserName = "babel";
              } else if (isStyle) {
                plugin = await import("prettier/parser-postcss");
              }
              const text = prettier.format(model.getValue(), {
                parser: parserName,
                plugins: [plugin],
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
      }
      return () => {
        globalExtraLib.forEach((i) => i.dispose());
        documentFormattingEditProvider?.dispose();
        instance.current.dispose();
      };
    }, [language]);

    useEffect(() => {
      monaco.editor.setTheme(realMode === ModeType.DARK ? "vs-dark" : "vs");
    }, [realMode]);

    return (
      <div
        className="h-350px border-[rgb(var(--gray-3))] border-1"
        ref={container}
      />
    );
  }
);

export default CodeEditor;
