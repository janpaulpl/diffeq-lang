enum Node_Type {
	op, name, ref, obj, prop, ls, num, str, // Basic
	if, for, while, var, fun, // Structures
	cmmnt
}

enum Op {
	"==", "/=", "<=", ">=", "<", ">", // Comparison
	"+", "~", "-", "*", "/", // Arithmetic
	"^", "%%", "%", "'", // Extra math
	"@", // List indexing
	"&", "|", "!", // Boolean
	"??" // Special interaction
}