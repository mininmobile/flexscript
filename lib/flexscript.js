const ERRORS = require("./errors.json");
const colorize = require("./colorize");

class Interpreter {
	constructor() {
		this.variables = {};
		this.extensions = {};
	}

	process(file) {
		// process a file
		// returns all labels, functions, etc.
		return { labels: [] }
	}

	parse(file, meta = { labels: [] }) {
		let lines = file.split(/\n+/g);

		for (let i = 0; i < lines.length; i++) {
			try {
				this.parseLine(lines[i], i, lines);
			} catch (e) {
				let dbgpos = e.dbgpos || 0;
				let dbglen = e.dbglen || 0;

				console.log("\n\x1b[100m ERROR                                         \x1b[0m");

				if (e.msg) {
					let p = " ".repeat(e.context.length);
					console.log(colorize.red([
						`  ${e.context} | ` + lines[i],
						`  ${p}    ` + " ".repeat(dbgpos) + "~".repeat(dbglen),
						`  ${p}    ` + e.msg,
					].join("\n")));
				} else {
					console.error("internal interpreter error; " + e);
				}

				process.exit(e.code || -1);
			}
		}
	}

	parseLine(line, contexti = -1, context = null) {
		let l = line.trim();
		if (l.length == 0)
			return;

		let args = line.trim().split(/ +/g);
		let command = args.shift();

		switch (command) {
			case "//": break;

			case "echo": {
				console.log(line.substr(5));
			} break;

			default: {
				if (this.extensions[command]) {
					this.extensions[command](args, contexti, context);
				} else {
					throw {
						msg: `Invalid command ‘${command}’ on line ${contexti}`,
						code: ERRORS.INVALID_COMMAND,
						dbgpos: 0,
						dbglen: command.length,
						line: l.split(/ +/g),
						context: contexti + 1,
					}
				}
			}
		}
	}

	assign(command, handler) {
		this.extensions[command] = handler;
	}
}

// i'd use exports directly but that breaks the lazy require and then
// immediately instantiate interpreter.js in cli.js, lol
module.exports = Interpreter;
