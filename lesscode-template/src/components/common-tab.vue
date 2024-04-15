<template>
  <div class="common-panel-tab">
    <Tab
      :active="modelValue"
      type="unborder-card"
      @update:active="$event => $emit('update:modelValue', $event)"
    >
      <Tab.TabPanel
        v-for="item in panels"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      />
    </Tab>
    <PopConfirm
      v-if="showDeleteAll"
      :cancel-text="t('取消')"
      :confirm-text="t('确定')"
      :content="t('是否清空最近使用？')"
      :trigger="'click'"
      :width="189"
      ext-cls="__bk-date-picker-popover__ __bk-date-picker-popover-delete__"
      @confirm="$emit('confirm')"
    >
      <Del class="delete-all" />
    </PopConfirm>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';

import { PopConfirm, Tab } from 'bkui-vue';
import { Del } from 'bkui-vue/lib/icon';

import type { ICommonTabItem } from '../utils';

import { t } from '../lang/lang';
defineProps({
  /** modelValue 选中的tab */
  modelValue: {
    required: true,
    type: String,
  },
  /** panels */
  panels: {
    required: true,
    type: Array as PropType<ICommonTabItem[]>,
  },
  showDeleteAll: {
    default: false,
    type: Boolean,
  },
});
// const emits = defineEmits<{
//   confirm: [];
//   'update:modelValue': [string];
// }>();
</script>
<style lang="scss">
.common-panel-tab {
  display: flex;
  align-items: center;
  .#{$bk-prefix}-tab-header {
    /* stylelint-disable-next-line declaration-no-important */
    line-height: 20px !important;

    /* stylelint-disable-next-line declaration-no-important */
    border-bottom: 0 !important;

    .#{$bk-prefix}-tab-header-item {
      padding: 0;
      padding-bottom: 4px;
      margin-right: 28px;
    }

    &--active {
      font-weight: 700;
      color: #63656e;
    }
  }

  .#{$bk-prefix}-tab-content {
    display: none;
    width: 0;
    height: 0;
  }

  .delete-all {
    margin-left: auto;

    &:hover {
      color: #3a84ff;
      cursor: pointer;
    }
  }
}
</style>
