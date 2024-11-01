
//
// https://peggyjs.org/

import nodos from "../patron/nodos.js";


function peg$subclass(child, parent) {
  function C() { this.constructor = child; }
  C.prototype = parent.prototype;
  child.prototype = new C();
}

function peg$SyntaxError(message, expected, found, location) {
  var self = Error.call(this, message);
  // istanbul ignore next Check is a necessary evil to support older environments
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
}

peg$subclass(peg$SyntaxError, Error);

function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) { return str; }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}

peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
      ? this.location.source.offset(s)
      : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, ' ');
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = (last - s.column) || 1;
      str += "\n --> " + loc + "\n"
          + filler + " |\n"
          + offset_s.line + " | " + line + "\n"
          + filler + " | " + peg$padEnd("", s.column - 1, ' ')
          + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },

    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part)
          ? classEscape(part[0]) + "-" + classEscape(part[1])
          : classEscape(part);
      });

      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },

    any: function() {
      return "any character";
    },

    end: function() {
      return "end of input";
    },

    other: function(expectation) {
      return expectation.description;
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/"/g,  "\\\"")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/\]/g, "\\]")
      .replace(/\^/g, "\\^")
      .replace(/-/g,  "\\-")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;

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
  options = options !== undefined ? options : {};

  var peg$FAILED = {};
  var peg$source = options.grammarSource;

  var peg$startRuleFunctions = { programa: peg$parseprograma };
  var peg$startRuleFunction = peg$parseprograma;

  var peg$c0 = "struct";
  var peg$c1 = "{";
  var peg$c2 = "}";
  var peg$c3 = ";";
  var peg$c4 = "void";
  var peg$c5 = "(";
  var peg$c6 = ")";
  var peg$c7 = ",";
  var peg$c8 = "[";
  var peg$c9 = "]";
  var peg$c10 = "=";
  var peg$c11 = "new";
  var peg$c12 = "System.out.println(";
  var peg$c13 = "if";
  var peg$c14 = "else";
  var peg$c15 = "while";
  var peg$c16 = "for";
  var peg$c17 = ":";
  var peg$c18 = "break";
  var peg$c19 = "continue";
  var peg$c20 = "return";
  var peg$c21 = "switch";
  var peg$c22 = "case";
  var peg$c23 = "default";
  var peg$c24 = "typeof";
  var peg$c25 = "Object.keys";
  var peg$c26 = "+=";
  var peg$c27 = "-=";
  var peg$c28 = "?";
  var peg$c29 = "||";
  var peg$c30 = "&&";
  var peg$c31 = "==";
  var peg$c32 = "!=";
  var peg$c33 = "<=";
  var peg$c34 = "<";
  var peg$c35 = ">=";
  var peg$c36 = ">";
  var peg$c37 = "-";
  var peg$c38 = "!";
  var peg$c39 = ".";
  var peg$c40 = "indexOf";
  var peg$c41 = "join";
  var peg$c42 = "length";
  var peg$c43 = "\"";
  var peg$c44 = "'";
  var peg$c45 = "\\";
  var peg$c46 = "int";
  var peg$c47 = "float";
  var peg$c48 = "string";
  var peg$c49 = "boolean";
  var peg$c50 = "char";
  var peg$c51 = "var";
  var peg$c52 = "//";
  var peg$c53 = "/*";
  var peg$c54 = "*/";
  var peg$c55 = "true";
  var peg$c56 = "false";

  var peg$r0 = /^[+\-]/;
  var peg$r1 = /^[%*\/]/;
  var peg$r2 = /^[0-9]/;
  var peg$r3 = /^[^\\"]/;
  var peg$r4 = /^["\\nrt"]/;
  var peg$r5 = /^[ \t\n\r]/;
  var peg$r6 = /^[\n]/;
  var peg$r7 = /^[a-zA-Z_]/;
  var peg$r8 = /^[a-zA-Z0-9_]/;

  var peg$e0 = peg$literalExpectation("struct", false);
  var peg$e1 = peg$literalExpectation("{", false);
  var peg$e2 = peg$literalExpectation("}", false);
  var peg$e3 = peg$literalExpectation(";", false);
  var peg$e4 = peg$literalExpectation("void", false);
  var peg$e5 = peg$literalExpectation("(", false);
  var peg$e6 = peg$literalExpectation(")", false);
  var peg$e7 = peg$literalExpectation(",", false);
  var peg$e8 = peg$literalExpectation("[", false);
  var peg$e9 = peg$literalExpectation("]", false);
  var peg$e10 = peg$literalExpectation("=", false);
  var peg$e11 = peg$literalExpectation("new", false);
  var peg$e12 = peg$literalExpectation("System.out.println(", false);
  var peg$e13 = peg$literalExpectation("if", false);
  var peg$e14 = peg$literalExpectation("else", false);
  var peg$e15 = peg$literalExpectation("while", false);
  var peg$e16 = peg$literalExpectation("for", false);
  var peg$e17 = peg$literalExpectation(":", false);
  var peg$e18 = peg$literalExpectation("break", false);
  var peg$e19 = peg$literalExpectation("continue", false);
  var peg$e20 = peg$literalExpectation("return", false);
  var peg$e21 = peg$literalExpectation("switch", false);
  var peg$e22 = peg$literalExpectation("case", false);
  var peg$e23 = peg$literalExpectation("default", false);
  var peg$e24 = peg$literalExpectation("typeof", false);
  var peg$e25 = peg$literalExpectation("Object.keys", false);
  var peg$e26 = peg$literalExpectation("+=", false);
  var peg$e27 = peg$literalExpectation("-=", false);
  var peg$e28 = peg$literalExpectation("?", false);
  var peg$e29 = peg$literalExpectation("||", false);
  var peg$e30 = peg$literalExpectation("&&", false);
  var peg$e31 = peg$literalExpectation("==", false);
  var peg$e32 = peg$literalExpectation("!=", false);
  var peg$e33 = peg$literalExpectation("<=", false);
  var peg$e34 = peg$literalExpectation("<", false);
  var peg$e35 = peg$literalExpectation(">=", false);
  var peg$e36 = peg$literalExpectation(">", false);
  var peg$e37 = peg$classExpectation(["+", "-"], false, false);
  var peg$e38 = peg$classExpectation(["%", "*", "/"], false, false);
  var peg$e39 = peg$literalExpectation("-", false);
  var peg$e40 = peg$literalExpectation("!", false);
  var peg$e41 = peg$literalExpectation(".", false);
  var peg$e42 = peg$literalExpectation("indexOf", false);
  var peg$e43 = peg$literalExpectation("join", false);
  var peg$e44 = peg$literalExpectation("length", false);
  var peg$e45 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e46 = peg$literalExpectation("\"", false);
  var peg$e47 = peg$literalExpectation("'", false);
  var peg$e48 = peg$classExpectation(["\\", "\""], true, false);
  var peg$e49 = peg$literalExpectation("\\", false);
  var peg$e50 = peg$classExpectation(["\"", "\\", "n", "r", "t", "\""], false, false);
  var peg$e51 = peg$literalExpectation("int", false);
  var peg$e52 = peg$literalExpectation("float", false);
  var peg$e53 = peg$literalExpectation("string", false);
  var peg$e54 = peg$literalExpectation("boolean", false);
  var peg$e55 = peg$literalExpectation("char", false);
  var peg$e56 = peg$literalExpectation("var", false);
  var peg$e57 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false);
  var peg$e58 = peg$literalExpectation("//", false);
  var peg$e59 = peg$classExpectation(["\n"], false, false);
  var peg$e60 = peg$anyExpectation();
  var peg$e61 = peg$literalExpectation("/*", false);
  var peg$e62 = peg$literalExpectation("*/", false);
  var peg$e63 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false);
  var peg$e64 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false);
  var peg$e65 = peg$literalExpectation("true", false);
  var peg$e66 = peg$literalExpectation("false", false);

  var peg$f0 = function(dcl) { return dcl };
  var peg$f1 = function(dcl) { return dcl };
  var peg$f2 = function(dcl) { return dcl };
  var peg$f3 = function(dcl) { return dcl };
  var peg$f4 = function(stmt) { return stmt };
  var peg$f5 = function(id, dcls) {return crearNodo('dclStruct', {id, dcls})};
  var peg$f6 = function(dcl) { return dcl };
  var peg$f7 = function(id, id2) { const tipo = 'struct'; const exp = null; return crearNodo('declaracionTipoVariable', { tipo, id:id2, exp }) };
  var peg$f8 = function(tipo, id, params, bloque) { return crearNodo('dclFunc', { tipo, id, params: params || [], bloque }) };
  var peg$f9 = function(primerParam, param) { return param };
  var peg$f10 = function(primerParam, params) { return [primerParam, ...params] };
  var peg$f11 = function(tip) {return tip;};
  var peg$f12 = function(tipo, id) { return { tipo, id } };
  var peg$f13 = function(tipo, id, exp) { return crearNodo('declaracionTipoVariable', { tipo, id, exp }) };
  var peg$f14 = function(tipo, id) { const exp = null; return crearNodo('declaracionTipoVariable', { tipo, id, exp }) };
  var peg$f15 = function(idStruct, id, exp) {return crearNodo('declaracionTipoVariable', {tipo: idStruct, id, exp})};
  var peg$f16 = function(tipo, id, exp) {const tipo2 = null; const id2 = null; return crearNodo('declaracionArreglo',{tipo, id, exp, tipo2, id2})};
  var peg$f17 = function(tipo, id, tipo2, exp) {const id2=null; return crearNodo('declaracionArreglo',{tipo, id, exp, tipo2, id2})};
  var peg$f18 = function(tipo, id, id2) {const exp = null; const tipo2 = null;return crearNodo('declaracionArreglo',{tipo, id, exp, tipo2, id2})};
  var peg$f19 = function(tipo, id, exp) {

                const tipo2 = null; const expN = null; return crearNodo('declaracionMatriz', {tipo, id, exp, expN, tipo2})

            };
  var peg$f20 = function(tipo, id, tipo2, exp, expN1) {return expN1};
  var peg$f21 = function(tipo, id, tipo2, exp, expN) {

                    return crearNodo('declaracionMatriz', {tipo, id, exp, expN, tipo2})

                };
  var peg$f22 = function(elementos) {return elementos};
  var peg$f23 = function(primer, siguienteElem) {return siguienteElem};
  var peg$f24 = function(primer, siguiente) {return [primer,...siguiente];};
  var peg$f25 = function(valores) {return valores};
  var peg$f26 = function(valor) {return valor};
  var peg$f27 = function(exp, exp2) {return exp2};
  var peg$f28 = function(exp, coma) { return [exp, ...coma] };
  var peg$f29 = function(exp) { return crearNodo('print', { exp }) };
  var peg$f30 = function(Bloque) { return Bloque };
  var peg$f31 = function(cond, stmtTrue, stmtFalse) { return stmtFalse };
  var peg$f32 = function(cond, stmtTrue, stmtFalse) { return crearNodo('if', { cond, stmtTrue, stmtFalse }) };
  var peg$f33 = function(cond, stmt) { return crearNodo('while', { cond, stmt }) };
  var peg$f34 = function(init, cond, inc, stmt) {return crearNodo('for', { init, cond, inc, stmt })};
  var peg$f35 = function(tipo, id, id2, stmt) {return crearNodo('foreach', { tipo, id, id2, stmt })};
  var peg$f36 = function() { return crearNodo('break') };
  var peg$f37 = function() { return crearNodo('continue') };
  var peg$f38 = function(exp) { return crearNodo('return', { exp }) };
  var peg$f39 = function(exp) { return crearNodo('expresionStmt', { exp }) };
  var peg$f40 = function(dcls) { return crearNodo('bloque', { dcls }) };
  var peg$f41 = function(dcl) { return dcl };
  var peg$f42 = function(exp) { return exp };
  var peg$f43 = function() { return null };
  var peg$f44 = function(exp, cases, defaultClause) {return crearNodo('switch', { exp, cases, defaultClause: defaultClause || null });};
  var peg$f45 = function(exp, st) { return st };
  var peg$f46 = function(exp, stmt) {return { exp, stmt: stmt || [] };};
  var peg$f47 = function(st) {return st};
  var peg$f48 = function(stmt) {return { stmt };};
  var peg$f49 = function(asignado, asgn) {   

        if(asignado instanceof nodos.ReferenciaVariable){
            return crearNodo('asignacion', { id: asignado.id, asgn })
        }


        if(!(asignado instanceof nodos.Get)){
            throw new Error('Solo se pueden asignar valores a propiedades de objetos')
        }

        return crearNodo('set', {objetivo: asignado.objetivo, propiedad: asignado.propiedad, valor: asgn})
    
    };
  var peg$f50 = function(exp) { return crearNodo('typeof', { exp }) };
  var peg$f51 = function(exp) { return crearNodo('ObjKey', { exp }) };
  var peg$f52 = function(id, op, der) { return { tipo: op, der } };
  var peg$f53 = function(id, expansion) {
    const { tipo, der } = expansion;
    // Identificamos el operador aritmético basado en el operador de asignación compuesta
    const operadorAritmetico = tipo === "+=" ? "+" : "-";
    // Creamos la expresión expandida a = a + der
    const expresionAritmetica = crearNodo('binaria', { op: operadorAritmetico, izq: crearNodo('referenciaVariable', { id }), der });
    return crearNodo('asignacion', { id, asgn: expresionAritmetica });
};
  var peg$f54 = function(cond, expTrue, expFalse) { return crearNodo('ternario', { cond, expTrue, expFalse }) };
  var peg$f55 = function(izq, der) { return der };
  var peg$f56 = function(izq, expansion) { 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        return crearNodo('binaria', { op:'||', izq: operacionAnterior, der: operacionActual })
    },
    izq
    )
};
  var peg$f57 = function(izq, der) { return der };
  var peg$f58 = function(izq, expansion) { 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            return crearNodo('binaria', { op:'&&', izq: operacionAnterior, der: operacionActual })
    },
    izq
    )
};
  var peg$f59 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f60 = function(izq, expansion) { 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
};
  var peg$f61 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f62 = function(izq, expansion) { 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
};
  var peg$f63 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f64 = function(izq, expansion) { 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
};
  var peg$f65 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f66 = function(izq, expansion) {
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
        },
        izq
    )
};
  var peg$f67 = function(num) { return crearNodo('unaria', { op: '-', exp: num }) };
  var peg$f68 = function(num) { return crearNodo('unaria', { op: '!', exp: num }) };
  var peg$f69 = function(objetivoInicial, args) {return {args, tipo:'llamadaFuncion'}};
  var peg$f70 = function(objetivoInicial, id) {return {id, tipo:'get'}};
  var peg$f71 = function(objetivoInicial, operaciones) {
    const op = operaciones.reduce(
        (objetivo, args) => {
        //return crearNodo('llamada', { callee, args: args || [] })

        const {tipo, id, args:argumentos} = args;

        if(tipo === 'llamadaFuncion'){
            return crearNodo('llamada', { callee:objetivo, args: argumentos || [] })
        }else if(tipo === 'get'){
            return crearNodo('get', {objetivo, propiedad:id})
        }
        },
        objetivoInicial
    )
    return op;
};
  var peg$f72 = function(arg, exp) {return exp};
  var peg$f73 = function(arg, args) {return [arg, ...args]};
  var peg$f74 = function(exp) { return crearNodo('agrupacion', { exp }) };
  var peg$f75 = function(exp) { return crearNodo('agrupacion', { exp }) };
  var peg$f76 = function(id, args) {return crearNodo('instancia', {id, args: args || []})};
  var peg$f77 = function(id) { return crearNodo('referenciaVariable', { id }) };
  var peg$f78 = function(id, exp) {return exp};
  var peg$f79 = function(id, dato) {return datos};
  var peg$f80 = function(id, exp) {return {id, exp}};
  var peg$f81 = function(primero, id, exp) {return exp};
  var peg$f82 = function(primero, id, dato) {return datos};
  var peg$f83 = function(primero, id, exp) {return {id, exp}};
  var peg$f84 = function(primero, resto) {
        return [{id: primero.id, exp: primero.exp}, ...resto.map(({id, exp}) => ({id, exp}))];

    };
  var peg$f85 = function(id, method, exp) {return exp};
  var peg$f86 = function(id, method, exp) {return crearNodo('arrayFunc', { id, method, exp })};
  var peg$f87 = function(id, index, value) {return crearNodo('arrayFunc', { id, method:'setElement', exp:[index, value]});};
  var peg$f88 = function(id, index, index1) {return index1};
  var peg$f89 = function(id, index, indices, value) {return crearNodo('matrizFunc', { id, method:'setElement', indexs:[index, ...indices], value});};
  var peg$f90 = function(id, index, index1) {return index1};
  var peg$f91 = function(id, index, indices) {const value = null; return crearNodo('matrizFunc', { id, method:'getElement', indexs:[index, ...indices], value});};
  var peg$f92 = function(id, index) {const value = null; return crearNodo('arrayFunc', { id, method:'getElement', exp:[index,value]});};
  var peg$f93 = function() {
    const valorNum = parseInt(text(),10);
    return crearNodo('numero', { tipo:'int',valor: valorNum});
    };
  var peg$f94 = function() {
    const valorNum = parseFloat(text(),10);
    return crearNodo('numero', { tipo:'float',valor:valorNum});
    };
  var peg$f95 = function(chars) {return crearNodo('cadena', {tipo: 'string', valor: chars.join('')})};
  var peg$f96 = function(chars) {return crearNodo('cadena', {tipo: 'char', valor: chars})};
  var peg$f97 = function(esc) { 
    switch (esc) {
        case 'n': return '\n';
        case 't': return '\t';
        case 'r': return '\r';
        case '\\': return '\\';
        case '"': return '"';
    }
};
  var peg$f98 = function() { return text() };
  var peg$f99 = function() { const id = text(); return id;};
  var peg$f100 = function() { return crearNodo('booleano', {tipo: 'boolean', valor: true})};
  var peg$f101 = function() { return crearNodo('booleano', {tipo: 'boolean', valor: false})};
  var peg$currPos = options.peg$currPos | 0;
  var peg$savedPos = peg$currPos;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = peg$currPos;
  var peg$maxFailExpected = options.peg$maxFailExpected || [];
  var peg$silentFails = options.peg$silentFails | 0;

  var peg$result;

  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

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
    var details = peg$posDetailsCache[pos];
    var p;

    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {}
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
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos, endPos, offset) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);

    var res = {
      source: peg$source,
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
    if (offset && peg$source && (typeof peg$source.offset === "function")) {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

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
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseprograma() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = [];
    s3 = peg$parseDeclaracion();
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$parseDeclaracion();
    }
    s3 = peg$parse_();
    peg$savedPos = s0;
    s0 = peg$f0(s2);

    return s0;
  }

  function peg$parseDeclaracion() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseDecVariable();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      peg$savedPos = s0;
      s0 = peg$f1(s1);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseDecFuncion();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        peg$savedPos = s0;
        s0 = peg$f2(s1);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseStructDcl();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          peg$savedPos = s0;
          s0 = peg$f3(s1);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseStmt();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            peg$savedPos = s0;
            s0 = peg$f4(s1);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }
    }

    return s0;
  }

  function peg$parseStructDcl() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c0) {
      s1 = peg$c0;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e0); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseIdentificador();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 123) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = [];
          s8 = peg$parseStructFields();
          while (s8 !== peg$FAILED) {
            s7.push(s8);
            s8 = peg$parseStructFields();
          }
          s8 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 125) {
            s9 = peg$c2;
            peg$currPos++;
          } else {
            s9 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e2); }
          }
          if (s9 !== peg$FAILED) {
            s10 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s11 = peg$c3;
              peg$currPos++;
            } else {
              s11 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e3); }
            }
            if (s11 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f5(s3, s7);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseStructFields() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseDecVariable();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      peg$savedPos = s0;
      s0 = peg$f6(s1);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseIdentificador();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        s3 = peg$parseIdentificador();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 59) {
            s5 = peg$c3;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e3); }
          }
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f7(s1, s3);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseDecFuncion() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

    s0 = peg$currPos;
    s1 = peg$parseTiposDatosPrimitivos();
    if (s1 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c4) {
        s1 = peg$c4;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e4); }
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseIdentificador();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 40) {
          s5 = peg$c5;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e5); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseParametros();
          if (s7 === peg$FAILED) {
            s7 = null;
          }
          s8 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s9 = peg$c6;
            peg$currPos++;
          } else {
            s9 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e6); }
          }
          if (s9 !== peg$FAILED) {
            s10 = peg$parse_();
            s11 = peg$parseBloque();
            if (s11 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f8(s1, s3, s7, s11);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseParametros() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseParametro();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = [];
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c7;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseParametro();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s4;
          s4 = peg$f9(s1, s7);
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e7); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseParametro();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s4;
            s4 = peg$f9(s1, s7);
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f10(s1, s3);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseParametro() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parseTiposDatosPrimitivos();
    if (s2 !== peg$FAILED) {
      s3 = peg$parseConArreglo();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s1 = peg$f11(s2);
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 === peg$FAILED) {
      s1 = peg$parseTiposDatosPrimitivos();
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseIdentificador();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f12(s1, s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseConArreglo() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = [];
    s3 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 91) {
      s4 = peg$c8;
      peg$currPos++;
    } else {
      s4 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e8); }
    }
    if (s4 !== peg$FAILED) {
      s5 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 93) {
        s6 = peg$c9;
        peg$currPos++;
      } else {
        s6 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e9); }
      }
      if (s6 !== peg$FAILED) {
        s4 = [s4, s5, s6];
        s3 = s4;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    if (s3 !== peg$FAILED) {
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
          s4 = peg$c8;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e8); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 93) {
            s6 = peg$c9;
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e9); }
          }
          if (s6 !== peg$FAILED) {
            s4 = [s4, s5, s6];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
    } else {
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s1 = [s1, s2];
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDecVariable() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29;

    s0 = peg$currPos;
    s1 = peg$parseTiposDatosPrimitivos();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseIdentificador();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 61) {
          s5 = peg$c10;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e10); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseAsignacion();
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c3;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e3); }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f13(s1, s3, s7);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseTiposDatosPrimitivos();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        s3 = peg$parseIdentificador();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 59) {
            s5 = peg$c3;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e3); }
          }
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f14(s1, s3);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseIdentificador();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          s3 = peg$parseIdentificador();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c10;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e10); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              s7 = peg$parseAsignacion();
              if (s7 !== peg$FAILED) {
                s8 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 59) {
                  s9 = peg$c3;
                  peg$currPos++;
                } else {
                  s9 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e3); }
                }
                if (s9 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f15(s1, s3, s7);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseTiposDatosPrimitivos();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 91) {
              s3 = peg$c8;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e8); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 93) {
                s5 = peg$c9;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                s7 = peg$parseIdentificador();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 61) {
                    s9 = peg$c10;
                    peg$currPos++;
                  } else {
                    s9 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e10); }
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 123) {
                      s11 = peg$c1;
                      peg$currPos++;
                    } else {
                      s11 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e1); }
                    }
                    if (s11 !== peg$FAILED) {
                      s12 = peg$parse_();
                      s13 = peg$parseExpresionConComa();
                      if (s13 !== peg$FAILED) {
                        s14 = peg$parse_();
                        if (input.charCodeAt(peg$currPos) === 125) {
                          s15 = peg$c2;
                          peg$currPos++;
                        } else {
                          s15 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$e2); }
                        }
                        if (s15 !== peg$FAILED) {
                          s16 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 59) {
                            s17 = peg$c3;
                            peg$currPos++;
                          } else {
                            s17 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e3); }
                          }
                          if (s17 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s0 = peg$f16(s1, s7, s13);
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseTiposDatosPrimitivos();
            if (s1 !== peg$FAILED) {
              s2 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 91) {
                s3 = peg$c8;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e8); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 93) {
                  s5 = peg$c9;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e9); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  s7 = peg$parseIdentificador();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 61) {
                      s9 = peg$c10;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e10); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (input.substr(peg$currPos, 3) === peg$c11) {
                        s11 = peg$c11;
                        peg$currPos += 3;
                      } else {
                        s11 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e11); }
                      }
                      if (s11 !== peg$FAILED) {
                        s12 = peg$parse_();
                        s13 = peg$parseTiposDatosPrimitivos();
                        if (s13 !== peg$FAILED) {
                          s14 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 91) {
                            s15 = peg$c8;
                            peg$currPos++;
                          } else {
                            s15 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e8); }
                          }
                          if (s15 !== peg$FAILED) {
                            s16 = peg$parse_();
                            s17 = peg$parseAsignacion();
                            if (s17 !== peg$FAILED) {
                              s18 = peg$parse_();
                              if (input.charCodeAt(peg$currPos) === 93) {
                                s19 = peg$c9;
                                peg$currPos++;
                              } else {
                                s19 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$e9); }
                              }
                              if (s19 !== peg$FAILED) {
                                s20 = peg$parse_();
                                if (input.charCodeAt(peg$currPos) === 59) {
                                  s21 = peg$c3;
                                  peg$currPos++;
                                } else {
                                  s21 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$e3); }
                                }
                                if (s21 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s0 = peg$f17(s1, s7, s13, s17);
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseTiposDatosPrimitivos();
              if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 91) {
                  s3 = peg$c8;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e8); }
                }
                if (s3 !== peg$FAILED) {
                  s4 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s5 = peg$c9;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e9); }
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    s7 = peg$parseIdentificador();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_();
                      if (input.charCodeAt(peg$currPos) === 61) {
                        s9 = peg$c10;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e10); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        s11 = peg$parseAsignacion();
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 59) {
                            s13 = peg$c3;
                            peg$currPos++;
                          } else {
                            s13 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e3); }
                          }
                          if (s13 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s0 = peg$f18(s1, s7, s11);
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseTiposDatosPrimitivos();
                if (s1 !== peg$FAILED) {
                  s2 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 91) {
                    s3 = peg$c8;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e8); }
                  }
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s5 = peg$c9;
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e9); }
                    }
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parse_();
                      s7 = [];
                      s8 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 91) {
                        s9 = peg$c8;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e8); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (input.charCodeAt(peg$currPos) === 93) {
                          s11 = peg$c9;
                          peg$currPos++;
                        } else {
                          s11 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$e9); }
                        }
                        if (s11 !== peg$FAILED) {
                          s9 = [s9, s10, s11];
                          s8 = s9;
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s8;
                        s8 = peg$FAILED;
                      }
                      if (s8 !== peg$FAILED) {
                        while (s8 !== peg$FAILED) {
                          s7.push(s8);
                          s8 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 91) {
                            s9 = peg$c8;
                            peg$currPos++;
                          } else {
                            s9 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e8); }
                          }
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parse_();
                            if (input.charCodeAt(peg$currPos) === 93) {
                              s11 = peg$c9;
                              peg$currPos++;
                            } else {
                              s11 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$e9); }
                            }
                            if (s11 !== peg$FAILED) {
                              s9 = [s9, s10, s11];
                              s8 = s9;
                            } else {
                              peg$currPos = s8;
                              s8 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s8;
                            s8 = peg$FAILED;
                          }
                        }
                      } else {
                        s7 = peg$FAILED;
                      }
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parse_();
                        s9 = peg$parseIdentificador();
                        if (s9 !== peg$FAILED) {
                          s10 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 61) {
                            s11 = peg$c10;
                            peg$currPos++;
                          } else {
                            s11 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e10); }
                          }
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parse_();
                            s13 = peg$parseMatrizValores();
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parse_();
                              if (input.charCodeAt(peg$currPos) === 59) {
                                s15 = peg$c3;
                                peg$currPos++;
                              } else {
                                s15 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$e3); }
                              }
                              if (s15 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s0 = peg$f19(s1, s9, s13);
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parseTiposDatosPrimitivos();
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 91) {
                      s3 = peg$c8;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e8); }
                    }
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parse_();
                      if (input.charCodeAt(peg$currPos) === 93) {
                        s5 = peg$c9;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e9); }
                      }
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        s7 = [];
                        s8 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 91) {
                          s9 = peg$c8;
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$e8); }
                        }
                        if (s9 !== peg$FAILED) {
                          s10 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 93) {
                            s11 = peg$c9;
                            peg$currPos++;
                          } else {
                            s11 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e9); }
                          }
                          if (s11 !== peg$FAILED) {
                            s9 = [s9, s10, s11];
                            s8 = s9;
                          } else {
                            peg$currPos = s8;
                            s8 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s8;
                          s8 = peg$FAILED;
                        }
                        if (s8 !== peg$FAILED) {
                          while (s8 !== peg$FAILED) {
                            s7.push(s8);
                            s8 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 91) {
                              s9 = peg$c8;
                              peg$currPos++;
                            } else {
                              s9 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$e8); }
                            }
                            if (s9 !== peg$FAILED) {
                              s10 = peg$parse_();
                              if (input.charCodeAt(peg$currPos) === 93) {
                                s11 = peg$c9;
                                peg$currPos++;
                              } else {
                                s11 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$e9); }
                              }
                              if (s11 !== peg$FAILED) {
                                s9 = [s9, s10, s11];
                                s8 = s9;
                              } else {
                                peg$currPos = s8;
                                s8 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s8;
                              s8 = peg$FAILED;
                            }
                          }
                        } else {
                          s7 = peg$FAILED;
                        }
                        if (s7 !== peg$FAILED) {
                          s8 = peg$parse_();
                          s9 = peg$parseIdentificador();
                          if (s9 !== peg$FAILED) {
                            s10 = peg$parse_();
                            if (input.charCodeAt(peg$currPos) === 61) {
                              s11 = peg$c10;
                              peg$currPos++;
                            } else {
                              s11 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$e10); }
                            }
                            if (s11 !== peg$FAILED) {
                              s12 = peg$parse_();
                              if (input.substr(peg$currPos, 3) === peg$c11) {
                                s13 = peg$c11;
                                peg$currPos += 3;
                              } else {
                                s13 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$e11); }
                              }
                              if (s13 !== peg$FAILED) {
                                s14 = peg$parse_();
                                s15 = peg$parseTiposDatosPrimitivos();
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parse_();
                                  if (input.charCodeAt(peg$currPos) === 91) {
                                    s17 = peg$c8;
                                    peg$currPos++;
                                  } else {
                                    s17 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$e8); }
                                  }
                                  if (s17 !== peg$FAILED) {
                                    s18 = peg$parse_();
                                    s19 = peg$parseAsignacion();
                                    if (s19 !== peg$FAILED) {
                                      s20 = peg$parse_();
                                      if (input.charCodeAt(peg$currPos) === 93) {
                                        s21 = peg$c9;
                                        peg$currPos++;
                                      } else {
                                        s21 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$e9); }
                                      }
                                      if (s21 !== peg$FAILED) {
                                        s22 = peg$parse_();
                                        s23 = [];
                                        s24 = peg$currPos;
                                        if (input.charCodeAt(peg$currPos) === 91) {
                                          s25 = peg$c8;
                                          peg$currPos++;
                                        } else {
                                          s25 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$e8); }
                                        }
                                        if (s25 !== peg$FAILED) {
                                          s26 = peg$parse_();
                                          s27 = peg$parseAsignacion();
                                          if (s27 !== peg$FAILED) {
                                            s28 = peg$parse_();
                                            if (input.charCodeAt(peg$currPos) === 93) {
                                              s29 = peg$c9;
                                              peg$currPos++;
                                            } else {
                                              s29 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$e9); }
                                            }
                                            if (s29 !== peg$FAILED) {
                                              peg$savedPos = s24;
                                              s24 = peg$f20(s1, s9, s15, s19, s27);
                                            } else {
                                              peg$currPos = s24;
                                              s24 = peg$FAILED;
                                            }
                                          } else {
                                            peg$currPos = s24;
                                            s24 = peg$FAILED;
                                          }
                                        } else {
                                          peg$currPos = s24;
                                          s24 = peg$FAILED;
                                        }
                                        if (s24 !== peg$FAILED) {
                                          while (s24 !== peg$FAILED) {
                                            s23.push(s24);
                                            s24 = peg$currPos;
                                            if (input.charCodeAt(peg$currPos) === 91) {
                                              s25 = peg$c8;
                                              peg$currPos++;
                                            } else {
                                              s25 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$e8); }
                                            }
                                            if (s25 !== peg$FAILED) {
                                              s26 = peg$parse_();
                                              s27 = peg$parseAsignacion();
                                              if (s27 !== peg$FAILED) {
                                                s28 = peg$parse_();
                                                if (input.charCodeAt(peg$currPos) === 93) {
                                                  s29 = peg$c9;
                                                  peg$currPos++;
                                                } else {
                                                  s29 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$e9); }
                                                }
                                                if (s29 !== peg$FAILED) {
                                                  peg$savedPos = s24;
                                                  s24 = peg$f20(s1, s9, s15, s19, s27);
                                                } else {
                                                  peg$currPos = s24;
                                                  s24 = peg$FAILED;
                                                }
                                              } else {
                                                peg$currPos = s24;
                                                s24 = peg$FAILED;
                                              }
                                            } else {
                                              peg$currPos = s24;
                                              s24 = peg$FAILED;
                                            }
                                          }
                                        } else {
                                          s23 = peg$FAILED;
                                        }
                                        if (s23 !== peg$FAILED) {
                                          s24 = peg$parse_();
                                          if (input.charCodeAt(peg$currPos) === 59) {
                                            s25 = peg$c3;
                                            peg$currPos++;
                                          } else {
                                            s25 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$e3); }
                                          }
                                          if (s25 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s0 = peg$f21(s1, s9, s15, s19, s23);
                                          } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                          }
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$FAILED;
                                        }
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
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

  function peg$parseMatrizValores() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (input.charCodeAt(peg$currPos) === 123) {
      s2 = peg$c1;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e1); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      s4 = peg$parseElementosAnidados();
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 125) {
          s6 = peg$c2;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e2); }
        }
        if (s6 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f22(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseElementosAnidados() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseMatrizElemento();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = [];
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c7;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseMatrizElemento();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s4;
          s4 = peg$f23(s1, s7);
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e7); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseMatrizElemento();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s4;
            s4 = peg$f23(s1, s7);
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f24(s1, s3);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMatrizElemento() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c1;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e1); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseElementosAnidados();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 125) {
          s5 = peg$c2;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e2); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f25(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseAsignacion();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f26(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseExpresionConComa() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseAsignacion();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = [];
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c7;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseAsignacion();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s4;
          s4 = peg$f27(s1, s7);
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e7); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseAsignacion();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s4;
            s4 = peg$f27(s1, s7);
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f28(s1, s3);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseStmt() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 19) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 19;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e12); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseExpresionConComa();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c6;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e6); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 59) {
            s7 = peg$c3;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e3); }
          }
          if (s7 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f29(s3);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseBloque();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f30(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c13) {
          s1 = peg$c13;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e13); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c5;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e5); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            s5 = peg$parseAsignacion();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 41) {
                s7 = peg$c6;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e6); }
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parse_();
                s9 = peg$parseStmt();
                if (s9 !== peg$FAILED) {
                  s10 = peg$currPos;
                  s11 = peg$parse_();
                  if (input.substr(peg$currPos, 4) === peg$c14) {
                    s12 = peg$c14;
                    peg$currPos += 4;
                  } else {
                    s12 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e14); }
                  }
                  if (s12 !== peg$FAILED) {
                    s13 = peg$parse_();
                    s14 = peg$parseStmt();
                    if (s14 !== peg$FAILED) {
                      peg$savedPos = s10;
                      s10 = peg$f31(s5, s9, s14);
                    } else {
                      peg$currPos = s10;
                      s10 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s10;
                    s10 = peg$FAILED;
                  }
                  if (s10 === peg$FAILED) {
                    s10 = null;
                  }
                  peg$savedPos = s0;
                  s0 = peg$f32(s5, s9, s10);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 5) === peg$c15) {
            s1 = peg$c15;
            peg$currPos += 5;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e15); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 40) {
              s3 = peg$c5;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e5); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              s5 = peg$parseAsignacion();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c6;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e6); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  s9 = peg$parseStmt();
                  if (s9 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f33(s5, s9);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c16) {
              s1 = peg$c16;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e16); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c5;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e5); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                s5 = peg$parseForInit();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  s7 = peg$parseAsignacion();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s9 = peg$c3;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e3); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      s11 = peg$parseAsignacion();
                      if (s11 !== peg$FAILED) {
                        s12 = peg$parse_();
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s13 = peg$c6;
                          peg$currPos++;
                        } else {
                          s13 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$e6); }
                        }
                        if (s13 !== peg$FAILED) {
                          s14 = peg$parse_();
                          s15 = peg$parseStmt();
                          if (s15 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s0 = peg$f34(s5, s7, s11, s15);
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 3) === peg$c16) {
                s1 = peg$c16;
                peg$currPos += 3;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e16); }
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 40) {
                  s3 = peg$c5;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e5); }
                }
                if (s3 !== peg$FAILED) {
                  s4 = peg$parse_();
                  s5 = peg$parseTiposDatosPrimitivos();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    s7 = peg$parseIdentificador();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_();
                      if (input.charCodeAt(peg$currPos) === 58) {
                        s9 = peg$c17;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e17); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        s11 = peg$parseAsignacion();
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 41) {
                            s13 = peg$c6;
                            peg$currPos++;
                          } else {
                            s13 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e6); }
                          }
                          if (s13 !== peg$FAILED) {
                            s14 = peg$parse_();
                            s15 = peg$parseStmt();
                            if (s15 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s0 = peg$f35(s5, s7, s11, s15);
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 5) === peg$c18) {
                  s1 = peg$c18;
                  peg$currPos += 5;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e18); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 59) {
                    s3 = peg$c3;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e3); }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f36();
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 8) === peg$c19) {
                    s1 = peg$c19;
                    peg$currPos += 8;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e19); }
                  }
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s3 = peg$c3;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e3); }
                    }
                    if (s3 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f37();
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.substr(peg$currPos, 6) === peg$c20) {
                      s1 = peg$c20;
                      peg$currPos += 6;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e20); }
                    }
                    if (s1 !== peg$FAILED) {
                      s2 = peg$parse_();
                      s3 = peg$parseAsignacion();
                      if (s3 === peg$FAILED) {
                        s3 = null;
                      }
                      s4 = peg$parse_();
                      if (input.charCodeAt(peg$currPos) === 59) {
                        s5 = peg$c3;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e3); }
                      }
                      if (s5 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s0 = peg$f38(s3);
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseSwitchStmt();
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parseAsignacion();
                        if (s1 !== peg$FAILED) {
                          s2 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 59) {
                            s3 = peg$c3;
                            peg$currPos++;
                          } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e3); }
                          }
                          if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s0 = peg$f39(s1);
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
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

  function peg$parseBloque() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c1;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e1); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = [];
      s4 = peg$parseDeclaracion();
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parseDeclaracion();
      }
      s4 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 125) {
        s5 = peg$c2;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e2); }
      }
      if (s5 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f40(s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseForInit() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseDeclaracion();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f41(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseAsignacion();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s3 = peg$c3;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e3); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f42(s1);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 59) {
          s1 = peg$c3;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e3); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$f43();
        }
        s0 = s1;
      }
    }

    return s0;
  }

  function peg$parseSwitchStmt() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c21) {
      s1 = peg$c21;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e21); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c5;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e5); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseAsignacion();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c6;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e6); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 123) {
              s9 = peg$c1;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e1); }
            }
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              s11 = [];
              s12 = peg$parseCaseClause();
              while (s12 !== peg$FAILED) {
                s11.push(s12);
                s12 = peg$parseCaseClause();
              }
              s12 = peg$parse_();
              s13 = peg$parseDefaultClause();
              if (s13 === peg$FAILED) {
                s13 = null;
              }
              s14 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 125) {
                s15 = peg$c2;
                peg$currPos++;
              } else {
                s15 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e2); }
              }
              if (s15 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f44(s5, s11, s13);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCaseClause() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (input.substr(peg$currPos, 4) === peg$c22) {
      s2 = peg$c22;
      peg$currPos += 4;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e22); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      s4 = peg$parseAsignacion();
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 58) {
          s6 = peg$c17;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e17); }
        }
        if (s6 !== peg$FAILED) {
          s7 = peg$parse_();
          s8 = [];
          s9 = peg$currPos;
          s10 = peg$parse_();
          s11 = peg$parseStmt();
          if (s11 !== peg$FAILED) {
            s12 = peg$parse_();
            peg$savedPos = s9;
            s9 = peg$f45(s4, s11);
          } else {
            peg$currPos = s9;
            s9 = peg$FAILED;
          }
          while (s9 !== peg$FAILED) {
            s8.push(s9);
            s9 = peg$currPos;
            s10 = peg$parse_();
            s11 = peg$parseStmt();
            if (s11 !== peg$FAILED) {
              s12 = peg$parse_();
              peg$savedPos = s9;
              s9 = peg$f45(s4, s11);
            } else {
              peg$currPos = s9;
              s9 = peg$FAILED;
            }
          }
          peg$savedPos = s0;
          s0 = peg$f46(s4, s8);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDefaultClause() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c23) {
      s1 = peg$c23;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e23); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 58) {
        s3 = peg$c17;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e17); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = [];
        s6 = peg$currPos;
        s7 = peg$parse_();
        s8 = peg$parseStmt();
        if (s8 !== peg$FAILED) {
          s9 = peg$parse_();
          peg$savedPos = s6;
          s6 = peg$f47(s8);
        } else {
          peg$currPos = s6;
          s6 = peg$FAILED;
        }
        while (s6 !== peg$FAILED) {
          s5.push(s6);
          s6 = peg$currPos;
          s7 = peg$parse_();
          s8 = peg$parseStmt();
          if (s8 !== peg$FAILED) {
            s9 = peg$parse_();
            peg$savedPos = s6;
            s6 = peg$f47(s8);
          } else {
            peg$currPos = s6;
            s6 = peg$FAILED;
          }
        }
        peg$savedPos = s0;
        s0 = peg$f48(s5);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAsignacion() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseLlamadaFuncion();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 61) {
        s3 = peg$c10;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e10); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseAsignacion();
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f49(s1, s5);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseOperadorAsignacion();
      if (s0 === peg$FAILED) {
        s0 = peg$parseTernario();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c24) {
            s1 = peg$c24;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e24); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            s3 = peg$parseAsignacion();
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              peg$savedPos = s0;
              s0 = peg$f50(s3);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 11) === peg$c25) {
              s1 = peg$c25;
              peg$currPos += 11;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e25); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c5;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e5); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                s5 = peg$parseDatos();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c6;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e6); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f51(s5);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseOr();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseOperadorAsignacion() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseIdentificador();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c26) {
        s5 = peg$c26;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e26); }
      }
      if (s5 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c27) {
          s5 = peg$c27;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e27); }
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseRelacionales();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f52(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f53(s1, s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseTernario() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    s1 = peg$parseComparacion();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 63) {
        s3 = peg$c28;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e28); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseAsignacion();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 58) {
            s7 = peg$c17;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e17); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            s9 = peg$parseAsignacion();
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f54(s1, s5, s9);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseOr() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseAnd();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c29) {
        s5 = peg$c29;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e29); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseAnd();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f55(s1, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 2) === peg$c29) {
          s5 = peg$c29;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e29); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseAnd();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f55(s1, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f56(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAnd() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseComparacion();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c30) {
        s5 = peg$c30;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e30); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseComparacion();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f57(s1, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 2) === peg$c30) {
          s5 = peg$c30;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e30); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseComparacion();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f57(s1, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f58(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseComparacion() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseRelacionales();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c31) {
        s5 = peg$c31;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e31); }
      }
      if (s5 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c32) {
          s5 = peg$c32;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e32); }
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseRelacionales();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f59(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 2) === peg$c31) {
          s5 = peg$c31;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e31); }
        }
        if (s5 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c32) {
            s5 = peg$c32;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e32); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseRelacionales();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f59(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f60(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseRelacionales() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseSuma();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c33) {
        s5 = peg$c33;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e33); }
      }
      if (s5 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 60) {
          s5 = peg$c34;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e34); }
        }
        if (s5 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c35) {
            s5 = peg$c35;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e35); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 62) {
              s5 = peg$c36;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e36); }
            }
          }
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseSuma();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f61(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 2) === peg$c33) {
          s5 = peg$c33;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e33); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 60) {
            s5 = peg$c34;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e34); }
          }
          if (s5 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c35) {
              s5 = peg$c35;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e35); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 62) {
                s5 = peg$c36;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e36); }
              }
            }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseSuma();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f61(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f62(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSuma() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseMultiplicacion();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = input.charAt(peg$currPos);
      if (peg$r0.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e37); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseMultiplicacion();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f63(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = input.charAt(peg$currPos);
        if (peg$r0.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e37); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseMultiplicacion();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f63(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f64(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMultiplicacion() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseUnaria();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = input.charAt(peg$currPos);
      if (peg$r1.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e38); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseUnaria();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f65(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = input.charAt(peg$currPos);
        if (peg$r1.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e38); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseUnaria();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f65(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f66(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseUnaria() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 45) {
      s1 = peg$c37;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e39); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseUnaria();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f67(s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 33) {
        s1 = peg$c38;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e40); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        s3 = peg$parseUnaria();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f68(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseLlamadaFuncion();
      }
    }

    return s0;
  }

  function peg$parseLlamadaFuncion() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    s1 = peg$parseDatos();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = [];
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s5 = peg$c5;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e5); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseArgumentos();
        if (s7 === peg$FAILED) {
          s7 = null;
        }
        s8 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 41) {
          s9 = peg$c6;
          peg$currPos++;
        } else {
          s9 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e6); }
        }
        if (s9 !== peg$FAILED) {
          peg$savedPos = s4;
          s4 = peg$f69(s1, s7);
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 === peg$FAILED) {
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s5 = peg$c39;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e41); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseIdentificador();
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            peg$savedPos = s4;
            s4 = peg$f70(s1, s7);
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s5 = peg$c5;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e5); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseArgumentos();
          if (s7 === peg$FAILED) {
            s7 = null;
          }
          s8 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s9 = peg$c6;
            peg$currPos++;
          } else {
            s9 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e6); }
          }
          if (s9 !== peg$FAILED) {
            peg$savedPos = s4;
            s4 = peg$f69(s1, s7);
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 === peg$FAILED) {
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 46) {
            s5 = peg$c39;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e41); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            s7 = peg$parseIdentificador();
            if (s7 !== peg$FAILED) {
              s8 = peg$parse_();
              peg$savedPos = s4;
              s4 = peg$f70(s1, s7);
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        }
      }
      peg$savedPos = s0;
      s0 = peg$f71(s1, s3);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseArgumentos() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseAsignacion();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = [];
      s4 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c7;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseAsignacion();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s4;
          s4 = peg$f72(s1, s7);
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e7); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseAsignacion();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s4;
            s4 = peg$f72(s1, s7);
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f73(s1, s3);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDatos() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e5); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseAsignacion();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c6;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e6); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f74(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c8;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        s3 = peg$parseAsignacion();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 93) {
            s5 = peg$c9;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e9); }
          }
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f75(s3);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseNumeroDecimal();
        if (s0 === peg$FAILED) {
          s0 = peg$parseNumeroEntero();
          if (s0 === peg$FAILED) {
            s0 = peg$parseCadena();
            if (s0 === peg$FAILED) {
              s0 = peg$parseBooleano();
              if (s0 === peg$FAILED) {
                s0 = peg$parseArrayFunc();
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parseIdentificador();
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 123) {
                      s3 = peg$c1;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e1); }
                    }
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parse_();
                      s5 = peg$parseStructInstancia();
                      if (s5 === peg$FAILED) {
                        s5 = null;
                      }
                      s6 = peg$parse_();
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s7 = peg$c2;
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e2); }
                      }
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s0 = peg$f76(s1, s5);
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parseIdentificador();
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$f77(s1);
                    }
                    s0 = s1;
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

  function peg$parseStructInstancia() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parseIdentificador();
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 58) {
        s4 = peg$c17;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e17); }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        s6 = peg$currPos;
        s7 = peg$parseAsignacion();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s6;
          s7 = peg$f78(s2, s7);
        }
        s6 = s7;
        if (s6 === peg$FAILED) {
          s6 = peg$currPos;
          s7 = peg$parseDatos();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s6;
            s7 = peg$f79(s2, s7);
          }
          s6 = s7;
        }
        if (s6 !== peg$FAILED) {
          peg$savedPos = s1;
          s1 = peg$f80(s2, s6);
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c7;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseIdentificador();
        if (s7 !== peg$FAILED) {
          s8 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 58) {
            s9 = peg$c17;
            peg$currPos++;
          } else {
            s9 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e17); }
          }
          if (s9 !== peg$FAILED) {
            s10 = peg$parse_();
            s11 = peg$currPos;
            s12 = peg$parseAsignacion();
            if (s12 !== peg$FAILED) {
              peg$savedPos = s11;
              s12 = peg$f81(s1, s7, s12);
            }
            s11 = s12;
            if (s11 === peg$FAILED) {
              s11 = peg$currPos;
              s12 = peg$parseDatos();
              if (s12 !== peg$FAILED) {
                peg$savedPos = s11;
                s12 = peg$f82(s1, s7, s12);
              }
              s11 = s12;
            }
            if (s11 !== peg$FAILED) {
              peg$savedPos = s3;
              s3 = peg$f83(s1, s7, s11);
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e7); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseIdentificador();
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 58) {
              s9 = peg$c17;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e17); }
            }
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              s11 = peg$currPos;
              s12 = peg$parseAsignacion();
              if (s12 !== peg$FAILED) {
                peg$savedPos = s11;
                s12 = peg$f81(s1, s7, s12);
              }
              s11 = s12;
              if (s11 === peg$FAILED) {
                s11 = peg$currPos;
                s12 = peg$parseDatos();
                if (s12 !== peg$FAILED) {
                  peg$savedPos = s11;
                  s12 = peg$f82(s1, s7, s12);
                }
                s11 = s12;
              }
              if (s11 !== peg$FAILED) {
                peg$savedPos = s3;
                s3 = peg$f83(s1, s7, s11);
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f84(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseArrayFunc() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

    s0 = peg$currPos;
    s1 = peg$parseIdentificador();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c39;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e41); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 7) === peg$c40) {
          s5 = peg$c40;
          peg$currPos += 7;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e42); }
        }
        if (s5 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c41) {
            s5 = peg$c41;
            peg$currPos += 4;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e43); }
          }
          if (s5 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c42) {
              s5 = peg$c42;
              peg$currPos += 6;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e44); }
            }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 40) {
            s8 = peg$c5;
            peg$currPos++;
          } else {
            s8 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e5); }
          }
          if (s8 !== peg$FAILED) {
            s9 = peg$parse_();
            s10 = peg$parseAsignacion();
            if (s10 === peg$FAILED) {
              s10 = null;
            }
            s11 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 41) {
              s12 = peg$c6;
              peg$currPos++;
            } else {
              s12 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e6); }
            }
            if (s12 !== peg$FAILED) {
              peg$savedPos = s7;
              s7 = peg$f85(s1, s5, s10);
            } else {
              peg$currPos = s7;
              s7 = peg$FAILED;
            }
          } else {
            peg$currPos = s7;
            s7 = peg$FAILED;
          }
          if (s7 === peg$FAILED) {
            s7 = null;
          }
          peg$savedPos = s0;
          s0 = peg$f86(s1, s5, s7);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseIdentificador();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 91) {
          s3 = peg$c8;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e8); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          s5 = peg$parseAsignacion();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 93) {
              s7 = peg$c9;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e9); }
            }
            if (s7 !== peg$FAILED) {
              s8 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 61) {
                s9 = peg$c10;
                peg$currPos++;
              } else {
                s9 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e10); }
              }
              if (s9 !== peg$FAILED) {
                s10 = peg$parse_();
                s11 = peg$parseAsignacion();
                if (s11 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f87(s1, s5, s11);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseIdentificador();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 91) {
            s3 = peg$c8;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            s5 = peg$parseAsignacion();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s6 = peg$c9;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                s8 = [];
                s9 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 91) {
                  s10 = peg$c8;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e8); }
                }
                if (s10 !== peg$FAILED) {
                  s11 = peg$parse_();
                  s12 = peg$parseAsignacion();
                  if (s12 !== peg$FAILED) {
                    s13 = peg$parse_();
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s14 = peg$c9;
                      peg$currPos++;
                    } else {
                      s14 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e9); }
                    }
                    if (s14 !== peg$FAILED) {
                      peg$savedPos = s9;
                      s9 = peg$f88(s1, s5, s12);
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s9;
                  s9 = peg$FAILED;
                }
                if (s9 !== peg$FAILED) {
                  while (s9 !== peg$FAILED) {
                    s8.push(s9);
                    s9 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 91) {
                      s10 = peg$c8;
                      peg$currPos++;
                    } else {
                      s10 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$e8); }
                    }
                    if (s10 !== peg$FAILED) {
                      s11 = peg$parse_();
                      s12 = peg$parseAsignacion();
                      if (s12 !== peg$FAILED) {
                        s13 = peg$parse_();
                        if (input.charCodeAt(peg$currPos) === 93) {
                          s14 = peg$c9;
                          peg$currPos++;
                        } else {
                          s14 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$e9); }
                        }
                        if (s14 !== peg$FAILED) {
                          peg$savedPos = s9;
                          s9 = peg$f88(s1, s5, s12);
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  }
                } else {
                  s8 = peg$FAILED;
                }
                if (s8 !== peg$FAILED) {
                  s9 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 61) {
                    s10 = peg$c10;
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e10); }
                  }
                  if (s10 !== peg$FAILED) {
                    s11 = peg$parse_();
                    s12 = peg$parseAsignacion();
                    if (s12 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f89(s1, s5, s8, s12);
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseIdentificador();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 91) {
              s3 = peg$c8;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e8); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              s5 = peg$parseAsignacion();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s6 = peg$c9;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e9); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  s8 = [];
                  s9 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 91) {
                    s10 = peg$c8;
                    peg$currPos++;
                  } else {
                    s10 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e8); }
                  }
                  if (s10 !== peg$FAILED) {
                    s11 = peg$parse_();
                    s12 = peg$parseAsignacion();
                    if (s12 !== peg$FAILED) {
                      s13 = peg$parse_();
                      if (input.charCodeAt(peg$currPos) === 93) {
                        s14 = peg$c9;
                        peg$currPos++;
                      } else {
                        s14 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e9); }
                      }
                      if (s14 !== peg$FAILED) {
                        peg$savedPos = s9;
                        s9 = peg$f90(s1, s5, s12);
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s9;
                      s9 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                  if (s9 !== peg$FAILED) {
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 91) {
                        s10 = peg$c8;
                        peg$currPos++;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$e8); }
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parse_();
                        s12 = peg$parseAsignacion();
                        if (s12 !== peg$FAILED) {
                          s13 = peg$parse_();
                          if (input.charCodeAt(peg$currPos) === 93) {
                            s14 = peg$c9;
                            peg$currPos++;
                          } else {
                            s14 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$e9); }
                          }
                          if (s14 !== peg$FAILED) {
                            peg$savedPos = s9;
                            s9 = peg$f90(s1, s5, s12);
                          } else {
                            peg$currPos = s9;
                            s9 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s9;
                          s9 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s9;
                        s9 = peg$FAILED;
                      }
                    }
                  } else {
                    s8 = peg$FAILED;
                  }
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f91(s1, s5, s8);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseIdentificador();
            if (s1 !== peg$FAILED) {
              s2 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 91) {
                s3 = peg$c8;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e8); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                s5 = peg$parseAsignacion();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$e9); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f92(s1, s5);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseNumeroEntero() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r2.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e45); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = input.charAt(peg$currPos);
        if (peg$r2.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e45); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f93();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseNumeroDecimal() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r2.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e45); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = input.charAt(peg$currPos);
        if (peg$r2.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e45); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c39;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e41); }
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = input.charAt(peg$currPos);
        if (peg$r2.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e45); }
        }
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = input.charAt(peg$currPos);
            if (peg$r2.test(s5)) {
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e45); }
            }
          }
        } else {
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f94();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCadena() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c43;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e46); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseCaracteres();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseCaracteres();
      }
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c43;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e46); }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f95(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseCaracter();
    }

    return s0;
  }

  function peg$parseCaracter() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 39) {
      s1 = peg$c44;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e47); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseCaracteres();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c44;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e47); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f96(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCaracteres() {
    var s0;

    s0 = peg$parseEscapeSequence();
    if (s0 === peg$FAILED) {
      s0 = input.charAt(peg$currPos);
      if (peg$r3.test(s0)) {
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e48); }
      }
    }

    return s0;
  }

  function peg$parseEscapeSequence() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 92) {
      s1 = peg$c45;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e49); }
    }
    if (s1 !== peg$FAILED) {
      s2 = input.charAt(peg$currPos);
      if (peg$r4.test(s2)) {
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e50); }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f97(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseTiposDatosPrimitivos() {
    var s0, s1;

    if (input.substr(peg$currPos, 3) === peg$c46) {
      s0 = peg$c46;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e51); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c47) {
        s0 = peg$c47;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e52); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c48) {
          s0 = peg$c48;
          peg$currPos += 6;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e53); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c49) {
            s0 = peg$c49;
            peg$currPos += 7;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e54); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c50) {
              s0 = peg$c50;
              peg$currPos += 4;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e55); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c51) {
                s0 = peg$c51;
                peg$currPos += 3;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e56); }
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 6) === peg$c0) {
                  s1 = peg$c0;
                  peg$currPos += 6;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e0); }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$f98();
                }
                s0 = s1;
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
    s1 = input.charAt(peg$currPos);
    if (peg$r5.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e57); }
    }
    if (s1 === peg$FAILED) {
      s1 = peg$parseComentarios();
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = input.charAt(peg$currPos);
      if (peg$r5.test(s1)) {
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e57); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$parseComentarios();
      }
    }

    return s0;
  }

  function peg$parseComentarios() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c52) {
      s1 = peg$c52;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e58); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      s5 = input.charAt(peg$currPos);
      if (peg$r6.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e59); }
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = undefined;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e60); }
        }
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = input.charAt(peg$currPos);
        if (peg$r6.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e59); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = undefined;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e60); }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      s1 = [s1, s2];
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c53) {
        s1 = peg$c53;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e61); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c54) {
          s5 = peg$c54;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e62); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = undefined;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e60); }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c54) {
            s5 = peg$c54;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e62); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = undefined;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e60); }
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (input.substr(peg$currPos, 2) === peg$c54) {
          s3 = peg$c54;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e62); }
        }
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseIdentificador() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = input.charAt(peg$currPos);
    if (peg$r7.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e63); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r8.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e64); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r8.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e64); }
        }
      }
      peg$savedPos = s0;
      s0 = peg$f99();
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseBooleano() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c55) {
      s1 = peg$c55;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e65); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f100();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c56) {
        s1 = peg$c56;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e66); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f101();
      }
      s0 = s1;
    }

    return s0;
  }


    const crearNodo = (tipoNodo, props) =>{
    const tipos = {
        'numero': nodos.Numero,
        'agrupacion': nodos.Agrupacion,
        'binaria': nodos.OperacionBinaria,
        'unaria': nodos.OperacionUnaria,
        'declaracionTipoVariable': nodos.DeclaracionTipoVariable,
        'referenciaVariable': nodos.ReferenciaVariable,
        'print': nodos.Print,
        'expresionStmt': nodos.ExpresionStmt,
        'asignacion': nodos.Asignacion,
        'bloque': nodos.Bloque,
        'if': nodos.If,
        'while': nodos.While,
        'cadena': nodos.Cadena,
        'booleano': nodos.Booleano,
        "for": nodos.For,
        "foreach": nodos.Foreach,
        "break": nodos.Break,
        "continue": nodos.Continue,
        "return": nodos.Return,
        "llamada": nodos.Llamada,
        "ternario": nodos.Ternario,
        "switch": nodos.Switch,
        "declaracionArreglo": nodos.DeclaracionArreglo,
        "arrayFunc": nodos.ArrayFunc,
        "declaracionMatriz": nodos.DeclaracionMatriz,
        "matrizFunc": nodos.MatrizFunc,
        'dclFunc': nodos.FuncDcl,
        'typeof': nodos.typEof,
        'dclStruct': nodos.StructDcl,
        'instancia': nodos.Instancia,
        'get': nodos.Get,
        'set': nodos.Set,
        'ObjKey': nodos.ObjKey
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
    }


  peg$result = peg$startRuleFunction();

  if (options.peg$library) {
    return /** @type {any} */ ({
      peg$result,
      peg$currPos,
      peg$FAILED,
      peg$maxFailExpected,
      peg$maxFailPos
    });
  }
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

const peg$allowedStartRules = [
  "programa"
];

export {
  peg$allowedStartRules as StartRules,
  peg$SyntaxError as SyntaxError,
  peg$parse as parse
};
