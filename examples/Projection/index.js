import { DEG } from "../../src/constants/math.js";
import { C } from "../../src/main.js";
import { cos, sin } from "../../src/math/functions.js";
import { line, point } from "../../src/objects/geometry.js";
import {
  background,
  loop,
	stroke,
	translate
} from "../../src/settings.js";
const W = 400;
const H = 400;

C(
	() => {
		background(0);
		translate(CENTERX, CENTERY);
		stroke("yellow")
		var vertex = [
			[-50, -50, -50],
			[50, -50, -50],
			[50, 50, -50],
			[-50, 50, -50],

			[-50, 50, 50],
			[-50, -50, 50],
			[50, -50, 50],
			[50, 50, 50],
		];
		var edges = [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0],

			[0, 5],
			[1, 6],
			[2, 7],
			[3, 4],

			[4, 5],
			[5, 6],
			[6, 7],
			[7, 4],
		];
		function rotateX(points, theta) {
			let sinTheta = sin(theta);
			let cosTheta = cos(theta);
			let _points = [];
			for (let pt of points) {
				let y = pt[1];
				let z = pt[2];
				_points.push([
					pt[0],
					y * cosTheta - z * sinTheta,
					z * cosTheta + y * sinTheta,
				]);
			}
			return _points;
		}

		function rotateZ(points, theta) {
			let sinTheta = sin(theta);
			let cosTheta = cos(theta);
			let _points = [];
			for (let pt of points) {
				let x = pt[0];
				let y = pt[1];
				_points.push([
					x * cosTheta - y * sinTheta,
					y * cosTheta + x * sinTheta,
					pt[2],
				]);
			}
			return _points;
		}

		function rotateY(points, theta) {
			var sinTheta = sin(theta);
			var cosTheta = cos(theta);
			let _points = [];
			for (var pt of points) {
				var x = pt[0];
				var z = pt[2];
				_points.push([
					x * cosTheta + z * sinTheta,
					pt[1],
					z * cosTheta - x * sinTheta,
				]);
			}
			return _points;
		}

		let phi = 0, theta = 0, eps = 0;
		loop(() => {
			background(0);
			phi += 1 * DEG;
			theta += 1 * DEG;
			eps += 1 * DEG;
			var vert = rotateZ(vertex, phi);
			vert = rotateY(vert, theta);
			vert = rotateX(vert, eps);
			for (let pt of vert) point(pt[0], pt[1], 10);
			for (var edge of edges) {
				let v1 = edge[0],
					v2 = edge[1];
				line(vert[v1][0], vert[v1][1], vert[v2][0], vert[v2][1]);
			}
		});
	},
	".container",
	{
		width: W,
		height: H,
	}
);
