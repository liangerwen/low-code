import { isPlainObject } from "lodash";
import { produce } from "@/utils";
import { IGlobal } from "./useGlobal";
import MENUKEYS from "../Menu/components/EventForm/keys";

/**
 * 根据actions生成方法
 * @param actions 执行action数组
 * @param global 全局方法和变量
 * @returns 根据actions生成的方法
 */
export function createAction(
  actions: ActionType[],
  { window, router, ui, service, data }: PowerPartial<IGlobal>
) {
  return function () {
    actions.forEach((action) => {
      switch (action.name) {
        case MENUKEYS.REFRESH_PAGE:
          window.location.reload();
          break;
        default:
          break;
      }
    });
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
