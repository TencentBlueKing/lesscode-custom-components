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
import { t } from '../lang/lang';
import { DateMode, DateValue } from './index';

export const DateUnitList = [
  {
    id: 's',
    name: t('秒'),
  },
  {
    id: 'm',
    name: t('分钟'),
  },
  {
    id: 'h',
    name: t('小时'),
  },
  {
    id: 'd',
    name: t('天'),
  },
  {
    id: 'w',
    name: t('周'),
  },
  {
    id: 'M',
    name: t('月'),
  },
  {
    id: 'y',
    name: t('年'),
  },
] as const;
export type DateUnit = (typeof DateUnitList)[number]['id'];
export const dateUnit = DateUnitList.map(item => item.id).join('') as DateUnit;
export enum NaturalOptionType {
  custom = 'custom',
  default = 'default',
  edit = 'edit',
}
export const CommonNaturalOptions = [
  {
    id: 'now/d',
    name: t('今天'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now-1d/d',
    name: t('昨天'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now-2d/d',
    name: t('前天'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now/w',
    name: t('本周'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now-1w/w',
    name: t('上周'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now/M',
    name: t('本月'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now-1M/M',
    name: t('上月'),
    type: NaturalOptionType.default,
  },
  {
    id: 'now-nd/d',
    name: t('前 N 天'),
    prefix: t('前'),
    suffix: t('天'),
    type: NaturalOptionType.edit,
    unit: 'd',
  },
  {
    id: 'now-nw/w',
    name: t('前 N 周'),
    prefix: t('前'),
    suffix: t('周'),
    type: NaturalOptionType.edit,
    unit: 'w',
  },
];
export enum NaturalUnit {
  ALL = 'all',
  NOW = 'now',
}
export const naturalUnitOptions = [
  {
    id: NaturalUnit.ALL,
    name: t('整'),
  },
  {
    id: NaturalUnit.NOW,
    name: t('至今'),
  },
] as const;

export const panels = [
  {
    id: 'common',
    name: t('常用时间'),
  },
  {
    id: 'recent',
    name: t('最近使用'),
  },
];
export const datePickTabList = [
  {
    id: DateMode.RECENT,
    name: t('最近'),
  },
  {
    id: DateMode.FUTURE,
    name: t('未来'),
  },
  {
    id: DateMode.NATURAL,
    name: t('自然日期'),
  },
  {
    id: DateMode.Date,
    name: t('日期选择'),
  },
];

const storeKey = 'BK_DATE_PICKER_STORE';
const storeTabKey = 'BK_DATE_PICKER_STORE_TAB';
export const timezoneStoreKey = 'blueking_timezone';
export const getStoreKey = (key: number | string = 1) => `${storeKey}_${key}`;
export const getStoreTabKey = (key: number | string = 1) => `${storeTabKey}_${key}`;
export const dateFormatList = [
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD HH:mm:ss,SSS',
  'YYYY-MM-DD HH:mm:ss.SSS',
  'YYYY-MM-DD+HH:mm:ss',
  'MM/DD/YYYY HH:mm:ss',
  'YYYYMMDDHHmmss',
  'YYYYMMDD HHmmss',
  'YYYYMMDD HHmmss.SSS',
  'DD/MMM/YYYY:HH:mm:ss',
  'DD/MMM/YYYY:HH:mm:ssZ',
  'DD/MMM/YYYY:HH:mm:ss Z',
  'DD/MMM/YYYY:HH:mm:ssZZ',
  'DD/MMM/YYYY:HH:mm:ss ZZ',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYYMMDDTHHmmssZ',
  'YYYYMMDDTHHmmss.SSSSSSZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
];

export const naturalDateShortcutMap = {
  'now/M~now/M': t('本月'),
  'now/d~now/d': t('今天'),
  'now/w~now/w': t('本周'),
  'now/y~now/y': t('今年'),
  'now-1M/M~now-1M/M': t('上月'),
  'now-1d/d~now-1d/d': t('昨天'),
  'now-1w/w~now-1w/w': t('上周'),
  'now-1y/y~now-1y/y': t('去年'),
  'now-2d/d~now-2d/d': t('前天'),
  'now-2y/y~now-2y/y': t('前年'),
} as const;

export const commonDateList = [
  ['now-5m', 'now'],
  ['now-15m', 'now'],
  ['now-30m', 'now'],
  ['now-1h', 'now'],
  ['now-6h', 'now'],
  ['now-12h', 'now'],
  ['now-24h', 'now'],
  ['now-7d', 'now'],
  ['now-30d', 'now'],
  ['now/d', 'now/d'],
  ['now/d', 'now'],
  ['now-1d/d', 'now-1d/d'],
  ['now-2d/d', 'now-2d/d'],
  ['now/w', 'now/w'],
  ['now/w', 'now'],
  ['now-1w/w', 'now-1w/w'],
  ['now/M', 'now/M'],
  ['now/M', 'now'],
  ['now-1M/M', 'now-1M/M'],
  ['now-1M/M', 'now'],
] as DateValue[];

export const NowConstant = 'now';

export const DATE_REGEX_PARSE = /^(\d{4})[-/](\d+)[-/](\d+)[Tt\s]*(\d+)?:(\d+)?:(\d+)?[.:]?(\d*)$/;
export const DATE_REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
