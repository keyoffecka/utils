interface Object {
  [idx: string]: any;
  toString(): string;
  constructor: Function;
	getOwnPropertyNames(obj: any): string[];
}

declare var Object: Object;
