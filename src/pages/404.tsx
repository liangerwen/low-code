import { Layout } from "@arco-design/web-react";
import LcToolBar from "../components/LcToolBar";

import Error404 from "@/assets/404.svg";

export default function NotFind() {
  return (
    <Layout className="overflow-hidden bg-[#f5f9fe] h-[100vh]">
      <Layout.Header className="bg-white h-14 box-border p-2 border-gray-200 border-b ">
        <LcToolBar />
      </Layout.Header>
      <Layout.Content className="flex justify-center">
        <div className="mt-[100px] text-center">
          <img src={Error404} className="w-[400px] h-[300px]" />
          <h1 className="mb-0 color-[var(--color-text-2)]">页面找不到了</h1>
        </div>
      </Layout.Content>
    </Layout>
  );
}
