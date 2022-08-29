import {
  Form,
  Input,
  InputNumber,
  InputTag,
  Modal,
  RulesProps,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useEffect } from "react";

const FormItem = Form.Item;
const useForm = Form.useForm;

interface IProps {
  visible: boolean;
  onOk?: (
    val: Omit<RulesProps, "match"> & {
      id: string;
      match: { isRegExp: true; source: string };
    }
  ) => void;
  onCancel?: () => void;
  initialValues?: Omit<RulesProps, "match"> & {
    id: string;
    match: { isRegExp: true; source: string };
  };
}

export default ({ visible, onOk, onCancel, initialValues }: IProps) => {
  const [form] = useForm<
    Omit<RulesProps, "match"> & {
      id: string;
      match: string;
    }
  >();
  useEffect(() => {
    form.resetFields();
    initialValues &&
      visible &&
      form.setFieldsValue({
        ...initialValues,
        match: initialValues.match?.isRegExp && initialValues.match.source,
      });
  }, [initialValues, visible]);
  return (
    <Modal
      title="设定规则"
      style={{ width: 800 }}
      simple={false}
      maskClosable={false}
      escToExit={false}
      visible={visible}
      onCancel={() => {
        onCancel?.();
      }}
      onOk={() => {
        form.validate().then((val) => {
          onOk?.({
            ...val,
            match: val.match
              ? { isRegExp: true, source: val.match }
              : undefined,
            id: initialValues?.id,
          });
        });
      }}
      mountOnEnter={false}
    >
      <Form form={form} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
        <FormItem field="type" label="类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择类型"
            allowClear
            options={[
              {
                label: "字符串",
                value: "string",
              },
              {
                label: "数字",
                value: "number",
              },
              {
                label: "布尔值",
                value: "boolean",
              },
              {
                label: "数组",
                value: "array",
              },
              {
                label: "对象",
                value: "object",
              },
              {
                label: "邮箱地址",
                value: "email",
              },
              {
                label: "链接",
                value: "url",
              },
              {
                label: "IP地址",
                value: "ip",
              },
            ]}
          ></Select>
        </FormItem>
        <FormItem field="required" label="必传" triggerPropName="checked">
          <Switch />
        </FormItem>
        {/* 字符串 */}
        <Form.Item<RulesProps>
          shouldUpdate={(prev, next) => prev.type !== next.type}
          noStyle
        >
          {(values) => {
            return (
              values.type === "string" && (
                <>
                  <Form.Item
                    field="match"
                    label="正则"
                    rules={[
                      {
                        validator: (val, cb) => {
                          try {
                            new RegExp(val);
                          } catch {
                            cb("请输入正确的正则");
                          }
                        },
                      },
                    ]}
                  >
                    <Input placeholder="输入正则" />
                  </Form.Item>
                  <Form.Item
                    field="uppercase"
                    label="大写"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    field="lowercase"
                    label="小写"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </>
              )
            );
          }}
        </Form.Item>
        {/* 数字 */}
        <Form.Item<RulesProps>
          shouldUpdate={(prev, next) => prev.type !== next.type}
          noStyle
        >
          {(values) => {
            return (
              values.type === "number" && (
                <>
                  <Form.Item field="min" label="最小值">
                    <InputNumber placeholder="输入最小值" />
                  </Form.Item>
                  <Form.Item field="max" label="最大值">
                    <InputNumber placeholder="输入最大值" />
                  </Form.Item>
                  <Form.Item
                    field="positive"
                    label="正数"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    field="negative"
                    label="负数"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </>
              )
            );
          }}
        </Form.Item>
        {/* 对象 */}
        <Form.Item<RulesProps>
          shouldUpdate={(prev, next) => prev.type !== next.type}
          noStyle
        >
          {(values) => {
            return (
              values.type === "object" && (
                <Form.Item field="hasKeys" label="包含的键值">
                  <InputTag placeholder="输入包含的键值" />
                </Form.Item>
              )
            );
          }}
        </Form.Item>
        {/* 数组或者字符串 */}
        <Form.Item<RulesProps>
          shouldUpdate={(prev, next) => prev.type !== next.type}
          noStyle
        >
          {(values) => {
            return (
              ["array", "string"].includes(values.type) && (
                <>
                  <Form.Item field="length" label="长度">
                    <InputNumber min={0} precision={0} placeholder="输入长度" />
                  </Form.Item>
                  <Form.Item field="minLength" label="最小长度">
                    <InputNumber
                      min={0}
                      precision={0}
                      placeholder="输入最小长度"
                    />
                  </Form.Item>
                  <Form.Item field="maxLength" label="最大长度">
                    <InputNumber
                      min={0}
                      precision={0}
                      placeholder="输入最大长度"
                    />
                  </Form.Item>
                </>
              )
            );
          }}
        </Form.Item>
        {/* 布尔值 */}
        <Form.Item<RulesProps>
          shouldUpdate={(prev, next) => prev.type !== next.type}
          noStyle
        >
          {(values) => {
            return (
              values.type === "number" && (
                <>
                  <Form.Item
                    field="true"
                    label="真的"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    field="false"
                    label="假的"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </>
              )
            );
          }}
        </Form.Item>
        <FormItem field="message" label="错误信息" className="important-mb-0">
          <Input.TextArea placeholder="输入错误信息" allowClear />
        </FormItem>
      </Form>
    </Modal>
  );
};
