import parser = require("./parser");
import compiler = require("./compiler");
import builtins = require("./builtins");

function run(prog: string): any[] {
	let comp = compiler.compile(parser.parse(prog));
	console.log(comp);
	return eval(comp);
}

let err_to_str = (err: Error | string): string => !(err instanceof Error)
	? err
	: err.stack.split("\n").slice(0, 2).join("\n\t");

export {run, err_to_str, builtins};