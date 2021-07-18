import { CENTER, RIGHT } from "../constants/drawing.js";
import { C } from "../main.js";

/**
 * Renders the input tex into a HTMLImageElement
 *
 * @param {string} input
 * @return {HTMLImageElement}
 */
function getImgageFromTex(input) {
	if (
		typeof window.MathJax == "object" &&
		typeof window.MathJax.tex2svg == "function"
	) {
		const ctx = C.workingCanvas;
		// eslint-disable-next-line no-undef
		const svgOutput = MathJax.tex2svg(input).getElementsByTagName("svg")[0];
		const g = svgOutput.getElementsByTagName("g")[0];
		svgOutput.style.verticalAlign = "1ex";
		g.setAttribute("stroke", ctx.strokeStyle);
		g.setAttribute("fill", ctx.fillStyle);
		let outerHTML = svgOutput.outerHTML,
			blob = new Blob([outerHTML], { type: "image/svg+xml;charset=utf-8" });
		let URL = window.URL || window.webkitURL || window;
		let blobURL = URL.createObjectURL(blob);
		let image = new Image();
		image.src = blobURL;
		return image;
	} else {
		console.error("MathJax is not found. Please include");
	}
}

/**
 * Draws tex inputs
 *
 * @param {string} input
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {HTMLImageElement} image representation of tex
 */
function tex(input, x = 0, y = 0) {
	const image = getImgageFromTex(input);
	const ctx = C.workingCanvas;
	const text_align = ctx.textAlign,
		text_baseline = ctx.textBaseline;
	image.onload = function () {
		ctx.save();
		const { width, height } = image;
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
		ctx.scale(1, -1);
		ctx.drawImage(image, x, -y);
		ctx.restore();
	};
	return image;
}

export {
	tex,
	getImgageFromTex
};
