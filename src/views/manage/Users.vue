<template>
  <div>
    <n-list bordered>
      <template #header>
        <div class="flex justify-between items-center">
          <n-statistic label="注册用户数" :value="statistics.data.user">
            <template #prefix>
              <n-icon>
                <AccountCircleOutlined />
              </n-icon>
            </template>
            <template #suffix> / {{ statistics.data.total }} </template>
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
        <template #prefix>
          <n-icon size="40">
            <AccountCircleOutlined v-if="item.user_role == 'User'" />
            <BuildCircleOutlined v-else-if="item.user_role == 'Staff'" />
            <SupervisedUserCircleOutlined v-else />
          </n-icon>
        </template>
        <n-thing>
          <template #header>
            {{ item.username }}
          </template>
          <template #description>
            注册时间
            <n-time :time="getTime(item.sign_up_time)" type="datetime"></n-time>
          </template>
        </n-thing>
        <template #suffix>
          <n-tooltip trigger="hover" placement="left">
            <template #trigger>
              <n-button text class="text-3xl" @click="removeUser(item.id)">
                <n-icon class="rounded-full hover:bg-current">
                  <PersonRemoveAlt1Outlined />
                </n-icon>
              </n-button>
            </template>
            删除用户
          </n-tooltip>
          <n-tooltip trigger="hover" placement="left">
            <template #trigger>
              <n-button text class="text-3xl" @click="changeUserRole(item.id)">
                <n-icon class="rounded-full hover:bg-current">
                  <AdminPanelSettingsOutlined />
                </n-icon>
              </n-button>
            </template>
            修改权限
          </n-tooltip>
        </template>
      </n-list-item>
    </n-list>
    <n-modal
      v-model:show="showRemoveConfirm"
      preset="dialog"
      title="确认删除用户？"
      positive-text="确认"
      @positive-click="handleRemoveUser"
      negative-text="取消"
    >
    </n-modal>
    <n-modal
      v-model:show="showChangeRoleModal"
      preset="dialog"
      title="选择新用户类型"
      positive-text="确认"
      @positive-click="handleChangeRole"
      negative-text="取消"
    >
      <n-select v-model:value="selectedRole" :options="roleOptions" />
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
  NTooltip,
  NButton,
  NModal,
  NSelect,
} from "naive-ui";
import {
  AccountCircleOutlined,
  SupervisedUserCircleOutlined,
  BuildCircleOutlined,
  PersonRemoveAlt1Outlined,
  AdminPanelSettingsOutlined,
} from "@vicons/material";

import { inject, ref, watchEffect } from "vue";
const medKitApi = inject("api");

const statistics = await medKitApi("/user/get_statistics");
const totalPage = Math.ceil(statistics.data.total / 10);

const page = ref(1);

let items = ref(await medKitApi("/user/get_users/0"));

watchEffect(async () => {
  const conpensatedPage = page.value - 1;
  items.value = await medKitApi("/user/get_users/" + conpensatedPage);
});

//TODO: remove, change role
const getTime = (raw) =>
  Date.parse(raw) - new Date().getTimezoneOffset() * 60000;

const showRemoveConfirm = ref(false);
const showChangeRoleModal = ref(false);

const selectedUser = ref(null);

const selectedRole = ref(null);
const roleOptions = [
  { label: "普通用户", value: "User" },
  { label: "员工", value: "Staff" },
  { label: "管理员", value: "Admin" },
];

const removeUser = (userId) => {
  selectedUser.value = userId;
  showRemoveConfirm.value = true;
};
const changeUserRole = (userId) => {
  selectedUser.value = userId;
  showChangeRoleModal.value = true;
};

const handleRemoveUser = async () => {
  const result = await medKitApi("/user/remove_user", "POST", {
    user_id: selectedUser.value,
  });
  if (result.success) {
    showRemoveConfirm.value = false;
    selectedUser.value = null;
    const conpensatedPage = page.value - 1;
    items.value = await medKitApi("/user/get_users/" + conpensatedPage);
  }
};
const handleChangeRole = async () => {
  const result = await medKitApi("/user/change_user_role", "POST", {
    user_id: selectedUser.value,
    new_role: selectedRole.value,
  });
  if (result.success) {
    showChangeRoleModal.value = false;
    selectedUser.value = null;
    const conpensatedPage = page.value - 1;
    items.value = await medKitApi("/user/get_users/" + conpensatedPage);
  }
};
</script>
