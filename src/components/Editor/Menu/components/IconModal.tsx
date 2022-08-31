import { useSettings } from "@/components/Settings";
import useLocale from "@/hooks/useLocale";
import { produce } from "@/utils";
import {
  Modal,
  Grid,
  Input,
  Card,
  Tabs,
  Typography,
  Button,
  Empty,
} from "@arco-design/web-react";
import { IconClose, IconDown, IconMore } from "@arco-design/web-react/icon";
import iconsJson from "@arco-design/web-react/icon/icons.json";
import classNames from "classnames";
import { chunk, setWith } from "lodash";
import {
  cloneElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import EditorIcon from "./EditorIcon";

const Row = Grid.Row;
const Col = Grid.Col;
const ButtonGroup = Button.Group;

interface IProps {
  value?: IconType;
  onChange?: (val: IconType) => void;
  trigger?: ReactNode;
}

export default (props: IProps) => {
  const { t } = useLocale();
  const { lang } = useSettings();
  const { icons, i18n } = iconsJson;
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tabKey, setTabKey] = useState("");
  const [hiddenList, setHiddenList] = useState([]);

  const iconList = useMemo(() => {
    const newIcons = {};
    Object.keys(icons).forEach((k) => {
      const tabIcons = icons[k];
      Object.keys(tabIcons).forEach((ik) => {
        const cardIcons = tabIcons[ik].filter((i) => {
          const lowerKeyword = keyword.toLocaleLowerCase();
          const lowerComponentName = i.componentName.toLocaleLowerCase();
          return (
            lowerKeyword.includes(lowerComponentName) ||
            lowerComponentName.includes(lowerKeyword)
          );
        });
        if (cardIcons.length > 0) {
          setWith(newIcons, `[${k}][${ik}]`, cardIcons, Object);
        }
      });
    });
    return newIcons;
  }, [keyword]);

  const isEmpty = useMemo(() => Object.keys(iconList).length === 0, [iconList]);

  useEffect(() => {
    if (!isEmpty) {
      setTabKey(Object.keys(iconList)[0]);
    }
  }, [iconList, isEmpty]);

  const toggleHidden = useCallback(
    (key) => {
      const idx = hiddenList.findIndex((i) => i === key);
      if (idx >= 0) {
        setHiddenList(
          produce(hiddenList, (list) => {
            list.splice(idx, 1);
          })
        );
      } else {
        setHiddenList([...hiddenList, key]);
      }
    },
    [hiddenList]
  );

  return (
    <>
      {props.trigger ? (
        cloneElement(props.trigger as ReactElement, {
          onClick: () => {
            setVisible(true);
          },
        })
      ) : (
        <ButtonGroup>
          <Button
            onClick={() => setVisible(true)}
            icon={props.value && <EditorIcon name={props.value.name} />}
          >
            点击选择图标
          </Button>
          <Button
            icon={<IconClose />}
            onClick={() => props?.onChange(undefined)}
          />
        </ButtonGroup>
      )}
      <Modal
        title={
          <Row justify="space-between" className="mr-[30px]">
            <span>{t("editor.icon.select")}</span>
            <Input.Search
              placeholder={t("editor.icon.search")}
              style={{ width: 300 }}
              value={keyword}
              onChange={setKeyword}
            />
          </Row>
        }
        style={{ width: 1200 }}
        simple={false}
        maskClosable={false}
        escToExit={false}
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        {isEmpty ? (
          <Empty className="my-[200px]" />
        ) : (
          <Tabs tabPosition="top" activeTab={tabKey} onChange={setTabKey}>
            {Object.keys(iconList).map((k) => (
              <Tabs.TabPane key={k} title={i18n[lang][k]}>
                {Object.keys(iconList[k]).map((c, idx) => (
                  <Card
                    title={t(`editor.icon.${c}`)}
                    extra={
                      <IconDown
                        className={classNames(
                          {
                            "rotate-[90deg]": hiddenList.includes(`${k}.${c}`),
                          },
                          "transition-all cursor-pointer"
                        )}
                        onClick={() => {
                          toggleHidden(`${k}.${c}`);
                        }}
                      />
                    }
                    key={c}
                    className={classNames({
                      "mt-4": idx > 0,
                    })}
                  >
                    {!hiddenList.includes(`${k}.${c}`) ? (
                      chunk<{
                        componentName: string;
                      }>(iconList[k][c], 6).map((r, idx) => (
                        <Row
                          className={classNames({
                            "mt-4": idx > 0,
                          })}
                          key={idx}
                          gutter={20}
                        >
                          {r.map((icon) => {
                            const showName = icon.componentName.replace(
                              "Icon",
                              ""
                            );
                            return (
                              <Col span={4} key={icon.componentName}>
                                <div
                                  className="arco-btn arco-btn-outline important-flex flex-col items-center py-4"
                                  onClick={() => {
                                    props?.onChange({
                                      isIcon: true,
                                      name: icon.componentName,
                                    });
                                    setVisible(false);
                                  }}
                                >
                                  <Typography.Paragraph>
                                    {showName}
                                  </Typography.Paragraph>
                                  {
                                    <EditorIcon
                                      name={icon.componentName}
                                      iconProps={{ style: { fontSize: 32 } }}
                                    />
                                  }
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      ))
                    ) : (
                      <div className="flex justify-center">
                        <IconMore
                          className="cursor-pointer"
                          onClick={() => {
                            toggleHidden(`${k}.${c}`);
                          }}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Modal>
    </>
  );
};
