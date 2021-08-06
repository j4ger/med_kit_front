<template>
  <div class="flex">
    <div v-if="globalState.user.loggedIn">
      <button
        class="
          bg-gray-700
          p-2
          rounded-lg
          flex
          items-baseline
          w-28
          overflow-hidden
        "
        @click="showManageDrawer = true"
      >
        <n-tag size="small" :type="getRole().type">{{ getRole().title }}</n-tag>
        <p class="truncate text-white font-bold ml-2">
          {{ globalState.user.username }}
        </p>
      </button>
    </div>
    <div v-else>
      <n-button @click="showLoginDrawer = true">
        <template #icon
          ><n-icon color="white"> <LogIn /></n-icon
        ></template>
        <p class="text-white">登录</p>
      </n-button>
    </div>
  </div>
  <Teleport to="#globalRoot">
    <n-drawer
      v-model:show="showLoginDrawer"
      placement="top"
      :height="300"
      class="z-20"
    >
      <n-drawer-content class="containter mx-auto">
        <template #header>
          <div class="container mx-auto">
            <div class="flex">
              <n-icon><AccountCircleOutlined /></n-icon>
              <p class="ml-4">登录</p>
            </div>
          </div>
        </template>
        <div>
          <n-form
            :model="loginData"
            label-placement="left"
            :label-width="75"
            :rules="rules"
          >
            <n-form-item label="用户名" path="username">
              <n-input placeholder="" v-model:value="loginData.username">
              </n-input>
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input
                placeholder=""
                v-model:value="loginData.password"
                type="password"
                show-password-toggle
              >
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-button @click="login" attr-type="button">登录</n-button>
              <n-button
                @click="register"
                attr-type="button"
                color="#F2C97D"
                ghost
                class="ml-4"
                >注册</n-button
              >
            </n-form-item>
          </n-form>
        </div>
      </n-drawer-content>
    </n-drawer>
  </Teleport>

  <Teleport to="#globalRoot">
    <n-drawer
      v-model:show="showManageDrawer"
      placement="top"
      :height="300"
      class="z-20"
    >
      <n-drawer-content class="container mx-auto">
        <template #header>
          <div class="flex items-center" v-if="globalState.user.loggedIn">
            <n-icon><ManageAccountsOutlined /></n-icon>
            <p class="ml-4">管理：</p>
            <n-tag size="small" :type="getRole().type">{{
              getRole().title
            }}</n-tag>
            <p class="truncate text-white font-bold ml-2">
              {{ globalState.user.username }}
            </p>
          </div>
        </template>
        <div>
          <n-button type="error" ghost @click="logout">
            <template #icon>
              <n-icon color="white"> <LogOutOutlined /></n-icon>
            </template>
            登出
          </n-button>
          <n-button
            type="info"
            ghost
            @click="showChangePasswordDrawer = true"
            class="ml-4"
          >
            <template #icon>
              <n-icon color="white"> <PasswordOutlined /></n-icon>
            </template>
            更改密码
          </n-button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </Teleport>

  <Teleport to="#globalRoot">
    <n-drawer
      v-model:show="showChangePasswordDrawer"
      placement="top"
      :height="280"
      class="z-30"
    >
      <n-drawer-content>
        <n-form
          :model="changePasswordData"
          label-placement="left"
          :label-width="75"
          :rules="rules"
        >
          <n-form-item label="新密码" path="password">
            <n-input
              placeholder=""
              v-model:value="changePasswordData.password"
              type="password"
              show-password-toggle
            >
            </n-input>
          </n-form-item>
          <n-form-item label="确认密码" path="confirmPassword">
            <n-input
              placeholder=""
              v-model:value="changePasswordData.confirmPassword"
              type="password"
              show-password-toggle
            >
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button @click="changePassword" attr-type="button">确认</n-button>
          </n-form-item>
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </Teleport>
</template>

<script setup>
import { LogIn } from "@vicons/ionicons5";
import {
  AccountCircleOutlined,
  ManageAccountsOutlined,
  LogOutOutlined,
  PasswordOutlined,
} from "@vicons/material";
import {
  NButton,
  NIcon,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NTag,
} from "naive-ui";

import { inject, ref } from "vue";
const medKitApi = inject("api");

import { useGlobalState } from "../GlobalState";
const globalState = useGlobalState();

const showLoginDrawer = ref(false);

import { useRoute } from "vue-router";
const route = useRoute();

const loginState = await medKitApi("/user/verify_login");
if (loginState.success) {
  globalState.user = {
    username: loginState.data.username,
    user_role: loginState.data.user_role,
    loggedIn: true,
  };
} else {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    console.log("isWechat");
    const wechat_code = route.query.code;
    if (wechat_code) {
      const result = await medKitApi("/user/wechat_login", "POST", {
        code: wechat_code,
      });
      if (result.success) {
        globalState.user = {
          username: result.data.username,
          user_role: result.data.user_role,
          loggedIn: true,
        };
      }
    } else {
      const target_url =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc501b510444881e2&redirect_uri=" +
        encodeURI(window.location.href) +
        "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
      window.location.href = target_url;
    }
  } else {
    showLoginDrawer.value = true;
  }
}
globalState.user.fetched = true;

const loginData = ref({ username: "", password: "" });

const login = async () => {
  const result = await medKitApi("/user/login", "POST", loginData.value);
  if (result.success == true) {
    globalState.user = {
      username: result.data.username,
      user_role: result.data.user_role,
      loggedIn: true,
    };
    showLoginDrawer.value = false;
  }
};

const register = async () => {
  const result = await medKitApi("/user/register", "POST", loginData.value);
  if (result.success == true) {
    globalState.user = {
      username: result.data.username,
      user_role: result.data.user_role,
      loggedIn: true,
    };
    showLoginDrawer.value = false;
  }
};

const getRole = () => {
  const dict = {
    Admin: { title: "管理员", type: "error" },
    Staff: { title: "员工", type: "info" },
    User: { title: "客户", type: "success" },
  };
  return dict[globalState.user.user_role];
};

const showManageDrawer = ref(false);

const logout = async () => {
  const result = await medKitApi("/user/logout");
  if (result.success) {
    showManageDrawer.value = false;
    globalState.user = {
      username: "",
      user_role: "",
      loggedIn: false,
    };
  }
};

const showChangePasswordDrawer = ref(false);

const changePasswordData = ref({ password: "", confirmPassword: "" });

const rules = {
  password: [
    { required: true, message: "请输入密码", trigger: ["input", "blur"] },
  ],
  username: [
    { required: true, message: "请输入用户名", trigger: ["input", "blur"] },
  ],
  confirmPassword: [
    {
      required: true,
      message: "请再输一次密码",
      trigger: ["input", "blur"],
    },
    {
      validator: () =>
        changePasswordData.value.confirmPassword ==
        changePasswordData.value.password,
      message: "两次密码不一致",
      trigger: ["blur", "password-input"],
    },
  ],
};

const changePassword = async () => {
  const result = await medKitApi("/user/change_password", "POST", {
    username: globalState.user.username,
    password: changePasswordData.value.password,
  });
  if (result.success) {
    showChangePasswordDrawer.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
