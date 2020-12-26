import parser = require("./parser");
import compiler = require("./compiler");

function run(prog: string) {
	return compiler.compile(parser.parse(prog));
}

let format = s => s;

export {run, format};