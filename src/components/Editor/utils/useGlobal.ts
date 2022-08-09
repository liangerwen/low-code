import { copy } from "@/utils";
import { Message, Modal, Notification } from "@arco-design/web-react";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  Location,
} from "react-router-dom";

export interface IGlobal {
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
      setProps: (id: string, props: Record<string, any>) => void;
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

export default function useGlobal(): PowerPartial<IGlobal> {
  const location = useLocation();
  const navigate = useNavigate();
  return {
    window,
    router: { location, navigate },
    ui: {
      message: Message,
      notifiy: Notification,
    },
    copy,
  };
}
