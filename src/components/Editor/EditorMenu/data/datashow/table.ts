import { Table } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "a-table";

const defaultSchema = {
  name,
  title: "表格",
  attrs: {
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
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
