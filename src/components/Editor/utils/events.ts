import MENUKEYS from "../Menu/components/EventForm/data/keys";
import { NavigateFunction, Location } from "react-router-dom";
import { Message, Modal, Notification } from "@arco-design/web-react";

interface IGlobal {
  window: Window;
  router: {
    navigate: NavigateFunction;
    location: Location;
  };
  ui: {
    modal: Partial<
      Pick<typeof Modal, "confirm" | "info" | "success" | "warning" | "error">
    >;
    // drawer:,
    message: typeof Message;
    notifiy: typeof Notification;
    form: {
      submit: (id: string) => void;
      validate: (id: string) => void;
      clear: (id: string) => void;
      reset: (id: string) => void;
    };
    component: {
      refresh: (id: string) => void;
      display: (id: string) => void;
      hidden: (id: string) => void;
      setAttrs: (id: string, attrs: Record<string, any>) => void;
      triggerEvent: (id: string, name: string) => void;
    };
  };
  service: {
    request: (id: string) => void;
    upload: () => void;
    download: (url: string) => void;
  };
  copy: (content: string) => void;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

/**
 * 根据actions生成方法
 * @param actions 执行action数组
 * @param global 全局方法和变量
 * @returns 根据actions生成的方法
 */
export function createAction(
  actions: IEvent[],
  { window, router, ui, service, data }: Partial<IGlobal>
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
 * 根据events生成对应事件方法
 * @param events 对应事件
 * @param global 全局方法和变量
 * @returns events生成的事件方法
 */
export function createEvents(
  events: Record<string, IEvent[]>,
  global: Partial<IGlobal>
) {
  const ret = {};
  Object.keys(events).forEach((k) => {
    ret[k] = createAction(events[k], global);
  });
  return ret;
}
