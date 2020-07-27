const fgColors = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
}

const bgColors = {
	black: "\x1b[40m",
	red: "\x1b[41m",
	green: "\x1b[42m",
	yellow: "\x1b[43m",
	blue: "\x1b[44m",
	magenta: "\x1b[45m",
	cyan: "\x1b[46m",
	white: "\x1b[47m",
}

function fg(text, fore, reset = true) {
	return `${fgColors[fore]}${text}${reset ? "\x1b[0m" : ""}`;
}

function bg(text, back, reset = true) {
	return `${bgColors[back]}${text}${reset ? "\x1b[0m" : ""}`;
}

function colorize(text, fore, back, reset) {
	if (reset === undefined && back !== false)
		reset = true;

	let str = fgColors[fore];

	if (typeof(back) == "string")
		str += bgColors[back];

	str += text;

	if (reset)
		str += "\x1b[0m";

	return str;
}

exports.fg = fg;
exports.bg = bg;
exports.colorize = colorize;
exports.black = (x) => { return fg(x, "black"); }
exports.red = (x) => { return fg(x, "red"); }
exports.green = (x) => { return fg(x, "green"); }
exports.yellow = (x) => { return fg(x, "yellow"); }
exports.blue = (x) => { return fg(x, "blue"); }
exports.magenta = (x) => { return fg(x, "magenta"); }
exports.cyan = (x) => { return fg(x, "cyan"); }
exports.white = (x) => { return fg(x, "white"); }
