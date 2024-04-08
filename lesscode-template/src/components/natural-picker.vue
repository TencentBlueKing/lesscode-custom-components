<template>
  <div class="natural-picker">
    <Select
      :clearable="false"
      :input-search="false"
      :model-value="getNaturalOptionId(naturalValue)"
      :no-match-text="t('无匹配数据')"
      :popover-min-width="130"
      :popover-options="{ boundary: 'parent', extCls: '__bk-date-picker-popover__' }"
      :prefix="t('自然日期')"
      :search-placeholder="t('请输入')"
      class="natural-date"
      filterable
      ref="naturalSelectRef"
    >
      <Select.Option
        :id="getNaturalOptionId(item)"
        :key="getNaturalOptionId(item)"
        :name="item.name"
        v-for="item in naturalOptions"
      >
        <div
          @click.prevent.stop
          class="natural-custom-option"
        >
          <Input
            :clearable="false"
            :min="1"
            :placeholder="t('请输入')"
            :precision="0"
            :prefix="item.prefix"
            :show-control="true"
            :suffix="item.suffix"
            @keypress="(v, e) => handleInputKeyPress(e, v, item)"
            autofocus="true"
            ref="inputRef"
            size="small"
            style="width: 150px"
            type="number"
            v-if="canEditNautralId === item.id"
            v-model="inputValue"
          />
          <div
            @click="handleClickItem(item)"
            style="width: 100%"
            v-else
          >
            {{ item.name }}
          </div>
        </div>
      </Select.Option>
    </Select>
    <Select
      :clearable="false"
      :model-value="naturalUnitValue"
      :popover-options="{ boundary: 'parent' }"
      @change="handleUnitChange"
      class="natural-unit"
    >
      <Select.Option
        :id="item.id"
        :key="item.id"
        :name="item.name"
        v-for="item in naturalUnitOptions"
      />
    </Select>
    <CommonSubmit @submit="handleSubmit" />
  </div>
</template>
<script setup lang="ts">
import { Input, Select } from 'bkui-vue';
import dayjs, { type Dayjs } from 'dayjs';
import { ref, shallowRef, watch } from 'vue';

import { LangKey, shortTimeUnitLangData, t } from '../lang/lang';
import {
  CommonNaturalOptions,
  DateMode,
  type DateUnit,
  type NaturalDateValue,
  NaturalOptionType,
  type NaturalSelectDate,
  NaturalUnit,
  NowConstant,
  getStoreKey,
  naturalDateRegexp,
  naturalUnitOptions,
} from '../utils';
import { DateRange } from '../utils/date';
import { getStoreDateList, setStoreDateList } from '../utils/store';
import CommonSubmit from './common-submit.vue';

interface IProps {
  /** 已选择自然日期 */
  value?: DateRange;
}
type DateOptionValue = `${NaturalSelectDate}${typeof splitDate}${NaturalOptionType}`;
type DateOption = (typeof naturalOptions.value)[number];
const splitDate = '__' as const;
const inputRef = ref<InstanceType<typeof Input>[]>();
const emits = defineEmits<(e: 'change', value: NaturalDateValue) => void>();
const props = defineProps<IProps>();
const naturalSelectRef = ref<InstanceType<typeof Select>>();
const naturalOptions = shallowRef(CommonNaturalOptions.slice());
const naturalUnitValue = ref<NaturalUnit>(naturalUnitOptions[0].id);
const canEditNautralId = ref(''); // 是否可编辑的自然日期
const inputValue = ref(); // 自定义输入的值
const naturalValue = ref<DateOption>(naturalOptions.value[0]); // 自然日期
// 将sesionStorage中的自然日期存储到自然日期列表中
getStoreDateList(getStoreKey(), 'session').forEach((item: [Dayjs | number | string, Dayjs | number | string]) => {
  const [start, end] = item;
  if (dayjs.isDayjs(start) || dayjs.isDayjs(end)) return;
  const date = new DateRange(item);
  const { startNum, startUnit } = date;
  const specialDate = naturalOptions.value.find(item => item.id === start);
  if (!specialDate) {
    const name = `${`${t('前')} ${startNum} ${t(
      shortTimeUnitLangData[startUnit!] as LangKey,
    )}`}` as (typeof naturalOptions.value)[number]['name'];
    naturalOptions.value.unshift({
      id: start as string,
      name,
      type: NaturalOptionType.custom,
    });
  }
});
watch(
  () => props.value,
  date => {
    if (!date) return;
    if (date.dateMode !== DateMode.NATURAL) return;
    const [start, end] = date.dateValue;
    if (dayjs.isDayjs(start) || dayjs.isDayjs(end)) return;
    const { startNum, startUnit } = date;
    naturalUnitValue.value = end === NowConstant ? NaturalUnit.NOW : NaturalUnit.ALL;
    const customDate = naturalOptions.value.find(item => item.id === start && item.type === NaturalOptionType.custom);
    if (customDate) {
      naturalValue.value = customDate;
      return;
    }
    const specialDate = CommonNaturalOptions.find(item => item.id === start && item.type === NaturalOptionType.default);
    if ((end !== NowConstant && start !== end && specialDate) || !specialDate) {
      const name = `${`${t('前')} ${startNum} ${t(
        shortTimeUnitLangData[startUnit!] as LangKey,
      )}`}` as (typeof naturalOptions.value)[number]['name'];
      naturalOptions.value.unshift({
        id: start as string,
        name,
        type: NaturalOptionType.custom,
      });
      [naturalValue.value] = naturalOptions.value;
      return;
    }
    specialDate && (naturalValue.value = specialDate);
  },
  {
    immediate: true,
  },
);
const getNaturalOptionId = (date: DateOption) => {
  return `${date.id}${splitDate}${date.type}` as DateOptionValue;
};
const getNaturalDateValue = (date: DateOption): NaturalDateValue => {
  const value = date.id as NaturalSelectDate;
  if (naturalUnitValue.value === NaturalUnit.ALL) {
    const [, num, unit, dateUnit] = value.match(naturalDateRegexp) || [];
    if (Math.abs(+num) > 1) {
      // 前天代表一天
      if (Math.abs(+num) === 2 && unit === 'd') return [value, value];
      return [value, `now-1${unit}/${dateUnit}` as NaturalSelectDate];
    }
    return [value, value];
  }
  return [value, NowConstant];
};
const handleClickItem = (item: DateOption) => {
  if (item.type === NaturalOptionType.edit) {
    inputValue.value = 1;
    canEditNautralId.value = item.id;
    setTimeout(() => {
      (inputRef.value?.[0] as any)?.focus?.();
    }, 20);
    return;
  }
  naturalValue.value = item;
  canEditNautralId.value = '';
  naturalSelectRef.value?.hidePopover();
};
const handleUnitChange = (value: NaturalUnit) => {
  naturalUnitValue.value = value;
};
const customNaturalOptions = (v: number, item: DateOption) => {
  canEditNautralId.value = '';
  const value: NaturalSelectDate = `now-${+v}${item.unit! as DateUnit}/${item.unit! as DateUnit}`;
  const date = naturalOptions.value.find(item => item.id === value);
  if (date) {
    naturalValue.value = date;
    naturalSelectRef.value?.hidePopover();
    return;
  }
  naturalOptions.value.unshift({
    id: value,
    name: item.name.replace('N', v.toString()) as DateOption['name'],
    type: NaturalOptionType.custom,
  });
  [naturalValue.value] = naturalOptions.value;
  naturalSelectRef.value?.hidePopover();
};
// const handleInputBlur = (e: FocusEvent, item: DateOption) => {
//   const v = (e.target as HTMLInputElement).value;
//   if (!v || !canEditNautralId.value) return;
//   customNaturalOptions(+v, item);
// };
/**
 * @description: 自定义输入 前 N 周/天
 */
const handleInputKeyPress = (e: KeyboardEvent, v: number, item: DateOption) => {
  if (!v || +v < 1) return;
  if (e.key !== 'Enter' || !canEditNautralId.value) return;
  customNaturalOptions(Math.ceil(v), item);
};
const handleSubmit = () => {
  naturalOptions.value
    .filter(item => item.type === NaturalOptionType.custom)
    .forEach(item => {
      setStoreDateList(getNaturalDateValue(item), getStoreKey(), 'session');
    });
  emits('change', getNaturalDateValue(naturalValue.value));
};
</script>
<style lang="scss">
.natural-picker {
  display: flex;
  align-items: center;
  min-height: 56px;

  .natural-date {
    width: 256px;
  }

  .natural-unit {
    width: 140px;
    margin-left: 8px;
  }
}

.natural-custom-option {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 250px;
  height: 100%;
  padding: 0 12px;
  margin: 0 -12px;
  .#{$bk-prefix}-input {
    background-color: white;
  }
}
</style>
