<template>
  <Select
    :clearable="false"
    :filter-option="handleSearch"
    :input-search="false"
    :model-value="value"
    :no-match-text="t('无匹配数据')"
    :placeholder="t('请输入搜索（国家，城市，简称）')"
    :popover-options="{ 'ext-cls': '__bk-date-picker-popover__' }"
    :search-placeholder="t('请输入搜索（国家，城市，简称）')"
    class="timezone-picker"
    filterable
    @change="handleChange"
  >
    <template v-for="group in timezoneData">
      <template v-if="group.label.length < 1">
        <Select.Option
          v-for="item in group.options"
          v-bind="item"
          :id="item.label"
          :key="item.label"
          :name="item.label"
        >
          <div
            :class="{
              'timezone-picker-option': true,
              'is-selected': item.label === value,
            }"
          >
            <span class="option-name">{{ t('浏览器时区') }} {{ item.label }}</span>
            <span class="option-country">{{ item.country }}, {{ item.abbreviation }}</span>
            <span class="option-utc">{{ item.utc }}</span>
          </div>
        </Select.Option>
      </template>
      <template v-else>
        <Select.Group
          v-if="group.options.length"
          :key="group.label"
          :label="group.label"
        >
          <Select.Option
            v-for="item in group.options"
            v-bind="item"
            :id="item.label"
            :key="item.label"
            :name="item.label"
          >
            <div
              :class="{
                'timezone-picker-option': true,
                'is-selected': item.label === value,
              }"
            >
              <span class="option-name">{{ item.label }}</span>
              <span class="option-country">{{ item.country }}, {{ item.abbreviation }}</span>
              <span class="option-utc">{{ item.utc }}</span>
            </div>
          </Select.Option>
        </Select.Group>
      </template>
    </template>
  </Select>
</template>
<script setup lang="ts">
import { Select } from 'bkui-vue';
import { shallowRef } from 'vue';

import { t } from '../lang/lang';
import { type ITimezoneItem, getTimezoneInfoByValue, timezoneDetails } from '../utils/timezone';

const emits = defineEmits<(e: 'change', value: string, info: ITimezoneItem) => void>();
defineProps<{
  value?: string;
}>();
const timezoneData = shallowRef(timezoneDetails);
const handleChange = (val: string) => {
  const info = getTimezoneInfoByValue(val);
  emits('change', val, info);
};
const handleSearch = (keyword: string, timezone: ITimezoneItem) => {
  return (
    timezone.label?.toLowerCase().includes(keyword.toLowerCase()) ||
    timezone.country?.toLowerCase().includes(keyword.toLowerCase()) ||
    timezone.abbreviation?.toLowerCase().includes(keyword.toLowerCase()) ||
    timezone.utc?.toLowerCase().includes(keyword.toLowerCase())
  );
};
</script>
<style lang="scss">
.timezone-picker {
  width: 100%;

  &-option {
    display: flex;
    align-items: center;
    width: 100%;
    color: #63656e;

    .option-name {
      flex: 1;
    }

    .option-country {
      display: flex;
      width: 100%;
      margin-left: 6px;
      color: #999;
    }

    .option-utc {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      padding: 0 8px;
      background: #f0f1f5;
      border-radius: 2px;
    }

    &.is-selected {
      color: #3a84ff;

      .option-country {
        color: #699df4;
      }

      .option-utc {
        color: white;
        background-color: #699df4;
      }
    }
  }
}
</style>
