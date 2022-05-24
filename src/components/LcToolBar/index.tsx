import { Grid, Space } from "@arco-design/web-react";
import classNames from "classnames";
import styles from "./style.module.less";

const Row = Grid.Row;
export default function () {
  return (
    <Row className={classNames(styles["lc-body"], "overflow-hidden")}>
      <Space>
        <img src="/favicon.ico" alt="logo" className="h-8" />
        <span className={styles["lc-title"]}>liangerwen's lower code</span>
      </Space>
    </Row>
  );
}
