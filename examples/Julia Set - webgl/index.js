import { C } from "../../src/main.js";
import { numberPlane } from "../../src/objects/coordinate_systems.js";
import { point } from "../../src/objects/geometry.js";
import { text } from "../../src/objects/text.js";
import { background, centreCanvas, clear, fontSize, invertYAxis, permaBackground, translate } from "../../src/settings.js";
import { createWebGL } from "../../src/WebGL/webgl.js";
import { } from "../../src/WebGL/settings.js"
// compute points
let points = [],
	dpr = Math.ceil(window.devicePixelRatio),
	s = [400, 400],
	range = [1.8, 1.8],
	r = [s[0], s[1]],
	shift = document.querySelector("#shift"),
	smoothen = document.querySelector("#smoothen"),
	shiftOut = document.querySelector("#shift-out"),
	reInput = document.querySelector("#re"),
	imInput = document.querySelector("#im");

for (let x = (-s[0] / 2) * dpr; x < (s[0] / 2) * dpr; x++) {
	for (let y = (-s[1] / 2) * dpr; y < (s[1] / 2) * dpr; y++) {
		points.push((x / r[0]) * range[0], (y / r[1]) * range[1]);
	}
}

let juliaSet = {
	scale: s,
	points: points,
	drag: false,
	c: [-1.61, 0],
	range: range,
	resolution: r,
	GL: null,
	/** @type {WebGLRenderingContext} */
	gl: null,
	program: null,
	lastDrawn: 0,
	shift: 0,
	smoothen: false,
};

window.onload = () =>
	C(
		() => {
			let GL = createWebGL(),
				gl = GL.gl;
			juliaSet.GL = GL;
			juliaSet.gl = gl;
			juliaSet.program = GL.createCustomProgram({
				vertex: document.getElementById("vertex"),
				fragment: document.getElementById("fragment"),
				attributes: {
					position: "position",
				},
				uniforms: {
					c: "c",
					shift: "shift",
					smoothen: "smoothen",
					range: "range",
				},
			});
			centreCanvas();
			invertYAxis();
			background(0);
			numberPlane({
				xAxis: {
					range: [-range[0], range[1], 0.6],
				},
				yAxis: {
					range: [-range[0], range[1], 0.6],
				},
			});
			permaBackground();
			fontSize(18);
			invertYAxis();
			translate(-juliaSet.scale[0] / 2, -juliaSet.scale[1] / 2);
			GL.useProgram(juliaSet.program);
			GL.putBufferData(juliaSet.points);
			GL.attribUsage(juliaSet.program.attributes.position, 2);
			gl.uniform1f(juliaSet.program.uniforms.shift, juliaSet.shift);
			gl.uniform1f(juliaSet.program.uniforms.smoothen, juliaSet.smoothen);
			gl.uniform2fv(juliaSet.program.uniforms.range, juliaSet.range);
			juliaSet.c[0] = Number(window.localStorage.getItem("julia-set-re")) || juliaSet.c[0];
			juliaSet.c[1] = Number(window.localStorage.getItem("julia-set-im")) || juliaSet.c[1];
			draw(juliaSet.c[0], juliaSet.c[0], true);
		},
		".container",
		{
			width: juliaSet.scale[0],
			height: juliaSet.scale[1],
			name: "julia-set",
			events: {
				mousedown: function () {
					juliaSet.drag = true;
				},
				mouseup: function () {
					juliaSet.drag = false;
				},
				mousemove: drawEvent,
				click: drawEvent,
			},
		}
	);

window.onkeydown = function (evt) {
	if (evt.key == "Control") juliaSet.drag = true;
};
window.onkeyup = function (evt) {
	juliaSet.drag = false;
};
function draw(re = juliaSet.c[0], im = juliaSet.c[1], _new = false, assignToC = true) {
	if (
		((re != juliaSet.c[0] && im != juliaSet.c[1]) || _new) &&
		Date.now() - juliaSet.lastDrawn > 50
	) {
		juliaSet.c[0] = re;
		juliaSet.c[1] = im;
		window.localStorage.setItem("julia-set-re", re);
		window.localStorage.setItem("julia-set-im", im);
		if (assignToC) {
			reInput.value = re.toFixed(2);
			imInput.value = im.toFixed(2);
		}
		juliaSet.GL.clear();
		juliaSet.gl.uniform2f(juliaSet.program.uniforms.c, re, im);
		juliaSet.gl.drawArrays(juliaSet.gl.POINTS, 0, juliaSet.points.length);
		juliaSet.lastDrawn = Date.now();
		clear();
		let x = ((re + juliaSet.range[0]) * juliaSet.scale[0]) / (juliaSet.range[0] * 2);
		let y = ((-im + juliaSet.range[1]) * juliaSet.scale[1]) / (juliaSet.range[1] * 2);

		point(x, y);
		text(re.toFixed(2) + (im < 0 ? "" : "+") + im.toFixed(2) + "i", x + 10, y);
	}
}
function drawEvent(evt) {
	if (juliaSet.drag || evt.type == "click") {
		let re = evt.layerX / (juliaSet.scale[0] / (juliaSet.range[0] * 2)) - juliaSet.range[0],
			im = -(evt.layerY / (juliaSet.scale[1] / (juliaSet.range[1] * 2)) - juliaSet.range[1]);
		draw(re, im);
	}
}

shift.addEventListener("input", function () {
	juliaSet.shift = Number(shift.value);
	shiftOut.innerHTML = juliaSet.shift + "°";
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.shift, juliaSet.shift / 360);
	draw(juliaSet.c[0], juliaSet.c[1], true);
});

reInput.addEventListener("input", function () {
	juliaSet.c[0] = Number(reInput.value);
	draw(juliaSet.c[0], juliaSet.c[1], true, false);
});

imInput.addEventListener("input", function () {
	juliaSet.c[1] = Number(imInput.value);
	draw(juliaSet.c[0], juliaSet.c[1], true, false);
});

smoothen.addEventListener("input", function () {
	juliaSet.smoothen = Number(smoothen.checked);
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.smoothen, juliaSet.smoothen);
	draw(juliaSet.c[0], juliaSet.c[1], true);
});
