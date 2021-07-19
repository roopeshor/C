function arange(start, end, step, rev = false) {
	const arr = [];
	if (rev) for (let i = end; i >= start; i -= step) arr.push(i);
	else for (let i = start; i <= end; i += step) arr.push(i);
	return arr;
}

function applyDefault(_default, target = {}) {
	for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
		const prop = keys[i];
		const objType = _default[prop][1];
		if (
			(objType === "number" && isNaN(target[prop])) ||
			(objType === "array" && !Array.isArray(target[prop])) ||
			target[prop] === undefined ||
			target[prop] === null
		) {
			target[prop] = _default[prop][0];
		}
	}
	return target;
}

export {
	arange,
	applyDefault,
};
