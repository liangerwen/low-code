import { forwardRef } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { FormRefType } from "../../types";

const BackPageForm = forwardRef<FormRefType>(function () {
  return <EventContentWarp desc="返回上一个页面"></EventContentWarp>;
});

export default {
  name: MENUKEYS.BACK_PAGE,
  Form: BackPageForm,
};
