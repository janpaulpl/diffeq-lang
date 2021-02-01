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

enum Expr_Top_Type {single, eq}

enum Expr_Type {
	parens, call, const, main_var, var, num
}

enum Term_Op {"+", "-"}

enum Prod_Op {"*", "/"}

enum Main_Var {x, y}

type Expr =
	{type: Expr_Top_Type.single, expr: Terms[]} |
	{type: Expr_Top_Type.eq, left: Terms[], right: Terms[]};
type Terms = {op: Term_Op, prod: Prods}[];
type Prods = {op: Prod_Op, prod: Exps}[];
type Exps = Final[];

type Final = {
	pos: boolean,
	val: (
		{type: Expr_Type.parens, data: Terms[]} |
		{type: Expr_Type.call, name: string, args: Terms[][]} |
		{type: Expr_Type.main_var, data: Main_Var} |
		{type: Expr_Type.var, data: string} |
		{type: Expr_Type.num, data: number}
	)
};

declare global {
	interface Window {
		vars: {[name: string]: any};
		funs: {[name: string]: (st: any[], out: any[]) => void};
		res_hist: any[];
	}
}

export {Instr_Type, Op, Expr_Top_Type, Expr_Type, Term_Op, Prod_Op, Main_Var, Block, Instrs, Instr};