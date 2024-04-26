export enum ENode {
  TYPE_ENUM = 1,
  TYPE_RANG = 2,
  TYPE_REPEAT = 3,
  TYPE_RANG_REPEAT = 4
}
interface INode {
  type?: ENode;
  value?: string;
  min?: string;
  max?: string;
  repeatInterval?: string;
}
export class Node {
  type = 0;
  value: string = '';
  min = '';
  max = '';
  repeatInterval = '';
  constructor({
    type,
    value,
    min,
    max,
    repeatInterval,
  }: INode) {
    this.type = type || 0;
    this.value = value || '';
    this.min = min || '';
    this.max = max || '';
    this.repeatInterval = repeatInterval || '';
  }
}