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
import { DateValue } from '.';
export type StoreType = 'local' | 'session';
/**
 *
 * @param storeKey store key
 * @returns store value list
 */
export const getStoreDateList = (storeKey: string, type: StoreType = 'local') => {
  const store = type === 'local' ? localStorage : sessionStorage;
  const storeListStr = store.getItem(storeKey);
  let list = [];
  if (storeListStr) {
    try {
      list = JSON.parse(storeListStr);
    } catch {
      list = [];
    }
  }
  if (!Array.isArray(list)) {
    list = [];
  }
  return list;
};
/**
 *
 * @param val store value
 * @param storeKey store key
 * @returns void
 */
export const setStoreDateList = (val: DateValue | number[] | string[], storeKey: string, type: StoreType = 'local') => {
  let list: (DateValue | number[] | string[])[] = [];
  const store = type === 'local' ? localStorage : sessionStorage;
  const storeListStr = store.getItem(storeKey);
  if (storeListStr) {
    try {
      list = JSON.parse(storeListStr);
    } catch {
      list = [];
    }
  }
  if (!Array.isArray(list)) {
    list = [];
  }
  if (list.some(item => item[0] === val[0] && item[1] === val[1])) return;
  list.unshift(val);
  store.setItem(storeKey, JSON.stringify(list.slice(0, 10)));
};
