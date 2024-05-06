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
import { defineComponent, ref } from 'vue';
import { t, lang } from './lang/lang';
import CronExpression from 'cron-parser-custom';
import './crontab-picker.scss';
import { prettyDateTimeFormat } from './utils/time';
import Translate from './utils/translate';
import { AngleDoubleLeft } from 'bkui-vue/lib/icon';
import { debounce } from './utils/utils';

const TIME_STRS = [
  { name: t('分'), class: 'minute' },
  { name: t('时'), class: 'hour' },
  { name: t('日'), class: 'dayOfMonth' },
  { name: t('月'), class: 'month' },
  { name: t('周'), class: 'dayOfWeek' },
];

const labelIndexMap: { [key: string | number]: string | number } = {
  minute: 0,
  hour: 1,
  dayOfMonth: 2,
  month: 3,
  dayOfWeek: 4,
  0: 'minute',
  1: 'hour',
  2: 'dayOfMonth',
  3: 'month',
  4: 'dayOfWeek',
};

export default defineComponent({
  name: 'CrontabPicker',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'change', 'input'],
  setup(props, { emit }) {
    const nativeValue = ref('');
    const selectIndex = ref<string | number>('');
    const inputRef = ref();
    const nextTime = ref<string[]>([]);
    const errorField = ref('');
    const isError = ref(false);
    const parseValue = ref<string[]>([]);
    const isTimeMore = ref(false);

    const handleInputDebounce = debounce(handleInput, 200, false);

    init();

    function init() {
      nativeValue.value = props.modelValue;
      if (!!nativeValue.value) {
        checkAndTranslate(nativeValue.value);
      }
    }

    /**
     * @description 检测crontab格式和翻译
     * @param value
     */
    function checkAndTranslate(value: string) {
      const interval = CronExpression.parse(`0 ${value.trim()}`, {
        currentDate: new Date(),
      });
      let i = 5;
      const nextTimeTemp: string[] = [];
      while (i > 0) {
        nextTimeTemp.push(prettyDateTimeFormat(interval.next().toString()));
        i -= 1;
      }
      nextTime.value = nextTimeTemp;
      errorField.value = '';
      isError.value = false;
      parseValue.value = Translate(value);
    }

    /**
     * @description 选中crontab字段
     * @param label  选中的字段名
     * @returns
     */
    function handleTimeTextChange(label: string) {
      if (!nativeValue.value) {
        return;
      }
      const timeItem = nativeValue.value.split(' ');
      const index = labelIndexMap[label] as number;
      if (timeItem.length < index) {
        return;
      }
      const preStrLength = timeItem.slice(0, index).join('').length + index;
      const endPosition = preStrLength + timeItem[index].length;
      selectIndex.value = label;
      inputRef.value.focus();
      inputRef.value.selectionStart = preStrLength;
      inputRef.value.selectionEnd = endPosition;
    }

    /**
     * @description 失去焦点
     */
    function handleBlur() {
      selectIndex.value = '';
    }

    /**
     * @description 输入框输入
     * @param event
     */
    function handleInput(event: Event | any) {
      const { value } = event.target;
      nativeValue.value = value;
      try {
        checkAndTranslate(value);
        emit('update:modelValue', value);
        emit('change', value);
        emit('input', value);
      } catch (error: any) {
        parseValue.value = [];
        nextTime.value = [];
        const all = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];
        if (all.includes(error.message)) {
          errorField.value = error.message;
        }
        isError.value = true;
        emit('update:modelValue', '');
        emit('change', '');
        emit('input', '');
      }
    }

    /**
     * @description 选中输入框文本
     * @param event
     * @returns
     */
    function handleSelectText(event: Event | any) {
      if (
        !(event.type === 'mousedown' || (event.type === 'keyup' && ['ArrowLeft', 'ArrowRight'].includes(event.code)))
      ) {
        return;
      }
      const $target = event.target;
      const value = `${$target.value}`.trim();
      nativeValue.value = value;
      if (!value) return;
      setTimeout(() => {
        const cursorStart = $target.selectionStart;
        const cursorStr = value.slice(0, cursorStart);
        const checkBackspce = cursorStr.match(/ /g);
        if (checkBackspce) {
          selectIndex.value = labelIndexMap[checkBackspce.length];
        } else {
          selectIndex.value = labelIndexMap['0'];
        }
      });
    }

    /**
     * @description 展示下次执行时间列表
     */
    function handleShowMore() {
      isTimeMore.value = !isTimeMore.value;
    }

    function renderText() {
      if (parseValue.value.length > 1) {
        if (lang !== 'en') {
          return (
            <div class='time-parse'>
              {[
                parseValue.value[4] ? <span class='month'>{parseValue.value[4]}</span> : undefined,
                parseValue.value[1] ? <span class='dayOfMonth'>{parseValue.value[2]}</span> : undefined,
                parseValue.value[1] && parseValue.value[3] ? <span>以及当月</span> : undefined,
                parseValue.value[3] ? <span class='dayOfWeek'>{parseValue.value[3]}</span> : undefined,
                parseValue.value[2] ? <span class='hour'>{parseValue.value[1]}</span> : undefined,
                <span class='minute'>{parseValue.value[0]}</span>,
              ]}
            </div>
          );
        } else {
          return (
            <div class='time-parse'>
              {[
                parseValue.value[1] && /^At/.test(parseValue.value[1]) ? (
                  <>
                    <span class='hour'>{parseValue.value[1]}</span>
                    <span class='minute'>{parseValue.value[0]}</span>
                  </>
                ) : (
                  <>
                    <span class='minute'>{parseValue.value[0]}</span>
                    {parseValue.value[1] ? <span class='hour'>{parseValue.value[1]}</span> : undefined}
                  </>
                ),
                parseValue.value[2] ? <span class='dayOfMonth'> {parseValue.value[2]}</span> : undefined,
                parseValue.value[3] ? <span class='dayOfWeek'> {parseValue.value[3]}</span> : undefined,
                parseValue.value[4] ? <span class='month'> {parseValue.value[4]}</span> : undefined,
              ]}
            </div>
          );
        }
      }
      return undefined;
    }

    return {
      inputRef,
      nativeValue,
      nextTime,
      selectIndex,
      errorField,
      isError,
      isTimeMore,
      handleTimeTextChange,
      handleBlur,
      handleInputDebounce,
      handleSelectText,
      renderText,
      handleShowMore,
    };
  },
  render() {
    return (
      <div
        class={[
          '__bk_crontab-picker__',
          { 'is-error': this.isError },
          `select-${this.selectIndex}`,
          `error-${this.errorField}`,
        ]}
      >
        <div class='time-describe'>
          {TIME_STRS.map(item => (
            <span
              class={['time-text', item.class]}
              onClick={() => this.handleTimeTextChange(item.class)}
            >
              {item.name}
            </span>
          ))}
        </div>
        <div class='time-input'>
          <input
            ref='inputRef'
            class='input'
            type='text'
            value={this.nativeValue}
            onBlur={this.handleBlur}
            onInput={this.handleInputDebounce}
            onKeyup={this.handleSelectText}
            onMousedown={this.handleSelectText}
          ></input>
        </div>
        {this.renderText()}
        {this.nextTime.length ? (
          <div class={['time-next', { active: this.isTimeMore }]}>
            <div class='label'>{t('下次')}：</div>
            <div class='value'>
              {this.nextTime.map((time, index) => (
                <div key={`${time}${index}`}>{time}</div>
              ))}
            </div>
            <div
              class='arrow'
              onClick={this.handleShowMore}
            >
              <AngleDoubleLeft class='arrow-button'></AngleDoubleLeft>
            </div>
          </div>
        ) : undefined}
      </div>
    );
  },
});
