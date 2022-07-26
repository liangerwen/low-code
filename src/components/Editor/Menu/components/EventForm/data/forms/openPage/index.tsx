import { forwardRef, useImperativeHandle } from "react";
import EventContentWarp from "../../EventContentWarp";
import MENUKEYS from "../../keys";

const CustomForm = forwardRef<{ validate: () => Promise<boolean> }>(
  function CustomForm(_, ref) {
    useImperativeHandle(ref, () => ({
      validate: () => Promise.resolve(true),
    }));
    return (
      <EventContentWarp desc="通过JavaScript自定义动作逻辑"></EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.OPEN_PAGE,
  Form: CustomForm,
};
