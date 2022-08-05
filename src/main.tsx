import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import ErrorComponent from "./components/ErrorComponent";
import "uno.css";
import "./global.less";
import "./locale/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorComponent}>
    <HashRouter>
      <App />
    </HashRouter>
  </ErrorBoundary>
);
