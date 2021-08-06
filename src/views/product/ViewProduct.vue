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
            >填写
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
            @click="showModal = true"
            size="large"
            v-show="!showSubmitButton"
            >绑定
          </n-button>
          <n-modal
            v-model:show="showModal"
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
  router.push({ name: "页面不存在" });
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
    name: "提交档案",
    params: { product_barcode: productBarcode },
  });
};
//TODO: bind profile

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

const showModal = ref(false);

const handleBindProfile = async () => {
  const result = await medKitApi(
    "/profile/bind_profile/" + productBarcode,
    "POST",
    {
      profile_id: selectedProfileObject.value.id,
    }
  );
  if (result.success) {
    showModal.value = false;
    productDigest.value = await medKitApi(
      "/product/get_product_digest/" + productBarcode
    );
  }
};
</script>

<style lang="scss" scoped></style>
