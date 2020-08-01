const ERRORS = require("./errors.json");
const colorize = require("./colorize");

class Interpreter {
	constructor(debug = false) {
		this.debug = debug;

		this.variables = {};
		this.extensions = {};
	}

	process(file) {
		let meta = {
			lines: file.split("\n"),
			labels: {},
			// etc.
		}

		meta.lines.forEach((line, i) => {
			let l = line.trim().split(/ +/g);

			if (l[0][0] == ":")
				meta.labels[l[0].substr(1)] = i + 1;
		});

		return meta;
	}

	parse(meta) {
		let lines = meta.lines;
		let i = 0;

		try {
			while (i < lines.length) {
				i = this.parseLine(lines[i], i, lines, meta) || i + 1;
			}
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

	parseLine(line, contexti = -1, context = null, meta) {
		let l = line.trim();
		if (l.length == 0)
			return;

		let args = l.split(/ +/g);
		let command = args.shift();

		if (command[0] == "/" && command[1] == "/" ||
			command[0] == ":")
			return;

		switch (command) {
			case "echo": {
				console.log(line.substr(5));
			} break;

			case "goto": {
				return meta.labels[args[0]];
			} break;

			default: {
				if (this.extensions[command]) {
					let x = this.extensions[command](args, contexti, context, this.variables, this.debug);

					if (x)
						return x;
				} else {
					switch (args[0]) {
						case "=": {
							let value = args[1] ?
								l.substr(command.length + 3) : undefined;

							this.variables[command] = value;

							if (this.debug)
								console.log(`${command} = "${colorize.gray(value)}"`);
						} break;

						default: {
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
		}

		return contexti + 1;
	}

	assign(command, handler) {
		this.extensions[command] = handler;
	}
}

// i'd use exports directly but that breaks the lazy require and then
// immediately instantiate interpreter.js in cli.js, lol
module.exports = Interpreter;
