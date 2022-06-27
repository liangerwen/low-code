import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  Grid,
  Skeleton,
  Card,
  Typography,
  Notification,
  Pagination,
  Tag,
  Space,
  Input,
  Empty,
  Link,
} from "@arco-design/web-react";
import { IconLink, IconRefresh } from "@arco-design/web-react/icon";
import useLocale from "@/hooks/useLocale";
import { getTheme } from "@/https/api/theme";
import { ThemeType } from "..";
import useTheme from "./useTheme";

const Row = Grid.Row;
const Col = Grid.Col;
const Meta = Card.Meta;

interface IProps {
  onClose?: () => void;
  onConfirm?: () => void;
  visible: boolean;
}

export default function ({ onClose, onConfirm, visible }: IProps) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<{ list: ThemeType[]; total: number }>({
    list: Array.from({ length: 6 }),
    total: 0,
  });

  const { theme, setTheme } = useTheme();
  const [disabled, setDisabled] = useState(false);
  const { t } = useLocale();

  const fetchTheme = useCallback((page, keyword) => {
    setLoading(true);
    setData({ list: Array.from({ length: 6 }), total: 0 });
    getTheme({ pageSize: 6, currentPage: page, keyword })
      .then((data) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (visible) {
      fetchTheme(page, keyword);
    }
  }, [visible]);
  return (
    <Modal
      title={
        <Row justify="space-between" className="mr-[30px]">
          <span>{t("settings.theme.install")}</span>
          <Input.Search
            readOnly={loading}
            value={keyword}
            loading={loading}
            placeholder={t("settings.theme.search")}
            style={{ width: 300 }}
            onChange={setKeyword}
            onSearch={(val) => {
              fetchTheme(1, val);
              setPage(1);
            }}
          />
        </Row>
      }
      style={{ width: 900 }}
      simple={false}
      maskClosable={false}
      escToExit={false}
      visible={visible}
      footer={
        theme ? (
          <div>
            <Typography.Text
              style={{ float: "left", lineHeight: "32px" }}
              type="secondary"
            >
              {t("settings.theme.current", { params: [theme.themeName] })}
            </Typography.Text>
            <Button
              type="primary"
              status="success"
              icon={<IconRefresh />}
              onClick={() => {
                setDisabled(true);
                setTheme(null)
                  .then((res) => {
                    if (res) {
                      Notification.success({
                        id: "theme-modal-notify",
                        title: "重置主题",
                        content: "重置主题成功",
                        duration: 1500,
                        closable: true,
                      });
                      onConfirm?.();
                    }
                  })
                  .finally(() => {
                    setDisabled(false);
                  });
              }}
            >
              重置主题
            </Button>
          </div>
        ) : null
      }
      onCancel={onClose}
    >
      {data.total === 0 && !loading ? (
        <Empty
          className="my-[200px]"
          description={
            <Typography.Text type="secondary">
              没有相关主题
              <Link href="https://arco.design/themes" target="_blank">
                前往主题商店创建
              </Link>
            </Typography.Text>
          }
        />
      ) : (
        <div className="-my-4">
          <Row gutter={20}>
            {data.list.map((item, idx) => (
              <Col span={8} key={item?.themeId || idx} style={{ padding: 10 }}>
                <Card
                  hoverable
                  cover={
                    <Skeleton
                      style={{ display: "block" }}
                      loading={loading}
                      text={false}
                      image={{
                        style: {
                          width: "100%",
                          height: 160,
                          margin: 0,
                        },
                      }}
                      animation
                    >
                      <div
                        style={{
                          height: 160,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          style={{ width: "100%" }}
                          alt={item?.themeName || ""}
                          src={item?.cover || ""}
                        />
                      </div>
                    </Skeleton>
                  }
                >
                  <Meta
                    title={
                      <Skeleton
                        loading={loading}
                        animation
                        style={{ marginTop: 0 }}
                        text={{ rows: 1, width: 72 }}
                      >
                        {item?.themeName}
                      </Skeleton>
                    }
                    description={
                      <Skeleton
                        loading={loading}
                        animation
                        text={{ rows: 1, width: 150, style: { height: 32 } }}
                      >
                        <Row justify="end" style={{ marginTop: "10px" }}>
                          <Space>
                            <Button
                              type="text"
                              icon={<IconLink />}
                              size="mini"
                              onClick={() => {
                                window.open(
                                  `https://arco.design/themes/design/${item.themeId}`
                                );
                              }}
                            >
                              商城中打开
                            </Button>
                            {theme?.themeId === item?.themeId ? (
                              <Tag>当前使用</Tag>
                            ) : (
                              <Button
                                type="primary"
                                size="mini"
                                disabled={
                                  disabled || theme?.themeId === item?.themeId
                                }
                                onClick={() => {
                                  Notification.info({
                                    id: "theme-modal-notify",
                                    title: "安装主题",
                                    content: "正在安装主题...",
                                    duration: 100000,
                                  });
                                  setDisabled(true);
                                  setTheme(item)
                                    .then((res) => {
                                      if (res) {
                                        Notification.success({
                                          id: "theme-modal-notify",
                                          title: "安装主题",
                                          content: "安装主题成功",
                                          duration: 1500,
                                        });
                                        onConfirm?.();
                                      } else {
                                        Notification.error({
                                          id: "theme-modal-notify",
                                          title: "安装主题",
                                          content: "安装主题失败",
                                          duration: 1500,
                                        });
                                      }
                                    })
                                    .finally(() => {
                                      setDisabled(false);
                                    });
                                }}
                              >
                                安装主题
                              </Button>
                            )}
                          </Space>
                        </Row>
                      </Skeleton>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          {data.total > 0 && (
            <Row justify="end">
              <Pagination
                total={data.total}
                current={page}
                onChange={(val) => {
                  if (val !== page) {
                    setPage(val);
                    fetchTheme(val, keyword);
                  }
                }}
              />
            </Row>
          )}
        </div>
      )}
    </Modal>
  );
}
