let _typeof = (o) => Object.prototype.toString.call(o).replace(/(\[object |\])/g, ""),
	_isStruct = (dt) => dt == "Array" || dt == "Object",
	isStruct = (o) => _isStruct(_typeof(o)),
	isString = (s) => _typeof(s) == "String",
	pruneLast2Chars = (s) => s.substring(0, s.length - 2);
const WHITE = "\x1b[37m",
	GREEN = "\x1b[32m",
	RED = "\x1b[31m",
	BLUE = "\x1b[36m",
	YELLOW = "\x1b[33m",
	BG_RED = "\x1b[41m",
	BG_WHITE = "\x1b[40m";

/**
 * Tests a function with a parameter against a expected output
 *
 * @param {Function} fx
 * @param {Array} args
 * @param {*} expect
 * @return {Object}
 */
function test(fx, args, expect) {
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

/**
 * Checks equivalency of two objects with JSON.stringify
 *
 * @param {*} result
 * @param {*} data
 * @return {Object}
 */
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
				`${resType} mismatch! expected: ` + format(data, errorIndexes, "    ", "    ");
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
 * Tests a function with given set of data and outputs them to console.
 * Data scheme:
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
 *
 * @param {Function} fx function to be tested
 * @param {string} file filepath in which function is situated
 * @param {Array} data Array of arguments and expected values
 * @param {number} [reruns=1] Number of times given test set to be run.
 * @param {boolean} [printStructs=false] Whether to print output arrays and objects as it is even if test has passed
 * @param {boolean} [printAllReruns=false] Whether to print all reruns
 * @return {Object}
 */
export function testFunction(
	fx,
	file,
	data,
	reruns = 1,
	printStructs = false,
	printAllReruns = false,
) {
	let tests = [],
		avgTime = 0,
		totalExec = 0,
		succesfulExec = 0;

	console.log(`Testing \x1b[94m${file}/${fx.name}`);

	for (let k = 0; k < reruns; k++) {
		console.log(WHITE + "pass " + (k + 1));

		for (let i = 0; i < data.length; i++) {
			let result = test(fx, data[i].args, data[i].expect);
			if (k < 1 || printAllReruns) {
				console.log(generateReport(result, i, printStructs));
			}
			tests.push(result);
			avgTime += result.execTime;
			succesfulExec += result.passed;
			totalExec++;
		}
		console.log("\n");
	}
	avgTime /= succesfulExec;

	console.log(`${succesfulExec}/${totalExec} tests successfully finished`);
	console.log(`Average time: ${avgTime.toFixed(3)}ms`);
	return {
		tests,
		avgTime,
		totalExec,
		succesfulExec,
	};
}

/**
 * Mainly used for formatting Arrays & json
 *
 * @param {*} data
 * @param {*} errorIndexes
 * @param {string} [intent="    "]
 * @param {string} [initial="    "]
 * @return {*}
 */
function format(data, errorIndexes, intent = "    ", initial = "    ") {
	let formattedText = "",
		dataType = _typeof(data);
	if (dataType == "Array") {
		formattedText = "[";
		for (let i = 0; i < data.length; i++) {
			formattedText += formatElement(
				data[i],
				errorIndexes.indexOf(i) > -1,
				intent,
				initial,
			);
		}
		formattedText = pruneLast2Chars(formattedText) + "]";
	} else if (dataType == "Object") {
		formattedText = "{\n";

		for (let k of Object.keys(data)) {
			formattedText +=
				initial +
				intent +
				k +
				": " +
				formatElement(data[k], errorIndexes.indexOf(k) > -1) +
				"\n";
		}
		formattedText += initial + "}";
	} else {
		formattedText = initial + JSON.stringify(data);
	}
	return formattedText;
}

/**
 * Generates report for a test
 *
 * @param {Object} res result of test
 * @param {Number} testIndex index of test
 * @param {boolean} [printStructs=false] whether to print arrays/objects even when test has passed
 * @return {string}
 */
function generateReport(res, testIndex, printStructs = false) {
	let { output, passed } = res;
	let outputType = _typeof(output),
		icon = passed ? GREEN + "✔️ " : RED + "❌ ",
		status = passed ? " Passed" : " Failed",
		formattedFunction = parseArgs(res.name, res.args, passed),
		formattedOutput,
		message = passed ? "" : "\n\n" + res.message + "\n" + WHITE;

	if (_isStruct(outputType) && (printStructs || !passed)) {
		formattedOutput = format(output, res.errorIndexes);
	} else {
		formattedOutput = outputType + `[${Object.keys(output).length}]`;
	}

	return (
		icon +
		res.execTime.toFixed(3) +
		"ms | test " +
		testIndex +
		status +
		": " +
		formattedFunction +
		" -> " +
		formattedOutput +
		message
	);
}

/**
 * Finds elements in `result` which doesn't matches with `source` and returns their key/index
 *
 * @param {Object|Array} result object/array to be tested
 * @param {Object|Array} source
 * @return {Array}
 */
function detectMismatchedElement(result, source) {
	let resKeys = Object.keys(result),
		srcKeys = Object.keys(source),
		mismatches = [],
		l,
		dict;
	if (resKeys.length >= srcKeys.length) {
		l = resKeys.length;
		dict = resKeys;
	} else {
		l = srcKeys.length;
		dict = srcKeys;
	}
	for (let i = 0; i < l; i++) {
		let resValue = JSON.stringify(result[dict[i]]),
			srcValue = JSON.stringify(source[dict[i]]);
		if (resValue != srcValue) {
			mismatches.push(dict[i]);
		}
	}
	return mismatches;
}

/**
 * Returns a formatted function name suitable for printing to console
 *
 * @param {string} name function name
 * @param {Array} args function arguments
 * @param {boolean} passed whether function passed test
 * @return {*}
 */
function parseArgs(name, args, passed) {
	let formatted = passed ? name + "(" : WHITE + name + "(" + BLUE;
	for (let arg of args) {
		if (isString(arg)) formatted += `"${arg}", `;
		else formatted += arg + ", ";
	}
	formatted = pruneLast2Chars(formatted);
	return passed ? formatted + ")" : formatted + WHITE + ")";
}

/**
 * Formats element of array/object
 * @param {*} e element
 * @param {boolean} isMismatch whether this is mismatched element
 * @param {string} intent
 * @param {string} initial
 * @returns {string}
 */
function formatElement(e, isMismatch, intent, initial) {
	let ft = "";
	if (isMismatch) ft = BG_RED;
	if (isStruct(e)) {
		ft += format(e, [], intent, initial + intent);
	} else if (isString(e)) {
		ft += YELLOW + '"' + e + '"';
	} else {
		ft += BLUE + e;
	}
	if (isMismatch) ft += BG_WHITE;
	return ft + WHITE + ", ";
}
