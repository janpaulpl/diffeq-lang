import types = require("./types");

class Expr {
	constructor(ast: types.Expr) {
		for(let key in ast) {
			this[key] = ast[key];
		}
	}
}

function num(n: number): types.Expr {
	return wrap_expr({type: types.Expr_Type.num, data: n});
}

function eval_at(ast: types.Expr, x: number): number {
	switch(ast.type) {
		case types.Expr_Type.add:
			return eval_at(ast.left, x) + eval_at(ast.right, x);
		case types.Expr_Type.sub:
			return eval_at(ast.left, x) - eval_at(ast.right, x);
		case types.Expr_Type.mul:
			return eval_at(ast.left, x) * eval_at(ast.right, x);
		case types.Expr_Type.div:
			return eval_at(ast.left, x) / eval_at(ast.right, x);
		case types.Expr_Type.pow:
			return eval_at(ast.left, x) ** eval_at(ast.right, x);
		case types.Expr_Type.call:
			switch(ast.name) {
				// 1 argument
				case "abs": return Math.abs(eval_at(ast.args[0], x));
				case "sqrt": return Math.sqrt(eval_at(ast.args[0], x));
				case "cbrt": return Math.cbrt(eval_at(ast.args[0], x));
				case "ln": return Math.log(eval_at(ast.args[0], x));
				case "sin": return Math.sin(eval_at(ast.args[0], x));
				case "cos": return Math.cos(eval_at(ast.args[0], x));
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

function derive(ast: types.Expr): types.Expr {
	switch(ast.type) {
		case types.Expr_Type.add:
			return wrap_expr({
				type: types.Expr_Type.add,
				left: derive(ast.left),
				right: derive(ast.right)
			});
		
		case types.Expr_Type.sub:
			return wrap_expr ({
				type: types.Expr_Type.sub,
				left: derive(ast.left),
				right: derive(ast.right)
			});
		
		case types.Expr_Type.mul:
			return wrap_expr({
				type: types.Expr_Type.add,
				left: {
					type: types.Expr_Type.mul,
					left: derive(ast.left),
					right: ast.right
				},
				right: {
					type: types.Expr_Type.mul,
					left: ast.left,
					right: derive(ast.right)
				}
			});
		
		case types.Expr_Type.div:
			return wrap_expr({
				type: types.Expr_Type.div,
				left: {
					type: types.Expr_Type.sub,
					left: {
						type: types.Expr_Type.mul,
						left: derive(ast.left),
						right: ast.right
					},
					right: {
						type: types.Expr_Type.mul,
						left: ast.left,
						right: derive(ast.right)
					}
				},
				right: {
					type: types.Expr_Type.pow,
					left: ast.right,
					right: num(2)
				}
			});

		// Exponentiation will only work for numerical exponents 
		// This has chain rule but it can be abstracted better later
		
		case types.Expr_Type.pow:
			return wrap_expr({
				type: types.Expr_Type.mul,
				left: {
					type: types.Expr_Type.mul,
					left: {
						type: types.Expr_Type.pow,
						left: ast.left,
						right: { 
							type: types.Expr_Type.sub,
							left: ast.right,
							right: num(1)
						},
					},
					right: ast.right
				},
				right: derive(ast.left)
			});

		case types.Expr_Type.expr_var:
			return num(1);
		
		case types.Expr_Type.num:
			return num(0);
	}
}

function simplify(ast: types.Expr): types.Expr {
	let left;
	let right;
	
	switch(ast.type) {
		case types.Expr_Type.add:
			left = simplify(ast.left);
			right = simplify(ast.right);
			
			if(
					left.type == types.Expr_Type.num &&
					right.type == types.Expr_Type.num) {
				return num(left.data + right.data);
			} else if(
					left.type == types.Expr_Type.num &&
					left.data == 0) {
				return right;
			} else if(
					right.type == types.Expr_Type.num &&
					right.data == 0) {
				return left;
			}
			
			return wrap_expr({
				type: types.Expr_Type.add,
				left, right
			});
		
		case types.Expr_Type.sub:
			left = simplify(ast.left);
			right = simplify(ast.right);
			
			if(
					left.type == types.Expr_Type.num &&
					right.type == types.Expr_Type.num) {
				return num(left.data - right.data);
			} else if(
					right.type == types.Expr_Type.num &&
					right.data == 0) {
				return left;
			}
			
			return wrap_expr({
				type: types.Expr_Type.sub,
				left, right
			});
		
		case types.Expr_Type.mul:
			left = simplify(ast.left);
			right = simplify(ast.right);
			
			if(
					left.type == types.Expr_Type.num &&
					right.type == types.Expr_Type.num) {
				return num(left.data * right.data);
			} else if(
					left.type == types.Expr_Type.num &&
					left.data == 1) {
				return right;
			} else if(
					right.type == types.Expr_Type.num &&
					right.data == 1) {
				return left;
			} else if(
					left.type == types.Expr_Type.num &&
					left.data == 0) {
				return num(0);
			} else if(
					right.type == types.Expr_Type.num &&
					right.data == 0) {
				return num(0);
			}
			
			return wrap_expr({
				type: types.Expr_Type.mul,
				left, right
			});
		
		case types.Expr_Type.div:
			left = simplify(ast.left);
			right = simplify(ast.right);
			
			if(
					left.type == types.Expr_Type.num &&
					right.type == types.Expr_Type.num) {
				return num(left.data / right.data);
			} else if(
					right.type == types.Expr_Type.num &&
					right.data == 1) {
				return left;
			}
			
			return wrap_expr({
				type: types.Expr_Type.div,
				left, right
			});
		
		case types.Expr_Type.pow:
			left = simplify(ast.left);
			right = simplify(ast.right);
			
			if(
					left.type == types.Expr_Type.num &&
					right.type == types.Expr_Type.num) {
				return num(left.data ** right.data);
			} else if(
					right.type == types.Expr_Type.num &&
					right.data == 1) {
				return left;
			}
			
			return wrap_expr({
				type: types.Expr_Type.pow,
				left, right
			});
		
		case types.Expr_Type.call:
			return wrap_expr({
				type: types.Expr_Type.call,
				name: ast.name,
				args: ast.args.map(simplify)
			});
		
		case types.Expr_Type.expr_var:
		case types.Expr_Type.num:
			return wrap_expr(ast);
	}
}

function stringify(ast: types.Expr): string {
	switch(ast.type) {
		case types.Expr_Type.add:
			return `(${stringify(ast.left)} + ${stringify(ast.right)})`;
		case types.Expr_Type.sub:
			return `(${stringify(ast.left)} - ${stringify(ast.right)})`;
		case types.Expr_Type.mul:
			return `(${stringify(ast.left)} * ${stringify(ast.right)})`;
		case types.Expr_Type.div:
			return `(${stringify(ast.left)} / ${stringify(ast.right)})`;
		case types.Expr_Type.pow:
			return `(${stringify(ast.left)} ^ ${stringify(ast.right)})`;
		
		case types.Expr_Type.call:
			return `${ast.name}(${ast.args.map(stringify).join(", ")})`;
		
		case types.Expr_Type.expr_var:
			return "x";
		
		case types.Expr_Type.num:
			return ast.data.toString();
	}
}

function wrap_expr(ast: types.Expr): types.Expr {
	return <types.Expr> new Expr(ast);
}

export {Expr, eval_at, derive, simplify, stringify};