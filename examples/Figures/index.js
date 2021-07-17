import { C } from "../../src/main.js";
import { arc, background, circle, clear, fill, fontSize, getFPS, lineTo, loop, noFill, permaBackground, rest, restore, save, scale, sector, setLineDash, stroke, strokeWidth, text, textAlign, textBaseline, translate } from "../../src/functions/drawing-functions.js";
import { arcBrace, axes, doubleArrow } from "../../src/functions/more-things.js"
import { rotateAroundOrigin } from "../../src/functions/math.js";
import { WHITE } from "../../src/constants/colors.js";
import { CENTER, MIDDLE } from "../../src/constants/drawing.js";
const W = 350;
const H = 350;
C (
  () => {
		const radius = 120, padding=20, leftStart = -radius-padding;
		const pointOnCircle = rotateAroundOrigin(PI/6, radius);
    initCenteredCanvas();
		stroke(WHITE);
		translate(0);

		fill(TEAL_C);
		circularSegment(0, 0, radius, PI*2/3, PI/6)
		fill(WHITE);
		noFill();

		sector(0, 0, radius, PI*2/3, PI/6);
		sector(0, 0, 20, PI*2/3, PI/6);
		circle(0, 0, radius);

		// chord
		setLineDash(13.5, 13.5);
		line(-pointOnCircle[0], pointOnCircle[1], ...pointOnCircle);
		setLineDash()

		fillText("C", -5, pointOnCircle[1] + 10)
		fillText("θ", -5, 25)
		fillText("h", leftStart-10, pointOnCircle[1]*1.4)
		fillText("d", leftStart-10, pointOnCircle[1]*.4)

		strokeWidth(1);
		fill(WHITE);

		doubleArrow(leftStart+10, 0, leftStart+10, pointOnCircle[1], 15, 0.8, 4);
		doubleArrow(leftStart+10, pointOnCircle[1], leftStart+10, radius, 15, 0.8, 4);
		save();
		line(leftStart, 0, 0, 0);
		line(leftStart, pointOnCircle[1], -pointOnCircle[0], pointOnCircle[1]);
		line(leftStart, radius, 0, radius);
		translate(7, -7);
		doubleArrow(0, 0, ...pointOnCircle, 15, 0.8, 4);

		translate(0, -18);
		text("R", pointOnCircle[0] / 2, pointOnCircle[1] / 2)
		restore();

		fontSize(15);
		textAlign(RIGHT);
		fillText("circular sector", W/2, -H/2+2)
  },
  ".circular-sector",
  {
    name: "cs",
    width: W,
    height: H,
  }
);

C (
  () => {
		initCenteredCanvas();
		// const v = curlyBrace(0, 0, 100, 100);
		var tip = arcBrace(0, 0, 100, PI/4, PI/6);
		text("H", ...tip);
  },
  ".text",
  {
    // name: "cs",
    width: W,
    height: H,
  }
)
