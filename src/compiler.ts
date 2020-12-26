import types = require("./types");

function compile(ast: types.Block): string {
	let compiled: string[][] = ast.map(instrs => instrs.map(instr => {
		switch(instr.type) {
			case types.Instr_Type.op:
				return types.Op[instr.data];
			default:
				return "NOT OP";
		}
	}));
	return compiled.map(comp_instrs => comp_instrs.join(";\n")).join(";\n") + ";";
}

export {compile};