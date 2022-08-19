import { isPlainObject } from "lodash";
import { generate as uuid } from "shortid";
import { copy, downloadByUrl, produce } from "@/utils";
import { IGlobal } from "./useGlobal";
import MENUKEYS from "../Menu/components/EventForm/keys";
import {
  CopyFormType,
  CustomFormType,
  DownLoadFileFormType,
  MessageFormType,
  OpenPageFormType,
} from "../Menu/components/EventForm/types";

function doAction(action: ActionType, global: PowerPartial<IGlobal>) {
  const { ui, router } = global;
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
        router.navigate(href);
      }
      break;
    }
    case MENUKEYS.MESSAGE: {
      const { type, status, title, content, duration } = (action.form ||
        {}) as MessageFormType;
      if (type === "message") {
        ui.message[status || "normal"]({
          content,
          duration: duration || 3000,
        });
      }
      if (type === "notice") {
        ui.notifiy[status || "normal"]({
          title,
          content,
          duration: duration || 3000,
        });
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
      const fn = new Function("doAction", content);
      fn((a) => {
        try {
          doAction(a, global);
        } catch (error) {
          console.error(error);
        }
      });
      break;
    }
    default:
      break;
  }
}

/**
 * 根据actions生成方法
 * @param actions 执行action数组
 * @param global 全局方法和变量
 * @returns 根据actions生成的方法
 */
export function createAction(
  actions: ActionType[],
  global: PowerPartial<IGlobal>
) {
  return function () {
    actions.forEach((action) => doAction(action, global));
  };
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
