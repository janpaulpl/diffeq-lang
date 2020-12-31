function __print(st: any[]) {
	console.log(st.pop());
}

function __true(st: any[]) {
	st.push(true);
}

function __false(st: any[]) {
	st.push(false);
}

let __ops = {
	
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
	
	"*"(st:any[]) {
		st.push(st.pop() * st.pop());
	},
	
	"/"(st:any[]) {
		st.push(st.pop() / st.pop());
	},
	
	// Extra math
	
	"^"(st:any[]) {
		st.push(st.pop() ** st.pop());
	},
	
	"%%"(st:any[]) {
		st.push(st.pop() % st.pop() == 0);
	},
	
	"%"(st:any[]) {
		st.push(st.pop() % st.pop());
	},
	
	// List indexing
	
	"@"(st:any[]) {
		st.push(st.pop()[st.pop()]);
	},

	// Boolean

	"&"(st:any[]) {
		st.push(st.pop())
	}
};

export {__print, __true, __false, __ops};