import { C } from "../../../src/main.js";
import { numberPlane } from "../../../src/objects/coordinate_systems/number_plane.js";
import { point } from "../../../src/objects/geometry.js";
import { text } from "../../../src/objects/text.js";
import {
	background,
	clear,
	fontSize,
	cssBackground,
	translate,
	invertYAxis,
} from "../../../src/settings.js";
import { createWebGL, WebGL } from "../../../src/WebGL/webgl.js";
import {} from "../../../src/WebGL/settings.js";
import {} from "../../../src/WebGL/settings.js";

themeToggler(document.querySelector("#themeSelector"), {});

// compute points
let points = [],
	dpr = Math.ceil(window.devicePixelRatio),
	s = [400, 400],
	range = [1.5, 1.5],
	r = [s[0], s[1]],
	shift = document.querySelector("#shift"),
	smoothen = document.querySelector("#smoothen"),
	shiftOut = document.querySelector("#shift-out"),
	reInput = document.querySelector("#re"),
	imInput = document.querySelector("#im"),
	/** @type {HTMLSelectElement} */
	power = document.querySelector("#zPower"),
	var_declarations = `float x2 = z.x * z.x;
			float y2 = z.y * z.y;
			float xy2 = x2 - y2 - 2.0 * y2;
			float xym2 = x2 - y2 + 2.0 * x2;
			float xy22 = x2 * xy2 - y2 * xym2;
`;

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
	/** @type {WebGL} */
	GL: null,
	/** @type {WebGLRenderingContext} */
	gl: null,
	program: null,
	lastDrawn: 0,
	shift: 0,
	smoothen: false,
	MAX_ITERATIONS: 150,
	power: {
		1: `z = z + c;`,
		2: `z = vec2(
				z.x * z.x - z.y * z.y,
				2.0 * z.x * z.y
			) + c;`,
		3: `z = vec2(
				z.x * (z.x * z.x - z.y * z.y - 2.0 * z.y * z.y),
				z.y * (2.0 * z.x * z.x + z.x * z.x - z.y * z.y)
			) + c;`,

		4: `z = vec2(
				z.x * z.x * (z.x * z.x - z.y * z.y - 2.0 * z.y * z.y) - z.y * z.y * (2.0 * z.x * z.x + z.x * z.x - z.y * z.y),
				z.y * z.x * (2.0 * z.x * z.x + z.x * z.x - z.y * z.y) + z.x * z.y * (z.x * z.x - z.y * z.y - 2.0 * z.y * z.y)
			) + c;`,
		5:
			var_declarations +
			`z = vec2(
				z.x * xy22 - y2 * z.x * (xym2 + xy2),
				z.y * xy22 + x2 * z.y * (xym2 + xy2)
			) + c;`,
		6:
			var_declarations +
			`z = vec2(
				x2 * xy22 - y2 * x2 * (xym2 + xy2) - y2 * xy22 - y2 * x2 * (xym2 + xy2),
				z.x * z.y * (xy22 + x2 * (xym2 + xy2) + xy22 - y2 * (xym2 + xy2))
			) + c;`,
	},
	pw: 2,
};

window.onload = () =>
	C(
		() => {
			let GL = createWebGL(),
				gl = GL.gl;
			juliaSet.GL = GL;
			juliaSet.gl = gl;
			translate(CENTERX, CENTERY);
			invertYAxis();
			background(0);
			numberPlane({
				xAxis: {
					range: [-range[0], range[1], 0.5],
				},
				yAxis: {
					range: [-range[0], range[1], 0.5],
				},
			});
			cssBackground();
			fontSize(18);
			invertYAxis();
			translate(-juliaSet.scale[0] / 2, -juliaSet.scale[1] / 2);
			let reLC = window.localStorage.getItem("julia-set-re");
			let imLC = window.localStorage.getItem("julia-set-im");
			juliaSet.c[0] = Number(reLC == null ? juliaSet.c[0] : reLC);
			juliaSet.c[1] = Number(imLC == null ? juliaSet.c[1] : imLC);
			constructProgram();
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
		},
	);

window.onkeydown = function (evt) {
	if (evt.key == "Control") juliaSet.drag = true;
};

window.onkeyup = function (evt) {
	juliaSet.drag = false;
};

function draw(re = juliaSet.c[0], im = juliaSet.c[1], assignToInputs = true) {
	if (Date.now() - juliaSet.lastDrawn > 50) {
		juliaSet.c[0] = re;
		juliaSet.c[1] = im;
		window.localStorage.setItem("julia-set-re", re);
		window.localStorage.setItem("julia-set-im", im);
		if (assignToInputs) {
			reInput.value = re.toFixed(2);
			imInput.value = im.toFixed(2);
		}
		juliaSet.GL.clear();
		juliaSet.gl.uniform2f(juliaSet.program.uniforms.c, re, im);
		juliaSet.gl.drawArrays(juliaSet.gl.POINTS, 0, juliaSet.points.length / 2);
		juliaSet.lastDrawn = Date.now();
		clear();
		let x = ((re + juliaSet.range[0]) * juliaSet.scale[0]) / (juliaSet.range[0] * 2);
		let y = ((-im + juliaSet.range[1]) * juliaSet.scale[1]) / (juliaSet.range[1] * 2);

		point(x, y, 5);
		text(re.toFixed(2) + (im < 0 ? "" : "+") + im.toFixed(2) + "i", x + 10, y);
	}
}

function drawEvent(evt) {
	if (juliaSet.drag || evt.type == "click") {
		let re =
				evt.layerX / (juliaSet.scale[0] / (juliaSet.range[0] * 2)) - juliaSet.range[0],
			im = -(
				evt.layerY / (juliaSet.scale[1] / (juliaSet.range[1] * 2)) -
				juliaSet.range[1]
			);
		draw(re, im);
	}
}

shift.addEventListener("input", function () {
	juliaSet.shift = Number(shift.value);
	shiftOut.innerHTML = juliaSet.shift + "°";
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.shift, juliaSet.shift / 360);
	draw(juliaSet.c[0], juliaSet.c[1]);
});

reInput.addEventListener("input", function () {
	juliaSet.c[0] = Number(reInput.value);
	draw(juliaSet.c[0], juliaSet.c[1], false);
});

imInput.addEventListener("input", function () {
	juliaSet.c[1] = Number(imInput.value);
	draw(juliaSet.c[0], juliaSet.c[1], false);
});

smoothen.addEventListener("input", function () {
	juliaSet.smoothen = Number(smoothen.checked);
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.smoothen, juliaSet.smoothen);
	draw(juliaSet.c[0], juliaSet.c[1]);
});

power.addEventListener("input", function () {
	juliaSet.pw = Number(power.value);
	if (juliaSet.pw != 2) {
		// no smoothing algorithem has implemented for powers other than 2
		smoothen.disabled = true;
		smoothen.checked = false;
		juliaSet.smoothen = false;
	} else {
		smoothen.disabled = false;
	}
	constructProgram();
});

function constructProgram() {
	let setup_loop = `
	precision highp float;
	attribute vec2 position;
	varying lowp vec3 color;
	uniform vec2 c;
	uniform lowp float shift;
	uniform bool smoothen;
	uniform vec2 range;
	const float MAX_ITERATIONS = ${juliaSet.MAX_ITERATIONS}.0;
	void main () {
		vec2 z = position;
		float iteration = 0.0;
		gl_Position = vec4(z / range, 0, 1);
		for (float i = 1.0; i < MAX_ITERATIONS; i++) {
	`,
		function_ = juliaSet.power[juliaSet.pw],
		boundryChecker = `
		if (dot(z, z) > ${juliaSet.pw ** 2}.0) {
			iteration = float(i);
			break;
		}`,
		plotSmoother = `
		}
		if (iteration < MAX_ITERATIONS && smoothen) {
			float log2 = log(2.0);
			iteration = iteration + 1.0
					- log(log(dot(z, z)) / log2 / 2.0) / log2;
		}`,
		coloring = `
			float col = iteration / MAX_ITERATIONS + shift;
			if (iteration > 0.0) color = vec3(col, 1.0, 0.5);
			else color = vec3(col, 0, 0);
			gl_PointSize = 1.0;
		}`;

	juliaSet.program = juliaSet.GL.createCustomProgram({
		vertex:
			setup_loop +
			function_ +
			boundryChecker +
			(juliaSet.pw == 2 ? plotSmoother : "}") +
			coloring,
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
	juliaSet.GL.useProgram(juliaSet.program);
	juliaSet.GL.putBufferData(juliaSet.points);
	juliaSet.GL.attribUsage(juliaSet.program.attributes.position, 2);
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.shift, juliaSet.shift);
	juliaSet.gl.uniform1f(juliaSet.program.uniforms.smoothen, juliaSet.smoothen);
	juliaSet.gl.uniform2fv(juliaSet.program.uniforms.range, juliaSet.range);
	draw(juliaSet.c[0], juliaSet.c[1]);
}
