(function(c) {
	c.fn.stepperComp = function(f) {
		if (f && typeof(f) === "String" && f === "destroy") {
			return this.unbind(".stepper").removeClass(f.stepperClass).removeClass(f.upClass).removeClass(f.downClass).removeClass(f.upHoverClass).removeClass(f.downHoverClass).removeData("stepperMin").removeData("stepperMax").removeData("stepperReset").removeData("stepperStep").removeData("stepperBigStep")
		}
		var g;
		f = c.extend({}, c.fn.stepperComp.defaults, f);
		this.each(function() {
			var m = c(this),
				j = d("stepperMin", this),
				h = d("stepperMax", this),
				l = d("stepperStep", this),
				i = d("stepperBigStep", this),
				k = d("stepperReset", this),
				n = 2;
			if (j === g) {
				j = b(m.attr("min"), f.min)
			}
			if (h === g) {
				h = b(m.attr("max"), f.max)
			}
			if (!l) {
				l = b(m.attr("step"), f.step)
			}
			if (!i) {
				i = b(m.attr("bigStep"), f.bigStep)
			}
			if (k === g) {
				k = b(f.reset, m.val(), j, h)
			}
			if (n === g) {
				n = m.data("stepperScale")
			}
			n = (n || e(n)) ? n : f.scale;
			m.data("stepperMin", j);
			m.data("stepperMax", h);
			m.data("stepperStep", l);
			m.data("stepperBigStep", i);
			m.data("stepperReset", k);
			m.data("stepperScale", n)
		});
		return this.each(function() {
			var k, o, h, m;
			var n = c(this);
			n.bind("mousemove.stepper", function(s) {
				var r = c(this);
				var t = r.offset();
				var p = r.height() / 2;
				var q = (s.pageX > t.left + r.width() - f.buttonWidth);
				k = q && (s.pageY <= t.top + p);
				o = q && (s.pageY > t.top + p);
				r.toggleClass(f.upHoverClass, k).toggleClass(f.downHoverClass, o)
			}).bind("mouseout.stepper", function() {
				i();
				c(this).removeClass([f.upClass, f.downClass, f.upHoverClass, f.downHoverClass].join(" "));
				k = o = null
			}).bind("mousedown.stepper", function(p) {
				if (k || o) {
					c(this).toggleClass(f.upClass, k).toggleClass(f.downClass, o);
					l.apply(this, [p]);
					j(this, p)
				}
			}).bind("mouseup.stepper", function(p) {
				i();
				c(this).removeClass(f.upClass).removeClass(f.downClass)
			}).bind("keydown.stepper", function(t) {
				if (!f.keys || c.grep(f.keys, function(u) {
					return u === t.keyCode || (u instanceof RegExp && u.test(String.fromCharCode(t.keyCode)))
				}).length) {
					var s = c(this);
					var q = {
						up: 38,
						down: 40,
						pageUp: 33,
						pageDown: 34
					};
					var p = s.data("stepperBigStep");
					var r = t.shiftKey ? p : s.data("stepperStep");
					switch (t.keyCode) {
					case q.up:
						l.apply(this, [t, r, 1]);
						break;
					case q.down:
						l.apply(this, [t, r, -1]);
						break;
					case q.pageUp:
						l.apply(this, [t, p, 1]);
						break;
					case q.pageDown:
						l.apply(this, [t, p, -1]);
						break
					}
				} else {
					return !f.keys
				}
			}).bind("change.stepper", function(p) {
				l.apply(this, [p, 0])
			}).addClass(f.stepperClass);
			if (f.mousewheel) {
				c(this).mousewheel(function(s, t, q, p) {
					var r = s.shiftKey ? c(this).data("stepperBigStep") : c(this).data("stepperStep");
					if (t > 0) {
						l.apply(this, [s, r, 1])
					} else {
						if (t < 0) {
							l.apply(this, [s, r, -1])
						}
					}
					return false
				})
			}
			l.apply(this, [c.Event(), 0]);

			function l(u, r, w) {
				var p = c(this);
				if (f.ignore && p.is(f.ignore)) {
					return
				}
				r = b(r, p.data("stepperStep"), 1);
				w = w || (o ? -1 : 1);
				var x = p.val();
				var q = b(x, p.data("stepperReset"), 0);
				var s = b(p.data("stepperMin"));
				var v = b(p.data("stepperMax"));
				var t = [q, r, s, v, w, x, f];
				if (w > 0) {
					q = f.increment.apply(this, t)
				} else {
					if (w < 0) {
						q = f.decrement.apply(this, t)
					}
				}
				if (e(p.data("stepperScale")) && f.round) {
					q = f.round(q, p.data("stepperScale"))
				}
				if (e(s)) {
					q = Math.max(q, s)
				}
				if (e(v)) {
					q = Math.min(q, v)
				}
				var t = [q, r, s, v, w, x, f];
				if (q != x && p.triggerHandler("beforeSpin", t) !== false) {
					p.val(q);
					p.trigger("change", t);
					p.triggerHandler("spin", t)
				}
			}
			function j(p, q) {
				i();
				h = window.setTimeout(function() {
					l.apply(p, [q]);
					m = window.setInterval(function() {
						l.apply(p, [q])
					}, f.repeat)
				}, f.delay)
			}
			function i() {
				window.clearTimeout(h);
				window.clearInterval(m)
			}
		})
	};

	function e(f) {
		return !isNaN(parseFloat(f))
	}
	function b(f) {
		for (var g = 0; g < arguments.length; g++) {
			if (e(arguments[g])) {
				return Number(parseFloat(arguments[g]))
			}
		}
		return
	}
	function d(g, j) {
		var i = c(j || this).attr("class"),
			h = new RegExp("(\\b" + g + ")(\\S*)").exec(i),
			f = {
				"true": true,
				True: true,
				"false": false,
				False: false
			};
		if (h && h.length >= 3 && f[h[3]] !== undefined) {
			h[3] = f[h[3]]
		}
		return !h ? undefined : h.length >= 3 ? h[2] : null
	}
	c.fn.stepperComp.defaults = {
		min: 0,
		max: null,
		step: 1,
		bigStep: 10,
		keys: [/[0-9]/, 9, 13, 8, 46, 33, 34, 37, 38, 39, 40, 109, 188, 190],
		ignore: "[readonly],[disabled]",
		stepperClass: "stepper-active",
		upClass: "stepper-up",
		downClass: "stepper-down",
		upHoverClass: "stepper-up-hover",
		downHoverClass: "stepper-down-hover",
		mousewheel: true,
		change: true,
		increment: function(j, i, h, f, g) {
			return j + i
		},
		decrement: function(j, i, h, f, g) {
			return j - i
		},
		reset: null,
		delay: 500,
		repeat: 100,
		buttonWidth: 20,
		scale: true,
		round: function a(f, g) {
			return Math.round(f * Math.pow(10, g)) / Math.pow(10, g)
		}
	};
	c.fn.stepperRender = function() {
		var g = 0;
		var f = null;
		var h = 1;
		if (c(this).attr("min") != null) {
			g = parseInt(c(this).attr("min"))
		}
		if (c(this).attr("max") != null) {
			f = parseInt(c(this).attr("max"))
		}
		if (c(this).attr("step") != null) {
			h = parseInt(c(this).attr("step"))
		}
		c(this).stepperComp({
			min: g,
			max: f,
			step: h
		})
	}
})(jQuery);
(function(d) {
	var b = ["DOMMouseScroll", "mousewheel"];
	if (d.event.fixHooks) {
		for (var a = b.length; a;) {
			d.event.fixHooks[b[--a]] = d.event.mouseHooks
		}
	}
	d.event.special.mousewheel = {
		setup: function() {
			if (this.addEventListener) {
				for (var e = b.length; e;) {
					this.addEventListener(b[--e], c, false)
				}
			} else {
				this.onmousewheel = c
			}
		},
		teardown: function() {
			if (this.removeEventListener) {
				for (var e = b.length; e;) {
					this.removeEventListener(b[--e], c, false)
				}
			} else {
				this.onmousewheel = null
			}
		}
	};
	d.fn.extend({
		mousewheel: function(e) {
			return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
		},
		unmousewheel: function(e) {
			return this.unbind("mousewheel", e)
		}
	});

	function c(j) {
		var h = j || window.event,
			g = [].slice.call(arguments, 1),
			k = 0,
			i = true,
			f = 0,
			e = 0;
		j = d.event.fix(h);
		j.type = "mousewheel";
		if (h.wheelDelta) {
			k = h.wheelDelta / 120
		}
		if (h.detail) {
			k = -h.detail / 3
		}
		e = k;
		if (h.axis !== undefined && h.axis === h.HORIZONTAL_AXIS) {
			e = 0;
			f = -1 * k
		}
		if (h.wheelDeltaY !== undefined) {
			e = h.wheelDeltaY / 120
		}
		if (h.wheelDeltaX !== undefined) {
			f = -1 * h.wheelDeltaX / 120
		}
		g.unshift(j, k, f, e);
		return (d.event.dispatch || d.event.handle).apply(this, g)
	}
})(jQuery);