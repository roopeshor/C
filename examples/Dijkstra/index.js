import { Colors, fill, fontSize, invertXAxis, invertYAxis, line, numberPlane, point, scale, stroke, strokeWidth, text, textAlign, textBaseline } from "../../src/c.js";
import { C } from "../../src/main.js";

var nodes = {
	a: {
		x: 2,
		y: -2,
		rel: ['b', 'c'],
	},
	b: {
		x: 4,
		y: 2,
		rel: ['c'],
	},
	c: {
		x: 3,
		y: 4,
		rel: ['d'],
	},
	d: {
		x: -4,
		y: -2,
		rel: ['a'],
	},
}

C(
	() => {
		background(0);
		translate(CENTERX, CENTERY);
		invertYAxis();
		let settings = numberPlane({
			xAxis: {
				includeLabels: false,
				strokeColor: Colors.white + "88"
			},
			yAxis: {
				includeLabels: false,
				strokeColor: Colors.white + "88"
			},
			gridStrokeColor: Colors.aqua + "44"

		});

		settings.scaleCanvas()

		stroke(Colors.aliceblue);
		strokeWidth(.05);
		/// edges
		for (let node in nodes) {
			let thisNode = nodes[node];
			let rels = thisNode.rel;
			for (let rel of rels) {
				let relNode = nodes[rel];
				line(thisNode.x, thisNode.y, relNode.x, relNode.y);
			}
		}

		/// nodes
		fontSize(.4)
		textAlign("center");
		textBaseline("middle");
		for (let node in nodes) {
			fill(Colors.orange);
			point(nodes[node].x, nodes[node].y, .7);
			fill(Colors.black);
			text(node, nodes[node].x, nodes[node].y + 0.17)
		}


	},
	".cvs",
	{
		width: 500,
		height: 500
	}
);
