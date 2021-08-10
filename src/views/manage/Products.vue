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
        <template #suffix>
          <n-tooltip trigger="hover" placement="left">
            <template #trigger>
              <n-button
                text
                class="text-3xl"
                @click="gotoUploadReport(item.product_barcode)"
              >
                <n-icon class="rounded-full hover:bg-current">
                  <FileUploadOutlined />
                </n-icon>
              </n-button>
            </template>
            上传档案
          </n-tooltip>
        </template>
      </n-list-item>
    </n-list>
    <n-modal v-model:show="showModal">
      <n-card title="新建产品" class="w-2/3 h-2/3">
        <div class="flex justify-center space-x-2" v-show="printerServiceReady">
          <n-button @click="newProduct" round size="large" class="flex">
            <template #icon>
              <n-icon><AddBoxOutlined /></n-icon>
            </template>
            新建并打印
          </n-button>
          <n-button
            v-show="newProductDataFetched"
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
        <n-alert title="错误" type="error" v-show="!printerServiceReady"
          >打印服务未启动，请检查菜鸟打印服务运行状态</n-alert
        >
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
  NTooltip,
  NAlert,
} from "naive-ui";
import {
  AddChartOutlined,
  ArrowCircleDownOutlined,
  ArrowCircleUpOutlined,
  CheckCircleOutlined,
  AccessTimeOutlined,
  AddBoxOutlined,
  LocalPrintshopOutlined,
  FileUploadOutlined,
} from "@vicons/material";

import { inject, ref, watchEffect } from "vue";
const medKitApi = inject("api");

const statistics = await medKitApi("/product/get_statistics");
const totalPage = Math.ceil(statistics.data.total / 10);

const page = ref(1);

let items = ref(await medKitApi("/product/get_products/0"));

watchEffect(async () => {
  const conpensatedPage = page.value - 1;
  items.value = await medKitApi("/product/get_products/" + conpensatedPage);
});

const getTime = (raw) =>
  Date.parse(raw) - new Date().getTimezoneOffset() * 60000;

import { useRouter } from "vue-router";
const router = useRouter();

const gotoUploadReport = (target_barcode) => {
  router.push({
    name: "上传报告",
    params: { product_barcode: target_barcode },
  });
};

const showModal = ref(false);

const printerServiceReady = ref(false);
let printerServiceSocket = null;

const newProductDataFetched = ref(false);

const showNewProduct = () => {
  newProductDataFetched.value = false;
  showModal.value = true;

  if (!printerServiceReady.value) {
    const newSocket = new WebSocket("ws://localhost:13528");
    newSocket.onopen = () => {
      printerServiceSocket = newSocket;
      printerServiceReady.value = true;

      newSocket.onclose = () => {
        printerServiceReady.value = false;
      };
      newSocket.onmessage = (event) => {
        console.log("Got WebSocket message:" + event);
      };
    };
  }
};

let createdProduct = null;
const newProduct = async () => {
  createdProduct = await medKitApi("/product/init_product");
  if (createdProduct.success) {
    newProductDataFetched.value = true;
    printProduct();
  }
};

const printProduct = () => {
  console.log("print");
  const printRequest = genPrinterRequestObject("print");
  printRequest.task = {
    taskID: genUuid(),
    // preview: true,
    // previewType: "image",
    documents: [
      {
        documentID: genUuid(),
        contents: [
          {
            data: {
              qrcodeurl: createdProduct.data,
            },
            templateURL:
              "http://cloudprint.cainiao.com/template/standard/465617/4",
          },
        ],
      },
    ],
  };
  printerServiceSocket.send(JSON.stringify(printRequest));
};

const genUuid = () =>
  "xxxxxxxx".replace(/[x]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const genPrinterRequestObject = (command) => {
  return {
    requestID: genUuid(),
    version: "1.0",
    cmd: command,
  };
};
</script>
<style></style>
