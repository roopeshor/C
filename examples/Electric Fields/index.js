import { linearGradient } from "../../src/color/gradients.js";
import { Manim } from "../../Extensions/Colors/importable.js";
import { CENTER, MIDDLE } from "../../src/constants/drawing.js";
import { PI, RAD, TWO_PI } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { rotateAroundOrigin } from "../../src/math/points.js";
import { arrow, measurement } from "../../src/objects/arrows.js";
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

const W = 432,
	H = 432,
	{ TEAL, GREEN, RED, PURPLE, BLUE, YELLOW, DARK_BROWN } = Manim;
let k = -2;
let charges = [
  {
		x: -2,
		y: -2,
		vx: 0,
		vy: 0,
		charge: -1,
		mass: 5
  },
  {
    x: 2,
    y: -1,
    vx: 0,
		vy: 0,
    charge: +3,
    mass: 5
  },
  {
    x: 0,
    y: 2,
    vx: 0,
    vy: 0,
    charge: -2,
    mass: 5
  },
  {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    charge: +2,
    mass: 5
  }]
C(
	() => {
	  background (0);
	  centreCanvas();
		scale(1,-1);
		let range =[-6, 6, .5];
		let a = axes({
		  xAxis: {
		    range: range,
		    length: W
		  },
		  yAxis: {
		    range: range,
		    length: H
		  }
		});
		let [sx, sy] = a.unitSpace;
		textAlign("center");
		textBaseline("middle");
		fontSize(25)
		let dt = 0.01;
		/* loop(
		  () => {
		    background(0);
		    draw()
	    	for (let i = 0; i < charges.length; i++) {
	    	  let fx = 0, fy = 0, a = charges[i];
	    	  for (let j = 0; j < charges.length; j++) {
	    	    if (i == j) continue;
	    	    let b = charges[j];
	    	    let rij2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
	    	    
	    	    fx += b.charge / rij2
	    	        * (b.x - a.x) / rij2 ** 0.5;
	    	    fy += b.charge / rij2
	    	        * (b.y - a.y) / rij2 ** 0.5;
	    	  }
	    	  fx *= k * a.charge;
	    	  fy *= k * a.charge;
	    	  
	    	  let ax = fx / a.mass,
	    	      ay = fy / a.mass;
	    	  
	    	  a.vx += ax * dt;
	    	  a.vy += ay * dt;
	    	  
	    	  a.x += a.vx * dt;
	    	  a.y += a.vy * dt;
	    	}
		  },
		  "t",
		  dt
		) */
		function draw () {
		  let VF = computeVectorField(charges, range);
		  drawVectors(VF.vec, VF.max);
	    drawCharges(charges);
		}
		function drawCharges(charges) {
		  for (let ch of charges) {
		    if (ch.charge <  0) fill(BLUE);
		    else fill(RED)
		    point(ch.x * sx, ch.y * sy, abs(5 * ch.charge));
		    fill("#fff")
		    fontSize(abs(14 * ch.charge)**0.8)
		    fillText(
		      (ch.charge > 0? "+" : "") + ch.charge,
		      ch.x * sx,
		      ch.y * sy
		    )
		  }
		}
		function drawVectors(vf, max) {
		  for (let v of vf) {
		    let i = sigmoid(v.color - 1.75);
		    let col = lerpColorArray(ColorPalettes.Jet, i)
		    col = readColor(col).rgbaA;
		    col[3] = sigmoid(v.color- .1);
		    col = readColor(col).hex8
		    stroke(col)
		    fill(col)
		    strokeWidth(1.3 * sigmoid (v.color + 1))
		    noStroke()
		    arrow(
		      v.start[0] * sx,
		      v.start[1] * sy,
		      (v.start[0] + v.end[0]) * sx,
		      (v.start[1] + v.end[1]) * sy,
		      6*sigmoid (v.color - .5)
		    )
		  }
		}
	},
	".cvs",
	{
		width: W,
		height: H,
		name: "t",
	}
);

function computeVectorField(charges, range) {
  let vec =[];
  let max = -Infinity;
  for (let x = range[0]; x <= range[1]; x += range[2]) {
    for (let y = range[0]; y <= range[1]; y += range[2]) {
      let v = [0,0];
      for (let ch of charges) {
        if (ch.x == x && ch.y == y) continue;
        let r1n = (x - ch.x) ** 2 + (y - ch.y) ** 2;
        let fv = [
          ch.charge / r1n * (x - ch.x) / r1n**0.5,
          ch.charge / r1n * (y - ch.y) / r1n**0.5
        ]
        v[0] += fv[0];
        v[1] += fv[1];
      }
      let n = (v[0]**2 + v[1]**2) ** 0.5;
      if (max < n) max = n;
      
      n = n * 3
      v[0] = v[0] / n * sigmoid(n - -.5);
      v[1] = v[1] / n * sigmoid(n - -.5);
      //v[0] = log(v[0])
      //v[1] = log(v[1])
      vec.push({
        start: [x,y],
        end: v,
        color: n/2
      })
    }
  }
  return {
    vec,
    max
  }
}
