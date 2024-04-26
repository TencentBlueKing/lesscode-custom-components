import { ENode, Node } from './node';
import { ordinalSuffixOf } from './utils';

const weekDayMap: { [key: number]: string } = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

const weekDesDayMap: { [key: string]: string } = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Sunday',
};

const dayMap: { [key: number | string]: string } = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
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


const getMonthValue = (value: number | string) => dayMap[value];

const getRepeatIntervalueText = (value: string | number) => {
  if (parseInt(value as string, 10) === 1) {
    return ' ';
  }
  return ` ${ordinalSuffixOf(value as number)} `;
};

const formatNumber = (value: string | number) => {
  const num = ~~value;
  if (num < 10) {
    return `0${num}`;
  }
  return num;
};

const translateMap: { [key: string]: any } = {
  minute: {
    genAll: () => 'every minute',
    [ENode.TYPE_ENUM]: (node: Node) => `${node.value}`,
    [ENode.TYPE_RANG]: (node: Node) => `every minute from ${node.min} through ${node.max}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `every${getRepeatIntervalueText(node.repeatInterval)}minute`;
      }
      return `every${getRepeatIntervalueText(node.repeatInterval)}minute from ${node.value} through 59`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `every${getRepeatIntervalueText(node.repeatInterval)}minute from ${node.min} through ${node.max}`,
  },
  hour: {
    genAll: () => '',
    [ENode.TYPE_ENUM]: (node: Node) => `${node.value}`,
    [ENode.TYPE_RANG]: (node: Node) => `every hour from ${node.min} through ${node.max}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `every${getRepeatIntervalueText(node.repeatInterval)}hour`;
      }
      return `every${getRepeatIntervalueText(node.repeatInterval)}hour from ${node.value} through 23`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `every${getRepeatIntervalueText(node.repeatInterval)}hour from ${node.min} through ${node.max}`,
  },
  dayOfMonth: {
    genAll: () => '',
    [ENode.TYPE_ENUM]: (node: Node) => `${node.value}`,
    [ENode.TYPE_RANG]: (node: Node) => `every day-of-month ${node.min} from ${node.max}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `every ${getRepeatIntervalueText(node.repeatInterval)}day-of-month`;
      }
      return `every${getRepeatIntervalueText(node.repeatInterval)}day-of-month from ${node.value} through 31`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `every${getRepeatIntervalueText(node.repeatInterval)}day-of-month from ${node.min} through ${node.max}`,
  },
  month: {
    genAll: () => '',
    [ENode.TYPE_ENUM]: (node: Node) => `${getMonthValue(node.value as unknown as number)}`,
    [ENode.TYPE_RANG]: (node: Node) => `every month from ${getMonthValue(node.min)} through ${getMonthValue(node.max)}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `every${getRepeatIntervalueText(node.repeatInterval)}month`;
      }
      return `every${getRepeatIntervalueText(node.repeatInterval)}month from ${getMonthValue(node.value as unknown as number)} through December`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `every${getRepeatIntervalueText(node.repeatInterval)}month from ${getMonthValue(node.min)} through ${getMonthValue(node.max)}`,
  },
  dayOfWeek: {
    genAll: () => '',
    [ENode.TYPE_ENUM]: (node: Node) => `${getWeekDayValue(node.value)}`,
    [ENode.TYPE_RANG]: (node: Node) => `every day-of-week ${getWeekDayValue(node.min)} through ${getWeekDayValue(node.max)}`,
    [ENode.TYPE_REPEAT]: (node: Node) => {
      if (node.value === '*') {
        return `every${getRepeatIntervalueText(node.repeatInterval)}day-of-week`;
      }
      return `every${getRepeatIntervalueText(node.repeatInterval)}day-of-week from ${getWeekDayValue(node.value)} through Sunday`;
    },
    // eslint-disable-next-line max-len
    [ENode.TYPE_RANG_REPEAT]: (node: Node) => `every${getRepeatIntervalueText(node.repeatInterval)}day-of-week from ${getWeekDayValue(node.min)} through ${getWeekDayValue(node.max)}`,
  },
};

export default (ast: { minute: string | any[]; hour: string | any[]; }) => {
  const concatTextNew = (ast: { [x: string]: any; minute?: string | any[]; hour?: string | any[]; }, field: string, prefix: string, unit: string) => {
    if (!Object.prototype.hasOwnProperty.call(ast, field)) {
      return '';
    }
    const sequence = ast[field];
    const translate = translateMap[field];
    if (sequence.length < 1) {
      const all = translate.genAll();
      return all ? `${prefix} ${all}` : all;
    }

    let start = prefix;
    if (sequence[0].type === ENode.TYPE_ENUM && unit) {
      start = `${start} ${unit}`;
    }

    const stack = sequence.map((node: { type: string | number; }) => translate[node.type](node));
    if (stack.length < 2) {
      return `${start} ${stack.join('')}`;
    }
    const pre = stack.slice(0, -1);
    const last = stack.slice(-1);
    return `${start} ${pre.join(',')}, and ${last[0]}`;
  };

  let textMinute = concatTextNew(ast, 'minute', 'At', 'minute');
  let textHour = concatTextNew(ast, 'hour', 'past', 'hour');
  if (ast.minute.length === 1 && ast.hour.length === 1) {
    const minuteNode = ast.minute[0];
    const hourNode = ast.hour[0];
    if (minuteNode.type === ENode.TYPE_ENUM && hourNode.type === ENode.TYPE_ENUM) {
      textMinute = `:${formatNumber(minuteNode.value)}`;
      textHour = `At ${formatNumber(hourNode.value)}`;
    }
  }
  const textDayOfMonth = concatTextNew(ast, 'dayOfMonth', 'on', 'day-of-month');
  const textDayOfWeek = concatTextNew(ast, 'dayOfWeek', 'on', '');

  return [
    textMinute,
    textHour,
    textDayOfMonth,
    textDayOfMonth && textDayOfWeek ? `and ${textDayOfWeek}` : textDayOfWeek,
    concatTextNew(ast, 'month', 'in', ''),
  ];
};