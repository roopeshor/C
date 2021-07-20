import { axes, numberPlane } from "../../src/basic-constructs/coordinate-systems.js";
import {
	arcBetweenPoints,
	circle,
	point,
} from "../../src/basic-constructs/curves.js";
import {
	background,
	invertYAxis,
	scale,
} from "../../src/basic-constructs/settings.js";
import { circleIntersection } from "../../src/utils/math.js";

const W = 350;
const H = 350;
{
	// C(
	// 	() => {
	// 		const radius = 120,
	// 			padding = 20,
	// 			leftStart = -radius - padding;
	// 		const pointOnCircle = rotateAroundOrigin(PI / 6, radius);
	// 		initCenteredCanvas();
	// 		stroke(WHITE);
	// 		fill(TEAL_C);
	// 		circularSegment(0, 0, radius, (PI * 2) / 3, PI / 6);
	// 		fill(WHITE);
	// 		var tip = arcBrace(0, 0, radius + 15, (PI * 2) / 3, PI / 6, 10, 10, 20);
	// 		textAlign(CENTER);
	// 		tex("S", ...tip);
	// 		noFill();
	// 		sector(0, 0, radius, (PI * 2) / 3, PI / 6);
	// 		sector(0, 0, 20, (PI * 2) / 3, PI / 6);
	// 		circle(0, 0, radius);
	// 		// chord
	// 		lineDash(13.5, 13.5);
	// 		line(-pointOnCircle[0], pointOnCircle[1], ...pointOnCircle);
	// 		lineDash();
	// 		fillText("C", -5, pointOnCircle[1] + 10);
	// 		fillText("θ", -5, 25);
	// 		fillText("h", leftStart - 10, pointOnCircle[1] * 1.4);
	// 		fillText("d", leftStart - 10, pointOnCircle[1] * 0.4);
	// 		strokeWidth(1);
	// 		fill(WHITE);
	// 		doubleArrow(
	// 			leftStart + 10,
	// 			0,
	// 			leftStart + 10,
	// 			pointOnCircle[1],
	// 			15,
	// 			0.8,
	// 			4
	// 		);
	// 		doubleArrow(
	// 			leftStart + 10,
	// 			pointOnCircle[1],
	// 			leftStart + 10,
	// 			radius,
	// 			15,
	// 			0.8,
	// 			4
	// 		);
	// 		save();
	// 		line(leftStart, 0, 0, 0);
	// 		line(leftStart, pointOnCircle[1], -pointOnCircle[0], pointOnCircle[1]);
	// 		line(leftStart, radius, 0, radius);
	// 		translate(7, -7);
	// 		doubleArrow(0, 0, ...pointOnCircle, 15, 0.8, 4);
	// 		translate(0, -18);
	// 		text("R", pointOnCircle[0] / 2, pointOnCircle[1] / 2);
	// 		restore();
	// 		fontSize(15);
	// 		textAlign(RIGHT);
	// 		fillText("circular sector", W / 2, -H / 2 + 2);
	// 	},
	// 	".circular-sector",
	// 	{
	// 		name: "cs",
	// 		width: W,
	// 		height: H,
	// 	}
	// );
}

{
	// C(
	// 	() => {
	// 		initCenteredCanvas();
	// 		stroke(GREEN_C);
	// 		fill(RED_C);
	// 		const line1 = [
	// 			[-30 + 20, -30 + 20],
	// 			[100 + 20, 100 + 20]
	// 		];
	// 		const line2 = [
	// 			[-50 + 20, 50+20],
	// 			[100 + 20, -100+20]
	// 		];
	// 		line(...line1[0], ...line1[1]);
	// 		stroke(RED_C)
	// 		line(...line2[0], ...line2[1]);
	// 		fill(PURPLE_C)
	// 		point(...line1[0]);
	// 		point(...line1[1]);
	// 		point(...line2[0]);
	// 		point(...line2[1]);
	// 		centerdText();
	// 		fontStyle("italic")
	// 		noFill();
	// 		stroke(BLUE_C);
	// 		const p = angle(...line1, ...line2, 20);
	// 		fill(WHITE);
	// 		text("θ", ...p);
	// 	},
	// 	".text",
	// 	{
	// 		name: "tx",
	// 		width: W,
	// 		height: H,
	// 	}
	//);
}

C(
	() => {
		initCenteredCanvas();
		background(0);
		stroke(GREEN_C);
		noFill();
		const ang = PI * 1.1;
		curvedArrow(0,0, 110, ang);
	},
	".text",
	{
		width: W,
		height: H,
		name: "t",
	}
);
