const readline = require("readline");
const colorize = require("./colorize");

// setup for prompt()
let _rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function prompt(text) {
	return new Promise((resolve, error) => {
		try {
			_rl.question(text, resolve);
		} catch (e) {
			error(e);
		}
	});
}

function pause(text) {
	return new Promise((resolve, error) => {
		try {
			process.stdin.once("data", (data) => {
				_rl.line = "";
				resolve(data);
			});
		} catch (e) {
			error(e);
		}
	});
}

function logError(e) {
	let dbgpos = e.dbgpos || 0;
	let dbglen = e.dbglen || 0;

	if (e.token != undefined) {
		dbglen = e.line[e.token].length;

		if (e.token) {
			e.line
				.filter((x, i) => i < e.token)
				.forEach((x) => dbgpos += x.length + 1);
		}
	}

	if (e.msg) {
		let p = " ".repeat(e.context.toString().length);
		console.log(colorize.red([
			`  ${e.context} | ` + e.line.join(" "),
			`  ${p}   ` + " ".repeat(dbgpos) + "~".repeat(dbglen),
			`  ${p}   ` + e.msg,
		].join("\n")));
	} else {
		console.log(colorize.red("internal interpreter error;"));
		console.error(e);
	}
}

function parseMath(expression) {
	let e = expression.replace(/[^0-9\(\)\+\-\/\*\^]/g, "");

	let indent = 0;
	let tokens = [];

	for (let i = 0; i < e.length; i++) {
		if (e[i] == "(") {
			tokens[indent] ?
				tokens[indent] += "O" : tokens[indent] = "O";

			indent++;
		} else if (e[i] == ")" && indent > 0) {
			tokens[indent] += "C";

			indent--;
		} else {
			tokens[indent] ?
			tokens[indent] += e[i] : tokens[indent] = e[i];
		}
	}

	if (tokens[1]) {
		let temp = tokens[tokens.length - 1].split("C");
		temp.pop();

		for (let i = tokens.length - 2; i >= 0; i--) {
			let l = tokens[i];

			temp.forEach((x) =>
				l = l.replace("O", evalMath(x)));

			if (i == 0)
				return evalMath(l);
			else {
				temp = l.split("C");
				temp.pop();
			}
		}
	} else {
		return evalMath(tokens[0]);
	}
}

function evalMath(sum) {
	let value = 0;
	let tempA = "";
	let tempB = "";

	for (let i = 0; i <= sum.length; i++) {
		let c = sum[i] || "X";

		if ("0123456789.".includes(c)) {
			tempA += c;
		} else if ("+-/*^".includes(c) || c == "X") {
			tempA = parseFloat(tempA);

			switch (tempB) {
				default:
				case "+": value += tempA; break;
				case "-": value -= tempA; break;
				case "*": value *= tempA; break;
				case "/": value /= tempA; break;
				case "^": value = Math.pow(value, tempA); break;
			}

			tempA = "";
			tempB = c;
		}
	}

	return value;
}

exports.prompt = prompt;
exports.pause = pause;
exports.readline = _rl;
exports.logError = logError;
exports.parseMath = parseMath;
exports.evalMath = evalMath;
