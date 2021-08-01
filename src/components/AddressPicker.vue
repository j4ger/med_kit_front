<template>
  <div class="flex flex-col lg:flex-row flex-grow">
    <n-cascader
      v-model:value="cascaderValue"
      placeholder="选择地区"
      separator="-"
      :clearable="true"
      :leaf-only="true"
      :options="options"
      ref="cascade"
    ></n-cascader>
    <n-input
      class="mt-1 lg:mt-0 ml-0 lg:ml-1"
      v-model:value="inputValue"
    ></n-input>
  </div>
</template>

<script setup>
import { NCascader, NInput } from "naive-ui";

import { AddressData } from "../AddressData";

import { ref } from "vue";
let cascaderValue = ref("");
let inputValue = ref("");

const buildOptions = (code) => {
  const children = AddressData[code];
  if (!children) {
    return null;
  } else {
    const options = [];
    for (const [inner_code, name] of Object.entries(children)) {
      const new_option = {
        label: name,
        value: inner_code,
      };
      if (inner_code != code) {
        const inner_children = buildOptions(inner_code);
        if (inner_children) {
          new_option.children = inner_children;
        }
      }
      options.push(new_option);
    }
    return options;
  }
};

const options = buildOptions(100000);

import { defineProps } from "vue";
defineProps({ modelValue: String });

import { defineEmits, watchEffect } from "vue";
const emit = defineEmits(["update:value"]);

watchEffect(() => {
  let county = "";
  let city_code = null;
  let city = "";
  let province_code = null;
  let province = "";
  loop1: for (const [code, inner] of Object.entries(AddressData)) {
    for (const [inner_code, inner_name] of Object.entries(inner)) {
      if (inner_code == cascaderValue.value) {
        county = inner_name;
        city_code = code;

        break loop1;
      }
    }
  }
  loop1: for (const [code, inner] of Object.entries(AddressData)) {
    for (const [inner_code, inner_name] of Object.entries(inner)) {
      if (inner_code == city_code) {
        city = inner_name;
        province_code = code;

        break loop1;
      }
    }
  }
  loop1: for (const [, inner] of Object.entries(AddressData)) {
    for (const [inner_code, inner_name] of Object.entries(inner)) {
      if (inner_code == province_code) {
        province = inner_name;

        break loop1;
      }
    }
  }

  const modelValue = cascaderValue.value
    ? province + "-" + city + "-" + county + " " + inputValue.value
    : "";
  emit("update:value", modelValue);
});
</script>

<style lang="scss" scoped></style>
