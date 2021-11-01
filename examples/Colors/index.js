import { linearGradient } from "../../src/color/gradients.js";
import * as COLORLIST from "../../src/constants/colors.js";
import { C } from "../../src/main.js";
import { rect } from "../../src/objects/geometry.js";
import { text } from "../../src/objects/text.js";
import {
	background,
	fill,
	fontSize,
	measureText,
	noFill,
	stroke,
	translate
} from "../../src/settings.js";
const W = 780;

C(
	function () {
		background(0);
		let w = 120;
		const h = 50;
		let paddingX = 10;
		const paddingY = 30;
		let boxW = w * 6 + paddingX * 2;
		let boxH = h * 8 + paddingY * 2;

		fontSize("19px");
		// fontFamily("CMU Serif")
		translate((W - boxW) / 2, 20);
		// debugger;
		function box(name, k) {
			// background
			if (name === "BLACK") stroke(white);
			rect(100 + k * w, 0, w, h);
			fill(black);

			// name of color
			if (name === "BLACK") fill(white);
			text(name, 100 + k * w + 7, h - 18);
			stroke(black);
		}
		function set1() {
			// first set of colors
			const colors = [
				["BLUE_A", "BLUE_B", "BLUE", "BLUE_D", "BLUE_E"],
				["TEAL_A", "TEAL_B", "TEAL", "TEAL_D", "TEAL_E"],
				["GREEN_A", "GREEN_B", "GREEN", "GREEN_D", "GREEN_E"],
				["YELLOW_A", "YELLOW_B", "YELLOW", "YELLOW_D", "YELLOW_E"],
				["GOLD_A", "GOLD_B", "GOLD", "GOLD_D", "GOLD_E"],
				["RED_A", "RED_B", "RED", "RED_D", "RED_E"],
				["MAROON_A", "MAROON_B", "MAROON", "MAROON_D", "MAROON_E"],
				["PURPLE_A", "PURPLE_B", "PURPLE", "PURPLE_D", "PURPLE_E"],
			];
			const stopNames = [
				"Blue",
				"Teal",
				"Green",
				"Yellow",
				"Gold",
				"Red",
				"Maroon",
				"Purple",
			];
			const colorIntensities = ["A", "B", "C", "D", "E"];

			noFill();
			stroke(Manim.BLUE);
			rect(0, 0, boxW, boxH);
			stroke(black);
			translate(paddingX, paddingY);
			fill(Manim.BLUE_A);
			for (let i = 0; i < colors.length; i++) {
				const col = colors[i];
				for (let k = 0; k < col.length; k++) {
					fill(Manim[col[k]]);

					// header
					if (!i) text(colorIntensities[k], 100 + k * w + 45, -7);

					// background
					rect(100 + k * w, 0, w, h);
					fill(COLORLIST.black);

					// name of color
					text(
						stopNames[i].toUpperCase() + "_" + colorIntensities[k],
						100 + k * w + 7,
						h - 18
					);
					col[k] = Manim[col[k]];
				}
				translate(0, h);
				// name of set
				const name = stopNames[i];
				// debugger;
				fill(linearGradient([0, 0], [measureText(name).width, 0], col));
				text(name, 0, -h / 2 + 5);
			}
		}

		function set2() {
			// second set
			w = 145;
			paddingX = 5;
			boxW = w * 5 + paddingX + 10;
			boxH = h * 4 + paddingY;
			fontSize(18);
			const colors = [
				["DARK_BLUE", "DARK_BROWN", "LIGHT_BROWN"],
				["LIGHT_GREY", "GREY", "DARK_GREY", "DARKER_GREY"],
				[
					"WHITE",
					"BLACK",
					"GREY_BROWN",
					"PINK",
					"LIGHT_PINK",
					"GREEN_SCREEN",
					"ORANGE",
				],
			];
			const stopNames = ["Blue & Brown", "Grey shades", "Others"];
			const pd = 40; // a quick fix
			noFill();
			stroke(Manim.BLUE);
			rect(0, 0, boxW, boxH);
			stroke(black);
			translate(paddingX + pd, paddingY / 2);
			fill(Manim.BLUE_A);
			for (let i = 0, k = 0; i < colors.length; i++) {
				const col = colors[i];
				for (let k = 0; k < col.length; k++) {
					fill(Manim[col[k]]);
					if (k == 4) translate(-w * 4, h);
					box(col[k], k);
					col[k] = Manim[col[k]];
				}
				translate(0, h);

				// name of set
				fill(linearGradient([0, 0], [measureText(name).width, 0], col));
				if (k > 4) {
					translate(w * 4, -h);
					fill(white);
				}
				var name = stopNames[i];
				text(name, -pd + 3, -h / 2 + 5);
			}
		}
		set1();
		translate(-paddingX, paddingY * 1.5);
		set2();
		// saveCanvas("Manim colors")
	},
	".display",
	{
		width: W,
		height: 740,
	}
);
