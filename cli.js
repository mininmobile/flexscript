const interpreter = new (require("./lib/flexscript"))();

let args = process.argv.splice(2);

if (args[0] == "--help" || args[0] == "-h" || args[0] == "/?") {
	console.log([
		"usage:",
		"  /? -h --help\tshows this message",
		"  [filepath]\tstart the interpreter",
		"  [no args]\tstart interactive console",
	].join("\n"));
} else if (args[0]) {
	// file-only imports
	let fs = require("fs");

	// launch interpreter into file
	fs.readFile(args[0], "UTF-8", (err, data) => {
		if (err)
			throw new Error(err);

		let meta = interpreter.process(data);
		interpreter.parse(meta);
	});
} else {
	// console-only imports
	let colorize = require("./lib/colorize");
	let util = require("./lib/util");

	// launch into interactive console
	interpreter.debug = true;
	interpreter.assign("exit", () => { process.exit(0) });

	console.log("FLEXSCRIPT interactive console");
	console.log("Copyleft zvava (@zvava@toot.cafe)\n");
	ask();

	function ask() {
		util.readline.question(colorize.blue("FS> "), async (input) => {
			try {
				await interpreter.parseLine(input);
			} catch (e) {
				util.logError(e);
			}

			ask();
		});
	}
}
