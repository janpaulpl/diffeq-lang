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
	/ Expr

Keywd = If / For / While / Local / Var / Fun

If = "if" _ cond:Block _ ":" _ if_branch:Block _ elif_branches:("elif" _ Block _ ":" _ Block)* _ else_branch:("else" _ Block)? "end"?
	{return {type: types.Instr_Type.if, branches: [
		{cond, body: if_branch},
		...elif_branches.map(branch => ({cond: branch[2], body: branch[6]})),
		...(else_branch ? [{cond: null, body: else_branch[2]}] : [])
	]}}

For = "for" _ var_:Name _ iter:Block _ ":" _ body:Block "end"?
	{return {type: types.Instr_Type.for, var: var_.data, iter, body}}

While = "while" _ cond:Block _ ":" _ body:Block "end"?
	{return {type: types.Instr_Type.while, cond, body}}

Local = var_:Name deriv:"'"* _ ":=" _ def:Instrs _ ";"?
	{return {type: types.Instr_Type.local, var: var_.data, def, deriv_n: deriv.length}}

Var = var_:Name deriv:"'"* _ "=" _ def:Instrs _ ";"?
	{return {type: types.Instr_Type.var, var: var_.data, def, deriv_n: deriv.length}}

Fun = "fun" _ fun:Name _ args:(Name _)* ":" _ body:Block _ "end"?
	{return {type: types.Instr_Type.fun, fun: fun.data, args: args.map(arg => arg[0].data), body}}

Op
	= (
		"==" / "!=" / "<=" / ">=" / "<" / ">" /
		"+" / "~" / "-" / "*" / "/" /
		"^" / "%%" / "%" / "'" /
		"@" /
		"&" / "|" / "!" /
		"??" / "?")
		{return {type: types.Instr_Type.op, data: types.Op[text()]}}

Name = ! ("if"/"else"/"elif"/"end"/"for"/"while"/"var"/"fun") [A-Za-z_][A-Za-z0-9_]*
	{return {type: types.Instr_Type.name, data: text()}}

Ref = "`" ref:Name
	{return {type: types.Instr_Type.ref, data: ref.data}}

Ls = "[" instrs:Block "]"
	{return {type: types.Instr_Type.ls, items: instrs}}

Obj = "#[" _ pairs:(":" Name Block)* "]" {return {
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
	data: text().slice(1, -1) // .replace("\\n", "\n").replace(/\\(.)/g, "$1")
}}

Expr = "{" _ Eq _ "}"

Eq = Math_Expr (_ "=" _ Math_Expr)? _

Math_Expr = Terms (_ [+\-] _ Terms)* _

Terms = Prods (_ [*/]? _ Prods)* _

Prods = Final (_ "^" _ Final)* _

Final
	= "(" _ Math_Expr _ ")"
	/ Math_Call
	/ Math_Const
	/ "x" / "y"
	/ [a-wz]
	/ Num

Math_Call
	= Math_Func_1 _ "(" _ Math_Expr _ ")"
	/ Math_Func_2 _ "(" _ Math_Expr _ "," _ Math_Expr _ ")"
	/ Math_Func_3 _ "(" _ Math_Expr _ "," _ Math_Expr _ "," _ Math_Expr _ ")"

Math_Func_1 = (
	"abs" / "sqrt" / "cbrt" / "ln" /
	"cosh" / "sinh" / "tanh" / "coth" / "sech" / "csch" /
	"cos" / "sin" / "tan" / "cot" / "sec" / "csc" /
	"arccosh" / "arcsinh" / "arctanh" / "arccoth" / "arcsech" / "arccsch" /
	"arccos" / "arcsin" / "arctan" / "arccot" / "arcsec" / "arccsc")
Math_Func_2 = "root" / "log"
Math_Func_3 = "sum" / "prod"

Math_Const = "pi" / "π" / "tau" / "τ" / "e"

_ = ([ \t\n\r] / Cmmnt)*

Cmmnt = "#(" [^)]* ")"