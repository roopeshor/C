import { C } from "../../src/main.js";
import { arc, background, circle, clear, fill, fontSize, getFPS, lineTo, loop, noFill, permaBackground, rest, restore, save, scale, sector, setLineDash, stroke, strokeWidth, text, translate } from "../../src/functions/drawing-functions.js";
import { doubleArrow } from "../../src/functions/more-things.js"
import { rotateAroundOrigin } from "../../src/functions/math.js";
import { WHITE } from "../../src/constants/colors.js";
const W = 400;
const H = 400;

function fact (x) {
  if (x > 1) {
    return x * fact(x - 1);
  } else {
    return 1;
  }
}

C (
  () => {
		const radius = 150, padding=20, leftStart = -radius-padding;
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
		fillText("circular sector", 95, -H/2+2)
		loop(() => {
			background(0);
			text(getFPS().toFixed(3))
		}, "c");
  },
  ".container",
  {
    name: "c",
    width: W,
    height: H,
  }
)
