import { type } from "os";
import types = require("./types");

let block_prelude =
`let st = [];
`;

function compile(ast: types.Block): string {
	return block_prelude + compile_rec(ast, 0);
}

function compile_rec(ast: types.Block, indent: number): string {
	let compiled: string[][] = ast.map(instrs => instrs.map(instr => {
		switch(instr.type) {
			case types.Instr_Type.op:
				return `__ops["${types.Op[instr.data]}"]();`;
			case types.Instr_Type.name:
				// Tell if function or var
				return `st.push(${instr.data});`;
			case types.Instr_Type.ref:
				return `st.push(${instr.data});`;
			case types.Instr_Type.prop:
				return `st.push(st.pop().${instr.data})`;
			case types.Instr_Type.ls:
				return `st.push((() => {\n${tabs(indent + 1)}let st = [];\n${compile_rec(instr.items, indent + 1)}\n${tabs(indent + 1)}return st.reverse();\n${tabs(indent)}})())`;
			case types.Instr_Type.num:
				return `st.push(${instr.data});`;
			case types.Instr_Type.str:
				return `st.push("${instr.data}");`;
			
			// **FIX NESTED ST**
			
			case types.Instr_Type.if:
				return instr.branches.map(branch =>
					`${
						branch.cond
							? `if((() => {\n${compile_rec(branch.cond, indent + 1)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})()) `
							: ""
					}{\n${compile_rec(branch.body, indent + 1)}\n${tabs(indent)}}`
				).join(" else ");
			case types.Instr_Type.for:
				return `for(let ${instr.var} of (() => {\n${compile_rec(instr.iter, indent + 1)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})()) {\n${compile_rec(instr.body, indent + 1)}\n${tabs(indent)}}`;
			case types.Instr_Type.cmmnt:
				return `/*${instr.data}*/`;
			default:
				return "NOT OP;";
		}
	}));
	return compiled.map(comp_instrs =>
		comp_instrs.map(instr =>
			tabs(indent) + instr
		).join("\n")
	).join("\n");
}

function tabs(indent: number): string {
	return "\t".repeat(indent);
}

export {compile};