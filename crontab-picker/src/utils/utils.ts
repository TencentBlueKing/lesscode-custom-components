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
