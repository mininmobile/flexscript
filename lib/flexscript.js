const ERRORS = require("./errors.json");
const colorize = require("./colorize");
const util = require("./util");

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
			console.log("\n\x1b[100m ERROR                                         \x1b[0m");
			util.logError(e);

			process.exit(e.code || -1);
		}
	}

	parseLine(line, contexti = -2, context = null, meta) {
		let l = line.trim();
		if (l.length == 0)
			return;

		l = this.parseVariables(l);

		let args = l.split(/ +/g);
		let command = args.shift();

		if (command[0] == "/" && command[1] == "/" ||
			command[0] == ":")
			return;

		switch (command) {
			case "echo":
				console.log(l.substr(5)); break;

			case "goto":
				return meta.labels[args[0]];

			case "@debug":
				this.debug = args[0] == "on" ? true : false; break;

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
								console.log(`${command} = "${colorize.gray(this.variables[command])}"`);
						} break;

						case "/i": case "/I": case "-i": case "--int": {
							if (["=", "+=", "-=", "*=", "/="].includes(args[1])) {
								let offset = command.length +
									args[0].length + args[1].length + 3;

								try {
									var value = util.parseMath(l.substr(offset));
								} catch (e) {
									throw {
										msg: e.msg,
										code: ERRORS.UNEXPECTED_TOKEN,
										dbgpos: offset + e.pos,
										dbglen: 1,
										line: line.trim().split(/ +/g),
										context: contexti + 1,
									}
								}

								if (args[1] != "=") {
									let x = parseFloat(this.variables[command]);
									switch (args[1]) {
										case "+=": value = x + value; break;
										case "-=": value = x - value; break;
										case "*=": value = x * value; break;
										case "/=": value = x / value; break;
									}
								}

								this.variables[command] = value.toString();

								if (this.debug)
									console.log(`${command} = ${colorize.gray(this.variables[command])}`);
							} else throw {
								msg: `Invalid assignment ‘${args[1]}’`,
								code: ERRORS.INVALID_ASSIGNMENT,
								token: 2,
								line: line.trim().split(/ +/g),
								context: contexti + 1,
							}
						} break;

						default: throw {
							msg: `Invalid command ‘${command}’`,
							code: ERRORS.INVALID_COMMAND,
							token: 0,
							line: line.trim().split(/ +/g),
							context: contexti + 1,
						}
					}
				}
			}
		}

		return contexti + 1;
	}

	parseVariables(line) {
		let indent = 0;
		let tokens = [];

		for (let i = 0; i < line.length; i++) {
			if (line[i] == "{" && line [i - 1] != "\\") {
				tokens[indent] ?
					tokens[indent] += "\xff" : tokens[indent] = "\xff";

				indent++;
			} else if (line[i] == "}" && line [i - 1] != "\\" && indent > 0) {
				tokens[indent] += "\xfe";

				indent--;
			} else {
				tokens[indent] ?
				tokens[indent] += line[i] : tokens[indent] = line[i];
			}
		}

		if (tokens[1]) {
			let temp = tokens[tokens.length - 1].split("\xfe");
			temp.pop();

			for (let i = tokens.length - 2; i >= 0; i--) {
				let l = tokens[i];

				temp.forEach((x) =>
					l = l.replace("\xff", this.variables[x] || `{${x}}`));

				if (i == 0)
					return l;
				else {
					temp = l.split("\xfe");
					temp.pop();
				}
			}
		} else {
			return tokens[0];
		}
	}

	assign(command, handler) {
		this.extensions[command] = handler;
	}
}

// i'd use exports directly but that breaks the lazy require and then
// immediately instantiate interpreter.js in cli.js, lol
module.exports = Interpreter;
