<template>
  <div class="app">
    <DatePicker
      :common-use-list="commonUseList"
      @update:model-value="handleValueChange"
      v-model="value"
      v-model:timezone="timezone"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import DatePicker from '../src/vue3';
const value = ref(['now-1d', 'now']);
const timezone = ref('Asia/Shanghai');
const handleValueChange = (value: any, info: any) => {
  console.info(value, info);
};
const commonUseList = ref([]);
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;

  .search-select {
    min-width: 300px;
    margin-top: 20px;
  }
}
</style>
