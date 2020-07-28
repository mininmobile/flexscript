const interpreter = new (require("./lib/flexscript"))();

let args = process.argv.splice(2);

if (args[0] == "--help" || args[0] == "-h") {
	console.log([
		"usage:",
		"  -h --help\tshows this message",
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
		interpreter.parse(data, meta);
	});
} else {
	// console-only imports
	let readline = require("readline");
	let colorize = require("./lib/colorize");

	// launch into interactive console
	interpreter.assign("exit", () => { process.exit(0) });

	console.log("FLEXSCRIPT interactive console");
	console.log("Copyleft zvava (@zvava@toot.cafe)\n");
	ask();

	function ask() {
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question(colorize.blue("FS> "), (input) => {
			rl.close();

			try {
				interpreter.parseLine(input);
			} catch (e) {
				let dbgpos = e.dbgpos || 0;
				let dbglen = e.dbglen || 0;

				if (e.msg) {
					console.log(colorize.red([
						"  -1 | " + input,
						"       " + " ".repeat(dbgpos) + "~".repeat(dbglen),
						"       " + e.msg,
					].join("\n")));
				} else {
					console.error("internal interpreter error; " + e);
				}
			}

			ask();
		});
	}
}
