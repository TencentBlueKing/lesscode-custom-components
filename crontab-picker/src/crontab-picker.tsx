import { defineComponent, ref } from 'vue';
import { t } from './lang/lang';
import CronExpression from 'cron-parser-custom';
import './crontab-picker.scss';
import { prettyDateTimeFormat } from './utils/time';

const TIME_STRS = [
  { name: t('分'), class: 'minute' },
  { name: t('时'), class: 'hour' },
  { name: t('日'), class: 'dayOfMonth' },
  { name: t('月'), class: 'month' },
  { name: t('周'), class: 'minute' },
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
  emits: ['update:modelValue'],
  setup(props) {
    const nativeValue = ref('');
    const selectIndex = ref('');
    const inputRef = ref();
    const nextTime = ref<string[]>([]);
    const errorField = ref('');
    const isError = ref(false);
    const parseValue = ref([]);

    init();

    function init() {
      nativeValue.value = props.modelValue;
    }

    function checkAndTranslate(value: string) {
      const interval = CronExpression.parse(`0 ${value.trim()}`, {
        currentDate: new Date(),
      });
      let i = 5;
      const nextTimeTemp = [];
      while (i > 0) {
        nextTimeTemp.push(prettyDateTimeFormat(interval.next().toString()));
        i -= 1;
      }
      nextTime.value = nextTimeTemp;
      errorField.value = '';
      isError.value = false;
      parseValue.value = [];
    }

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
      setTimeout(() => {
        selectIndex.value = label;
        inputRef.value.focus();
        inputRef.value.selectionStart = preStrLength;
        inputRef.value.selectionEnd = endPosition;
      });
    }

    function handleBlur() {}

    function handleInput() {}

    function handleSelectText() {}

    return {
      inputRef,
      nativeValue,
      handleTimeTextChange,
      handleBlur,
      handleInput,
      handleSelectText,
    };
  },
  render() {
    return (
      <div class='__bk_crontab-picker__'>
        <div class='time-describe'>
          {TIME_STRS.map(item => (
            <span
              class={[item.class, 'time-text']}
              onClick={() => this.handleTimeTextChange(item.class)}
            >
              {item.name}
            </span>
          ))}
        </div>
        <div class='time-input'>
          <input
            ref={this.inputRef}
            class='input'
            type='text'
            value={this.nativeValue}
            onBlur={this.handleBlur}
            onInput={this.handleInput}
            onKeyup={this.handleSelectText}
            onMousedown={this.handleSelectText}
          ></input>
        </div>
      </div>
    );
  },
});
