enum Instr_Type {
	op, name, ref, ls, obj, prop, num, str, expr, // Basic
	if, for, while, local, var, fun, anon // Structures
}

enum Op {
	"==", "!=", "<=", ">=", "<", ">", // Comparison
	"+", "~", "-", "*", "/", // Arithmetic
	"^", "%%", "%", "'", // Extra math
	"@", // List indexing
	"&", "|", "!", // Boolean
	"??", "?" // Special interaction
}

type Block = Instrs[];

type Instrs = Instr[];

type Instr =
	{type: Instr_Type.op, data: Op} |
	{type: Instr_Type.name, data: string} |
	{type: Instr_Type.ref, data: string} |
	{type: Instr_Type.ls, items: Instrs} |
	{type: Instr_Type.obj, pairs: {key: string, value: Instrs}[]} |
	{type: Instr_Type.prop, data: string} |
	{type: Instr_Type.num, data: number} |
	{type: Instr_Type.str, data: string} |
	{type: Instr_Type.expr, data: Expr} |
	{type: Instr_Type.if, branches: {cond: Instrs, body: Block | null}[]} |
	{type: Instr_Type.for, var: string, iter: Instrs, body: Block} |
	{type: Instr_Type.while, cond: Instrs, body: Block} |
	{type: Instr_Type.local, var: string, def: Instrs, deriv_n: number} |
	{type: Instr_Type.var, var: string, def: Instrs, deriv_n: number} |
	{type: Instr_Type.fun, fun: string, args: string[], body: Block} |
	{type: Instr_Type.anon, args: string[], body: Block};

enum Expr_Type {
	add, sub, mul, div, pow,
	call, expr_var, num
}

type Expr = (
	{type: Expr_Type.add, left: Expr, right: Expr} |
	{type: Expr_Type.sub, left: Expr, right: Expr} |
	{type: Expr_Type.mul, left: Expr, right: Expr} |
	{type: Expr_Type.div, left: Expr, right: Expr} |
	{type: Expr_Type.pow, left: Expr, right: Expr} |
	{type: Expr_Type.call, name: string, args: Expr[]} |
	{type: Expr_Type.expr_var} |
	{type: Expr_Type.num, data: number}
);

declare global {
	interface Window {
		vars: {[name: string]: any};
		funs: {[name: string]: (st: any[], out: any[]) => void};
		res_hist: any[];
	}
}

export {Instr_Type, Op, Expr, Expr_Type, Block, Instrs, Instr};