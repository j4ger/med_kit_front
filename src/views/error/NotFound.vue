<template>
  <div>
    <n-result
      status="404"
      title="404 资源不存在"
      :description="props.messages.first"
    >
      <template #footer>
        <p>{{ props.messages.second }}</p>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { NResult } from "naive-ui";
import { defineProps } from "vue";

const props = defineProps({ messages: Object });
</script>

<style lang="scss" scoped></style>
