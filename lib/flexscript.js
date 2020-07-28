const ERRORS = require("./errors.json");

class Interpreter {
	constructor() {
		this.variables = {};
		this.extensions = {};
	}

	process(file) {
		// process a file
		// returns all labels, functions, etc.
	}

	parse(file, meta) {
		// go through a file and run it
		// meta is the process()ed information
	}

	parseLine(line, contexti = -1, context = null) {
		let args = line.split(/ +/g);
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
						line: line.split(/ +/g),
						context: contexti,
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
