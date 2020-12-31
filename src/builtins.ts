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
	}
};

export {__print, __true, __false, __ops};