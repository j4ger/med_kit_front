export const formProps = {
  schema: [
    {
      key: "name",
      type: "input",
      validators: [{ required: true, message: "姓名必填" }],
      label: "姓名",
    },
    {
      key: "age",
      type: "number",
      validators: [{ required: true, message: "年龄必填" }],
      label: "年龄",
    },
    {
      key: "sample_time",
      type: "datetime",
      validators: [{ required: true, message: "采样时间必填" }],
      label: "采样时间",
    },
    {
      key: "address",
      type: "address",
      validators: [{ required: true, message: "地址必填" }],
      label: "地址",
    },
  ],
};
