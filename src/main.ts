import parser = require("./parser");

function run(prog: string) {
	return parser.parse(prog);
}

let format = s => JSON.stringify(s, null, 2);

export = {run, format};