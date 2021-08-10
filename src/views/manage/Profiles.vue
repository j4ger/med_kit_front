<template>
  <div>
    <n-list bordered>
      <template #header>
        <div class="flex justify-between items-center">
          <n-statistic label="档案" :value="statistics.data.total">
            <template #prefix>
              <n-icon>
                <DocumentScannerOutlined />
              </n-icon>
            </template>
          </n-statistic>
        </div>
      </template>
      <template #footer>
        <n-pagination
          v-model:page="page"
          :page-count="totalPage"
        ></n-pagination>
      </template>
      <n-list-item v-for="item in items.data" :key="item.id">
        <n-thing>
          <template #header>
            {{ item.name }}
          </template>
          <template #description>
            提交时间
            <n-time :time="getTime(item.submit_time)" type="datetime"></n-time>
          </template>
        </n-thing>
        <template #suffix>
          <n-tooltip trigger="hover" placement="left">
            <template #trigger>
              <n-button text class="text-3xl" @click="showFullProfile(item)">
                <n-icon class="rounded-full hover:bg-current">
                  <OpenInFullOutlined />
                </n-icon>
              </n-button>
            </template>
            查看详情
          </n-tooltip>
        </template>
      </n-list-item>
      <n-modal
        v-model:show="showFullProfileModal"
        title="详细信息"
        preset="card"
        style="width: 60%"
      >
        <n-h4 prefix="bar" align-text>
          <n-text type="primary">姓名 </n-text>
          {{ selectedProfile.name }}
        </n-h4>
        <n-h4 prefix="bar" align-text>
          <n-text type="primary">身份证号 </n-text>
          {{ selectedProfile.id_card_number }}
        </n-h4>
        <n-h4 prefix="bar" align-text>
          <n-text type="primary">手机号码 </n-text>
          {{ selectedProfile.phone }}
        </n-h4>
        <n-h4 prefix="bar" align-text>
          <n-text type="primary">地址 </n-text>
          {{ selectedProfile.address }}
        </n-h4>
        <n-h4 prefix="bar" align-text>
          <n-text type="primary">出生年月日 </n-text>
          <n-time
            :time="getTime(selectedProfile.submit_time)"
            type="datetime"
          ></n-time>
        </n-h4>
      </n-modal>
    </n-list>
  </div>
</template>

<script setup>
import {
  NList,
  NListItem,
  NPagination,
  NStatistic,
  NIcon,
  NTime,
  NThing,
  NButton,
  NTooltip,
  NModal,
  NH4,
  NText,
} from "naive-ui";
import { DocumentScannerOutlined, OpenInFullOutlined } from "@vicons/material";

import { inject, ref, watchEffect } from "vue";
const medKitApi = inject("api");

const statistics = await medKitApi("/profile/get_statistics");
const totalPage = Math.ceil(statistics.data.total / 10);

const page = ref(1);

let items = ref(await medKitApi("/profile/get_profiles/0"));

watchEffect(async () => {
  const conpensatedPage = page.value - 1;
  items.value = await medKitApi("/profile/get_profiles/" + conpensatedPage);
});

const getTime = (raw) =>
  Date.parse(raw) - new Date().getTimezoneOffset() * 60000;

const selectedProfile = ref(null);
const showFullProfileModal = ref(false);

const showFullProfile = (item) => {
  selectedProfile.value = item;
  showFullProfileModal.value = true;
};
</script>

<style lang="scss" scoped></style>
