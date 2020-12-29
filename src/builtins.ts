function __print(st) {
	console.log(st.pop());
}

function __true(st) {
	st.push(true);
}

function __false(st) {
	st.push(false);
}

export {__print, __true, __false};