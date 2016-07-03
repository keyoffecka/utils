interface EventListener<E extends Event> extends Function {
	(event: E): void;
}
