{
	let types = [
		"op", "name", "ref", "obj", "prop", "ls", "num", "str",
		"if", "for", "var", "fun"
	];
	
	function type(name) {
		return types.indexOf(name);
	}
	
	let ops = [
		"==", "/=", "<=", ">=", "<", ">",
		"+", "~", "-", "*", "/",
		"^", "%%", "%",
		"!!",
		"&", "|", "!",
		"??"
	];
}

Block = _ instr_chunks:(Instrs _ ("," _ Instrs _)*)
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

Keywd = If / For / Var / Fun

If = "if" _ cond:Block _ ":" _ if_branch:Block _ ";" _ else_branch:Block ";"
	{return {type: type("if"), cond, if_branch, else_branch}}

For = "for" _ iter:Block _ ":" _ var_:Name _ body:Block ";"
	{return {type: type("for"), iter, var: var_.data, body}}

Var = "var" _ var_:Name _ "=" _ def:Block _ ";"
	{return {type: type("var"), var: var_.data, def}}

Fun = "fun" _ fun:Name _ args:(Name _)* ":" _ body:Block _ ";"
	{return {type: type("fun"), fun: fun.data, args: args.map(arg => arg[0].data), body}}

Op
	= (
		"==" / "/=" / "<=" / ">=" / "<" / ">" /
		"+" / "~" / "-" / "*" / "/" /
		"^" / "%%" / "%" /
		"!!" /
		"&" / "|" / "!")
		{return {type: type("op"), data: ops.indexOf(text())}}
	/ "??"
		{return {type: type("op"), data: ops.indexOf("??"), num: 0}}
	/ "?" num:Num
		{return {type: type("op"), data: ops.indexOf("??"), num: num.data}}

Name = [A-Za-z_][A-Za-z0-9_]*
	{return {type: type("name"), data: text()}}

Ref = "'" ref:Name
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

_ = [ \t\n\r]*