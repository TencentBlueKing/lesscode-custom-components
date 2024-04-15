<template>
  <div class="panel-wrapper">
    <CommonTab
      v-model="activePanel"
      :panels="panels"
      :show-delete-all="activePanel === 'recent' && !!recentUseList.length"
      @confirm="handleDeleteConfirm"
    />
    <ul
      v-if="dateList.length"
      class="common-date-list"
    >
      <li
        v-for="(date, index) in dateList"
        :key="index"
        :class="{
          'list-item': true,
          'is-recent-item': activePanel === 'recent',
          'is-selected': isSameDateRange(date, defaultDate),
        }"
        @click="handleChange(date.dateValue)"
      >
        {{ date.toDisplayString() }}
      </li>
    </ul>
    <div
      v-else
      class="common-wrapper"
    >
      <Exception
        class="empty-content"
        scene="part"
        type="empty"
      />
      <div class="empty-tips">
        {{ activePanel === 'recent' ? t('暂无最近使用记录') : t('暂无常用时间') }}
      </div>
    </div>
    <CommonTab
      :model-value="activeDatePickTab"
      :panels="datePickTabList"
      class="date-pick-tab"
      @update:model-value="handleDateTabChange"
    />
    <KeepAlive>
      <component
        :is="getComponent()"
        :key="activeDatePickTab"
        :type="activeDatePickTab"
        :value="defaultDate"
        @change="handleChange"
      />
    </KeepAlive>
    <div
      v-if="needTimezone"
      class="time-zone-panel"
    >
      {{ timezoneInfo.label === browserTimezone ? t('浏览器时区') : '' }}
      <span class="time-zone"
        >{{ timezoneInfo.label }}
        <span class="time-zone-area">{{ timezoneInfo.country }}, {{ timezoneInfo.abbreviation }}</span></span
      >
      <span class="time-zone-tag">{{ timezoneInfo.utc }}</span>
      <Button
        class="time-zone-btn"
        size="small"
        @click="handleToggleTimezoneSet"
      >
        {{ t('时区设置') }}
      </Button>
    </div>
    <div
      v-show="timezoneSet"
      class="time-zone-picker"
    >
      <TimezonePicker
        :value="timezone || browserTimezone"
        @change="handleTimezoneChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Button, Exception } from 'bkui-vue';
import dayjs from 'dayjs';
import { computed, ref, shallowRef } from 'vue';

import { t } from '../lang/lang';
import {
  DateMode,
  type DateValue,
  commonDateList,
  datePickTabList,
  getStoreTabKey,
  panels,
  useDatePickertInject,
} from '../utils';
import { DateRange } from '../utils/date';
import { getStoreDateList } from '../utils/store';
import { type ITimezoneItem } from '../utils/timezone';
import CommonTab from './common-tab.vue';
import DatePicker from './date-picker.vue';
import NaturalPicker from './natural-picker.vue';
import RecentPicker from './recent-picker.vue';
import TimezonePicker from './timezone-picker.vue';

const props = defineProps<{
  defaultDate: DateRange;
  needTimezone?: boolean;
  timezone?: string;
}>();
const { commonUseList, format, storeKey, timezoneInfo, version } = useDatePickertInject()!;
const emits = defineEmits<{
  (e: 'change', value: DateValue): void;
  (e: 'update:timezone', value: string, timezoneInfo: ITimezoneItem): void;
}>();
const timezoneSet = ref(false);
const activePanel = ref('common');
const defaultTabKey = computed(() => {
  const tab = localStorage.getItem(getStoreTabKey(version.value)) as DateMode;
  if (!tab) return DateMode.Date; // 没有存储历史 则默认 date 类型
  if (Object.values(DateMode).includes(tab)) {
    return tab;
  }
  return null;
});
const activeDatePickTab = ref<DateMode>(props.defaultDate.dateMode || defaultTabKey.value);
const browserTimezone = dayjs.tz.guess();
const recentUseList = shallowRef(getStoreDateList(storeKey.value));
const dateList = computed(() =>
  (activePanel.value === 'common' ? commonUseList.value || commonDateList : recentUseList.value).map(
    date => new DateRange(date, format.value, props.timezone),
  ),
);
const handleChange = (date: DateValue) => {
  emits('change', date);
};
const getComponent = () => {
  switch (activeDatePickTab.value) {
    case DateMode.RECENT:
    case DateMode.FUTURE:
      return RecentPicker;
    case DateMode.NATURAL:
      return NaturalPicker;
    case DateMode.Date:
    default:
      return DatePicker;
  }
};
const handleToggleTimezoneSet = () => {
  timezoneSet.value = !timezoneSet.value;
};
const handleTimezoneChange = (v: string, info: ITimezoneItem) => {
  emits('update:timezone', v, info);
};
const handleDateTabChange = (v: DateMode) => {
  activeDatePickTab.value = v;
  localStorage.setItem(getStoreTabKey(version.value), v);
};
const isSameDateRange = (date1: DateRange, date2: DateRange) => {
  if (!date1 || !date2) return false;
  if (date1.dateValue?.join?.('~') === date2?.dateValue?.join?.('~')) return true;
  if (date1?.toDisplayString?.() === date2?.toDisplayString?.()) return true;
  return false;
};
const handleDeleteConfirm = () => {
  recentUseList.value = [];
  localStorage.removeItem(storeKey.value);
};
</script>
<style lang="scss">
.panel-wrapper {
  width: 510px;
  // width: 468px;
  padding: 12px 16px 0 16px;
  background: #fff;
  border: 1px solid #dcdee5;
  border-radius: 2px;
  box-shadow: 0 2px 6px 0 #0000001a;

  .common-date-list {
    height: 136px;
    max-height: 136px;
    padding: 0;
    padding-bottom: 4px;
    margin: 12px -10px 0 0;
    overflow: auto;
    // border-bottom: 1px solid #eaebf0;

    .list-item {
      display: inline-flex;
      align-items: center;
      min-width: calc(33.33% - 8px);
      height: 28px;
      padding: 0 8px;
      margin-right: 8px;
      margin-bottom: 8px;
      color: #313238;
      cursor: pointer;
      background: #f5f7fa;
      border-radius: 2px;

      &.is-recent-item {
        min-width: inherit;
        height: 24px;
        padding: 0 6px;
        color: #63656e;
      }

      &.is-selected {
        color: #3a84ff;
        background: #e1ecff;
      }

      &:hover {
        color: #3a84ff;
        background: #e1ecff;
      }
    }
  }

  .date-pick-tab {
    padding-top: 12px;
    border-top: 1px solid #eaebf0;

    .#{$bk-prefix}-tab-header-item {
      /* stylelint-disable-next-line declaration-no-important */
      margin-right: 20px !important;
    }
  }

  .time-zone-panel {
    display: flex;
    align-items: center;
    height: 45px;
    padding: 0 16px;
    margin: 0 -16px;
    color: #313238;
    background: #fafbfd;
    border-top: 1px solid #dcdee5;

    .time-zone {
      display: flex;
      align-items: center;
      margin: 0 8px;

      &-area {
        display: flex;
        align-items: center;
        margin-left: 8px;
        color: #979ba5;
      }

      &-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 79px;
        height: 20px;
        color: #63656e;
        border: 1px solid #dcdee5;
        border-radius: 2px;
      }

      &-btn {
        margin-left: auto;
      }
    }
  }

  .time-zone-picker {
    margin: 8px 0;
  }

  .common-wrapper {
    display: flex;
    flex-direction: column;
    height: 139px;
    max-height: 139px;
    overflow: auto;

    .empty-content {
      height: 100px;
      max-height: 100px;
    }

    .empty-tips {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
