import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout as ArcoLayout, Message } from "@arco-design/web-react";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { isLogin } from "../utils/auth";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (!isLogin()) {
      Message.error("请先登录");
      navigate(`/login?redirect=${path}`, { replace: true });
      return;
    }
    if (path === "" || path === "/") {
      navigate("/home/projects", { replace: true });
    }
  }, [location]);

  return (
    <ArcoLayout className="overflow-hidden bg-[#f5f9fe] h-[100vh]">
      <ArcoLayout.Header>
        <NavBar />
      </ArcoLayout.Header>
      <Outlet />
    </ArcoLayout>
  );
}
