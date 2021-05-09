import parser = require("./parser");
import compiler = require("./compiler");
import builtins = require("./builtins");
import utils = require("./utils");
import expr = require("./expr");
import types = require("./types");

function run(prog: string): any[] {
	let comp = compiler.compile(parser.parse(prog));
	console.log(comp);
	return eval(comp);
}

let err_to_str = (err: Error | string): string => !(err instanceof Error)
	? err
	: err.stack.split("\n").slice(0, 2).join("\n\t");

let to_type = utils.to_type;

let Expr = expr.Expr;

let eval_at = expr.eval_at;

let stringify_expr = expr.stringify;

let Expr_Type = {};
Object.assign(Expr_Type, types.Expr_Type);

export {run, err_to_str, builtins, to_type, Expr, eval_at, stringify_expr, Expr_Type};