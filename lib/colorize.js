const fgColors = {
	gray: "\x1b[90m",
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

Object.keys(fgColors).forEach((color) =>
	exports[color] = (x, reset = true) => fg(x, color, reset));

exports.fg = fg;
exports.bg = bg;
exports.colorize = colorize;
exports.colors = { fg: fgColors, bg: bgColors, reset: "\x1b[0m" }
