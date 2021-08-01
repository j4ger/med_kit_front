<template>
  <n-config-provider
    :theme="theme"
    id="globalRoot"
    :locale="zhCN"
    :dateLocale="dateZhCN"
  >
    <nav class="fixed bg-gray-800 w-screen z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-evenly h-16">
          <div class="flex items-center w-28">
            <n-icon size="36" color="white"> <Medkit /> </n-icon>
          </div>
          <div class="flex items-baseline">
            <h1 class="text-white text-xl">{{ $route.name }}</h1>
          </div>
          <div>
            <suspense>
              <template #default> <User /></template>
              <template #fallback>
                <n-spin size="small"></n-spin>
              </template>
            </suspense>
          </div>
        </div>
      </div>
    </nav>
    <n-element
      style="background-color: var(--body-color)"
      tag="main"
      class="z-0"
      v-if="globalState.user.fetched"
    >
      <div class="container mx-auto pt-20 min-h-screen px-4">
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
    </n-element>
    <footer></footer>
  </n-config-provider>
</template>

<script setup>
import { Medkit } from "@vicons/ionicons5";
import {
  NConfigProvider,
  useOsTheme,
  darkTheme,
  NIcon,
  NSpin,
  NElement,
  zhCN,
  dateZhCN,
} from "naive-ui";
import User from "./components/User.vue";

import { useGlobalStateProvider } from "./GlobalState";
const globalState = useGlobalStateProvider({
  user: { username: null, user_role: null, loggedIn: false, fetched: false },
});

import { computed } from "vue";

const osThemeRef = useOsTheme();
const theme = computed(() => (osThemeRef.value === "dark" ? darkTheme : null));
//TODO:Footer
</script>

<style lang="scss" scoped></style>
