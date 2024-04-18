
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

const print = (expression) => {
  const atoms = (`${expression}`).trim().split(/\s+/);
  const fieldMap = {};
  atoms.forEach((item, index) => {
    fieldMap[fieldList[index]] = parsetext(item);
  });
  const ast = optimze(fieldMap);
  return lang !== 'en' ? translateCN(ast) : translateEN(ast);
};

export default expression => print(expression);