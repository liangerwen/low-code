import { Layout } from "@arco-design/web-react";
import { useSettings } from "./Settings";

export default function Footer() {
  const {
    pageSetting: { footer },
  } = useSettings();
  return (
    footer && (
      <Layout.Footer className="h-[40px] text-center color-[var(--color-text-2)] leading-[40px]">
        liangerwen
      </Layout.Footer>
    )
  );
}
