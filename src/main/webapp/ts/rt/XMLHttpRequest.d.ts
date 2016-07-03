declare class XMLHttpRequest {
  open(method: string, url: string, async?: boolean): void;
  send(): void;
  onreadystatechange: () => void;
  readyState: XHRReadyState;
	status: HTTPStatus;
	responseText: string;
}
