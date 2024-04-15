<template>
  <div class="recent-picker">
    <Input
      v-model="dateValue"
      :min="1"
      :placeholder="t('请输入')"
      :precision="0"
      :prefix="type === 'now-' ? t('最近') : t('未来')"
      class="recent-input"
      type="number"
    />
    <Select
      v-model="recentUnit"
      :clearable="false"
      :popover-options="{ boundary: 'parent' }"
      class="recent-unit"
      filterable
    >
      <Select.Option
        v-for="item in DateUnitList"
        :id="item.id"
        :key="item.id"
        :name="item.name"
      />
    </Select>
    <CommonSubmit
      :disabled="!canSubmit"
      @submit="handleSubmit"
    />
  </div>
</template>
<script setup lang="ts">
import { Input, Select } from 'bkui-vue';
import { computed, ref, watch } from 'vue';

import { t } from '../lang/lang';
import {
  DateMode,
  type DateUnit,
  DateUnitList,
  type FutureDateValue,
  NowConstant,
  type RecentDateValue,
} from '../utils';
import { DateRange } from '../utils/date';
import CommonSubmit from './common-submit.vue';

interface IProps {
  type: DateMode.FUTURE | DateMode.RECENT;
  value?: DateRange;
}

const emits = defineEmits<(e: 'change', value: FutureDateValue | RecentDateValue) => void>();
const props = withDefaults(defineProps<IProps>(), {
  type: DateMode.RECENT,
});
const recentUnit = ref<DateUnit>('m');
const dateValue = ref<number>();
watch(
  () => props.value,
  val => {
    if (!val) return;
    if (props.type !== val.dateMode) return;
    recentUnit.value = val.recentOrFuturedateUnit!;
    dateValue.value = val.recentOrFuturedateNum || undefined;
  },
  {
    immediate: true,
  },
);
const canSubmit = computed(() => !!dateValue.value && !!recentUnit.value);
const handleSubmit = () => {
  if (!dateValue.value) return;
  if (props.type === DateMode.FUTURE) {
    emits('change', [NowConstant, `${DateMode.FUTURE}${dateValue.value}${recentUnit.value}`]);
    return;
  }
  emits('change', [`${DateMode.RECENT}${dateValue.value}${recentUnit.value}`, NowConstant]);
};
</script>
<style lang="scss">
.recent-picker {
  display: flex;
  align-items: center;
  min-height: 56px;

  .recent-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    &.is-focused {
      z-index: 2;
    }
  }

  .recent-unit {
    width: 164px;
    .#{$bk-prefix}-input {
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      &--text {
        border-radius: 0;
      }
    }
  }
}
</style>
