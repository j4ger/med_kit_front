<template>
  <n-layout has-sider :native-scrollbar="false">
    <n-layout-sider
      :native-scrollbar="false"
      collapse-mode="transform"
      :collapsed-width="10"
      :width="300"
      show-trigger="bar"
      bordered
      :show-collapsed-content="false"
    >
      <div class="p-6 flex-col divide-y-2 divide-dotted">
        <div class="hover:shadow-lg shadow-inner">
          <router-link class="flex p-4 text-lg" to="/manage/products"
            >产品管理</router-link
          >
        </div>
        <div class="hover:shadow-lg shadow-inner">
          <router-link class="flex p-4 text-lg" to="/manage/profiles"
            >档案管理</router-link
          >
        </div>
        <div class="hover:shadow-lg shadow-inner">
          <router-link
            class="flex p-4 text-lg"
            to="/manage/users"
            v-if="globalState.user.user_role == 'Admin'"
            >用户管理</router-link
          >
        </div>
      </div>
    </n-layout-sider>
    <n-layout-content :native-scrollbar="false">
      <div class="px-6 pt-4 max-w-7xl mx-auto">
        <router-view v-slot="{ Component }">
          <template v-if="Component">
            <transition mode="out-in">
              <suspense>
                <component :is="Component"></component>
                <template #fallback>
                  <div><n-spin size="large"></n-spin></div>
                </template>
              </suspense>
            </transition>
          </template>
        </router-view>
      </div>
    </n-layout-content>
  </n-layout>
</template>
<script setup>
import { NLayout, NLayoutSider, NLayoutContent, NSpin } from "naive-ui";

import { useGlobalState } from "../../GlobalState";
const globalState = useGlobalState();

import { useRouter } from "vue-router";
const router = useRouter();

if (
  !(
    globalState.user.user_role == "Staff" ||
    globalState.user.user_role == "Admin"
  )
) {
  router.push({ name: "401错误" });
}
</script>
