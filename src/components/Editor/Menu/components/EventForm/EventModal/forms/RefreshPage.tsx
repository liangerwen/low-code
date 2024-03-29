import { forwardRef } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { FormRefType } from "../../types";

const RefreshPageForm = forwardRef<FormRefType>(function () {
  return <EventContentWarp desc="刷新当前页面"></EventContentWarp>;
});

export default {
  name: MENUKEYS.REFRESH_PAGE,
  Form: RefreshPageForm,
};
