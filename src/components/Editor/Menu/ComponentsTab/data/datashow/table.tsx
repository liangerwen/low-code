import { Table } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "table";

const defaultSchema = {
  name,
  title: "表格",
  props: {
    columns: [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Salary",
        dataIndex: "salary",
      },
      {
        title: "Address",
        dataIndex: "address",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
    ],
    data: [],
  },
};

export default {
  name,
  componentMap: { [name]: Table },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-material-symbols:backup-table"
      {...props}
    />
  ),
  desc: "用于数据收集展示、分析整理、操作处理。",
  defaultSchema,
};
