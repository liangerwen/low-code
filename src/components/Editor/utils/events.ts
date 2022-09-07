import { isPlainObject } from "lodash";
import { copy, downloadByUrl } from "@/utils";
import { generate as uuid } from "shortid";
import { produce } from "immer";
import MENUKEYS from "../Menu/components/EventForm/keys";
import {
  CopyFormType,
  CustomFormType,
  DownLoadFileFormType,
  FormActionType,
  MessageFormType,
  OpenPageFormType,
} from "../Menu/components/EventForm/types";
import { FormInstance, Message, Notification } from "@arco-design/web-react";
import { NavigateFunction, Params, Location } from "react-router-dom";

const utils = {
  message: Message,
  notify: Notification,
  copy,
  download: (url) => downloadByUrl(uuid(), url),
};

/**
 * 根据actions生成方法
 * @param actions 执行action数组
 * @param global 全局方法和变量
 * @returns 根据actions生成的方法
 */
export function doActions(
  actions: ActionType[],
  options: {
    navigate: NavigateFunction;
    location: Location;
    params: Params<string>;
    current: IComponent | null;
    schema: ISchema;
    forms: Record<string, FormInstance>;
    data: Record<string, any>;
    setData: SetDataFunction;
  },
  args = []
) {
  const { navigate, location, params, current, schema, forms, data, setData } =
    options;
  const page = {
    schema,
    params,
    navigate,
    location,
    forms,
    data,
    setData,
  };
  actions.forEach((action) => {
    switch (action.name) {
      case MENUKEYS.REFRESH_PAGE:
        window.location.reload();
        break;
      case MENUKEYS.BACK_PAGE:
        window.history.back();
        break;
      case MENUKEYS.OPEN_PAGE: {
        const { type, url, blank, params } = (action.form ||
          {}) as OpenPageFormType;
        const href =
          url +
          "?" +
          params.reduce((pre, cur) => pre + cur.key + "=" + cur.value, "");
        if (type === "link") {
          blank ? window.open(href) : window.location.assign(href);
        }
        if (type === "page") {
          navigate(href);
        }
        break;
      }
      case MENUKEYS.MESSAGE: {
        const { type, status, title, content, duration } = (action.form ||
          {}) as MessageFormType;
        if (type === "message") {
          Message[status || "normal"]({
            content,
            duration: duration || 3000,
          });
        }
        if (type === "notify") {
          Notification[status || "normal"]({
            title,
            content,
            duration: duration || 3000,
          });
        }
        break;
      }
      case MENUKEYS.FORM: {
        const { id, type } = (action.form || {}) as FormActionType;
        const form = forms[id];
        switch (type) {
          case "submit":
            form?.submit();
            break;
          case "validate":
            form?.validate();
            break;
          case "reset":
            form?.resetFields();
            break;
          case "clear":
            form?.clearFields();
            break;
        }
        break;
      }
      case MENUKEYS.DOWNLOAD_FILE: {
        const { url } = (action.form || {}) as DownLoadFileFormType;
        downloadByUrl(uuid(), url);
        break;
      }
      case MENUKEYS.COPY: {
        const { content } = (action.form || {}) as CopyFormType;
        copy(content);
        break;
      }
      case MENUKEYS.CUSTOM: {
        const { content } = (action.form || {}) as CustomFormType;
        const fn = new Function("page", "current", "utils", content);
        try {
          fn(page, { schema: current, arguments: args }, utils);
        } catch (error) {
          console.error(error);
        }
        break;
      }
      default:
        break;
    }
  });
}

/**
 * 根据属性对象返回对应得事件属性对象
 * @param props 属性对象
 * @returns 事件属性对象
 */
export const getEventsFromProps = (props) => {
  if (!isPlainObject(props)) return {};
  const ret = {};
  Object.keys(props).forEach((k) => {
    const prop = props[k];
    if (prop.isEvent) {
      ret[k] = prop;
    }
  });
  return ret;
};

/**
 * 根据事件属性对象和原本属性对象生成新的属性对象
 * @param props 属性对象
 * @param eventProps 事件属性对象
 * @returns 新的属性对象
 */
export const generateEventProps = <T extends Object>(
  props: T,
  eventProps
): T => {
  if (!isPlainObject(props) || !isPlainObject(eventProps)) return props;
  return produce(props, (p) => {
    const oldEventProps = getEventsFromProps(props);
    Object.keys(oldEventProps).forEach((key) => {
      delete p[key];
    });
    Object.assign(p, eventProps);
  });
};
