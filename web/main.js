(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.main = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.__ops = exports.__false = exports.__true = exports.__print = void 0;
function __print(st) {
    console.log(st.pop());
}
exports.__print = __print;
function __true(st) {
    st.push(true);
}
exports.__true = __true;
function __false(st) {
    st.push(false);
}
exports.__false = __false;
var __ops = {
    // Arithmetic
    "+": function (st) {
        st.push(st.pop() + st.pop());
    },
    "~": function (st) {
        st.push(-st.pop());
    },
    "-": function (st) {
        st.push(st.pop() - st.pop());
    },
    "*": function (st) {
        st.push(st.pop() * st.pop());
    },
    "/": function (st) {
        st.push(st.pop() / st.pop());
    },
    // Extra math
    "^": function (st) {
        st.push(Math.pow(st.pop(), st.pop()));
    },
    "%%": function (st) {
        st.push(st.pop() % st.pop() == 0);
    },
    "%": function (st) {
        st.push(st.pop() % st.pop());
    },
    // Derivation: "'"(st: any[]) { }
    // List indexing
    "@": function (st) {
        st.push(st.pop()[st.pop()]);
    },
    // Boolean
    "&": function (st) {
        st.push(st.pop() && st.pop());
    },
    "|": function (st) {
        st.push(st.pop() || st.pop());
    },
    "!": function (st) {
        st.push(!(st.pop()));
    }
    // Special interaction
    // Previous one: "?"(st: any[]) { }
    // Nth previous one: "??"(st: any[]) { }
};
exports.__ops = __ops;

},{}],2:[function(require,module,exports){
"use strict";
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
var prelude = "with(main.builtins) {\n\nlet st = [];\n";
var postlude = "\n\n}";
var builtins = ["print", "true", "false"];
function compile(ast) {
    return prelude + compile_rec(ast, 0, [], []) + postlude;
}
exports.compile = compile;
function compile_rec(ast, indent, vars, funcs) {
    var compiled = ast.map(function (instrs) { return instrs.map(function (instr) {
        switch (instr.type) {
            case types.Instr_Type.op:
                return "__ops[\"" + types.Op[instr.data] + "\"](st);";
            case types.Instr_Type.name:
                if (vars.includes(instr.data))
                    return "st.push(" + instr.data + ");";
                else if (funcs.includes(instr.data))
                    return instr.data + "();";
                else if (builtins.includes(instr.data))
                    return "__" + instr.data + "(st);";
                else
                    throw instr.data + " is not a variable or function.";
            case types.Instr_Type.ref:
                return "st.push(" + instr.data + ");";
            case types.Instr_Type.prop:
                return "st.push(st.pop()." + instr.data + ");";
            case types.Instr_Type.ls:
                return "st.push((() => {\n" + tabs(indent + 1) + "let st = [];\n" + compile_rec(instr.items, indent + 1, vars, funcs) + "\n" + tabs(indent + 1) + "return st.reverse();\n" + tabs(indent) + "})())";
            case types.Instr_Type.num:
                return "st.push(" + instr.data + ");";
            case types.Instr_Type.str:
                return "st.push(\"" + instr.data + "\");";
            case types.Instr_Type["if"]:
                return instr.branches.map(function (branch) {
                    return (branch.cond
                        ? "if((() => {\n" + compile_rec(branch.cond, indent + 2, vars, funcs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()) "
                        : "") + "{\n" + compile_rec(branch.body, indent + 1, vars, funcs) + "\n" + tabs(indent) + "}";
                }).join(" else ");
            case types.Instr_Type["for"]:
                return "for(const " + instr["var"] + " of (() => {\n" + compile_rec(instr.iter, indent + 2, vars, funcs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()) {\n" + compile_rec(instr.body, indent + 1, __spreadArrays(vars, [instr["var"]]), funcs) + "\n" + tabs(indent) + "}";
            case types.Instr_Type["while"]:
                return "while((() => {\n" + compile_rec(instr.cond, indent + 2, vars, funcs) + "\n" + tabs(indent + 2) + "return st.pop();\n" + tabs(indent + 1) + "})()) {\n" + compile_rec(instr.body, indent + 1, vars, funcs) + "\n" + tabs(indent) + "}";
            case types.Instr_Type.local:
                if (!vars.includes(instr["var"]))
                    vars = __spreadArrays(vars, [instr["var"]]);
                return "let " + instr["var"] + " = (() => {\n" + compile_rec([instr.def], indent + 1, vars, funcs) + "\n" + tabs(indent + 1) + "return st.pop();\n" + tabs(indent) + "})();";
            case types.Instr_Type["var"]:
                if (!vars.includes(instr["var"]))
                    vars = __spreadArrays(vars, [instr["var"]]);
                return instr["var"] + " = (() => {\n" + compile_rec([instr.def], indent + 1, vars, funcs) + "\n" + tabs(indent + 1) + "return st.pop();\n" + tabs(indent) + "})();";
            case types.Instr_Type.cmmnt:
                return "/*" + instr.data + "*/";
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
"use strict";
exports.__esModule = true;
exports.builtins = exports.format = exports.run = void 0;
var parser = require("./parser");
var compiler = require("./compiler");
var builtins = require("./builtins");
exports.builtins = builtins;
function run(prog) {
    return compiler.compile(parser.parse(prog));
}
exports.run = run;
var format = function (s) { return s; };
exports.format = format;

},{"./builtins":1,"./compiler":2,"./parser":4}],4:[function(require,module,exports){
"use strict";
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
    }, peg$c15 = "for", peg$c16 = peg$literalExpectation("for", false), peg$c17 = function (var_, iter, body) { return { type: types.Instr_Type["for"], "var": var_.data, iter: iter, body: body }; }, peg$c18 = "while", peg$c19 = peg$literalExpectation("while", false), peg$c20 = function (cond, body) { return { type: types.Instr_Type["while"], cond: cond, body: body }; }, peg$c21 = "'", peg$c22 = peg$literalExpectation("'", false), peg$c23 = ":=", peg$c24 = peg$literalExpectation(":=", false), peg$c25 = function (var_, deriv, def) { return { type: types.Instr_Type.local, "var": var_.data, def: def, deriv_n: deriv.length }; }, peg$c26 = "=", peg$c27 = peg$literalExpectation("=", false), peg$c28 = function (var_, deriv, def) { return { type: types.Instr_Type["var"], "var": var_.data, def: def, deriv_n: deriv.length }; }, peg$c29 = "fun", peg$c30 = peg$literalExpectation("fun", false), peg$c31 = function (fun, args, body) { return { type: types.Instr_Type.fun, fun: fun.data, args: args.map(function (arg) { return arg[0].data; }), body: body }; }, peg$c32 = "==", peg$c33 = peg$literalExpectation("==", false), peg$c34 = "!=", peg$c35 = peg$literalExpectation("!=", false), peg$c36 = "<=", peg$c37 = peg$literalExpectation("<=", false), peg$c38 = ">=", peg$c39 = peg$literalExpectation(">=", false), peg$c40 = "<", peg$c41 = peg$literalExpectation("<", false), peg$c42 = ">", peg$c43 = peg$literalExpectation(">", false), peg$c44 = "+", peg$c45 = peg$literalExpectation("+", false), peg$c46 = "~", peg$c47 = peg$literalExpectation("~", false), peg$c48 = "-", peg$c49 = peg$literalExpectation("-", false), peg$c50 = "*", peg$c51 = peg$literalExpectation("*", false), peg$c52 = "/", peg$c53 = peg$literalExpectation("/", false), peg$c54 = "^", peg$c55 = peg$literalExpectation("^", false), peg$c56 = "%%", peg$c57 = peg$literalExpectation("%%", false), peg$c58 = "%", peg$c59 = peg$literalExpectation("%", false), peg$c60 = "@", peg$c61 = peg$literalExpectation("@", false), peg$c62 = "&", peg$c63 = peg$literalExpectation("&", false), peg$c64 = "|", peg$c65 = peg$literalExpectation("|", false), peg$c66 = "!", peg$c67 = peg$literalExpectation("!", false), peg$c68 = "??", peg$c69 = peg$literalExpectation("??", false), peg$c70 = "?", peg$c71 = peg$literalExpectation("?", false), peg$c72 = function () { return { type: types.Instr_Type.op, data: types.Op[text()] }; }, peg$c73 = "var", peg$c74 = peg$literalExpectation("var", false), peg$c75 = /^[A-Za-z_]/, peg$c76 = peg$classExpectation([["A", "Z"], ["a", "z"], "_"], false, false), peg$c77 = /^[A-Za-z0-9_]/, peg$c78 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_"], false, false), peg$c79 = function () { return { type: types.Instr_Type.name, data: text() }; }, peg$c80 = "`", peg$c81 = peg$literalExpectation("`", false), peg$c82 = function (ref) { return { type: types.Instr_Type.ref, data: ref.data }; }, peg$c83 = "[", peg$c84 = peg$literalExpectation("[", false), peg$c85 = "]", peg$c86 = peg$literalExpectation("]", false), peg$c87 = function (pairs) {
        return {
            type: types.Instr_Type.obj,
            pairs: pairs.map(function (pair) { return { key: pair[1].data, value: pair[2] }; })
        };
    }, peg$c88 = ".", peg$c89 = peg$literalExpectation(".", false), peg$c90 = function (prop) { return { type: types.Instr_Type.prop, data: prop.data }; }, peg$c91 = function (instrs) { return { type: types.Instr_Type.ls, items: instrs }; }, peg$c92 = /^[0-9]/, peg$c93 = peg$classExpectation([["0", "9"]], false, false), peg$c94 = function () { return { type: types.Instr_Type.num, data: parseFloat(text()) }; }, peg$c95 = "\"", peg$c96 = peg$literalExpectation("\"", false), peg$c97 = /^[^"\\]/, peg$c98 = peg$classExpectation(["\"", "\\"], true, false), peg$c99 = "\\", peg$c100 = peg$literalExpectation("\\", false), peg$c101 = peg$anyExpectation(), peg$c102 = function () {
        return {
            type: types.Instr_Type.str,
            data: text().slice(1, -1) // .replace("\\n", "\n").replace(/\\(.)/g, "$1")
        };
    }, peg$c103 = "{", peg$c104 = peg$literalExpectation("{", false), peg$c105 = "}", peg$c106 = peg$literalExpectation("}", false), peg$c107 = /^[+\-]/, peg$c108 = peg$classExpectation(["+", "-"], false, false), peg$c109 = /^[*\/]/, peg$c110 = peg$classExpectation(["*", "/"], false, false), peg$c111 = "(", peg$c112 = peg$literalExpectation("(", false), peg$c113 = ")", peg$c114 = peg$literalExpectation(")", false), peg$c115 = "x", peg$c116 = peg$literalExpectation("x", false), peg$c117 = "y", peg$c118 = peg$literalExpectation("y", false), peg$c119 = /^[a-wz]/, peg$c120 = peg$classExpectation([["a", "w"], "z"], false, false), peg$c121 = ",", peg$c122 = peg$literalExpectation(",", false), peg$c123 = "abs", peg$c124 = peg$literalExpectation("abs", false), peg$c125 = "sqrt", peg$c126 = peg$literalExpectation("sqrt", false), peg$c127 = "cbrt", peg$c128 = peg$literalExpectation("cbrt", false), peg$c129 = "ln", peg$c130 = peg$literalExpectation("ln", false), peg$c131 = "cosh", peg$c132 = peg$literalExpectation("cosh", false), peg$c133 = "sinh", peg$c134 = peg$literalExpectation("sinh", false), peg$c135 = "tanh", peg$c136 = peg$literalExpectation("tanh", false), peg$c137 = "coth", peg$c138 = peg$literalExpectation("coth", false), peg$c139 = "sech", peg$c140 = peg$literalExpectation("sech", false), peg$c141 = "csch", peg$c142 = peg$literalExpectation("csch", false), peg$c143 = "cos", peg$c144 = peg$literalExpectation("cos", false), peg$c145 = "sin", peg$c146 = peg$literalExpectation("sin", false), peg$c147 = "tan", peg$c148 = peg$literalExpectation("tan", false), peg$c149 = "cot", peg$c150 = peg$literalExpectation("cot", false), peg$c151 = "sec", peg$c152 = peg$literalExpectation("sec", false), peg$c153 = "csc", peg$c154 = peg$literalExpectation("csc", false), peg$c155 = "arccosh", peg$c156 = peg$literalExpectation("arccosh", false), peg$c157 = "arcsinh", peg$c158 = peg$literalExpectation("arcsinh", false), peg$c159 = "arctanh", peg$c160 = peg$literalExpectation("arctanh", false), peg$c161 = "arccoth", peg$c162 = peg$literalExpectation("arccoth", false), peg$c163 = "arcsech", peg$c164 = peg$literalExpectation("arcsech", false), peg$c165 = "arccsch", peg$c166 = peg$literalExpectation("arccsch", false), peg$c167 = "arccos", peg$c168 = peg$literalExpectation("arccos", false), peg$c169 = "arcsin", peg$c170 = peg$literalExpectation("arcsin", false), peg$c171 = "arctan", peg$c172 = peg$literalExpectation("arctan", false), peg$c173 = "arccot", peg$c174 = peg$literalExpectation("arccot", false), peg$c175 = "arcsec", peg$c176 = peg$literalExpectation("arcsec", false), peg$c177 = "arccsc", peg$c178 = peg$literalExpectation("arccsc", false), peg$c179 = "root", peg$c180 = peg$literalExpectation("root", false), peg$c181 = "log", peg$c182 = peg$literalExpectation("log", false), peg$c183 = "sum", peg$c184 = peg$literalExpectation("sum", false), peg$c185 = "prod", peg$c186 = peg$literalExpectation("prod", false), peg$c187 = "pi", peg$c188 = peg$literalExpectation("pi", false), peg$c189 = "\u03C0", peg$c190 = peg$literalExpectation("\u03C0", false), peg$c191 = "tau", peg$c192 = peg$literalExpectation("tau", false), peg$c193 = "\u03C4", peg$c194 = peg$literalExpectation("\u03C4", false), peg$c195 = "e", peg$c196 = peg$literalExpectation("e", false), peg$c197 = "#(", peg$c198 = peg$literalExpectation("#(", false), peg$c199 = /^[^)]/, peg$c200 = peg$classExpectation([")"], true, false), peg$c201 = function () { return { type: types.Instr_Type.cmmnt, data: text().slice(2, -1) }; }, peg$c202 = /^[ \t\n\r]/, peg$c203 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
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
                        s0 = peg$parseObj();
                        if (s0 === peg$FAILED) {
                            s0 = peg$parseProp();
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseLs();
                                if (s0 === peg$FAILED) {
                                    s0 = peg$parseNum();
                                    if (s0 === peg$FAILED) {
                                        s0 = peg$parseStr();
                                        if (s0 === peg$FAILED) {
                                            s0 = peg$parseExpr();
                                            if (s0 === peg$FAILED) {
                                                s0 = peg$parseCmmnt();
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
    function peg$parseObj() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
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
                        s1 = peg$c87(s3);
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
            s1 = peg$c88;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c89);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseName();
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c90(s2);
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
                    s1 = peg$c91(s2);
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
    function peg$parseNum() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c92.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c93);
            }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$c92.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c93);
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
                s3 = peg$c88;
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c89);
                }
            }
            if (s3 !== peg$FAILED) {
                s4 = [];
                if (peg$c92.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c93);
                    }
                }
                if (s5 !== peg$FAILED) {
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        if (peg$c92.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c93);
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
                s1 = peg$c94();
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
            s1 = peg$c95;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c96);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c97.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c98);
                }
            }
            if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 92) {
                    s4 = peg$c99;
                    peg$currPos++;
                }
                else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c100);
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
                            peg$fail(peg$c101);
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
                if (peg$c97.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c98);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 92) {
                        s4 = peg$c99;
                        peg$currPos++;
                    }
                    else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c100);
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
                                peg$fail(peg$c101);
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
                    s3 = peg$c95;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c96);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c102();
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
            s1 = peg$c103;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c104);
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
                            s5 = peg$c105;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c106);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4, s5];
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
        s1 = peg$parseMath_Expr();
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
                        s6 = peg$parseMath_Expr();
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
    function peg$parseMath_Expr() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parseTerms();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                if (peg$c107.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c108);
                    }
                }
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseTerms();
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
                    if (peg$c107.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c108);
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseTerms();
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
    function peg$parseTerms() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parseProds();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                if (peg$c109.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c110);
                    }
                }
                if (s5 === peg$FAILED) {
                    s5 = null;
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
                    if (peg$c109.test(input.charAt(peg$currPos))) {
                        s5 = input.charAt(peg$currPos);
                        peg$currPos++;
                    }
                    else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c110);
                        }
                    }
                    if (s5 === peg$FAILED) {
                        s5 = null;
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
    function peg$parseProds() {
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
    function peg$parseFinal() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c111;
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c112);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseMath_Expr();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                            s5 = peg$c113;
                            peg$currPos++;
                        }
                        else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c114);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4, s5];
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
        if (s0 === peg$FAILED) {
            s0 = peg$parseMath_Call();
            if (s0 === peg$FAILED) {
                s0 = peg$parseMath_Const();
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 120) {
                        s0 = peg$c115;
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c116);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 121) {
                            s0 = peg$c117;
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c118);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (peg$c119.test(input.charAt(peg$currPos))) {
                                s0 = input.charAt(peg$currPos);
                                peg$currPos++;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c120);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                s0 = peg$parseNum();
                            }
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Call() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
        s0 = peg$currPos;
        s1 = peg$parseMath_Func_1();
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 40) {
                    s3 = peg$c111;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c112);
                    }
                }
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parseMath_Expr();
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parse_();
                            if (s6 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                    s7 = peg$c113;
                                    peg$currPos++;
                                }
                                else {
                                    s7 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c114);
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
            s1 = peg$parseMath_Func_2();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 40) {
                        s3 = peg$c111;
                        peg$currPos++;
                    }
                    else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c112);
                        }
                    }
                    if (s3 !== peg$FAILED) {
                        s4 = peg$parse_();
                        if (s4 !== peg$FAILED) {
                            s5 = peg$parseMath_Expr();
                            if (s5 !== peg$FAILED) {
                                s6 = peg$parse_();
                                if (s6 !== peg$FAILED) {
                                    if (input.charCodeAt(peg$currPos) === 44) {
                                        s7 = peg$c121;
                                        peg$currPos++;
                                    }
                                    else {
                                        s7 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c122);
                                        }
                                    }
                                    if (s7 !== peg$FAILED) {
                                        s8 = peg$parse_();
                                        if (s8 !== peg$FAILED) {
                                            s9 = peg$parseMath_Expr();
                                            if (s9 !== peg$FAILED) {
                                                s10 = peg$parse_();
                                                if (s10 !== peg$FAILED) {
                                                    if (input.charCodeAt(peg$currPos) === 41) {
                                                        s11 = peg$c113;
                                                        peg$currPos++;
                                                    }
                                                    else {
                                                        s11 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c114);
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
                s1 = peg$parseMath_Func_3();
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 40) {
                            s3 = peg$c111;
                            peg$currPos++;
                        }
                        else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c112);
                            }
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseMath_Expr();
                                if (s5 !== peg$FAILED) {
                                    s6 = peg$parse_();
                                    if (s6 !== peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 44) {
                                            s7 = peg$c121;
                                            peg$currPos++;
                                        }
                                        else {
                                            s7 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c122);
                                            }
                                        }
                                        if (s7 !== peg$FAILED) {
                                            s8 = peg$parse_();
                                            if (s8 !== peg$FAILED) {
                                                s9 = peg$parseMath_Expr();
                                                if (s9 !== peg$FAILED) {
                                                    s10 = peg$parse_();
                                                    if (s10 !== peg$FAILED) {
                                                        if (input.charCodeAt(peg$currPos) === 44) {
                                                            s11 = peg$c121;
                                                            peg$currPos++;
                                                        }
                                                        else {
                                                            s11 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c122);
                                                            }
                                                        }
                                                        if (s11 !== peg$FAILED) {
                                                            s12 = peg$parse_();
                                                            if (s12 !== peg$FAILED) {
                                                                s13 = peg$parseMath_Expr();
                                                                if (s13 !== peg$FAILED) {
                                                                    s14 = peg$parse_();
                                                                    if (s14 !== peg$FAILED) {
                                                                        if (input.charCodeAt(peg$currPos) === 41) {
                                                                            s15 = peg$c113;
                                                                            peg$currPos++;
                                                                        }
                                                                        else {
                                                                            s15 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c114);
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
    function peg$parseMath_Func_1() {
        var s0;
        if (input.substr(peg$currPos, 3) === peg$c123) {
            s0 = peg$c123;
            peg$currPos += 3;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c124);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c125) {
                s0 = peg$c125;
                peg$currPos += 4;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c126);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c127) {
                    s0 = peg$c127;
                    peg$currPos += 4;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c128);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c129) {
                        s0 = peg$c129;
                        peg$currPos += 2;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c130);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c131) {
                            s0 = peg$c131;
                            peg$currPos += 4;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c132);
                            }
                        }
                        if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 4) === peg$c133) {
                                s0 = peg$c133;
                                peg$currPos += 4;
                            }
                            else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c134);
                                }
                            }
                            if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 4) === peg$c135) {
                                    s0 = peg$c135;
                                    peg$currPos += 4;
                                }
                                else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c136);
                                    }
                                }
                                if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 4) === peg$c137) {
                                        s0 = peg$c137;
                                        peg$currPos += 4;
                                    }
                                    else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c138);
                                        }
                                    }
                                    if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 4) === peg$c139) {
                                            s0 = peg$c139;
                                            peg$currPos += 4;
                                        }
                                        else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c140);
                                            }
                                        }
                                        if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 4) === peg$c141) {
                                                s0 = peg$c141;
                                                peg$currPos += 4;
                                            }
                                            else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c142);
                                                }
                                            }
                                            if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 3) === peg$c143) {
                                                    s0 = peg$c143;
                                                    peg$currPos += 3;
                                                }
                                                else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                        peg$fail(peg$c144);
                                                    }
                                                }
                                                if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 3) === peg$c145) {
                                                        s0 = peg$c145;
                                                        peg$currPos += 3;
                                                    }
                                                    else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                            peg$fail(peg$c146);
                                                        }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 3) === peg$c147) {
                                                            s0 = peg$c147;
                                                            peg$currPos += 3;
                                                        }
                                                        else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                                peg$fail(peg$c148);
                                                            }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 3) === peg$c149) {
                                                                s0 = peg$c149;
                                                                peg$currPos += 3;
                                                            }
                                                            else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                    peg$fail(peg$c150);
                                                                }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 3) === peg$c151) {
                                                                    s0 = peg$c151;
                                                                    peg$currPos += 3;
                                                                }
                                                                else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                        peg$fail(peg$c152);
                                                                    }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 3) === peg$c153) {
                                                                        s0 = peg$c153;
                                                                        peg$currPos += 3;
                                                                    }
                                                                    else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                            peg$fail(peg$c154);
                                                                        }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 7) === peg$c155) {
                                                                            s0 = peg$c155;
                                                                            peg$currPos += 7;
                                                                        }
                                                                        else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                                peg$fail(peg$c156);
                                                                            }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 7) === peg$c157) {
                                                                                s0 = peg$c157;
                                                                                peg$currPos += 7;
                                                                            }
                                                                            else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$c158);
                                                                                }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 7) === peg$c159) {
                                                                                    s0 = peg$c159;
                                                                                    peg$currPos += 7;
                                                                                }
                                                                                else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$c160);
                                                                                    }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 7) === peg$c161) {
                                                                                        s0 = peg$c161;
                                                                                        peg$currPos += 7;
                                                                                    }
                                                                                    else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$c162);
                                                                                        }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 7) === peg$c163) {
                                                                                            s0 = peg$c163;
                                                                                            peg$currPos += 7;
                                                                                        }
                                                                                        else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$c164);
                                                                                            }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 7) === peg$c165) {
                                                                                                s0 = peg$c165;
                                                                                                peg$currPos += 7;
                                                                                            }
                                                                                            else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) {
                                                                                                    peg$fail(peg$c166);
                                                                                                }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 6) === peg$c167) {
                                                                                                    s0 = peg$c167;
                                                                                                    peg$currPos += 6;
                                                                                                }
                                                                                                else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) {
                                                                                                        peg$fail(peg$c168);
                                                                                                    }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 6) === peg$c169) {
                                                                                                        s0 = peg$c169;
                                                                                                        peg$currPos += 6;
                                                                                                    }
                                                                                                    else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) {
                                                                                                            peg$fail(peg$c170);
                                                                                                        }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 6) === peg$c171) {
                                                                                                            s0 = peg$c171;
                                                                                                            peg$currPos += 6;
                                                                                                        }
                                                                                                        else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) {
                                                                                                                peg$fail(peg$c172);
                                                                                                            }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 6) === peg$c173) {
                                                                                                                s0 = peg$c173;
                                                                                                                peg$currPos += 6;
                                                                                                            }
                                                                                                            else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) {
                                                                                                                    peg$fail(peg$c174);
                                                                                                                }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 6) === peg$c175) {
                                                                                                                    s0 = peg$c175;
                                                                                                                    peg$currPos += 6;
                                                                                                                }
                                                                                                                else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                        peg$fail(peg$c176);
                                                                                                                    }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 6) === peg$c177) {
                                                                                                                        s0 = peg$c177;
                                                                                                                        peg$currPos += 6;
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        s0 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) {
                                                                                                                            peg$fail(peg$c178);
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
    function peg$parseMath_Func_2() {
        var s0;
        if (input.substr(peg$currPos, 4) === peg$c179) {
            s0 = peg$c179;
            peg$currPos += 4;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c180);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c181) {
                s0 = peg$c181;
                peg$currPos += 3;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c182);
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Func_3() {
        var s0;
        if (input.substr(peg$currPos, 3) === peg$c183) {
            s0 = peg$c183;
            peg$currPos += 3;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c184);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c185) {
                s0 = peg$c185;
                peg$currPos += 4;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c186);
                }
            }
        }
        return s0;
    }
    function peg$parseMath_Const() {
        var s0;
        if (input.substr(peg$currPos, 2) === peg$c187) {
            s0 = peg$c187;
            peg$currPos += 2;
        }
        else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c188);
            }
        }
        if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 960) {
                s0 = peg$c189;
                peg$currPos++;
            }
            else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c190);
                }
            }
            if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c191) {
                    s0 = peg$c191;
                    peg$currPos += 3;
                }
                else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c192);
                    }
                }
                if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 964) {
                        s0 = peg$c193;
                        peg$currPos++;
                    }
                    else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c194);
                        }
                    }
                    if (s0 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 101) {
                            s0 = peg$c195;
                            peg$currPos++;
                        }
                        else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c196);
                            }
                        }
                    }
                }
            }
        }
        return s0;
    }
    function peg$parseCmmnt() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c197) {
            s1 = peg$c197;
            peg$currPos += 2;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c198);
            }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c199.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c200);
                }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c199.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c200);
                    }
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                    s3 = peg$c113;
                    peg$currPos++;
                }
                else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c114);
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c201();
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
    function peg$parse_() {
        var s0, s1;
        s0 = [];
        if (peg$c202.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        }
        else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
                peg$fail(peg$c203);
            }
        }
        while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c202.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            }
            else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c203);
                }
            }
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
"use strict";
exports.__esModule = true;
exports.Op = exports.Instr_Type = void 0;
var Instr_Type;
(function (Instr_Type) {
    Instr_Type[Instr_Type["op"] = 0] = "op";
    Instr_Type[Instr_Type["name"] = 1] = "name";
    Instr_Type[Instr_Type["ref"] = 2] = "ref";
    Instr_Type[Instr_Type["obj"] = 3] = "obj";
    Instr_Type[Instr_Type["prop"] = 4] = "prop";
    Instr_Type[Instr_Type["ls"] = 5] = "ls";
    Instr_Type[Instr_Type["num"] = 6] = "num";
    Instr_Type[Instr_Type["str"] = 7] = "str";
    Instr_Type[Instr_Type["if"] = 8] = "if";
    Instr_Type[Instr_Type["for"] = 9] = "for";
    Instr_Type[Instr_Type["while"] = 10] = "while";
    Instr_Type[Instr_Type["local"] = 11] = "local";
    Instr_Type[Instr_Type["var"] = 12] = "var";
    Instr_Type[Instr_Type["fun"] = 13] = "fun";
    Instr_Type[Instr_Type["cmmnt"] = 14] = "cmmnt";
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

},{}]},{},[3])(3)
});
