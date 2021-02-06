import types = require("./types");

function derive(expr: types.Expr): types.Expr {
	switch(expr.type) {
		case types.Expr_Top_Type.single:
			return {
				type: types.Expr_Top_Type.single,
				expr: derive_terms(expr.expr)
			};
		case types.Expr_Top_Type.eq:
			return {
				type: types.Expr_Top_Type.eq,
				left: derive_terms(expr.left),
				right: derive_terms(expr.right)
			};
	}
}

function derive_terms(terms: types.Terms): types.Terms {
	return terms;
}

export {derive};