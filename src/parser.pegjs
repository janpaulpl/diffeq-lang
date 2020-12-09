{
	let instr_types = {
		op: 0, var: 1, ref: 2, obj: 3, ls: 4, num: 5, str: 6
	};
	
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
		{return {type: instr_types.op, data: ops.indexOf(text())}}
	/ "??"
		{return {type: instr_types.op, data: ops.indexOf("??"), num: 0}}
	/ "?" num:Num
		{return {type: instr_types.op, data: ops.indexOf("??"), num: num.data}}

Var = [A-Za-z_][A-Za-z0-9_]*
	{return {type: instr_types.var, data: text()}}

Ref = "'" var_:Var
	{return {type: instr_types.ref, data: var_.data}}

Obj = "[" _ pairs:(":" Var Instrs)* "]" {return {
	type: instr_types.obj,
	data: pairs.map(
		pair => {return {key: pair[1].name, value: pair[2]}}
	)
}}

Ls = "[" instrs:Instrs "]"
	{return {type: instr_types.ls, data: instrs}}

Num = [0-9]+ ("." [0-9]+)?
	{return {type: instr_types.num, data: parseFloat(text())}}

Str = '"' ([^"\\] / ("\\" .))* '"' {return {
	type: instr_types.str,
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