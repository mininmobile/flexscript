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

	parseLine(line) {
		// parse one line
	}

	assign(command, handler) {
		// assign a custom command to the current interpreter
	}
}

module.exports = Interpreter;
