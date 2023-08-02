let _typeof = (o) => Object.prototype.toString.call([]).replace(/(\[object |\])/g, "");
/**
 * Tests given function against set of data
 * data scheme:
 * ```js
 * [
 * 	{
 * 	args: [1, true],
 * 	expect: [1,1,1,1],
 * 	},
 * {
 * 	args: [255, 100],
 * 	expect: "rgba(255,100,0,1)",
 * 	},
 * ...
 * ]
 * ```
 * @param {Function} fx
 * @param {Array<Object>} data
 * @param {number} [count=1]
 * @returns {Object}
 */
export function test(fx, data, count = 1) {
	let testResult = {
		tests: [],
		avgTime: 0,
		totalExec: 0,
		succesfulExec: 0,
	};
	for (let k = 0; k < count; k++) {
		for (let i = 0; i < data.length; i++) {
			let result,
				time,
				functionExecuted = true,
				checkData;
			try {
				time = performance.now();
				result = fx(...data[i].args);
				time = performance.now() - time;
			} catch (err) {
				result = err;
				functionExecuted = false;
			}
			testResult.totalExec++;
			if (functionExecuted) {
				testResult.avgTime += time;
				testResult.succesfulExec++;
				checkData = check(result, data[i].expect);
			}
			testResult.tests.push({
				result,
				time,
				checkData,
			});
		}
	}
	testResult.avgTime /= testResult.succesfulExec;
	return testResult;
}

function check(result, data) {
	let checkData = [],
		mismatch = 0;
	if (_typeof(result) == "Array") {
		if (data.length != result.length) {
			checkData.push({
				message: "Array length missmatch",
			});
		}
		let l = Math.min(data.length, result.length);
		for (let i = 0; i < l; i++) {
			checkData.push(equal(data[i], result[i]));
		}
	} else {
		let e = equal(result, data);
		checkData.push(e[0]);
	}

	function equal(r, d) {
		let equal = r == d;
		let dequal = r === d;
		mismatch += !(equal && dequal);
		return [
			{
				equal,
				dequal,
			},
		];
	}
	return {
		checkData,
		mismatch,
	};
}
