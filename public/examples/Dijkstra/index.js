import {
	Colors,
	background,
	fill,
	fontFamily,
	fontSize,
	invertYAxis,
	line,
	point,
	polarPlane,
	scale,
	stroke,
	strokeWidth,
	text,
	textAlign,
	textBaseline,
	translate,
} from "../../../src/c.js";
import { C } from "../../../src/main.js";

var nodes = {
	a: {
		x: 2,
		y: -2,
		rel: ["b", "c"],
	},
	b: {
		x: 4,
		y: 2,
		rel: ["c"],
	},
	c: {
		x: 3,
		y: 4,
		rel: ["d"],
	},
	d: {
		x: -4,
		y: -2,
		rel: ["a"],
	},
	e: {
		x: -4,
		y: 4,
		rel: ["c", "f"],
	},
	f: {
		x: -1,
		y: -1,
		rel: ["d"],
	},
	g: {
		x: 0,
		y: -4,
		rel: ["d", "f"],
	},
};

C(
	() => {
		background(0);
		translate(CENTERX, CENTERY);
		invertYAxis();
		scale(0.9);
		let settings = polarPlane({
			includeLabels: false,
			azimuthUnit: "degrees",
			fadedLines: 2,
		});
		settings.scaleCanvas();
		fontSize(0.4);
		textAlign("center");
		textBaseline("middle");
		fontFamily("Sans");

		drawEdges();
		tracePath(["a", "b", "c", "d", "f", "g"]);
		drawNodes();
	},
	".cvs",
	{
		width: 500,
		height: 500,
	},
);

function drawNodes() {
	for (let node in nodes) {
		fill(Colors.orange);
		point(nodes[node].x, nodes[node].y, 0.7);
		fill(Colors.black);
		text(node, nodes[node].x, nodes[node].y + 0.14, 100);
	}
}

function drawEdges() {
	strokeWidth(0.03);
	stroke(Colors.aliceblue);
	for (let node in nodes) {
		let thisNode = nodes[node];
		let rels = thisNode.rel;
		for (let rel of rels) {
			let relNode = nodes[rel];
			line(thisNode.x, thisNode.y, relNode.x, relNode.y);
		}
	}
}

function tracePath(path, color = Colors.limegreen) {
	stroke(color);
	strokeWidth(0.05);
	let thisNode = nodes[path[0]];
	for (let i = 1; i < path.length; i++) {
		let currNode = nodes[path[i]];
		line(thisNode.x, thisNode.y, currNode.x, currNode.y);
		thisNode = currNode;
	}
}
