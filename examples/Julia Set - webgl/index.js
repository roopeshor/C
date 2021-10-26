import { C } from "../../src/main.js";
import { point } from "../../src/objects/geometry.js";
import { text } from "../../src/objects/text.js";
import { fontSize, invertYAxis, translate } from "../../src/settings.js";
import { createWebGL } from "../../src/WebGL/webgl.js";

// compute points
let points800x800 = [];
let dpr = Math.ceil(window.devicePixelRatio);
let s = [400, 400];
let r = [s[0], s[1]];
for (let x = (-s[0] / 2) * dpr; x < (s[0] / 2) * dpr; x++) {
	for (let y = (-s[1] / 2) * dpr; y < (s[1] / 2) * dpr; y++) {
		points800x800.push(x / r[0] * 2, y / r[1] * 2);
	}
}

let juliaSet = {
	scale: s,
	points: points800x800,
	drag: false,
	location: [-1.61, 0],
	resolution: r,
	GL: null,
	/** @type {WebGLRenderingContext} */
	gl: null,
	program: null,
	lastDrawn: 0,
	shift: 0,
	smoothen: false
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
					smoothen: "smoothen"
				},
			});
			centreCanvas();
			invertYAxis();
			background(0);
			numberPlane({
				xAxis: {
					range: [-2, 2, 1],
				},
				yAxis: {
					range: [-2, 2, 1],
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
			let re = Number(localStorage.getItem("julia-set-re")) || juliaSet.location[0];
			let im = Number(localStorage.getItem("julia-set-im")) || juliaSet.location[1];
			draw(re, im);
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
function draw(re = -1.616, im = 0, _new = false) {
	if (
		(re != juliaSet.location[0] &&
		im != juliaSet.location[1] || _new) &&
		Date.now() - juliaSet.lastDrawn > 50
	) {
		juliaSet.location[0] = re;
		juliaSet.location[1] = im;
		localStorage.setItem("julia-set-re", re);
		localStorage.setItem("julia-set-im", im);

		juliaSet.GL.clear();
		juliaSet.gl.uniform2f(juliaSet.program.uniforms.c, re, im);
		juliaSet.gl.drawArrays(juliaSet.gl.POINTS, 0, juliaSet.points.length);
		juliaSet.lastDrawn = Date.now();
		clear();
		let x = (re + 2) * juliaSet.scale[0] / 4;
		let y = (-im + 2) * juliaSet.scale[1] / 4;

		point(x, y);
		text(re.toFixed(2) + (im < 0 ? "" : "+") + im.toFixed(2) + "i", x + 10, y);
	}
}
function drawEvent(evt) {
	if (juliaSet.drag || evt.type == "click") {
		let re = evt.layerX / (juliaSet.scale[0] / 4.0) - 2.0,
			im = -(evt.layerY / (juliaSet.scale[1] / 4.0) - 2.0);
		draw(re, im);
	}
}

/** @type {HTMLInputElement} */
let shift = document.querySelector("#shift");
let smoothen = document.querySelector("#smoothen");
let shiftOut = document.querySelector("#shift-out");

shift.addEventListener("input", function () {
	juliaSet.shift = Number(shift.value);
	shiftOut.innerHTML = juliaSet.shift;
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.shift, juliaSet.shift / 360);
	draw(juliaSet.location[0], juliaSet.location[1], true);
});

smoothen.addEventListener("input", function () {
	juliaSet.smoothen = Number(smoothen.checked);
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.smoothen, juliaSet.smoothen);
	draw(juliaSet.location[0], juliaSet.location[1], true);
});
