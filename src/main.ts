import parser = require("./parser");
import compiler = require("./compiler");
import builtins = require("./builtins");

function run(prog: string): any[] {
	return eval(compiler.compile(parser.parse(prog)));
}

function format(out: any[]): string {
	return out.map(o => `<p>${o}</p>`).join("")
}

export {run, format, builtins};