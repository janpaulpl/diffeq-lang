let types = [
	"op", "name", "ref", "obj", "prop", "ls", "num", "str", // Basic
	"if", "for", "while", "var", "fun", // Structures
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