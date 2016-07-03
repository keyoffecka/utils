module izedio.utils {
	describe("Bus", () => {
		it("should subscribe a listener to listen to events of the specified type, motifiy the listeners and unsubscribe them", () => {
			var l = window.sinon.spy((listener: Listener, et: any, e: any) => {
				l.should.be.exactly(listener);
				et.should.be.exactly("et");
				e.should.be.exactly("e");
			});
			var ll = window.sinon.spy((listener: Listener, et: any, e: any) => {
				ll.should.be.exactly(listener);
				et.should.be.exactly("e");
				e.should.be.exactly("et");
			});

			var bus = new Bus();
			bus.subscribe("et", l);
			bus.subscribe("et", l);
			bus.publish("et", "e");
			bus.publish("et", "e");
			bus.publish("e", "et");

			bus.subscribe("e", ll);
			bus.unsubscribe("et", l);

			bus.publish("et", "e");
			bus.publish("e", "et");

			l.callCount.should.be.exactly(2);
			ll.callCount.should.be.exactly(1);
		});
	});

	describe("option", () => {
		describe("#some", () => {
			it("should create Some", () => {
				var o = {};
				var option = some(o);
				option.isSome().should.be.true();
				option.isNone().should.be.false();
				option.get().should.be.exactly(o);
				option.orNull().should.be.exactly(o);
			});

			it("should fail if no value is supplied", () => {
				some.should.throw("A value expected");
			});
		});

		describe("#none", () => {
			it("should create None", () => {
				var option = none();
				option.isSome().should.be.false();
				option.isNone().should.be.true();
				(option.orNull() === null).should.be.true();
			});
		});

		describe("#option", () => {
			it("should create Some if a value is specified", () => {
				option({}).isSome().should.be.true();
			});
			it("should create None if null is passed", () => {
				option(null).isNone().should.be.true();
			});
			it("should create None if nothing is passed", () => {
				option().isNone().should.be.true();
			});
			it("should create None if undefined is passed", () => {
				option(UNDEFINED).isNone().should.be.true();
			});
		});

		describe("Some", () => {
			describe("#exec", () => {
				it("should execute a function", () => {
					var a = {};
					some(a).exec((v) => {
						a.should.be.exactly(v);
					});
				});
			});

			describe("#noExec", () => {
				it("should not execute a function", () => {
					var f = window.sinon.spy(() => {});
					some({}).notExec(f);
					f.called.should.be.false();
				});
			});

			describe("#map", () => {
				it("should map to another value", () => {
					var b = {}
					some({}).map((v) => {
						return b;
					}).get().should.be.exactly(b);
				});

				it("should map to none if null is supplied", () => {
					some({}).map((v) => {
						return null;
					}).isNone().should.be.true();
				});

				it("should map to none if undefined is supplied", () => {
					some({}).map((v) => {
						return UNDEFINED;
					}).isNone().should.be.true();
				});
			})

			describe("#flatMap", () => {
				it("should map to another value", () => {
					var b = some({});
					some({}).flatMap((v) => {
						return b;
					}).should.be.exactly(b);
				});

				it("should map to none if none is supplied", () => {
					some({}).flatMap((v) => {
						return none();
					}).isNone().should.be.true();
				});

				it("should throw if null is supplied", () => {
					var a = {};
					(() => {
						some(a).flatMap((v) => {
							return null;
						});
					}).should.throw("An option is required");
				});

				it("should throw if an undefuned value is supplied", () => {
					var a = {};
					(() => {
						some(a).flatMap((v) => {
							return UNDEFINED;
						});
					}).should.throw("An option is required");
				});
			})

			describe("#or", () => {
				it("should return the same value", () => {
					var f = window.sinon.spy((): any => {
						return {};
					});
					var a = {};
					some(a).or(f).get().should.be.exactly(a);
					f.called.should.be.false();
				});
			})

			describe("#flatOr", () => {
				it("should return the same option", () => {
					var f = window.sinon.spy((): Option<any> => {
						return option({});
					});
					var a = {};
					some(a).flatOr(f).get().should.be.exactly(a);
					f.called.should.be.false();
				});
			})
		});

		describe("None", () => {
			describe("#get", () => {
				it("should throw an exception", () => {
					var n = none();
					n.get.should.throw("Option is not set");
				});
			});

			describe("#exec", () => {
				it("should not execute a function", () => {
					var f = window.sinon.spy((v: any) => {});
					none().exec(f);
					f.called.should.be.false();
				});
			});

			describe("#notExec", () => {
				it("should execute a function", () => {
					var f = window.sinon.spy(() => {});
					none().notExec(f);
					f.calledOnce.should.be.true();
				});
			});

			describe("#or", () => {
				it("should return some", () => {
					var b = {}
					none().or(() => {
						return b;
					}).get().should.be.exactly(b);
				});
				it("should return none if null is supplied", () => {
					var f = window.sinon.spy(() => {
						return null;
					});
					none().or(f).isNone().should.be.true();
					f.calledOnce.should.be.true();
				});
				it("should return none if undefined is supplied", () => {
					var f = window.sinon.spy(() => {
						return UNDEFINED;
					});
					none().or(f).isNone().should.be.true();
					f.calledOnce.should.be.true();
				});
			})

			describe("#flatOr", () => {
				it("should return the supplied option", () => {
					var b = some({});
					none().flatOr(() => {
						return b;
					}).should.be.exactly(b);
				});

				it("should return none if none is supplied", () => {
					var f = window.sinon.spy(() => {
						return none();
					});
					none().flatOr(f).isNone().should.be.true();
					f.calledOnce.should.be.true();
				});

				it("should throw an error if null is supplied", () => {
					(() => {
						none().flatOr(() => {return null;});
					}).should.throw();
				});

				it("should throw an error if undefined value is supplied", () => {
					(() => {
						none().flatOr(() => {return UNDEFINED;});
					}).should.throw();
				});
			})

			describe("#map", () => {
				it("should return none", () => {
					var f = window.sinon.spy((v: any): any => {
						return {};
					});
					var n = none();
					n.map(f).should.be.exactly(n);
					f.called.should.be.false();
				});
			})

			describe("#flatMap", () => {
				it("should return none", () => {
					var f = window.sinon.spy((v: any): Option<any> => {
						return option({});
					});
					var n = none();
					n.flatMap(f).should.be.exactly(n);
					f.called.should.be.false();
				});
			})
		});
	});

	describe("future", () => {
		describe("#future", () => {
			it("should create a future", () => {
				var f = future();
				f.should.not.be.null();
			});
		});

		describe("#andFuture", () => {
			it("should create an and-future", () => {
				var f = andFuture();
				f.should.not.be.null();

				var f = andFuture([]);
				f.should.not.be.null();

				var ff = andFuture([f]);
				ff.should.not.be.null();

				var fff = andFuture([f, ff]);
				fff.should.not.be.null();
			});

			it("should throw exceptions if one of the underlying futures is null", () => {
				(() => {
					var f = andFuture();
					andFuture([f, null]);
				}).should.throw();
			});
		});

		describe("#andFutures", () => {
			it("should create an and-future", () => {
				var f = andFutures();
				(()=>{
					f.complete(()=>{return <Future<any>[]>null});
				}).should.throw("Unsupported operation");
				f.should.not.be.null();

				var ff = andFutures(f);
				ff.should.not.be.null();

				var fff = andFutures(f, ff);
				fff.should.not.be.null();
			});

			it("should throw exceptions if one of the underlying futures is null", () => {
				(() => {
					var f = future();
					andFutures(f, null);
				}).should.throw();
			});
		});

		describe("AndFuture", () => {
			it("should complete immediately when there are no underlying futures", () => {
				var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {
					self.should.be.exactly(l);
					future.should.be.exactly(f);
				});

				var f = andFuture();

				f.isCompleted().should.be.true();
				f.isFailure().should.be.false();
				f.isSuccess().should.be.true();

				f.subscribe(l);

				l.calledOnce.should.be.true();
			});

			it("should complete when all underlying futures complete", () => {
				var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {
					self.should.be.exactly(l);
					future.should.be.exactly(f);
				});

				var f1 = future<number>();
				var f2 = future<string>();

				var f = andFutures(f1, f2);

				f.isCompleted().should.be.false();
				f.isFailure().should.be.false();
				f.isSuccess().should.be.false();

				f.subscribe(l);

				f1.complete(()=>{return 1;});
				f2.complete(()=>{return "1";});

				f.isCompleted().should.be.true();
				f.isFailure().should.be.false();
				f.isSuccess().should.be.true();

				(()=>{f.error();}).should.throw("Future didn't fail");
				f.value().should.be.eql([f1, f2]);

				l.calledOnce.should.be.true();
			});

			it("should fail when one underlying future fails", () => {
				var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {
					self.should.be.exactly(l);
					future.should.be.exactly(f);
				});

				var f1 = future<number>();
				var f2 = future<string>();
				var f3 = future<string>();

				var f = andFutures(f1, f2, f3);

				f.isCompleted().should.be.false();
				f.isFailure().should.be.false();
				f.isSuccess().should.be.false();

				f.subscribe(l);

				f1.complete(()=>{return 1;});
				f2.complete(()=>{throw {}; return "1";});

				f.isCompleted().should.be.true();
				f.isFailure().should.be.true();
				f.isSuccess().should.be.false();

				f.error().should.be.exactly(f2);
				(()=>{f.value();}).should.throw("Future value is not set");

				l.calledOnce.should.be.true();
			});

			describe("#unsubscrine", () => {
				it("should unsubscribe a listener and do not notify it when the future succeeds", () => {
					var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {});
					var f1 = future<number>();
					var f = andFutures(f1);
					f.subscribe(l);
					f.unsubscribe(l);
					f1.complete(() => {
						return 78;
					});
					l.called.should.be.false();
				});

				it("should unsubscribe a listener and do not notify it when the future fails", () => {
					var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {});
					var f1 = future<number>();
					var f = andFutures(f1);
					f.subscribe(l);
					f.unsubscribe(l);
					f1.complete(() => {
						throw {};
						return <number>null;
					});
					l.called.should.be.false();
				});
			});
		});

		describe("Future", () => {
			describe("#unsubscrine", () => {
				it("should unsubscribe a listener and do not notify it when the future succeeds", () => {
					var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {});
					var f = future<number>();
					f.subscribe(l);
					f.unsubscribe(l);
					f.complete(() => {
						return 78;
					});
					l.called.should.be.false();
				});

				it("should unsubscribe a listener and do not notify it when the future fails", () => {
					var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {});
					var f = future<number>();
					f.subscribe(l);
					f.unsubscribe(l);
					f.complete(() => {
						throw {};
						return <number>null;
					});
					l.called.should.be.false();
				});
			});

			describe("#complete", () => {
				it("should complete the future and notify listeners", () => {
					var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {
						self.should.be.exactly(l);
						future.should.be.exactly(f);
					});
					var f = future<number>();
					f.subscribe(l);

					f.isCompleted().should.be.false();
					f.isFailure().should.be.false();
					f.isSuccess().should.be.false();

					f.complete(() => {
						return 78;
					});

					f.value().should.be.exactly(78);
					f.isCompleted().should.be.true();
					f.isFailure().should.be.false();
					f.isSuccess().should.be.true();

					(()=>{f.error();}).should.throw("Future didn't fail");

					(() => {
						f.complete(() => {
							return 78;
						});
					}).should.throw("Future has completed");

					(() => {
						f.complete(() => {
							throw new Error("");
							return <number>null;
						});
					}).should.throw("Future has completed");

					l.calledOnce.should.be.true();

					var ll = window.sinon.spy((self: Listener, eventType: any, future: any) => {
						self.should.be.exactly(ll);
						future.should.be.exactly(f);
					});

					f.subscribe(ll);
					ll.calledOnce.should.be.true();
				})

				it("should fail the future and notify listeners", () => {
					var l = window.sinon.spy((self: Listener, eventType: any, future: any) => {
						self.should.be.exactly(l);
						future.should.be.exactly(f);
					});
					var f = future<number>();
					f.subscribe(l);

					f.isCompleted().should.be.false();
					f.isFailure().should.be.false();
					f.isSuccess().should.be.false();

					var e = {};

					f.complete(() => {
						throw e;
						return <number> null;
					});

					(()=>{f.value();}).should.throw("Future value is not set");

					f.error().should.be.exactly(e);
					f.isCompleted().should.be.true();
					f.isFailure().should.be.true();
					f.isSuccess().should.be.false();

					(() => {
						f.complete(() => {
							return 78;
						});
					}).should.throw("Future has completed");

					(() => {
						f.complete(() => {
							throw new Error("");
							return <number> null;
						});
					}).should.throw("Future has completed");

					l.calledOnce.should.be.true();

					var ll = window.sinon.spy((self: Listener, eventType: any, future: any) => {
						self.should.be.exactly(ll);
						future.should.be.exactly(f);
					});

					f.subscribe(ll);
					ll.calledOnce.should.be.true();
				})
			});
		});
	});
}