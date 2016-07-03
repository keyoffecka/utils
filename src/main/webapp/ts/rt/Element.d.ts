interface Element extends Node {
  getAttribute(name: String): string;
  querySelector(query: string): Node;
  querySelectorAll(query: string): NodeList;

	addEventListener<E extends Event>(type: string, eventListener: EventListener<E>): void;
}
