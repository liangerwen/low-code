import {
  AutoComplete,
  Button,
  ButtonProps,
  Cascader,
  Checkbox,
  DatePicker,
  TimePicker,
  Form,
  FormInstance,
  FormItemProps,
  FormProps,
  Input,
  InputNumber,
  InputTag,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  Transfer,
  TreeSelect,
  Upload,
  Grid,
} from "@arco-design/web-react";
import classNames from "classnames";
import { forwardRef, useCallback, useMemo } from "react";

const { TextArea, Password } = Input;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const useForm = Form.useForm;

type FooterType = {
  submit: ButtonProps;
  reset: ButtonProps;
  align?: "left" | "right" | "content";
};
export type FieldType = {
  id: string;
  name: string;
  label: string;
  type:
    | "Cascader"
    | "Checkbox"
    | "DatePicker"
    | "TimePicker"
    | "Input"
    | "InputPassword"
    | "InputAutoComplete"
    | "InputTextAreaAutoComplete"
    | "InputTextArea"
    | "InputTag"
    | "InputNumber"
    | "Mentions"
    | "Radio"
    | "Rate"
    | "Select"
    | "Slider"
    | "Switch"
    | "Transfer"
    | "TreeSelect"
    | "Upload";
  span?: number;
  props?: Record<string, any>;
} & Omit<FormItemProps, "field" | "label">;

export type ProFormProps = {
  fields: FieldType[];
  footer?: boolean | FooterType;
} & FormProps;

export default forwardRef<
  FormInstance<any, any, string | number | symbol>,
  ProFormProps
>(function (props, ref) {
  const { fields, footer, onReset, ...rest } = props;
  const [form] = useForm();

  const renderFields = useCallback(
    (fields) =>
      fields.map((field, idx) => {
        const { type, name, label, props, span = 24, ...rest } = field;
        let fieldComponent;
        switch (type) {
          case "Cascader":
            fieldComponent = <Cascader {...props} />;
            break;
          case "Checkbox":
            fieldComponent = <Checkbox.Group {...props} />;
            break;
          case "Radio":
            fieldComponent = <Radio.Group {...props} />;
            break;
          case "DatePicker":
            fieldComponent = <DatePicker {...props} />;
            break;
          case "TimePicker":
            fieldComponent = <TimePicker {...props} />;
            break;
          case "Input":
            fieldComponent = <Input {...props} />;
            break;
          case "InputPassword":
            fieldComponent = <Password {...props} />;
            break;
          case "InputAutoComplete":
            fieldComponent = <AutoComplete {...props} />;
            break;
          case "InputTextAreaAutoComplete":
            fieldComponent = (
              <AutoComplete {...props} triggerElement={<TextArea />} />
            );
            break;
          case "InputTextArea":
            fieldComponent = <TextArea {...props} />;
            break;
          case "InputTag":
            fieldComponent = <InputTag {...props} />;
            break;
          case "InputNumber":
            fieldComponent = <InputNumber {...props} />;
            break;
          case "Mentions":
            fieldComponent = <Mentions {...props} />;
            break;
          case "Rate":
            fieldComponent = <Rate {...props} />;
            break;
          case "Select":
            fieldComponent = <Select {...props} />;
            break;
          case "Slider":
            fieldComponent = <Slider {...props} />;
            break;
          case "Switch":
            fieldComponent = <Switch {...props} />;
            break;
          case "Transfer":
            fieldComponent = <Transfer {...props} />;
            break;
          case "TreeSelect":
            fieldComponent = <TreeSelect {...props} />;
            break;
          case "Upload":
            fieldComponent = <Upload {...props} />;
            break;
          default:
            break;
        }
        return (
          <Col key={idx}>
            <FormItem {...rest} field={name} label={label}>
              {fieldComponent}
            </FormItem>
          </Col>
        );
      }),
    []
  );

  const defaultSubmitProps = useMemo<ButtonProps>(
    () => ({
      children: "提 交",
      type: "primary",
      htmlType: "submit",
    }),
    []
  );
  const defaultResetProps = useMemo<ButtonProps>(
    () => ({
      children: "重 置",
      htmlType: "reset",
    }),
    []
  );
  const footerWithDefault = useMemo<FooterType>(() => {
    if (footer === true || footer === undefined) {
      return {
        submit: defaultSubmitProps,
        reset: defaultResetProps,
      };
    }
    if (footer === false) return null;
    let f = footer;
    if (footer && (footer.submit === true || footer.submit === undefined)) {
      f = {
        ...f,
        submit: defaultSubmitProps,
      };
    }
    if (footer && (footer.reset === true || footer.reset === undefined)) {
      f = {
        ...f,
        reset: defaultResetProps,
      };
    }
    return f as FooterType;
  }, [footer]);

  return (
    <Form
      ref={ref}
      form={form}
      {...rest}
      onReset={(...args) => {
        onReset?.(...args);
        form.resetFields();
      }}
    >
      <Row>{renderFields(fields)}</Row>
      {footerWithDefault && (
        <FormItem
          className={classNames(
            {
              "justify-end":
                footerWithDefault.align === "content" ||
                footerWithDefault.align === "right",
            },
            "important-mb-0"
          )}
        >
          <Space
            className={classNames({
              "w-full justify-end": footerWithDefault.align === "right",
            })}
          >
            {footerWithDefault.submit && (
              <Button {...footerWithDefault.submit}></Button>
            )}
            {footerWithDefault.reset && (
              <Button {...footerWithDefault.reset}></Button>
            )}
          </Space>
        </FormItem>
      )}
    </Form>
  );
});
