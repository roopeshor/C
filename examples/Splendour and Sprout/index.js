import { Manim } from "../../Extensions/Colors/importable.js";
import { PI } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { abs, cos, round, sin } from "../../src/math/basic.js";
import { circle, line } from "../../src/objects/geometry.js";
import { text } from "../../src/objects/text.js";
import {
	background,
	clear,
	fill,
	loop,
	noFill,
	noLoop,
	stroke,
	strokeWidth,
	translate,
} from "../../src/settings.js";
let W, H, radius, animatedDrawingCfg, staticDrawingCfg;

function initSize() {
	W = C.getWindowWidth() / 1.2;
	// W *= 1.5;
	H = (W / 16) * 9;
	radius = round(H / 2.1);
	animatedDrawingCfg = {
		width: W,
		height: H,
		name: "animatedCvs",
	};
	staticDrawingCfg = { width: W, height: H, name: "staticCvs" };
}
initSize();
function $(id) {
	return document.querySelector(id);
}

const Static = $(".static");
const animated = $(".animated");
const shift = $("#shift");

const drawingConfigs = {
	pointInRadius: 15,
	lineWidth: 1,
	dTime: 50, // time to draw a 2 pairs of line
	shift: 16,
};
let points = [];
// custom color list
const colors = [
	Manim.DARK_BLUE,
	Manim.DARK_BROWN,
	Manim.LIGHT_BROWN,
	Manim.BLUE_A,
	Manim.BLUE_B,
	Manim.BLUE,
	Manim.BLUE_D,
	Manim.BLUE_E,
	Manim.TEAL_A,
	Manim.TEAL_B,
	Manim.TEAL,
	Manim.TEAL_D,
	Manim.TEAL_E,
	Manim.GREEN_A,
	Manim.GREEN_B,
	Manim.GREEN,
	Manim.GREEN_D,
	Manim.GREEN_E,
	Manim.YELLOW_A,
	Manim.YELLOW_B,
	Manim.YELLOW,
	Manim.YELLOW_D,
	Manim.YELLOW_E,
	Manim.GOLD_A,
	Manim.GOLD_B,
	Manim.GOLD,
	Manim.GOLD_D,
	Manim.GOLD_E,
	Manim.RED_A,
	Manim.RED_B,
	Manim.RED,
	Manim.RED_D,
	Manim.RED_E,
	Manim.MAROON_A,
	Manim.MAROON_B,
	Manim.MAROON,
	Manim.MAROON_D,
	Manim.MAROON_E,
	Manim.PURPLE_A,
	Manim.PURPLE_B,
	Manim.PURPLE,
	Manim.PURPLE_D,
	Manim.PURPLE_E,
	Manim.WHITE,
	Manim.LIGHT_GREY,
	Manim.GREY_BROWN,
	Manim.PINK,
	Manim.LIGHT_PINK,
	Manim.GREEN_SCREEN,
	Manim.ORANGE,
];

function computePoints() {
	points = [];
	const ratio = 1 / drawingConfigs.pointInRadius;
	// points in a vertical radius line
	for (let i = 0; i <= drawingConfigs.pointInRadius; i++) points.push([0, i * radius * ratio]);

	// points on a arc
	for (let i = 0; i <= (PI * drawingConfigs.pointInRadius) / 2; i++) {
		const x = -sin(i / drawingConfigs.pointInRadius) * radius;
		const y = cos(i / drawingConfigs.pointInRadius) * radius;
		points.push([x, y]);
	}

	// points in a horizontal radius line
	for (let i = -drawingConfigs.pointInRadius; i <= 0; i++) points.push([i * radius * ratio, 0]);
}

computePoints();

shift.max = points.length - 1;

function linePairs(i) {
	// multiplying each positions by 1s and -1s to position correctly
	const actions = [
		[1, 1, 1, 1], // Left Bottom
		[-1, 1, -1, 1], // Right Bottom
		[1, -1, 1, -1], // Left Top
		[-1, -1, -1, -1], // Right top
	];
	const l = points.length;
	i = abs(i);
	stroke(colors[i % colors.length]);
	for (const act of actions) {
		line(
			act[0] * points[i % l][0],
			act[1] * points[i % l][1],
			act[2] * points[(i + drawingConfigs.shift) % l][0],
			act[3] * points[(i + drawingConfigs.shift) % l][1]
		);
	}
}

function init() {
	strokeWidth(drawingConfigs.lineWidth);
	background(0);
	noFill();
	circle(0, 0, radius);
}
function drawStatic() {
	init();
	for (let i = 0; i <= points.length; i++) {
		linePairs(i, points.length);
	}
}
function drawAnimated() {
	init();
	let i = 0;
	const a = C.contextList.animatedCvs;
	if (a.currentLoop != undefined) noLoop();
	loop(function (elapsed, fps) {
		if (points.length <= i++) {
			noLoop();
		} else {
			linePairs(i, points.length);
			clear(100, -100, 200, 20);
			fill(Manim.WHITE);
			text(fps.toFixed(3), 130, -100);
		}
	}, "animatedCvs");
}

function drawEverything() {
	C(drawStatic, Static, staticDrawingCfg);
	C(drawAnimated, animated, animatedDrawingCfg);
}

drawEverything();

window.updateDC = function updateDC(id, reverse) {
	let i1 = $("#" + id);
	let i2 = $("#" + id + "-result");

	if (reverse) {
		let ii = i1;
		i1 = i2;
		i2 = ii;
	}
	const v = i1.value;
	i2.value = v;
	drawingConfigs[id] = Number(v);
	computePoints();
	if (id === "dTime") {
		if (window.AIS != undefined) {
			clearInterval(window.AIS);
			window.AIS = setInterval(incShift, v);
		}
	} else if (id === "pointInRadius") {
		drawingConfigs.shift =
			shift.value =
			$("#shift-result").value =
				drawingConfigs.pointInRadius + 1;
		shift.max = points.length - 1;
	}
	drawEverything();
};
function incShift() {
	const e1 = $("#shift");
	const e2 = $("#shift-result");
	const nv = Number(e1.value) + 1;
	e1.max = e2.max = nv;
	e1.value = e2.value = nv;
	drawingConfigs.shift = nv;
	drawEverything();
}
window.autoIncShift = function autoIncShift(el) {
	el.innerText = "Stop Auto Incrementing";
	el.onclick = function () {
		clearInterval(window.AIS);
		el.innerText = "Auto Increment Shift";
		el.setAttribute("onclick", "autoIncShift(this)");
	};
	window.AIS = setInterval(incShift, drawingConfigs.dTime);
};

window.onresize = function () {
	initSize();
	computePoints();
	drawEverything();
};

C(
	() => {
		translate(CENTERX, CENTERY);
	},
	Static,
	staticDrawingCfg
);
C(
	() => {
		translate(CENTERX, CENTERY);
	},
	animated,
	animatedDrawingCfg
);
