export enum ENode {
  TYPE_ENUM = 1,
  TYPE_RANG = 2,
  TYPE_REPEAT = 3,
  TYPE_RANG_REPEAT = 4
}
interface INode {
  type: string;
  value: string | number;
  min: number;
  max: number;
  repeatInterval: number
}
export class Node {
  type = '';
  value = '';
  min = 0;
  max = 0;
  repeatInterval = 0;
  constructor({
    type,
    value,
    min,
    max,
    repeatInterval,
  }: INode) {
    this.type = type;
    this.value = value || '';
    this.min = min;
    this.max = max;
    this.repeatInterval = repeatInterval;
  }
}