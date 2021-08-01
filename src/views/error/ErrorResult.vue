<template>
  <div>
    <n-result
      :status="props.status"
      :title="props.messages.title"
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

const props = defineProps({ status: String, messages: Object });
</script>

<style lang="scss" scoped></style>
