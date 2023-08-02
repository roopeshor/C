import { readColor } from "../src/color/color_reader.js";
import { test } from "./tester.js";

let data = {
	readColor: [
		{
			args: [100],
			expect: "rgba(100, 100, 100, 1)",
		},
		{
			args: [255, 200],
			expect: "rgba(255, 200, 0, 1)",
		},
		{
			args: [255, 200, 100],
			expect: "rgba(255, 200, 100, 1)",
		},
		{
			args: [290, 134, 50, 0.6],
			expect: "rgba(290, 134, 50, 0.6)",
		},
		{
			args: ["#f3d"],
			expect: "rgba(255, 51, 221, 1)",
		},
		{
			args: ["#fa054f"],
			expect: "rgba(250, 5, 79, 1)",
		},
		{
			args: ["#fa054fa0"],
			expect: "rgba(250, 5, 79, 0.6274509803921569)",
		},
		{
			args: [255, 200, 100, true],
			expect: [255, 200, 100, 1],
		},
		{
			args: ["#f3da", true],
			expect: [255, 51, 221, 0.0392156862745098],
		},
	],
};
console.log(test(readColor, data.readColor, 1));
