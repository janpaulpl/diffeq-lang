{
	let types = [
		"op", "name", "ref", "obj", "prop", "ls", "num", "str", // Basic
		"if", "for", "var", "fun", // Structures
		"cmmnt"
	];
	
	function type(name) {
		return types.indexOf(name);
	}
	
	let ops = [
		"==", "/=", "<=", ">=", "<", ">", // Comparison
		"+", "~", "-", "*", "/", // Arithmetic
		"^", "%%", "%", "'", // Extra math
		"@", // List indexing
		"&", "|", "!", // Boolean
		"??" // Special interaction
	];
}

Block = _ instr_chunks:(Instrs _ (";" _ Instrs _)*)
	{return [instr_chunks[0], ...instr_chunks[2].map(instr => instr[2])]}

Instrs = _ instrs:(Instr _)*
	{return instrs.map(instr => instr[0])}

Instr
	= Keywd
	/ Op
	/ Name
	/ Ref
	/ Obj
	/ Prop
	/ Ls
	/ Num
	/ Str
	/ Cmmnt

Keywd = If / For / Var / Fun

If = "if" _ cond:Block _ ":" _ if_branch:Block _ elif_branches:("elif" _ Block _ ":" _ Block)* _ else_branch:("else" _ Block)? "end"
	{return {type: type("if"), branches: [
		{cond, body: if_branch},
		...elif_branches.map(branch => ({cond: branch[2], body: branch[6]})),
		...(else_branch ? [{cond: false, body: else_branch[2]}] : [])
	]}}

For = "for" _ var_:Name _ iter:Block _ ":" _ body:Block "end"
	{return {type: type("for"), iter, var: var_.data, body}}

Var = "=" _ var_:Name deriv:"'"* _ def:Instrs _ ";"
	{return {type: type("var"), var: var_.data, def, deriv_n: deriv.length}}

Fun = "fun" _ fun:Name _ args:(Name _)* ":" _ body:Block _ "end"
	{return {type: type("fun"), fun: fun.data, args: args.map(arg => arg[0].data), body}}

Op
	= (
		"==" / "/=" / "<=" / ">=" / "<" / ">" /
		"+" / "~" / "-" / "*" / "/" /
		"^" / "%%" / "%" / "'" /
		"@" /
		"&" / "|" / "!")
		{return {type: type("op"), data: ops.indexOf(text())}}
	/ "??"
		{return {type: type("op"), data: ops.indexOf("??"), num: 0}}
	/ "?" num:Num
		{return {type: type("op"), data: ops.indexOf("??"), num: num.data}}

Name = ! ("if"/"else"/"elif"/"end"/"for"/"var"/"fun") [A-Za-z_][A-Za-z0-9_]*
	{return {type: type("name"), data: text()}}

Ref = "`" ref:Name
	{return {type: type("ref"), data: ref.data}}

Obj = "[" _ pairs:(":" Name Block)* "]" {return {
	type: type("obj"),
	data: pairs.map(
		pair => {return {key: pair[1].name, value: pair[2]}}
	)
}}

Prop = "." prop:Name
	{return {type: type("prop"), data: prop.data}}

Ls = "[" instrs:Block "]"
	{return {type: type("ls"), data: instrs}}

Num = [0-9]+ ("." [0-9]+)?
	{return {type: type("num"), data: parseFloat(text())}}

Str = '"' ([^"\\] / ("\\" .))* '"' {return {
	type: type("str"),
	data: text().slice(1, -1).replace("\\n", "\n").replace(/\\(.)/g, "$1")}
}

Cmmnt = "#(" [^)]* ")" {return {type: type("cmmnt"), cmmnt: text().slice(2, -1)}}

_ = [ \t\n\r]*