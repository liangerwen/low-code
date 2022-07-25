import MENUKEYS from "./keys";

export default [
  {
    title: "页面",
    key: "page",
    children: [
      { title: "打开页面", key: MENUKEYS.OPEN_PAGE },
      { title: "回退页面", key: MENUKEYS.BACK_PAGE },
      { title: "刷新页面", key: MENUKEYS.REFRESH_PAGE },
    ],
  },
  {
    title: "弹框消息",
    key: "modal",
    children: [
      { title: "打开弹窗", key: MENUKEYS.OPEN_MODAL },
      { title: "关闭弹窗", key: MENUKEYS.CLOSE_MODAL },
      { title: "打开抽屉", key: MENUKEYS.OPEN_DRAWER },
      { title: "关闭抽屉", key: MENUKEYS.CLOSE_DRAWER },
      { title: "消息提醒", key: MENUKEYS.MESSAGE },
    ],
  },
  {
    title: "表单",
    key: "form",
    children: [
      { title: "提交表单", key: MENUKEYS.SUBMIT_FORM },
      { title: "校验表单", key: MENUKEYS.VALIDATE_FORM },
      { title: "清空表单", key: MENUKEYS.CLEAR_FORM },
      { title: "重置表单", key: MENUKEYS.RESET_FORM },
    ],
  },
  {
    title: "服务",
    key: "service",
    children: [
      { title: "发送请求", key: MENUKEYS.REQUEST },
      { title: "下载文件", key: MENUKEYS.DOWNLOAD_FILE },
      { title: "上传文件", key: MENUKEYS.UPLOAD_FILE },
    ],
  },
  {
    title: "组件",
    key: "components",
    children: [
      { title: "刷新组件", key: MENUKEYS.REFRESH_COMPONENT },
      { title: "显示组件", key: MENUKEYS.DISPLAY_COMPONENT },
      { title: "隐藏组件", key: MENUKEYS.HIDDEN_COMPONENT },
      { title: "设置组件属性", key: MENUKEYS.SET_COMPONENT_ATTRS },
      { title: "触发组件事件", key: MENUKEYS.TRIGGER_COMPONENT_EVENT },
    ],
  },
  {
    title: "其他",
    key: "other",
    children: [
      { title: "复制类容", key: MENUKEYS.COPY },
      { title: "自定义JS", key: MENUKEYS.CUSTOM },
    ],
  },
];
