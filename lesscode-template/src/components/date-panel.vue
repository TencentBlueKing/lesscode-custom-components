<template>
  <div class="date-panel">
    <div class="date-panel-title">
      {{ title }}
      <span
        @mousedown="handleMouseDown"
        class="title-check"
      >
        <Checkbox
          :disabled="diableNow"
          :model-value="isNow"
          size="small"
        >
          now
        </Checkbox>
      </span>
    </div>
    <div class="date-panel-main">
      <div class="date-header">
        <div class="date-header-left">
          <AngleDoubleLeft
            @click="nextYear(-1)"
            class="hand-icon"
          />
          <AngleLeft
            @click="nextMonth(-1)"
            class="hand-icon"
          />
        </div>
        <div class="date-header-center">
          {{ curPanelDate.year() }}<span class="date-split" />{{ curPanelDate.month() + 1 }}
        </div>
        <div class="date-header-right">
          <AngleRight
            @click="nextMonth(1)"
            class="hand-icon"
          />
          <AngleDoubleRight
            @click="nextYear(1)"
            class="hand-icon"
          />
        </div>
      </div>
      <div class="date-content">
        <ul class="date-grid">
          <li
            :key="index"
            class="date-grid-item not-click"
            v-for="(day, index) in weekList"
          >
            {{ day }}
          </li>
        </ul>
        <ul
          :key="row"
          class="date-grid"
          v-for="row in panelRowCount"
        >
          <li
            :class="{
              'is-last-month': date.isBefore(curPanelDate, 'month'),
              'is-next-month': date.isAfter(curPanelDate, 'month'),
              'is-today': date.isSame(today, 'day'),
              'is-disabled': minDate && date.isBefore(minDate, 'day'),
              'is-selected': props.modelValue && date.isSame(props.modelValue, 'day'),
            }"
            :key="date.unix()"
            @click.prevent="handleDateChange(date)"
            class="date-grid-item"
            v-for="date in panleDateList.slice((row - 1) * weekItemCount, (row - 1) * weekItemCount + weekItemCount)"
          >
            {{ date.date() }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Checkbox } from 'bkui-vue';
import { AngleDoubleLeft, AngleDoubleRight, AngleLeft, AngleRight } from 'bkui-vue/lib/icon';
import dayjs, { Dayjs } from 'dayjs';
import { shallowRef, watch } from 'vue';

import { lang } from '../lang/lang';

interface Props {
  diableNow?: boolean;
  /**
   * 格式化字符串 例如 YYYY-MM-DD HH:mm:ss(参考dayjs https://dayjs.gitee.io/docs/zh-CN/durations/format)
   */
  format?: string;
  /**
   * 是否是now
   */
  isNow?: boolean;
  /**
   * 最小日期
   */
  minDate?: Dayjs;
  /*
   * 当前选中的日期
   */
  modelValue?: Dayjs;
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  format: 'YYYY-MM-DD HH:mm:ss',
});
const emits = defineEmits<{
  'update:isNow': [boolean];
  'update:modelValue': [date: Dayjs];
}>();
// 一周的列表
const weekList: Array<string> =
  lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['日', '一', '二', '三', '四', '五', '六'];
// 当前面板的日期列表
const panleDateList = shallowRef<Dayjs[]>([]);
// 当前日期
const today = dayjs();
// 当前面板的日期
const curPanelDate = shallowRef<Dayjs>(props.modelValue || today);
// 面板行数
const panelRowCount = 6;
// 一周的天数
const weekItemCount = 7;
watch(
  curPanelDate,
  () => {
    const firstDay = curPanelDate.value.startOf('month').startOf('week').add(-1, 'day');
    const list: Dayjs[] = [];
    for (let i = 0; i < panelRowCount * weekItemCount; i++) {
      list.push(firstDay.add(i, 'day'));
    }
    panleDateList.value = list;
  },
  {
    immediate: true,
  },
);
/**
 *
 * @param number 向下调整月份
 * @description 当前面板展示月份
 */
const nextMonth = (number: number) => {
  curPanelDate.value = curPanelDate.value.add(number, 'month');
};
/**
 * @param number 向下调整年份
 * @description 当前面板展示年份
 */
const nextYear = (number: number) => {
  curPanelDate.value = curPanelDate.value.add(number, 'year');
};
/**
 *
 * @param date 选中的日期
 * @description 选中日期触发事件
 */
const handleDateChange = (date: Dayjs) => {
  if (props.minDate && date.isBefore(props.minDate, 'day')) {
    return;
  }
  emits('update:modelValue', date);
};
let timeout: ReturnType<typeof setTimeout> | null;
const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  if (props.diableNow) return;
  if (timeout) return;
  emits('update:isNow', !props.isNow);
  timeout = setTimeout(() => {
    clearTimeout(timeout!);
    timeout = null;
  }, 500);
};
</script>
<style lang="scss">
/* stylelint-disable declaration-no-important */
.date-panel {
  display: flex;
  flex-direction: column;
  width: 220px;
  user-select: none;
  background: #fff;
  border: 1px solid #dcdee5;
  box-shadow: 0 2px 6px 0 #0000001a;

  &-title {
    display: flex;
    flex: 0 0 40px;
    align-items: center;
    height: 40px;
    padding: 0 12px;
    color: #63656e;
    border-bottom: 1px solid #dcdee5;

    .title-check {
      margin-left: auto;
      .#{$bk-prefix}-checkbox {
        pointer-events: none;
      }
    }
  }

  &-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 8px 0 12px 0;

    .date-header {
      display: flex;
      align-items: center;
      width: 100%;
      height: 24px;

      &-center {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 14px;
        font-weight: 700;

        .date-split {
          width: 5px;
          height: 2px;
          margin: 0 10px;
          background-color: #63656e;
        }
      }

      &-right,
      &-left {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 6px;
        font-size: 16px;

        .hand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: #979ba5;

          svg {
            width: 20px !important;
            height: 20px !important;
            font-weight: bold;
          }

          &:hover {
            color: #3a84ff;
            cursor: pointer;

            svg {
              fill: #3a84ff;
            }
          }
        }
      }

      &-right {
        margin-left: auto;
      }
    }

    .date-content {
      display: flex;
      flex-direction: column;

      .date-grid {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 12px;
        margin: 0;

        &-item {
          display: flex;
          flex: 0 0 14.285%;
          align-items: center;
          justify-content: center;
          width: 14.285%;
          min-width: 28px;
          height: 24px;

          &:not(.not-click) {
            &:hover {
              cursor: pointer;
              background-color: #f0f1f5;
            }
          }

          &.is-today {
            color: #3a84ff;
            border: 1px solid #a3c5fd;
            border-radius: 2px;
          }

          &.is-last-month {
            color: #c4c6cc;
            background-color: #f0f1f5;
          }

          &.is-next-month {
            color: #c4c6cc;
          }

          &.is-disabled {
            color: #c4c6cc !important;
            cursor: not-allowed !important;
            background-color: #f0f1f5 !important;
          }

          &.is-selected {
            color: #fff !important;
            background-color: #3a84ff !important;
            border-radius: 2px;
          }

          // &.is-next-month:last-child {
          //   border-top-right-radius: 2px;
          //   border-bottom-right-radius: 2px;
          // }
        }
      }
    }
  }
}
</style>
