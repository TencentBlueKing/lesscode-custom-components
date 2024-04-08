<template>
  <div class="date-wrapper">
    <div class="date-input">
      <div
        :style="{
          'border-color': showStartPanel || showEndPanel ? '#3A84FF' : '#C4C6CC',
        }"
        class="date-picker"
      >
        <span class="date-picker-icon">
          <svg
            class="date-content-icon"
            height="14"
            version="1.1"
            viewBox="0 0 1024 1024"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M558.933 465.067h-93.866v93.866h93.866v-93.866z m0 162.133h-93.866v93.867h93.866V627.2z m371.2-533.333h-93.866V21.333c0-12.8-8.534-21.333-21.334-21.333S793.6 8.533 793.6 21.333V89.6H234.667V21.333c0-12.8-12.8-21.333-25.6-21.333s-21.334 8.533-21.334 21.333V89.6H93.867C42.667 93.867 0 136.533 0 187.733V934.4c0 46.933 42.667 89.6 93.867 89.6h836.266c51.2 0 93.867-42.667 93.867-93.867v-742.4c0-51.2-42.667-93.866-93.867-93.866z m46.934 836.266c0 25.6-21.334 46.934-46.934 46.934H93.867c-25.6 0-46.934-21.334-46.934-46.934V371.2h930.134v558.933z m0-605.866H46.933V187.733c0-25.6 21.334-46.933 46.934-46.933h93.866v68.267c0 12.8 8.534 21.333 21.334 21.333s21.333-8.533 21.333-21.333V140.8h558.933v68.267c0 12.8 8.534 21.333 21.334 21.333S832 221.867 832 209.067V140.8h93.867c25.6 0 46.933 21.333 46.933 46.933v136.534h4.267zM789.333 627.2h-93.866v93.867h93.866V627.2z m0-162.133h-93.866v93.866h93.866v-93.866z m-230.4 324.266h-93.866V883.2h93.866v-93.867z m-234.666 0h-89.6V883.2h93.866v-93.867h-4.266z m0-324.266h-89.6v93.866h93.866v-93.866h-4.266z m0 162.133h-89.6v93.867h93.866V627.2h-4.266z"
              fill="#C4C6CC"
              xmlns="http://www.w3.org/2000/svg"
            />
          </svg>
        </span>
        <Popover
          :arrow="false"
          :is-show="showStartPanel"
          boundary="parent"
          ext-cls="__bk-date-picker-popover__ __date-picker-popover-start__"
          placement="bottom-start"
          theme="light"
          trigger="manual"
        >
          <input
            :placeholder="t('开始时间')"
            :value="isStartNow ? NowConstant : startDate?.format(format)"
            @blur="e => handleInputEnter(e, 'start')"
            @click="handleFocusStart"
            @keypress.enter="e => handleInputEnter(e, 'start')"
            class="date-picker-start"
            ref="startInput"
            spellcheck="false"
            v-clickoutside-directive="handleClickoutsideStart"
          />
          <template #content>
            <DatePanel
              :diable-now="isEndNow"
              :format="format"
              :is-now="isStartNow"
              :model-value="startDate"
              :title="t('开始时间')"
              @update:is-now="() => handleIsNowChange('start')"
              @update:model-value="handleStartTimeChange"
              key="start"
            />
          </template>
        </Popover>
        <span class="date-picker-split">~</span>
        <Popover
          :arrow="false"
          :is-show="showEndPanel"
          boundary="parent"
          ext-cls="__bk-date-picker-popover__ __date-picker-popover-end__"
          placement="bottom-start"
          theme="light"
          trigger="manual"
        >
          <input
            :placeholder="t('结束时间')"
            :value="isEndNow ? NowConstant : endDate?.format(format)"
            @blur="e => handleInputEnter(e, 'end')"
            @click="handleFocusEnd"
            @keypress.enter="e => handleInputEnter(e, 'end')"
            class="date-picker-end"
            ref="endInput"
            v-clickoutside-directive="handleClickoutsideEnd"
          />
          <template #content>
            <DatePanel
              :diable-now="isStartNow"
              :format="format"
              :is-now="isEndNow"
              :model-value="endDate"
              :title="t('结束时间')"
              @update:is-now="() => handleIsNowChange('end')"
              @update:model-value="date => handleEndTimeChange(date.endOf('d'))"
              key="end"
            />
          </template>
        </Popover>
        <Close
          @click="handleClear"
          class="date-picker-clear"
          v-if="!!(startDate || endDate)"
        />
      </div>
      <CommonSubmit
        :disable-tips="startDate?.isAfter(endDate) ? t('开始时间不能大于结束时间') : ''"
        :disabled="!canConfirm"
        @submit="handleSubmit"
      />
    </div>
    <div class="show-format">
      {{ t('支持多种时间格式自动转换') }}
      <Popover
        :trigger="'click'"
        ext-cls="__bk-date-picker-popover__"
        placement="bottom"
        theme="light"
      >
        <Button
          class="format-button"
          text
          theme="primary"
        >
          {{ t('查看支持格式') }}
        </Button>
        <template #content>
          <div class="date-format-wrapper">
            <div class="content-title">
              {{ t('时间格式支持') }}
            </div>
            <table class="content-table">
              <thead>
                <tr>
                  <th>{{ t('格式') }}</th>
                  <th>{{ t('示例') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="f"
                  v-for="f in dateFormatList"
                >
                  <td>{{ f }}</td>
                  <td>{{ today.format(f) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Popover>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Dayjs } from 'dayjs';

import { Button, Popover, clickoutside as vClickoutsideDirective } from 'bkui-vue';
import { Close } from 'bkui-vue/lib/icon';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { computed, ref, shallowRef, watch } from 'vue';

import { t } from '../lang/lang';
import {
  DATE_REGEX_PARSE,
  // DateMode,
  type DateValue,
  NowConstant,
  commonDateRegexp,
  dateFormatList,
  useDatePickertInject,
} from '../utils';
import { DateRange, transformValue2Dayjs } from '../utils/date';
import CommonSubmit from './common-submit.vue';
import DatePanel from './date-panel.vue';

dayjs.extend(customParseFormat);
const props = defineProps<{
  /* 已选日期 */
  value: DateRange;
}>();
const emits = defineEmits<(e: 'change', value: DateValue) => void>();
const startInput = ref<HTMLInputElement | null>(null);
const endInput = ref<HTMLInputElement | null>(null);
const showStartPanel = ref(false);
const showEndPanel = ref(false);
const startDate = shallowRef<Dayjs>();
const endDate = shallowRef<Dayjs>();
const isStartNow = ref(false);
const isEndNow = ref(false);
const { format, timezoneInfo } = useDatePickertInject()!;
const today = dayjs();
watch(
  () => props.value,
  date => {
    // if (date.dateMode !== DateMode.Date) return;
    const { dateValue, endDate: dateEnd, startDate: dateStart } = date;
    // if (!dateStart?.isValid() && !dateEnd?.isValid()) return;
    startDate.value = dateStart!;
    endDate.value = dateEnd!;
    isStartNow.value = dateValue[0] === NowConstant;
    isEndNow.value = dateValue[1] === NowConstant;
  },
  {
    immediate: true,
  },
);
const canConfirm = computed(() => {
  if (!startDate.value || !endDate.value) return false;
  if (!startDate.value.isValid() || !endDate.value.isValid()) return false;
  if (startDate.value.isSame(endDate.value, 'ms')) return false;
  if (startDate.value.format(format.value) === endDate.value.format(format.value)) return false;
  if (startDate.value.isAfter(endDate.value)) return false;
  return true;
});
/**
 *
 * @param e MouseEvent
 * @param type start(start_time) | end(end_time)
 */
const handleInputEnter = async (_: FocusEvent | KeyboardEvent, type: 'end' | 'start') => {
  setTimeout(() => {
    const target = type === 'start' ? startInput.value : endInput.value;
    const val = target?.value?.toString().trim();
    const editDate = type === 'start' ? startDate.value : endDate.value;
    const curNow = type === 'start' ? isStartNow : isEndNow;
    const otherNow = type === 'start' ? isEndNow : isStartNow;
    const formatValue = editDate?.format(format.value);
    if (val === formatValue) return;
    if (!val || (val === NowConstant && curNow.value)) return;
    // 手动输入now 如果另一个也是不是now，
    if (val === NowConstant && !curNow.value && !otherNow.value) {
      handleIsNowChange(type);
      return;
    }
    let date: Dayjs | undefined = undefined;
    // 手动输入其他 now+-语法 进行转换
    if (commonDateRegexp.test(val)) {
      date = transformValue2Dayjs(val, type);
    }
    if (!date && !/Z$/i.test(val) && 'YYYY-MM-DD HH:mm:ss'.includes(format.value)) {
      const d = val.match(DATE_REGEX_PARSE) || [];
      if (d.length) {
        let validate = true;
        const ms = (d[7] || '0').substring(0, 3);
        const s = d[6] || 0;
        validate = +s < 60;
        const m = d[5] || 0;
        validate = validate && +m < 60;
        const h = d[4] || 0;
        validate = validate && +h < 24;
        const day = d[3] || 1;
        validate = validate && +day < 32;
        const M = +d[2] - 1 || 0;
        validate = validate && M < 12;
        const y = d[1];
        validate = validate && y.length < 5;
        date = validate ? dayjs(new Date(+y, M, +day, +h, +m, +s, +ms)) : editDate;
      }
    }
    if (!date) {
      date = dayjs(val);
    }
    if (date.isValid()) {
      if (!editDate?.isSame(date)) {
        curNow.value = val === NowConstant;
        if (type === 'start') {
          handleStartTimeChange(!startDate ? date.startOf('d') : date);
        } else {
          handleEndTimeChange(!endDate ? date.endOf('d') : date);
        }
      }
    }
    target!.value =
      type === 'start' ? startDate.value?.format(format.value) || '' : endDate.value?.format(format.value) || '';
  }, 16);
};
const handleFocusStart = () => {
  showStartPanel.value = true;
  hiddenEndPanel();
};
const handleFocusEnd = () => {
  showEndPanel.value = true;
  hiddenStartPanel();
};
const hiddenStartPanel = (interval = 32) => {
  setTimeout(() => (showStartPanel.value = false), interval);
};
const hiddenEndPanel = (interval = 32) => {
  setTimeout(() => (showEndPanel.value = false), interval);
};
/**
 * @param date Dayjs
 * @description 开始时间改变
 */
const handleStartTimeChange = (date: Dayjs) => {
  if (!startDate.value?.isSame(date)) {
    startDate.value = date;
    isStartNow.value = false;
  }
  if (!endDate.value) {
    endInput.value?.focus();
    handleFocusEnd();
  }
  hiddenStartPanel();
};
/**
 * @param date Dayjs
 * @description 结束时间改变
 */
const handleEndTimeChange = (date: Dayjs) => {
  if (!endDate.value?.isSame(date)) {
    endDate.value = date;
    isEndNow.value = false;
  }
  if (!startDate.value) {
    startInput.value?.focus();
    handleFocusStart();
  }
  hiddenEndPanel();
};
/**
 * @description 是否是now
 */
const handleIsNowChange = (type: 'end' | 'start') => {
  if (type === 'start') {
    isStartNow.value = !isStartNow.value;
    isEndNow.value = false;
    startDate.value = dayjs();
    if (!endDate.value) {
      setTimeout(() => {
        endInput.value?.focus();
        handleFocusEnd();
      }, 200);
      hiddenStartPanel();
    } else if (isStartNow.value) {
      hiddenStartPanel();
    }
  } else {
    isEndNow.value = !isEndNow.value;
    isStartNow.value = false;
    endDate.value = dayjs();
    if (!startDate.value) {
      setTimeout(() => {
        startInput.value?.focus();
        handleFocusStart();
      }, 200);
      hiddenEndPanel();
    } else if (isEndNow.value) {
      hiddenEndPanel();
    }
  }
};
/**
 * @description 清空
 */
const handleClear = () => {
  startDate.value = undefined;
  endDate.value = undefined;
  isStartNow.value = false;
  isEndNow.value = false;
  hiddenStartPanel();
  hiddenEndPanel();
};
/**
 * @description 提交
 */
const handleSubmit = () => {
  if (startDate.value && endDate.value) {
    const startValue = isStartNow.value ? NowConstant : startDate.value.tz(timezoneInfo.value.label, true).valueOf();
    const endValue = isEndNow.value ? NowConstant : endDate.value.tz(timezoneInfo.value.label, true).valueOf();
    emits('change', [startValue || '', endValue || '']);
  }
};
/**
 * @param e MouseEvent
 * @description end_time outside click
 */
const handleClickoutsideStart = (e: MouseEvent) => {
  if (!showStartPanel.value) return;
  if (!document.querySelector('.__date-picker-popover-start__')?.contains(e.target as HTMLElement)) {
    hiddenStartPanel();
  }
};
/**
 *
 * @param e MouseEvent
 * @description start_time outside click
 */
const handleClickoutsideEnd = (e: MouseEvent) => {
  if (!showEndPanel.value) return;
  if (!document.querySelector('.__date-picker-popover-end__')?.contains(e.target as HTMLElement)) {
    hiddenEndPanel();
  }
};
</script>
<style lang="scss">
/* stylelint-disable declaration-no-important */
.date-wrapper {
  display: flex;
  flex-direction: column;

  .date-input {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 56px;

    .date-picker {
      display: flex;
      align-items: center;
      width: 100%;
      min-width: 360px;
      height: 32px;
      background: #fff;
      border: 1px solid #c4c6cc;
      border-radius: 2px;

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 6px;
        margin-left: 8px;
      }

      &-start,
      &-end {
        width: 160px;
        height: 24px;
        padding: 0 4px;
        font-size: 12px;
        color: #63656e;
        border: none;
        border-radius: 2px;

        &:focus {
          background: #e1ecff;
          border: none;
          outline: none;
          box-shadow: none;
        }
      }

      &-split {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        color: #979ba5;
      }

      &-clear {
        display: none !important;
        flex: 0 0 32px;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 14px;
        color: #c4c6cc;

        &:hover {
          color: #63656e;
          cursor: pointer;
        }
      }

      &:hover {
        .date-picker-clear {
          display: flex !important;
        }
      }
    }
  }

  .show-format {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 100%;
    margin-top: -8px;
    margin-bottom: 12px;
    color: #979ba5;

    .format-button {
      margin-left: 8px;
    }
  }
}

.date-format-wrapper {
  display: flex;
  flex-direction: column;
  width: 520px;
  padding: 12px 15px;

  .content-title {
    margin-bottom: 12px;
    font-weight: bold;
    line-height: 20px;
  }

  .content-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border: 1px solid #eaeefb;
    border-top: 0;
    border-left: 0;

    th,
    td {
      height: 42px;
      padding: 0px 16px;
      line-height: 42px;
      color: #63656e;
      text-align: left;
      border: 1px solid #eaeefb;
      border-right: 0;
      border-bottom: 0;
    }

    thead,
    tr {
      display: flex;
      align-items: center;
      width: 100%;

      th {
        flex: 1;
        background-color: #fafbfd;
      }
    }

    tbody {
      display: block;
      width: calc(100% + 4px);
      max-height: 300px;
      overflow: auto;

      td {
        display: flex;
        flex: 1;
        align-items: center;
      }
    }
  }
}
</style>
