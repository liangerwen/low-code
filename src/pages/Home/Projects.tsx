import { produce } from "@/utils";
import { LocalKeys } from "@/utils/storage";
import {
  Avatar,
  Card,
  Space,
  Typography,
  Grid,
  Tooltip,
  Dropdown,
  Menu,
  Empty,
  Message,
  Tag,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconDownload,
  IconEdit,
  IconEye,
  IconMore,
  IconPoweroff,
  IconRedo,
  IconSend,
} from "@arco-design/web-react/icon";
import classNames from "classnames";
import dayjs from "dayjs";
import { chunk } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
const { Meta } = Card;
const { Row, Col } = Grid;

export default function Projects() {
  const navigate = useNavigate();
  const [schemas, setSchemas] = useLocalStorage<
    {
      id: string;
      name: string;
      schema: ISchema;
      date: number;
      publish: boolean;
    }[]
  >(LocalKeys.SCHEMA_KEY, []);

  const projects = useMemo(
    () =>
      chunk(
        schemas.sort((a, b) => b.date - a.date),
        4
      ),
    [schemas]
  );

  return (
    <>
      {projects.length > 0 ? (
        projects.map((pl, idx) => (
          <Row
            gutter={10}
            key={idx}
            className={classNames({ "mt-2": idx > 0 })}
          >
            {pl.map((p) => (
              <Col span={6} key={p.id}>
                <Card
                  className="rounded-[8px] overflow-hidden w-full"
                  cover={
                    <div style={{ height: 204, overflow: "hidden" }}>
                      <img
                        style={{
                          width: "100%",
                          transform: "translateY(-20px)",
                        }}
                        alt="dessert"
                        src="https://api.ixiaowai.cn/mcapi/mcapi.php"
                      />
                    </div>
                  }
                  actions={[
                    <Tooltip content="编辑">
                      <IconEdit
                        onClick={() => {
                          navigate(`/edit/${p.id}`);
                        }}
                      />
                    </Tooltip>,
                    <Dropdown
                      droplist={
                        <Menu
                          onClickMenuItem={(key) => {
                            switch (key) {
                              case "preview":
                                break;
                              case "publish":
                                setSchemas(
                                  produce(schemas, (schemas) => {
                                    const schema = schemas.find(
                                      (i) => i.id === p.id
                                    );
                                    if (schema) {
                                      schema.publish = !schema.publish;
                                    }
                                  })
                                );
                                Message.success(
                                  "就当操作成功了，假的数据啦！😋"
                                );
                                break;
                              case "rename":
                                const name = window.prompt("项目名称");
                                if (name) {
                                  setSchemas(
                                    produce(schemas, (schemas) => {
                                      const schema = schemas.find(
                                        (i) => i.id === p.id
                                      );
                                      if (schema) {
                                        schema.name = name;
                                      }
                                    })
                                  );
                                }
                                break;
                              case "download":
                                break;
                              case "delete":
                                setSchemas(
                                  produce(schemas, (schemas) => {
                                    const idx = schemas.findIndex(
                                      (i) => i.id === p.id
                                    );
                                    schemas.splice(idx, 1);
                                  })
                                );
                                break;
                              default:
                                break;
                            }
                          }}
                        >
                          <Menu.Item key="preview">
                            <Space>
                              <IconEye />
                              <span>预 览</span>
                            </Space>
                          </Menu.Item>
                          <Menu.Item key="publish">
                            <Space>
                              <IconSend />
                              <span>{p.publish ? "取消发布" : "发 布"}</span>
                            </Space>
                          </Menu.Item>
                          <Menu.Item key="rename">
                            <Space>
                              <IconRedo />
                              <span>重命名</span>
                            </Space>
                          </Menu.Item>
                          <Menu.Item key="download">
                            <Space>
                              <IconDownload />
                              <span>下 载</span>
                            </Space>
                          </Menu.Item>
                          <Menu.Item key="delete">
                            <Space>
                              <IconDelete />
                              <span>删 除</span>
                            </Space>
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <IconMore />
                    </Dropdown>,
                  ]}
                >
                  <Meta
                    avatar={
                      <Space>
                        <Avatar size={24}>
                          <img alt="avatar" src="//api.btstu.cn/sjtx/api.php" />
                        </Avatar>
                        <Typography.Text>
                          {dayjs(p.date).format("YYYY-MM-DD hh:mm:ss")}
                        </Typography.Text>
                        <Tag
                          color={p.publish ? "green" : "red"}
                          icon={<IconPoweroff />}
                        >
                          {p.publish ? "已发布" : "未发布"}
                        </Tag>
                      </Space>
                    }
                    title={p.name}
                    description={`id: ${p.id}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ))
      ) : (
        <div className="flex items-center h-full">
          <Empty />
        </div>
      )}
    </>
  );
}
