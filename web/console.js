"use strict";

let past = [""];
let travel = 1;
window.res_hist = [];
let res_cou = 0;

$(function() {
	$("#code-box").keyup(function(key) {
		switch(key.which) {
			case 13:
				let prog = $(this).val().replace(/[\n\r]/g, "");
				$(this).val("");
				
				let result;
				try {
					result = main.run(prog);
				} catch(err) {
					result = [escape_input(main.err_to_str(err))];
				}
				
				past.push(prog);
				travel = past.length;
				
				$("#log").append(`
					<p class="user-code-repeat">${escape_input(prog)}</p>
					${format(result)}
				`);
				$("#log").scrollTop($("#log")[0].scrollHeight);
				break;
			case 38:
				travel--;
				if(travel <= 0) {
					travel = 0;
				}
				$(this).val(past[travel]);
				let length = $(this).val().length * 2;
				setTimeout(() => this.setSelectionRange(length, length), 1);
				break;
			case 40:
				travel++;
				if(travel > past.length - 1) {
					travel = past.length;
					$(this).val("");
				} else {
					$(this).val(past[travel]);
					let length = $(this).val().length * 2;
					setTimeout(() => this.setSelectionRange(length, length), 1);
				}
				break;
		}
	});
	
	$("#code-box").keydown(function() {
		$(this).val($(this).val().replace(/[\n\r]/g, ""));
	});
});

function escape_input(string) {
	return string
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
		.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
		.replace(/\n/g, "<br />");
}

function format(out) {
	let str = "";
	
	if(out.length > 1) {
		str = `<button onclick="$('#code-box').val($('#code-box').val() + '??' + (${res_cou++}).toString())">Exa</button>`;
		res_hist.push(out);
	}
	
	str += out.map(o => `<p>${stringify(o)} <button onclick="$('#code-box').val($('#code-box').val() + '??' + (${res_cou++}).toString())">Tst</button> </p>`).join("");
	for(let obj of out)
		res_hist.push(obj);
	
	return str;
}

function stringify(obj) {
	let obj_type = to_type(obj);
	if(obj_type == "number" || obj_type == "string") {
		return obj.toString();
	} else if(obj_type == "array") {
		return `[${obj.map(stringify).join(" ")}]`;
	}
}

function to_type(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}