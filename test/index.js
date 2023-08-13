import { readColor } from "../src/color/color_reader.js";
import { lerpColorArray } from "../src/objects/functions.js";
import { testFunction } from "./tester.js";
let col = {
		"-5": "#b36e38b0",
		"-3": "#ff9c52b0",
		"-1": "#ffcea9b0",
		0: "#dcdcddb0",
		1: "#9fcaedb0",
		3: "#3d96dab0",
		5: "#2b6b99b0",
	},
	srt = Object.keys(col).sort();

let data = [
	{
		fx: readColor,
		path: "color/color_reader",
		tests: [
			{
				args: [100],
				expect: {
					rgbaA: [100, 100, 100, 1],
					rgba: "rgba(100, 100, 100, 1)",
					hex6: "#646464",
					hex8: "#646464ff",
					hex: "#646464ff",
					hsl: "hsl(100, 100, 100)",
				},
			},

			{
				args: [255, 200],
				expect: {
					rgbaA: [255, 200, 0, 1],
					rgba: "rgba(255, 200, 0, 1)",
					hex6: "#ffc800",
					hex8: "#ffc800ff",
					hex: "#ffc800ff",
					hsl: "hsl(255, 200, 0)",
				},
			},

			{
				args: [255, 200, 100],
				expect: {
					rgbaA: [255, 200, 100, 1],
					rgba: "rgba(255, 200, 100, 1)",
					hex6: "#ffc864",
					hex8: "#ffc864ff",
					hex: "#ffc864ff",
					hsl: "hsl(255, 200, 100)",
				},
			},

			{
				args: [290, 134, 50, 0.6],
				expect: {
					rgbaA: [290, 134, 50, 0.6],
					rgba: "rgba(290, 134, 50, 0.6)",
					hex6: "#1228632",
					hex8: "#122863299",
					hex: "#122863299",
					hsl: "hsl(290, 134, 50)",
				},
			},

			{
				args: ["#f3d"],
				expect: {
					rgbaA: [255, 51, 221, 1],
					rgba: "rgba(255, 51, 221, 1)",
					hex6: "#ff33dd",
					hex8: "#ff33ddff",
					hex: "#ff33ddff",
					hsl: "hsl(255, 51, 221)",
				},
			},

			{
				args: ["#fa054f"],
				expect: {
					rgbaA: [250, 5, 79, 1],
					rgba: "rgba(250, 5, 79, 1)",
					hex6: "#fa054f",
					hex8: "#fa054fff",
					hex: "#fa054fff",
					hsl: "hsl(250, 5, 79)",
				},
			},

			{
				args: ["#fa054fa0"],
				expect: {
					rgbaA: [250, 5, 79, 0.6274509803921569],
					rgba: "rgba(250, 5, 79, 0.6274509803921569)",
					hex6: "#fa054f",
					hex8: "#fa054fa0",
					hex: "#fa054fa0",
					hsl: "hsl(250, 5, 79)",
				},
			},

			{
				args: [255, 200, 100, true],
				expect: {
					rgbaA: [255, 200, 100, true],
					rgba: "rgba(255, 200, 100, true)",
					hex6: "#ffc864",
					hex8: "#ffc864ff",
					hex: "#ffc864ff",
					hsl: "hsl(255, 200, 100)",
				},
			},
			{
				args: ["#f3da", true],
				expect: {
					rgbaA: [255, 51, 221, 0.6666666666666666],
					rgba: "rgba(255, 51, 221, 0.6666666666666666)",
					hex6: "#ff33dd",
					hex8: "#ff33ddaa",
					hex: "#ff33ddaa",
					hsl: "hsl(255, 51, 221)",
				},
			},
			{
				args: ["bisque"],
				expect: {
					rgbaA: [255, 228, 196, 1],
					rgba: "rgba(255, 228, 196, 1)",
					hex6: "#ffe4c4",
					hex8: "#ffe4c4ff",
					hex: "#ffe4c4ff",
					hsl: "hsl(255, 228, 196)",
				},
			},
			{
				args: ["darkblue"],
				expect: {
					rgbaA: [0, 0, 139, 1],
					rgba: "rgba(0, 0, 139, 1)",
					hex6: "#00008b",
					hex8: "#00008bff",
					hex: "#00008bff",
					hsl: "hsl(0, 0, 139)",
				},
			},
		],
	},
	{
		fx: lerpColorArray,
		path: "objects/functions.js",
		tests: [
			{
				args: [-5, 5, col, -5, srt],
				expect: "rgba(179,110,56,0.6901960784313725)",
			},
			{
				args: [3, 5, col, -5, srt],
				expect: "rgba(61,150,218,0.6901960784313725)",
			},
			{
				args: [-2, 5, col, -5, srt],
				expect: "rgba(204,176,155,0.6901960784313725)",
			},
			{
				args: [0, 5, col, -5, srt],
				expect: "rgba(220,220,221,0.6901960784313725)",
			},
			{
				args: [5, 5, col, -5, srt],
				expect: "rgba(43,107,153,0.6901960784313725)",
			},
			{
				args: [2, 5, col, -5, srt],
				expect: "rgba(110,176,228,0.6901960784313725)",
			},
			{
				args: [4, 5, col, -5, srt],
				expect: "rgba(52,129,186,0.6901960784313725)",
			},
			{
				args: [-4, 5, col, -5, srt],
				expect: "rgba(187,132,89,0.6901960784313725)",
			},
			{
				args: [-4.2, 5, col, -5, srt],
				expect: "rgba(186,128,82,0.6901960784313725)",
			},
			{
				args: [-3.2, 5, col, -5, srt],
				expect: "rgba(194,150,115,0.6901960784313725)",
			},
			{
				args: [-1.2, 5, col, -5, srt],
				expect: "rgba(210,194,181,0.6901960784313725)",
			},
			{
				args: [-1.2, 5, col, -5, srt],
				expect: "rgba(210,194,181,0.6901960784313725)",
			},
			{
				args: [-0.023, 5, col, -5, srt],
				expect: "rgba(220,219,220,0.6901960784313725)",
			},
			{
				args: [-0.23, 5, col, -5, srt],
				expect: "rgba(218,215,213,0.6901960784313725)",
			},
			{
				args: [-0.023, 5, col, -5, srt],
				expect: "rgba(220,219,220,0.6901960784313725)",
			},
			{
				args: [-Math.PI, 5, col, -5, srt],
				expect: "rgba(194,151,117,0.6901960784313725)",
			},
			{
				args: [Math.PI, 5, col, -5, srt],
				expect: "rgba(60,147,213,0.6901960784313725)",
			},
			{
				args: [Math.PI / 2, 5, col, -5, srt],
				expect: "rgba(131,187,232,0.6901960784313725)",
			},
			{
				args: [Math.E, 5, col, -5, srt],
				expect: "rgba(75,157,221,0.6901960784313725)",
			},
		],
	},
];

// for (let t of data.readColor) {
// 	console.log(JSON.stringify(t.args), JSON.stringify(readColor(...t.args)));
// }
testFunction(data[1].fx, data[1].path, data[1].tests, 30);
