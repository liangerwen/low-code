import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout as ArcoLayout } from "@arco-design/web-react";
import LcToolBar from "../components/LcToolBar";
import { useEffect } from "react";
import { isLogin } from "../utils/auth";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (!isLogin()) {
      navigate(`/login?redirect=${path}`, { replace: true });
      return;
    }
    if (path === "" || path === "/") {
      navigate("/home/projects", { replace: true });
    }
  }, [location]);

  return (
    <ArcoLayout className="overflow-hidden bg-[#f5f9fe] h-[100vh]">
      <ArcoLayout.Header className="bg-white h-14 box-border p-2 border-gray-200 border-b ">
        <LcToolBar />
      </ArcoLayout.Header>
      <Outlet />
    </ArcoLayout>
  );
}
