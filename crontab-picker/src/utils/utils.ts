/* eslint-disable @typescript-eslint/no-this-alias */
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
import { ENode, Node } from './node';

export const optimze = (fieldMap: Record<string, Node[]>) => {
  const isAllValue = (node: Node[]) =>
    node.length === 1 && node[0].type === ENode.TYPE_ENUM && (node[0].value === '*' || node[0].value === '?');
  const prettyMap: Record<string, Node[]> = {};

  prettyMap.month = isAllValue(fieldMap.month) ? [] : fieldMap.month;

  if (isAllValue(fieldMap.dayOfMonth) && isAllValue(fieldMap.month) && isAllValue(fieldMap.dayOfWeek)) {
    prettyMap.dayOfMonth = [];
    delete prettyMap.month;
  } else {
    if (!isAllValue(fieldMap.dayOfWeek)) {
      prettyMap.dayOfWeek = fieldMap.dayOfWeek;
    }
    if (!isAllValue(fieldMap.dayOfMonth)) {
      prettyMap.dayOfMonth = fieldMap.dayOfMonth;
    }
    if (!prettyMap.dayOfMonth && !prettyMap.dayOfWeek && prettyMap.month.length > 0) {
      prettyMap.dayOfMonth = [];
    }
  }
  prettyMap.hour = isAllValue(fieldMap.hour) ? [] : fieldMap.hour;
  if (prettyMap.hour.length < 1 && prettyMap.dayOfMonth && prettyMap.dayOfMonth.length < 1) {
    delete prettyMap.dayOfMonth;
  }
  prettyMap.minute = isAllValue(fieldMap.minute) ? [] : fieldMap.minute;
  if (prettyMap.minute.length < 1 && prettyMap.hour.length < 1) {
    delete prettyMap.hour;
  }
  return prettyMap;
};

export const parsetext = (expression: string) => {
  const stack: Node[] = [];
  const rangReg = /-/;
  const repeatReg = /\//;
  const atoms = `${expression}`.trim().split(',');
  let index = -1;
  while (++index < atoms.length) {
    const enumValue = atoms[index];
    if (rangReg.test(enumValue) && repeatReg.test(enumValue)) {
      // 在指定区间重复
      const [rang, repeatInterval] = enumValue.split('/');
      const [min, max] = rang.split('-');
      stack.push(
        new Node({
          type: ENode.TYPE_RANG_REPEAT,
          min,
          max,
          repeatInterval,
        }),
      );
      continue;
    } else if (repeatReg.test(enumValue)) {
      // 从指定起始位置重复
      const [value, repeatInterval] = enumValue.split('/');
      stack.push(
        new Node({
          type: ENode.TYPE_REPEAT,
          value,
          repeatInterval,
        }),
      );
      continue;
    } else if (rangReg.test(enumValue)) {
      // 指定区间
      const [min, max] = enumValue.split('-');
      stack.push(
        new Node({
          type: ENode.TYPE_RANG,
          min,
          max,
        }),
      );
      continue;
    } else {
      stack.push(
        new Node({
          type: ENode.TYPE_ENUM,
          value: enumValue,
        }),
      );
    }
  }
  return stack;
};

export const ordinalSuffixOf = (i: number) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

/**
 * @desc 函数防抖 非装饰器版
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export const debounce = function (func: any, wait: number, immediate = true) {
  let timeout: any;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const args = [...arguments];
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
};
