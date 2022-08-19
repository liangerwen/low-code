import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from "react";
import EventContentWarp from "./EventContentWarp";
import MENUKEYS from "../keys";
import { FormPropsType, FormRefType } from "../types";

const fileForms = import.meta.globEager<
  Module<{
    Form: ForwardRefExoticComponent<RefAttributes<FormRefType>>;
    name: MENUKEYS;
  }>
>("./forms/*.ts(x)?");
const folderForms = import.meta.globEager<
  Module<{
    Form: ForwardRefExoticComponent<RefAttributes<FormRefType>>;
    name: MENUKEYS;
  }>
>("./forms/**/index.ts(x)?");

const forms = Object.values({ ...fileForms, ...folderForms })
  .filter((m) => m.default)
  .map((m) => m.default)
  .reduce<
    Record<MENUKEYS, ForwardRefExoticComponent<RefAttributes<FormRefType>>>
  >((forms, form) => {
    forms[form.name] = form.Form;
    return forms;
  }, {} as Record<MENUKEYS, ForwardRefExoticComponent<RefAttributes<FormRefType>>>);

const DefaultForm = forwardRef<FormRefType>(function (_, ref) {
  useImperativeHandle(ref, () => ({
    validate: () => Promise.resolve(true),
  }));
  return <EventContentWarp desc="暂未找到事件配置"></EventContentWarp>;
});

export default forwardRef<FormRefType, { name: MENUKEYS } & FormPropsType>(
  function EventFormContent({ name, ...rest }, ref) {
    const Form = forms[name];
    if (!Form) return <DefaultForm ref={ref} />;
    return <Form ref={ref} {...rest} />;
  }
);
