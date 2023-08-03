(function () {
	"use strict";
	Object.clone =
		Object.clone ||
		function (a) {
			let b = {};
			for (let c = 0, d = Object.keys(a); c < d.length; c++) b[d[c]] = a[d[c]];
			return b;
		};
	function g(a, b = window) {
		Object.assign(b, a);
	}
	function aa(a, b, c) {
		let d = [];
		for (; a <= b; a += c) d.push(a);
		return d;
	}
	function x(a, b = {}, c = !0) {
		b = Object.clone(b);
		for (let d = 0, f = Object.keys(a); d < f.length; d++) {
			let e = f[d],
				k = a[e],
				l = b[e],
				m = Object.prototype.toString.call(k).slice(8, -1),
				h = Object.prototype.toString.call(l).slice(8, -1);
			"Object" == m && c && (b[e] = x(k, l, c));
			"Undefined" != m && "Null" != m && h !== m && (b[e] = a[e]);
		}
		return b;
	}
	function ba(a, b, c = 1e-6) {
		for (let d = 0; d < b.length; d++) if (Math.abs(b[d] - a) <= c) return d;
		return -1;
	}
	window.applyDefault = x;
	function D(a, b, c = {}) {
		var d = {
			width: 200,
			height: 200,
			o: Math.ceil(window.devicePixelRatio || 1),
			D: !0,
			F: !0,
			aa: !1,
			J: !1,
			kd: !1,
			$: 0,
			K: void 0,
			ea: void 0,
			textAlign: "start",
			textBaseline: "alphabetic",
			fillStyle: "#ffffff",
			background: "#ffffff",
			strokeStyle: "#000000",
			ka: "rgba",
			lineWidth: 1,
			fontSize: "20px",
			fontFamily: "serif",
			fontStyle: "normal",
			fontVariant: "normal",
			fontWeight: "normal",
			fontStretch: "normal",
			lineHeight: 1.2,
			font: "20px serif",
			G: {},
		};
		c = x(d, c);
		let f;
		"string" === typeof b
			? (b = document.querySelector(b))
			: b instanceof HTMLElement || (b = document.body);
		let e = b.querySelector("canvas");
		e ? (f = e) : (f = D.na(c));
		"number" !== typeof b.h && (b.h = 1);
		let k = b.h,
			l = b.id || b.classList.item(0),
			m = c.name || f.name;
		"string" != typeof m && ((m = l + "-C-" + k), (c.name = m));
		f.id = m;
		f.classList.add(m);
		b.appendChild(f);
		e
			? (D.g = f.context)
			: (D.ga(f, c),
			  (b = f.getContext("2d")),
			  g(c, b),
			  (f.context = b),
			  f.context.setTransform(c.o, 0, 0, c.o, 0, 0),
			  (D.g = f.context),
			  (D.g.h = d),
			  (D.g.fa = []));
		D.W[m] = f.context;
		d = {};
		for (let h in c.G) if ((b = c.G[h])) f.addEventListener(h, b), (d[h] = b);
		f.G = d;
		D.o = c.o;
		a();
	}
	D.W = {};
	D.ga = function (a, b) {
		const c = b.width,
			d = b.height;
		b = b.o || window.devicePixelRatio;
		a.style.width = c + "px";
		a.style.height = d + "px";
		a.width = b * c;
		a.height = b * d;
	};
	D.na = function (a) {
		const b = document.createElement("canvas");
		D.ga(b, a);
		return b;
	};
	D.X = !1;
	D.debug = function (a) {
		D.X = "boolean" !== typeof a ? !0 : a;
	};
	D.da = [];
	window.C = D;
	var ca = {
		Va: "#f0f8ff",
		Wa: "#faebd7",
		Xa: "#00ffff",
		Ya: "#7fffd4",
		Za: "#f0ffff",
		$a: "#f5f5dc",
		ab: "#ffe4c4",
		bb: "#000000",
		cb: "#ffebcd",
		blue: "#0000ff",
		eb: "#8a2be2",
		fb: "#a52a2a",
		gb: "#deb887",
		hb: "#5f9ea0",
		ib: "#7fff00",
		jb: "#d2691e",
		kb: "#ff7f50",
		lb: "#6495ed",
		mb: "#fff8dc",
		nb: "#dc143c",
		ob: "#00ffff",
		pb: "#00008b",
		qb: "#008b8b",
		rb: "#b8860b",
		sb: "#a9a9a9",
		tb: "#006400",
		ub: "#a9a9a9",
		vb: "#bdb76b",
		wb: "#8b008b",
		xb: "#556b2f",
		yb: "#ff8c00",
		zb: "#9932cc",
		Ab: "#8b0000",
		Bb: "#e9967a",
		Cb: "#8fbc8f",
		Db: "#483d8b",
		Eb: "#2f4f4f",
		Fb: "#2f4f4f",
		Gb: "#00ced1",
		Hb: "#9400d3",
		Jb: "#ff1493",
		Kb: "#00bfff",
		Lb: "#696969",
		Mb: "#696969",
		Nb: "#1e90ff",
		Ob: "#b22222",
		Pb: "#fffaf0",
		Qb: "#228b22",
		Rb: "#ff00ff",
		Sb: "#dcdcdc",
		Wb: "#f8f8ff",
		Xb: "#ffd700",
		Yb: "#daa520",
		Zb: "#808080",
		green: "#008000",
		$b: "#adff2f",
		ac: "#808080",
		bc: "#f0fff0",
		cc: "#ff69b4",
		dc: "#cd5c5c",
		ec: "#4b0082",
		fc: "#fffff0",
		hc: "#f0e68c",
		ic: "#e6e6fa",
		jc: "#fff0f5",
		kc: "#7cfc00",
		lc: "#fffacd",
		mc: "#add8e6",
		nc: "#f08080",
		oc: "#e0ffff",
		pc: "#fafad2",
		qc: "#d3d3d3",
		rc: "#90ee90",
		sc: "#d3d3d3",
		tc: "#ffb6c1",
		uc: "#ffa07a",
		vc: "#20b2aa",
		wc: "#87cefa",
		xc: "#778899",
		yc: "#778899",
		zc: "#b0c4de",
		Ac: "#ffffe0",
		Bc: "#00ff00",
		Cc: "#32cd32",
		Dc: "#faf0e6",
		Ec: "#ff00ff",
		Fc: "#800000",
		Gc: "#66cdaa",
		Hc: "#0000cd",
		Ic: "#ba55d3",
		Jc: "#9370db",
		Kc: "#3cb371",
		Lc: "#7b68ee",
		Mc: "#00fa9a",
		Nc: "#48d1cc",
		Oc: "#c71585",
		Pc: "#191970",
		Qc: "#f5fffa",
		Rc: "#ffe4e1",
		Sc: "#ffe4b5",
		Xc: "#ffdead",
		Yc: "#000080",
		Zc: "#fdf5e6",
		$c: "#808000",
		ad: "#6b8e23",
		bd: "#ffa500",
		cd: "#ff4500",
		dd: "#da70d6",
		ed: "#eee8aa",
		fd: "#98fb98",
		gd: "#afeeee",
		hd: "#db7093",
		jd: "#ffefd5",
		ld: "#ffdab9",
		md: "#cd853f",
		nd: "#ffc0cb",
		pd: "#dda0dd",
		rd: "#b0e0e6",
		sd: "#800080",
		td: "#663399",
		red: "#ff0000",
		ud: "#bc8f8f",
		vd: "#4169e1",
		wd: "#8b4513",
		xd: "#fa8072",
		yd: "#f4a460",
		zd: "#2e8b57",
		Ad: "#fff5ee",
		Bd: "#a0522d",
		Cd: "#c0c0c0",
		Dd: "#87ceeb",
		Ed: "#6a5acd",
		Fd: "#708090",
		Gd: "#708090",
		Hd: "#fffafa",
		Id: "#00ff7f",
		Jd: "#4682b4",
		tan: "#d2b48c",
		Ld: "#008080",
		Md: "#d8bfd8",
		Qd: "#ff6347",
		Rd: "#40e0d0",
		Sd: "#ee82ee",
		Td: "#f5deb3",
		Ud: "#ffffff",
		Vd: "#f5f5f5",
		Wd: "#ffff00",
		Xd: "#9acd32",
	};
	let da = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
		ea = /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,
		fa = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
		ha = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
		ia = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i,
		ja = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(?:(\d+(?:\.\d+)?)|(?:\.\d+))\)$/i;
	function G(...a) {
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
			if (((b = c.replace(/\s/g, "").toLowerCase()), ca[b])) b = G(ca[b]).ba;
			else if (da.test(b))
				(b = da
					.exec(b)
					.slice(1)
					.map((e) => parseInt(e + e, 16))),
					(b[3] = 1);
			else if (fa.test(b))
				(b = fa
					.exec(b)
					.slice(1)
					.map((e) => parseInt(e, 16))),
					(b[3] = 1);
			else if (ea.test(b))
				b = ea
					.exec(b)
					.slice(1)
					.map((e) => parseInt(e + e, 16));
			else if (ha.test(b))
				b = ha
					.exec(b)
					.slice(1)
					.map((e) => parseInt(e, 16));
			else if (ia.test(b))
				(b = ia
					.exec(b)
					.slice(1)
					.map((e) => parseInt(e, 10))),
					(b[3] = 1);
			else if (ja.test(b))
				b = ja
					.exec(b)
					.slice(1)
					.map((e, k) => (3 == k ? parseFloat(e) : parseInt(e, 10)));
			else throw (console.log(b), Error("Given color is not valid"));
		else return (b = c), { ba: b, Ha: b, za: b, Z: b, ya: b, Aa: b };
		a = b[3];
		b[3] *= 255;
		let d = "#";
		b.map((e, k) => {
			3 > k && ((e = Math.round(e).toString(16)), (d += 1 == e.length ? "0" + e : e));
		});
		let f = "#";
		b.map((e, k) => {
			4 > k && ((e = Math.round(e).toString(16)), (f += 1 == e.length ? "0" + e : e));
		});
		b[3] = a;
		return {
			ba: b,
			Ha: `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${b[3]})`,
			za: d,
			Z: f,
			ya: f,
			Aa: `hsl(${b[0]}, ${b[1]}, ${b[2]})`,
		};
	}
	function ka(a, b, c, d, f = 1) {
		return [
			b[0] + ((c[0] - a[0]) / 6) * f,
			b[1] + ((c[1] - a[1]) / 6) * f,
			c[0] - ((d[0] - b[0]) / 6) * f,
			c[1] - ((d[1] - b[1]) / 6) * f,
		];
	}
	function oa(a, b = 1, c = !0) {
		for (let d = 0; d < a.length - 1; d++) {
			let f = a[d + 1],
				e = ka(
					0 < d ? a[d - 1] : c ? a[a.length - 2] : a[0],
					a[d],
					f,
					d != a.length - 2 ? a[d + 2] : c ? a[1] : f,
					b,
				);
			D.g.bezierCurveTo(e[0], e[1], e[2], e[3], f[0], f[1]);
		}
	}
	function pa(a, b = 1, c = !0) {
		let d = D.g;
		d.beginPath();
		d.moveTo(a[0][0], a[0][1]);
		oa(a, b, c);
		d.D && c && d.fill();
		d.F && d.stroke();
		d.closePath();
	}
	function H(a, b, c, d) {
		let f = D.g;
		f.beginPath();
		f.moveTo(a, b);
		f.lineTo(c, d);
		f.stroke();
		f.closePath();
	}
	var qa = 1;
	function L(a, b = 0) {
		D.g.translate(a, b);
	}
	function O(a, b = a) {
		D.g.scale(a, b);
	}
	function ra(a) {
		let b = D.g;
		b.rotate(a);
		b.$ = ((b.$ + a) % Math.PI) * 2;
	}
	function sa() {
		D.g.h = ta();
		D.g.save();
	}
	function ua() {
		g(D.g.h, D.g);
		D.g.restore();
	}
	function va(...a) {
		let b = D.g;
		0 < arguments.length ? ((b.strokeStyle = G(a).Z), (b.F = !0)) : b.stroke();
	}
	function wa(...a) {
		let b = D.g;
		0 !== arguments.length ? ((b.fillStyle = G(a).Z), (b.D = !0)) : b.fill();
	}
	function ta(a) {
		a = D.W[a] || D.g;
		return {
			background: a.background,
			ka: a.ka,
			strokeStyle: a.strokeStyle,
			fillStyle: a.fillStyle,
			lineWidth: a.lineWidth,
			F: a.F,
			D: a.D,
			aa: a.aa,
			J: a.J,
			$: a.$,
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
			G: a.G,
		};
	}
	function xa(a, b, c, d, f = 100, e = {}, k) {
		function l() {
			h.K = window.requestAnimationFrame(l);
			D.g = h;
			let r = ta(c);
			e && g(y, D.g);
			b(window.performance.now() - h.sa, m());
			e && g(r, D.g);
		}
		function m() {
			let r = window.performance.now(),
				t = r - h.qa;
			h.qa = r;
			h.ca.push(t);
			h.V += t;
			h.ca.length > f && (h.V -= h.ca.shift());
			return h.ca.length / (h.V / 1e3);
		}
		let h;
		"function" == typeof a && ((e = d = c = b = a = qa++), (k = arguments[4]));
		c ? (h = D.W[c]) : ((h = D.g), (c = h.name));
		h.ca = [];
		h.V = 0;
		let y = Object.assign(ta(c) || {}, e);
		if (void 0 != h.K)
			D.X &&
				(console.log(c + ": " + a + " %cdelayed", "color: orange;"),
				D.da.push({ canvas: h, animationName: a, state: "delayed", ha: y })),
				h.fa.push({ name: a, ha: y, wa: b, ta: c, Qa: d, Od: f, N: k });
		else {
			if (D.X) {
				let r = `${c}: ${a} %crunning`,
					t = ["color: yellow;"];
				void 0 != k && ((r += `%c for %c${k}ms`), t.push("color: #adacdf;", "color: #9afcad;"));
				D.da.push({
					canvas: h,
					animationName: a,
					state: "running",
					ha: y,
					N: k,
				});
				console.log(r, ...t);
			}
			h.qa = window.performance.now();
			h.sa = window.performance.now();
			isNaN(d)
				? l()
				: ((h.ea = a),
				  (h.K = setInterval(function () {
						D.g = h;
						let r = ta(c);
						g(y, D.g);
						b(window.performance.now() - h.sa, m());
						g(r, D.g);
				  }, d)));
		}
	}
	function ya() {
		var a;
		let b = D.g;
		a ? (b = D.W[a]) : (a = b.name);
		clearInterval(b.K);
		window.cancelAnimationFrame(b.K);
		b.K = void 0;
		D.X &&
			(console.log(`${a}: ${b.ea} %cfinished`, ...["color: #3aff5f;"]),
			D.da.push({
				canvas: b,
				animationName: b.ea,
				state: "finished",
				endTime: void 0,
			}));
		0 < b.fa.length && ((a = b.fa.shift()), xa(a.name, a.wa, a.ta, a.Qa, a.Pd, a.ha, a.N));
	}
	function za(a) {
		let b = D.g;
		b.fontSize = "number" === typeof a ? a + "px" : a;
		{
			let {
				fontStyle: c,
				fontVariant: d,
				fontWeight: f,
				fontStretch: e,
				fontSize: k,
				lineHeight: l,
				fontFamily: m,
			} = D.g;
			a = `${c} ${d} ${f} ${e} ${k}/${l} ${m}`;
		}
		b.font = a;
	}
	function Aa() {
		let a = D.g;
		a.scale(1, -1);
		a.J = !a.J;
	}
	function Ba(a, b = 0, c = 0) {
		let d = D.g;
		d.J && (O(1, -1), (c *= -1));
		d.D ? d.fillText(a, b, c, void 0) : d.F && d.strokeText(a, b, c, void 0);
		d.J && O(1, -1);
	}
	function Ca(a, b, c, d) {
		var f = 0;
		let e = D.g,
			k = e.lineWidth;
		var l = Math.sqrt(Math.pow(a - b, 2) + Math.pow(-f, 2));
		isNaN(c) && (c = l);
		d = d || c / 1.2;
		let m = c - l;
		var h = Math.sqrt(Math.pow(m, 2) + Math.pow(d / 2, 2));
		d = Math.atan(d / (2 * m));
		l > c && (d += Math.PI);
		c = Math.atan2(f, b - a);
		l = [a - Math.cos(d + c) * h, -(Math.sin(d + c) * h)];
		h = [a - Math.cos(-d + c) * h, -(Math.sin(-d + c) * h)];
		e.F && "bevel" != e.lineJoin && ((b -= Math.cos(c) * k), (f -= Math.sin(c) * k));
		e.save();
		e.aa || e.beginPath();
		e.moveTo(a, 0);
		e.lineTo(l[0], l[1]);
		e.lineTo(b, f);
		e.lineTo(h[0], h[1]);
		e.lineTo(a, 0);
		e.aa || (e.D && e.fill(), e.F && e.stroke(), e.closePath());
		e.restore();
	}
	const Da = {
		then: function (a) {
			a();
			return Da;
		},
	};
	var Ea = 1;
	const Fa = [0, 10, 0.1],
		Ga = [1, 1];
	function Ha(a) {
		function b() {
			let u = D.g;
			for (let z = 0; z < m.length; z++) {
				var q = m[z];
				if (f) pa(q, e, l);
				else {
					u.beginPath();
					u.moveTo(q[0][0], q[0][1]);
					for (let p = 1; p < q.length; p++) u.lineTo(q[p][0], q[p][1]);
					u.closePath();
					q = u;
					q.D && q.fill();
					q.F && q.stroke();
				}
			}
		}
		a = x({ ia: 1, m: Ga, l: Ga, j: Fa, va: [], M: !0, closed: !1, Y: !0, N: 4e3 }, a);
		let { pa: c, j: d, M: f, ia: e, va: k, closed: l } = a;
		Array.isArray(d) && 2 == d.length && d.push((d[1] - d[0]) / 20);
		let m = [[]];
		var h = d[0];
		let y = d[1],
			r = d[2];
		Array.isArray(k) || (k = []);
		let t = 1e-6,
			v = 0,
			J = 0,
			I = a.l[0] / a.m[0],
			w = a.l[1] / a.m[1];
		for (r < t && (t = r / 2); h <= y + t; h += r) {
			if (-1 < ba(h, k, t)) {
				-1 < ba(h + r, k, t) && (v++, m.push([]));
				continue;
			}
			let u = c(h);
			m[v].push([u[0] * I, u[1] * w]);
			J++;
		}
		a.Y && b();
		let A = D.g;
		return {
			qd: m[0],
			N: a.N,
			name: "parametric-plot-" + Ea++,
			closed: a.closed,
			ia: a.ia || 1,
			M: a.M,
			Ga: a.Ga,
			Ma: a.Ma || !1,
			Y: function (u = 2e3) {
				function q(n) {
					return function () {
						n >= p.length - 2 && (ya(), A.closePath(), A.D && this.Y());
						let E = p[n],
							F = p[n + 1],
							K = ka(
								0 < n ? p[n - 1] : l ? p[p.length - 2] : p[0],
								E,
								F,
								n != p.length - 2 ? p[n + 2] : l ? p[1] : F,
							);
						n++;
						A.beginPath();
						A.moveTo(E[0], E[1]);
						A.bezierCurveTo(K[0], K[1], K[2], K[3], F[0], F[1]);
						A.stroke();
					};
				}
				function z(n) {
					return function () {
						n >= p.length - 2 && (ya(), A.D && this.Y());
						let E = p[n],
							F = p[++n];
						H(E[0], E[1], F[0], F[1]);
					};
				}
				u /= J;
				for (let n = 0; n < m.length; n++) {
					var p = m[n];
					f
						? xa("parametric-plot-" + Ea++, q(0), D.g.name, u)
						: xa("parametric-plot-" + Ea++, z(0), D.g.name, u);
				}
				return Da;
			},
		};
	}
	function Ia(a) {
		let b = a.pa;
		a.pa = (c) => [c, b(c)];
		return Ha(a);
	}
	function Ja(a) {
		function b(w) {
			if (w >= I) return "rgba(" + f[I].join() + ")";
			if (w <= J) return "rgba(" + f[J].join() + ")";
			for (let A = 0; A < t.length - 1; A++) {
				let u = t[A],
					q = t[A + 1],
					z = f[u],
					p = f[q],
					n = l((w - u) / (q - u));
				if (w >= u && w < q)
					return (
						"rgba(" +
						[
							(p[0] - z[0]) * n + z[0],
							(p[1] - z[1]) * n + z[1],
							(p[2] - z[2]) * n + z[2],
							(p[3] - z[3]) * n + z[3],
						].join() +
						")"
					);
			}
		}
		a = x(
			{
				min: [-4, -4],
				max: [4, 4],
				la: {
					"-5": "#b36e38b0",
					"-3": "#ff9c52b0",
					"-1": "#ffcea9b0",
					0: "#dcdcddb0",
					1: "#9fcaedb0",
					3: "#3d96dab0",
					5: "#2b6b99b0",
				},
				l: Ga,
				m: Ga,
				U: 1,
				Ba: (w) => w,
			},
			a,
			!1,
		);
		let { min: c, max: d, la: f, U: e, od: k, Ba: l } = a,
			m = D.g,
			h = a.l[0] / a.m[0],
			y = a.l[1] / a.m[1],
			r = a.m[0] / a.l[0];
		a = a.m[1] / a.l[1];
		let t = Object.keys(f).sort();
		for (var v of t) f[v] = G(f[v]).ba;
		let J = Math.min(...t),
			I = Math.max(...t);
		m.save();
		for (v = c[0]; v <= d[0]; v += e * r)
			for (let w = c[1]; w <= d[1]; w += e * a)
				(m.fillStyle = b(k(v, w))), m.fillRect(v * h, w * y, e, e);
		m.restore();
		return { min: J, max: I, la: f };
	}
	function Ka(a, b, c = {}) {
		return {
			Vb: function (d) {
				d.l = a;
				d.m = b;
				return Ha(d);
			},
			Tb: function (d) {
				d.l = a;
				d.m = b;
				return Ia(d);
			},
			Ub: function (d) {
				d.l = a;
				d.m = b;
				d.min = d.min || [c.A.j[0], c.B.j[0]];
				d.max = d.max || [c.A.j[1], c.B.j[1]];
				return Ja(d);
			},
		};
	}
	const La = [0, 0];
	function Oa(a = {}) {
		var b = D.g;
		a = x(
			{
				A: { length: b.canvas.width, T: !0, P: !0, S: !0, O: !0, R: !1 },
				B: {
					length: b.canvas.height,
					rotation: Math.PI / 2,
					ja: -Math.PI / 2,
					ra: [0, 0.4],
					T: !0,
					P: !0,
					S: !0,
					O: !0,
					R: !1,
				},
				v: La,
			},
			a,
		);
		var c = a.A,
			d = a.B;
		a = a.v;
		var f = c.j,
			e = d.j;
		f = c.length / 2 + (f[0] / f[2]) * (c.length / ((f[1] - f[0]) / f[2]));
		e = d.length / 2 + (e[0] / e[2]) * (d.length / ((e[1] - e[0]) / e[2]));
		b.save();
		b.beginPath();
		b.translate(a[0], a[1]);
		b.translate(f, 0);
		c = Pa(c);
		b.translate(-f, e);
		const k = Pa(d);
		d = [c.l, k.l];
		f = [c.m, k.m];
		b.translate(-a[0], -a[1] - e);
		b.closePath();
		b.restore();
		b = { v: a, A: c, B: k, m: f, l: d };
		return Object.assign(b, Ka(d, f, b));
	}
	function Pa(a = {}) {
		function b() {
			va(f);
			d.lineWidth = h;
			var B = I ? 1 : 0;
			const M = w ? R.length - 1 : R.length;
			for (; B < M && 0 > A.indexOf(R[0][B]); B++) {
				const C = R[B];
				if (0 === Number(C) && q) continue;
				let W = t;
				-1 < p.indexOf(C) && (W *= z);
				H(N * B, -W / 2, N * B, W / 2);
			}
		}
		function c() {
			const B = 0 < u.length ? u : R;
			wa(a.Na);
			za(m);
			const M = (-m / 3) * Math.cos(v) + J[1] * m;
			var C = I ? 1 : 0;
			const W = w ? B.length - 1 : B.length;
			for (; C < W && 0 > A.indexOf(B[C]); C++) {
				var la = "number" == typeof B[C] ? B[C].toFixed(E) : B[C];
				if (0 === Number(la) && q) continue;
				const ma = d.measureText(la).width,
					Ma = (-ma / 2) * Math.cos(v) + J[0] * m + (m / 2) * Math.sin(v);
				L(N * C + Ma, M - ma * Math.sin(v));
				ra(v);
				var Na = 0;
				let na = D.g;
				na.J && (O(1, -1), (Na *= -1));
				na.fillText(la, 0, Na, void 0);
				na.J && O(1, -1);
				ra(-v);
				L(-(N * C + Ma), -(M - ma * Math.sin(v)));
			}
		}
		const d = D.g;
		a = x(
			{
				rotation: 0,
				lineWidth: 2,
				Sa: 13,
				Oa: 17,
				Ra: 10,
				Pa: 10,
				ja: 0,
				length: d.canvas.width,
				Ca: 1.5,
				v: La,
				j: [-5, 5, 1],
				Ea: [],
				Da: [],
				ra: [-0.3, -0],
				Fa: [],
				T: !0,
				R: !0,
				P: !1,
				S: !1,
				O: !1,
				color: "#888888",
				Na: "#ffffff",
			},
			a,
		);
		const f = a.color,
			e = a.v,
			k = a.rotation,
			l = a.Sa,
			m = a.Oa,
			h = a.lineWidth,
			y = a.Ra,
			r = a.length,
			t = a.Pa,
			v = a.ja,
			J = a.ra,
			I = a.P,
			w = a.S,
			A = a.Da,
			u = a.Ea,
			q = a.O,
			z = a.Ca,
			p = a.Fa;
		let { j: n, Ib: E } = a;
		Array.isArray(n) && 2 === n.length && (n = [n[0], n[1], 1]);
		isNaN(E) && (E = (n[2].toString().split(".")[1] || []).length || 0);
		const F = n[0],
			K = n[1],
			X = n[2],
			N = r / ((K - F) / X),
			R = aa(F, K, X);
		d.beginPath();
		sa();
		L(e[0] * N, e[1] * N);
		ra(k);
		L(-r / 2, 0);
		a.T && b();
		a.R && c();
		L(r / 2, 0);
		(function () {
			va(f);
			d.lineWidth = h;
			wa(f);
			const B = Math.atan(y / 2);
			let M = -r / 2,
				C = r / 2;
			I && (Ca(M + l, M, l, y), (M += l * Math.cos(B)));
			w && (Ca(C - l, C, l, y), (C -= l * Math.cos(B)));
			H(M, 0, C, 0);
		})();
		d.closePath();
		ua();
		return { j: n, v: e, Nd: R, m: X, l: N };
	}
	function Qa() {
		var a = { A: { j: [-P[0], P[1], 0.6] }, B: { j: [-P[0], P[1], 0.6] } },
			b = D.g;
		a = x(
			{
				A: { length: b.canvas.width, T: !0, R: !0, P: !1, S: !1, O: !0, l: 50 },
				B: {
					length: b.canvas.height,
					ja: -Math.PI / 2,
					l: 50,
					T: !0,
					R: !0,
					P: !1,
					S: !1,
					O: !0,
				},
				xa: {
					La: 1,
					lineWidth: 1,
					Ka: 0.7,
					color: "#58c4dda0",
					Ja: "#88888850",
				},
				v: La,
			},
			a,
		);
		const c = a.A,
			d = a.B,
			f = a.xa,
			e = f.La;
		a = a.v;
		Array.isArray(c.j)
			? (isNaN(c.j[2]) && (c.j[2] = 1), (c.l = c.length / ((c.j[1] - c.j[0]) / c.j[2])))
			: ((b = c.length / c.l / 2), (c.j = [-b, b, 1]));
		Array.isArray(d.j)
			? (isNaN(d.j[2]) && (d.j[2] = 1), (d.l = d.length / ((d.j[1] - d.j[0]) / d.j[2])))
			: ((b = d.length / d.l / 2), (d.j = [-b, b, 1]));
		b = c.j;
		var k = d.j;
		const l = (b[1] - b[0]) / b[2],
			m = (k[1] - k[0]) / k[2],
			h = c.l,
			y = d.l,
			r = (b[0] / b[2]) * h,
			t = (b[1] / b[2]) * h,
			v = (k[0] / k[2]) * y,
			J = (k[1] / k[2]) * y,
			I = [h / e, y / e];
		sa();
		a[0] *= h;
		a[1] *= y;
		L(a[0], a[1]);
		const w = Oa({ A: c, B: d });
		(function () {
			function A(n, E, F, K, X, N) {
				L(n, E);
				D.g.lineWidth = Number(f.lineWidth);
				va(f.color);
				H(F, K, X, N);
			}
			function u(n, E, F, K) {
				D.g.lineWidth = Number(f.Ka);
				va(f.Ja);
				H(n, E, F, K);
			}
			L(r, 0);
			var q = I[0];
			const z = I[1];
			for (var p = 0; p <= l; p++)
				if (p != c.v - c.j[0]) {
					A(p * h, 0, 0, v, 0, J);
					for (let n = 1; n <= e && p < l; n++) u(n * q, v, n * q, J);
					L(-p * h);
				}
			L(-r, v);
			for (q = 0; q <= m; q++)
				if (q != d.v - d.j[0]) {
					A(0, q * y, r, 0, t, 0);
					for (p = 1; p <= e && q < m; p++) u(r, p * z, t, p * z);
					L(0, -q * y);
				}
			L(0, -v);
		})();
		b = w.l;
		k = w.m;
		ua();
		a = { v: a, m: k, l: b, A: w.A, B: w.B, Kd: I };
		Object.assign(a, Ka(b, k, a));
	}
	function Ra(a) {
		let b;
		Array.isArray(a[0]) && 16 == a[0].length
			? (b = a[0])
			: 16 == a.length
			? (b = a)
			: a[0] instanceof Q
			? (b = a[0].i)
			: (b = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
		return new Float32Array(b);
	}
	class Q {
		constructor(a) {
			this.i = Ra(arguments);
			return this;
		}
		multiply(a) {
			let b = Ra(arguments),
				c = this.i[0],
				d = this.i[1],
				f = this.i[2],
				e = this.i[3];
			this.i[0] = c * b[0] + d * b[4] + f * b[8] + e * b[12];
			this.i[1] = c * b[1] + d * b[5] + f * b[9] + e * b[13];
			this.i[2] = c * b[2] + d * b[6] + f * b[10] + e * b[14];
			this.i[3] = c * b[3] + d * b[7] + f * b[11] + e * b[15];
			c = this.i[4];
			d = this.i[5];
			f = this.i[6];
			e = this.i[7];
			this.i[4] = c * b[0] + d * b[4] + f * b[8] + e * b[12];
			this.i[5] = c * b[1] + d * b[5] + f * b[9] + e * b[13];
			this.i[6] = c * b[2] + d * b[6] + f * b[10] + e * b[14];
			this.i[7] = c * b[3] + d * b[7] + f * b[11] + e * b[15];
			c = this.i[8];
			d = this.i[9];
			f = this.i[10];
			e = this.i[11];
			this.i[8] = c * b[0] + d * b[4] + f * b[8] + e * b[12];
			this.i[9] = c * b[1] + d * b[5] + f * b[9] + e * b[13];
			this.i[10] = c * b[2] + d * b[6] + f * b[10] + e * b[14];
			this.i[11] = c * b[3] + d * b[7] + f * b[11] + e * b[15];
			c = this.i[12];
			d = this.i[13];
			f = this.i[14];
			e = this.i[15];
			this.i[12] = c * b[0] + d * b[4] + f * b[8] + e * b[12];
			this.i[13] = c * b[1] + d * b[5] + f * b[9] + e * b[13];
			this.i[14] = c * b[2] + d * b[6] + f * b[10] + e * b[14];
			this.i[15] = c * b[3] + d * b[7] + f * b[11] + e * b[15];
			return this;
		}
		clone() {
			let a = [];
			for (let b = 0; b < this.i.length; b++) a.push(this.i[b]);
			return new Q(a);
		}
	}
	function Sa(a, b) {
		let c = a.h,
			d = {},
			f = {};
		b.I instanceof HTMLScriptElement && (b.I = b.I.textContent.trim());
		b.H instanceof HTMLScriptElement && (b.H = b.H.textContent.trim());
		var e = b.H;
		const k = Ta(a, a.h.VERTEX_SHADER, b.I);
		e = Ta(a, a.h.FRAGMENT_SHADER, e);
		{
			const l = a.h.createProgram();
			a.h.attachShader(l, k);
			a.h.attachShader(l, e);
			a.h.linkProgram(l);
			a.h.getProgramParameter(l, a.h.LINK_STATUS)
				? (a = l)
				: (console.error(a.h.getProgramInfoLog(l)), a.h.deleteProgram(l), (a = null));
		}
		for (let l in b.attributes) f[l] = c.getAttribLocation(a, b.attributes[l]);
		for (let l in b.u) d[l] = c.getUniformLocation(a, b.u[l]);
		return { s: a, u: d, attributes: f, I: b.I, H: b.H };
	}
	function Ta(a, b, c) {
		b = a.h.createShader(b);
		a.h.shaderSource(b, c);
		a.h.compileShader(b);
		return a.h.getShaderParameter(b, a.h.COMPILE_STATUS)
			? b
			: (console.error(a.h.getShaderInfoLog(b)), a.h.deleteShader(b), null);
	}
	function Ua(a, b, c = 3, d = a.h.FLOAT, f = !1, e = 0, k = 0) {
		a.h.enableVertexAttribArray(b);
		a.h.vertexAttribPointer(b, c, d, f, e, k);
	}
	class Va {
		constructor(a) {
			let b = a.getContext("webgl");
			b || (b = a.getContext("experimental-webgl"));
			if (!b) throw Error("WebGL is not supported");
			b.viewport(0, 0, a.width, a.height);
			this.h = b;
			this.canvas = a;
			this.width = a.width;
			this.height = a.height;
			this.o = a.o || Math.ceil(window.devicePixelRatio);
			this.canvas = a;
			this.L = {
				Ia: {
					I: "attribute vec3 a_position;\n\t\t\t\t\tuniform vec2 u_resolution;\n\t\t\t\t\tuniform mat4 u_matrix;\n\n\t\t\t\t\tvoid main() {\n\t\t\t\t\t\tgl_Position = u_matrix * vec4(a_position, 1) / vec4(u_resolution, 1, 1);\n\t\t\t\t\t}",
					H: "precision mediump float;\n\t\t\t\t\tuniform vec4 u_color;\n\t\t\t\t\tvoid main() {\n\t\t\t\t\t\tgl_FragColor = u_color;\n\t\t\t\t\t}",
					u: { U: "u_resolution", oa: "u_matrix", Ta: "u_color" },
					attributes: { Ua: "a_position" },
					s: null,
				},
				Wc: {
					I: "attribute vec3 a_position;\n\t\t\t\t\tattribute vec4 aVertexColor;\n\t\t\t\t\tuniform vec2 u_resolution;\n\t\t\t\t\tuniform mat4 u_matrix;\n\t\t\t\t\tvarying lowp vec4 vColor;\n\t\t\t\t\tvoid main() {\n\t\t\t\t\t\tgl_Position = u_matrix * vec4(a_position, 1);\n\t\t\t\t\t\t// / vec4(u_resolution, 1, 1);\n\t\t\t\t\t\tvColor = aVertexColor;\n\t\t\t\t\t}",
					H: "precision mediump float;\n\t\t\t\t\tvarying lowp vec4 vColor;\n\t\t\t\t\tvoid main(void) {\n\t\t\t\t\t\tgl_FragColor = vColor;\n\t\t\t\t\t}",
					u: { U: "u_resolution", oa: "u_matrix" },
					attributes: { Ua: "a_position", Ta: "aVertexColor" },
					s: null,
				},
			};
			for (let c in this.L) this.L[c] = Sa(this, this.L[c]);
			this.s = this.L.Ia;
			b.useProgram(this.s.s);
			new Q();
			new Q();
			new Q();
			this.oa = new Q();
			b.uniform2f(this.s.u.U, a.width / 2 / this.o, a.height / 2 / this.o);
			this.ma = {
				fillColor: [1, 0, 1, 1],
				strokeColor: [1, 1, 0, 1],
				lineWidth: 1,
			};
		}
		useProgram(a) {
			if (this.L[a])
				(this.s = this.L[a]),
					this.h.useProgram(this.s.s),
					this.h.uniform2f(
						this.s.u.U,
						this.canvas.width / 2 / this.o,
						this.canvas.height / 2 / this.o,
					);
			else if (a.s) (this.s = a), this.h.useProgram(a.s);
			else throw Error(`${a} not fouund`);
		}
		ga(a = 300, b = 300) {
			var c = window.devicePixelRatio;
			const d = Math.round(a * c);
			c = Math.round(b * c);
			this.canvas.style.width = a + "px";
			this.canvas.style.height = b + "px";
			this.canvas.width = d;
			this.canvas.height = c;
		}
	}
	Va.prototype.background = function (a, b, c, d) {
		this.h.clearColor(a, b, c, d);
		this.h.clear(this.h.COLOR_BUFFER_BIT | this.h.DEPTH_BUFFER_BIT);
		return this;
	};
	function Wa(a, b, c = a.h.ARRAY_BUFFER, d = a.h.STATIC_DRAW) {
		var f = a.h.createBuffer();
		a.h.bindBuffer(c, f);
		a.h.bufferData(c, new Float32Array(b), d);
	}
	Va.prototype.fill = function (...a) {
		a = G(a).ba;
		this.ma.fillColor = [a[0] / 255, a[1] / 255, a[2] / 255, a[3]];
	};
	Va.prototype.lineWidth = function (a) {
		this.ma.lineWidth = a;
	};
	let Xa = [],
		Ya = Math.ceil(window.devicePixelRatio),
		S = [400, 400],
		P = [1.8, 1.8],
		Za = [S[0], S[1]],
		$a = document.querySelector("#shift"),
		ab = document.querySelector("#smoothen"),
		bb = document.querySelector("#shift-out"),
		cb = document.querySelector("#re"),
		db = document.querySelector("#im");
	for (let a = (-S[0] / 2) * Ya; a < (S[0] / 2) * Ya; a++)
		for (let b = (-S[1] / 2) * Ya; b < (S[1] / 2) * Ya; b++)
			Xa.push((a / Za[0]) * P[0], (b / Za[1]) * P[1]);
	var T = !1,
		U = [-1.61, 0],
		eb = null,
		V = null,
		Y = null,
		fb = 0,
		gb = 0,
		hb = !1;
	window.onload = () =>
		D(
			() => {
				var a = D.g;
				var b = x(
					{
						ua: !1,
						o: Math.ceil(window.devicePixelRatio),
						width: a.canvas.style.width,
						height: a.canvas.style.height,
					},
					b,
				);
				var c = a.canvas.parentElement,
					d = D.na(b);
				b.ua
					? c.removeChild(a.canvas)
					: ((c.style.position = "relative"),
					  (d.style.position = "absolute"),
					  (d.style.top = "0"),
					  (d.style.left = "0"));
				for (let e in a.canvas.G) d.addEventListener(e, a.canvas.G[e]);
				c.appendChild(d);
				b = new Va(d);
				a = b.h;
				eb = b;
				V = a;
				Y = Sa(b, {
					I: document.getElementById("vertex"),
					H: document.getElementById("fragment"),
					attributes: { position: "position" },
					u: { c: "c", shift: "shift", M: "smoothen", j: "range" },
				});
				c = D.g;
				c.translate(c.width / 2, c.height / 2);
				Aa();
				c = G([0]).Z;
				d = D.g;
				d.background = c;
				d.save();
				D.g.setTransform(D.o, 0, 0, D.o, 0, 0);
				d.fillStyle = c;
				d.fillRect(0, 0, d.canvas.width, d.canvas.height);
				d.restore();
				Qa();
				var f;
				"string" != typeof f && (f = D.g.canvas.toDataURL("image/png"));
				c = D.g.canvas.style;
				c.background = "url('" + f + "')";
				c.backgroundPosition = "center";
				c.backgroundSize = "cover";
				za(18);
				Aa();
				L(-S[0] / 2, -S[1] / 2);
				b.useProgram(Y);
				Wa(b, Xa);
				Ua(b, Y.attributes.position, 2);
				a.uniform1f(Y.u.shift, gb);
				a.uniform1f(Y.u.M, hb);
				a.uniform2fv(Y.u.j, P);
				U[0] = Number(window.localStorage.getItem("julia-set-re")) || U[0];
				U[1] = Number(window.localStorage.getItem("julia-set-im")) || U[1];
				Z(U[0], U[0], !0);
			},
			".container",
			{
				width: S[0],
				height: S[1],
				name: "julia-set",
				G: {
					Tc: function () {
						T = !0;
					},
					Vc: function () {
						T = !1;
					},
					Uc: ib,
					click: ib,
				},
			},
		);
	window.onkeydown = function (a) {
		"Control" == a.key && (T = !0);
	};
	window.onkeyup = function () {
		T = !1;
	};
	function Z(a = U[0], b = U[1], c = !1, d = !0) {
		if (((a != U[0] && b != U[1]) || c) && 50 < Date.now() - fb) {
			U[0] = a;
			U[1] = b;
			window.localStorage.setItem("julia-set-re", a);
			window.localStorage.setItem("julia-set-im", b);
			d && ((cb.value = a.toFixed(2)), (db.value = b.toFixed(2)));
			eb.background(0, 0, 0, 0);
			V.uniform2f(Y.u.c, a, b);
			V.drawArrays(V.POINTS, 0, Xa.length);
			fb = Date.now();
			c = D.g;
			d = D.o;
			c.save();
			c.setTransform(d, 0, 0, d, 0, 0);
			c.clearRect(0, 0, c.canvas.width, c.canvas.height);
			c.restore();
			let f = ((a + P[0]) * S[0]) / (2 * P[0]),
				e = ((-b + P[1]) * S[1]) / (2 * P[1]);
			c = f;
			d = e;
			let k = D.g;
			k.beginPath();
			k.arc(c, d, 5, 0, 2 * Math.PI);
			k.fill();
			k.beginPath();
			Ba(a.toFixed(2) + (0 > b ? "" : "+") + b.toFixed(2) + "i", f + 10, e);
		}
	}
	function ib(a) {
		(T || "click" == a.type) &&
			Z(a.layerX / (S[0] / (2 * P[0])) - P[0], -(a.layerY / (S[1] / (2 * P[1])) - P[1]));
	}
	$a.addEventListener("input", function () {
		gb = Number($a.value);
		bb.innerHTML = gb + "\u00b0";
		V.uniform1f(Y.u.shift, gb / 360);
		Z(U[0], U[1], !0);
	});
	cb.addEventListener("input", function () {
		U[0] = Number(cb.value);
		Z(U[0], U[1], !0, !1);
	});
	db.addEventListener("input", function () {
		U[1] = Number(db.value);
		Z(U[0], U[1], !0, !1);
	});
	ab.addEventListener("input", function () {
		hb = Number(ab.checked);
		V.uniform1f(Y.u.M, hb);
		Z(U[0], U[1], !0);
	});
}).call(this);
