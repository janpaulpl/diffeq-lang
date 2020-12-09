{
	let types = ["op", "var", "ref", "obj", "prop", "ls", "num", "str"];
	
	function type(name) {
		return types.indexOf(name);
	}
	
	let ops = [
		"=", "/=", "<=", ">=", "<", ">",
		"+", "~", "-", "*", "/",
		"^", "%%", "%",
		"!!",
		"&", "|", "!",
		"??"
	];
}

Instrs = _ instrs:(Instr _)*
	{return instrs.map(instr => instr[0])}

Instr
	= Op
	/ Var
	/ Ref
	/ Obj
	/ Prop
	/ Ls
	/ Num
	/ Str

Op
	= (
		"=" / "/=" / "<=" / ">=" / "<" / ">" /
		"+" / "~" / "-" / "*" / "/" /
		"^" / "%%" / "%" /
		"!!" /
		"&" / "|" / "!")
		{return {type: type("op"), data: ops.indexOf(text())}}
	/ "??"
		{return {type: type("op"), data: ops.indexOf("??"), num: 0}}
	/ "?" num:Num
		{return {type: type("op"), data: ops.indexOf("??"), num: num.data}}

Var = [A-Za-z_][A-Za-z0-9_]*
	{return {type: type("var"), data: text()}}

Ref = "'" ref:Var
	{return {type: type("ref"), data: ref.data}}

Obj = "[" _ pairs:(":" Var Instrs)* "]" {return {
	type: type("obj"),
	data: pairs.map(
		pair => {return {key: pair[1].name, value: pair[2]}}
	)
}}

Prop = "." prop:Var
	{return {type: type("prop"), data: prop.data}}

Ls = "[" instrs:Instrs "]"
	{return {type: type("ls"), data: instrs}}

Num = [0-9]+ ("." [0-9]+)?
	{return {type: type("num"), data: parseFloat(text())}}

Str = '"' ([^"\\] / ("\\" .))* '"' {return {
	type: type("str"),
	data: text().slice(1, -1).replace("\\n", "\n").replace(/\\(.)/g, "$1")}
}

_ = [ \t\n\r]*