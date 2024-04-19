
import { lang } from '../lang/lang';
import translateCN from './translate-cn';
import translateEN from './translate-en';
import {
  optimze,
  parsetext,
} from './utils';

const fieldList = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
];

const print = (expression: any) => {
  const atoms = (`${expression}`).trim().split(/\s+/);
  const fieldMap: { [key: string]: any } = {};
  atoms.forEach((item, index) => {
    fieldMap[fieldList[index]] = parsetext(item);
  });
  const ast = optimze(fieldMap);
  return lang !== 'en' ? translateCN(ast as any) : translateEN(ast as any);
};

export default (expression: string) => print(expression);