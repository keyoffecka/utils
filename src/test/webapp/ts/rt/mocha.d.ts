declare function describe(name: string, func: () => void): void;
declare function it(name: string, func: () => void): void;
declare function suite(name: string, func: () => void): void;
declare function test(name: string, func: () => void): void;
declare function setup(func: () => void): void;
declare function beforeEach(func: () => void): void;
declare function afterEach(func: () => void): void;
