<template>
  <div>
    <n-card hoverable size="huge" :title="productDigest.data.product_barcode">
      <template #header-extra>
        <n-icon size="40">
          <ArrowCircleDownOutlined
            v-if="productDigest.data.current_stage == 'Initialized'"
          />

          <ArrowCircleUpOutlined
            v-else-if="productDigest.data.current_stage == 'Submitted'"
          />
          <CheckCircleOutlined v-else />
        </n-icon>
      </template>
      <n-h4 prefix="bar" align-text>
        <n-text type="primary">目前状态 </n-text>
        {{ getState() }}
      </n-h4>
      <n-h4 prefix="bar" align-text>
        <n-text type="primary">出厂时间 </n-text>
        <n-time :time="now" :to="init_time" type="relative" />
      </n-h4>
      <template #action>
        <n-button
          type="primary"
          @click="gotoSubmit"
          size="large"
          v-if="productDigest.data.current_stage == 'Initialized'"
          >填写</n-button
        >
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { NCard, NIcon, NTime, NButton, NH4, NText } from "naive-ui";
import {
  ArrowCircleDownOutlined,
  ArrowCircleUpOutlined,
  CheckCircleOutlined,
} from "@vicons/material";

import { inject } from "vue";
const api = inject("api");

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const productBarcode = useRoute().params.product_barcode;

const productDigest = await api(
  "/product/get_product_digest/" + productBarcode
);

if (!productDigest.success) {
  router.push({ name: "页面不存在" });
}

const getState = () => {
  const dict = {
    Initialized: "未登记",
    Submitted: "处理中",
    Finished: "已完成",
  };
  return dict[productDigest.data.current_stage];
};

import { useNow } from "@vueuse/core";
const now = useNow();
const init_time =
  Date.parse(productDigest.data.init_time) -
  new Date().getTimezoneOffset() * 60000;

const gotoSubmit = () => {
  router.push({
    name: "提交档案",
    params: { product_barcode: productBarcode },
  });
};
</script>

<style lang="scss" scoped></style>
