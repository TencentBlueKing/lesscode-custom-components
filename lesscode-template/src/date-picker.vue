<template>
  <div
    :class="{
      __bk_date_picker__: true,
      'is-simplicity': behavior === 'simplicity',
      'is-disabled': disabled,
    }"
  >
    <span
      class="date-icon"
      @click="handleClickLeft"
    >
      <AngleLeft class="date-icon-left" />
    </span>
    <Popover
      :arrow="false"
      :is-show="datePanelShow"
      :offset="{ mainAxis: 10, crossAxis: 10, alignmentAxis: -32 }"
      ext-cls="bk-date-picker-popover __bk-date-picker-popover__"
      placement="bottom-start"
      theme="light"
      trigger="manual"
      @after-hidden="handleHidden"
    >
      <span
        ref="dateContentRef"
        v-clickoutside-directive="handleClickoutside"
        :popoverDelay="[100, 10]"
        class="date-content"
        @click="handleClickDate"
        @mouseenter="handleDateMouseenter"
        @mouseleave="handleDateMouseleave"
      >
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
            d="M486.656 997.312c-268.288 0-486.656-218.304-486.656-486.656 0-268.288 218.304-486.656 486.656-486.656 268.352 0 486.656 218.304 486.656 486.656C973.376 779.008 755.008 997.312 486.656 997.312zM486.656 88c-233.088 0-422.656 189.568-422.656 422.656 0 233.088 189.568 422.656 422.656 422.656s422.656-189.632 422.656-422.656C909.376 277.568 719.744 88 486.656 88z"
            fill="#979BA5"
          />
          <path
            d="M816.064 544 432.064 544 432.064 160 496.064 160 496.064 480 816.064 480Z"
            fill="#979BA5"
          />
        </svg>
        <span>{{ dateDetail.toDisplayString() }}</span>
        <span
          v-if="needTimezone && timezoneInfo.label !== dayjs.tz.guess()"
          class="date-content-utc"
        >
          {{ timezoneInfo.abbreviation || timezoneInfo.utc?.replace('UTC', '').replace(':00', '') }}
        </span>
      </span>
      <template #content>
        <PanelWrapper
          :default-date="dateDetail"
          :need-timezone="needTimezone"
          :timezone="timezone"
          @change="handleChange"
          @update:timezone="handleTimezoneChange"
        />
      </template>
    </Popover>
    <span
      class="date-icon"
      @click="handleClickRight"
    >
      <AngleRight class="date-icon-right" />
    </span>
    <Popover
      :is-show="tooltipsShow"
      :offset="12"
      :target="dateContentRef"
      placement="top"
      trigger="manual"
    >
      <template #content>
        <div
          ref="dateTooltipsRef"
          :style="{ maxWidth: lang === 'en' ? '210px' : '156px' }"
          class="__date-tooltips__"
        >
          <div>{{ tooltipsDetail?.startDisplayText }}</div>
          to
          <div>{{ tooltipsDetail?.endDisplayText }}</div>
          <div class="date-tooltips-timezone">
            {{
              timezoneInfo.label === dayjs.tz.guess()
                ? `${t('浏览器时区')} (${timezoneInfo.label})`
                : timezoneInfo.label
            }}
          </div>
          <div
            v-if="diffTimezone"
            class="date-tooltips-diff"
          >
            {{
              t(diffTimezone < 0 ? '时差：晚 $n 小时' : '时差：早 $n 小时').replace(
                '$n',
                Math.abs(diffTimezone).toString(),
              )
            }}
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Popover, provideGlobalConfig, clickoutside as vClickoutsideDirective } from 'bkui-vue';
import { AngleLeft, AngleRight } from 'bkui-vue/lib/icon';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import cn from 'dayjs/locale/zh-cn';
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';

import PanelWrapper from './components/panel-wrapper.vue';
import { lang, t } from './lang/lang';
import { type DateValue, type IDatePickerProps, getStoreKey, useDatePickerProvider } from './utils';
import { commonDateList, timezoneStoreKey } from './utils/constant';
import { DateRange } from './utils/date';
import { setStoreDateList } from './utils/store';
import { type ITimezoneItem, getTimezoneInfoByValue } from './utils/timezone';

dayjs.locale({
  ...(lang === 'en' ? en : cn),
  weekStart: 1,
});
provideGlobalConfig({
  prefix: BKUI_PREFIX,
});
defineOptions({
  name: 'DatePicker',
});
const props = withDefaults(defineProps<IDatePickerProps>(), {
  behavior: 'normal',
  commonUseList: () => commonDateList,
  format: 'YYYY-MM-DD HH:mm:ss',
  needTimezone: true,
  version: '1.0',
});
const emits = defineEmits<{
  (
    e: 'update:modelValue',
    value: IDatePickerProps['modelValue'],
    info: {
      dayjs: dayjs.Dayjs | null;
      formatText: null | string;
    }[],
  ): void;
  (e: 'update:timezone', value: string, timezoneInfo: ITimezoneItem): void;
}>();
const dateTooltipsRef = ref<HTMLElement>();
const dateContentRef = ref<HTMLElement>();
const format = computed(() => props.format);
const timezoneInfo = computed(() => getTimezoneInfoByValue(props.timezone || dayjs.tz.guess()));
const diffTimezone = computed(() => {
  const timezone = props.timezone;
  if (!timezone || props.timezone === dayjs.tz.guess()) return 0;
  const a = dayjs().utcOffset();
  const b = dayjs.tz(dayjs(), timezone).utcOffset();
  return (b - a) / 60;
});
const dateDetail = shallowRef<DateRange>(new DateRange(props.modelValue as DateValue, props.format, props.timezone));
const tooltipsDetail = shallowRef<DateRange>();
const storeKey = computed(() => getStoreKey(props.version));
const datePanelShow = ref(false);
const tooltipsShow = ref(false);
watch(
  () => props.modelValue,
  v => {
    if (dateDetail.value?.dateValue?.length && dateDetail.value.dateValue.every((item, index) => item === v?.[index]))
      return;
    dateDetail.value = new DateRange(v as DateValue, format.value, props.timezone);
  },
  {
    immediate: true,
  },
);
const commonDateUseList = computed(() => (props.commonUseList?.length ? props.commonUseList : commonDateList));
useDatePickerProvider({
  commonUseList: commonDateUseList,
  format,
  storeKey,
  t,
  timezoneInfo,
  version: computed(() => props.version),
});
onBeforeUnmount(() => {
  tooltipsShow.value = false;
  datePanelShow.value = false;
});
let enterTimer: ReturnType<typeof setTimeout> | null;
let leaveTimer: ReturnType<typeof setTimeout> | null;
function handleDateMouseenter() {
  if (enterTimer) return;
  // magic code
  enterTimer = setTimeout(() => {
    tooltipsShow.value = true;
    tooltipsDetail.value = new DateRange(dateDetail.value.dateValue, format.value, props.timezone);
    enterTimer = null;
  }, 100);
}
function handleDateMouseleave() {
  // magic code
  if (leaveTimer) clearTimeout(leaveTimer);
  leaveTimer = setTimeout(() => {
    tooltipsShow.value = false;
    leaveTimer = null;
  }, 301);
}
const handleChange = (val: DateValue) => {
  datePanelShow.value = false;
  const [start, end] = val;
  const [oldStart, oldEnd] = props.modelValue || [];
  if (start && end && start === oldStart && end === oldEnd) return;
  dateDetail.value = new DateRange(val, format.value, props.timezone);
  const emitValue = dateDetail.value.toEmitValue();
  emits('update:modelValue', ...emitValue);
  // 常用选项内的不存储到本地
  const canStore = commonDateUseList.value.some(item => item[0] === start && item[1] === end);
  !canStore && dateDetail.value.isValidate && setStoreDateList(val, storeKey.value);
};
const handleTimezoneChange = (val: string, info: ITimezoneItem) => {
  dateDetail.value = new DateRange(props.modelValue as DateValue, format.value, val);
  emits('update:timezone', val, { ...info });
  sessionStorage.setItem(timezoneStoreKey, val);
};
const handleHidden = () => {
  datePanelShow.value = false;
};
const diffDateDuration = (type: 'left' | 'right') => {
  if (dateDetail.value.dateValue?.length < 2) return;
  const { endDate, startDate } = dateDetail.value;
  const durations = dateDetail.value.dateDuration();
  const val: DateValue =
    type === 'left'
      ? [startDate!.subtract(durations!), endDate!.subtract(durations!)]
      : [startDate!.add(durations!), endDate!.add(durations!)];
  handleChange(val);
};
const handleClickLeft = () => {
  diffDateDuration('left');
};
const handleClickRight = () => {
  diffDateDuration('right');
};
const handleClickoutside = (e: MouseEvent) => {
  if (!datePanelShow.value) return;
  if (
    !Array.from(document.querySelectorAll('.__bk-date-picker-popover__')).some(item =>
      item.contains(e.target as HTMLElement),
    )
  ) {
    handleHidden();
  }
};
const handleClickDate = () => {
  datePanelShow.value = !datePanelShow.value;
  if (datePanelShow.value) {
    tooltipsShow.value = false;
  }
};
defineExpose({
  handleHidePanel: () => {
    datePanelShow.value = false;
  },
  handleShowPanel: () => {
    datePanelShow.value = true;
  },
});
</script>
<style lang="scss">
@mixin scroll {
  div,
  ul,
  section,
  tbody,
  article {
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 20px;
      box-shadow: inset 0 0 6px rgba(204, 204, 204, 0.3);
    }
  }
}

.__bk_date_picker__ {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 4px;
  font-size: 12px;
  color: #63656e;
  border: 1px solid #c4c6cc;
  border-radius: 2px;

  @include scroll();

  .date-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 20px;
    font-weight: bold;
    color: #989ca7;
    background: #f5f7fa;
    border-radius: 2px;

    &-left,
    &-right {
      display: inline-flex;

      svg {
        /* stylelint-disable-next-line declaration-no-important */
        width: 20px !important;

        /* stylelint-disable-next-line declaration-no-important */
        height: 20px !important;
      }
    }

    &:hover {
      cursor: pointer;
      background-color: #f0f1f5;
    }
  }

  &.is-simplicity {
    border-color: transparent;

    .date-icon {
      background-color: transparent;

      &:hover {
        cursor: pointer;
        background-color: #f0f1f5;
      }
    }
  }

  &.is-disabled {
    color: #c4c6cc;
    cursor: not-allowed;

    /* stylelint-disable-next-line no-descending-specificity */
    .date-icon {
      color: #c4c6cc;
      pointer-events: none;
    }

    .date-content {
      pointer-events: none;
      cursor: not-allowed;
    }
  }

  /* stylelint-disable-next-line no-descending-specificity */
  .date-content {
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 6px;
    margin: 0 4px;
    user-select: none;
    border-radius: 2px;

    &-icon {
      margin-right: 4px;
    }

    &-utc {
      display: flex;
      align-items: center;
      margin-left: 4px;
      font-weight: 700;
      color: #ff9c01;
    }

    &:hover {
      cursor: pointer;
      background: #f5f7fa;
    }
  }
}

.__bk-date-picker-popover__ {
  /* stylelint-disable-next-line declaration-no-important */
  padding: 0 !important;

  /* stylelint-disable-next-line declaration-no-important */
  margin: 0 !important;

  /* stylelint-disable-next-line declaration-no-important */
  color: #63656e !important;

  @include scroll();

  ul {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
    }
  }

  .#{$bk-prefix}-select-search-wrapper {
    .icon-search {
      &::before {
        /* stylelint-disable-next-line declaration-no-important */
        content: '' !important;
      }
    }
  }

  .#{$bk-prefix}-pop-confirm {
    /* stylelint-disable-next-line declaration-no-important */
    margin: 20px 16px 16px 16px !important;
  }
}

.__date-tooltips__ {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 156px;
  line-height: 20px;

  @include scroll();

  .date-tooltips-timezone {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 4px;
    color: #ff9c01;
  }

  .date-tooltips-diff {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    margin-top: 4px;
    color: white;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
  }
}
</style>
