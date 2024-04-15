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

// @ts-nocheck
import { createApp, h } from 'vue';

import { DatePicker } from './vue3';

export default {
  beforeDestroy() {
    this.unWatchStack.forEach(unWatch => unWatch?.());
    this.app?.unmount();
  },
  created() {
    const props = this.$props;
    const emit = this.$emit.bind(this);
    let datePickerInstance;
    this.app = createApp({
      render() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        datePickerInstance = this;
        return h(DatePicker, {
          behavior: this.behavior || props.behavior,
          commonUseList: this.commonUseList || props.commonUseList,
          disabled: this.disabled || props.disabled,
          format: this.format || props.format,
          modelValue: this.modelValue || props.modelValue,
          needTimezone: this.needTimezone || props.needTimezone,
          'onUpdate:modelValue'() {
            emit('update:modelValue', ...arguments);
            emit('change', ...arguments);
          },
          'onUpdate:timezone'() {
            emit('update:timezone', ...arguments);
            emit('timezoneChange', ...arguments);
          },
          ref: 'datePickerRef',
          timezone: this.timezone || props.timezone,
          version: this.version || props.version,
        });
      },
    });
    this.unWatchStack = Object.keys(this.$props).map(k => {
      return this.$watch(k, v => {
        datePickerInstance[k] = v;
        datePickerInstance.$forceUpdate();
      });
    });
  },
  data() {
    return {
      app: null,
      unWatchStack: [],
    };
  },
  methods: {
    handleHidePanel() {
      this.app?._instance?.refs?.datePickerRef?.handleHidePanel?.();
    },
    handleShowPanel() {
      this.app?._instance?.refs?.datePickerRef?.handleShowPanel?.();
    },
  },
  mounted() {
    this.app?.mount(this.$el);
  },
  name: 'DatePicker',
  props: DatePicker.props || {},
  render(createElement) {
    return createElement('div');
  },
};
export * from './utils/constant';
export * from './utils/date';
export type * from './utils/types';
