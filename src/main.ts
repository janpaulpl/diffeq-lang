// import exa = require("./exa");


function run(prog: string) {
	return JSON.parse(prog);
}

let format = JSON.stringify;

module.exports = {run, format};