import { CENTER, RIGHT } from "../constants/drawing.js";
import { C } from "../main.js";

/**
 * Renders the input tex into a HTMLImageElement
 *
 * @param {string} input
 * @return {HTMLImageElement}
 */
function getImageFromTex(input) {
	if (
		!(typeof window["MathJax"] == "object" && typeof window["MathJax"]["tex2svg"] == "function")
	) {
		throw new Error("MathJax is not found. Please include it.");
	}
	let ctx = C.workingContext,
		svgOutput = window["MathJax"].tex2svg(input).getElementsByTagName("svg")[0],
		g = svgOutput.getElementsByTagName("g")[0];
	svgOutput.style.verticalAlign = "1ex";
	svgOutput.style.fontSize = parseFloat(ctx.font) + "px";
	g.setAttribute("stroke", ctx.strokeStyle);
	g.setAttribute("fill", ctx.fillStyle);
	let outerHTML = svgOutput.outerHTML,
		blob = new Blob([outerHTML], { type: "image/svg+xml;charset=utf-8" }),
		URL = window.URL || window.webkitURL,
		blobURL = URL.createObjectURL(blob),
		image = new Image();
	image.src = blobURL;
	return image;
}

/**
 * Draws tex inputs
 *
 * @param {string} input
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {HTMLImageElement} image representation of tex
 */
function tex(input, x, y) {
	let image = getImageFromTex(input),
		ctx = C.workingContext,
		text_align = ctx.textAlign,
		text_baseline = ctx.textBaseline;
	image.onload = function () {
		ctx.save();
		let { width, height } = image;
		// translating the image according to text-align and text-baseline
		switch (text_align) {
			case CENTER:
				ctx.translate(-width / 2, 0);
				break;
			case RIGHT:
				ctx.translate(-width, 0);
				break;
			default:
				break;
		}
		switch (text_baseline) {
			case "middle":
				ctx.translate(0, height / 2);
				break;
			case "bottom":
				ctx.translate(0, height);
				break;
			default:
				break;
		}
		// invert axis first
		if (ctx.yAxisInverted) {
			ctx.scale(1, -1);
			y *= -1;
		}
		ctx.drawImage(image, x || 0, y || 0);
		ctx.restore();
	};
	return image;
}

export { tex, getImageFromTex };
