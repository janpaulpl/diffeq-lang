function __print(st: any[]) {
	console.log(st.pop());
}

function __true(st: any[]) {
	st.push(true);
}

function __false(st: any[]) {
	st.push(false);
}

function __pi(st: any[]) {
	st.push(Math.PI);
}

function __e(st: any[]) {
	st.push(Math.E);
}

function __sin(st: any[]) {
	st.push(Math.sin(st.pop()));
}

function __cos(st: any[]) {
	st.push(Math.cos(st.pop()));
}

function __tan(st: any[]) {
	st.push(Math.tan(st.pop()));
}

let __ops = {
	
	// Comparison
	
	// Fix for other types.
	"=="(st: any[]) {
		st.push(st.pop() == st.pop());
	},
	
	// Arithmetic
	
	"+"(st: any[]) {
		st.push(st.pop() + st.pop());
	},
	
	"~"(st:any[]) {
		st.push(-st.pop());
	},
	
	"-"(st: any[]) {
		st.push(st.pop() - st.pop());
	},
	
	"*"(st: any[]) {
		st.push(st.pop() * st.pop());
	},
	
	"/"(st: any[]) {
		st.push(st.pop() / st.pop());
	},
	
	// Extra math
	
	"^"(st: any[]) {
		st.push(st.pop() ** st.pop());
	},
	
	"%%"(st: any[]) {
		st.push(st.pop() % st.pop() == 0);
	},
	
	"%"(st: any[]) {
		st.push(st.pop() % st.pop());
	},
	
	// Derivation: "'"(st: any[]) { }
	
	// List indexing
	
	"@"(st: any[]) {
		st.push(st.pop()[st.pop()]);
	},
	
	// Boolean
	
	"&"(st: any[]) {
		st.push(st.pop() && st.pop());
	},
	
	"|"(st: any[]) {
		st.push(st.pop() || st.pop());
	},
	
	"!"(st: any[]) {
		st.push(!(st.pop()));
	}
	
	// Special interaction
	// Previous one: "?"(st: any[]) { }
	// Nth previous one: "??"(st: any[]) { }
};

export {__print, __true, __false, __pi, __e, __sin, __cos, __tan, __ops};