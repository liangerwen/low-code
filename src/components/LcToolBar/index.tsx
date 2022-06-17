import { Grid, Space } from "@arco-design/web-react";
import { Link } from "react-router-dom";
import styles from "./style.module.less";

const Row = Grid.Row;

interface IProps {
  userMenus?: Boolean;
}

export default function (props: IProps) {
  const { userMenus = true } = props;

  return (
    <Row className={styles["toolbar-warpper"]}>
      <Link to="/" className="no-underline">
        <Space>
          <img
            src="/favicon.ico"
            alt="logo"
            className={styles["toolbar-logo"]}
          />
          <span className={styles["toolbar-title"]}>liangerwen's low code</span>
        </Space>
      </Link>
    </Row>
  );
}
