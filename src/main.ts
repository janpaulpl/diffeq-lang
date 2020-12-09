import parser = require("./parser");

function run(prog: string) {
	return parser.parse(prog);
}

let format = JSON.stringify;

export = {run, format};