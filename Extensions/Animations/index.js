import { animateFill } from "./constructs.js";

(function () {
	if (window["C"] && typeof window["C"].addExtension == "function") {
		let C = window["C"];
		let counter = { wait: 0 };
		const type = (a) => Object.prototype.toString.call(a).slice(8, -1);
		C.addExtension({
			/**
			 * Wait for a given time in milliseconds.
			 *
			 * @param {number} time time in milliseconds
			 * @param {string} canvasName canvas name
			 */
			wait: function (time, canvasName, name) {
				canvasName = C.workingContext.name || canvasName;
				loop(
					name || "wait-" + counter.wait++,
					(elapsed) => {
						if (elapsed >= time) noLoop(canvasName, elapsed);
					},
					canvasName,
					time,
					500,
					{},
					time
				);
			},
			showCreation: function () {
				let animations = Array.prototype.slice.call(arguments);
				for (let i = 0; i < animations.length; i++) {
					let animation = animations[i];
					if (type(animation) == "Object") {
						let dur = animation.dur || 2000,
							ctx = animation.canvas || C.workingContext,
							next = animation.next || null,
							name = animation.name,
							dTime = animation.dTime || 14,
							points = animation.points,
							closed = animation.closed || false,
							tension = animation.tension || 1,
							smoothen = animation.smoothen == undefined ? true : animation.smoothen,
							rateFunction = animation.rateFunction || smooth,
							syncWithTime = animation.syncWithTime || false,
							t = 0,
							dt = dTime / dur,
							len = points.length - 1;
						if (ctx.lineWidth > 0 && ctx.doStroke) {
							if (typeof animation.draw != "function") {
								if (smoothen) {
									loop(
										name,
										(elapsed) => {
											if (t > 1) {
												noLoop(ctx.name, elapsed);
											}
											let i = Math.round(len * rateFunction(t)),
												ip1 = Math.round(len * rateFunction(t + dt)),
												ip2 = Math.round(len * rateFunction(t + dt * 2));
											if (closed) {
												i %= len;
												ip1 %= len;
												ip2 %= len;
											}
											let recentPoint =
													points[Math.round(len * rateFunction(t - dt))] ||
													points[len - Math.abs(Math.round(len * rateFunction(t - dt)))],
												currentPoint = points[i],
												nextPoint = points[ip1],
												secondNextPoint = points[ip2],
												cp = getBezierControlPoints(
													recentPoint,
													currentPoint,
													nextPoint,
													secondNextPoint,
													tension
												);
											ctx.beginPath();
											if (closed)
												ctx.moveTo(...points[Math.abs(Math.round(len * rateFunction(t)) % len)]);
											else ctx.moveTo(...points[Math.round(len * rateFunction(t))]);

											ctx.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
											if (ctx.doStroke) ctx.stroke();
											ctx.closePath();
											if (!syncWithTime) t += dt;
											else t = elapsed / dur;
										},
										ctx.name,
										dTime,
										50,
										{},
										dur
									);
								} else {
									loop(
										name,
										(elapsed) => {
											if (t > 1) {
												noLoop(ctx.name, elapsed);
											} else if (t == 0) {
												ctx.beginPath();
												ctx.moveTo(...points[Math.abs(Math.round(len * rateFunction(0)))]);
											}
											let currentPoint = points[Math.round(len * rateFunction(t)) % len];
											ctx.lineTo(currentPoint[0], currentPoint[1]);
											if (ctx.doStroke) ctx.stroke();
											if (!syncWithTime) t += dt;
											else t = elapsed / dur;
										},
										ctx.name,
										dTime,
										50,
										{},
										dur
									);
								}
							} else {
								animation.draw();
							}
						}
						if (closed && animation.fill) {
							animateFill(
								name,
								ctx.name,
								animation.fill,
								animation.filler,
								animation.fillTime,
								10,
								next
							);
						}
					} else {
						throw new Error(
							i +
								1 +
								(i == 0 ? "st" : i == 1 ? "nd" : i == 2 ? "rd" : "th") +
								" argument provided is not a object."
						);
					}
				}
			},
		});
	}
})();
