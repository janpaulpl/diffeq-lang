Block = _ instr_chunks:(Instrs _ (";" _ Instrs _)*)
	{return [instr_chunks[0], ...instr_chunks[2].map(instr => instr[2])]}

Instrs = _ instrs:(Instr _)*
	{return instrs.map(instr => instr[0]).reverse()}

Instr
	= Keywd
	/ Op
	/ Name
	/ Ref
	/ Ls
	/ Obj
	/ Prop
	/ Num
	/ Str
	/ Super_Str
	/ Expr

Keywd = If / For / While / Local / Var / Fun / Anon

If = "if" _ cond:Instrs _ ":" _ if_branch:Block _ elif_branches:("elif" _ Instrs _ ":" _ Block)* _ else_branch:("else" _ Block)? "end"?
	{return {type: types.Instr_Type.if, branches: [
		{cond, body: if_branch},
		...elif_branches.map(branch => ({cond: branch[2], body: branch[6]})),
		...(else_branch ? [{cond: null, body: else_branch[2]}] : [])
	]}}

For = "for" _ var_:Name _ iter:Instrs _ ":" _ body:Block "end"?
	{return {type: types.Instr_Type.for, var: var_.data, iter, body}}

While = "while" _ cond:Instrs _ ":" _ body:Block "end"?
	{return {type: types.Instr_Type.while, cond, body}}

Local = var_:Name deriv:"'"* _ ":=" _ def:Instrs
	{return {type: types.Instr_Type.local, var: var_.data, def, deriv_n: deriv.length}}

Var = var_:Name deriv:"'"* _ "=" _ def:Instrs
	{return {type: types.Instr_Type.var, var: var_.data, def, deriv_n: deriv.length}}

Fun = "fun" _ fun:Name _ args:(Name _)* ":" _ body:Block _ "end"?
	{return {type: types.Instr_Type.fun, fun: fun.data, args: args.map(arg => arg[0].data), body}}

Anon = "anon" _ args:(Name _)* ":" _ body:Block _ "end"?
	{return {type: types.Instr_Type.anon, args: args.map(arg => arg[0].data), body}}

Op
	= (
		"==" / "!=" / "<=" / ">=" / "<" / ">" /
		"+" / "~" / "-" / "*" / "/" /
		"^" / "%%" / "%" / "'" /
		"@" /
		"&" / "|" / "!" /
		"??" / "?")
		{return {type: types.Instr_Type.op, data: types.Op[text()]}}

Name = ! ("if"/"else"/"elif"/"end"/"for"/"while"/"var"/"fun"/"anon") [A-Za-z_][A-Za-z0-9_]*
	{return {type: types.Instr_Type.name, data: text()}}

Ref = "`" ref:Name
	{return {type: types.Instr_Type.ref, data: ref.data}}

Ls = "[" instrs:Instrs "]"?
	{return {type: types.Instr_Type.ls, items: instrs}}

Obj = "#[" _ pairs:(":" Name Instrs)* "]"? {return {
	type: types.Instr_Type.obj,
	pairs: pairs.map(
		pair => {return {key: pair[1].data, value: pair[2]}}
	)
}}

Prop = "." prop:Name
	{return {type: types.Instr_Type.prop, data: prop.data}}

Num = [0-9]+ ("." [0-9]+)?
	{return {type: types.Instr_Type.num, data: parseFloat(text())}}

Str = '"' ([^"\\] / ("\\" .))* '"' {return {
	type: types.Instr_Type.str,
	data: text().slice(1, -1) // .replace(/\\n/g, "\n").replace(/\\(.)/g, "$1")
}}

Super_Str = "\\" .* {return {
	type: types.Instr_Type.str,
	data: text().slice(1).replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}}

_ = ([ \t\n\r] / Cmmnt)*

Cmmnt = "#(" [^)]* ")"

Expr = "{" _ terms:Terms _ "}"
	{return {type: types.Instr_Type.expr, data: terms}}

Terms = prod:Prods prods:(_ [+\-] _ Terms)? _
	{return (
		!prods
			? prod
			: {
				type: types.Expr_Type[prods[1]],
				left: prod,
				right: prods[3]
			}
	)}

Prods = exp:Exps exps:(_ [*/]? _ Prods)? _
	{return (
		!exps
			? exp
			: {
				type: exps[1] == "/" ? types.Expr_Type["/"] : types.Expr_Type["*"],
				left: exp,
				right: exps[3]
			}
	)}

Exps = final:Final finals:(_ "^" _ Exps)? _
	{return (
		!finals
			? final
			: {
				type: types.Expr_Type["^"],
				left: final,
				right: finals[3]
			}
	)}

Final
	= pos:"~"? val:(
		Parens /
		Math_Call /
		Math_Const /
		Expr_Var /
		Expr_Num)
		{return (
			!pos
				? val
				: {
					type: types.Expr_Type["-"],
					left: {type: types.Expr_Type.num, data: 0},
					right: val
				}
		)}

Parens = "(" _ data:Terms _ ")"
	{return data}

Math_Call = Math_Call_1 / Math_Call_2 / Math_Call_3

Math_Call_1 = name:Math_Fun_1 _ "(" _ arg:Terms _ ")"
	{return {type: types.Expr_Type.call, name, args: [arg]}}
Math_Call_2 = name:Math_Fun_2 _ "(" _ arg1:Terms _ "," _ arg2:Terms _ ")"
	{return {type: types.Expr_Type.call, name, args: [arg1, arg2]}}
Math_Call_3 = name:Math_Fun_3 _ "(" _ arg1:Terms _ "," _ arg2:Terms _ "," _ arg3:Terms _ ")"
	{return {type: types.Expr_Type.call, name, args: [arg1, arg2, arg3]}}

Math_Fun_1 = (
	"abs" / "sqrt" / "cbrt" / "ln" /
	"cosh" / "sinh" / "tanh" / "coth" / "sech" / "csch" /
	"cos" / "sin" / "tan" / "cot" / "sec" / "csc" /
	"arccosh" / "arcsinh" / "arctanh" / "arccoth" / "arcsech" / "arccsch" /
	"arccos" / "arcsin" / "arctan" / "arccot" / "arcsec" / "arccsc")
Math_Fun_2 = "root" / "log"
Math_Fun_3 = "sum" / "prod"

Math_Const = ("pi" / "π" / "tau" / "τ" / "e")
	{return {type: types.Expr_Type.num, data: {
		pi: Math.PI, π: Math.PI,
		tau: 2 * Math.PI, τ: 2 * Math.PI,
		e: Math.E
	}[text()]}}

Expr_Var = "x"
	{return {type: types.Expr_Type.expr_var}}

Expr_Num = [0-9]+ ("." [0-9]+)?
	{return {type: types.Expr_Type.num, data: parseFloat(text())}}