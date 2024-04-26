
import { lang } from '../lang/lang';
import translateCN from './translate-cn';
import translateEN from './translate-en';
import {
  optimze,
  parsetext,
} from './utils';
import { Node } from './node';

const fieldList = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
];

const print = (expression: string) => {
  const atoms = (`${expression}`).trim().split(/\s+/);
  const fieldMap: Record<string, Node[]> = {};
  atoms.forEach((item, index) => {
    fieldMap[fieldList[index]] = parsetext(item);
  });
  const ast = optimze(fieldMap);
  return lang !== 'en' ? translateCN(ast) : translateEN(ast);
};

export default (expression: string) => print(expression);