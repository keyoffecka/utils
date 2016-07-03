interface Function {
	call<T>(context: any, ...args: any[]): T;
}