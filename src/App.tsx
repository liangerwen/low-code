import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { SettingProvider } from "./components/Settings";
import useMode from "./components/Settings/ModeSetting/useMode";
import useTheme from "./components/Settings/ThemeSetting/useTheme";
import routes from "./Router";
import { deepArrayPick } from "./utils";

export default function App() {
  // 初始化模式
  useMode();
  // 初始化主题
  useTheme();

  const location = useLocation()

  const elements = useRoutes(
    deepArrayPick(routes, ["children"], ["path", "element", "children"])
  );

  return (
    <SettingProvider>
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={500}>
          {elements}
        </CSSTransition>
      </TransitionGroup>
    </SettingProvider>
  );
}
