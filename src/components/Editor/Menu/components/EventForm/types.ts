export type FormRefType = {
  validate?: () => Promise<any>;
};
export type FormPropsType<T = any> = {
  value?: T;
};

// forms type
export type OpenPageFormType = {
  type: "page" | "link";
  url: string;
  params?: { key: string; value: string }[];
  blank?: boolean;
};

export interface MessageFormType {
  type: "message" | "notify";
  status?: "info" | "success" | "warning" | "error" | "loading";
  title?: string;
  content: string;
  duration?: number;
}

export interface DownLoadFileFormType {
  url: string;
}

export interface CopyFormType {
  content: string;
}
export interface CustomFormType {
  content: string;
}

export interface FormActionType {
  id: string;
  type: "submit" | "validate" | "clear" | "reset";
}
