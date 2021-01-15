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
	return prelude + compile_rec(ast, 0, [], [], []) + postlude;
}

function compile_rec(
		ast: types.Block, indent: number,
		locals: string[], vars: string[], funs: string[]
	): string {
	let compiled: string[][] = ast.map(instrs => instrs.map(instr => {
		switch(instr.type) {
			case types.Instr_Type.op:
				return `__ops["${types.Op[instr.data]}"](st, out);`;
			case types.Instr_Type.name:
				if(instr.data == "debug") return "debugger;";	
				
				if(locals.includes(instr.data))
					return `st.push(${instr.data});`;
				else if(vars.includes(instr.data) || instr.data in window.vars)
					return `st.push(window.vars.${instr.data});`;
				else if(funs.includes(instr.data) || instr.data in window.funs)
					return `window.funs.${instr.data}(st, out);`;
				else if(builtins.includes(instr.data))
					return `__${instr.data}(st, out);`;
				else
					throw `${instr.data} is not a variable or function.`;
			case types.Instr_Type.ref:
				if(locals.includes(instr.data))
					return `st.push(${instr.data});`;
				else if(vars.includes(instr.data) || instr.data in window.vars)
					return `st.push(window.vars.${instr.data});`;
				else if(funs.includes(instr.data) || instr.data in window.funs)
					return `st.push(window.funs.${instr.data});`;
				else if(builtins.includes(instr.data))
					return `st.push(__${instr.data});`;
				else
					throw `${instr.data} is not a variable or function.`;
			case types.Instr_Type.ls:
				return `st.push((() => {\n${tabs(indent + 1)}let st = [];\n${compile_rec(instr.items, indent + 1, locals, vars, funs)}\n${tabs(indent + 1)}return st.reverse();\n${tabs(indent)}})())`;
			case types.Instr_Type.obj:
				return `st.push({\n${instr.pairs.map(({key, value}) => `${tabs(indent + 1)}${key}: (() => {\n${compile_rec(value, indent + 2, locals, vars, funs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()`).join(",\n")}\n${tabs(indent)}});`;
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
							? `if((() => {\n${compile_rec(branch.cond, indent + 2, locals, vars, funs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()) `
							: ""
					}{\n${compile_rec(branch.body, indent + 1, locals, vars, funs)}\n${tabs(indent)}}`
				).join(" else ");
			case types.Instr_Type.for:
				return `for(const ${instr.var} of (() => {\n${compile_rec(instr.iter, indent + 2, locals, vars, funs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()) {\n${compile_rec(instr.body, indent + 1, [...locals, instr.var], vars, funs)}\n${tabs(indent)}}`;
			case types.Instr_Type.while:
				return `while((() => {\n${compile_rec(instr.cond, indent + 2, locals, vars, funs)}\n${tabs(indent + 2)}return st.pop();\n${tabs(indent + 1)}})()) {\n${compile_rec(instr.body, indent + 1, locals, vars, funs)}\n${tabs(indent)}}`;
			
			// Add deriv.
			case types.Instr_Type.local:
				if(!locals.includes(instr.var))
					locals = [...locals, instr.var];
				return `let ${instr.var} = (() => {\n${compile_rec([instr.def], indent + 1, locals, vars, funs)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})();`;
			case types.Instr_Type.var:
				if(locals.includes(instr.var))
					return `${instr.var} = (() => {\n${compile_rec([instr.def], indent + 1, locals, vars, funs)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})();`;
				else {
					if(!vars.includes(instr.var))
						vars = [...vars, instr.var];
					return `window.vars.${instr.var} = (() => {\n${compile_rec([instr.def], indent + 1, locals, vars, funs)}\n${tabs(indent + 1)}return st.pop();\n${tabs(indent)}})();`;
				}
			case types.Instr_Type.fun:
				funs = [...funs, instr.fun];
				return `window.funs.${instr.fun} = (st, out) => {\n${instr.args.map(arg => `${tabs(indent + 1)}let ${arg} = st.pop();\n`).join("")}${compile_rec(instr.body, indent + 1, [...locals, ...instr.args], vars, funs)}\n${tabs(indent)}}`
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