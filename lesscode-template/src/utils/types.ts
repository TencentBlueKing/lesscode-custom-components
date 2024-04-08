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
import dayjs, { type Dayjs } from 'dayjs';

import { DateUnit, NowConstant } from './constant';

export interface ICommonTabItem {
  id: string;
  name: string;
}

export enum DateMode {
  Date = 'date',
  FUTURE = 'now+',
  NATURAL = 'natural',
  RECENT = 'now-',
}
export type RecentValue = `${DateMode.RECENT}${number}${DateUnit}`;
export type RecentDateValue = [RecentValue, typeof NowConstant];

export type FutureValue = `${DateMode.FUTURE}${number}${DateUnit}`;
export type FutureDateValue = [typeof NowConstant, FutureValue];

export type NaturalSelectDate = `${RecentValue}/${DateUnit}`;
export type NaturalDateValue = [NaturalSelectDate, NaturalSelectDate | typeof NowConstant];

export type CommonDateValue = [string, string];

export type DateValue = [Dayjs | number | string, Dayjs | number | string];

export interface IDatePickerProps {
  // 组件展示风格 normal: 边框 simplicity: 无边框 默认值: normal
  behavior?: 'normal' | 'simplicity';
  // 常用列表
  commonUseList?: DateValue[];
  // 是否禁用
  disabled?: boolean;
  // 日期转换显示格式
  format?: string;
  // 日期值
  modelValue: DateValue | dayjs.Dayjs[] | number[] | string[] | undefined;
  // 是否展示时区
  needTimezone?: boolean;
  // 时区值 默认值为浏览器时区
  timezone?: string;
  // 版本号 用于控制本地缓存 默认值 1.0
  version?: number | string;
}
