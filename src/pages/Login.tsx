import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  Space,
  Tooltip,
  Typography,
} from "@arco-design/web-react";
import useMouse from "@/hooks/useMouse";
import { useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";

import Background from "@/assets/background.jpg";
import Earth from "@/assets/earth.png";
import Man from "@/assets/man.png";
import Planet1 from "@/assets/planet1.png";
import Planet3 from "@/assets/planet3.png";
import Planet4 from "@/assets/planet4.png";
import { IconLock, IconUser } from "@arco-design/web-react/icon";
import { login } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import useLocale from "@/hooks/useLocale";
import LangSetting from "@/components/Settings/LocaleSetting";
import ModeSetting from "@/components/Settings/ModeSetting";
import OnlineTheme from "@/components/Settings/ThemeSetting";

const FormItem = Form.Item;
const { Title } = Typography;

interface LoginFormProps {
  username: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [baseTranslate, setBaseTranslate] = useState({ X: 0, Y: 0 });
  const { X, Y } = useMouse();
  const changeBaseTranslate = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const gini = 120;
    setBaseTranslate({
      X: -((X - windowWidth / 2) / windowWidth) * gini,
      Y: -((Y - windowHeight / 2) / windowHeight) * gini,
    });
  };
  const navigator = useNavigate();
  const { t } = useLocale();

  const [form] = Form.useForm<LoginFormProps>();

  useEffect(() => {
    throttle(changeBaseTranslate, 200)();
  }, [X, Y]);

  const animationItemListConfig = useMemo(
    () => [
      {
        key: 1,
        gini: 0.5,
        img: Planet1,
      },
      {
        key: 2,
        gini: 0.5,
        img: Man,
      },
      {
        key: 3,
        gini: 0.75,
        img: Earth,
      },
      {
        key: 4,
        gini: 1,
        img: Planet3,
      },
      {
        key: 5,
        gini: 2,
        img: Planet4,
      },
    ],
    []
  );

  return (
    <Layout className="overflow-hidden h-[100vh]">
      <img
        src={Background}
        className="absolute w-full h-full top-0 left-0 object-cover pointer-events-none z-[-1]"
      />
      <ul className="absolute w-full h-full m-0 p-0 overflow-hidden backface-hidden pointer-events-none transform preserve-3d">
        {animationItemListConfig.map((i) => (
          <li
            key={i.key}
            className="absolute top-0 left-0 preserve-3d backface-hidden transition-property-all transition-duration-300 ease-out"
            style={{
              transform: `translate3d(${baseTranslate.X * i.gini}px, ${
                baseTranslate.Y * i.gini
              }px, 0)`,
            }}
          >
            <img src={i.img} className="pointer-events-none" />
          </li>
        ))}
      </ul>
      <Layout.Header>
        <Space className="p-8 absolute right-0" align="center" size={20}>
          <Tooltip content={t("navbar.lang.change")}>
            <LangSetting
              iconOnly
              className="text-2xl cursor-pointer important-color-white"
            />
          </Tooltip>
          <ModeSetting
            iconOnly
            className="text-2xl cursor-pointer important-color-white"
          />
          <Tooltip content="安装主题">
            <OnlineTheme
              iconOnly
              className="text-2xl cursor-pointer important-color-white"
            />
          </Tooltip>
        </Space>
      </Layout.Header>
      <Layout.Content className="flex justify-center items-center">
        <Form<LoginFormProps>
          className="important-w-[350px] frosted-glass-warpper-[rgba(var(--gray-2),0.8)] before-frosted-glass-mask-[rgba(var(--gray-2),0.3)] p-6 rounded"
          layout="vertical"
          form={form}
          onSubmit={(form) => {
            login(JSON.stringify(form));
            navigator("/");
          }}
        >
          <Typography className="relative">
            <img
              src="/favicon.ico"
              alt="logo"
              className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
            />
            <Title
              heading={3}
              className="titillium important-mt-0 text-center important-font-600 color-[var(--color-text-1)]"
            >
              登 录
            </Title>
            <img
              src="/favicon.ico"
              alt="logo"
              className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
            />
          </Typography>
          <FormItem
            rules={[{ required: true, message: "请输入用户名" }]}
            field="username"
          >
            <Input
              prefix={<IconUser />}
              placeholder="请输入用户名"
              autoComplete="off"
            />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: "请输入密码" }]}
            field="paddword"
          >
            <Input.Password
              prefix={<IconLock />}
              placeholder="请输入密码"
              autoComplete="new-password"
            />
          </FormItem>
          <FormItem field="remember">
            <Checkbox>自动登录</Checkbox>
          </FormItem>
          <FormItem className="mb-0">
            <Button type="primary" long htmlType="submit">
              登 录
            </Button>
          </FormItem>
        </Form>
      </Layout.Content>
    </Layout>
  );
}
