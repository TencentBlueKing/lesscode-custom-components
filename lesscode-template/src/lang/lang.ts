/* eslint-disable @typescript-eslint/consistent-type-assertions */
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
import { getCookieByName } from '../utils/cookie';

export const naturalDateLangData = {
  上周: 'Last week',
  上月: 'Last month',
  今天: 'Today',
  今年: 'This year',
  '前 N 周': 'Previous N weeks',
  '前 N 天': 'Previous N days',
  前天: 'The day before yesterday',
  前年: 'The year before last',
  去年: 'Last year',
  昨天: 'Yesterday',
  本周: 'This week',
  本月: 'This month',
} as const;
export const timeUnitLangData = {
  分钟: 'minute',
  周: 'week',
  天: 'day',
  小时: 'hour',
  年: 'year',
  月: 'month',
  毫秒: 'millisecond',
  秒: 'second',
} as const;
export const shortTimeUnitLangData = {
  M: '月',
  d: '天',
  h: '小时',
  m: '分钟',
  ms: '毫秒',
  s: '秒',
  w: '周',
  y: '年',
};

export const langData = {
  前: 'Previous',
  取消: 'Cancel',
  将来: 'Future',
  常用时间: 'Common',
  开始时间: 'Start Time',
  开始时间不能大于结束时间: 'Start time cannot be greater than end time',
  支持多种时间格式自动转换: 'Support multiple time formats for automatic conversion',
  整: 'whole',
  无匹配数据: 'No matching data',
  日期选择: 'Time Range',
  时区设置: 'Timezone setting',
  '时差：早 $n 小时': 'Offset: $n hours early',
  '时差：晚 $n 小时': 'Offset: $n hours late',
  时间格式支持: 'Time format support',
  '是否清空最近使用？': 'Clear recent records?',
  暂无常用时间: 'No common time',
  暂无最近使用记录: 'No recent records',
  最近: 'Last',
  最近使用: 'Recently',
  未来: 'Future',
  查看支持格式: 'View supported formats',
  格式: 'Format',
  此刻: 'now',
  浏览器时区: 'Browser timezone',
  确定: 'Confirm',
  示例: 'Example',
  结束时间: 'End Time',
  自然日期: 'Natural',
  至今: 'so far',
  请输入: 'Please enter',
  '请输入搜索（国家，城市，简称）': 'Please enter search (country, city, abbreviation)',
  近: 'Last',
  '（至今）': ' so far',
} as const;
export type NaturalDateKey = keyof typeof naturalDateLangData;
export type TimeUnitDateKey = keyof typeof timeUnitLangData;
export type ShortTimeUnitDateKey = keyof typeof shortTimeUnitLangData;
export type LangKey = keyof typeof langData;
export type LangValue = (typeof langData)[LangKey];
export const langValueMap = Object.keys(langData).reduce<Record<LangValue, LangKey>>(
  (pre, cur) => {
    pre[langData[cur as LangKey]] = cur as LangKey;
    return pre;
  },
  {} as Record<LangValue, LangKey>,
);
export const lang = getCookieByName('blueking_language') || 'zh-cn';
export const t = (key: LangKey | NaturalDateKey | ShortTimeUnitDateKey | TimeUnitDateKey) => {
  // if (!langData[key] ) {
  //   console.info(`[i18n] ${key}: ${langData[key]}`);
  // }
  if (lang !== 'en') return shortTimeUnitLangData[key as ShortTimeUnitDateKey] || key;
  return (
    shortTimeUnitLangData[key as ShortTimeUnitDateKey] ||
    timeUnitLangData[key as TimeUnitDateKey] ||
    naturalDateLangData[key as NaturalDateKey] ||
    langData[key as LangKey] ||
    key
  );
};
