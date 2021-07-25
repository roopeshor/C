/* eslint-disable no-undef */

import { background } from "../../src/settings.js";

C (()=>{
	initBlackboardCanvas();
	const a = axes();
	var time = 0;
	// for (var i = 0; i < 10; i++) {
		background(0);
		var t1 = Date.now();
		a.getHeatPlot({
			plotFunction: (x, y) => Math.sin(x) + Math.cos(y) * 3,
		});
		time += Date.now() - t1;
	// }
	console.log(time/10);
}, ".simple", {
	width: 300,
	height: 300,
});
