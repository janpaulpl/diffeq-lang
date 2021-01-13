import parser = require("./parser");
import compiler = require("./compiler");
import builtins = require("./builtins");

function run(prog: string): any[] {
	return eval(compiler.compile(parser.parse(prog)));
}

function format(out: any[]): string {
	return out.map(o => `<p>${stringify(o)}</p>`).join("")
}

function stringify(obj: any): string {
	let obj_type = to_type(obj);
	if(obj_type == "number" || obj_type == "string") {
		return obj.toString();
	} else if(obj_type == "array") {
		return `[${obj.map(stringify).join(" ")}]`;
	}
}

function to_type(obj: any): string {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

let err_to_str = (err: Error | string): string => !(err instanceof Error)
	? err
	: err.stack.split("\n").slice(0, 2).join("\n\t");

export {run, format, err_to_str, builtins};