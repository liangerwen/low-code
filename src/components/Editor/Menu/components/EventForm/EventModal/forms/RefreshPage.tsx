import { forwardRef, useImperativeHandle } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";

const RefreshPageForm = forwardRef<{ validate: () => Promise<boolean> }>(
  function CustomForm(_, ref) {
    useImperativeHandle(ref, () => ({
      validate: () => Promise.resolve(true),
    }));
    return <EventContentWarp desc="刷新当前页面"></EventContentWarp>;
  }
);

export default {
  name: MENUKEYS.REFRESH_PAGE,
  Form: RefreshPageForm,
};
