let args = process.argv.splice(2);

if (args[0] == "--help" || args[0] == "-h") {
	console.log([
		"usage:",
		"  -h --help\tshows this message",
		"  [filepath]\tstart the interpreter",
		"  [no args]\tstart interactive console",
	].join("\n"));
} else if (args[0]) {
	// launch interpreter into file
	const interpreter = new (require("./lib/flexscript"))();
	console.log("cum");
} else {
	// launch into interactive console
	const interpreter = new (require("./lib/flexscript"))();
	console.log(interpreter.fart);
}
