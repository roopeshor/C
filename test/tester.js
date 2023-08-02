let _typeof = (o) => Object.prototype.toString.call(o).replace(/(\[object |\])/g, "");
let _isStruct = (o) => _typeof(o) == "Array" || _typeof(o) == "Object";
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
			let functionOutput,
				execTime,
				functionExecuted = true,
				status,
				message,
				functionArgs = data[i].args;
			try {
				execTime = performance.now();
				functionOutput = fx(...functionArgs);
				execTime = performance.now() - execTime;
			} catch (err) {
				functionOutput = null;
				functionExecuted = false;
				status = "fail";
				message = err;
			}
			testResult.totalExec++;
			if (functionExecuted) {
				testResult.avgTime += execTime;
				testResult.succesfulExec++;
				let c = check(functionOutput, data[i].expect);
				status = c.status;
				message = c.message;
			}
			testResult.tests.push({
				functionArgs,
				functionOutput,
				functionExecuted,
				execTime,
				status,
				message,
			});
		}
	}
	testResult.avgTime /= testResult.succesfulExec;
	return testResult;
}

function check(result, data) {
	let status = "pass",
		message = "";
	if (_typeof(result) == "Array" || _typeof(result) == "Object") {
		if (JSON.stringify(result) !== JSON.stringify(data)) {
			status = "fail";
			message = `${_typeof(result)} mismatch! expected: ` + format(data, "    ", "    ");
		}
	} else {
		if (result !== data) {
			status = "fail";
			message = "Value mismatch! expected: " + data;
		}
	}
	return {
		status,
		message,
	};
}

/**
 * Wrapper around {@link test}. Prints results to console.
 *
 * @param {Function} fx
 * @param {string} file
 * @param {Array<Object>} data
 * @param {number} [count=1]
 * @returns {Object}
 */
export function testFunction(fx, file, data, count = 1, printArray = false) {
	let results = test(fx, data, count);
	let { functionExecuted, avgTime, succesfulExec, totalExec, tests } = results;
	console.log(`Testing ${file}/${fx.name}`);
	for (let i = 0; i < tests.length; i++) {
		let test = tests[i];
		let { functionArgs, functionOutput, functionExecuted, execTime, status, message } = test;
		let _out = format(functionOutput),
			outputType = _typeof(functionOutput),
			passed = status == "pass";

		let fxlog = !passed
			? `\x1b[37m${fx.name}(\x1b[36m${functionArgs}\x1b[37m)`
			: `${fx.name}(${functionArgs})`;
		let icon = passed ? "\x1b[32m✔️" : "\x1b[31m❌";
		let logMessage = `${icon} ${execTime.toFixed(3)}ms | test ${i} ${status}: ${fxlog} -> ${
			outputType == "Array" || outputType == "Object"
				? printArray || !passed
					? _out
					: `<${outputType}[${Object.keys(functionOutput).length}]>`
				: _out
		}${!passed ? "\n" + message + "\n" : ""}\x1b[37m`;
		console.log(logMessage);
	}
}

function format(data, intent = "    ", initial = "    ") {
	let output = ``;
	if (_typeof(data) == "Array") {
		output = "[";
		for (let a of data) {
			if (_typeof(a) == "String") a = "\x1b[33m" + a
			else if (_typeof(a) == "Number") a = "\x1b[36m" + a
			output += a + "\x1b[37m, ";
		}
		output = output.substring(0, output.length - 2) + "]";
	} else if (_typeof(data) == "Object") {
		output = "{\n";
		for (let k of Object.keys(data)) {
			output += initial + intent + k + ": ";
			if (_isStruct(data[k])) output += format(data[k], intent, initial + intent) + ",\n";
			else if (_typeof(data[k]) == "String") output += '\x1b[33m"' + data[k] + '"\x1b[37m,\n';
			else output += "\x1b[36m" + data[k] + "\x1b[37m,\n";
		}
		output += initial + "}";
	} else {
		output = initial + JSON.stringify(data);
	}
	return output;
}
