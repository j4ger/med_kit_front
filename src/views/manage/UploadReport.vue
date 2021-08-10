<template>
  <div>
    <n-badge :value="badgeText" :type="badgeType">
      <n-h1 prefix="bar">
        <n-text strong>{{ productBarcode }}</n-text>
      </n-h1>
    </n-badge>
    <n-upload
      accept=".pdf"
      :multiple="false"
      @change="handleFileChange"
      :default-upload="false"
    >
      <n-upload-dragger>
        <div class="mb-3">
          <n-icon size="48">
            <UploadFileOutlined />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">点击或者拖动文件到该区域来上传</n-text>
        <n-p class="mt-1">报告将被统一命名，因此文件名不重要</n-p>
      </n-upload-dragger>
    </n-upload>
    <n-alert
      class="mt-2"
      title="错误"
      type="error"
      v-show="!validFile & showAlert"
    >
      每个产品只能对应一份报告
    </n-alert>
    <n-button
      type="primary"
      @click="handleSubmit"
      v-show="validFile"
      size="medium"
      class="mt-2"
    >
      <template #icon>
        <n-icon>
          <SendOutlined />
        </n-icon>
      </template>
      上传
    </n-button>
  </div>
</template>

<script setup>
import {
  NH1,
  NText,
  NUpload,
  NUploadDragger,
  NP,
  NIcon,
  NBadge,
  NButton,
  NAlert,
} from "naive-ui";
import { UploadFileOutlined, SendOutlined } from "@vicons/material";

import { useRoute, useRouter } from "vue-router";
const productBarcode = useRoute().params.product_barcode;
const router = useRouter();

if (!productBarcode) {
  router.replace({ path: "/error/404" });
}

import { inject } from "vue";
const medKitApi = inject("api");

const productDigest = await medKitApi("/product/get_product/" + productBarcode);
const reportExists = !!productDigest.data.report_id;
const badgeText = reportExists ? "报告已存在" : "报告待上传";
const badgeType = reportExists ? "info" : "error";

import { ref } from "vue";
const validFile = ref(false);
const selectedFile = ref(null);
const showAlert = ref(false);

const handleFileChange = ({ fileList }) => {
  if (fileList.length == 1) {
    validFile.value = true;
    selectedFile.value = fileList[0].file;
  } else {
    validFile.value = false;
    showAlert.value = true;
  }
};
showAlert.value = false;

const handleSubmit = async () => {
  const moreOptions = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: selectedFile.value,
  };
  const result = await medKitApi(
    "/report/upload_report/" + productBarcode,
    "POST",
    undefined,
    moreOptions
  );
  if (result.success) {
    router.replace({ path: "/manage/products" });
  }
};
</script>

<style lang="scss" scoped></style>
