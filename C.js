function C (c, fx, cfg = {}) {
	var container = c,
		AR = cfg.aspectRatio || [16, 9],
		width =  int(cfg.width, window.innerWidth - parseInt(getComputedStyle(document.body).margin) * 2),
		height = int(cfg.height, width / AR[0] * AR[1]),
		dpr = devicePixelRatio;
	
	var cvs = getCanvas(),
		ctx = cvs.getContext("2d");
	container.appendChild(cvs);
	ctx.scale(dpr, dpr)
	window.CENTRE = [this.width / 2, this.height / 2];
	function getCanvas() {
		var cvs = document.createElement("canvas");
		cvs.width = dpr * width;
		cvs.height = dpr * height;
		cvs.style.width = width + "px";
		cvs.style.height = height + "px";
		return cvs;
	}
	var CDF = {
		W : width,
		H : height,
		stroke : "#fff",
		fill : "#fff",
		strokeWidth : 1,
		line: function (x1, y1, x2, y2) {
			ctx.beginPath();
			ctx.strokeStyle = this.stroke;
			ctx.lineWidth = this.strokeWidth;
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		},
		background: function (c) {
			ctx.beginPath();
			ctx.fillStyle = c;
			ctx.fillRect(0, 0, width, height);
		},
		translate: function (x = 0, y=x) {
			ctx.translate(x, y);
		},
		invertYAxis: function () {
			ctx.scale(1, -1);
		},
		invertXAxis: function () {
			ctx.scale(-1, 1);
		},
		arc: function (x, y, r, sa, ea, stroke = true, fill = false) {
			ctx.beginPath();
			ctx.fillStyle = this.fill;
			ctx.strokeStyle = this.stroke;
			ctx.lineWidth = this.strokeWidth;
			ctx.arc (x, y, r, sa, ea);
			if (fill) ctx.fill();
			if (stroke) ctx.stroke();
		},
		circle: function (x, y, r) {
			this.arc(x, y, r, 0, TAU);
		},

		dot: function (x, y, r = 4) {
			if (this.fill == NONE) this.fill = YELLOW_C;
			const ts = this.stroke;
			this.stroke = NONE;
			CDF.circle(x, y, r);
			stroke = ts;
		}
	}
	fx.bind(CDF)();
}