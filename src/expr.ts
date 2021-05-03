import types = require("./types");

function eval_at(ast: types.Expr, x: number): number {
	switch(ast.type) {
		case types.Expr_Type["+"]:
			return eval_at(ast.left, x) + eval_at(ast.right, x);
		case types.Expr_Type["-"]:
			return eval_at(ast.left, x) - eval_at(ast.right, x);
		case types.Expr_Type["*"]:
			return eval_at(ast.left, x) * eval_at(ast.right, x);
		case types.Expr_Type["/"]:
			return eval_at(ast.left, x) / eval_at(ast.right, x);
		case types.Expr_Type["^"]:
			return eval_at(ast.left, x) ** eval_at(ast.right, x);
		case types.Expr_Type.call:
			switch(ast.name) {
				// 1 argument
				case "abs": return Math.abs(eval_at(ast.args[0], x));
				case "sqrt": return Math.sqrt(eval_at(ast.args[0], x));
				case "cbrt": return Math.cbrt(eval_at(ast.args[0], x));
				case "ln": return Math.log(eval_at(ast.args[0], x));
				case "cos": return Math.cos(eval_at(ast.args[0], x));
				case "sin": return Math.sin(eval_at(ast.args[0], x));
				case "tan": return Math.tan(eval_at(ast.args[0], x));
				case "cot": return 1 / Math.tan(eval_at(ast.args[0], x));
				case "sec": return 1 / Math.cos(eval_at(ast.args[0], x));
				case "csc": return 1 / Math.sin(eval_at(ast.args[0], x));
				// 2 arguments
				case "root": return Math.pow(
					eval_at(ast.args[1], x),
					1 / eval_at(ast.args[0], x)
				);
				case "log": return (
					Math.log(eval_at(ast.args[1], x)) /
					Math.log(eval_at(ast.args[0], x))
				);
			}
		case types.Expr_Type.expr_var:
			return x;
		case types.Expr_Type.num:
			return ast.data;
	}
}

function derive(expr: types.Expr): types.Expr {
	return expr;
}

export {eval_at, derive};