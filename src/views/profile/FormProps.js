export const formProps = {
  schema: [
    {
      key: "name",
      type: "input",
      validators: [{ required: true, message: "姓名必填" }],
      label: "姓名",
    },
    {
      key: "id_card_number",
      type: "input",
      validators: [
        { required: true, message: "身份证号必填" },
        {
          validator(rule, value) {
            return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)/.test(
              value
            );
          },
          message: "身份证号格式错误",
        },
      ],
      label: "身份证号",
    },
    {
      key: "birth_date",
      type: "datetime",
      validators: [{ required: true, message: "出生年月日必填" }],
      label: "出生年月日",
    },
    {
      key: "profession",
      type: "select",
      validators: [{ required: true, message: "职业必填" }],
      label: "职业",
      options: [
        {
          label: "国家机关、党群组织、企业、事业单位负责人",
          value: "国家机关、党群组织、企业、事业单位负责人",
        },
        { label: "专业技术人员", value: "专业技术人员" },
        { label: "办事人员和有关人员", value: "办事人员和有关人员" },
        { label: "商业、服务业人员", value: "商业、服务业人员" },
        {
          label: "农、林、牧、渔、水利业生产人员",
          value: "农、林、牧、渔、水利业生产人员",
        },
        {
          label: "生产、运输设备操作人员及有关人员",
          value: "生产、运输设备操作人员及有关人员",
        },
        { label: "军人", value: "军人" },
        { label: "不便分类的其他从业人员", value: "不便分类的其他从业人员" },
      ],
    },
    {
      key: "address",
      type: "address",
      validators: [{ required: true, message: "常驻地址必填" }],
      label: "常驻地址",
    },
    {
      key: "phone",
      type: "input",
      validators: [
        { required: true, message: "电话号码必填" },
        {
          validator(rule, value) {
            return /(^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$)/.test(
              value
            );
          },
          message: "手机号码格式错误",
        },
      ],
      label: "电话号码",
    },
  ],
};
