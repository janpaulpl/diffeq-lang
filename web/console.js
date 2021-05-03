"use strict";

let past = [""];
let travel = 1;
window.vars = {};
window.funs = {};
window.res_hist = [];
window.graph_w = 400;
window.graph_h = 400;
window.graph_zoom = 40;
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
				
				for(let graph of document.querySelectorAll("canvas[render]")) {
					let ast = JSON.parse(graph.getAttribute("render"));
					graph.removeAttribute("render");
					
					let ctx = graph.getContext("2d");
					
					ctx.setLineDash([5, 5]);
					ctx.strokeStyle = "blue";
					
					ctx.beginPath();
					ctx.moveTo(graph_w / 2, 0);
					ctx.lineTo(graph_w / 2, graph_h);
					ctx.moveTo(0, graph_h / 2);
					ctx.lineTo(graph_w, graph_h / 2);
					ctx.stroke();
					
					for(let i = 0; i < graph_w; i += 2) {
						ctx.fillRect(i, graph_h / 2 - main.eval_at(ast, (i - graph_w / 2) / graph_zoom) * graph_zoom, 2, 2);
					}
				}
				
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
		str = `<p> <button onclick="$('#code-box').val($('#code-box').val() + '??' + (${res_cou++}).toString())">Get all</button> </p>`;
		res_hist.push(out);
	}
	
	str += out.map(obj_to_elem).join("");
	for(let obj of out)
		res_hist.push(obj);
	
	return str;
}

function obj_to_elem(obj) {
	if(!(obj instanceof main.Expr)) {
		return `<p class="indented">${stringify(obj)} <button onclick="$('#code-box').val($('#code-box').val() + '??' + (${res_cou++}).toString())">Get</button> </p>`;
	} else {
		return `<p class="indented"><canvas width=${graph_w} height=${graph_h} render='${JSON.stringify(obj)}'></canvas> <button onclick="$('#code-box').val($('#code-box').val() + '??' + (${res_cou++}).toString())">Get</button> </p>`;
	}
}

function stringify(obj) {
	let obj_type = main.to_type(obj);
	if(obj_type == "number" || obj_type == "string" || obj_type == "boolean") {
		return obj.toString();
	} else if(obj_type == "array") {
		return `[${obj.map(stringify).join(" ")}]`;
	} else if(obj instanceof main.Expr) {
		return `{${main.stringify_expr(obj)}}`;
	} else if(obj_type == "object") {
		return `#[${Object.entries(obj).map(([key, val]) => `:${key} ${stringify(val)}`).join(" ")}]`;
	}
}