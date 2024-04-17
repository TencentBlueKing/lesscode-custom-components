<template>
  <div class="app">
    <CrontabPicker></CrontabPicker>
  </div>
</template>
<script setup lang="ts">
import CrontabPicker from '../src/vue3';
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;
}
</style>
