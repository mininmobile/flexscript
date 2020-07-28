const errors = require("./errors.json");

class Interpreter {
	constructor() {
		this.variables = {};
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
				throw {
					msg: `Invalid command ‘${command}’ on line ${contexti}`,
					code: errors.INVALID_COMMAND,
					dbgpos: 0,
					dbglen: command.length,
					line: line.split(/ +/g),
					context: contexti
				};
			}
		}
	}

	assign(command, handler) {
		// assign a custom command to the current interpreter
	}
}

module.exports = Interpreter;
