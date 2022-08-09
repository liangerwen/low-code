import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from "react";
import EventContentWarp from "./EventContentWarp";
import MENUKEYS from "./keys";

const fileForms = import.meta.globEager<
  Module<{
    Form: ForwardRefExoticComponent<
      RefAttributes<{
        validate: () => Promise<boolean>;
      }>
    >;
    name: MENUKEYS;
  }>
>("./forms/*.ts(x)?");
const folderForms = import.meta.globEager<
  Module<{
    Form: ForwardRefExoticComponent<
      RefAttributes<{
        validate: () => Promise<boolean>;
      }>
    >;
    name: MENUKEYS;
  }>
>("./forms/**/index.ts(x)?");

const forms = Object.values({ ...fileForms, ...folderForms })
  .filter((m) => m.default)
  .map((m) => m.default)
  .reduce<
    Record<
      MENUKEYS,
      ForwardRefExoticComponent<
        RefAttributes<{
          validate: () => Promise<boolean>;
        }>
      >
    >
  >(
    (forms, form) => {
      forms[form.name] = form.Form;
      return forms;
    },
    {} as Record<
      MENUKEYS,
      ForwardRefExoticComponent<
        RefAttributes<{
          validate: () => Promise<boolean>;
        }>
      >
    >
  );

const DefaultForm = forwardRef<{ validate: () => Promise<boolean> }>(function (
  _,
  ref
) {
  useImperativeHandle(ref, () => ({
    validate: () => Promise.resolve(true),
  }));
  return <EventContentWarp desc="暂未找到事件配置"></EventContentWarp>;
});

export default forwardRef<
  { validate: () => Promise<boolean> },
  { name: MENUKEYS }
>(function EventFormContent({ name }, ref) {
  const Form = forms[name];
  if (!Form) return <DefaultForm ref={ref} />;
  return <Form ref={ref} />;
});
