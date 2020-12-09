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

/*
Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "/") { return result / element[3]; }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Integer

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
*/