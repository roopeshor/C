let _typeof = (o) => Object.prototype.toString.call(o).replace(/(\[object |\])/g, "");
let isStruct = (dt) => dt == "Array" || dt == "Object";
let isString = (s) => _typeof(s) == "String";
let isNumber = (s) => _typeof(s) == "Number";
const WHITE = "\x1b[37m",
	GREEN = "\x1b[32m",
	RED = "\x1b[31m",
	BLUE = "\x1b[36m",
	YELLOW = "\x1b[33m";
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
export function test(fx, args, expect) {
	let output,
		execTime,
		functionExecuted = true,
		passed = true,
		message = "",
		errorIndexes = [];
	try {
		execTime = performance.now();
		output = fx(...args);
		execTime = performance.now() - execTime;
	} catch (err) {
		output = null;
		functionExecuted = false;
		passed = false;
		message = err;
	}
	if (functionExecuted) {
		let c = check(output, expect);
		passed = c.passed;
		message = c.message;
		message = c.message;
		errorIndexes = c.errorIndexes;
	}
	return {
		args,
		name: fx.name,
		output,
		functionExecuted,
		execTime,
		passed,
		message,
		errorIndexes,
	};
}

function check(result, data) {
	let passed = true,
		message = "",
		errorIndexes = [],
		resType = _typeof(result);
	if (resType == "Array" || resType == "Object") {
		if (JSON.stringify(result) !== JSON.stringify(data)) {
			passed = false;
			errorIndexes = detectMismatchedElement(result, data);
			message =
				`${resType} mismatch! expected: ` + format(data, resType, errorIndexes, "    ", "    ");
		}
	} else {
		if (result !== data) {
			passed = false;
			message = "Value mismatch! expected: " + data;
			errorIndexes = [-2]; // for singular values there isn't any index.
		}
	}
	return {
		passed,
		message,
		errorIndexes,
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
export function testFunction(fx, file, data, count = 1, printStructs = false) {
	let tests = [],
		avgTime = 0,
		totalExec = 0,
		succesfulExec = 0;
	console.log(`Testing ${file}/${fx.name}`);
	for (let k = 0; k < count; k++) {
		console.log("pass " + (k + 1));
		for (let i = 0; i < data.length; i++) {
			let result = test(fx, data[i].args, data[i].expect);
			console.log(generateReport(result, i, printStructs));

			tests.push(result);
			avgTime += result.execTime;
			succesfulExec += result.passed;
			totalExec++;
		}
	}
	avgTime /= succesfulExec;
	console.log(
		`${succesfulExec}/${totalExec} tests successfully finished
Average time: ${avgTime.toFixed(3)}ms`
	);
	return {
		tests,
		avgTime,
		totalExec,
		succesfulExec,
	};
}

function format(data, dataType, errorIndexes, intent = "    ", initial = "    ") {
	let formattedText = ``,
		hasMismatch = errorIndexes.length > 0;
	if (dataType == "Array") {
		formattedText = "[";

		for (let a of data) {
			if (hasMismatch)
				if (isString(a)) a = YELLOW + a;
				else if (isNumber(a)) a = BLUE + a;
			formattedText += a + WHITE + ", ";
		}
		formattedText = formattedText.substring(0, formattedText.length - 2) + "]";
	} else if (dataType == "Object") {
		formattedText = "{\n";

		for (let k of Object.keys(data)) {
			formattedText += initial + intent + k + ": ";
			if (isStruct(dataType)) {
				formattedText += format(data[k], _typeof(data[k]), [], intent, initial + intent) + ",\n";
			} else if (dataType == "String") {
				formattedText += YELLOW + '"' + data[k] + `"${WHITE},\n`;
			} else formattedText += BLUE + data[k] + WHITE + ",\n";
		}

		formattedText += initial + "}";
	} else {
		formattedText = initial + JSON.stringify(data);
	}
	return formattedText;
}

function generateReport(result, testIndex, printStructs) {
	let { name, args, output, execTime, passed, message, errorIndexes } = result;
	let outputType = _typeof(output),
		formattedOutput = format(
			output,
			outputType,
			errorIndexes,
			message.split(" ").splice(1, 2) == "mismatch"
		),
		status = passed ? "Passed" : "Failed";

	let formattedFunction = passed
		? name + `(${args})`
		: "(" + WHITE + name + BLUE + args + WHITE + ")";

	let icon = passed ? GREEN + "✔️" : RED + "❌";
	return `${icon} ${execTime.toFixed(3)}ms | test ${testIndex} ${status}: ${formattedFunction} -> ${
		isStruct(outputType) && (printStructs || !passed)
			? formattedOutput
			: `<${outputType}[${Object.keys(output).length}]>`
	}${passed ? "" : "\n\n" + message + "\n"}${WHITE}`;
}

function detectMismatchedElement(result, source) {
	let resKeys = Object.keys(result),
		srcKeys = Object.keys(source),
		mismatches = [];
	let l = Math.max(resKeys.length, srcKeys.length);
	for (let i = 0; i < l; i++) {
		resValue = JSON.stringify(result[resKeys[i]]);
		srcValue = JSON.stringify(source[srcKeys[i]]);
		if (resKeys != srcKeys) {
			mismatches.push(resKeys[i]);
		}
	}
	return mismatches;
}
