"use strict";

let past = [""];
let travel = 1;

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
				console.log(result);
				past.push(prog);
				travel = past.length;
				
				$("#log").append(`
					<p class="user-code-repeat">${escape_input(prog)}</p>
					${main.format(result)}
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