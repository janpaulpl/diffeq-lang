enum Instr_Type {
	op, name, ref, obj, prop, ls, num, str, // Basic
	if, for, while, local, var, fun, // Structures
	cmmnt
}

enum Op {
	"==", "!=", "<=", ">=", "<", ">", // Comparison
	"+", "~", "-", "*", "/", // Arithmetic
	"^", "%%", "%", "'", // Extra math
	"@", // List indexing
	"&", "|", "!", // Boolean
	"??" // Special interaction
}

type Block = Instrs[]

type Instrs = Instr[]

type Instr =
	{type: Instr_Type.op, data: Op, num?: number} |
	{type: Instr_Type.name, data: string} |
	{type: Instr_Type.ref, data: string} |
	{type: Instr_Type.obj, pairs: {key: string, value: Block}[]} |
	{type: Instr_Type.prop, data: string} |
	{type: Instr_Type.ls, items: Block} |
	{type: Instr_Type.num, data: number} |
	{type: Instr_Type.str, data: string} |
	{type: Instr_Type.if, branches: {cond: Block, body: Block | null}[]} |
	{type: Instr_Type.for, var: string, iter: Block, body: Block} |
	{type: Instr_Type.while, cond: Block, body: Block} |
	{type: Instr_Type.local, var: string, def: Instrs, deriv_n: number} |
	{type: Instr_Type.var, var: string, def: Instrs, deriv_n: number} |
	{type: Instr_Type.fun, fun: string, args: string[], body: Block} |
	{type: Instr_Type.cmmnt, data: string};

export {Instr_Type, Op, Block, Instrs, Instr};