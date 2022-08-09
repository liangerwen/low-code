import JsCodeEditor from "@/components/JsCodeEditor";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";

const CustomForm = forwardRef<{ validate: () => Promise<boolean> }>(
  function CustomForm(_, ref) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    useImperativeHandle(ref, () => ({
      validate: () => Promise.resolve(true),
    }));
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
            2.通过上下文对象context可以获取当前组件实例，例如context.props可以获取该组件相关属性
            <br />
            3.事件对象event，在doAction之后执行event.stopPropagation =
            true;可以阻止后续动作执行
          </>
        }
      >
        <JsCodeEditor
          className="h-300px border-[rgb(var(--gray-3))] border-1"
          ref={editorRef}
          defaultValue={`export default function() {\n\n}`}
        />
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.CUSTOM,
  Form: CustomForm,
};
