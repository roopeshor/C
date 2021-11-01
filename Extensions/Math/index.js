(function () {
	if (window["C"] && typeof window["C"].addExtension == "function") {
		let C = window["C"];
		C.addExtension({
			/**
			 * Inverts y-axis
			 */
			invertYAxis: function () {
				let ctx = C.workingContext;
				ctx.scale(1, -1);
				ctx.yAxisInverted = !ctx.yAxisInverted;
			},

			/**
			 * translates canvas to center
			 */
			centreCanvas: function () {
				let ctx = C.workingContext;
				ctx.translate(ctx.width / 2, ctx.height / 2);
			},
		});
	}
})();
