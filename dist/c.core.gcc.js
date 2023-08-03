(function () {
	const f = {
		aliceblue: "#f0f8ff",
		antiquewhite: "#faebd7",
		aqua: "#00ffff",
		aquamarine: "#7fffd4",
		azure: "#f0ffff",
		beige: "#f5f5dc",
		bisque: "#ffe4c4",
		black: "#000000",
		blanchedalmond: "#ffebcd",
		blue: "#0000ff",
		blueviolet: "#8a2be2",
		brown: "#a52a2a",
		burlywood: "#deb887",
		cadetblue: "#5f9ea0",
		chartreuse: "#7fff00",
		chocolate: "#d2691e",
		coral: "#ff7f50",
		cornflowerblue: "#6495ed",
		cornsilk: "#fff8dc",
		crimson: "#dc143c",
		cyan: "#00ffff",
		darkblue: "#00008b",
		darkcyan: "#008b8b",
		darkgoldenrod: "#b8860b",
		darkgray: "#a9a9a9",
		darkgreen: "#006400",
		darkgrey: "#a9a9a9",
		darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",
		darkolivegreen: "#556b2f",
		darkorange: "#ff8c00",
		darkorchid: "#9932cc",
		darkred: "#8b0000",
		darksalmon: "#e9967a",
		darkseagreen: "#8fbc8f",
		darkslateblue: "#483d8b",
		darkslategray: "#2f4f4f",
		darkslategrey: "#2f4f4f",
		darkturquoise: "#00ced1",
		darkviolet: "#9400d3",
		deeppink: "#ff1493",
		deepskyblue: "#00bfff",
		dimgray: "#696969",
		dimgrey: "#696969",
		dodgerblue: "#1e90ff",
		firebrick: "#b22222",
		floralwhite: "#fffaf0",
		forestgreen: "#228b22",
		fuchsia: "#ff00ff",
		gainsboro: "#dcdcdc",
		ghostwhite: "#f8f8ff",
		gold: "#ffd700",
		goldenrod: "#daa520",
		gray: "#808080",
		green: "#008000",
		greenyellow: "#adff2f",
		grey: "#808080",
		honeydew: "#f0fff0",
		hotpink: "#ff69b4",
		indianred: "#cd5c5c",
		indigo: "#4b0082",
		ivory: "#fffff0",
		khaki: "#f0e68c",
		lavender: "#e6e6fa",
		lavenderblush: "#fff0f5",
		lawngreen: "#7cfc00",
		lemonchiffon: "#fffacd",
		lightblue: "#add8e6",
		lightcoral: "#f08080",
		lightcyan: "#e0ffff",
		lightgoldenrodyellow: "#fafad2",
		lightgray: "#d3d3d3",
		lightgreen: "#90ee90",
		lightgrey: "#d3d3d3",
		lightpink: "#ffb6c1",
		lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",
		lightskyblue: "#87cefa",
		lightslategray: "#778899",
		lightslategrey: "#778899",
		lightsteelblue: "#b0c4de",
		lightyellow: "#ffffe0",
		lime: "#00ff00",
		limegreen: "#32cd32",
		linen: "#faf0e6",
		magenta: "#ff00ff",
		maroon: "#800000",
		mediumaquamarine: "#66cdaa",
		mediumblue: "#0000cd",
		mediumorchid: "#ba55d3",
		mediumpurple: "#9370db",
		mediumseagreen: "#3cb371",
		mediumslateblue: "#7b68ee",
		mediumspringgreen: "#00fa9a",
		mediumturquoise: "#48d1cc",
		mediumvioletred: "#c71585",
		midnightblue: "#191970",
		mintcream: "#f5fffa",
		mistyrose: "#ffe4e1",
		moccasin: "#ffe4b5",
		navajowhite: "#ffdead",
		navy: "#000080",
		oldlace: "#fdf5e6",
		olive: "#808000",
		olivedrab: "#6b8e23",
		orange: "#ffa500",
		orangered: "#ff4500",
		orchid: "#da70d6",
		palegoldenrod: "#eee8aa",
		palegreen: "#98fb98",
		paleturquoise: "#afeeee",
		palevioletred: "#db7093",
		papayawhip: "#ffefd5",
		peachpuff: "#ffdab9",
		peru: "#cd853f",
		pink: "#ffc0cb",
		plum: "#dda0dd",
		powderblue: "#b0e0e6",
		purple: "#800080",
		rebeccapurple: "#663399",
		red: "#ff0000",
		rosybrown: "#bc8f8f",
		royalblue: "#4169e1",
		saddlebrown: "#8b4513",
		salmon: "#fa8072",
		sandybrown: "#f4a460",
		seagreen: "#2e8b57",
		seashell: "#fff5ee",
		sienna: "#a0522d",
		silver: "#c0c0c0",
		skyblue: "#87ceeb",
		slateblue: "#6a5acd",
		slategray: "#708090",
		slategrey: "#708090",
		snow: "#fffafa",
		springgreen: "#00ff7f",
		steelblue: "#4682b4",
		tan: "#d2b48c",
		teal: "#008080",
		thistle: "#d8bfd8",
		tomato: "#ff6347",
		turquoise: "#40e0d0",
		violet: "#ee82ee",
		wheat: "#f5deb3",
		white: "#ffffff",
		whitesmoke: "#f5f5f5",
		yellow: "#ffff00",
		yellowgreen: "#9acd32",
	};
	let n = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
		p = /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,
		r = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
		t = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
		u = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i,
		w = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(?:(\d+(?:\.\d+)?)|(?:\.\d+))\)$/i;
	function x(...a) {
		var b;
		Array.isArray(a[0]) && (a = a[0]);
		let c = a[0];
		if ("number" === typeof c)
			1 === a.length
				? (b = [c, c, c, 1])
				: 2 === a.length
				? (b = [c, a[1], 0, 1])
				: 3 === a.length
				? (b = [c, a[1], a[2], 1])
				: 4 === a.length && (b = [c, a[1], a[2], a[3]]);
		else if ("string" == typeof c)
			if (((b = c.replace(/\s/g, "").toLowerCase()), f[b])) b = x(f[b]).rgbaA;
			else if (n.test(b))
				(b = n
					.exec(b)
					.slice(1)
					.map((g) => parseInt(g + g, 16))),
					(b[3] = 1);
			else if (r.test(b))
				(b = r
					.exec(b)
					.slice(1)
					.map((g) => parseInt(g, 16))),
					(b[3] = 1);
			else if (p.test(b))
				(b = p
					.exec(b)
					.slice(1)
					.map((g) => parseInt(g + g, 16))),
					(b[3] /= 255);
			else if (t.test(b))
				(b = t
					.exec(b)
					.slice(1)
					.map((g) => parseInt(g, 16))),
					(b[3] /= 255);
			else if (u.test(b))
				(b = u
					.exec(b)
					.slice(1)
					.map((g) => parseInt(g, 10))),
					(b[3] = 1);
			else if (w.test(b))
				b = w
					.exec(b)
					.slice(1)
					.map((g, h) => (3 == h ? parseFloat(g) : parseInt(g, 10)));
			else throw Error("Given color is not valid: " + b);
		else return (b = c), { rgbaA: b, rgba: b, hex6: b, hex8: b, hex: b, hsl: b };
		a = b[3];
		b[3] *= 255;
		let e = "#";
		b.map((g, h) => {
			3 > h && ((g = Math.round(g).toString(16)), (e += 1 == g.length ? "0" + g : g));
		});
		let d = "#";
		b.map((g, h) => {
			4 > h && ((g = Math.round(g).toString(16)), (d += 1 == g.length ? "0" + g : g));
		});
		b[3] = a;
		return {
			rgbaA: b,
			rgba: `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${b[3]})`,
			hex6: e,
			hex8: d,
			hex: d,
			hsl: `hsl(${b[0]}, ${b[1]}, ${b[2]})`,
		};
	}
	function y(a, b, c = {}) {
		var e = {
			width: 200,
			height: 200,
			dpr: Math.ceil(window.devicePixelRatio || 1),
			doFill: !0,
			doStroke: !0,
			pathStarted: !1,
			yAxisInverted: !1,
			pauseAnimations: !1,
			netRotation: 0,
			currentLoop: void 0,
			currentLoopName: void 0,
			textAlign: "start",
			textBaseline: "alphabetic",
			fillStyle: "#ffffff",
			background: "#ffffff",
			strokeStyle: "#000000",
			colorMode: "rgba",
			lineWidth: 1,
			fontSize: "20px",
			fontFamily: "serif",
			fontStyle: "normal",
			fontVariant: "normal",
			fontWeight: "normal",
			fontStretch: "normal",
			lineHeight: 1.2,
			font: "20px serif",
			events: {},
		};
		c = z(e, c);
		let d;
		"string" === typeof b
			? (b = document.querySelector(b))
			: b instanceof HTMLElement || (b = document.body);
		let g = b.querySelector("canvas");
		d = g ? g : y.makeCanvas(c);
		"number" !== typeof b.CID && (b.CID = 1);
		let h = b.CID,
			k = b.id || b.classList.item(0),
			m = c.name || d.name;
		"string" != typeof m && ((m = k + "-C-" + h), (c.name = m));
		d.id = m;
		d.classList.add(m);
		b.appendChild(d);
		g
			? (y.workingContext = d.context)
			: (y.resizeCanvas(d, c),
			  (b = d.getContext("2d")),
			  A(c, b),
			  (d.context = b),
			  d.context.setTransform(c.dpr, 0, 0, c.dpr, 0, 0),
			  (y.workingContext = d.context),
			  (y.workingContext.savedStates = e),
			  (y.workingContext.delayedAnimations = []));
		y.contextList[m] = d.context;
		e = {};
		for (let l in c.events) if ((b = c.events[l])) d.addEventListener(l, b), (e[l] = b);
		d.events = e;
		y.dpr = c.dpr;
		y.workingCanvas = d;
		a();
	}
	y.contextList = {};
	y.nameID = 0;
	y.getWindowWidth = function (a = document.body) {
		a = window.getComputedStyle(a);
		return (
			parseInt(a.width, 10) - parseInt(a.paddingRight, 10) - parseInt(a.paddingLeft, 10)
		);
	};
	y.resizeCanvas = function (a, b) {
		const c = b.width,
			e = b.height;
		b = b.dpr || window.devicePixelRatio;
		a.style.width = c + "px";
		a.style.height = e + "px";
		a.width = b * c;
		a.height = b * e;
		a.rWidth = c;
		a.rHeight = e;
	};
	y.makeCanvas = function (a) {
		const b = document.createElement("canvas");
		y.resizeCanvas(b, a);
		return b;
	};
	y.addExtension = function (a) {
		A(a, window);
		A(a, y.extensions, !1);
	};
	y.debugAnimations = !1;
	y.extensions = {};
	y.debug = function (a) {
		y.debugAnimations = "boolean" !== typeof a ? !0 : a;
	};
	y.getCanvas = function (a) {
		return y.contextList[a] || y.workingContext;
	};
	y._ANIMATIONLOG_ = [];
	y.functions = {};
	y.COLORLIST = {};
	(function (a) {
		let b = Object.keys(a);
		for (let c = 0; c < b.length; c++) {
			let e = b[c];
			Object.defineProperty(window, e, {
				configurable: !0,
				enumerable: !0,
				get: a[e],
				set: function (d) {
					Object.defineProperty(window, e, {
						configurable: !0,
						enumerable: !0,
						value: d,
						writable: !0,
					});
				},
			});
		}
	})({
		CENTERX: function () {
			return y.workingCanvas.rWidth / 2;
		},
		CENTERY: function () {
			return y.workingCanvas.rHeight / 2;
		},
	});
	window.C = y;
	let aa = { loop: 1 },
		B = {
			number: "color: #9afcad;",
			keyword: "color: #adacdf;",
			running: "color: yellow;",
			delayed: "color: orange;",
			finished: "color: #3aff5f;",
		};
	function D(a, b = a) {
		y.workingContext.scale(a, b);
		0 > b && (y.workingContext.yAxisInverted = !0);
	}
	function E() {
		y.workingContext.setTransform(y.dpr, 0, 0, y.dpr, 0, 0);
	}
	function F(a) {
		a = y.contextList[a] || y.workingContext;
		return {
			background: a.background,
			colorMode: a.colorMode,
			strokeStyle: a.strokeStyle,
			fillStyle: a.fillStyle,
			lineWidth: a.lineWidth,
			doStroke: a.doStroke,
			doFill: a.doFill,
			pathStarted: a.pathStarted,
			yAxisInverted: a.yAxisInverted,
			netRotation: a.netRotation,
			fontStyle: a.fontStyle,
			fontVariant: a.fontVariant,
			fontWeight: a.fontWeight,
			fontStretch: a.fontStretch,
			fontSize: a.fontSize,
			lineHeight: a.lineHeight,
			fontFamily: a.fontFamily,
			font: a.font,
			textAlign: a.textAlign,
			textBaseline: a.textBaseline,
			events: a.events,
		};
	}
	function G(a, b, c, e, d = 100, g = {}, h) {
		function k() {
			l.currentLoop = window.requestAnimationFrame(k);
			y.workingContext = l;
			let v = F(c);
			g && A(q, y.workingContext);
			b(window.performance.now() - l.timeStart, m());
			g && A(v, y.workingContext);
		}
		function m() {
			let v = window.performance.now(),
				C = v - l.recentTimeStamp;
			l.recentTimeStamp = v;
			l.timeDelayList.push(C);
			l.totalTimeCaptured += C;
			l.timeDelayList.length > d && (l.totalTimeCaptured -= l.timeDelayList.shift());
			return l.timeDelayList.length / (l.totalTimeCaptured / 1e3);
		}
		let l;
		"function" == typeof a && ((g = e = c = b = a = aa.loop++), (h = arguments[4]));
		c ? (l = y.contextList[c]) : ((l = y.workingContext), (c = l.name));
		l.timeDelayList = [];
		l.totalTimeCaptured = 0;
		let q = Object.assign(F(c) || {}, g);
		if (void 0 != l.currentLoop)
			y.debugAnimations &&
				(console.log(c + ": " + a + " %cdelayed", B.delayed),
				y._ANIMATIONLOG_.push({
					canvas: l,
					animationName: a,
					state: "delayed",
					settings: q,
				})),
				l.delayedAnimations.push({
					name: a,
					settings: q,
					functionToRun: b,
					canvasName: c,
					timeDelay: e,
					timeDelaysToRemember: d,
					dur: h,
				});
		else {
			if (y.debugAnimations) {
				let v = `${c}: ${a} %crunning`,
					C = [B.running];
				void 0 != h && ((v += `%c for %c${h}ms`), C.push(B.keyword, B.number));
				y._ANIMATIONLOG_.push({
					canvas: l,
					animationName: a,
					state: "running",
					settings: q,
					dur: h,
				});
				console.log(v, ...C);
			}
			l.recentTimeStamp = window.performance.now();
			l.timeStart = window.performance.now();
			isNaN(e)
				? k()
				: ((l.currentLoopName = a),
				  (l.currentLoop = setInterval(function () {
						y.workingContext = l;
						let v = F(c);
						A(q, y.workingContext);
						b(window.performance.now() - l.timeStart, m());
						A(v, y.workingContext);
				  }, e)));
		}
	}
	function H(a = !1) {
		let b = y.workingContext;
		if (a) {
			let {
				fontStyle: c,
				fontVariant: e,
				fontWeight: d,
				fontStretch: g,
				fontSize: h,
				lineHeight: k,
				fontFamily: m,
			} = b;
			return `${c} ${e} ${d} ${g} ${h}/${k} ${m}`;
		}
		return b.font;
	}
	function I(a = "image/png") {
		return y.workingContext.canvas.toDataURL(a);
	}
	var J = {
		background: function (...a) {
			a = x(a).hex8;
			let b = y.workingContext;
			b.background = a;
			b.save();
			E();
			b.fillStyle = a;
			b.fillRect(0, 0, b.canvas.width, b.canvas.height);
			b.restore();
		},
		clear: function (a, b, c, e) {
			let d = y.workingContext,
				g = y.dpr;
			a = a || 0;
			b = b || 0;
			c = c || d.canvas.width;
			e = e || d.canvas.height;
			d.save();
			d.setTransform(g, 0, 0, g, 0, 0);
			d.clearRect(a, b, c, e);
			d.restore();
		},
		endShape: function () {
			let a = y.workingContext;
			a.closePath();
			a.pathStarted = !1;
		},
		fill: function (...a) {
			let b = y.workingContext;
			0 !== arguments.length ? ((b.fillStyle = x(a).hex8), (b.doFill = !0)) : b.fill();
		},
		fontFamily: function (a) {
			let b = y.workingContext;
			b.fontFamily = a;
			b.font = H(!0);
		},
		fontSize: function (a) {
			let b = y.workingContext;
			b.fontSize = "number" === typeof a ? a + "px" : a;
			b.font = H(!0);
		},
		fontStretch: function (a) {
			let b = y.workingContext;
			b.fontStretch = a;
			b.font = H(!0);
		},
		fontStyle: function (a) {
			let b = y.workingContext;
			b.fontStyle = a;
			b.font = H(!0);
		},
		fontVariant: function (a) {
			let b = y.workingContext;
			b.fontVariant = a;
			b.font = H(!0);
		},
		fontWeight: function (a) {
			let b = y.workingContext;
			b.fontWeight = a;
			b.font = H(!0);
		},
	};
	J.getCanvasData = I;
	J.getContextStates = F;
	J.getFont = H;
	J.lineCap = function (a) {
		y.workingContext.lineCap = a;
	};
	J.lineDash = function () {
		y.workingContext.setLineDash([...arguments]);
	};
	J.lineHeight = function (a) {
		let b = y.workingContext;
		b.lineHeight = a;
		b.font = H(!0);
	};
	J.lineJoin = function (a) {
		y.workingContext.lineJoin = a;
	};
	J.lineTo = function (a, b) {
		y.workingContext.lineTo(a, b);
	};
	J.loop = G;
	J.measureText = function (a) {
		return y.workingContext.measureText(a);
	};
	J.moveTo = function (a, b) {
		y.workingContext.moveTo(a, b);
	};
	J.noFill = function () {
		y.workingContext.doFill = !1;
	};
	J.noLoop = function (a, b) {
		let c = y.workingContext;
		a ? (c = y.contextList[a]) : (a = c.name);
		clearInterval(c.currentLoop);
		window.cancelAnimationFrame(c.currentLoop);
		c.currentLoop = void 0;
		if (y.debugAnimations) {
			a = `${a}: ${c.currentLoopName} %cfinished`;
			let e = [B.finished];
			void 0 != b && ((a += `%c in %c${b.toFixed(3)}ms`), e.push(B.keyword, B.number));
			console.log(a, ...e);
			y._ANIMATIONLOG_.push({
				canvas: c,
				animationName: c.currentLoopName,
				state: "finished",
				endTime: b,
			});
		}
		0 < c.delayedAnimations.length &&
			((b = c.delayedAnimations.shift()),
			G(
				b.name,
				b.functionToRun,
				b.canvasName,
				b.timeDelay,
				b.timeDelaysToRememberm,
				b.settings,
				b.dur,
			));
	};
	J.noStroke = function () {
		y.workingContext.doStroke = !1;
	};
	J.permaBackground = function (a) {
		"string" != typeof a && (a = I());
		let b = y.workingContext.canvas.style;
		b.background = "url('" + a + "')";
		b.backgroundPosition = "center";
		b.backgroundSize = "cover";
	};
	J.putImageData = function () {
		y.workingContext.putImageData(...arguments);
	};
	J.rest = E;
	J.restore = function () {
		A(y.workingContext.savedStates, y.workingContext);
		y.workingContext.restore();
	};
	J.rotate = function (a) {
		let b = y.workingContext;
		b.rotate(a);
		b.netRotation = ((b.netRotation + a) % Math.PI) * 2;
	};
	J.save = function () {
		y.workingContext.savedStates = F();
		y.workingContext.save();
	};
	J.saveCanvas = function (a = "drawing", b = "image/png") {
		b = I().replace(b, "image/octet-stream");
		let c = document.createElement("a");
		c.download = a + ".png";
		c.href = b;
		c.click();
	};
	J.scale = D;
	J.setImageSmoothing = function (a) {
		y.workingContext.imageSmoothingEnabled = !!a;
	};
	J.startShape = function () {
		let a = y.workingContext;
		a.beginPath();
		a.pathStarted = !0;
	};
	J.stroke = function (...a) {
		let b = y.workingContext;
		0 < arguments.length ? ((b.strokeStyle = x(a).hex8), (b.doStroke = !0)) : b.stroke();
	};
	J.strokeWidth = function (a) {
		y.workingContext.lineWidth = Number(a);
	};
	J.textAlign = function (a) {
		y.workingContext.textAlign = a;
	};
	J.textBaseline = function (a) {
		y.workingContext.textBaseline = a;
	};
	J.transform = function (a, b, c, e, d, g) {
		let h = y.workingContext;
		if (void 0 == a || null == a) return y.workingContext.getTransform();
		a instanceof DOMMatrix
			? h.setTransform(a.a, a.b, a.c, a.d, a.e, a.f)
			: h.setTransform(a || 0, b || 0, c || 0, e || 0, d || 0, g || 0);
		h.scale(y.dpr, y.dpr);
	};
	J.translate = function (a, b = 0) {
		y.workingContext.translate(a, b);
	};
	const ba = 180 / Math.PI;
	var K = {};
	K.DEG = Math.PI / 180;
	K.E = 2.718281828459045;
	K.HALF_PI = 1.5707963267948966;
	K.LN10 = 2.302585092994046;
	K.LN2 = 0.6931471805599453;
	K.PHI = 1.618033988749894;
	K.PI = 3.141592653589793;
	K.QUATER_PI = 0.7853981633974483;
	K.RAD = ba;
	K.SQRT2 = 1.4142135623730951;
	K.TAU = 6.283185307179586;
	K.TIERCE_PI = 1.0471975511965976;
	K.TWO_PI = 6.283185307179586;
	let L = {
		YlGn: "#ffffe5 #f7fcb9 #d9f0a3 #addd8e #78c679 #41ab5d #238443 #006837 #004529",
		GnBu: "#f7fcf0 #e0f3db #ccebc5 #a8ddb5 #7bccc4 #4eb3d3 #2b8cbe #0868ac #084081",
		BuGn: "#f7fcfd #e5f5f9 #ccece6 #99d8c9 #66c2a4 #41ae76 #238b45 #006d2c #00441b",
		PuBu: "#fff7fb #ece7f2 #d0d1e6 #a6bddb #74a9cf #3690c0 #0570b0 #045a8d #023858",
		BuPu: "#f7fcfd #e0ecf4 #bfd3e6 #9ebcda #8c96c6 #8c6bb1 #88419d #810f7c #4d004b",
		RdPu: "#fff7f3 #fde0dd #fcc5c0 #fa9fb5 #f768a1 #dd3497 #ae017e #7a0177 #49006a",
		PuRd: "#f7f4f9 #e7e1ef #d4b9da #c994c7 #df65b0 #e7298a #ce1256 #980043 #67001f",
		OrRd: "#fff7ec #fee8c8 #fdd49e #fdbb84 #fc8d59 #ef6548 #d7301f #b30000 #7f0000",
		Reds: "#fff5f0 #fee0d2 #fcbba1 #fc9272 #fb6a4a #ef3b2c #cb181d #a50f15 #67000d",
		Blues: "#f7fbff #deebf7 #c6dbef #9ecae1 #6baed6 #4292c6 #2171b5 #08519c #08306b",
		Greys: "#ffffff #f0f0f0 #d9d9d9 #bdbdbd #969696 #737373 #525252 #252525 #000000",
		YlGnBu: "#ffffd9 #edf8b1 #c7e9b4 #7fcdbb #41b6c4 #1d91c0 #225ea8 #253494 #081d58",
		PuBuGn: "#fff7fb #ece2f0 #d0d1e6 #a6bddb #67a9cf #3690c0 #02818a #016c59 #014636",
		YlOrRd: "#ffffcc #ffeda0 #fed976 #feb24c #fd8d3c #fc4e2a #e31a1c #bd0026 #800026",
		YlOrBr: "#ffffe5 #fff7bc #fee391 #fec44f #fe9929 #ec7014 #cc4c02 #993404 #662506",
		Greens: "#f7fcf5 #e5f5e0 #c7e9c0 #a1d99b #74c476 #41ab5d #238b45 #006d2c #00441b",
		Purples: "#fcfbfd #efedf5 #dadaeb #bcbddc #9e9ac8 #807dba #6a51a3 #54278f #3f007d",
		Oranges: "#fff5eb #fee6ce #fdd0a2 #fdae6b #fd8d3c #f16913 #d94801 #a63603 #7f2704",
		PuOr: "#7f3b08 #b35806 #e08214 #fdb863 #fee0b6 #f7f7f7 #d8daeb #b2abd2 #8073ac #542788 #2d004b",
		BrBG: "#543005 #8c510a #bf812d #dfc27d #f6e8c3 #f5f5f5 #c7eae5 #80cdc1 #35978f #01665e #003c30",
		PRGn: "#40004b #762a83 #9970ab #c2a5cf #e7d4e8 #f7f7f7 #d9f0d3 #a6dba0 #5aae61 #1b7837 #00441b",
		PiYG: "#8e0152 #c51b7d #de77ae #f1b6da #fde0ef #f7f7f7 #e6f5d0 #b8e186 #7fbc41 #4d9221 #276419",
		RdBu: "#67001f #b2182b #d6604d #f4a582 #fddbc7 #f7f7f7 #d1e5f0 #92c5de #4393c3 #2166ac #053061",
		RdGy: "#67001f #b2182b #d6604d #f4a582 #fddbc7 #ffffff #e0e0e0 #bababa #878787 #4d4d4d #1a1a1a",
		RdYlBu:
			"#a50026 #d73027 #f46d43 #fdae61 #fee090 #ffffbf #e0f3f8 #abd9e9 #74add1 #4575b4 #313695",
		RdYlGn:
			"#a50026 #d73027 #f46d43 #fdae61 #fee08b #ffffbf #d9ef8b #a6d96a #66bd63 #1a9850 #006837",
		Spectral:
			"#9e0142 #d53e4f #f46d43 #fdae61 #fee08b #ffffbf #e6f598 #abdda4 #66c2a5 #3288bd #5e4fa2",
		Heat: "#0000ff #00ffff #00ff00 #ffff00 #ff0000",
		Jet: "#000080 #0000ff #0080ff #00ffff #80ff80 #ffff00 #ff8000 #ff0000 #800000",
		Parula:
			"#352a87 #2450d0 #0a72de #128ad2 #06a4ca #1ab2b1 #51bd90 #92bf72 #c6bc5e #f6ba46 #f9d528 #f9fb0e",
		Magma:
			"#000004 #120d31 #331067 #5a167e #7e2482 #a3307e #c83e73 #e95462 #f97b5d #fea973 #fed395 #fcfdbf",
		Inferno:
			"#000004 #140b34 #390963 #61136e #85216b #a92e5e #cb4149 #e65d2f #f78212 #fcae12 #f5db4c #fcffa4",
		Plasma:
			"#0d0887 #3e049c #6300a7 #8707a6 #a62098 #c03a83 #d5546e #e76f5a #f58c46 #fdae32 #fcd225 #f0f921",
		Viridis:
			"#440154 #482173 #433e85 #38598c #2d708e #25858e #1e9b8a #2ab07f #50c46a #86d549 #c2df23 #fde725",
		Cividis:
			"#00204d #00306f #2a406c #48526b #5e626e #727374 #878479 #9e9677 #b6a971 #d0be67 #ead357 #ffea46",
		GitHub: "#eeeeee #c6e48b #7bc96f #239a3b #196127",
		Turbo:
			"#30123b #4454c3 #448ffe #1fc9dd #2aefa1 #7dff56 #c1f334 #f1cb3a #fe932a #ea4e0d #be2102 #7a0403",
		Grey: "#000000 #ffffff",
		Gray: "#000000 #ffffff",
	};
	for (var M in L) L[M] = L[M].split(" ");
	let N = Object.keys(f);
	const O = N.indexOf("TRANSPARENT");
	N = N.slice(0, O).concat(N.slice(O + 1));
	function P(a, b, c) {
		a = x(a).rgbaA;
		b = x(b).rgbaA;
		return x(
			Math.min(Math.max(0, (b[0] - a[0]) * c + a[0]), 255),
			Math.min(Math.max(0, (b[1] - a[1]) * c + a[1]), 255),
			Math.min(Math.max(0, (b[2] - a[2]) * c + a[2]), 255),
			Math.min(Math.max(0, (b[3] - a[3]) * c + a[3]), 255),
		).hex8;
	}
	var Q = {
		getInterpolatedColorList: function (a, b = 0, c = 5, e) {
			if (1 == a.length)
				throw Error("Atleast 2 colors are needed to create interpolatable object");
			c = (c - b) / (a.length - 1);
			let d = {};
			for (let g = 0; g < a.length; g++) {
				let h = b + g * c,
					k = x(a[g]).rgbaA;
				k[3] = isNaN(e) ? k[3] : e;
				d[h] = k;
			}
			return d;
		},
	};
	Q.lerpColor = P;
	Q.lerpColorArray = function (a, b, c = 0, e = 1) {
		let d = a.length - 1;
		if (b >= e) return a[d];
		if (b <= c) return a[0];
		b = ((b - c) / (e - c)) * d;
		c = Math.floor(b);
		return P(a[c], a[c + 1], b - c);
	};
	Q.lerpColorObject = function (a, b) {
		const c = Object.keys(a || {}).sort();
		var e = Math.min(...c),
			d = Math.max(...c);
		let g = "#000000";
		if (b >= d) return a[d];
		if (b <= e) return a[e];
		for (e = 0; e < c.length - 1; e++)
			if (((d = c[e]), b > d)) {
				g = P(a[d], a[c[e + 1]], (b - d) / (c[e + 1] - d));
				break;
			} else if (b == d) {
				g = a[d];
				break;
			}
		return g;
	};
	function R(a, b, c) {
		var e = new Image();
		e.src = a;
		"function" == typeof b && e.addEventListener("load", () => b(e), !1);
		"function" == typeof c && e.addEventListener("error", (d) => c(d, e), !1);
		return e;
	}
	var S = {
		drawImage: function (a) {
			let b = y.workingContext,
				c,
				e;
			6 > arguments.length
				? ((c = arguments[1]), (e = arguments[2]))
				: ((c = arguments[5]), (e = arguments[6]));
			b.yAxisInverted
				? (b.save(),
				  b.translate(c, e),
				  b.scale(1, -1),
				  b.drawImage(a, 0, 0, ...Array.prototype.slice.call(arguments, 3)),
				  b.restore())
				: b.drawImage(a, c, e, ...Array.prototype.slice.call(arguments, 3));
		},
	};
	S.loadImage = R;
	S.loadImagePromise = function (a) {
		return new Promise((b, c) => {
			R(a, b, c);
		});
	};
	S.pixel = function (a, b, c, e) {
		let d = y.workingContext;
		c && (d.fillStyle = c);
		e || (e = 1 / y.dpr);
		d.fillRect(a, b, e, e);
	};
	function T(a, b) {
		return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
	}
	function U(a, b, c, e, d = 1) {
		return [
			b[0] + ((c[0] - a[0]) / 6) * d,
			b[1] + ((c[1] - a[1]) / 6) * d,
			c[0] - ((e[0] - b[0]) / 6) * d,
			c[1] - ((e[1] - b[1]) / 6) * d,
		];
	}
	function V(a, b = 1, c = !0, e = 0) {
		for (let d = 0; d < a.length - 1 - e; d++) {
			let g = a[d + 1],
				h = U(
					0 != d ? a[d - 1] : a[0],
					a[d],
					g,
					d != a.length - 2 ? a[d + 2] : c ? a[1] : g,
					b,
				);
			y.workingContext.bezierCurveTo(h[0], h[1], h[2], h[3], g[0], g[1]);
		}
	}
	function W(a, b, c, e) {
		let d = y.workingContext;
		d.beginPath();
		d.rect(a, b, c, e);
		d.doFill && d.fill();
		d.doStroke && d.stroke();
		d.closePath();
	}
	function ca(a, b, c, e, d = 0) {
		da(a, b, c, e / (2 * Math.sin(Math.PI / c)), d);
	}
	function da(a, b, c, e, d = 0) {
		let g = 0,
			h = (2 * Math.PI) / c,
			k = y.workingContext;
		d += h / 2;
		let m = [Math.cos(d) * e + a, Math.sin(d) * e + b];
		k.beginPath();
		for (k.moveTo(m[0], m[1]); g++ < c; )
			k.lineTo(Math.cos(g * h + d) * e + a, Math.sin(g * h + d) * e + b);
		k.lineTo(m[0], m[1]);
		k.closePath();
		k.doFill && k.fill();
		k.doStroke && k.stroke();
	}
	var Y = {
		angle: function (a, b, c, e, d = 20, g = 10, h = !1, k = 1) {
			var m = (b[1] - a[1]) / (b[0] - a[0]),
				l = (e[1] - c[1]) / (e[0] - c[0]);
			var q = a[1] - a[0] * m;
			l = (c[1] - c[0] * l - q) / (m - l);
			q = [l, m * l + q];
			m = q[0];
			q = q[1];
			if (isNaN(m) || isNaN(q)) throw Error("No intersection point");
			a = Math.atan2(a[1] - q, a[0] - m);
			b = Math.atan2(b[1] - q, b[0] - m);
			c = Math.atan2(c[1] - q, c[0] - m);
			e = Math.atan2(e[1] - q, e[0] - m);
			e = { 1: [b, e], 2: [e, a], 3: [a, c], 4: [c, b] }[k];
			k = y.workingContext;
			h ? ((h = e[1]), (e = e[0] - e[1])) : ((h = e[0]), (e = e[1] - e[0]));
			k.doFill &&
				(k.beginPath(),
				k.moveTo(m, q),
				k.arc(m, q, d, h, e + h),
				k.fill(),
				k.closePath());
			k.doStroke && (k.beginPath(), k.arc(m, q, d, h, e + h), k.stroke(), k.closePath());
			return {
				center: [m + (d + g) * Math.cos(h + e / 2), q + (d + g) * Math.sin(h + e / 2)],
				ang: e,
			};
		},
		annulus: function (a, b, c, e) {
			let d = y.workingContext;
			d.beginPath();
			d.arc(a, b, c, 0, 2 * Math.PI, !1);
			d.moveTo(e, 0);
			d.arc(a, b, e, 0, 2 * Math.PI, !0);
			X(d);
		},
		annulusSector: function (a, b, c, e, d, g) {
			let h = y.workingContext;
			h.beginPath();
			h.arc(a, b, c, g, g + d, !1);
			h.arc(a, b, e, g + d, g, !0);
			X(h);
		},
		arc: function (a, b, c, e = Math.PI / 2, d = 0) {
			let g = y.workingContext;
			g.pathStarted || g.beginPath();
			g.arc(a, b, c, d, d + e);
			g.pathStarted || X(g);
		},
		arcBetweenPoints: function (a, b, c, e, d, g = !1) {
			a == c &&
				b == e &&
				console.error("Can't draw a arc between points. Given points are exactly same");
			var h = [a, b],
				k = [c, e];
			const m = T(h, k);
			var l = (d * d - d * d + m * m) / (2 * m);
			const q = Math.sqrt(d * d - l * l);
			l /= m;
			l = [(k[0] - h[0]) * l + h[0], (k[1] - h[1]) * l + h[1]];
			h = [l[0] + (q * (k[1] - h[1])) / m, l[1] - (q * (k[0] - h[0])) / m];
			k = y.workingContext;
			a = Math.atan2(b - h[1], a - h[0]);
			c = Math.atan2(e - h[1], c - h[0]) - a;
			k.pathStarted || (k.save(), k.beginPath());
			k.arc(h[0], h[1], d, a, c + a, !g);
			k.pathStarted || (X(k), k.restore());
			return h;
		},
		bezier: function (a, b, c, e, d, g) {
			let h = y.workingContext;
			h.pathStarted || h.beginPath();
			h.bezierCurveTo(a, b, c, e, d, g);
			h.pathStarted || X(h);
		},
		circle: function (a, b, c) {
			let e = y.workingContext;
			e.beginPath();
			e.arc(a, b, c, 0, 2 * Math.PI);
			e.doFill && e.fill();
			e.doStroke && e.stroke();
		},
		circularSegment: function (a, b, c, e = Math.PI / 2, d = 0) {
			let g = y.workingContext;
			g.pathStarted || g.beginPath();
			g.arc(a, b, c, d, d + e);
			g.pathStarted || X(g);
		},
		ellipse: function (a, b, c, e, d = 0, g = 0, h = 2 * Math.PI) {
			let k = y.workingContext;
			k.pathStarted || k.beginPath();
			k.ellipse(a, b, c, e, d, g, g + h);
			k.pathStarted || X(k);
		},
		equiTriangle: function (a, b, c, e = 0) {
			ca(a, b, 3, c, e);
		},
	};
	Y.getBezierControlPoints = U;
	Y.line = function (a, b, c, e) {
		let d = y.workingContext;
		d.beginPath();
		d.moveTo(a, b);
		d.lineTo(c, e);
		d.stroke();
		d.closePath();
	};
	Y.point = function (a, b, c = 10, e = !1) {
		let d = y.workingContext;
		d.beginPath();
		d.arc(a, b, c / 2, 0, 2 * Math.PI);
		d.fill();
		e && d.stroke();
		d.beginPath();
	};
	Y.polygon = function () {
		let a = arguments;
		if (2 < a.length) {
			let b = y.workingContext,
				c = a[0];
			b.beginPath();
			b.moveTo(c[0], c[1]);
			for (let e = 1; e < a.length; e++) b.lineTo(a[e][0], a[e][1]);
			b.lineTo(c[0], c[1]);
			b.doFill && b.fill();
			b.doStroke && b.stroke();
			b.closePath();
		}
	};
	Y.quad = function (a, b, c, e) {
		let d = y.workingContext;
		d.beginPath();
		d.moveTo(a[0], a[1]);
		d.lineTo(b[0], b[1]);
		d.lineTo(c[0], c[1]);
		d.lineTo(e[0], e[1]);
		d.lineTo(a[0], a[1]);
		d.doFill && d.fill();
		d.doStroke && d.stroke();
		d.closePath();
	};
	Y.quadraticCurve = function () {
		let a = y.workingContext,
			b = arguments;
		4 == b.length
			? a.quadraticCurveTo(b[0], b[1], b[2], b[3])
			: 6 == b.length &&
			  (a.beginPath(),
			  a.moveTo(b[0], b[1]),
			  a.quadraticCurveTo(b[2], b[3], b[4], b[5]),
			  X(a));
	};
	Y.rect = W;
	Y.regularPolygon = ca;
	Y.regularPolygonWithRadius = da;
	Y.sector = function (a, b, c, e = Math.PI / 2, d = 0) {
		let g = y.workingContext;
		g.beginPath();
		g.moveTo(a, b);
		g.arc(a, b, c, d, d + e);
		g.lineTo(a, b);
		X(g);
	};
	Y.smoothCurveThroughPoints = function (a, b = 1, c = !0, e = 0) {
		let d = y.workingContext;
		d.beginPath();
		d.moveTo(a[0][0], a[0][1]);
		V(a, b, c, e);
		d.doFill && c && d.fill();
		d.doStroke && d.stroke();
		d.closePath();
	};
	Y.smoothCurveThroughPointsTo = V;
	Y.square = function (a, b, c) {
		W(a, b, c, c);
	};
	Y.triangle = function (a, b, c) {
		let e = y.workingContext;
		e.beginPath();
		e.moveTo(a[0], a[1]);
		e.lineTo(b[0], b[1]);
		e.lineTo(c[0], c[1]);
		e.lineTo(a[0], a[1]);
		e.doFill && e.fill();
		e.doStroke && e.stroke();
		e.closePath();
	};
	const {
		abs: ea,
		acos: fa,
		asin: ha,
		atan: ia,
		atan2: ja,
		cbrt: ka,
		ceil: la,
		cos: ma,
		cosh: na,
		exp: oa,
		floor: pa,
		log: qa,
		log2: ra,
		log10: sa,
		max: ta,
		min: ua,
		pow: va,
		random: wa,
		round: xa,
		sign: ya,
		sin: za,
		sqrt: Aa,
		tan: Ba,
		tanh: Ca,
	} = Math;
	var Z = {};
	Z.abs = ea;
	Z.acos = fa;
	Z.asin = ha;
	Z.atan = ia;
	Z.atan2 = ja;
	Z.cbrt = ka;
	Z.ceil = la;
	Z.cos = ma;
	Z.cosh = na;
	Z.exp = oa;
	Z.floor = pa;
	Z.log = qa;
	Z.log10 = sa;
	Z.log2 = ra;
	Z.max = ta;
	Z.min = ua;
	Z.pow = va;
	Z.random = wa;
	Z.round = xa;
	Z.sgn = ya;
	Z.sigmoid = function (a) {
		return 1 / (1 + Math.exp(-a));
	};
	Z.sin = za;
	Z.sqrt = Aa;
	Z.tan = Ba;
	Z.tanh = Ca;
	Object.clone =
		Object.clone ||
		function (a) {
			let b = {};
			for (let c = 0, e = Object.keys(a); c < e.length; c++) b[e[c]] = a[e[c]];
			return b;
		};
	function A(a, b = window, c = !1) {
		Object.assign(b, a);
		c && Object.assign(y.functions, a);
	}
	function z(a, b = {}, c = !0) {
		b = Object.clone(b);
		for (let e = 0, d = Object.keys(a); e < d.length; e++) {
			let g = d[e],
				h = a[g],
				k = b[g],
				m = Object.prototype.toString.call(h).slice(8, -1),
				l = Object.prototype.toString.call(k).slice(8, -1);
			"Object" == m && c && (b[g] = z(h, k, c));
			"Undefined" != m && "Null" != m && l !== m && (b[g] = a[g]);
		}
		return b;
	}
	function X(a) {
		a.doFill && a.fill();
		a.doStroke && a.stroke();
	}
	window.applyDefault = z;
	[
		{ defineProperties: A, C: y, dist: T },
		J,
		K,
		{
			ALPHABETIC: "alphabetic",
			BEVEL: "bevel",
			BOTTOM: "bottom",
			BUTT: "butt",
			CENTER: "center",
			CONDENSED: "condensed",
			END: "end",
			EXPANDED: "expanded",
			EXTRA_CONDENSED: "extra-condensed",
			EXTRA_EXPANDED: "extra-expanded",
			HANGING: "hanging",
			IDEOGRAPHIC: "ideographic",
			ITALIC: "italic",
			LARGE: "large",
			LARGER: "larger",
			LEFT: "left",
			MEDIUM: "medium",
			MIDDLE: "middle",
			MILTER: "milter",
			MITER: "miter",
			NORMAL: "normal",
			OBLIQUE: "oblique",
			RIGHT: "right",
			ROUND: "round",
			SEMI_CONDENSED: "semi-condensed",
			SEMI_EXPANDED: "semi-expanded",
			SMALL: "small",
			SMALLER: "smaller",
			SQUARE: "square",
			START: "start",
			TOP: "top",
			ULTRA_CONDENSED: "ultra-condensed",
			ULTRA_EXPANDED: "ultra-expanded",
			XXX_LARGE: "xxx-large",
			XX_LARGE: "xx-large",
			XX_SMALL: "xx-small",
			X_LARGE: "x-large",
			X_SMALL: "x-small",
		},
		{
			linearGradient: function (a, b, c) {
				a = y.workingContext.createLinearGradient(a[0], a[1], b[0], b[1]);
				if ("Array" == Object.prototype.toString.call(c).slice(8, -1)) {
					b = {};
					const e = 1 / c.length;
					for (let d = 0; d < c.length; d++) b[e * d] = c[d];
					c = b;
				} else if ("Object" != Object.prototype.toString.call(c).slice(8, -1))
					throw Error("Color Stops must be an Array or an Object");
				for (let e = Object.keys(c || {}), d = 0; d < e.length; d++)
					(b = Number(e[d])), a.addColorStop(b, c[b]);
				return a;
			},
		},
		Q,
		S,
		{
			fillText: function (a, b = 0, c = 0, e) {
				let d = y.workingContext;
				d.yAxisInverted && (D(1, -1), (c *= -1));
				d.fillText(a, b, c, e);
				d.yAxisInverted && D(1, -1);
			},
			strokeText: function (a, b = 0, c = 0, e) {
				let d = y.workingContext;
				d.yAxisInverted && (D(1, -1), (c *= -1));
				d.strokeText(a, b, c, e);
				d.yAxisInverted && D(1, -1);
			},
			text: function (a, b = 0, c = 0, e) {
				let d = y.workingContext;
				d.yAxisInverted && (D(1, -1), (c *= -1));
				d.doFill ? d.fillText(a, b, c, e) : d.doStroke && d.strokeText(a, b, c, e);
				d.yAxisInverted && D(1, -1);
			},
		},
		Y,
		Z,
		{
			randomInt: function (a = 10, b = 0) {
				return Math.round(Math.random() * (a - b) + b);
			},
		},
	].forEach((a) => A(a));
}).call(this);
