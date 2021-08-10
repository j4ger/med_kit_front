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
          <AccessTimeOutlined
            v-else-if="productDigest.data.current_stage == 'Sampled'"
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
        <div class="flex space-x-2">
          <n-button
            type="primary"
            @click="gotoSubmit"
            size="large"
            v-if="productDigest.data.current_stage == 'Initialized'"
            v-show="showSubmitButton"
            >填写档案
          </n-button>
          <n-popselect
            v-if="existingProfiles.success"
            v-model:value="selectedProfile"
            :options="profileOptions"
            trigger="click"
            :scrollable="true"
          >
            <n-button
              type="info"
              size="large"
              v-if="productDigest.data.current_stage == 'Initialized'"
              >{{
                selectedProfile ? selectedProfileObject.name : "绑定已有档案"
              }}
            </n-button>
          </n-popselect>
          <n-button
            type="primary"
            @click="showBindProfileModal = true"
            size="large"
            v-show="!showSubmitButton"
            >绑定
          </n-button>
          <n-modal
            v-model:show="showBindProfileModal"
            preset="dialog"
            title="确认绑定"
            positive-text="确认"
            @positive-click="handleBindProfile"
            negative-text="取消"
          >
            <n-h4 prefix="bar" align-text>
              <n-text type="primary">姓名 </n-text>
              {{ selectedProfileObject.name }}
            </n-h4>
            <n-h4 prefix="bar" align-text>
              <n-text type="primary">身份证号 </n-text>
              {{ selectedProfileObject.id_card_number }}
            </n-h4>
            <n-h4 prefix="bar" align-text>
              <n-text type="primary">手机号码 </n-text>
              {{ selectedProfileObject.phone }}
            </n-h4>
            <n-h4 prefix="bar" align-text>
              <n-text type="primary">地址 </n-text>
              {{ selectedProfileObject.address }}
            </n-h4>
            <n-h4 prefix="bar" align-text>
              <n-text type="primary">出生年月日 </n-text>
              <n-time :time="selectedProfileObject.birth_date_time" />
            </n-h4>
          </n-modal>
          <n-button
            type="primary"
            @click="showSampleTimeSelect = true"
            size="large"
            v-if="productDigest.data.current_stage == 'Submitted'"
            >提交采样时间
          </n-button>
          <n-modal
            v-model:show="showSampleTimeSelect"
            preset="dialog"
            title="提交采样时间"
            positive-text="确认"
            @positive-click="handleSubmitSampleTime"
            negative-text="取消"
          >
            <n-date-picker
              v-model:value="sampleTime"
              type="datetime"
              clearable
            />
          </n-modal>
          <n-button
            type="primary"
            @click="downloadReport"
            size="large"
            v-if="productDigest.data.current_stage == 'Finished'"
            >下载报告
          </n-button>
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {
  NCard,
  NIcon,
  NTime,
  NButton,
  NH4,
  NText,
  NPopselect,
  NModal,
  NDatePicker,
} from "naive-ui";
import {
  ArrowCircleDownOutlined,
  ArrowCircleUpOutlined,
  CheckCircleOutlined,
  AccessTimeOutlined,
} from "@vicons/material";

import { inject } from "vue";
const medKitApi = inject("api");

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const productBarcode = useRoute().params.product_barcode;

const productDigest = ref(
  await medKitApi("/product/get_product_digest/" + productBarcode)
);

if (!productDigest.value.success) {
  router.push({ path: "/error/404" });
}

const getState = () => {
  const dict = {
    Initialized: "未登记",
    Submitted: "待采集",
    Sampled: "待处理",
    Finished: "已完成",
  };
  return dict[productDigest.value.data.current_stage];
};

import { useNow } from "@vueuse/core";
const now = useNow();
const getTime = (rawTime) => {
  return Date.parse(rawTime) - new Date().getTimezoneOffset() * 60000;
};
const init_time = getTime(productDigest.value.data.init_time);

const gotoSubmit = () => {
  router.push({
    path: "/profile/submit",
    params: { product_barcode: productBarcode },
  });
};

import { ref } from "vue";
const existingProfiles = await medKitApi("/profile/get_profile_by_user");
const selectedProfile = ref(null);
const selectedProfileObject = ref(null);
const profileOptions = [];
existingProfiles.data.forEach((profile) => {
  const newOption = { label: profile.name, value: profile.id };
  profileOptions.push(newOption);
});

const showSubmitButton = ref(true);

import { watchEffect } from "vue";
watchEffect(() => {
  if (selectedProfile.value) {
    existingProfiles.data.forEach((option) => {
      if (option.id == selectedProfile.value) {
        selectedProfileObject.value = option;
        console.log(option.birth_date);
        selectedProfileObject.value.birth_date_time = getTime(
          option.birth_date
        );
      }
    });
    showSubmitButton.value = false;
  }
});

const showBindProfileModal = ref(false);

const handleBindProfile = async () => {
  const result = await medKitApi(
    "/profile/bind_profile/" + productBarcode,
    "POST",
    {
      profile_id: selectedProfileObject.value.id,
    }
  );
  if (result.success) {
    showBindProfileModal.value = false;
    productDigest.value = await medKitApi(
      "/product/get_product_digest/" + productBarcode
    );
  }
};

const sampleTime = ref(null);
const showSampleTimeSelect = ref(false);

const handleSubmitSampleTime = async () => {
  const result = await medKitApi(
    "/product/submit_sample_time/" + productBarcode,
    "POST",
    {
      sample_time: sampleTime.value,
    }
  );
  if (result.success) {
    showSampleTimeSelect.value = false;
    productDigest.value = await medKitApi(
      "/product/get_product_digest/" + productBarcode
    );
  }
};

const downloadReport = async () => {
  const report = await medKitApi(
    "/report/get_report/" + productDigest.value.data.report_id
  );
  if (report.success) {
    const downloadElement = document.createElement("a");
    downloadElement.download = productBarcode + "-检测报告.pdf";
    downloadElement.href = report.data;
    downloadElement.click();
  }
};
</script>

<style lang="scss" scoped></style>
