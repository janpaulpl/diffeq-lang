import types = require("./types");
import utils = require("./utils");
import expr = require("./expr");

function __print(st: any[], out: any[]) {
	out.push(st.pop());
}

function __true(st: any[]) {
	st.push(true);
}

function __false(st: any[]) {
	st.push(false);
}

function __call(st: any[], out: any[]) {
	st.pop()(st, out);
}

function __len(st: any[]) {
	st.push(st.pop().length);
}

function __map(st: any[], out: any[]) {
	let fun = st.pop();
	let list = st.pop();
	st.push(list.map(obj => {
		st.push(obj);
		fun(st, out);
		return st.pop();
	}));
}

function __filter(st: any[], out: any[]) {
	let fun = st.pop();
	let list = st.pop();
	st.push(list.filter(obj => {
		st.push(obj);
		fun(st, out);
		return st.pop();
	}))
}

function __reduce(st: any[], out: any[]) {
	let fun = st.pop();
	let init_acc = st.pop();
	let list = st.pop();
	st.push(list.reduce((acc: any, curr: any) => {
		st.push(curr);
		st.push(acc);
		fun(st, out);
		return st.pop();
	}, init_acc));
}

function __times(st: any[]) {
	let times = st.pop();
	st.push((new Array(times)).fill(0));
}

function __range(st: any[]) {
	let start = st.pop();
	let stop = st.pop();
	if(start <= stop) {
		st.push(Array.from(new Array(stop - start), (_, i) => i + start));
	} else {
		st.push(Array.from(new Array(start - stop), (_, i) => start - i));
	}
}

function __srange(st: any[]) {
	let start = st.pop();
	let stop = st.pop();
	let step = st.pop();
	if(stop - start < 0) {
		st.push([]);
	} else {
		st.push(Array.from(
			new Array(Math.ceil((stop - start) / step)),
			(_, i) => i * step + start)
		);
	}
}

function __enum(st: any[]) {
	st.push(st.pop().length);
	st.push(0);
	__range(st);
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

function __num_diff(st: any[]) {
	let ast = st.pop();
	let x = st.pop();
	let h = 0.0000009;
	
	// Ratio of difference
	st.push((expr.eval_at(ast, x + h) - expr.eval_at(ast, x)) / h);
}

function eq(a: any, b: any): boolean {
	let a_type = utils.to_type(a);
	let b_type = utils.to_type(b);
	
	if(a_type != b_type)
		return false;
	else if(["number", "string", "boolean"].includes(a_type))
		return a == b;
	else if(a_type == "array")
		if(a.length != b.length)
			return false;
		else
			return a.every((obj, i) => eq(obj, b[i]));
	else
		return false;
}

let __ops = {
	
	// Comparison
	
	"=="(st: any[]) {
		st.push(eq(st.pop(), st.pop()));
	},
	
	"!="(st: any[]) {
		st.push(!eq(st.pop(), st.pop()));
	},
	
	"<="(st: any[]) {
		st.push(st.pop() <= st.pop());
	},
	
	">="(st: any[]) {
		st.push(st.pop() >= st.pop());
	},
	
	"<"(st: any[]) {
		st.push(st.pop() < st.pop());
	},
	
	">"(st: any[]) {
		st.push(st.pop() > st.pop());
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
	
	"'"(st: any[]) {
		st.push(expr.derive(st.pop()));
	},
	
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
	},
	
	// Special interaction
	"?"(st: any[]) {
		st.push(window.res_hist[window.res_hist.length - 1]);
	},
	
	"??"(st: any[]) {
		st.push(window.res_hist[st.pop()]);
	}
};

export {__print, __true, __false, __call, __len, __map, __filter, __reduce, __times, __range, __srange, __enum, __pi, __e, __sin, __cos, __tan, __num_diff, __ops};