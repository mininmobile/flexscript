const colorize = require("./colorize");

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
		console.error("internal interpreter error; " + e);
	}
}

exports.logError = logError;
