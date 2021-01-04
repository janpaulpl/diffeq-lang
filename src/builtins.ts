function __print(st: any[], out: any[]) {
	out.push(st.pop());
}

function __true(st: any[], out: any[]) {
	st.push(true);
}

function __false(st: any[], out: any[]) {
	st.push(false);
}

function __pi(st: any[], out: any[]) {
	st.push(Math.PI);
}

function __e(st: any[], out: any[]) {
	st.push(Math.E);
}

function __sin(st: any[], out: any[]) {
	st.push(Math.sin(st.pop()));
}

function __cos(st: any[], out: any[]) {
	st.push(Math.cos(st.pop()));
}

function __tan(st: any[], out: any[]) {
	st.push(Math.tan(st.pop()));
}

let __ops = {
	
	// Comparison
	
	// Fix for other types.
	"=="(st: any[], out: any[]) {
		st.push(st.pop() == st.pop());
	},
	
	// Arithmetic
	
	"+"(st: any[], out: any[]) {
		st.push(st.pop() + st.pop());
	},
	
	"~"(st:any[]) {
		st.push(-st.pop());
	},
	
	"-"(st: any[], out: any[]) {
		st.push(st.pop() - st.pop());
	},
	
	"*"(st: any[], out: any[]) {
		st.push(st.pop() * st.pop());
	},
	
	"/"(st: any[], out: any[]) {
		st.push(st.pop() / st.pop());
	},
	
	// Extra math
	
	"^"(st: any[], out: any[]) {
		st.push(st.pop() ** st.pop());
	},
	
	"%%"(st: any[], out: any[]) {
		st.push(st.pop() % st.pop() == 0);
	},
	
	"%"(st: any[], out: any[]) {
		st.push(st.pop() % st.pop());
	},
	
	// Derivation: "'"(st: any[], out: any[]) { }
	
	// List indexing
	
	"@"(st: any[], out: any[]) {
		st.push(st.pop()[st.pop()]);
	},
	
	// Boolean
	
	"&"(st: any[], out: any[]) {
		st.push(st.pop() && st.pop());
	},
	
	"|"(st: any[], out: any[]) {
		st.push(st.pop() || st.pop());
	},
	
	"!"(st: any[], out: any[]) {
		st.push(!(st.pop()));
	}
	
	// Special interaction
	// Previous one: "?"(st: any[], out: any[]) { }
	// Nth previous one: "??"(st: any[], out: any[]) { }
};

export {__print, __true, __false, __pi, __e, __sin, __cos, __tan, __ops};