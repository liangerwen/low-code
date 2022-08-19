import { downloadByContent, produce } from "@/utils";
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
import dayjs from "dayjs";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { generate as uuid } from "shortid";
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
  >(LocalKeys.SCHEMA_KEY, [
    {
      id: uuid(),
      name: "测试",
      schema: {
        name: "page",
        inMenu: true,
        body: [
          {
            id: uuid(),
            name: "button",
            title: "按钮",
            props: {
              type: "dashed",
              long: true,
              icon: {
                isIcon: true,
                name: "IconCopy",
              },
              status: "success",
              onClick: {
                isEvent: true,
                actions: [
                  {
                    id: uuid(),
                    name: "copy",
                    form: {
                      content: "Hello Lew Code!",
                    },
                  },
                  {
                    id: uuid(),
                    name: "message",
                    form: {
                      type: "message",
                      status: "success",
                      content: "复制成功",
                    },
                  },
                ],
              },
            },
            children: ["点击复制内容：Hello Lew Code!"],
            inline: false,
          },
        ],
      },
      date: Date.now(),
      publish: false,
    },
  ]);

  const projects = useMemo(
    () => schemas.sort((a, b) => b.date - a.date),
    [schemas]
  );

  return (
    <>
      {projects.length > 0 ? (
        <Row gutter={[10, 10]}>
          {projects.map((p) => (
            <Col
              key={p.id}
              xxl={{ span: 6 }}
              xl={{ span: 8 }}
              lg={{ span: 12 }}
              span={24}
            >
              <Card
                key={p.id}
                hoverable
                className="important-rounded-[8px] overflow-hidden w-full"
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
                              const url = p.schema.inMenu
                                ? `/preview-menu/${p.id}`
                                : `/preview/${p.id}`;
                              window.open(`${window.location.origin}/#${url}`);
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
                              Message.success("就当操作成功了，假的数据啦！😋");
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
                              downloadByContent({
                                fileName: `${p.id}.json`,
                                content: JSON.stringify(p, null, 2),
                              });
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
      ) : (
        <div className="flex items-center h-full">
          <Empty />
        </div>
      )}
    </>
  );
}
