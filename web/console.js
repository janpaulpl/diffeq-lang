"use strict";

var past = [""];
var travel = 1;

$(function() {
	if(location.search.substring(6) != "") {
		var prog = decodeURIComponent(location.search.substring(6));
		$("#log").append(escape_input(prog) + "<br />");
		var result = main.run(prog);
		console.log(result);
		$("#log").append(escape_input(main.format(result)) + "<br />");
		past.push(prog);
		travel++;
	}
	
	$("#calc").keyup(function(key) {
		switch(key.which) {
			case 13:
				$(this).val($(this).val().replace(/[\n\r]/g, ""));
				var result = main.run($(this).val());
				console.log(result);
				past.push($(this).val().replace(/[\n\r]/g, ""));
				travel = past.length;
				history.replaceState("", "", "?calc=" + encodeURIComponent($(this).val().replace(/[\n\r]/g, "")));
				
				$("#log").append("calc= " + escape_input($(this).val()) + "<br />");
				$("#log").append(escape_input(main.format(result)) + "<br />");
				$(this).val("");
				$("#log").scrollTop($("#log")[0].scrollHeight);
				break;
			case 38:
				travel--;
				if(travel <= 0) {
					travel = 0;
				}
				$(this).val(past[travel]);
				var length = $(this).val().length * 2;
				setTimeout(() => this.setSelectionRange(length, length), 1);
				break;
			case 40:
				travel++;
				if(travel > past.length - 1) {
					travel = past.length;
					$(this).val("");
					setTimeout(() => this.setSelectionRange(6, 6), 1);
				} else {
					$(this).val(past[travel]);
					var length = $(this).val().length * 2;
					setTimeout(() => this.setSelectionRange(length, length), 1);
				}
				break;
		}
	});
	
	$("#calc").keydown(function() {
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