<template>
  <div>
    <div>
      <n-form
        :label-width="100"
        label-placement="top"
        :model="values"
        :rules="formProps.rules"
        ref="formRef"
      >
        <n-form-item
          v-for="(item, index) in formProps.schema"
          :label="item.label"
          :path="item.key"
          :key="index"
        >
          <component
            :is="getInnerComponent(item.type)"
            v-model:value="values[item.key]"
            :options="item.options"
            :type="item.type == 'datetime' ? 'datetime' : undefined"
          ></component>
        </n-form-item>
      </n-form>
      <n-button type="primary" @click="submit" size="medium">
        <template #icon>
          <n-icon>
            <SendOutlined />
          </n-icon> </template
        >提交
      </n-button>
    </div>
  </div>
</template>

<script setup>
import {
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NDatePicker,
  NSelect,
  NCheckbox,
  NButton,
  NIcon,
  NInputNumber,
} from "naive-ui";
import { SendOutlined } from "@vicons/material";
import AddressPicker from "../../components/AddressPicker.vue";

const getInnerComponent = (type) => {
  const dict = {
    input: NInput,
    switch: NSwitch,
    checkbox: NCheckbox,
    select: NSelect,
    datetime: NDatePicker,
    number: NInputNumber,
    address: AddressPicker,
  };
  return dict[type];
};

// Form schema declaration
import { formProps } from "./FormProps";
import { ref, inject } from "vue";

// Post processes
const rules = {};
const null_values = {};
formProps.schema.forEach((item) => {
  if (item.validators) {
    rules[item.key] = item.validators;
  }
  null_values[item.key] = null;
});
formProps.rules = rules;
const values = ref(null_values);
const formRef = ref(null);

const toast = inject("toast");

const medKitApi = inject("api");

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const productBarcode = useRoute().params.product_barcode;

const submit = async () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const path =
        "/profile/submit_profile" +
        (productBarcode ? "/" + productBarcode : "");
      const result = await medKitApi(path, "POST", values.value);
      if (result.success) {
        if (productBarcode) {
          router.replace({
            name: "查看产品信息",
            params: { product_barcode: productBarcode },
          });
        } else {
          router.push({
            name: "查看档案",
          });
        }
      }
    } else {
      errors.flat().forEach((item) => toast.error(item.message));
    }
  });
};
</script>

<style lang="scss" scoped></style>
