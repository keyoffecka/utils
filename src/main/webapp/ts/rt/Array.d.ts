declare class Array<A> {
  [ids: number]: A;
  length: number;
  push(element: A): void;
  slice(start: number, end?: number): A[];
  splice(start: number, count?: number, ...elements: A[]): A[];
  forEach(func: (element?: A, index?: number, array?: A[]) => void, that?: any): void;
	filter(func: (element?: A, index?: number, array?: A[]) => void, that? : any): boolean;
  indexOf(element: A): number;
}

interface MatchArray extends Array<string> {
  input: string;
  index: number;
}