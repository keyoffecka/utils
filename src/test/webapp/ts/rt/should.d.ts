interface Should {
  eql(value: any): void;
  exactly(value: any): void;
  equal(value: any): void;
  instanceOf(value: any): void;
  throw(match?: any): boolean;
  true(): void;
  false(): void;
	null(): void;
  not: Should;
  be: Should;
}

interface Object {
  should: Should;
}