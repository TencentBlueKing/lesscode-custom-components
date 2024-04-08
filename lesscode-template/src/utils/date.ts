/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import dayjs, { Dayjs } from 'dayjs';

import { LangKey, ShortTimeUnitDateKey, shortTimeUnitLangData, t } from '../lang/lang';
import { CommonNaturalOptions, DateUnit, NowConstant, dateUnit, naturalDateShortcutMap } from './constant';
import { DateMode, DateValue } from './types';
export const commonDateRegexp = new RegExp(`now([+-]?\\d*)([${dateUnit}]?)\\/?([${dateUnit}]?)`);
export const recentDateRegexp = new RegExp(`now[-](\\d+)([${dateUnit}]{1})$`);
export const futureDateRegexp = new RegExp(`now[+](\\d+)([${dateUnit}]{1})$`);
export const naturalDateRegexp = new RegExp(`now([+-]?\\d*)([${dateUnit}]?)\\/([${dateUnit}])$`);
export class DateRange {
  endDate: Dayjs | null;
  endNum: number | undefined;
  endUnit: DateUnit | undefined;
  startDate: Dayjs | null;
  startNum: number | undefined;
  startUnit: DateUnit | undefined;
  constructor(
    public dateValue: DateValue = ['', ''],
    public format: string = 'YYYY-MM-DD HH:mm:ss',
    public timezome: string = dayjs.tz.guess(),
  ) {
    const [start, end] = dateValue;
    this.startDate = start ? this.transformValue2Dayjs(start) : null;
    this.endDate = end ? this.transformValue2Dayjs(end, 'end') : null;
  }
  dateDuration() {
    if (!this.startDate || !this.endDate || !this.isValidate) return;
    let durations = this.endDate.diff(this.startDate);
    const dayDuration = 24 * 60 * 60 * 1000;
    switch (this.dateMode) {
      case DateMode.RECENT:
        durations = dayjs()
          .add(this.startNum!, this.startUnit as dayjs.ManipulateType)
          .diff(dayjs());
        break;
      case DateMode.FUTURE:
        durations = dayjs().diff(
          dayjs().add(this.endNum!, this.endUnit as dayjs.ManipulateType),
          this.endUnit as dayjs.OpUnitType,
        );
        break;
      case DateMode.NATURAL:
        durations = this.endDate.diff(this.startDate);
        const dayDuration = 24 * 60 * 60 * 1000;
        if (durations % dayDuration === dayDuration - 1) {
          durations += 1;
        }
        break;
      default:
      case DateMode.Date:
        durations = this.endDate.diff(this.startDate);
        break;
    }
    const durationMod = durations % dayDuration;
    if (durationMod === dayDuration - 1) {
      durations += 1;
    } else if (durationMod === dayDuration - 1000) {
      durations += 1000;
    }
    return durations;
  }
  toDisplayString() {
    if (!this.startDate || !this.endDate || !this.isValidate) {
      return this.dateValue?.join(' ~ ') || '';
    }
    if (this.dateMode === DateMode.RECENT) {
      return `${t('近')} ${Math.abs(this.startNum!)} ${t(
        shortTimeUnitLangData[this.startUnit as ShortTimeUnitDateKey] as LangKey,
      )}`;
    }
    if (this.dateMode === DateMode.FUTURE) {
      return `${t('未来')} ${Math.abs(this.endNum!)} ${t(
        shortTimeUnitLangData[this.endUnit as ShortTimeUnitDateKey] as LangKey,
      )}`;
    }
    const [start, end] = this.dateValue;
    if (this.dateMode === DateMode.NATURAL) {
      const subfix = end !== NowConstant ? '' : t('（至今）');
      const item = CommonNaturalOptions.find(option => option.id === start);
      if (item) {
        return t(item.name as LangKey) + subfix;
      }
      return `${`${t('前')} ${this.startNum} ${t(
        shortTimeUnitLangData[this.startUnit as ShortTimeUnitDateKey] as LangKey,
      )}`}${subfix}`;
    }
    let replaceFormat = this.format;
    if (start === NowConstant) {
      return `${t('此刻')} ~ ${this.endDate?.format(this.format)}`;
    }
    if (end === NowConstant) {
      return `${this.startDate?.format(this.format)} ~ ${t('此刻')}`;
    }
    const startStep = ['Y', 'M', 'D', 'H', 'm', 's'].reduce(
      (prev, cur, i, arr) => {
        if (i < 1) return prev;
        const v = this.format.indexOf(cur) > this.format.indexOf(arr[i - 1]);
        if (v) {
          prev.push(cur);
        } else {
          prev = [];
        }
        return prev;
      },
      ['Y'],
    );
    if (startStep.length > 1 && startStep.includes('D') && this.startDate.isSame(this.endDate, 'year')) {
      const [, yearFormat] = this.format.match(/(Y+)/) || [];
      let commonStr = this.format.replace(yearFormat, this.startDate.format(yearFormat));
      replaceFormat = replaceFormat.replace(/Y+[^\w\s]*/, '');
      if (this.startDate.isSame(this.endDate, 'day')) {
        if (this.startDate.isSame(this.endDate, 'month')) {
          const [, monthFormat] = this.format.match(/(M+)/) || [];
          commonStr = commonStr.replace(monthFormat, this.startDate.format(monthFormat));
          replaceFormat = replaceFormat.replace(/M+[^\w\s]*/, '');
          if (this.startDate.isSame(this.endDate, 'day')) {
            const [, dayFormat] = this.format.match(/(d+|D+)/) || [];
            commonStr = commonStr.replace(dayFormat, this.startDate.format(dayFormat));
            replaceFormat = replaceFormat.replace(/(d|D)+[^\w\s]*/, '');
            // if (this.startDate.isSame(this.endDate, 'hour')) {
            //   const [, hourFormat] = this.format.match(/(H+|h+)/)!;
            //   commonStr = commonStr.replace(hourFormat, this.startDate.format(hourFormat));
            //   replaceFormat = replaceFormat.replace(/[Hh]+[-/\\\s:]/, '');
            //   if (this.startDate.isSame(this.endDate, 'minute')) {
            //     const [, minuteFormat] = this.format.match(/(m+)/)!;
            //     commonStr = commonStr.replace(minuteFormat, this.startDate.format(minuteFormat));
            //     replaceFormat = replaceFormat.replace(/m+[-/\\\s:]/, '');
            //   }
            // }
          }
        }
      }
      const lastChart = commonStr.replace(replaceFormat, '').slice(-1);
      if (commonStr.length <= replaceFormat.length)
        return `${this.startDate.format(this.format)} ~ ${this.endDate.format(this.format)}`;
      return commonStr.replace(
        `${lastChart.match(/([^\w\s]{1})/) ? lastChart : ''}${replaceFormat}`,
        ` ( ${this.startDate.format(replaceFormat)} ~ ${this.endDate.format(replaceFormat)} )`,
      );
    }
    return `${this.startDate.format(this.format)} ~ ${this.endDate.format(this.format)}`;
  }
  toEmitValue(): [
    DateValue,
    {
      dayjs: Dayjs | null;
      formatText: null | string;
    }[],
  ] {
    return [
      this.dateMode === DateMode.Date
        ? [
            this.dateValue[0] === NowConstant ? NowConstant : this.startDate?.valueOf()!,
            this.dateValue[1] === NowConstant ? NowConstant : this.endDate?.valueOf()!,
          ]
        : [...this.dateValue],
      [
        {
          dayjs: this.startDate,
          formatText: this.startDate?.format(this.format)!,
        },
        {
          dayjs: this.endDate,
          formatText: this.endDate?.format(this.format)!,
        },
      ],
    ];
  }
  transformValue2Dayjs(val: DateValue[number], type: 'end' | 'start' = 'start') {
    const value = isNaN(val as number) ? val : +val;
    let date: Dayjs = dayjs(value);
    if (typeof value === 'number' || dayjs.isDayjs(value) || date.isValid())
      return dayjs.tz(date.valueOf(), this.timezome);
    const [, num, unit, diffUnit] = value.match(commonDateRegexp) || [];
    if (type === 'start') {
      this.startNum = Math.abs(+num);
      this.startUnit = (unit || diffUnit) as DateUnit;
    } else if (type === 'end') {
      this.endNum = Math.abs(+num);
      this.endUnit = (unit || diffUnit) as DateUnit;
    }
    if (num) {
      date = dayjs().add(+num, (unit || diffUnit) as dayjs.ManipulateType);
    } else if (value === NowConstant) {
      date = dayjs();
    }
    if (diffUnit) {
      date =
        type === 'start'
          ? dayjs(dayjs(date.isValid() ? date : undefined).valueOf())
          : dayjs(dayjs(date.isValid() ? date : undefined));
      return type === 'start'
        ? dayjs.tz(date.valueOf(), this.timezome).startOf(diffUnit as dayjs.OpUnitType)
        : dayjs.tz(date.valueOf(), this.timezome).endOf(diffUnit as dayjs.OpUnitType);
    }
    return dayjs.tz(date.valueOf(), this.timezome);
  }
  updateDateValue(dateValue: DateValue, timezome?: string) {
    this.dateValue = dateValue;
    const [start, end] = dateValue;
    if (timezome) this.timezome = timezome;
    this.startDate = start ? this.transformValue2Dayjs(start) : null;
    this.endDate = end ? this.transformValue2Dayjs(end, 'end') : null;
  }
  updateFormat(format: string) {
    this.format = format;
  }
  get dateMode() {
    const [start, end] = this.dateValue;
    if (typeof start === 'number' || typeof end === 'number') return DateMode.Date;
    if (dayjs.isDayjs(start) || dayjs.isDayjs(end)) return DateMode.Date;
    if (dayjs(start).isValid() || dayjs(end).isValid()) return DateMode.Date;
    if (start === NowConstant && futureDateRegexp.test(end)) return DateMode.FUTURE;
    if (end === NowConstant && recentDateRegexp.test(start)) return DateMode.RECENT;
    // 特殊的时间
    if (naturalDateShortcutMap[this.dateValue.join('~') as keyof typeof naturalDateShortcutMap]) {
      return DateMode.NATURAL;
    }
    if (naturalDateRegexp.test(start) && (naturalDateRegexp.test(end) || end === NowConstant)) {
      const [, startNum, startUnit, startDiffUnit] = start.match(commonDateRegexp) || [];
      const [, endNum, endUnit, endDiffUnit] = end.match(commonDateRegexp) || [];
      if (startDiffUnit) {
        if (end === NowConstant) return DateMode.NATURAL;
        // [now-3d/d, now-1d/d] 前3天 [now-3w/w, now-1w/w]
        if (startNum && +endNum == -1) {
          if (startUnit === startDiffUnit && endUnit === endDiffUnit && startUnit === endUnit) return DateMode.NATURAL;
        }
      }
    }
    return DateMode.Date;
  }
  get endDisplayText() {
    return dayjs.tz(this.endDate?.valueOf() || undefined, this.timezome).format(this.format);
  }
  get isValidate() {
    return this.startDate?.isValid() && this.endDate?.isValid();
  }
  get recentOrFuturedateNum() {
    if (this.dateMode === DateMode.RECENT) {
      return this.startNum;
    }
    if (this.dateMode === DateMode.FUTURE) {
      return this.endNum;
    }
    return undefined;
  }
  get recentOrFuturedateUnit() {
    if (this.dateMode === DateMode.RECENT) {
      return this.startUnit;
    }
    if (this.dateMode === DateMode.FUTURE) {
      return this.endUnit;
    }
    return 'm';
  }
  get startDisplayText() {
    return dayjs.tz(this.startDate?.valueOf() || undefined, this.timezome).format(this.format);
  }
}
export const transformValue2Dayjs = (val: DateValue[number], type: 'end' | 'start' = 'start', timezome?: string) => {
  const value = isNaN(val as number) ? val : +val;
  let date: Dayjs = dayjs(value);
  if (typeof value === 'number' || dayjs.isDayjs(value) || date.isValid())
    return dayjs.tz(date.valueOf(), timezome || dayjs.tz.guess());
  const [, num, unit, diffUnit] = value.match(commonDateRegexp) || [];
  if (num) {
    date = dayjs().add(+num, (unit || diffUnit || 'd') as dayjs.ManipulateType);
  } else if (value === NowConstant) {
    date = dayjs();
  }
  if (diffUnit) {
    date =
      type === 'start'
        ? dayjs.tz(dayjs(date.isValid() ? date : undefined).valueOf(), timezome).startOf(diffUnit as dayjs.OpUnitType)
        : dayjs.tz(dayjs(date.isValid() ? date : undefined), timezome).endOf(diffUnit as dayjs.OpUnitType);
    return date?.isValid() ? date : undefined;
  }
  return date.isValid() ? dayjs.tz(date.valueOf(), timezome || dayjs.tz.guess()) : undefined;
};

export const transformDateRange2Dayjs = (dateValue: DateValue, timezome?: string) => {
  if (!Array.isArray(dateValue) || dateValue.length < 1) return [];
  const [start, end] = dateValue || [];
  const startDate = transformValue2Dayjs(start, 'start', timezome);
  const endDate = transformValue2Dayjs(end, 'end', timezome);
  return [startDate, endDate];
};
