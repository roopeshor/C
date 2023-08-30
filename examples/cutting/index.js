// import { axes, line, numberLine, point } from "../../src/c.js";
// import {
// 	background,
// 	endShape,
// 	fill,
// 	invertXAxis,
// 	invertYAxis,
// 	lineTo,
// 	moveTo,
// 	scale,
// 	startShape,
// 	stroke,
// 	strokeWidth,
// 	translate,
// } from "../../src/settings.js";

const W = 400;
const H = 400;
const translateX = W / 1.5 + 50;
const translateY = H / 2;

C(draw, ".display", {
	width: W,
	height: H,
});

async function draw() {
	let data = await read("./data.txt");
	let pts = NCtoPoints(data);
	setup();
	drawLine(pts);
	drawPts(pts);

	let profileEdge = generateProfileGeometry(pts);
	drawProfile(profileEdge);
}

function generateProfileGeometry(handles, depth = 2) {
	let points = [];
	for (let i = 1; i < handles.length; i++) {
		let p1 = handles[i - 1],
			p2 = handles[i];
		let ptx = arange(p1.x, p2.x, depth),
			interpolator = linear;
		if (ptx.length < 2 && i > 1) continue;
		ptx.forEach((val, i) => {
			points.push({
				z: interpolator(p1.z, p2.z, i / (ptx.length - 1)),
				x: ptx[i],
			});
		});
	}
	return points;
}

/**
 *
 * @param {number} a start
 * @param {number} b end
 * @param {number} t ∈ [0, 1]
 * @returns {number} ∈ [a, b]
 */
function linear(a, b, t) {
	return a + t * (b - a);
}

function drawProfile(edgePoints) {
	stroke("#0fa");
	console.log(edgePoints);
	for (let i = 0; i < edgePoints.length; i++) {
		let x = edgePoints[i].z;
		let y = edgePoints[i].x;
		line(0, y, x, y);
	}
}

function setup() {
	background(0);
	translate(translateX, translateY);
	invertXAxis();
	invertYAxis();
	let a = axes({
		xAxis: {
			length: W / 1.3,
			range: [-10, 100, 10],
			includeRightTip: false,
			fontSize: 13,
			axisFont: 20,
			axisLabel: "z",
		},
		yAxis: {
			length: H / 1.3,
			range: [-50, 50, 10],
			includeRightTip: false,
			textDirection: [0, -1.2],
			fontSize: 13,
			axisFont: 20,
			axisLabel: "x",
		},
	});
	scale(...a.unitSpace);
	strokeWidth(0.3);
}

function drawLine(pts) {
	stroke("#ff0");
	startShape();
	moveTo(pts[0].z, pts[0].x);
	for (let i = 1; i < pts.length; i++) {
		let pt = pts[i];
		lineTo(pt.z, pt.x);
	}
	stroke();
	endShape();
}

function drawPts(pts) {
	fill("#f0f");
	for (let pt of pts) {
		point(pt.z, pt.x, 2);
	}
}

async function read(file) {
	let data;
	await fetch(file)
		.then((res) => {
			return res.blob();
		})
		.then((dat) => {
			data = dat.text();
		});
	return data;
}

function NCtoPoints(txt) {
	let arr = [];
	txt = txt.split("\n");
	for (let line of txt) {
		if (line.length < 4) continue;
		arr.push(getPts(line));
	}
	return arr;
}

function getPts(line) {
	let x = line.match(/(?<=x)(\-+)?\.?\d+\.?(\d+)?/gi);
	let z = line.match(/(?<=z)(\-+)?\.?\d+\.?(\d+)?/gi);
	return { z: parseFloat(z), x: parseFloat(x) };
}

function arange(start, end, step, rev = false) {
	let arr = [];
	if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
	else for (let i = start; i <= end; i += step) arr.push(i);
	return arr;
}
