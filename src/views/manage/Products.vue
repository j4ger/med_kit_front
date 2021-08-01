<template>
  <div>
    <n-list bordered>
      <template #header>
        <div class="flex justify-between items-center">
          <n-statistic label="待处理产品" :value="statistics.data.sampled">
            <template #prefix>
              <n-icon>
                <AddChartOutlined />
              </n-icon>
            </template>
            <template #suffix> / {{ statistics.data.total }} </template>
          </n-statistic>
          <n-button @click="showNewProduct" round size="large" class="flex">
            <template #icon>
              <n-icon><AddBoxOutlined /></n-icon>
            </template>
            新建
          </n-button>
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
            {{ item.product_barcode }}
          </template>
          <template #header-extra>
            <n-icon size="40">
              <ArrowCircleDownOutlined
                v-if="item.current_stage == 'Initialized'"
              />
              <ArrowCircleUpOutlined
                v-else-if="item.current_stage == 'Submitted'"
              />
              <AccessTimeOutlined v-else-if="item.current_stage == 'Sampled'" />
              <CheckCircleOutlined v-else />
            </n-icon>
          </template>
          <template #description>
            出厂时间
            <n-time :time="getTime(item.init_time)" type="datetime"></n-time>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
    <n-modal v-model:show="showModal">
      <n-card title="新建产品" class="w-2/3 h-2/3">
        <div class="flex justify-center space-x-2">
          <n-button @click="newProduct" round size="large" class="flex">
            <template #icon>
              <n-icon><AddBoxOutlined /></n-icon>
            </template>
            新建
          </n-button>
          <n-button
            v-show="productDataFetched"
            @click="printProduct"
            round
            size="large"
            class="flex"
          >
            <template #icon>
              <n-icon><LocalPrintshopOutlined /></n-icon>
            </template>
            打印
          </n-button>
        </div>
        <div class="flex justify-center">
          <span class="flex">打印区域</span>
        </div>
        <div class="flex justify-center">
          <div
            class="rounded border-4 border-current border-double"
            v-show="productDataFetched"
          >
            <div id="printArea" class="flex flex-col items-center">
              <div class="flex text-black text-lg pt-2">
                请扫描二维码填写或绑定档案
              </div>
              <div class="flex">
                <canvas id="QRCodeCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </n-modal>
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
  NModal,
  NCard,
} from "naive-ui";
import {
  AddChartOutlined,
  ArrowCircleDownOutlined,
  ArrowCircleUpOutlined,
  CheckCircleOutlined,
  AccessTimeOutlined,
  AddBoxOutlined,
  LocalPrintshopOutlined,
} from "@vicons/material";

import { inject, ref, watchEffect } from "vue";
const api = inject("api");

const statistics = await api("/product/get_statistics");
const totalPage = Math.ceil(statistics.data.total / 10);

const page = ref(1);

let items = ref(await api("/product/get_products/0"));

watchEffect(async () => {
  const conpensatedPage = page.value - 1;
  items.value = await api("/product/get_products/" + conpensatedPage);
});

const getTime = (raw) =>
  Date.parse(raw) - new Date().getTimezoneOffset() * 60000;

const showModal = ref(false);

const productDataFetched = ref(false);

const showNewProduct = () => {
  productDataFetched.value = false;
  showModal.value = true;
};

import QRCode from "qrcode";
import printJS from "print-js";
const newProduct = async () => {
  const result = await api("/product/init_product");
  if (result.success) {
    const QRCodeCanvas = document.getElementById("QRCodeCanvas");
    console.log(QRCodeCanvas);
    QRCode.toCanvas(QRCodeCanvas, result.data, { errorCorrectionLevel: "Q" });
    productDataFetched.value = true;
  }
};
const printProduct = () => {
  printJS({ printable: "printArea", type: "html" });
};
</script>

<style scoped>
#printArea {
  background: rgb(255, 255, 255);
  width: 400px;
  height: 400px;
}
</style>
