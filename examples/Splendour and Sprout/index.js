import {
	BLUE,
	BLUE_A,
	BLUE_B,
	BLUE_D,
	BLUE_E,
	DARK_BLUE,
	DARK_BROWN,
	GOLD,
	GOLD_A,
	GOLD_B,
	GOLD_D,
	GOLD_E,
	GREEN,
	GREEN_A,
	GREEN_B,
	GREEN_D,
	GREEN_E,
	GREEN_SCREEN,
	GREY_BROWN,
	LIGHT_BROWN,
	LIGHT_GREY,
	LIGHT_PINK,
	MAROON,
	MAROON_A,
	MAROON_B,
	MAROON_D,
	MAROON_E,
	ORANGE,
	PINK,
	PURPLE,
	PURPLE_A,
	PURPLE_B,
	PURPLE_D,
	PURPLE_E,
	RED,
	RED_A,
	RED_B,
	RED_D,
	RED_E,
	TEAL,
	TEAL_A,
	TEAL_B,
	TEAL_D,
	TEAL_E,
	WHITE,
	YELLOW,
	YELLOW_A,
	YELLOW_B,
	YELLOW_D,
	YELLOW_E,
} from "../../src/constants/colors.js";
import { PI } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { abs, cos, round, sin } from "../../src/math/basic.js";
import { circle, line } from "../../src/objects/geometry.js";
import { text } from "../../src/objects/text.js";
import {
	clear,
	fill,
	initBlackboardCanvas,
	loop,
	noFill,
	noLoop,
	stroke,
	strokeWidth,
} from "../../src/settings.js";
let W, H, radius, animatedDrawingCfg, staticDrawingCfg;

function initSize() {
	W = C.getContainerWidth() / 1.2;
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
	DARK_BLUE,
	DARK_BROWN,
	LIGHT_BROWN,
	BLUE_A,
	BLUE_B,
	BLUE,
	BLUE_D,
	BLUE_E,
	TEAL_A,
	TEAL_B,
	TEAL,
	TEAL_D,
	TEAL_E,
	GREEN_A,
	GREEN_B,
	GREEN,
	GREEN_D,
	GREEN_E,
	YELLOW_A,
	YELLOW_B,
	YELLOW,
	YELLOW_D,
	YELLOW_E,
	GOLD_A,
	GOLD_B,
	GOLD,
	GOLD_D,
	GOLD_E,
	RED_A,
	RED_B,
	RED,
	RED_D,
	RED_E,
	MAROON_A,
	MAROON_B,
	MAROON,
	MAROON_D,
	MAROON_E,
	PURPLE_A,
	PURPLE_B,
	PURPLE,
	PURPLE_D,
	PURPLE_E,
	WHITE,
	LIGHT_GREY,
	GREY_BROWN,
	PINK,
	LIGHT_PINK,
	GREEN_SCREEN,
	ORANGE,
];

function computePoints() {
	points = [];
	const ratio = 1 / drawingConfigs.pointInRadius;
	// points in a vertical radius line
	for (let i = 0; i <= drawingConfigs.pointInRadius; i++)
		points.push([0, i * radius * ratio]);

	// points on a arc
	for (let i = 0; i <= (PI * drawingConfigs.pointInRadius) / 2; i++) {
		const x = -sin(i / drawingConfigs.pointInRadius) * radius;
		const y = cos(i / drawingConfigs.pointInRadius) * radius;
		points.push([x, y]);
	}

	// points in a horizontal radius line
	for (let i = -drawingConfigs.pointInRadius; i <= 0; i++)
		points.push([i * radius * ratio, 0]);
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
	initBlackboardCanvas();
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
	const a = C.canvasList.animatedCvs;
	if (a.currentLoop != undefined) noLoop();
	loop(function (elapsed, fps) {
		if (points.length <= i++) {
			noLoop();
		} else {
			linePairs(i, points.length);
			clear(100, -100, 200, 20);
			fill(WHITE);
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
