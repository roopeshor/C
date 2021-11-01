import { linearGradient } from "../../src/color/gradients.js";
import { Manim } from "../../Extensions/Colors/importable.js";
import { CENTER, MIDDLE } from "../../src/constants/drawing.js";
import { PI, RAD, TWO_PI } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { rotateAroundOrigin } from "../../src/math/points.js";
import { doubleArrow, measurement } from "../../src/objects/arrows.js";
import { arcBrace } from "../../src/objects/braces.js";
import { angle, circle, circularSegment, line, point, sector } from "../../src/objects/geometry.js";
import { fillText, text } from "../../src/objects/text.js";
import {
	background,
	fill,
	fontStyle,
	lineDash,
	noFill,
	save,
	stroke,
	strokeWidth,
	textAlign,
	textBaseline,
	translate,
} from "../../src/settings.js";
import { white } from "../../src/constants/colors.js";

const W = 300,
	H = 300,
	{ TEAL, GREEN, RED, PURPLE, BLUE, YELLOW, DARK_BROWN } = Manim;

C(
	() => {
		const radius = 100,
			padding = 20,
			leftStart = -radius - padding;
		const pointOnCircle = rotateAroundOrigin(PI / 6, radius);
		background(0);
		centreCanvas();
		stroke(white);
		fill(TEAL);
		translate(0, -30);
		circularSegment(0, 0, radius, TWO_PI / 3, PI / 6);
		fill(white);
		var tip = arcBrace(0, 0, radius + 15, TWO_PI / 3, PI / 6, 10, 10, 5);
		textAlign(CENTER);
		text("S", ...tip);
		noFill();
		sector(0, 0, radius, TWO_PI / 3, PI / 6);
		sector(0, 0, 20, TWO_PI / 3, PI / 6);
		circle(0, 0, radius);
		// chord
		lineDash(13.5, 13.5);
		line(-pointOnCircle[0], pointOnCircle[1], ...pointOnCircle);
		lineDash();
		fillText("C", -5, pointOnCircle[1] + 10);
		fillText("θ", -5, 25);
		fillText("h", leftStart - 10, pointOnCircle[1] * 1.4);
		fillText("d", leftStart - 10, pointOnCircle[1] * 0.4);
		strokeWidth(1);
		fill(white);
		doubleArrow(leftStart + 10, 0, leftStart + 10, pointOnCircle[1], 13, 10, 0, 4);
		doubleArrow(leftStart + 10, pointOnCircle[1], leftStart + 10, radius, 13, 10, 0, 4);
		save();

		// horizontal markers
		line(leftStart, 0, 0, 0);
		line(leftStart, pointOnCircle[1], -pointOnCircle[0], pointOnCircle[1]);
		line(leftStart, radius, 0, radius);
		translate(7, -7);
		doubleArrow(0, 0, ...pointOnCircle, 13, 10, 0, 4);
		translate(5, -18);
		text("R", pointOnCircle[0] / 2, pointOnCircle[1] / 2);
	},
	".circular-sector",
	{
		name: "cs",
		width: W,
		height: H,
	}
);
C(
	() => {
		background(0);
		centreCanvas();
		stroke(GREEN);
		fill(RED);
		const line1 = [
			[-50, -50],
			[120, 120],
		];
		const line2 = [
			[-70, 70],
			[120, -120],
		];
		line(line1[0][0], line1[0][1], line1[1][0], line1[1][1]);
		stroke(RED);
		line(line2[0][0], line2[0][1], line2[1][0], line2[1][1]);

		fill(PURPLE);
		point(line1[0][0], line1[0][1]);
		fill(BLUE);
		point(line1[1][0], line1[1][1]);
		fill(GREEN);
		point(line2[0][0], line2[0][1]);
		fill(YELLOW);
		point(line2[1][0], line2[1][1]);

		noFill();
		stroke(BLUE);
		const { ang, center } = angle(...line2, ...line1, 20);

		fill(white);
		textBaseline(MIDDLE);
		fontStyle("italic");
		text("θ = " + (ang * RAD).toFixed(1), ...center);
	},
	".line-line-intersection",
	{
		name: "lli",
		width: W,
		height: H,
	}
);
C(
	() => {
		background(0);
		centreCanvas();
		stroke(GREEN);
		var r = 120;
		const color = linearGradient([-r, 0], [r, 0], [BLUE, GREEN, RED, YELLOW, PURPLE, DARK_BROWN]);
		stroke(color);
		fill(color);
		noFill();
		circle(0, 0, r);
		fill(color);
		measurement({
			p2: [r, 0],
			p1: [-r, 0],
			text: "Diameter",
			tipWidth: 15,
			tipHeight: 10,
			arrowCurving: 0,
			spacing: 0,
		});
	},
	".text",
	{
		width: W,
		height: H,
		name: "t",
	}
);
