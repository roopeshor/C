import {
	Arc,
	Circle,
	Line,
} from "../../src/animations/create.js";
import { C } from "../../src/main.js";
import { circleIntersection, lineIntersection } from "../../src/math/points.js";
import { point } from "../../src/objects/geometry.js";
import {
	initBlackboardCanvas,
	showCreation,
	strokeWidth,
	wait,
} from "../../src/settings.js";

const W = 300;
const H = 300;

C.debug(true);
C(
	() => {
		initBlackboardCanvas();
		const radius = 80;
		const c1 = [-radius / 2, radius / 2],
			c2 = [radius / 2, -radius / 2];
		C.debug(true);
		strokeWidth(2);
		showCreation(
			Circle({
				name: "circle1",
				center: c1,
				radius: radius,
				dur: 1000,
				dTime: 10,
			})
		);
		wait(500);
		showCreation(
			Circle({
				name: "circle2",
				center: c2,
				radius: radius,
				dur: 1000,
				dTime: 10,
			})
		);
		const pts = circleIntersection(c1, radius, c2, radius);
		wait(300);
		strokeWidth(0.5);
		showCreation(
			Circle({
				name: "point1",
				center: pts[0],
				dur: 500,
				radius: 5,
				dTime: 10,
				fill: "green",
				fillTime: 500,
			})
		);
		showCreation(
			Circle({
				name: "point2",
				center: pts[1],
				dur: 500,
				radius: 5,
				dTime: 10,
				fill: "green",
				fillTime: 500,
			})
		);
	},
	".container",
	{
		name: "cci",
		width: W,
		height: H,
	}
);
C(
	() => {
		initBlackboardCanvas();
		const p1 = [-80, 80],
			p2 = [80, -112],
			p3 = [-128, -80],
			p4 = [128, 112];
		let radius = 5;
		let angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
		let dx = Math.cos(angle) * radius;
		let dy = Math.sin(angle) * radius;
		showCreation(
			Circle({
				name: "p1",
				center: [...p1],
				radius: radius,
				dur: 500,
				fill: "green",
				fillTime: 500,
			})
		);
		showCreation(
			Line({
				name: "line1",
				p1: [p1[0] + dx, p1[1] + dy],
				p2: [p2[0] - dx + Math.cos(angle), p2[1] - dy + Math.sin(angle)],
				dTime: 10,
			})
		);
		showCreation(
			Circle({
				name: "p2",
				center: [...p2],
				radius: radius,
				dur: 500,
				fill: "blue",
				fillTime: 500,
			})
		);
		wait(500);
		showCreation(
			Circle({
				name: "p4",
				center: [...p4],
				radius: radius,
				dur: 500,
				fill: "green",
				fillTime: 500,
			})
		);
		showCreation(
			Line({
				name: "line2",
				p1: [p4[0] - dx, p4[1] + dy],
				p2: [p3[0] + dx + Math.cos(angle), p3[1] - dy + Math.sin(angle)],
				dTime: 10,
			})
		);
		showCreation(
			Circle({
				name: "p3",
				center: [...p3],
				radius: radius,
				dur: 500,
				fill: "green",
				fillTime: 500,
			})
		);
		wait(500);
		strokeWidth(0.5);
		showCreation(
			Circle({
				name: "intersection",
				center: lineIntersection(p1, p2, p3, p4),
				radius: 6,
				dTime: 10,
				dur: 1000,
				fill: "orange",
				fillTime: 500,
			})
		);
	},
	".container",
	{
		name: "lli",
		width: W,
		height: H,
	}
);
