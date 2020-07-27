const colors = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
}

function colorize(text, color) {
	return `${colors[color]}${text}\x1b[0m`;
}

exports.colorize = colorize;
exports.black = (x) => { return colorize(x, "black"); }
exports.red = (x) => { return colorize(x, "red"); }
exports.green = (x) => { return colorize(x, "green"); }
exports.yellow = (x) => { return colorize(x, "yellow"); }
exports.blue = (x) => { return colorize(x, "blue"); }
exports.magenta = (x) => { return colorize(x, "magenta"); }
exports.cyan = (x) => { return colorize(x, "cyan"); }
exports.white = (x) => { return colorize(x, "white"); }
