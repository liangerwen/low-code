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
      // { title: "打开弹窗", key: MENUKEYS.OPEN_MODAL },
      // { title: "关闭弹窗", key: MENUKEYS.CLOSE_MODAL },
      // { title: "打开抽屉", key: MENUKEYS.OPEN_DRAWER },
      // { title: "关闭抽屉", key: MENUKEYS.CLOSE_DRAWER },
      { title: "消息提醒", key: MENUKEYS.MESSAGE },
    ],
  },
  {
    title: "表单",
    key: MENUKEYS.FORM,
  },
  {
    title: "服务",
    key: "service",
    children: [{ title: "下载文件", key: MENUKEYS.DOWNLOAD_FILE }],
  },
  {
    title: "其他",
    key: "other",
    children: [
      { title: "复制内容", key: MENUKEYS.COPY },
      { title: "自定义JS", key: MENUKEYS.CUSTOM },
    ],
  },
];
