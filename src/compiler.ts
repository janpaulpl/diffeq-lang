import types = require("./types");

let prelude =
`with(main.builtins) {

let st = [];
let out = [];
`;

let postlude = `

out = [...out, ...st];
out;
}`;

let builtins = [
	"print", "true", "false", "map", "times", "range", "srange", 
	"pi", "e", "tau", 
	"sin", "cos", "tan", "cot", "sec", "csc"];

function compile(ast: types.Block): string {
	return prelude + compile_rec(ast, 0, [], []) + postlude;
}

function compile_rec(
		ast: types.Block, indent: number,
		vars: string[], funcs: string[]
	): string {
	let compiled: string[][] = ast.map(instrs => instrs.map(instr => {
		switch(instr.type) {
			case types.Instr_Type.op:
				return `__ops["${types.Op[instr.data]}"](st, out);`;
			case types.Instr_Type.name:
				if(vars.includes(instr.data))
					return `st.push(${instr.data});`;
				else if(funcs.includes(instr.data))
					return `${instr.data}();`;
				else if(builtins.includes(instr.data))
					return `__${instr.data}(st, out);`;
				else
					throw `${instr.data} is not a variable or function.`;
			case types.Instr_Type.ref:
				if(vars.includes(instr.data) || funcs.includes(instr.data))
					return `st.push(${instr.data});`;
				else if(builtins.includes(instr.data))
					return `st.push(__${instr.data});`;
				else
					throw `${instr.data} is not a variable or function.`;
			case types.Instr_Type.ls:
				return `st.push((() => {\n${tabs(indent + 1)}let st = [];\n${compile_rec(instr.items, indent + 1, vars, funcs)}\n${tabs(indent + 1)}return st.reverse();\n${tabs(indent)}})())`;
			case types.Instr_Type.obj:
				return `st.push({\n${instr.pairs.map(({key, value}) => `${tabs(indent + 1)}${key}: (() => {\n${compile_rec(value, indent + 2, vars, funcs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()`).join(",\n")}\n${tabs(indent)}});`;
			case types.Instr_Type.prop:
				return `st.push(st.pop().${instr.data});`;
			case types.Instr_Type.num:
				return `st.push(${instr.data});`;
			case types.Instr_Type.str:
				return `st.push("${instr.data}");`;
			case types.Instr_Type.if:
				return instr.branches.map(branch =>
					`${
						branch.cond
							? `if((() => {\n${compile_rec(branch.cond, indent + 2, vars, funcs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()) `
							: ""
					}{\n${compile_rec(branch.body, indent + 1, vars, funcs)}\n${tabs(indent)}}`
				).join(" else ");
			case types.Instr_Type.for:
				return `for(const ${instr.var} of (() => {\n${compile_rec(instr.iter, indent + 2, vars, funcs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()) {\n${compile_rec(instr.body, indent + 1, [...vars, instr.var], funcs)}\n${tabs(indent)}}`;
			case types.Instr_Type.while:
				return `while((() => {\n${compile_rec(instr.cond, indent + 2, vars, funcs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()) {\n${compile_rec(instr.body, indent + 1, vars, funcs)}\n${tabs(indent)}}`;
			
			// Add deriv.
			case types.Instr_Type.local:
				vars = [...vars, instr.var];
				return `let ${instr.var} = (() => {\n${compile_rec([instr.def], indent + 1, vars, funcs)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})();`;
			case types.Instr_Type.var:
				if(!vars.includes(instr.var))
					vars = [...vars, instr.var];
				return `${instr.var} = (() => {\n${compile_rec([instr.def], indent + 1, vars, funcs)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})();`;
			case types.Instr_Type.fun:
				funcs = [...funcs, instr.fun];
				return `function ${instr.fun}() {\n${instr.args.map(arg => `${tabs(indent + 1)}let ${arg} = st.pop();\n`).join("")}${compile_rec(instr.body, indent + 1, [...vars, ...instr.args], funcs)}\n${tabs(indent)}}`
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