const W = 350;
const H = 350;
C(
	() => {
		const radius = 120,
			padding = 20,
			leftStart = -radius - padding;
		const pointOnCircle = rotateAroundOrigin(PI / 6, radius);
		initCenteredCanvas();
		stroke(WHITE);
		fill(TEAL_C);
		circularSegment(0, 0, radius, (PI * 2) / 3, PI / 6);
		fill(WHITE);
		var tip = arcBrace(0, 0, radius + 15, (PI * 2) / 3, PI / 6, 10, 10, 20);
		textAlign(CENTER);
		tex("S", ...tip);
		noFill();

		sector(0, 0, radius, (PI * 2) / 3, PI / 6);
		sector(0, 0, 20, (PI * 2) / 3, PI / 6);
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
		fill(WHITE);

		doubleArrow(
			leftStart + 10,
			0,
			leftStart + 10,
			pointOnCircle[1],
			15,
			0.8,
			4
		);
		doubleArrow(
			leftStart + 10,
			pointOnCircle[1],
			leftStart + 10,
			radius,
			15,
			0.8,
			4
		);
		save();
		line(leftStart, 0, 0, 0);
		line(leftStart, pointOnCircle[1], -pointOnCircle[0], pointOnCircle[1]);
		line(leftStart, radius, 0, radius);
		translate(7, -7);
		doubleArrow(0, 0, ...pointOnCircle, 15, 0.8, 4);

		translate(0, -18);
		text("R", pointOnCircle[0] / 2, pointOnCircle[1] / 2);
		restore();

		fontSize(15);
		textAlign(RIGHT);
		fillText("circular sector", W / 2, -H / 2 + 2);
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
		initCenteredCanvas();
		noFill();
		stroke(GREEN_C);
		// circle(0, 0, 100);
		const points = [
			[-100, 0],
			[0, 100],
			[100, 0],
			[0, -100],
			[-100, 0],
		]
		smoothCurveThroughPoints(points);
	},
	".text",
	{
		name: "tx",
		width: W,
		height: H,
	}
);
