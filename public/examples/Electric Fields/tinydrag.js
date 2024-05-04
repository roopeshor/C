let mousedown = false,
	/** @type {number} */
	targetNodeIndex = -1;

/**
 * Make given set of points draggable.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Array.<{
 *	 x: number,
 *	 y: number,
 *	 radius: number,
 *	 event: Function
 * }>} points
 * @param {Function} [options.onDrag] when a point is being dragged
 * @param {Function} [options.onSelectionOut] when user clicks on none of the points
 * @param {Function} [options.onSelect] when user clicks on a point
 */
window["tinyDrag"] = function tinyDrag(context, points, options) {
	options = options || {};
	let canvas = context.canvas;
	canvas.addEventListener("mousedown", start);
	document.addEventListener("mouseup", end);
	canvas.addEventListener("mousemove", move);

	canvas.addEventListener("touchstart", start);
	document.addEventListener("touchend", end);
	canvas.addEventListener("touchmove", move);
	function start(e) {
		e.preventDefault();
		let x = e.changedTouches[0].pageX,
			y = e.changedTouches[1].pageY,
			tr = context.getTransform(),
			translateX = tr.e,
			translateY = tr.f,
			scaleX = tr.a,
			scaleY = tr.d,
			targetIndex = -1,
			dist = Infinity,
			defaultR2 = (10 / scaleX) ** 2;
		console.log(x, y);
		x = (x - translateX) / scaleX;
		y = (y - translateY) / scaleY;
		mousedown = true;

		for (let i = 0; i < points.length; i++) {
			let point = points[i],
				radius2 = point.radius * point.radius || defaultR2,
				d = (x - point.x) ** 2 + (y - point.y) ** 2;
			if (d <= radius2 && d < dist) {
				targetIndex = i;
				dist = d;
			}
		}
		targetNodeIndex = targetIndex;
		if (targetIndex == -1 && typeof options.onSelectionOut == "function")
			options.onSelectionOut();
		else if (typeof options.onSelect == "function") options.onSelect(targetIndex);
	}
	function move(e) {
		if (mousedown && targetNodeIndex > -1) {
			let node = points[targetNodeIndex],
				tr = context.getTransform(),
				translateX = tr.e,
				translateY = tr.f,
				scaleX = tr.a,
				scaleY = tr.d;
			node.x = e.offsetX - translateX;
			node.y = e.offsetY - translateY;
			// run common events
			if (typeof options.onDrag == "function") {
				options.onDrag(targetNodeIndex);
			}
			// run pointwise event
			if (typeof node.event == "function") {
				node.event(e);
			}
		}
	}
	function end(e) {
		mousedown = false;
		targetNodeIndex = -1;
	}
};
