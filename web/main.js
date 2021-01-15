(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.main = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
exports.__esModule = true;
exports.__ops = exports.__tan = exports.__cos = exports.__sin = exports.__e = exports.__pi = exports.__srange = exports.__range = exports.__times = exports.__map = exports.__false = exports.__true = exports.__print = void 0;
function __print(st, out) {
    out.push(st.pop());
}
exports.__print = __print;
function __true(st, out) {
    st.push(true);
}
exports.__true = __true;
function __false(st, out) {
    st.push(false);
}
exports.__false = __false;
function __map(st, out) {
    var fun = st.pop();
    var list = st.pop();
    st.push(list.map(function (obj) {
        st.push(obj);
        fun(st, out);
        return st.pop();
    }));
}
exports.__map = __map;
function __times(st, out) {
    var times = st.pop();
    st.push((new Array(times)).fill(0));
}
exports.__times = __times;
function __range(st, out) {
    var start = st.pop();
    var stop = st.pop();
    if (start <= stop) {
        st.push(Array.from(new Array(stop - start), function (_, i) { return i + start; }));
    }
    else {
        st.push(Array.from(new Array(start - stop), function (_, i) { return start - i; }));
    }
}
exports.__range = __range;
function __srange(st, out) {
    var start = st.pop();
    var stop = st.pop();
    var step = st.pop();
    if (stop - start < 0) {
        st.push([]);
    }
    else {
        st.push(Array.from(new Array(Math.ceil((stop - start) / step)), function (_, i) { return i * step + start; }));
    }
}
exports.__srange = __srange;
function __pi(st, out) {
    st.push(Math.PI);
}
exports.__pi = __pi;
function __e(st, out) {
    st.push(Math.E);
}
exports.__e = __e;
function __sin(st, out) {
    st.push(Math.sin(st.pop()));
}
exports.__sin = __sin;
function __cos(st, out) {
    st.push(Math.cos(st.pop()));
}
exports.__cos = __cos;
function __tan(st, out) {
    st.push(Math.tan(st.pop()));
}
exports.__tan = __tan;
var __ops = {
    // Comparison
    // Fix for other types.
    "==": function (st, out) {
        st.push(st.pop() == st.pop());
    },
    "!=": function (st, out) {
        st.push(st.pop() != st.pop());
    },
    "<=": function (st, out) {
        st.push(st.pop() <= st.pop());
    },
    ">=": function (st, out) {
        st.push(st.pop() >= st.pop());
    },
    "<": function (st, out) {
        st.push(st.pop() < st.pop());
    },
    ">": function (st, out) {
        st.push(st.pop() > st.pop());
    },
    // Arithmetic
    "+": function (st, out) {
        st.push(st.pop() + st.pop());
    },
    "~": function (st) {
        st.push(-st.pop());
    },
    "-": function (st, out) {
        st.push(st.pop() - st.pop());
    },
    "*": function (st, out) {
        st.push(st.pop() * st.pop());
    },
    "/": function (st, out) {
        st.push(st.pop() / st.pop());
    },
    // Extra math
    "^": function (st, out) {
        st.push(Math.pow(st.pop(), st.pop()));
    },
    "%%": function (st, out) {
        st.push(st.pop() % st.pop() == 0);
    },
    "%": function (st, out) {
        st.push(st.pop() % st.pop());
    },
    // Derivation: "'"(st: any[], out: any[]) { }
    // List indexing
    "@": function (st, out) {
        st.push(st.pop()[st.pop()]);
    },
    // Boolean
    "&": function (st, out) {
        st.push(st.pop() && st.pop());
    },
    "|": function (st, out) {
        st.push(st.pop() || st.pop());
    },
    "!": function (st, out) {
        st.push(!(st.pop()));
    },
    // Special interaction
    "?": function (st, out) {
        st.push(window.res_hist[window.res_hist.length - 1]);
    },
    "??": function (st, out) {
        st.push(window.res_hist[st.pop()]);
    }
};
exports.__ops = __ops;

},{}],2:[function(require,module,exports){
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.compile = void 0;
var types = require("./types");
var prelude = "with(main.builtins) {\n\nlet st = [];\nlet out = [];\n";
var postlude = "\n\nout = [...out, ...st];\nout;\n}";
var builtins = [
    "print", "true", "false", "map", "times", "range", "srange",
    "pi", "e", "tau",
    "sin", "cos", "tan", "cot", "sec", "csc"
];
function compile(ast) {
    return prelude + compile_rec(ast, 0, [], []) + postlude;
}
exports.compile = compile;
function compile_rec(ast, indent, vars, funs) {
    var compiled = ast.map(function (instrs) { return instrs.map(function (instr) {
        switch (instr.type) {
            case types.Instr_Type.op:
                return "__ops[\"" + types.Op[instr.data] + "\"](st, out);";
            case types.Instr_Type.name:
                if (instr.data == "debug")
                    return "debugger;";
                if (vars.includes(instr.data))
                    return "st.push(" + instr.data + ");";
                else if (funs.includes(instr.data) || instr.data in window.funs)
                    return "window.funs." + instr.data + "(st, out);";
                else if (builtins.includes(instr.data))
                    return "__" + instr.data + "(st, out);";
                else
                    throw instr.data + " is not a variable or function.";
            case types.Instr_Type.ref:
                if (vars.includes(instr.data))
                    return "st.push(" + instr.data + ");";
                else if (funs.includes(instr.data) || instr.data in window.funs)
                    return "st.push(window.funs." + instr.data + ");";
                else if (builtins.includes(instr.data))
                    return "st.push(__" + instr.data + ");";
                else
                    throw instr.data + " is not a variable or function.";
            case types.Instr_Type.ls:
                return "st.push((() => {\n" + tabs(indent + 1) + "let st = [];\n" + compile_rec(instr.items, indent + 1, vars, funs) + "\n" + tabs(indent + 1) + "return st.reverse();\n" + tabs(indent) + "})())";
            case types.Instr_Type.obj:
                return "st.push({\n" + instr.pairs.map(function (_a) {
                    var key = _a.key, value = _a.value;
                    return "" + tabs(indent + 1) + key + ": (() => {\n" + compile_rec(value, indent + 2, vars, funs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()";
                }).join(",\n") + "\n" + tabs(indent) + "});";
            case types.Instr_Type.prop:
                return "st.push(st.pop()." + instr.data + ");";
            case types.Instr_Type.num:
                return "st.push(" + instr.data + ");";
            case types.Instr_Type.str:
                return "st.push(\"" + instr.data + "\");";
            case types.Instr_Type["if"]:
                return instr.branches.map(function (branch) {
                    return (branch.cond
                        ? "if((() => {\n" + compile_rec(branch.cond, indent + 2, vars, funs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()) "
                        : "") + "{\n" + compile_rec(branch.body, indent + 1, vars, funs) + "\n" + tabs(indent) + "}";
                }).join(" else ");
            case types.Instr_Type["for"]:
                return "for(const " + instr["var"] + " of (() => {\n" + compile_rec(instr.iter, indent + 2, vars, funs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()) {\n" + compile_rec(instr.body, indent + 1, __spreadArrays(vars, [instr["var"]]), funs) + "\n" + tabs(indent) + "}";
            case types.Instr_Type["while"]:
                return "while((() => {\n" + compile_rec(instr.cond, indent + 2, vars, funs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()) {\n" + compile_rec(instr.body, indent + 1, vars, funs) + "\n" + tabs(indent) + "}";
            // Add deriv.
            case types.Instr_Type.local:
                vars = __spreadArrays(vars, [instr["var"]]);
                return "let " + instr["var"] + " = (() => {\n" + compile_rec([instr.def], indent + 1, vars, funs) + "\n" + tabs(indent + 1) + "return st.pop();\n" + tabs(indent) + "})();";
            case types.Instr_Type["var"]:
                if (!vars.includes(instr["var"]))
                    vars = __spreadArrays(vars, [instr["var"]]);
                return instr["var"] + " = (() => {\n" + compile_rec([instr.def], indent + 1, vars, funs) + "\n" + tabs(indent + 1) + "return st.pop();\n" + tabs(indent) + "})();";
            case types.Instr_Type.fun:
                funs = __spreadArrays(funs, [instr.fun]);
                return "window.funs." + instr.fun + " = (st, out) => {\n" + instr.args.map(function (arg) { return tabs(indent + 1) + "let " + arg + " = st.pop();\n"; }).join("") + compile_rec(instr.body, indent + 1, __spreadArrays(vars, instr.args), funs) + "\n" + tabs(indent) + "}";
            default:
                return "NOT OP;";
        }
    }); });
    return compiled.map(function (comp_instrs) {
        return comp_instrs.map(function (instr) {
            return tabs(indent) + instr;
        }).join("\n");
    }).join("\n");
}
function tabs(indent) {
    return "\t".repeat(indent);
}

},{"./types":5}],3:[function(require,module,exports){
exports.__esModule = true;
exports.builtins = exports.err_to_str = exports.run = void 0;
var parser = require("./parser");
var compiler = require("./compiler");
var builtins = require("./builtins");
exports.builtins = builtins;
function run(prog) {
    return eval(compiler.compile(parser.parse(prog)));
}
exports.run = run;
var err_to_str = function (err) { return !(err instanceof Error)
    ? err
    : err.stack.split("\n").slice(0, 2).join("\n\t"); };
exports.err_to_str = err_to_str;

},{"./builtins":1,"./compiler":2,"./parser":4}],4:[function(require,module,exports){
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var types = require("./types");
/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
"use strict";
function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
}
function peg$SyntaxError(message, expected, found, location) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";
    if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
    }
}
peg$subclass(peg$SyntaxError, Error);
peg$SyntaxError.buildMessage = function (expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
        literal: function (expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
        },
        "class": function (expectation) {
            var escapedParts = "", i;
            for (i = 0; i < expectation.parts.length; i++) {
                escapedParts += expectation.parts[i] instanceof Array
                    ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                    : classEscape(expectation.parts[i]);
            }
            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },
        any: function (expectation) {
            return "any character";
        },
        end: function (expectation) {
            return "end of input";
        },
        other: function (expectation) {
            return expectation.description;
        }
    };
    function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
    }
    function literalEscape(s) {
        return s
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\0/g, '\\0')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
    }
    function classEscape(s) {
        return s
            .replace(/\\/g, '\\\\')
            .replace(/\]/g, '\\]')
            .replace(/\^/g, '\\^')
            .replace(/-/g, '\\-')
            .replace(/\0/g, '\\0')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x0F]/g, function (ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) { return '\\x' + hex(ch); });
    }
    function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }
    function describeExpected(expected) {
        var descriptions = new Array(expected.length), i, j;
        for (i = 0; i < expected.length; i++) {
            descriptions[i] = describeExpectation(expected[i]);
        }
        descriptions.sort();
        if (descriptions.length > 0) {
            for (i = 1, j = 1; i < descriptions.length; i++) {
                if (descriptions[i - 1] !== descriptions[i]) {
                    descriptions[j] = descriptions[i];
                    j++;
                }
            }
            descriptions.length = j;
        }
        switch (descriptions.length) {
            case 1:
                return descriptions[0];
            case 2:
                return descriptions[0] + " or " + descriptions[1];
            default:
                return descriptions.slice(0, -1).join(", ")
                    + ", or "
                    + descriptions[descriptions.length - 1];
        }
    }
    function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }
    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
    options = options !== void 0 ? options : {};
    var peg$FAILED = {}, peg$startRuleFunctions = { Block: peg$parseBlock }, peg$startRuleFunction = peg$parseBlock, peg$c0 = ";", peg$c1 = peg$literalExpectation(";", false), peg$c2 = function (instr_chunks) { return __spreadArrays([instr_chunks[0]], instr_chunks[2].map(function (instr) { return instr[2]; })); }, peg$c3 = function (instrs) { return instrs.map(function (instr) { return instr[0]; }).reverse(); }, peg$c4 = "if", peg$c5 = peg$literalExpectation("if", false), peg$c6 = ":", peg$c7 = peg$literalExpectation(":", false), peg$c8 = "elif", peg$c9 = peg$literalExpectation("elif", false), peg$c10 = "else", peg$c11 = peg$literalExpectation("else", false), peg$c12 = "end", peg$c13 = peg$literalExpectation("end", false), peg$c14 = function (cond, if_branch, elif_branches, else_branch) {
        return { type: types.Instr_Type["if"], branches: __spreadArrays([
                { cond: cond, body: if_branch }
            ], elif_branches.map(function (branch) { return ({ cond: branch[2], body: branch[6] }); }), (else_branch ? [{ cond: null, body: else_branch[2] }] : [])) };
    }, peg$c15 = "for", peg$c16 = peg$literalExpectation("for", false), peg$c17 = function (var_, iter, body) { return { type: types.Instr_Type["for"], "var": var_.data, iter: iter, body: body }; }, peg$c18 = "while", peg$c19 = peg$literalExpectation("while", false), peg$c20 = function (cond, body) { return { type: types.Instr_Type["while"], cond: cond, body: body }; }, peg$c21 = "'", peg$c22 = peg$literalExpectation("'", false), peg$c23 = ":=", peg$c24 = peg$literalExpectation(":=", false), peg$c25 = function (var_, deriv, def) { return { type: types.Instr_Type.local, "var": var_.data, def: def, deriv_n: deriv.length }; }, peg$c26 = "=", peg$c27 = peg$literalExpectation("=", false), peg$c28 = function (var_, deriv, def) { return { type: types.Instr_Type["var"], "var": var_.data, def: def, deriv_n: deriv.length }; }, peg$c29 = "fun", peg$c30 = peg$literalExpectation("fun", false), peg$c31 = function (fun, args, body) { return { type: types.Instr_Type.fun, fun: fun.data, args: args.map(function (arg) { return arg[0].data; }), body: body }; }, peg$c32 = "==", peg$c33 = peg$literalExpectation("==", false), peg$c34 = "!=", peg$c35 = peg$literalExpectation("!=", false), peg$c36 = "<=", peg$c37 = peg$literalExpectation("<=", false), peg$c38 = ">=", peg$c39 = peg$literalExpectation(">=", false), peg$c40 = "<", peg$c41 = peg$literalExpectation("<", false), peg$c42 = ">", peg$c43 = peg$literalExpectation(">", false), peg$c44 = "+", peg$c45 = peg$literalExpectation("+", false), peg$c46 = "~", peg$c47 = peg$literalExpectation("~", false), peg$c48 = "-", peg$c49 = peg$literalExpectation("-", false), peg$c50 = "*", peg$c51 = peg$literalExpectation("*", false), peg$c52 = "/", peg$c53 = peg$literalExpectation("/", false), peg$c54 = "^", peg$c55 = peg$literalExpectation("^", false), peg$c56 = "%%", peg$c57 = peg$literalExpectation("%%", false), peg$c58 = "%", peg$c59 = peg$literalExpectation("%", false), peg$c60 = "@", peg$c61 = peg$literalExpectation("@", false), peg$c62 = "&", peg$c63 = peg$literalExpectation("&", false), peg$c64 = "|", peg$c65 = peg$literalExpectation("|", false), peg$c66 = "!", peg$c67 = peg$literalExpectation("!", false), peg$c68 = "??", peg$c69 = peg$literalExpectation("??", false), peg$c70 = "?", peg$c71 = peg$literalExpectation("?", false), peg$c72 = function () { return { type: types.Instr_Type.op, data: types.Op[text()] }; }, peg$c73 = "var", peg$c74 = peg$literalExpectation("var", false), peg$c75 = /^[A-Za-z_]/, peg$c76 = peg$classExpectation([["A", "Z"], ["a", "z"], "_"], false, false), peg$c77 = /^[A-Za-z0-9_]/, peg$c78 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_"], false, false), peg$c79 = function () { return { type: types.Instr_Type.name, data: text() }; }, peg$c80 = "`", peg$c81 = peg$literalExpectation("`", false), peg$c82 = function (ref) { return { type: types.Instr_Type.ref, data: ref.data }; }, peg$c83 = "[", peg$c84 = peg$literalExpectation("[", false), peg$c85 = "]", peg$c86 = peg$literalExpectation("]", false), peg$c87 = function (instrs) { return { type: types.Instr_Type.ls, items: instrs }; }, peg$c88 = "#[", peg$c89 = peg$literalExpectation("#[", false), peg$c90 = function (pairs) {
        return {
            type: types.Instr_Type.obj,
            pairs: pairs.map(function (pair) { return { key: pair[1].data, value: pair[2] }; })
        };
    }, peg$c91 = ".", peg$c92 = peg$literalExpectation(".", false), peg$c93 = function (prop) { return { type: types.Instr_Type.prop, data: prop.data }; }, peg$c94 = /^[0-9]/, peg$c95 = peg$classExpectation([["0", "9"]], false, false), peg$c96 = function () { return { type: types.Instr_Type.num, data: parseFloat(text()) }; }, peg$c97 = "\"", peg$c98 = peg$literalExpectation("\"", false), peg$c99 = /^[^"\\]/, peg$c100 = peg$classExpectation(["\"", "\\"], true, false), peg$c101 = "\\", peg$c102 = peg$literalExpectation("\\", false), peg$c103 = peg$anyExpectation(), peg$c104 = function () {
        return {
            type: types.Instr_Type.str,
            data: text().slice(1, -1) // .replace("\\n", "\n").replace(/\\(.)/g, "$1")
        };
    }, peg$c105 = "{", peg$c106 = peg$literalExpectation("{", false), peg$c107 = "}", peg$c108 = peg$literalExpectation("}", false), peg$c109 = function (eq) { return { type: types.Instr_Type.expr, data: eq }; }, peg$c110 = function (left, right) {
        return !right
            ? { type: types.Expr_Top_Type.single, single: left }
            : { type: types.Expr_Top_Type.eq, left: left, right: right };
    }, peg$c111 = /^[+\-]/, peg$c112 = peg$classExpectation(["+", "-"], false, false), peg$c113 = function (prod, prods) {
        return __spreadArrays([
            { op: types.Term_Op["+"], prod: prod }
        ], prods.map(function (_a) {
            var op = _a[1], prod = _a[3];
            op: op == "+" ? types.Term_Op["+"] : types.Term_Op["-"],
                prod;
        }));
    }, peg$c114 = /^[*\/]/, peg$c115 = peg$classExpectation(["*", "/"], false, false), peg$c116 = function (exp, exps) {
        return __spreadArrays([
            { op: types.Prod_Op["*"], exp: exp }
        ], exps.map(function (_a) {
            var op = _a[1], exp = _a[3];
            op: op == "*" ? types.Prod_Op["*"] : types.Prod_Op["/"],
                exp;
        }));
    }, peg$c117 = function (final, finals) {
        return __spreadArrays([
            final
        ], finals.map(function (_a) {
            var final = _a[3];
            return final;
        }));
    }, peg$c118 = "(", peg$c119 = peg$literalExpectation("(", false), peg$c120 = ")", peg$c121 = peg$literalExpectation(")", false), peg$c122 = "x", peg$c123 = peg$literalExpectation("x", false), peg$c124 = "y", peg$c125 = peg$literalExpectation("y", false), peg$c126 = /^[a-wz]/, peg$c127 = peg$classExpectation([["a", "w"], "z"], false, false), peg$c128 = ",", peg$c129 = peg$literalExpectation(",", false), peg$c130 = "abs", peg$c131 = peg$literalExpectation("abs", false), peg$c132 = "sqrt", peg$c133 = peg$literalExpectation("sqrt", false), peg$c134 = "cbrt", peg$c135 = peg$literalExpectation("cbrt", false), peg$c136 = "ln", peg$c137 = peg$literalExpectation("ln", false), peg$c138 = "cosh", peg$c139 = peg$literalExpectation("cosh", false), peg$c140 = "sinh", peg$c141 = peg$literalExpectation("sinh", false), peg$c142 = "tanh", peg$c143 = peg$literalExpectation("tanh", false), peg$c144 = "coth", peg$c145 = peg$literalExpectation("coth", false), peg$c146 = "sech", peg$c147 = peg$literalExpectation("sech", false), peg$c148 = "csch", peg$c149 = peg$literalExpectation("csch", false), peg$c150 = "cos", peg$c151 = peg$literalExpectation("cos", false), peg$c152 = "sin", peg$c153 = peg$literalExpectation("sin", false), peg$c154 = "tan", peg$c155 = peg$literalExpectation("tan", false), peg$c156 = "cot", peg$c157 = peg$literalExpectation("cot", false), peg$c158 = "sec", peg$c159 = peg$literalExpectation("sec", false), peg$c160 = "csc", peg$c161 = peg$literalExpectation("csc", false), peg$c162 = "arccosh", peg$c163 = peg$literalExpectation("arccosh", false), peg$c164 = "arcsinh", peg$c165 = peg$literalExpectation("arcsinh", false), peg$c166 = "arctanh", peg$c167 = peg$literalExpectation("arctanh", false), peg$c168 = "arccoth", peg$c169 = peg$literalExpectation("arccoth", false), peg$c170 = "arcsech", peg$c171 = peg$literalExpectation("arcsech", false), peg$c172 = "arccsch", peg$c173 = peg$literalExpectation("arccsch", false), peg$c174 = "arccos", peg$c175 = peg$literalExpectation("arccos", false), peg$c176 = "arcsin", peg$c177 = peg$literalExpectation("arcsin", false), peg$c178 = "arctan", peg$c179 = peg$literalExpectation("arctan", false), peg$c180 = "arccot", peg$c181 = peg$literalExpectation("arccot", false), peg$c182 = "arcsec", peg$c183 = peg$literalExpectation("arcsec", false), peg$c184 = "arccsc", peg$c185 = peg$literalExpectation("arccsc", false), peg$c186 = "root", peg$c187 = peg$literalExpectation("root", false), peg$c188 = "log", peg$c189 = peg$literalExpectation("log", false), peg$c190 = "sum", peg$c191 = peg$literalExpectation("sum", false), peg$c192 = "prod", peg$c193 = peg$literalExpectation("prod", false), peg$c194 = "pi", peg$c195 = peg$literalExpectation("pi", false), peg$c196 = "\u03C0", peg$c197 = peg$literalExpectation("\u03C0", false), peg$c198 = "tau", peg$c199 = peg$literalExpectation("tau", false), peg$c200 = "\u03C4", peg$c201 = peg$literalExpectation("\u03C4", false), peg$c202 = "e", peg$c203 = peg$literalExpectation("e", false), peg$c204 = /^[ \t\n\r]/, peg$c205 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false), peg$c206 = "#(", peg$c207 = peg$literalExpectation("#(", false), peg$c208 = /^[^)]/, peg$c209 = peg$classExpectation([")"], true, false), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
    if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }
    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }
    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function expected(description, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
    }
    function error(message, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location);
    }
    function peg$literalExpectation(text, ignoreCase) {
        return { type: "literal", text: text, ignoreCase: ignoreCase };
    }
    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }
    function peg$anyExpectation() {
        return { type: "any" };
    }
    function peg$endExpectation() {
        return { type: "end" };
    }
    function peg$otherExpectation(description) {
        return { type: "other", description: description };
    }
    function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos], p;
        if (details) {
            return details;
        }
        else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }
            details = peg$posDetailsCache[p];
            details = {
                line: details.line,
                column: details.column
            };
            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                }
                else {
                    details.column++;
                }
                p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
        }
    }
    function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
        return {
            start: {
                offset: startPos,
                line: startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line: endPosDetails.line,
                column: endPosDetails.column
            }
        };
    }
    function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
            return;
        }
        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected);
    }
    function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
    }
    function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
    }
    function peg$parseBlock() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = peg$parseInstrs();
            if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 59) {
                        s7 = peg$c0;
                        peg$currPos++;
                    }
                    else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c1);
                        }
                    }
                    if (s7 !== peg$FAILED) {
                        s8 = peg$parse_();
                        if (s8 !== peg$FAILED) {
                            s9 = peg$parseInstrs();
                            if (s9 !== peg$FAILED) {
                                s10 = peg$parse_();
                                if (s10 !== peg$FAILED) {
                                    s7 = [s7, s8, s9, s10];
                                    s6 = s7;
                                }
                                else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                    }
                    while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        s6 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 59) {
                            s7 = peg$c0;
                            peg$currPos++;
                        }
                        else {
                            s7 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c1);
                            }
                        }
                        if (s7 !== peg$FAILED) {
                            s8 = peg$parse_();
                            if (s8 !== peg$FAILED) {
                                s9 = peg$parseInstrs();
                                if (s9 !== peg$FAILED) {
                                    s10 = peg$parse_();
                                    if (s10 !== peg$FAILED) {
                                        s7 = [s7, s8, s9, s10];
                                        s6 = s7;
                                    }
                                    else {
                                        peg$currPos = s6;
                                        s6 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s3 = [s3, s4, s5];
                        s2 = s3;
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c2(s2);
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseInstrs() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parseInstr();
            if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                    s4 = [s4, s5];
                    s3 = s4;
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parseInstr();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parse_();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3(s2);
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseInstr() {
        var s0;
        s0 = peg$parseKeywd();
        if (s0 === peg$FAILED) {
            s0 = peg$parseOp();
            if (s0 === peg$FAILED) {
                s0 = peg$parseName();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseRef();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseLs();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseObj();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseProp();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseNum();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseStr();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parseExpr();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parseKeywd() {
        var s0;
        s0 = peg$parseIf();
        if (s0 === peg$FAILED) {
            s0 = peg$parseFor();
            if (s0 === peg$FAILED) {
                s0 = peg$parseWhile();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseLocal();
                    if (s0 === peg$FAILED) {
                        s0 = peg$parseVar();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseFun();
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parseIf() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c4) {
            s1 = peg$c4;
            peg$currPos += 2;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c5);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseBlock();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 58) {
                            s5 = peg$c6;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c7);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseBlock();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse_();
                                    if (s8 !== peg$FAILED) {
                                        s9 = [];
                                        s10 = peg$currPos;
                                        if (input.substr(peg$currPos, 4) === peg$c8) {
                                            s11 = peg$c8;
                                            peg$currPos += 4;
                                        }
                                        else {
                                            s11 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c9);
                                            }
                                        }
                                        if (s11 !== peg$FAILED) {
                                            s12 = peg$parse_();
                                            if (s12 !== peg$FAILED) {
                                                s13 = peg$parseBlock();
                                                if (s13 !== peg$FAILED) {
                                                    s14 = peg$parse_();
                                                    if (s14 !== peg$FAILED) {
                                                        if (input.charCodeAt(peg$currPos) === 58) {
                                                            s15 = peg$c6;
                                                            peg$currPos++;
                                                        }
                                                        else {
                                                            s15 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c7);
                                                            }
                                                        }
                                                        if (s15 !== peg$FAILED) {
                                                            s16 = peg$parse_();
                                                            if (s16 !== peg$FAILED) {
                                                                s17 = peg$parseBlock();
                                                                if (s17 !== peg$FAILED) {
                                                                    s11 = [s11, s12, s13, s14, s15, s16, s17];
                                                                    s10 = s11;
                                                                }
                                                                else {
                                                                    peg$currPos = s10;
                                                                    s10 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s10;
                                                                s10 = peg$FAILED;
                                                            }
                                                        }
                                                        else {
                                                            peg$currPos = s10;
                                                            s10 = peg$FAILED;
                                                        }
                                                    }
                                                    else {
                                                        peg$currPos = s10;
                                                        s10 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s10;
                                                    s10 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s10;
                                                s10 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s10;
                                            s10 = peg$FAILED;
                                        }
                                        while (s10 !== peg$FAILED) {
                                            s9.push(s10);
                                            s10 = peg$currPos;
                                            if (input.substr(peg$currPos, 4) === peg$c8) {
                                                s11 = peg$c8;
                                                peg$currPos += 4;
                                            }
                                            else {
                                                s11 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c9);
                                                }
                                            }
                                            if (s11 !== peg$FAILED) {
                                                s12 = peg$parse_();
                                                if (s12 !== peg$FAILED) {
                                                    s13 = peg$parseBlock();
                                                    if (s13 !== peg$FAILED) {
                                                        s14 = peg$parse_();
                                                        if (s14 !== peg$FAILED) {
                                                            if (input.charCodeAt(peg$currPos) === 58) {
                                                                s15 = peg$c6;
                                                                peg$currPos++;
                                                            }
                                                            else {
                                                                s15 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c7);
                                                                }
                                                            }
                                                            if (s15 !== peg$FAILED) {
                                                                s16 = peg$parse_();
                                                                if (s16 !== peg$FAILED) {
                                                                    s17 = peg$parseBlock();
                                                                    if (s17 !== peg$FAILED) {
                                                                        s11 = [s11, s12, s13, s14, s15, s16, s17];
                                                                        s10 = s11;
                                                                    }
                                                                    else {
                                                                        peg$currPos = s10;
                                                                        s10 = peg$FAILED;
                                                                    }
                                                                }
                                                                else {
                                                                    peg$currPos = s10;
                                                                    s10 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s10;
                                                                s10 = peg$FAILED;
                                                            }
                                                        }
                                                        else {
                                                            peg$currPos = s10;
                                                            s10 = peg$FAILED;
                                                        }
                                                    }
                                                    else {
                                                        peg$currPos = s10;
                                                        s10 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s10;
                                                    s10 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s10;
                                                s10 = peg$FAILED;
                                            }
                                        }
                                        if (s9 !== peg$FAILED) {
                                            s10 = peg$parse_();
                                            if (s10 !== peg$FAILED) {
                                                s11 = peg$currPos;
                                                if (input.substr(peg$currPos, 4) === peg$c10) {
                                                    s12 = peg$c10;
                                                    peg$currPos += 4;
                                                }
                                                else {
                                                    s12 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c11);
                                                    }
                                                }
                                                if (s12 !== peg$FAILED) {
                                                    s13 = peg$parse_();
                                                    if (s13 !== peg$FAILED) {
                                                        s14 = peg$parseBlock();
                                                        if (s14 !== peg$FAILED) {
                                                            s12 = [s12, s13, s14];
                                                            s11 = s12;
                                                        }
                                                        else {
                                                            peg$currPos = s11;
                                                            s11 = peg$FAILED;
                                                        }
                                                    }
                                                    else {
                                                        peg$currPos = s11;
                                                        s11 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s11;
                                                    s11 = peg$FAILED;
                                                }
                                                if (s11 === peg$FAILED) {
                                                    s11 = null;
                                                }
                                                if (s11 !== peg$FAILED) {
                                                    if (input.substr(peg$currPos, 3) === peg$c12) {
                                                        s12 = peg$c12;
                                                        peg$currPos += 3;
                                                    }
                                                    else {
                                                        s12 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c13);
                                                        }
                                                    }
                                                    if (s12 === peg$FAILED) {
                                                        s12 = null;
                                                    }
                                                    if (s12 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c14(s3, s7, s9, s11);
                                                        s0 = s1;
                                                    }
                                                    else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseFor() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c15) {
            s1 = peg$c15;
            peg$currPos += 3;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c16);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseName();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseBlock();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 58) {
                                    s7 = peg$c6;
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c7);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parse_();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parseBlock();
                                        if (s9 !== peg$FAILED) {
                                            if (input.substr(peg$currPos, 3) === peg$c12) {
                                                s10 = peg$c12;
                                                peg$currPos += 3;
                                            }
                                            else {
                                                s10 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c13);
                                                }
                                            }
                                            if (s10 === peg$FAILED) {
                                                s10 = null;
                                            }
                                            if (s10 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c17(s3, s5, s9);
                                                s0 = s1;
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseWhile() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c18) {
            s1 = peg$c18;
            peg$currPos += 5;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c19);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseBlock();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 58) {
                            s5 = peg$c6;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c7);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parseBlock();
                                if (s7 !== peg$FAILED) {
                                    if (input.substr(peg$currPos, 3) === peg$c12) {
                                        s8 = peg$c12;
                                        peg$currPos += 3;
                                    }
                                    else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c13);
                                        }
                                    }
                                    if (s8 === peg$FAILED) {
                                        s8 = null;
                                    }
                                    if (s8 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c20(s3, s7);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseLocal() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parseName();
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (input.charCodeAt(peg$currPos) === 39) {
                s3 = peg$c21;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c22);
                }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (input.charCodeAt(peg$currPos) === 39) {
                    s3 = peg$c21;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c23) {
                        s4 = peg$c23;
                        peg$currPos += 2;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c24);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseInstrs();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse_();
                                if (s7 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 59) {
                                        s8 = peg$c0;
                                        peg$currPos++;
                                    }
                                    else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c1);
                                        }
                                    }
                                    if (s8 === peg$FAILED) {
                                        s8 = null;
                                    }
                                    if (s8 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c25(s1, s2, s6);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseVar() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parseName();
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (input.charCodeAt(peg$currPos) === 39) {
                s3 = peg$c21;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c22);
                }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (input.charCodeAt(peg$currPos) === 39) {
                    s3 = peg$c21;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                        s4 = peg$c26;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c27);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parseInstrs();
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse_();
                                if (s7 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 59) {
                                        s8 = peg$c0;
                                        peg$currPos++;
                                    }
                                    else {
                                        s8 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c1);
                                        }
                                    }
                                    if (s8 === peg$FAILED) {
                                        s8 = null;
                                    }
                                    if (s8 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c28(s1, s2, s6);
                                        s0 = s1;
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseFun() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c29) {
            s1 = peg$c29;
            peg$currPos += 3;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c30);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseName();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s5 = [];
                        s6 = peg$currPos;
                        s7 = peg$parseName();
                        if (s7 !== peg$FAILED) {
                            s8 = peg$parse_();
                            if (s8 !== peg$FAILED) {
                                s7 = [s7, s8];
                                s6 = s7;
                            }
                            else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                        }
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            s6 = peg$currPos;
                            s7 = peg$parseName();
                            if (s7 !== peg$FAILED) {
                                s8 = peg$parse_();
                                if (s8 !== peg$FAILED) {
                                    s7 = [s7, s8];
                                    s6 = s7;
                                }
                                else {
                                    peg$currPos = s6;
                                    s6 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s6;
                                s6 = peg$FAILED;
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 58) {
                                s6 = peg$c6;
                                peg$currPos++;
                            }
                            else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c7);
                                }
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parse_();
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parseBlock();
                                    if (s8 !== peg$FAILED) {
                                        s9 = peg$parse_();
                                        if (s9 !== peg$FAILED) {
                                            if (input.substr(peg$currPos, 3) === peg$c12) {
                                                s10 = peg$c12;
                                                peg$currPos += 3;
                                            }
                                            else {
                                                s10 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c13);
                                                }
                                            }
                                            if (s10 === peg$FAILED) {
                                                s10 = null;
                                            }
                                            if (s10 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c31(s3, s5, s8);
                                                s0 = s1;
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseOp() {
        var s0, s1;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c32) {
            s1 = peg$c32;
            peg$currPos += 2;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c33);
            }
        }
        if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c34) {
                s1 = peg$c34;
                peg$currPos += 2;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c35);
                }
            }
            if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c36) {
                    s1 = peg$c36;
                    peg$currPos += 2;
                }
                else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c37);
                    }
                }
                if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c38) {
                        s1 = peg$c38;
                        peg$currPos += 2;
                    }
                    else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c39);
                        }
                    }
                    if (s1 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 60) {
                            s1 = peg$c40;
                            peg$currPos++;
                        }
                        else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c41);
                            }
                        }
                        if (s1 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 62) {
                                s1 = peg$c42;
                                peg$currPos++;
                            }
                            else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c43);
                                }
                            }
                            if (s1 === peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 43) {
                                    s1 = peg$c44;
                                    peg$currPos++;
                                }
                                else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c45);
                                    }
                                }
                                if (s1 === peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 126) {
                                        s1 = peg$c46;
                                        peg$currPos++;
                                    }
                                    else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c47);
                                        }
                                    }
                                    if (s1 === peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 45) {
                                            s1 = peg$c48;
                                            peg$currPos++;
                                        }
                                        else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c49);
                                            }
                                        }
                                        if (s1 === peg$FAILED) {
                                            if (input.charCodeAt(peg$currPos) === 42) {
                                                s1 = peg$c50;
                                                peg$currPos++;
                                            }
                                            else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c51);
                                                }
                                            }
                                            if (s1 === peg$FAILED) {
                                                if (input.charCodeAt(peg$currPos) === 47) {
                                                    s1 = peg$c52;
                                                    peg$currPos++;
                                                }
                                                else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c53);
                                                    }
                                                }
                                                if (s1 === peg$FAILED) {
                                                    if (input.charCodeAt(peg$currPos) === 94) {
                                                        s1 = peg$c54;
                                                        peg$currPos++;
                                                    }
                                                    else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c55);
                                                        }
                                                    }
                                                    if (s1 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 2) === peg$c56) {
                                                            s1 = peg$c56;
                                                            peg$currPos += 2;
                                                        }
                                                        else {
                                                            s1 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c57);
                                                            }
                                                        }
                                                        if (s1 === peg$FAILED) {
                                                            if (input.charCodeAt(peg$currPos) === 37) {
                                                                s1 = peg$c58;
                                                                peg$currPos++;
                                                            }
                                                            else {
                                                                s1 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c59);
                                                                }
                                                            }
                                                            if (s1 === peg$FAILED) {
                                                                if (input.charCodeAt(peg$currPos) === 39) {
                                                                    s1 = peg$c21;
                                                                    peg$currPos++;
                                                                }
                                                                else {
                                                                    s1 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c22);
                                                                    }
                                                                }
                                                                if (s1 === peg$FAILED) {
                                                                    if (input.charCodeAt(peg$currPos) === 64) {
                                                                        s1 = peg$c60;
                                                                        peg$currPos++;
                                                                    }
                                                                    else {
                                                                        s1 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c61);
                                                                        }
                                                                    }
                                                                    if (s1 === peg$FAILED) {
                                                                        if (input.charCodeAt(peg$currPos) === 38) {
                                                                            s1 = peg$c62;
                                                                            peg$currPos++;
                                                                        }
                                                                        else {
                                                                            s1 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c63);
                                                                            }
                                                                        }
                                                                        if (s1 === peg$FAILED) {
                                                                            if (input.charCodeAt(peg$currPos) === 124) {
                                                                                s1 = peg$c64;
                                                                                peg$currPos++;
                                                                            }
                                                                            else {
                                                                                s1 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$c65);
                                                                                }
                                                                            }
                                                                            if (s1 === peg$FAILED) {
                                                                                if (input.charCodeAt(peg$currPos) === 33) {
                                                                                    s1 = peg$c66;
                                                                                    peg$currPos++;
                                                                                }
                                                                                else {
                                                                                    s1 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c67);
                                                                                    }
                                                                                }
                                                                                if (s1 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 2) === peg$c68) {
                                                                                        s1 = peg$c68;
                                                                                        peg$currPos += 2;
                                                                                    }
                                                                                    else {
                                                                                        s1 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$c69);
                                                                                        }
                                                                                    }
                                                                                    if (s1 === peg$FAILED) {
                                                                                        if (input.charCodeAt(peg$currPos) === 63) {
                                                                                            s1 = peg$c70;
                                                                                            peg$currPos++;
                                                                                        }
                                                                                        else {
                                                                                            s1 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$c71);
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c72();
        }
        s0 = s1;
        return s0;
    }
    function peg$parseName() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c4) {
            s2 = peg$c4;
            peg$currPos += 2;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c5);
            }
        }
        if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c10) {
                s2 = peg$c10;
                peg$currPos += 4;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c11);
                }
            }
            if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c8) {
                    s2 = peg$c8;
                    peg$currPos += 4;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c9);
                    }
                }
                if (s2 === peg$FAILED) {
                    if (input.substr(peg$currPos, 3) === peg$c12) {
                        s2 = peg$c12;
                        peg$currPos += 3;
                    }
                    else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c13);
                        }
                    }
                    if (s2 === peg$FAILED) {
                        if (input.substr(peg$currPos, 3) === peg$c15) {
                            s2 = peg$c15;
                            peg$currPos += 3;
                        }
                        else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c16);
                            }
                        }
                        if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 5) === peg$c18) {
                                s2 = peg$c18;
                                peg$currPos += 5;
                            }
                            else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c19);
                                }
                            }
                            if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c73) {
                                    s2 = peg$c73;
                                    peg$currPos += 3;
                                }
                                else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c74);
                                    }
                                }
                                if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 3) === peg$c29) {
                                        s2 = peg$c29;
                                        peg$currPos += 3;
                                    }
                                    else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c30);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
            s1 = void 0;
        }
        else {
            peg$currPos = s1;
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            if (peg$c75.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c76);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = [];
                if (peg$c77.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c78);
                    }
                }
                while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    if (peg$c77.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c78);
                        }
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c79();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseRef() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 96) {
            s1 = peg$c80;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c81);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseName();
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c82(s2);
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseLs() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c83;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c84);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseBlock();
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                    s3 = peg$c85;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c86);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c87(s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseObj() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c88) {
            s1 = peg$c88;
            peg$currPos += 2;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c89);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 58) {
                    s5 = peg$c6;
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c7);
                    }
                }
                if (s5 !== peg$FAILED) {
                    s6 = peg$parseName();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseBlock();
                        if (s7 !== peg$FAILED) {
                            s5 = [s5, s6, s7];
                            s4 = s5;
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                }
                while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 58) {
                        s5 = peg$c6;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c7);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseName();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseBlock();
                            if (s7 !== peg$FAILED) {
                                s5 = [s5, s6, s7];
                                s4 = s5;
                            }
                            else {
                                peg$currPos = s4;
                                s4 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s4;
                            s4 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s4;
                        s4 = peg$FAILED;
                    }
                }
                if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                        s4 = peg$c85;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c86);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c90(s3);
                        s0 = s1;
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseProp() {
        var s0, s1, s2;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
            s1 = peg$c91;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c92);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseName();
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c93(s2);
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseNum() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c94.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c95);
            }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$c94.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c95);
                    }
                }
            }
        }
        else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
                s3 = peg$c91;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c92);
                }
            }
            if (s3 !== peg$FAILED) {
                s4 = [];
                if (peg$c94.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c95);
                    }
                }
                if (s5 !== peg$FAILED) {
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c94.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c95);
                            }
                        }
                    }
                }
                else {
                    s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                    s3 = [s3, s4];
                    s2 = s3;
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 === peg$FAILED) {
                s2 = null;
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c96();
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseStr() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c97;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c98);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c99.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c100);
                }
            }
            if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 92) {
                    s4 = peg$c101;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c102);
                    }
                }
                if (s4 !== peg$FAILED) {
                    if (input.length > peg$currPos) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c103);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c99.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c100);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 92) {
                        s4 = peg$c101;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c102);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (input.length > peg$currPos) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c103);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                    s3 = peg$c97;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c98);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c104();
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseExpr() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
            s1 = peg$c105;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c106);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseEq();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 125) {
                            s5 = peg$c107;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c108);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c109(s3);
                            s0 = s1;
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseEq() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;
        s1 = peg$parseTerms();
        if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 61) {
                    s4 = peg$c26;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c27);
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = peg$parse_();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parseTerms();
                        if (s6 !== peg$FAILED) {
                            s3 = [s3, s4, s5, s6];
                            s2 = s3;
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 === peg$FAILED) {
                s2 = null;
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c110(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseTerms() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parseProds();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                if (peg$c111.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c112);
                    }
                }
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseProds();
                        if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    if (peg$c111.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c112);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseProds();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c113(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseProds() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parseExps();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                if (peg$c114.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c115);
                    }
                }
                if (s5 === peg$FAILED) {
                    s5 = null;
                }
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseExps();
                        if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    if (peg$c114.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c115);
                        }
                    }
                    if (s5 === peg$FAILED) {
                        s5 = null;
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseExps();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c116(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseExps() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parseFinal();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 94) {
                    s5 = peg$c54;
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c55);
                    }
                }
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseFinal();
                        if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 94) {
                        s5 = peg$c54;
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c55);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseFinal();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            }
                            else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c117(s1, s2);
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseFinal() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 126) {
            s1 = peg$c46;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c47);
            }
        }
        if (s1 === peg$FAILED) {
            s1 = null;
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c118;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c119);
                }
            }
            if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseTerms();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                                s7 = peg$c120;
                                peg$currPos++;
                            }
                            else {
                                s7 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c121);
                                }
                            }
                            if (s7 !== peg$FAILED) {
                                s3 = [s3, s4, s5, s6, s7];
                                s2 = s3;
                            }
                            else {
                                peg$currPos = s2;
                                s2 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
            if (s2 === peg$FAILED) {
                s2 = peg$parseMath_Call();
                if (s2 === peg$FAILED) {
                    s2 = peg$parseMath_Const();
                    if (s2 === peg$FAILED) {
                        s2 = peg$parseMain_Vars();
                        if (s2 === peg$FAILED) {
                            s2 = peg$parseVars();
                            if (s2 === peg$FAILED) {
                                s2 = peg$parseNum();
                            }
                        }
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                s1 = [s1, s2];
                s0 = s1;
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    function peg$parseMain_Vars() {
        var s0;
        if (input.charCodeAt(peg$currPos) === 120) {
            s0 = peg$c122;
            peg$currPos++;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c123);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 121) {
                s0 = peg$c124;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c125);
                }
            }
        }
        return s0;
    }
    function peg$parseVars() {
        var s0;
        if (peg$c126.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c127);
            }
        }
        return s0;
    }
    function peg$parseMath_Call() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
        s0 = peg$currPos;
        s1 = peg$parseMath_Fun_1();
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 40) {
                    s3 = peg$c118;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c119);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseTerms();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s7 = peg$c120;
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c121);
                                    }
                                }
                                if (s7 !== peg$FAILED) {
                                    s1 = [s1, s2, s3, s4, s5, s6, s7];
                                    s0 = s1;
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseMath_Fun_2();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s3 = peg$c118;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c119);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseTerms();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 44) {
                                        s7 = peg$c128;
                                        peg$currPos++;
                                    }
                                    else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c129);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse_();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseTerms();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse_();
                                                if (s10 !== peg$FAILED) {
                                                    if (input.charCodeAt(peg$currPos) === 41) {
                                                        s11 = peg$c120;
                                                        peg$currPos++;
                                                    }
                                                    else {
                                                        s11 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c121);
                                                        }
                                                    }
                                                    if (s11 !== peg$FAILED) {
                                                        s1 = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
                                                        s0 = s1;
                                                    }
                                                    else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseMath_Fun_3();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 40) {
                            s3 = peg$c118;
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c119);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseTerms();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 !== peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 44) {
                                            s7 = peg$c128;
                                            peg$currPos++;
                                        }
                                        else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c129);
                                            }
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse_();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseTerms();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse_();
                                                    if (s10 !== peg$FAILED) {
                                                        if (input.charCodeAt(peg$currPos) === 44) {
                                                            s11 = peg$c128;
                                                            peg$currPos++;
                                                        }
                                                        else {
                                                            s11 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c129);
                                                            }
                                                        }
                                                        if (s11 !== peg$FAILED) {
                                                            s12 = peg$parse_();
                                                            if (s12 !== peg$FAILED) {
                                                                s13 = peg$parseTerms();
                                                                if (s13 !== peg$FAILED) {
                                                                    s14 = peg$parse_();
                                                                    if (s14 !== peg$FAILED) {
                                                                        if (input.charCodeAt(peg$currPos) === 41) {
                                                                            s15 = peg$c120;
                                                                            peg$currPos++;
                                                                        }
                                                                        else {
                                                                            s15 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c121);
                                                                            }
                                                                        }
                                                                        if (s15 !== peg$FAILED) {
                                                                            s1 = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];
                                                                            s0 = s1;
                                                                        }
                                                                        else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                        }
                                                                    }
                                                                    else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                    }
                                                                }
                                                                else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                }
                                                            }
                                                            else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                            }
                                                        }
                                                        else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                        }
                                                    }
                                                    else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                    }
                                                }
                                                else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                }
                                            }
                                            else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                            }
                                        }
                                        else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                        }
                                    }
                                    else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                    }
                                }
                                else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            }
                            else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        }
                        else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    }
                    else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Fun_1() {
        var s0;
        if (input.substr(peg$currPos, 3) === peg$c130) {
            s0 = peg$c130;
            peg$currPos += 3;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c131);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c132) {
                s0 = peg$c132;
                peg$currPos += 4;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c133);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c134) {
                    s0 = peg$c134;
                    peg$currPos += 4;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c135);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c136) {
                        s0 = peg$c136;
                        peg$currPos += 2;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c137);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c138) {
                            s0 = peg$c138;
                            peg$currPos += 4;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c139);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c140) {
                                s0 = peg$c140;
                                peg$currPos += 4;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c141);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 4) === peg$c142) {
                                    s0 = peg$c142;
                                    peg$currPos += 4;
                                }
                                else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c143);
                                    }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 4) === peg$c144) {
                                        s0 = peg$c144;
                                        peg$currPos += 4;
                                    }
                                    else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c145);
                                        }
                                    }
                                    if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 4) === peg$c146) {
                                            s0 = peg$c146;
                                            peg$currPos += 4;
                                        }
                                        else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c147);
                                            }
                                        }
                                        if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 4) === peg$c148) {
                                                s0 = peg$c148;
                                                peg$currPos += 4;
                                            }
                                            else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c149);
                                                }
                                            }
                                            if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 3) === peg$c150) {
                                                    s0 = peg$c150;
                                                    peg$currPos += 3;
                                                }
                                                else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c151);
                                                    }
                                                }
                                                if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 3) === peg$c152) {
                                                        s0 = peg$c152;
                                                        peg$currPos += 3;
                                                    }
                                                    else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c153);
                                                        }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 3) === peg$c154) {
                                                            s0 = peg$c154;
                                                            peg$currPos += 3;
                                                        }
                                                        else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c155);
                                                            }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 3) === peg$c156) {
                                                                s0 = peg$c156;
                                                                peg$currPos += 3;
                                                            }
                                                            else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c157);
                                                                }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 3) === peg$c158) {
                                                                    s0 = peg$c158;
                                                                    peg$currPos += 3;
                                                                }
                                                                else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c159);
                                                                    }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 3) === peg$c160) {
                                                                        s0 = peg$c160;
                                                                        peg$currPos += 3;
                                                                    }
                                                                    else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c161);
                                                                        }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 7) === peg$c162) {
                                                                            s0 = peg$c162;
                                                                            peg$currPos += 7;
                                                                        }
                                                                        else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c163);
                                                                            }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 7) === peg$c164) {
                                                                                s0 = peg$c164;
                                                                                peg$currPos += 7;
                                                                            }
                                                                            else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$c165);
                                                                                }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 7) === peg$c166) {
                                                                                    s0 = peg$c166;
                                                                                    peg$currPos += 7;
                                                                                }
                                                                                else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c167);
                                                                                    }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 7) === peg$c168) {
                                                                                        s0 = peg$c168;
                                                                                        peg$currPos += 7;
                                                                                    }
                                                                                    else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$c169);
                                                                                        }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 7) === peg$c170) {
                                                                                            s0 = peg$c170;
                                                                                            peg$currPos += 7;
                                                                                        }
                                                                                        else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$c171);
                                                                                            }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 7) === peg$c172) {
                                                                                                s0 = peg$c172;
                                                                                                peg$currPos += 7;
                                                                                            }
                                                                                            else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) {
                                                                                                    peg$fail(peg$c173);
                                                                                                }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 6) === peg$c174) {
                                                                                                    s0 = peg$c174;
                                                                                                    peg$currPos += 6;
                                                                                                }
                                                                                                else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) {
                                                                                                        peg$fail(peg$c175);
                                                                                                    }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 6) === peg$c176) {
                                                                                                        s0 = peg$c176;
                                                                                                        peg$currPos += 6;
                                                                                                    }
                                                                                                    else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) {
                                                                                                            peg$fail(peg$c177);
                                                                                                        }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 6) === peg$c178) {
                                                                                                            s0 = peg$c178;
                                                                                                            peg$currPos += 6;
                                                                                                        }
                                                                                                        else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) {
                                                                                                                peg$fail(peg$c179);
                                                                                                            }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 6) === peg$c180) {
                                                                                                                s0 = peg$c180;
                                                                                                                peg$currPos += 6;
                                                                                                            }
                                                                                                            else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) {
                                                                                                                    peg$fail(peg$c181);
                                                                                                                }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 6) === peg$c182) {
                                                                                                                    s0 = peg$c182;
                                                                                                                    peg$currPos += 6;
                                                                                                                }
                                                                                                                else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                        peg$fail(peg$c183);
                                                                                                                    }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 6) === peg$c184) {
                                                                                                                        s0 = peg$c184;
                                                                                                                        peg$currPos += 6;
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        s0 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                            peg$fail(peg$c185);
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Fun_2() {
        var s0;
        if (input.substr(peg$currPos, 4) === peg$c186) {
            s0 = peg$c186;
            peg$currPos += 4;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c187);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c188) {
                s0 = peg$c188;
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c189);
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Fun_3() {
        var s0;
        if (input.substr(peg$currPos, 3) === peg$c190) {
            s0 = peg$c190;
            peg$currPos += 3;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c191);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c192) {
                s0 = peg$c192;
                peg$currPos += 4;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c193);
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Const() {
        var s0;
        if (input.substr(peg$currPos, 2) === peg$c194) {
            s0 = peg$c194;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c195);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 960) {
                s0 = peg$c196;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c197);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c198) {
                    s0 = peg$c198;
                    peg$currPos += 3;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c199);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 964) {
                        s0 = peg$c200;
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c201);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 101) {
                            s0 = peg$c202;
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c203);
                            }
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parse_() {
        var s0, s1;
        s0 = [];
        if (peg$c204.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c205);
            }
        }
        if (s1 === peg$FAILED) {
            s1 = peg$parseCmmnt();
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c204.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c205);
                }
            }
            if (s1 === peg$FAILED) {
                s1 = peg$parseCmmnt();
            }
        }
        return s0;
    }
    function peg$parseCmmnt() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c206) {
            s1 = peg$c206;
            peg$currPos += 2;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c207);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c208.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c209);
                }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c208.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c209);
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                    s3 = peg$c120;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c121);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s1 = [s1, s2, s3];
                    s0 = s1;
                }
                else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
            else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        return s0;
    }
    peg$result = peg$startRuleFunction();
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    }
    else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
}
module.exports = {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse
};
module.exports = module.exports;

},{"./types":5}],5:[function(require,module,exports){
exports.__esModule = true;
exports.Main_Var = exports.Prod_Op = exports.Term_Op = exports.Expr_Type = exports.Expr_Top_Type = exports.Op = exports.Instr_Type = void 0;
var Instr_Type;
(function (Instr_Type) {
    Instr_Type[Instr_Type["op"] = 0] = "op";
    Instr_Type[Instr_Type["name"] = 1] = "name";
    Instr_Type[Instr_Type["ref"] = 2] = "ref";
    Instr_Type[Instr_Type["ls"] = 3] = "ls";
    Instr_Type[Instr_Type["obj"] = 4] = "obj";
    Instr_Type[Instr_Type["prop"] = 5] = "prop";
    Instr_Type[Instr_Type["num"] = 6] = "num";
    Instr_Type[Instr_Type["str"] = 7] = "str";
    Instr_Type[Instr_Type["expr"] = 8] = "expr";
    Instr_Type[Instr_Type["if"] = 9] = "if";
    Instr_Type[Instr_Type["for"] = 10] = "for";
    Instr_Type[Instr_Type["while"] = 11] = "while";
    Instr_Type[Instr_Type["local"] = 12] = "local";
    Instr_Type[Instr_Type["var"] = 13] = "var";
    Instr_Type[Instr_Type["fun"] = 14] = "fun"; // Structures
})(Instr_Type || (Instr_Type = {}));
exports.Instr_Type = Instr_Type;
var Op;
(function (Op) {
    Op[Op["=="] = 0] = "==";
    Op[Op["!="] = 1] = "!=";
    Op[Op["<="] = 2] = "<=";
    Op[Op[">="] = 3] = ">=";
    Op[Op["<"] = 4] = "<";
    Op[Op[">"] = 5] = ">";
    Op[Op["+"] = 6] = "+";
    Op[Op["~"] = 7] = "~";
    Op[Op["-"] = 8] = "-";
    Op[Op["*"] = 9] = "*";
    Op[Op["/"] = 10] = "/";
    Op[Op["^"] = 11] = "^";
    Op[Op["%%"] = 12] = "%%";
    Op[Op["%"] = 13] = "%";
    Op[Op["'"] = 14] = "'";
    Op[Op["@"] = 15] = "@";
    Op[Op["&"] = 16] = "&";
    Op[Op["|"] = 17] = "|";
    Op[Op["!"] = 18] = "!";
    Op[Op["??"] = 19] = "??";
    Op[Op["?"] = 20] = "?"; // Special interaction
})(Op || (Op = {}));
exports.Op = Op;
var Expr_Top_Type;
(function (Expr_Top_Type) {
    Expr_Top_Type[Expr_Top_Type["single"] = 0] = "single";
    Expr_Top_Type[Expr_Top_Type["eq"] = 1] = "eq";
})(Expr_Top_Type || (Expr_Top_Type = {}));
exports.Expr_Top_Type = Expr_Top_Type;
var Expr_Type;
(function (Expr_Type) {
    Expr_Type[Expr_Type["parens"] = 0] = "parens";
    Expr_Type[Expr_Type["call"] = 1] = "call";
    Expr_Type[Expr_Type["const"] = 2] = "const";
    Expr_Type[Expr_Type["main_vars"] = 3] = "main_vars";
    Expr_Type[Expr_Type["vars"] = 4] = "vars";
    Expr_Type[Expr_Type["num"] = 5] = "num";
})(Expr_Type || (Expr_Type = {}));
exports.Expr_Type = Expr_Type;
var Term_Op;
(function (Term_Op) {
    Term_Op[Term_Op["+"] = 0] = "+";
    Term_Op[Term_Op["-"] = 1] = "-";
})(Term_Op || (Term_Op = {}));
exports.Term_Op = Term_Op;
var Prod_Op;
(function (Prod_Op) {
    Prod_Op[Prod_Op["*"] = 0] = "*";
    Prod_Op[Prod_Op["/"] = 1] = "/";
})(Prod_Op || (Prod_Op = {}));
exports.Prod_Op = Prod_Op;
var Main_Var;
(function (Main_Var) {
    Main_Var[Main_Var["x"] = 0] = "x";
    Main_Var[Main_Var["y"] = 1] = "y";
})(Main_Var || (Main_Var = {}));
exports.Main_Var = Main_Var;

},{}]},{},[3])(3)
});
