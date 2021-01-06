import parser = require("./parser");
import compiler = require("./compiler");
import builtins = require("./builtins");

function run(prog: string): any[] {
	return eval(compiler.compile(parser.parse(prog)));
}

function format(out: any[]): string {
	return out.map(o => `<p>${o}</p>`).join("")
}

let err_to_str = (err: Error | string): string => !(err instanceof Error)
	? err
	: err.stack.split("\n").slice(0, 2).join("\n\t");

export {run, format, err_to_str, builtins};