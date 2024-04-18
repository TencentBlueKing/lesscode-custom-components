import { ENode, Node } from './node';
const weekDayMap: { [key: number]: string } = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
};
const weekDesDayMap: { [key: string]: string } = {
  sun: '日',
  mon: '一',
  tue: '二',
  wed: '三',
  thu: '四',
  fri: '五',
  sat: '六',
};

const getWeekDayValue = (value: string | number) => {
  if (weekDayMap[value as number]) {
    return weekDayMap[value as number];
  }
  const text = value.toString().toLowerCase();
  if (weekDesDayMap[text]) {
    return weekDesDayMap[text];
  }
  return value;
};

const getHourValue = (value: number) => {
  const num = ~~value;
  if (num < 5) {
    return `凌晨${num}点`;
  }
  if (num < 12) {
    return `上午${num}点`;
  }
  if (num === 12) {
    return `中午${num}点`;
  }
  if (num < 18) {
    return `下午${num}点`;
  }
  return `晚上${num}点`;
};

const getMinuteValue = (value: number) => {
  const num = ~~value;
  if (num < 10) {
    return `0${num}`;
  }
  return num;
};

const translateMap: { [key: string]: any } = {
  minute: {
    genAll: () => '每分钟',
    [ENode.TYPE_ENUM]: (node: Node) => `${getMinuteValue(node.value as unknown as number)}分`,
    [ENode.TYPE_RANG]:  (node: Node) => `${getMinuteValue(node.min)}分到${getMinuteValue(node.max)}分`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `每隔${node.repeatInterval}分钟`;
      }
      return `从${getMinuteValue(node.value as unknown as number)}分开始每隔${node.repeatInterval}分钟`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `从${getMinuteValue(node.min)}分开始到${getMinuteValue(node.max)}分的每${node.repeatInterval}分钟`,
  },
  hour: {
    genAll: () => '每小时',
    [ENode.TYPE_ENUM]: (node: Node) => `${getHourValue(node.value as unknown as number)}`,
    [ENode.TYPE_RANG]: (node: Node) => `${getHourValue(node.min)}到${getHourValue(node.max)}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `每隔${node.repeatInterval}个小时`;
      }
      return `从${getHourValue(node.value as unknown as number)}开始每隔${node.repeatInterval}个小时`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `从${getHourValue(node.min)}开始到${getHourValue(node.max)}的每${node.repeatInterval}个小时`,
  },
  dayOfMonth: {
    genAll: () => '每天',
    [ENode.TYPE_ENUM]: (node: Node) => `${node.value}号`,
    [ENode.TYPE_RANG]: (node: Node) => `${node.min}号到${node.max}号`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `每隔${node.repeatInterval}天`;
      }
      return `从${node.value}号开始每隔${node.repeatInterval}天`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `从${node.min}号开始到${node.max}号的每${node.repeatInterval}天`,
  },
  month: {
    genAll: () => '每月',
    [ENode.TYPE_ENUM]: (node: Node) => `${node.value}月`,
    [ENode.TYPE_RANG]: (node: Node) => `${node.min}月到${node.max}月`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `每隔${node.repeatInterval}个月`;
      }
      return `从${node.value}月开始每隔${node.repeatInterval}个月`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `从${node.min}月开始到${node.max}月的每${node.repeatInterval}个月`,
  },
  dayOfWeek: {
    genAll: () => '每天',
    [ENode.TYPE_ENUM]: (node: Node) => `每周${getWeekDayValue(node.value)}`,
    [ENode.TYPE_RANG]: (node: Node) => `每周${getWeekDayValue(node.min)}到周${getWeekDayValue(node.max)}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `每个星期内的每隔${node.repeatInterval}天`;
      }
      return `从每周${getWeekDayValue(node.value)}开始每隔${node.repeatInterval}天`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `从每周${getWeekDayValue(node.min)}开始到周${getWeekDayValue(node.max)}的每隔${node.repeatInterval}天`,
  },
};

export default (ast: { minute: string | any[]; hour: string | any[]; }) => {
  const concatTextNew = (ast: { [x: string]: any; minute?: string | any[]; hour?: string | any[]; }, field: string) => {
    if (!Object.prototype.hasOwnProperty.call(ast, field)) {
      return '';
    }
    const sequence = ast[field];
    const translate = translateMap[field];
    if (sequence.length < 1) {
      return translate.genAll();
    }
    const stack = sequence.map((node: Node) => translate[node.type](node));
    if (stack.length < 2) {
      return stack.join('');
    }
    const pre = stack.slice(0, -1);
    const last = stack.slice(-1);
    return `${pre.join('，')}和${last[0]}`;
  };

  return [
    concatTextNew(ast, 'minute'),
    concatTextNew(ast, 'hour'),
    concatTextNew(ast, 'dayOfMonth'),
    concatTextNew(ast, 'dayOfWeek'),
    concatTextNew(ast, 'month'),
  ];
};