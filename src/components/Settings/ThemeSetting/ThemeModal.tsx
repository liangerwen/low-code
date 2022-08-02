import { useState, useEffect } from "react";
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
  Input,
  Empty,
  Link,
} from "@arco-design/web-react";
import { IconLink, IconRefresh } from "@arco-design/web-react/icon";
import useLocale from "@/hooks/useLocale";
import { getTheme } from "@/https/api/theme";
import { ThemeType } from "..";
import useTheme from "./useTheme";
import useRequest from "@/hooks/useRequest";

const Row = Grid.Row;
const Col = Grid.Col;
const Meta = Card.Meta;

interface IProps {
  onClose?: () => void;
  onConfirm?: () => void;
  visible: boolean;
}

export default function ({ onClose, onConfirm, visible }: IProps) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const { loading, data, request } = useRequest<{
    total: number;
    list: ThemeType[];
  }>(
    getTheme,
    {
      list: Array.from({ length: 6 }),
      total: 0,
    },
    {
      clearDataBeforeRequest: true,
      defaultArgs: { pageSize: 6, currentPage: page, keyword },
    }
  );

  const { theme, setTheme } = useTheme();
  const [disabled, setDisabled] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    if (visible) {
      request({ pageSize: 6, currentPage: page, keyword });
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
              request({ pageSize: 6, currentPage: 1, keyword: val });
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
                        title: t("settings.theme.reset"),
                        content: t("settings.theme.reset.success"),
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
              {t("settings.theme.reset")}
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
              {t("settings.theme.search.null")}
              <Link href="https://arco.design/themes" target="_blank">
                {t("settings.theme.search.create")}
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
                      <img
                        className="w-full h-full"
                        alt={item?.themeName}
                        src={item?.cover}
                      />
                    </Skeleton>
                  }
                  actions={[
                    <Skeleton
                      loading={loading}
                      animation
                      text={false}
                      image={{
                        style: {
                          width: 120,
                          height: 32,
                          margin: 0,
                        },
                      }}
                    >
                      <Link
                        target={"_blank"}
                        icon={<IconLink />}
                        href={`https://arco.design/themes/design/${item?.themeId}`}
                      >
                        {t("settings.theme.open")}
                      </Link>
                    </Skeleton>,
                    <Skeleton
                      loading={loading}
                      animation
                      text={false}
                      image={{
                        style: {
                          width: 80,
                          height: 32,
                          margin: 0,
                        },
                      }}
                    >
                      {theme?.themeId === item?.themeId ? (
                        <Tag>{t("settings.theme.use")}</Tag>
                      ) : (
                        <Button
                          type="primary"
                          size="mini"
                          disabled={disabled}
                          onClick={() => {
                            Notification.info({
                              id: "theme-modal-notify",
                              title: t("settings.theme.install"),
                              content: t("settings.theme.installing"),
                              duration: 100000,
                            });
                            setDisabled(true);
                            setTheme(item)
                              .then((res) => {
                                if (res) {
                                  Notification.success({
                                    id: "theme-modal-notify",
                                    title: t("settings.theme.install"),
                                    content: t(
                                      "settings.theme.install.success"
                                    ),
                                    duration: 1500,
                                  });
                                  onConfirm?.();
                                } else {
                                  Notification.error({
                                    id: "theme-modal-notify",
                                    title: t("settings.theme.install"),
                                    content: t("settings.theme.install.failed"),
                                    duration: 1500,
                                  });
                                }
                              })
                              .finally(() => {
                                setDisabled(false);
                              });
                          }}
                        >
                          {t("settings.theme.install.btn")}
                        </Button>
                      )}
                    </Skeleton>,
                  ]}
                >
                  <Meta
                    title={
                      <Skeleton
                        style={{ display: "block" }}
                        loading={loading}
                        animation
                        text={false}
                        image={{
                          style: {
                            width: "100%",
                            height: 20,
                            margin: 0,
                          },
                        }}
                      >
                        {item?.themeName}
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
                    request({ pageSize: 6, currentPage: val, keyword });
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
