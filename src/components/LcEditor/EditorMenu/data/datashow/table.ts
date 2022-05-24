import { Table } from "@arco-design/web-react";

const component = {
  name: "a-table",
  type: Table,
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
  icon: "icon-check-circle-fill",
  text: "表格",
  demo: {
    title: "表格",
    components: [component],
  },
  component,
};
