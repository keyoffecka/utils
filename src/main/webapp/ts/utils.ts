module izedio.utils {
	export const UNDEFINED: any = ([])[0];

	/**
	 * There are two types of optional objects:
	 * 1) None - doesn't have a value. An attempt to get its value causes an error to be thrown.
	 * 2) Some - always has the same value set at the moment when the Some object has been created.
	 */
	export interface Option<T> {
		/**
		 * Returns true if the optional object has a value.
		 *
		 * @return true if the optional object has a value.
		 */
		isSome(): boolean;

		/**
		 * Returns true if the optional object has no value.
		 *
		 * @return true if the optional object has no value.
		 */
		isNone(): boolean;

		/**
		 * Returns the value of the optional object.
		 *
		 * @returns value of the optional object.
		 *
		 * @throws an error if the optional object has no value.
		 */
		get(): T;

		/**
		 * Executes a function if the optional object has a value.
		 * The value is then passed as a parameter of the function to be called.
		 */
	  exec(f: (value: T) => void): void;

		/**
		 * Executes a function if the optional object has no value.
		 */
		notExec(f: () => void): void;

		/**
		 * If the optional object has a value a mapper function is called
		 * and another optional object is created.
		 * The value of this object is passed as an argument to the mapper function.
		 * The value of the new optional object is equal to the value returned
		 * by the mapper function.
		 *
		 * @return an optional object initialised with the value returned by the mapper function.
		 */
		map<R>(f: (value: T) => R): Option<R>;

		/**
		 * If the optional object has a value a mapper function is called.
		 * The value of this optional object is passed as an argument to the mapper function.
		 * This function returns the same optional object as returned by the mapper function.
		 *
		 * @return an optional object returned by the mapper function.
		 */
		flatMap<R>(f: (value: T) => Option<R>): Option<R>;

		/**
		 * If the optional object has no value a mapper function is called
		 * and another optional object is created.
		 * The value of the new optional object is equal to the value returned
		 * by the mapper function.
		 *
		 * @return an optional object initialised with the value returned by the mapper function.
		 */
		or(f: () => T): Option<T>;

		/**
		 * If the optional object has no value a mapper function is called.
		 * This function returns the same optional object as returned by the mapper function.
		 *
		 * @return an optional object returned by the mapper function.
		 */
		flatOr(f: () => Option<T>): Option<T>;

		/**
		 * If the optional object has no value null is returned;
		 * if the optional object has a value, then this value is returned.
		 *
		 * @return null or value of this optional object.
		 */
		orNull(): T;
	}

	class Some<T> implements Option<T> {
		private value: T = null;

		constructor(value: T) {
			if (value == null) {
				throw new Error("A value expected");
			}

			this.value = value;
		}

		isSome(): boolean {return true;}
		isNone(): boolean {return !this.isSome();}

		get(): T {return this.value;}

		exec(f: (v: T) => void): void {
			f(this.value);
		}

		notExec(f: () => void): void {
		}

		map<R>(f: (v: T) => R): Option<R> {
			var result = f(this.value);
			return option(result);
		}

		flatMap<R>(f: (v: T) => Option<R>): Option<R> {
			var result = f(this.value);
			if (result == null) {
				throw new Error("An option is required");
			}
			return result;
		}

		or(f: () => T): Option<T> {return this;}

		flatOr(f: () => Option<T>): Option<T> {return this;}

		orNull(): T {return this.get();}
	}

	class None<T> implements Option<T> {
		isSome(): boolean {return false;}
		isNone(): boolean {return !this.isSome();}

		get(): T {throw new Error("Option is not set");};

		exec(f: (v: T) => void) {};

		notExec(f: () => void) {
			f();
		}

		map<R>(f: (v: T) => R): Option<R> {return none<R>();}

		flatMap<R>(f: (v: T) => Option<R>): Option<R> {return none<R>();}

		or(f: () => T): Option<T> {
			var result = f();
			return option(result);
		}

		flatOr(f: () => Option<T>): Option<T> {
			var result = f();
			if (result == null) {
				throw new Error("An option is required");
			}
			return result;
		}

		orNull(): T {return null;}
	}

	const NONE = new None<any>();

	/**
	 * Creates an optional object.
	 *
	 * @param v - value of the optional object.
	 * 					  If null, undefined or is not specified then None optional object is returned;
	 *					  otherwise a Some object is returned which value is v.
	 * @return Some object.
	 */
	export function option<T>(v?: T): Option<T> {
		var result: Option<T> = none<T>();
		if (v != null) {
			result = some(v);
		}
		return result;
	}

	/**
	 * Creates a Some object.
	 *
	 * @param v - value of the Some object.
	 * @return Some object.
	 */
	export function some<T>(v: T): Option<T> {
		var result = new Some(v);
		return result;
	}

	/**
	 * Returns a None object.
	 * This function always returns the same None object.
	 *
	 * @return None object.
	 */
	export function none<T>(): Option<T> {
		return <None<T>>NONE;
	}

	/**
	 * Future object can be in two states: completed or not completed.
	 * If the future is completed it is either succeeded or failed.
	 * If the future has succeeded it has a value.
	 * If the future has failed it has an error.
	 * If a future is completed it cannot change its state to not completed,
	 * or from succeeded to failed or from failed to succeeded.
	 * An attempt to complete an already completed future causes an error to be thrown.
	 * Future object has an internal bus, if a listener subscribes to listen events
	 * it will receive a notification when the future completes. If the future has
	 * already completed, the notification is sent immediately.
	 */
	export interface Future<T> {
		/**
		 * Returns true if the future is completed.
		 */
		isCompleted(): boolean;

		/**
		 * Returns true if the futures has failed.
		 */
		isFailure(): boolean;

		/**
		 * Returns true if the future has succeeded.
		 */
		isSuccess(): boolean;

		/**
		 * Returns a value of the succeeded future.
		 *
		 * @return future value.
		 * @throws an error if the future didn't succeed.
		 */
		value(): T;

		/**
		 * Returns an error of the failed future.
		 *
		 * @return error of the future.
		 * @throw an error if the future didn't fail.
		 */
		error<E>(): E;

		/**
		 * Executes a function which returned value will be the value of the future.
		 * If the function throws an error, the future completes with the error.
		 *
		 * @param f - function to execute.
		 */
		complete(f: () => T): void;

		/**
		 * Subscribes a listener to listen to the events of the future state changes.
		 * If the listener has already been subscribed, this has no effect.
		 */
		subscribe(listener: Listener): void;

		/**
		 * Unsubscribes a listener from listening to the events of the future state changes.
		 * This has no effect, if the listener hasn't been subscribed.
		 */
		unsubscribe(listener: Listener): void;
	}

	const COMPLETED = {};

	class SimpleFuture<T> implements Future<T> {
		private success = false;
		private _value: T = null;
		private _error: any = null;
		private bus = new Bus();

		isCompleted(): boolean {
			var result = this.isFailure() || this.isSuccess();
			return result;
		}

		isFailure(): boolean {
			var result = this._error !== null;
			return result;
		}

		isSuccess(): boolean {
			return this.success;
		}

		value(): T {
			if (!this.isSuccess()) {
				throw new Error("Future value is not set");
			}
			return this._value;
		}

		error<E>(): E {
			if (!this.isFailure()) {
				throw new Error("Future didn't fail");
			}
			return <E>this._error;
		}

		complete(f: () => T) {
			if (this.isCompleted()) {
				throw new Error("Future has completed");
			}

			try {
				this._value = f();
				this.success = true;
			} catch (error) {
				this._error = error;
			}

			this.bus.publish(COMPLETED, this);
		}

		subscribe(listener: Listener) {
			if (this.isCompleted()) {
				listener(listener, COMPLETED, this);
			} else {
				this.bus.subscribe(COMPLETED, listener);
			}
		}

		unsubscribe(listener: Listener) {
			this.bus.unsubscribe(COMPLETED, listener);
		}
	}

	class AndFuture implements Future<Future<any>[]> {
		private count = 0;
		private _error: Future<any> = null;
		private futures: Future<any>[] = [];
		private bus = new Bus();

		constructor(futures: Future<any>[]) {
			this.count = futures.length;

			this.mayBeNotify(); //If the count === 0 we need to say that this future is completed.

			for (var i in futures) {
				this.futures[i] = futures[i];
				this.futures[i].subscribe(this.onCompleted);
			}
		}

		isCompleted(): boolean {
			return this.isSuccess() || this.isFailure();
		}

		isSuccess(): boolean {
			return this.count === 0;
		}

		isFailure(): boolean {
			return this._error !== null;
		}

		value(): Future<any>[] {
			if (!this.isSuccess()) {
				throw new Error("Future value is not set");
			}

			return this.futures;
		}

		error(): Future<any> {
			if (!this.isFailure()) {
				throw new Error("Future didn't fail");
			}

			return this._error;
		}

		complete(f: () => Future<any>[]) {
			throw new Error("Unsupported operation");
		}

		subscribe(listener: Listener) {
			if (this.isCompleted()) {
				listener(listener, COMPLETED, this);
			} else {
				this.bus.subscribe(COMPLETED, listener);
			}
		}

		unsubscribe(listener: Listener) {
			this.bus.unsubscribe(COMPLETED, listener);
		}

		private mayBeNotify() {
			if (this.isCompleted()) {
				for (var i in this.futures) {
					this.futures[i].unsubscribe(this.onCompleted);
				}

				this.bus.publish(COMPLETED, this);
			}
		}

		private onCompleted = (self: Listener, eventType: any, future: Future<any>) => {
			if (future.isFailure()) {
				this._error = future;
			} else {
				this.count-= 1;
			}

			this.mayBeNotify();
		}
	}

	/**
	 * Creates an object that can be completed at some point in the future.
	 *
	 * @return a new future object.
	 */
	export function future<T>(): Future<T> {
		var future = new SimpleFuture<T>();
		return future;
	}

	/**
	 * Creates an object which will be completed when all underlying future objects complete
	 * or when one of them fails.
	 *
	 * @param futures - an array of underlying future objects,
	 *                  if the array is empty the new future objects completes immediately.
	 * @return a new future object.
	 */
	export function andFuture(futures?: Future<any>[]): Future<Future<any>[]> {
		if (futures === null) {
			throw new Error("Futures expected");
		}
		var future = new AndFuture(typeof futures === typeof UNDEFINED ? [] : futures);
		return future;
	}

	/**
	 * Creates an object which will be completed when all underlying future objects complete
	 * or when one of them fails.
	 *
	 * @param futures - underlying future objects,
	 *                  if none is passed the new future objects completes immediately.
	 * @return a new future object.
	 */
	export function andFutures(...futures: Future<any>[]): Future<Future<any>[]> {
		return andFuture(futures);
	}

	/**
	 * A function that is called when an event happens.
	 */
	export interface Listener {
		/**
		 * @param self - the listener object itself.
		 * @param eventType - type of the event that has happened.
		 * @param event - the happend event.
		 */
		<T>(self: Listener, eventType: any, event?: T): void;
	}

	class EventTypeContext {
		eventType: any;
		listeners: Listener[];
	}

	/**
	 * Notifier sends events to the subscribed listeners.
	 */
	export interface Notifier {
		/**
		 * Subscribes a listener to the given event type.
		 *
		 * @param eventType - type of the events to listen.
		 * @param listener - listener to subscribe.
		 */
		subscribe(eventType: any, listener: Listener): Listener;

		/**
		 * Unsubscribes a listener from listening the given event type.
		 *
		 * @param eventType - type of the events to stop listenning.
		 * @prama listener - listener to unsubscribe.
		 */
		unsubscribe(eventType: any, listener: Listener): Option<Listener>;
	}

	/**
	 * Bus implements subscribe an unsubscribe methods of the Notifier interface,
	 * and it's also provides a method to send events.
	 */
	export class Bus implements Notifier {
		private eventTypeContexts: EventTypeContext[] = [];

		subscribe(eventType: any, listener: Listener): Listener {
			if (eventType == null) {
				throw "Event type should be an object";
			}
			if (listener == null) {
				throw "Listener should be an object";
			}

			var eventTypeContext: EventTypeContext = null;
			for (var i = 0; i < this.eventTypeContexts.length; i++) {
				if (this.eventTypeContexts[i].eventType === eventType) {
					eventTypeContext = this.eventTypeContexts[i];
					break;
				}
			}

			if (eventTypeContext === null) {
				this.eventTypeContexts.push({
					eventType: eventType,
					listeners: [listener]
				});
			} else {
				var index: number = null;
				for (var i = 0; i < eventTypeContext.listeners.length; i++) {
					if (eventTypeContext.listeners[i] === listener) {
						index = i;
						break;
					}
				}
				if (index === null) {
					eventTypeContext.listeners.push(listener);
				}
			}

			return listener;
		}

		unsubscribe(eventType: any, listener: Listener): Option<Listener> {
			var result: Listener = null;

			var eventTypeContext: EventTypeContext = null;
			for (var i = 0; i < this.eventTypeContexts.length; i++) {
				if (this.eventTypeContexts[i].eventType === eventType) {
					eventTypeContext = this.eventTypeContexts[i];
					break;
				}
			}
			if (eventTypeContext !== null) {
				var index: number = null;
				for (var i = 0; i < eventTypeContext.listeners.length; i++) {
					if (eventTypeContext.listeners[i] === listener) {
						index = i;
						break;
					}
				}
				if (index !== null) {
					eventTypeContext.listeners.splice(index, 1);
					result = listener;
				}
			}

			return option(result);
		}

		/**
		 * Sends events of a given type to all subscribed listeners.
		 *
		 * @param eventType - event type to send.
		 * @param event - event to send.
		 */
		publish(eventType: any, event?: any) {
			var eventTypeContext: EventTypeContext = null;
			for (var i = 0; i < this.eventTypeContexts.length; i++) {
				if (this.eventTypeContexts[i].eventType === eventType) {
					eventTypeContext = this.eventTypeContexts[i];
					break;
				}
			}
			if (eventTypeContext !== null) {
				for (var i = 0; i < eventTypeContext.listeners.length; i++) {
					var listener = eventTypeContext.listeners[i];
					listener(listener, eventType, event);
				}
			}
		}
	}
}