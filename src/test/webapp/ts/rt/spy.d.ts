interface Sinon {
	spy<T>(): T;
  spy<F extends Function>(func: F): F;
  spy<M extends Function>(obj: any, method: string): M;

	stub<T>(): T;
	stub<T>(obj: any): Stub;
	stub<M extends Function>(obj: any, method: string): Stub;
	stub<M extends Function>(obj: any, method: string, newMethod: M): Stub;
}

interface Window {
  sinon: Sinon;
}

interface Spy {
  callCount: number;
  called: boolean;
  calledOnce: boolean;
  calledWithExactly(...args: any[]): boolean;

	restore(): void;
}

interface Stub extends Spy {
	withArgs(...arg: any[]): Stub;
	returns(arg: any): Stub;
}

interface Object extends Spy {
}
