export enum ENode {
  TYPE_ENUM = 1,
  TYPE_RANG = 2,
  TYPE_REPEAT = 3,
  TYPE_RANG_REPEAT = 4
}
interface INode {
  type: ENode;
  value?: string | number;
  min: string |number;
  max: string | number;
  repeatInterval: string | number
}
export class Node {
  type = 0;
  value = '';
  min = '';
  max = '';
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