var TICKER = (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

(function () {
  function e(e) {
    this.tokens = [], this.tokens.links = {}, this.options = e || a.defaults, this.rules = p.normal, this.options.gfm && (this.options.tables ? this.rules = p.tables : this.rules = p.gfm);
  }function t(e, t) {
    if (this.options = t || a.defaults, this.links = e, this.rules = u.normal, this.renderer = this.options.renderer || new n(), this.renderer.options = this.options, !this.links) throw new Error("Tokens array requires a `links` property.");this.options.gfm ? this.options.breaks ? this.rules = u.breaks : this.rules = u.gfm : this.options.pedantic && (this.rules = u.pedantic);
  }function n(e) {
    this.options = e || {};
  }function r(e) {
    this.tokens = [], this.token = null, this.options = e || a.defaults, this.options.renderer = this.options.renderer || new n(), this.renderer = this.options.renderer, this.renderer.options = this.options;
  }function s(e, t) {
    return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }function i(e) {
    return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function (e, t) {
      return t = t.toLowerCase(), "colon" === t ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : "";
    });
  }function l(e, t) {
    return e = e.source, t = t || "", function n(r, s) {
      return r ? (s = s.source || s, s = s.replace(/(^|[^\[])\^/g, "$1"), e = e.replace(r, s), n) : new RegExp(e, t);
    };
  }function o() {}function h(e) {
    for (var t, n, r = 1; r < arguments.length; r++) {
      t = arguments[r];for (n in t) {
        Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }
    }return e;
  }function a(t, n, i) {
    if (i || "function" == typeof n) {
      i || (i = n, n = null), n = h({}, a.defaults, n || {});var l,
          o,
          p = n.highlight,
          u = 0;try {
        l = e.lex(t, n);
      } catch (e) {
        return i(e);
      }o = l.length;var c = function c(e) {
        if (e) return n.highlight = p, i(e);var t;try {
          t = r.parse(l, n);
        } catch (t) {
          e = t;
        }return n.highlight = p, e ? i(e) : i(null, t);
      };if (!p || p.length < 3) return c();if (delete n.highlight, !o) return c();for (; u < l.length; u++) {
        !function (e) {
          return "code" !== e.type ? --o || c() : p(e.text, e.lang, function (t, n) {
            return t ? c(t) : null == n || n === e.text ? --o || c() : (e.text = n, e.escaped = !0, void (--o || c()));
          });
        }(l[u]);
      }
    } else try {
      return n && (n = h({}, a.defaults, n)), r.parse(e.lex(t, n), n);
    } catch (e) {
      if (e.message += "\nPlease report this to https://github.com/chjj/marked.", (n || a.defaults).silent) return "<p>An error occured:</p><pre>" + s(e.message + "", !0) + "</pre>";throw e;
    }
  }var p = { newline: /^\n+/, code: /^( {4}[^\n]+\n*)+/, fences: o, hr: /^( *[-*_]){3,} *(?:\n+|$)/, heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/, nptable: o, lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/, blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/, list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/, html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/, def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/, table: o, paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/, text: /^[^\n]+/ };p.bullet = /(?:[*+-]|\d+\.)/, p.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, p.item = l(p.item, "gm")(/bull/g, p.bullet)(), p.list = l(p.list)(/bull/g, p.bullet)("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def", "\\n+(?=" + p.def.source + ")")(), p.blockquote = l(p.blockquote)("def", p.def)(), p._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b", p.html = l(p.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, p._tag)(), p.paragraph = l(p.paragraph)("hr", p.hr)("heading", p.heading)("lheading", p.lheading)("blockquote", p.blockquote)("tag", "<" + p._tag)("def", p.def)(), p.normal = h({}, p), p.gfm = h({}, p.normal, { fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/, paragraph: /^/, heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/ }), p.gfm.paragraph = l(p.paragraph)("(?!", "(?!" + p.gfm.fences.source.replace("\\1", "\\2") + "|" + p.list.source.replace("\\1", "\\3") + "|")(), p.tables = h({}, p.gfm, { nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/, table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/ }), e.rules = p, e.lex = function (t, n) {
    var r = new e(n);return r.lex(t);
  }, e.prototype.lex = function (e) {
    return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"), this.token(e, !0);
  }, e.prototype.token = function (e, t, n) {
    for (var r, s, i, l, o, h, a, u, c, e = e.replace(/^ +$/gm, ""); e;) {
      if ((i = this.rules.newline.exec(e)) && (e = e.substring(i[0].length), i[0].length > 1 && this.tokens.push({ type: "space" })), i = this.rules.code.exec(e)) e = e.substring(i[0].length), i = i[0].replace(/^ {4}/gm, ""), this.tokens.push({ type: "code", text: this.options.pedantic ? i : i.replace(/\n+$/, "") });else if (i = this.rules.fences.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: "code", lang: i[2], text: i[3] || "" });else if (i = this.rules.heading.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: "heading", depth: i[1].length, text: i[2] });else if (t && (i = this.rules.nptable.exec(e))) {
        for (e = e.substring(i[0].length), h = { type: "table", header: i[1].replace(/^ *| *\| *$/g, "").split(/ *\| */), align: i[2].replace(/^ *|\| *$/g, "").split(/ *\| */), cells: i[3].replace(/\n$/, "").split("\n") }, u = 0; u < h.align.length; u++) {
          /^ *-+: *$/.test(h.align[u]) ? h.align[u] = "right" : /^ *:-+: *$/.test(h.align[u]) ? h.align[u] = "center" : /^ *:-+ *$/.test(h.align[u]) ? h.align[u] = "left" : h.align[u] = null;
        }for (u = 0; u < h.cells.length; u++) {
          h.cells[u] = h.cells[u].split(/ *\| */);
        }this.tokens.push(h);
      } else if (i = this.rules.lheading.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: "heading", depth: "=" === i[2] ? 1 : 2, text: i[1] });else if (i = this.rules.hr.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: "hr" });else if (i = this.rules.blockquote.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: "blockquote_start" }), i = i[0].replace(/^ *> ?/gm, ""), this.token(i, t, !0), this.tokens.push({ type: "blockquote_end" });else if (i = this.rules.list.exec(e)) {
        for (e = e.substring(i[0].length), l = i[2], this.tokens.push({ type: "list_start", ordered: l.length > 1 }), i = i[0].match(this.rules.item), r = !1, c = i.length, u = 0; u < c; u++) {
          h = i[u], a = h.length, h = h.replace(/^ *([*+-]|\d+\.) +/, ""), ~h.indexOf("\n ") && (a -= h.length, h = this.options.pedantic ? h.replace(/^ {1,4}/gm, "") : h.replace(new RegExp("^ {1," + a + "}", "gm"), "")), this.options.smartLists && u !== c - 1 && (o = p.bullet.exec(i[u + 1])[0], l === o || l.length > 1 && o.length > 1 || (e = i.slice(u + 1).join("\n") + e, u = c - 1)), s = r || /\n\n(?!\s*$)/.test(h), u !== c - 1 && (r = "\n" === h.charAt(h.length - 1), s || (s = r)), this.tokens.push({ type: s ? "loose_item_start" : "list_item_start" }), this.token(h, !1, n), this.tokens.push({ type: "list_item_end" });
        }this.tokens.push({ type: "list_end" });
      } else if (i = this.rules.html.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: this.options.sanitize ? "paragraph" : "html", pre: !this.options.sanitizer && ("pre" === i[1] || "script" === i[1] || "style" === i[1]), text: i[0] });else if (!n && t && (i = this.rules.def.exec(e))) e = e.substring(i[0].length), this.tokens.links[i[1].toLowerCase()] = { href: i[2], title: i[3] };else if (t && (i = this.rules.table.exec(e))) {
        for (e = e.substring(i[0].length), h = { type: "table", header: i[1].replace(/^ *| *\| *$/g, "").split(/ *\| */), align: i[2].replace(/^ *|\| *$/g, "").split(/ *\| */), cells: i[3].replace(/(?: *\| *)?\n$/, "").split("\n") }, u = 0; u < h.align.length; u++) {
          /^ *-+: *$/.test(h.align[u]) ? h.align[u] = "right" : /^ *:-+: *$/.test(h.align[u]) ? h.align[u] = "center" : /^ *:-+ *$/.test(h.align[u]) ? h.align[u] = "left" : h.align[u] = null;
        }for (u = 0; u < h.cells.length; u++) {
          h.cells[u] = h.cells[u].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
        }this.tokens.push(h);
      } else if (t && (i = this.rules.paragraph.exec(e))) e = e.substring(i[0].length), this.tokens.push({ type: "paragraph", text: "\n" === i[1].charAt(i[1].length - 1) ? i[1].slice(0, -1) : i[1] });else if (i = this.rules.text.exec(e)) e = e.substring(i[0].length), this.tokens.push({ type: "text", text: i[0] });else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
    }return this.tokens;
  };var u = { escape: /^\\([\\`*{}\[\]()#+\-.!_>])/, autolink: /^<([^ >]+(@|:\/)[^ >]+)>/, url: o, tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/, link: /^!?\[(inside)\]\(href\)/, reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/, nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/, strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/, em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/, code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/, br: /^ {2,}\n(?!\s*$)/, del: o, text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/ };u._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/, u._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/, u.link = l(u.link)("inside", u._inside)("href", u._href)(), u.reflink = l(u.reflink)("inside", u._inside)(), u.normal = h({}, u), u.pedantic = h({}, u.normal, { strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/, em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/ }), u.gfm = h({}, u.normal, { escape: l(u.escape)("])", "~|])")(), url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/, del: /^~~(?=\S)([\s\S]*?\S)~~/, text: l(u.text)("]|", "~]|")("|", "|https?://|")() }), u.breaks = h({}, u.gfm, { br: l(u.br)("{2,}", "*")(), text: l(u.gfm.text)("{2,}", "*")() }), t.rules = u, t.output = function (e, n, r) {
    var s = new t(n, r);return s.output(e);
  }, t.prototype.output = function (e) {
    for (var t, n, r, i, l = ""; e;) {
      if (i = this.rules.escape.exec(e)) e = e.substring(i[0].length), l += i[1];else if (i = this.rules.autolink.exec(e)) e = e.substring(i[0].length), "@" === i[2] ? (n = ":" === i[1].charAt(6) ? this.mangle(i[1].substring(7)) : this.mangle(i[1]), r = this.mangle("mailto:") + n) : (n = s(i[1]), r = n), l += this.renderer.link(r, null, n);else if (this.inLink || !(i = this.rules.url.exec(e))) {
        if (i = this.rules.tag.exec(e)) !this.inLink && /^<a /i.test(i[0]) ? this.inLink = !0 : this.inLink && /^<\/a>/i.test(i[0]) && (this.inLink = !1), e = e.substring(i[0].length), l += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(i[0]) : s(i[0]) : i[0];else if (i = this.rules.link.exec(e)) e = e.substring(i[0].length), this.inLink = !0, l += this.outputLink(i, { href: i[2], title: i[3] }), this.inLink = !1;else if ((i = this.rules.reflink.exec(e)) || (i = this.rules.nolink.exec(e))) {
          if (e = e.substring(i[0].length), t = (i[2] || i[1]).replace(/\s+/g, " "), t = this.links[t.toLowerCase()], !t || !t.href) {
            l += i[0].charAt(0), e = i[0].substring(1) + e;continue;
          }this.inLink = !0, l += this.outputLink(i, t), this.inLink = !1;
        } else if (i = this.rules.strong.exec(e)) e = e.substring(i[0].length), l += this.renderer.strong(this.output(i[2] || i[1]));else if (i = this.rules.em.exec(e)) e = e.substring(i[0].length), l += this.renderer.em(this.output(i[2] || i[1]));else if (i = this.rules.code.exec(e)) e = e.substring(i[0].length), l += this.renderer.codespan(s(i[2], !0));else if (i = this.rules.br.exec(e)) e = e.substring(i[0].length), l += this.renderer.br();else if (i = this.rules.del.exec(e)) e = e.substring(i[0].length), l += this.renderer.del(this.output(i[1]));else if (i = this.rules.text.exec(e)) e = e.substring(i[0].length), l += this.renderer.text(s(this.smartypants(i[0])));else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
      } else e = e.substring(i[0].length), n = s(i[1]), r = n, l += this.renderer.link(r, null, n);
    }return l;
  }, t.prototype.outputLink = function (e, t) {
    var n = s(t.href),
        r = t.title ? s(t.title) : null;return "!" !== e[0].charAt(0) ? this.renderer.link(n, r, this.output(e[1])) : this.renderer.image(n, r, s(e[1]));
  }, t.prototype.smartypants = function (e) {
    return this.options.smartypants ? e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014\/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…") : e;
  }, t.prototype.mangle = function (e) {
    if (!this.options.mangle) return e;for (var t, n = "", r = e.length, s = 0; s < r; s++) {
      t = e.charCodeAt(s), Math.random() > .5 && (t = "x" + t.toString(16)), n += "&#" + t + ";";
    }return n;
  }, n.prototype.code = function (e, t, n) {
    if (this.options.highlight) {
      var r = this.options.highlight(e, t);null != r && r !== e && (n = !0, e = r);
    }return t ? '<pre><code class="' + this.options.langPrefix + s(t, !0) + '">' + (n ? e : s(e, !0)) + "\n</code></pre>\n" : "<pre><code>" + (n ? e : s(e, !0)) + "\n</code></pre>";
  }, n.prototype.blockquote = function (e) {
    return "<blockquote>\n" + e + "</blockquote>\n";
  }, n.prototype.html = function (e) {
    return e;
  }, n.prototype.heading = function (e, t, n) {
    return "<h" + t + ' id="' + this.options.headerPrefix + n.toLowerCase().replace(/[^\w]+/g, "-") + '">' + e + "</h" + t + ">\n";
  }, n.prototype.hr = function () {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }, n.prototype.list = function (e, t) {
    var n = t ? "ol" : "ul";return "<" + n + ">\n" + e + "</" + n + ">\n";
  }, n.prototype.listitem = function (e) {
    return "<li>" + e + "</li>\n";
  }, n.prototype.paragraph = function (e) {
    return "<p>" + e + "</p>\n";
  }, n.prototype.table = function (e, t) {
    return "<table>\n<thead>\n" + e + "</thead>\n<tbody>\n" + t + "</tbody>\n</table>\n";
  }, n.prototype.tablerow = function (e) {
    return "<tr>\n" + e + "</tr>\n";
  }, n.prototype.tablecell = function (e, t) {
    var n = t.header ? "th" : "td",
        r = t.align ? "<" + n + ' style="text-align:' + t.align + '">' : "<" + n + ">";return r + e + "</" + n + ">\n";
  }, n.prototype.strong = function (e) {
    return "<strong>" + e + "</strong>";
  }, n.prototype.em = function (e) {
    return "<em>" + e + "</em>";
  }, n.prototype.codespan = function (e) {
    return "<code>" + e + "</code>";
  }, n.prototype.br = function () {
    return this.options.xhtml ? "<br/>" : "<br>";
  }, n.prototype.del = function (e) {
    return "<del>" + e + "</del>";
  }, n.prototype.link = function (e, t, n) {
    if (this.options.sanitize) {
      try {
        var r = decodeURIComponent(i(e)).replace(/[^\w:]/g, "").toLowerCase();
      } catch (e) {
        return "";
      }if (0 === r.indexOf("javascript:") || 0 === r.indexOf("vbscript:")) return "";
    }var s = '<a href="' + e + '"';return t && (s += ' title="' + t + '"'), s += ">" + n + "</a>";
  }, n.prototype.image = function (e, t, n) {
    var r = '<img src="' + e + '" alt="' + n + '"';return t && (r += ' title="' + t + '"'), r += this.options.xhtml ? "/>" : ">";
  }, n.prototype.text = function (e) {
    return e;
  }, r.parse = function (e, t, n) {
    var s = new r(t, n);return s.parse(e);
  }, r.prototype.parse = function (e) {
    this.inline = new t(e.links, this.options, this.renderer), this.tokens = e.reverse();for (var n = ""; this.next();) {
      n += this.tok();
    }return n;
  }, r.prototype.next = function () {
    return this.token = this.tokens.pop();
  }, r.prototype.peek = function () {
    return this.tokens[this.tokens.length - 1] || 0;
  }, r.prototype.parseText = function () {
    for (var e = this.token.text; "text" === this.peek().type;) {
      e += "\n" + this.next().text;
    }return this.inline.output(e);
  }, r.prototype.tok = function () {
    switch (this.token.type) {case "space":
        return "";case "hr":
        return this.renderer.hr();case "heading":
        return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);case "code":
        return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);case "table":
        var e,
            t,
            n,
            r,
            s,
            i = "",
            l = "";for (n = "", e = 0; e < this.token.header.length; e++) {
          r = { header: !0, align: this.token.align[e] }, n += this.renderer.tablecell(this.inline.output(this.token.header[e]), { header: !0, align: this.token.align[e] });
        }for (i += this.renderer.tablerow(n), e = 0; e < this.token.cells.length; e++) {
          for (t = this.token.cells[e], n = "", s = 0; s < t.length; s++) {
            n += this.renderer.tablecell(this.inline.output(t[s]), { header: !1, align: this.token.align[s] });
          }l += this.renderer.tablerow(n);
        }return this.renderer.table(i, l);case "blockquote_start":
        for (var l = ""; "blockquote_end" !== this.next().type;) {
          l += this.tok();
        }return this.renderer.blockquote(l);case "list_start":
        for (var l = "", o = this.token.ordered; "list_end" !== this.next().type;) {
          l += this.tok();
        }return this.renderer.list(l, o);case "list_item_start":
        for (var l = ""; "list_item_end" !== this.next().type;) {
          l += "text" === this.token.type ? this.parseText() : this.tok();
        }return this.renderer.listitem(l);case "loose_item_start":
        for (var l = ""; "list_item_end" !== this.next().type;) {
          l += this.tok();
        }return this.renderer.listitem(l);case "html":
        var h = this.token.pre || this.options.pedantic ? this.token.text : this.inline.output(this.token.text);return this.renderer.html(h);case "paragraph":
        return this.renderer.paragraph(this.inline.output(this.token.text));case "text":
        return this.renderer.paragraph(this.parseText());}
  }, o.exec = o, a.options = a.setOptions = function (e) {
    return h(a.defaults, e), a;
  }, a.defaults = { gfm: !0, tables: !0, breaks: !1, pedantic: !1, sanitize: !1, sanitizer: null, mangle: !0, smartLists: !1, silent: !1, highlight: null, langPrefix: "lang-", smartypants: !1, headerPrefix: "", renderer: new n(), xhtml: !1 }, a.Parser = r, a.parser = r.parse, a.Renderer = n, a.Lexer = e, a.lexer = e.lex, a.InlineLexer = t, a.inlineLexer = t.output, a.parse = a, "undefined" != typeof module && "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = a : "function" == typeof define && define.amd ? define(function () {
    return a;
  }) : this.marked = a;
}).call(function () {
  return this || ("undefined" != typeof window ? window : global);
}());

var sw = navigator.serviceWorker;
if (sw) {
  sw.register('../serviceWorker.js');
}

/*

Instance properties:

$n = DOM node
$s - spec (see below)
$x - Pool linked list next pointer

Spec properties:

c - create (or render)
u - update (or update)
r - keyed map of unmounted instanced that can be recycled

*/

var isDynamicEmpty = function isDynamicEmpty(v) {
  return v == null || v === true || v === false;
};
var EMPTY_PROPS = {};
var DEADPOOL = {
  push: function push() {},
  pop: function pop() {}
};

// Creates an empty object with no built in properties (ie. `constructor`).
function Hash() {}
Hash.prototype = Object.create(null);

// TODO: Benchmark whether this is slower than Function/Prototype
function Pool() {
  this.map = new Hash();
}

Pool.prototype.push = function (instance) {
  var key = instance.key;
  var map = this.map;

  instance.$x = map[key];
  map[key] = instance;
};

Pool.prototype.pop = function (key) {
  var head = this.map[key];
  if (!head) return;
  this.map[key] = head.$x;
  return head;
};

var recycle = function recycle(instance) {
  instance.$s.r.push(instance);
};
var createTextNode = function createTextNode(value) {
  return document.createTextNode(value);
};

var replaceNode = function replaceNode(oldNode, newNode) {
  var parentNode = oldNode.parentNode;
  if (parentNode) parentNode.replaceChild(newNode, oldNode);
};

function unmountInstance(inst, parentNode) {
  recycle(inst);
  parentNode.removeChild(inst.$n);
}

function removeArrayNodes(array, parentNode, i) {
  while (i < array.length) {
    unmountInstance(array[i++], parentNode);
  }
}

function removeArrayNodesOnlyChild(array, parentNode) {
  var i = 0;

  while (i < array.length) {
    recycle(array[i++]);
  }
  parentNode.textContent = '';
}

function internalRerenderInstance(prevInst, inst) {
  return prevInst.$s === inst.$s && (inst.$s.u(inst, prevInst), true);
}

function renderArrayToParentBefore(parentNode, array, i, markerNode) {
  if (markerNode === null) renderArrayToParent(parentNode, array, i);else renderArrayToParentBeforeNode(parentNode, array, i, markerNode);
}

function renderArrayToParentBeforeNode(parentNode, array, i, beforeNode) {
  while (i < array.length) {
    parentNode.insertBefore((array[i] = internalRender(array[i])).$n, beforeNode);
    ++i;
  }
}

function renderArrayToParent(parentNode, array, i) {
  while (i < array.length) {
    parentNode.appendChild((array[i] = internalRender(array[i])).$n);
    ++i;
  }
}

function rerenderDynamic(isOnlyChild, value, contextNode) {
  var frag = document.createDocumentFragment();
  var node = createDynamic(isOnlyChild, frag, value);
  replaceNode(contextNode, frag);
  return node;
}

function rerenderArrayReconcileWithMinLayout(parentNode, array, oldArray, markerNode) {
  var i = 0;
  for (; i < array.length && i < oldArray.length; i++) {
    array[i] = internalRerender(oldArray[i], array[i]);
  }

  if (i < array.length) {
    renderArrayToParentBefore(parentNode, array, i, markerNode);
  } else {
    removeArrayNodes(oldArray, parentNode, i);
  }
}

function rerenderArrayOnlyChild(parentNode, array, oldArray) {
  if (!oldArray.length) {
    renderArrayToParent(parentNode, array, 0);
  } else if (!array.length) {
    removeArrayNodesOnlyChild(oldArray, parentNode);
  } else {
    rerenderArrayReconcileWithMinLayout(parentNode, array, oldArray, null);
  }
}

function rerenderArray(array, parentOrMarkerNode, isOnlyChild, oldArray) {
  if (array instanceof Array) {
    return isOnlyChild ? rerenderArrayOnlyChild(parentOrMarkerNode, array, oldArray) : rerenderArrayReconcileWithMinLayout(parentOrMarkerNode.parentNode, array, oldArray, parentOrMarkerNode), parentOrMarkerNode;
  }

  if (isOnlyChild) {
    removeArrayNodesOnlyChild(oldArray, parentOrMarkerNode);
    return createDynamic(true, parentOrMarkerNode, array);
  }

  removeArrayNodes(oldArray, parentOrMarkerNode.parentNode, 0);
}

function rerenderText(value, contextNode, isOnlyChild) {
  if (!(value instanceof Object)) {

    contextNode.nodeValue = isDynamicEmpty(value) ? '' : value;
    return contextNode;
  }
}

function rerenderInstance(value, node, isOnlyChild, prevValue) {
  var prevRenderedInstance = void 0;
  if (value && internalRerenderInstance(prevRenderedInstance = prevValue.$r || prevValue, value)) {
    // TODO: What is $r? Is this trying to track the original rendered instnace?
    value.$r = prevRenderedInstance;
    return node;
  }
}

function StatefulComponent(render, props, instance, actions) {
  this._boundActions = new Hash();
  this._parentInst = instance;
  this.actions = actions;
  this.props = props;
  this.render = render;
  this.bindSend = this.bindSend.bind(this);
  this.state = actions.onInit(this);
  this.$n = internalRenderNoRecycle(this._instance = render(this));
}

StatefulComponent.prototype.updateProps = function (newProps) {
  var props = this.props;

  this.props = newProps;

  if (this.actions.onProps) this.send('onProps', props);else this.rerender();

  return this;
};

StatefulComponent.prototype.bindSend = function (action) {
  return this._boundActions[action] || (this._boundActions[action] = this.send.bind(this, action));
};

StatefulComponent.prototype.send = function (actionName, context) {
  var newState = void 0;
  var actionFn = this.actions[actionName];
  // TODO: process.ENV === 'development', console.error(`Action not found #{action}`);
  if (!actionFn || (newState = actionFn(this, context)) == this.state) return;

  this.state = newState;
  this.rerender();
};

StatefulComponent.prototype.rerender = function () {
  var instance = internalRerender(this._instance, this.render(this));
  this._instance = instance;
  instance.$n.xvdom = this._parentInst;
};

function createStatefulComponent(component, props, instance, actions) {
  return new StatefulComponent(component, props, instance, actions);
}

function createStatelessComponent(component, props) {
  var instance = component(props);
  internalRenderNoRecycle(instance);
  return instance;
}

function createComponent(component, actions, props, parentInstance) {
  var result = (actions ? createStatefulComponent : createStatelessComponent)(component, props || EMPTY_PROPS, parentInstance, actions);

  return result;
}

function updateComponent(component, actions, props, componentInstance) {
  var result = actions ? componentInstance.updateProps(props) : internalRerender(componentInstance, component(props));

  return result;
}

function internalRenderNoRecycle(instance) {
  var node = instance.$s.c(instance);
  instance.$n = node;
  node.xvdom = instance;
  return node;
}

function internalRender(instance) {
  var spec = instance.$s;
  var recycledInstance = spec.r.pop(instance.key);
  if (recycledInstance) {
    spec.u(instance, recycledInstance);
    return recycledInstance;
  }

  internalRenderNoRecycle(instance);
  return instance;
}

function createDynamic(isOnlyChild, parentNode, value) {
  return value instanceof Array ? (renderArrayToParent(parentNode, value, 0), isOnlyChild ? parentNode : parentNode.appendChild(createTextNode(''))) : parentNode.appendChild(value instanceof Object ? internalRenderNoRecycle(value) : createTextNode(isDynamicEmpty(value) ? '' : value));
}

function updateDynamic(isOnlyChild, oldValue, value, contextNode) {
  return (oldValue instanceof Object ? oldValue instanceof Array ? rerenderArray(value, contextNode, isOnlyChild, oldValue) : rerenderInstance(value, contextNode, isOnlyChild, oldValue) : rerenderText(value, contextNode, isOnlyChild)) || rerenderDynamic(isOnlyChild, value, contextNode);
}

function internalRerender(prevInstance, instance) {
  if (internalRerenderInstance(prevInstance, instance)) return prevInstance;

  replaceNode(prevInstance.$n, (instance = internalRender(instance)).$n);
  recycle(prevInstance);
  return instance;
}

var render = function render(instance) {
  return internalRender(instance).$n;
};
var rerender = function rerender(node, instance) {
  return internalRerender(node.xvdom, instance).$n;
};
var unmount = function unmount(node) {
  unmountInstance(node.xvdom, node.parentNode);
};

var xvdom = {
  createComponent: createComponent,
  createDynamic: createDynamic,
  el: function el(tag) {
    return document.createElement(tag);
  },
  render: render,
  rerender: rerender,
  unmount: unmount,
  updateComponent: updateComponent,
  updateDynamic: updateDynamic,
  Pool: Pool,
  DEADPOOL: DEADPOOL
};

// Internal API

var _xvdomEl$3 = xvdom.el;
var _xvdomSpec$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$3('img');

    _n.className = 'Avatar';
    inst.b = _n;
    _n.onerror = inst.a;
    _n.src = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.onerror = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.src = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
var onerror = function onerror(_ref) {
  var target = _ref.target;
  target.src = EMPTY_IMAGE;
};

var Avatar = (function (_ref2) {
  var avatarUrl = _ref2.avatarUrl;
  return {
    $s: _xvdomSpec$3,
    a: onerror,
    c: avatarUrl + 'v=3&s=32'
  };
});

var _xvdomEl$4 = xvdom.el;
var _xvdomSpec$4 = {
  c: function c(inst) {
    var _n = _xvdomEl$4('i');

    inst.b = _n;
    _n.className = inst.a;
    _n.onClickArg = inst.c;
    _n.onClickFn = inst.d;
    _n.onclick = inst.e;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.onClickArg = v;
      pInst.c = v;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.b.onClickFn = v;
      pInst.d = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.b.onclick = v;
      pInst.e = v;
    }
  },
  r: xvdom.DEADPOOL
};
var handleClick = function handleClick(_ref) {
  var t = _ref.currentTarget;
  t.onClickFn(t.onClickArg);
};

var Icon = (function (_ref2) {
  var className = _ref2.className,
      name = _ref2.name,
      onClick = _ref2.onClick,
      onClickArg = _ref2.onClickArg,
      _ref2$size = _ref2.size,
      size = _ref2$size === undefined ? 'med' : _ref2$size;
  return {
    $s: _xvdomSpec$4,
    a: 'Icon Icon--' + size + ' octicon octicon-' + name + ' ' + className + ' t-center',
    c: onClickArg,
    d: onClick,
    e: onClick && handleClick
  };
});

var _xvdomCreateComponent$2 = xvdom.createComponent;
var _xvdomCreateDynamic$2 = xvdom.createDynamic;
var _xvdomEl$2 = xvdom.el;
var _xvdomUpdateComponent$2 = xvdom.updateComponent;
var _xvdomUpdateDynamic$2 = xvdom.updateDynamic;
var _xvdomSpec4$2 = {
  c: function c(inst) {
    var _n = _xvdomEl$2('div');

    inst.b = _n;
    _n.className = inst.a;
    _n.hidden = inst.c;
    inst.e = _xvdomCreateDynamic$2(true, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.hidden = v;
      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$2(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$2 = {
  c: function c(inst) {
    var _n = _xvdomEl$2('a'),
        _n2,
        _n3;

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    inst.e = _xvdomCreateDynamic$2(false, _n, inst.d);
    _n2 = _xvdomEl$2('div');
    _n2.className = 'l-margin-l3';
    inst.g = _xvdomCreateDynamic$2(false, _n2, inst.f);
    _n3 = _xvdomEl$2('div');
    _n3.className = 't-light t-font-size-14 c-gray-dark';
    inst.i = _n3;
    _n3.textContent = inst.h;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$2(false, pInst.d, pInst.d = inst.d, pInst.e);
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateDynamic$2(false, pInst.f, pInst.f = inst.f, pInst.g);
    }

    v = inst.h;

    if (v !== pInst.h) {
      pInst.i.textContent = v;
      pInst.h = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$2 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$2(Icon, Icon.state, {
      name: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$2(Icon, Icon.state, {
        name: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$2 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$2(Avatar, Avatar.state, {
      avatarUrl: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$2(Avatar, Avatar.state, {
        avatarUrl: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
function renderItem(el) {
  var item = this.item,
      context = this.context,
      listClass = this.listClass;

  var _item = item(el, context),
      href = _item.href,
      key = _item.key,
      avatarUrl = _item.avatarUrl,
      icon = _item.icon,
      text = _item.text,
      secondaryText = _item.secondaryText;

  return {
    $s: _xvdomSpec3$2,
    a: listClass,
    c: href,
    d: avatarUrl ? {
      $s: _xvdomSpec$2,
      a: avatarUrl
    } : {
      $s: _xvdomSpec2$2,
      a: icon
    },
    f: text,
    h: secondaryText,
    key: key
  };
}

var List = (function (_ref) {
  var className = _ref.className,
      context = _ref.context,
      list = _ref.list,
      item = _ref.item,
      itemClass = _ref.itemClass,
      transform = _ref.transform;

  var listClass = 'List-item layout horizontal center t-normal ' + (itemClass || '');
  list = list || [];
  if (transform) list = transform(list);
  return {
    $s: _xvdomSpec4$2,
    a: className,
    c: !list.length,
    d: list.map(renderItem, { item: item, context: context, listClass: listClass })
  };
});

var _xvdomCreateDynamic$3 = xvdom.createDynamic;
var _xvdomEl$5 = xvdom.el;
var _xvdomUpdateDynamic$3 = xvdom.updateDynamic;
var _xvdomSpec$5 = {
  c: function c(inst) {
    var _n = _xvdomEl$5('a'),
        _n2;

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    _n2 = _xvdomEl$5('span');
    _n2.className = 'c-gray-dark';
    inst.e = _n2;
    _n2.textContent = inst.d;

    _n.appendChild(_n2);

    inst.g = _xvdomCreateDynamic$3(false, _n, inst.f);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    v = inst.d;

    if (v !== pInst.d) {
      pInst.e.textContent = v;
      pInst.d = v;
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateDynamic$3(false, pInst.f, pInst.f = inst.f, pInst.g);
    }
  },
  r: xvdom.DEADPOOL
};
var SourceName = (function (_ref) {
  var className = _ref.className,
      displayName = _ref.displayName;

  var _displayName$split = displayName.split('/'),
      _displayName$split2 = slicedToArray(_displayName$split, 2),
      owner = _displayName$split2[0],
      repo = _displayName$split2[1];

  return {
    $s: _xvdomSpec$5,
    a: className || '',
    c: '#github/' + displayName,
    d: repo ? owner + '/' : '',
    f: repo || owner
  };
});

var compare = (function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
});

var _xvdomCreateComponent$1 = xvdom.createComponent;
var _xvdomCreateDynamic$1 = xvdom.createDynamic;
var _xvdomEl$1 = xvdom.el;
var _xvdomUpdateComponent$1 = xvdom.updateComponent;
var _xvdomUpdateDynamic$1 = xvdom.updateDynamic;
var _xvdomSpec4$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('div');

    inst.b = _n;
    _n.className = inst.a;
    inst.d = _xvdomCreateDynamic$1(true, _n, inst.c);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$1(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('div'),
        _n2;

    _n.className = 'List-item List-item--noDivider layout horizontal center';
    inst.b = _n;
    _n.onclick = inst.a;
    _n2 = _xvdomCreateComponent$1(Icon, Icon.state, {
      name: 'mark-github'
    }, inst).$n;

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('span');
    _n2.className = 'l-margin-l4';
    _n2.textContent = 'Login with GitHub';

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.onclick = v;
      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$1('div'),
        _n2,
        _n3;

    _n2 = _xvdomEl$1('div');
    _n2.className = 'List-item List-item--noDivider layout horizontal center';
    _n3 = (inst.b = _xvdomCreateComponent$1(Avatar, Avatar.state, {
      avatarUrl: inst.a
    }, inst)).$n;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$1('span');
    _n3.className = 'l-margin-l4';
    inst.d = _n3;
    _n3.textContent = inst.c;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('div');
    _n2.className = 'List-item List-item--header';

    _n2.appendChild(document.createTextNode(('REPOSITORIES') || ''));

    _n.appendChild(_n2);

    _n2 = (inst.h = _xvdomCreateComponent$1(List, List.state, {
      item: inst.e,
      itemClass: 'List-item--noDivider',
      list: inst.f,
      transform: inst.g
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('div');
    _n2.className = 'List-item List-item--header';

    _n2.appendChild(document.createTextNode(('USERS / ORGS') || ''));

    _n.appendChild(_n2);

    _n2 = (inst.l = _xvdomCreateComponent$1(List, List.state, {
      item: inst.i,
      itemClass: 'List-item--noDivider',
      list: inst.j,
      transform: inst.k
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = _xvdomEl$1('a');
    _n2.className = 'List-item List-item--header l-padding-b4';
    inst.n = _n2;
    _n2.onclick = inst.m;

    _n2.appendChild(document.createTextNode(('LOGOUT') || ''));

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$1(Avatar, Avatar.state, {
        avatarUrl: pInst.a = inst.a
      }, pInst.b);
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.textContent = v;
      pInst.c = v;
    }

    if (inst.f !== pInst.f || inst.e !== pInst.e || inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateComponent$1(List, List.state, {
        item: pInst.e = inst.e,
        itemClass: 'List-item--noDivider',
        list: pInst.f = inst.f,
        transform: pInst.g = inst.g
      }, pInst.h);
    }

    if (inst.j !== pInst.j || inst.i !== pInst.i || inst.k !== pInst.k) {
      pInst.l = _xvdomUpdateComponent$1(List, List.state, {
        item: pInst.i = inst.i,
        itemClass: 'List-item--noDivider',
        list: pInst.j = inst.j,
        transform: pInst.k = inst.k
      }, pInst.l);
    }

    v = inst.m;

    if (v !== pInst.m) {
      pInst.n.onclick = v;
      pInst.m = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$1 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$1(SourceName, SourceName.state, {
      displayName: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$1(SourceName, SourceName.state, {
        displayName: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var userAvatarUrl = function userAvatarUrl(username) {
  return 'https://github.com/' + username + '.png?size=32';
};
var sort = function sort(a, b) {
  return compare(a.sortKey, b.sortKey);
};
var renderData = function renderData(_ref) {
  var id = _ref.id;

  var _id$split = id.split('/'),
      _id$split2 = slicedToArray(_id$split, 2),
      owner = _id$split2[0],
      name = _id$split2[1];

  return {
    id: id,
    avatarUrl: userAvatarUrl(owner),
    sortKey: (name || owner).toLowerCase()
  };
};
var sortSources = function sortSources(sources) {
  return sources.map(renderData).sort(sort);
};

var item = function item(_ref2) {
  var id = _ref2.id,
      avatarUrl = _ref2.avatarUrl;
  return {
    href: '#github/' + id,
    avatarUrl: avatarUrl,
    key: id,
    text: {
      $s: _xvdomSpec$1,
      a: id
    }
  };
};

var logout = function logout() {
  window.localStorage.clear();
  window.location.reload();
};

// Lazily render drawer contents the first time the drawer is enabled.
// Prevent un-rendering contents when disabled.
var lazyRenderContents = false;
var AppDrawer = (function (_ref3) {
  var user = _ref3.user,
      enabled = _ref3.enabled,
      onLogin = _ref3.onLogin;

  lazyRenderContents = enabled || lazyRenderContents;
  var enabledClass = enabled ? 'is-enabled' : '';
  var renderedClass = lazyRenderContents ? 'is-rendered' : '';
  return {
    $s: _xvdomSpec4$1,
    a: 'AppDrawer fixed scroll ' + enabledClass + ' ' + renderedClass,
    c: lazyRenderContents && (user ? {
      $s: _xvdomSpec2$1,
      a: userAvatarUrl(user.githubUsername),
      c: user.githubUsername,
      e: item,
      f: user.sources.github.repos,
      g: sortSources,
      i: item,
      j: user.sources.github.users,
      k: sortSources,
      m: logout
    } : {
      $s: _xvdomSpec3$1,
      a: onLogin
    })
  };
});

var loadJSON = function loadJSON(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    var accessToken = localStorage.getItem('ticker:token:github');
    xhr.open('GET', url);
    if (accessToken) xhr.setRequestHeader('Authorization', 'token ' + accessToken);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onerror = reject;
    xhr.onload = function () {
      var response = xhr.response;
      if (response) {
        resolve(typeof response === 'string' ? JSON.parse(response) : response);
      } else {
        reject(new Error('loadJSON: empty response'));
      }
    };
  });
};

loadJSON.setAccessToken = function (accessToken) {
  localStorage.setItem('ticker:token:github', accessToken);
};

/*

Cross-session, Key-Value, LRU expunging storage.

*/

var REGISTRY_KEY = 'ticker:storage';

// Map of storage key to last used timestamp.
var registry = void 0;
try {
  registry = JSON.parse(localStorage.getItem(REGISTRY_KEY));
} catch (e) {} // eslint-disable-line no-empty

if (!registry) localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry = []));

var removeLRUItem = function removeLRUItem() {
  var lruKey = registry.pop();
  if (lruKey) {
    localStorage.removeItem(lruKey);
    updateRegistryKey(lruKey, false); // eslint-disable-line no-use-before-define
  }
};

var safeSetItem = function safeSetItem(key, value) {
  var remainingTries = registry.length;
  while (remainingTries--) {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (e) {
      removeLRUItem();
    }
  }
  
};

var updateRegistryKey = function updateRegistryKey(key, isAdd) {
  var keyIndex = registry.indexOf(key);
  if (keyIndex >= 0) registry.splice(keyIndex, 1);
  if (isAdd) registry.unshift(key);

  safeSetItem(REGISTRY_KEY, JSON.stringify(registry));
};

var updateLRUItem = function updateLRUItem(key) {
  updateRegistryKey(key, true);
};

var storage = {
  getItem: function getItem(key) {
    var value = localStorage.getItem(key);
    if (value) updateLRUItem(key);
    return value;
  },
  setItem: function setItem(key, value) {
    safeSetItem(key, value);
    updateLRUItem(key);
    return value;
  },
  getItemObj: function getItemObj(key) {
    var valueString = this.getItem(key);

    var value = valueString && JSON.parse(valueString);

    return value;
  },
  setItemObj: function setItemObj(key, value) {
    this.setItem(key, JSON.stringify(value));

    return value;
  }
};

var identity = function identity(o) {
  return o;
};
var fromCache = function fromCache(cacheKey) {
  return storage.getItemObj(cacheKey);
};
var load = function load(_ref) {
  var url = _ref.url,
      cache = _ref.cache,
      _ref$transform = _ref.transform,
      transform = _ref$transform === undefined ? identity : _ref$transform;
  return loadJSON(url).then(transform).then(!cache ? identity : function (obj) {
    return storage.setItemObj(cache, obj);
  });
};

var model = (function (_ref2) {
  var g = _ref2.get,
      q = _ref2.query;
  return {
    localGet: function localGet(options) {
      return fromCache(g(options).cache);
    },
    get: function get(options) {
      return load(g(options));
    },
    localQuery: function localQuery(options) {
      return fromCache(q(options).cache);
    },
    query: function query(options) {
      return load(q(options));
    }
  };
});

var GithubRepo = model({
  query: function query(_ref) {
    var term = _ref.term,
        id = _ref.id;
    return term != null ? {
      url: 'https://api.github.com/search/repositories?q=' + term + '&per_page=5',
      transform: function transform(d) {
        return d.items;
      }
    } : id ? { url: 'https://api.github.com/users/' + id + '/repos' } : null;
  }
});

var GithubUser = model({
  query: function query(_ref) {
    var term = _ref.term;
    return {
      url: 'https://api.github.com/search/users?q=' + term + '&per_page=5',
      transform: function transform(d) {
        return d.items;
      }
    };
  }
});

var _xvdomCreateComponent$3 = xvdom.createComponent;
var _xvdomCreateDynamic$4 = xvdom.createDynamic;
var _xvdomEl$6 = xvdom.el;
var _xvdomUpdateComponent$3 = xvdom.updateComponent;
var _xvdomUpdateDynamic$4 = xvdom.updateDynamic;
var _xvdomSpec3$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$6('div');

    inst.b = _n;
    _n.className = inst.a;
    inst.d = _xvdomCreateDynamic$4(true, _n, inst.c);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$4(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$6('div'),
        _n2,
        _n3,
        _n4;

    _n2 = _xvdomEl$6('div');
    _n2.className = 'AppSearch-searchInputContainer';
    _n3 = _xvdomEl$6('div');
    _n3.className = 'AppSearch-inkdrop fit';

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$6('div');
    _n3.className = 'AppSearch-searchBar layout horizontal';
    _n4 = _xvdomEl$6('input');
    _n4.className = 'AppSearch-searchInput flex l-padding-h4';
    inst.b = _n4;
    _n4.oninput = inst.a;
    _n4.placeholder = 'Search repositories or users\u2026';
    _n4.type = 'text';
    if (inst.c != null) _n4.value = inst.c;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = (inst.f = _xvdomCreateComponent$3(List, List.state, {
      className: 'AppSearch-searchResults',
      item: inst.d,
      itemClass: 'List-item--noDivider',
      list: inst.e
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.oninput = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.value !== v) {
        pInst.b.value = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d || inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateComponent$3(List, List.state, {
        className: 'AppSearch-searchResults',
        item: pInst.d = inst.d,
        itemClass: 'List-item--noDivider',
        list: pInst.e = inst.e
      }, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$6 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$3(SourceName, SourceName.state, {
      displayName: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$3(SourceName, SourceName.state, {
        displayName: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var item$1 = function item$1(_ref) {
  var avatar_url = _ref.avatar_url,
      full_name = _ref.full_name,
      id = _ref.id,
      login = _ref.login,
      owner = _ref.owner;
  return {
    href: '#github/' + (login || full_name),
    avatarUrl: avatar_url || owner && owner.avatar_url,
    key: id,
    text: {
      $s: _xvdomSpec$6,
      a: login || full_name
    }
  };
};

var AppSearch = function AppSearch(_ref2) {
  var enabled = _ref2.props.enabled,
      _ref2$state = _ref2.state,
      render$$1 = _ref2$state.render,
      searchResults = _ref2$state.searchResults,
      term = _ref2$state.term,
      bindSend = _ref2.bindSend;
  return {
    $s: _xvdomSpec3$3,
    a: 'AppSearch l-padding-2 fixed fixed--top ' + (enabled ? 'is-enabled' : ''),
    c: render$$1 && {
      $s: _xvdomSpec2$3,
      a: bindSend('onSearchInput'),
      c: term,
      d: item$1,
      e: searchResults
    }
  };
};

var onInit$1 = function onInit$1(_ref3) {
  var props = _ref3.props,
      state = _ref3.state;
  return {
    render: state && state.render || props.enabled,
    term: '',
    searchResults: []
  };
};

AppSearch.state = {
  onInit: onInit$1,
  onProps: onInit$1,
  onSearchInput: function onSearchInput(_ref4, event) {
    var state = _ref4.state,
        bindSend = _ref4.bindSend;
    return _extends({}, state, {
      curSearch: (clearTimeout(state.curSearch), setTimeout(bindSend('doSearch'), 300)),
      term: event.target.value
    });
  },
  doSearch: function doSearch(_ref5) {
    var state = _ref5.state,
        bindSend = _ref5.bindSend;
    return Promise.all([GithubRepo.query(state), GithubUser.query(state)]).then(bindSend('onSearchResults')), _extends({}, state, { curSearch: null });
  },
  onSearchResults: function onSearchResults(_ref6, _ref7) {
    var state = _ref6.state;

    var _ref8 = slicedToArray(_ref7, 2),
        repos = _ref8[0],
        users = _ref8[1];

    return _extends({}, state, {
      searchResults: (repos || []).concat(users || []).sort(function (a, b) {
        return b.score - a.score;
      }).slice(0, 5)
    });
  }
};

var loadScript = (function (src, globalProp) {
  return new Promise(function (resolve) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = function () {
      resolve(globalProp && window[globalProp]);
    };
    document.head.appendChild(s);
  });
});

var syntaxPromises = {};

var loadSyntax = function loadSyntax(lang) {
  return syntaxPromises[lang] || (syntaxPromises[lang] = loadScript('../vendor/highlightjs/languages/' + lang + '.min.js'));
};

var loadHighlightJSPromise = void 0;
var loadHighlightJS = function loadHighlightJS() {
  return loadHighlightJSPromise || (loadHighlightJSPromise = loadScript('../vendor/highlightjs/highlight.min.js'));
};

var loadHighlight = (function (lang) {
  return loadHighlightJS().then(function () {
    return loadSyntax(lang);
  }).then(function () {
    return window.hljs;
  });
});

var FNAME_TO_SYNTAX = {
  'Gemfile.lock': 'ruby',
  'Gemfile': 'ruby',
  'Rakefile': 'ruby'
};

var EXT_TO_SYNTAX = {
  babelrc: 'json',
  eslintrc: 'json',
  gemspec: 'ruby',
  html: 'xml',
  js: 'javascript',
  jsx: 'javascript',
  md: 'markdown',
  rb: 'ruby',
  ts: 'typescript',
  yml: 'yaml',
  sh: 'bash'
};

var getSyntaxForFile = (function (fname) {
  var ext = (/\.([^.]*)$/.exec(fname) || [])[1];
  return ext ? EXT_TO_SYNTAX[ext] || ext : FNAME_TO_SYNTAX[fname];
});

var ALL_LANGUAGES = {
  "1c": true,
  "accesslog": true,
  "actionscript": true,
  "apache": true,
  "applescript": true,
  "arduino": true,
  "armasm": true,
  "asciidoc": true,
  "aspectj": true,
  "autohotkey": true,
  "autoit": true,
  "avrasm": true,
  "axapta": true,
  "bash": true,
  "basic": true,
  "brainfuck": true,
  "cal": true,
  "capnproto": true,
  "ceylon": true,
  "clojure-repl": true,
  "clojure": true,
  "cmake": true,
  "coffeescript": true,
  "cos": true,
  "cpp": true,
  "crmsh": true,
  "crystal": true,
  "cs": true,
  "csp": true,
  "css": true,
  "d": true,
  "dart": true,
  "delphi": true,
  "diff": true,
  "django": true,
  "dns": true,
  "dockerfile": true,
  "dos": true,
  "dts": true,
  "dust": true,
  "elixir": true,
  "elm": true,
  "erb": true,
  "erlang-repl": true,
  "erlang": true,
  "fix": true,
  "fortran": true,
  "fsharp": true,
  "gams": true,
  "gauss": true,
  "gcode": true,
  "gherkin": true,
  "glsl": true,
  "go": true,
  "golo": true,
  "gradle": true,
  "groovy": true,
  "haml": true,
  "handlebars": true,
  "haskell": true,
  "haxe": true,
  "hsp": true,
  "htmlbars": true,
  "http": true,
  "inform7": true,
  "ini": true,
  "irpf90": true,
  "java": true,
  "javascript": true,
  "json": true,
  "julia": true,
  "kotlin": true,
  "lasso": true,
  "less": true,
  "lisp": true,
  "livecodeserver": true,
  "livescript": true,
  "lua": true,
  "makefile": true,
  "markdown": true,
  "mathematica": true,
  "matlab": true,
  "maxima": true,
  "mel": true,
  "mercury": true,
  "mipsasm": true,
  "mizar": true,
  "mojolicious": true,
  "monkey": true,
  "nginx": true,
  "nimrod": true,
  "nix": true,
  "nsis": true,
  "objectivec": true,
  "ocaml": true,
  "openscad": true,
  "oxygene": true,
  "parser3": true,
  "perl": true,
  "pf": true,
  "php": true,
  "powershell": true,
  "processing": true,
  "profile": true,
  "prolog": true,
  "protobuf": true,
  "puppet": true,
  "python": true,
  "q": true,
  "qml": true,
  "r": true,
  "rib": true,
  "roboconf": true,
  "rsl": true,
  "ruby": true,
  "ruleslanguage": true,
  "rust": true,
  "scala": true,
  "scheme": true,
  "scilab": true,
  "scss": true,
  "smali": true,
  "smalltalk": true,
  "sml": true,
  "sqf": true,
  "sql": true,
  "stan": true,
  "stata": true,
  "step21": true,
  "stylus": true,
  "swift": true,
  "tcl": true,
  "tex": true,
  "thrift": true,
  "tp": true,
  "twig": true,
  "typescript": true,
  "vala": true,
  "vbnet": true,
  "vbscript-html": true,
  "vbscript": true,
  "verilog": true,
  "vhdl": true,
  "vim": true,
  "x86asm": true,
  "xl": true,
  "xml": true,
  "xquery": true,
  "yaml": true,
  "zephir": true
};

var getSyntaxForLanguage = function getSyntaxForLanguage(lang) {
  var syntax = EXT_TO_SYNTAX[lang] || lang;
  return ALL_LANGUAGES[syntax] && syntax;
};

var renderer = new window.marked.Renderer();
renderer.link = function (href, title, text) {
  return '<a href="' + href + '" title="' + title + '" target="_blank">' + text + '</a>';
};

window.marked.setOptions({
  renderer: renderer,
  highlight: function highlight(code, lang, callback) {
    var syntax = getSyntaxForLanguage(lang);
    if (!syntax) return callback(null, code);

    loadHighlight(syntax).then(function (hljs) {
      callback(null, hljs.highlight(syntax, code).value);
    });
  }
});

var marked = (function (content, cb) {
  var result = null;
  if (content) {
    window.marked(content, function (err, r) {
      if (result === null) {
        result = r;
      } else {
        cb(r);
      }
    });
  }
  result = result || '';
  return result;
});

var _xvdomEl$9 = xvdom.el;
var _xvdomSpec$10 = {
  c: function c(inst) {
    var _n = _xvdomEl$9('div');

    inst.b = _n;
    _n.className = inst.a;
    _n.innerHTML = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.innerHTML = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Markup = function Markup(_ref) {
  var className = _ref.props.className,
      state = _ref.state;
  return {
    $s: _xvdomSpec$10,
    a: 'Markup ' + className,
    c: state
  };
};

var onInit$2 = function onInit$2(_ref2) {
  var content = _ref2.props.content,
      bindSend = _ref2.bindSend;
  return content ? marked(content, bindSend('loadMarkup')) : '';
};

Markup.state = {
  onInit: onInit$2,
  onProps: onInit$2,
  loadMarkup: function loadMarkup(component, contentHTML) {
    return contentHTML;
  }
};

var MIN_MS = 1000 * 60;
var HOUR_MS = MIN_MS * 60;
var DAY_MS = HOUR_MS * 24;
var WEEK_MS = DAY_MS * 7;

var timeAgoNow = Date.now();
// Update every 5 min
setInterval(function () {
  return timeAgoNow = Date.now();
}, MIN_MS * 5);

var timeAgo = (function (dateTime) {
  var diffms = timeAgoNow - dateTime;
  return diffms > WEEK_MS ? ~~(diffms / WEEK_MS) + ' weeks' : diffms > DAY_MS ? ~~(diffms / DAY_MS) + ' days' : diffms > HOUR_MS ? ~~(diffms / HOUR_MS) + ' hours' : diffms > MIN_MS ? ~~(diffms / MIN_MS) + ' minutes' : '1 minute';
});

var _xvdomCreateComponent$7 = xvdom.createComponent;
var _xvdomCreateDynamic$7 = xvdom.createDynamic;
var _xvdomEl$10 = xvdom.el;
var _xvdomUpdateComponent$7 = xvdom.updateComponent;
var _xvdomUpdateDynamic$7 = xvdom.updateDynamic;
var _xvdomSpec$11 = {
  c: function c(inst) {
    var _n = _xvdomEl$10('a'),
        _n2,
        _n3;

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    _n2 = (inst.e = _xvdomCreateComponent$7(Avatar, Avatar.state, {
      avatarUrl: inst.d
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = _xvdomEl$10('div');
    _n2.className = 'l-margin-l2 c-gray-dark';
    _n3 = _xvdomEl$10('span');
    _n3.className = 'c-black l-padding-r1';
    inst.g = _n3;
    _n3.textContent = inst.f;

    _n2.appendChild(_n3);

    inst.i = _xvdomCreateDynamic$7(false, _n2, inst.h);
    _n3 = _xvdomEl$10('div');
    _n3.className = 't-font-size-10';
    inst.k = _n3;
    _n3.textContent = inst.j;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$7(Avatar, Avatar.state, {
        avatarUrl: pInst.d = inst.d
      }, pInst.e);
    }

    v = inst.f;

    if (v !== pInst.f) {
      pInst.g.textContent = v;
      pInst.f = v;
    }

    if (inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateDynamic$7(false, pInst.h, pInst.h = inst.h, pInst.i);
    }

    v = inst.j;

    if (v !== pInst.j) {
      pInst.k.textContent = v;
      pInst.j = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Actor = (function (_ref) {
  var _ref$user = _ref.user,
      login = _ref$user.login,
      avatar_url = _ref$user.avatar_url,
      action = _ref.action,
      actionDate = _ref.actionDate,
      className = _ref.className;
  return {
    $s: _xvdomSpec$11,
    a: className + ' layout horizontal center',
    c: '#github/' + login,
    d: avatar_url,
    f: login,
    h: action || '',
    j: timeAgo(Date.parse(actionDate)) + ' ago'
  };
});

var _xvdomCreateComponent$6 = xvdom.createComponent;
var _xvdomCreateDynamic$6 = xvdom.createDynamic;
var _xvdomEl$8 = xvdom.el;
var _xvdomUpdateComponent$6 = xvdom.updateComponent;
var _xvdomUpdateDynamic$6 = xvdom.updateDynamic;
var _xvdomSpec4$3 = {
  c: function c(inst) {
    var _n = _xvdomEl$8('div'),
        _n2;

    _n.className = 'Card EventCard';
    _n2 = (inst.b = _xvdomCreateComponent$6(SourceName, SourceName.state, {
      className: 'Card-title',
      displayName: inst.a
    }, inst)).$n;

    _n.appendChild(_n2);

    inst.d = _xvdomCreateDynamic$6(false, _n, inst.c);
    _n2 = (inst.h = _xvdomCreateComponent$6(Actor, Actor.state, {
      action: inst.e,
      actionDate: inst.f,
      className: 'Card-content',
      user: inst.g
    }, inst)).$n;

    _n.appendChild(_n2);

    inst.j = _xvdomCreateDynamic$6(false, _n, inst.i);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$6(SourceName, SourceName.state, {
        className: 'Card-title',
        displayName: pInst.a = inst.a
      }, pInst.b);
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$6(false, pInst.c, pInst.c = inst.c, pInst.d);
    }

    if (inst.f !== pInst.f || inst.e !== pInst.e || inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateComponent$6(Actor, Actor.state, {
        action: pInst.e = inst.e,
        actionDate: pInst.f = inst.f,
        className: 'Card-content',
        user: pInst.g = inst.g
      }, pInst.h);
    }

    if (inst.i !== pInst.i) {
      pInst.j = _xvdomUpdateDynamic$6(false, pInst.i, pInst.i = inst.i, pInst.j);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$5 = {
  c: function c(inst) {
    var _n = _xvdomEl$8('a'),
        _n2;

    _n.className = 'Card-content layout horizontal center';
    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = (inst.d = _xvdomCreateComponent$6(Icon, Icon.state, {
      className: 'l-padding-r2',
      name: inst.c
    }, inst)).$n;

    _n.appendChild(_n2);

    inst.f = _xvdomCreateDynamic$6(false, _n, inst.e);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$6(Icon, Icon.state, {
        className: 'l-padding-r2',
        name: pInst.c = inst.c
      }, pInst.d);
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$6(false, pInst.e, pInst.e = inst.e, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$6 = {
  c: function c(inst) {
    var _n = _xvdomEl$8('a'),
        _n2;

    _n.className = 'Card-content';
    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$6(Icon, Icon.state, {
      className: 'l-padding-r2 icon-24',
      name: 'git-commit'
    }, inst).$n;

    _n.appendChild(_n2);

    inst.e = _xvdomCreateDynamic$6(false, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$6(false, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$9 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$6(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$6(Markup, Markup.state, {
        className: 'Card-content',
        content: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var issuePRIcon = function issuePRIcon(_ref) {
  var pull_request = _ref.pull_request;
  return '' + (pull_request ? 'git-pull-request' : 'issue-opened');
};

var issuePRSubject = function issuePRSubject(_ref2) {
  var pull_request = _ref2.pull_request,
      issue = _ref2.issue;
  return (pull_request || issue).title;
};

var issuePRSubjectUrl = function issuePRSubjectUrl(_ref3) {
  var name = _ref3.repo.name,
      _ref3$payload = _ref3.payload,
      number = _ref3$payload.number,
      issue = _ref3$payload.issue,
      pull_request = _ref3$payload.pull_request;
  return issue ? '#github/' + name + '?issues/' + (number || issue.number) : '#github/' + name + '?pulls/' + (number || pull_request.number);
};

var getSummary = function getSummary(event) {
  var payload = event.payload;

  switch (event.type) {
    case 'IssuesEvent':
    case 'PullRequestEvent':
      return {
        actorsAction: payload.action + ' this issue.',
        subjectIcon: issuePRIcon(payload),
        subject: issuePRSubject(payload),
        subjectUrl: issuePRSubjectUrl(event)
      };

    case 'ReleaseEvent':
      return {
        actorsAction: 'published this release.',
        subjectIcon: 'versions',
        subject: payload.release.name || payload.release.tag_name
      };

    case 'CreateEvent':
    case 'DeleteEvent':
      return {
        actorsAction: (event.type === 'CreateEvent' ? 'created' : 'deleted') + ' this ' + payload.ref_type + '.',
        subjectIcon: 'git-branch',
        subject: payload.ref_type === 'branch' ? payload.ref : event.repo.name
      };

    case 'IssueCommentEvent':
    case 'PullRequestReviewCommentEvent':
      return {
        actorsAction: 'commented…',
        subjectIcon: issuePRIcon(payload),
        subject: issuePRSubject(payload),
        subjectUrl: issuePRSubjectUrl(event)
      };

    case 'CommitCommentEvent':
      return {
        actorsAction: 'commented…',
        subjectIcon: 'git-commit',
        subject: payload.comment.commit_id,
        subjectUrl: '#github/' + event.repo.name + '?commits/' + payload.comment.commit_id
      };

    case 'PushEvent':
      return {
        actorsAction: 'pushed ' + payload.commits.length + ' commits\u2026',
        subjectIcon: 'git-branch',
        subject: payload.ref.replace(/.*\//, '')
      };

    case 'TeamAddEvent':
      return {
        actorsAction: 'added the ' + payload.team.name + ' team.',
        subjectIcon: 'git-branch'
      };

    case 'ForkEvent':
      return { actorsAction: 'forked this repository.' };

    default:
      return {};
  }
};

var renderEventAction = function renderEventAction(event) {
  switch (event.type) {
    case 'IssueCommentEvent':
    case 'PullRequestReviewCommentEvent':
    case 'CommitCommentEvent':
      return {
        $s: _xvdomSpec$9,
        a: event.payload.comment.body
      };

    case 'PushEvent':
      return event.payload.commits.map(function (_ref4) {
        var sha = _ref4.sha,
            message = _ref4.message;
        return {
          $s: _xvdomSpec2$6,
          a: '#github/' + event.repo.name + '?commits/' + sha,
          d: message,
          key: sha
        };
      });
  }
};

var EventCard = (function (_ref5) {
  var event = _ref5.event;

  var _getSummary = getSummary(event),
      actorsAction = _getSummary.actorsAction,
      subject = _getSummary.subject,
      subjectIcon = _getSummary.subjectIcon,
      subjectUrl = _getSummary.subjectUrl;

  return {
    $s: _xvdomSpec4$3,
    a: event.repo.name,
    c: subject && {
      $s: _xvdomSpec3$5,
      a: subjectUrl,
      c: subjectIcon,
      e: subject
    },
    e: actorsAction,
    f: event.created_at,
    g: event.actor,
    i: renderEventAction(event)
  };
});

var _xvdomCreateDynamic$8 = xvdom.createDynamic;
var _xvdomEl$11 = xvdom.el;
var _xvdomUpdateDynamic$8 = xvdom.updateDynamic;
var _xvdomSpec$12 = {
  c: function c(inst) {
    var _n = _xvdomEl$11('div');

    inst.b = _xvdomCreateDynamic$8(true, _n, inst.a);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$8(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var ChunkedArrayRender = function ChunkedArrayRender(_ref) {
  var render$$1 = _ref.props.render,
      state = _ref.state;
  return {
    $s: _xvdomSpec$12,
    a: state.map(render$$1)
  };
};

var renderSome = function renderSome(array, bindSend) {
  return window.setTimeout(bindSend('renderAll'), 100), array.slice(0, 3);
};

ChunkedArrayRender.state = {
  onInit: function onInit(_ref2) {
    var array = _ref2.props.array,
        bindSend = _ref2.bindSend;
    return renderSome(array, bindSend);
  },

  onProps: function onProps(_ref3, _ref4) {
    var _ref3$props = _ref3.props,
        array = _ref3$props.array,
        arrayKey = _ref3$props.arrayKey,
        render$$1 = _ref3$props.render,
        bindSend = _ref3.bindSend;
    var prevArrayKey = _ref4.arrayKey;
    return arrayKey === prevArrayKey ? array : renderSome(array, bindSend);
  },

  renderAll: function renderAll(_ref5) {
    var array = _ref5.props.array;
    return array;
  }
};

var GithubEvent = model({
  query: function query(_ref) {
    var type = _ref.type,
        id = _ref.id;
    return {
      cache: 'ticker:GithubEvent:' + type + '/' + id,
      url: 'https://api.github.com/' + type + '/' + id + '/events'
    };
  }
});

var modelStateComponent = (function (modelOrGetter, type, Component) {
  var onInit = function onInit(_ref) {
    var props = _ref.props,
        bindSend = _ref.bindSend;

    var Model = typeof modelOrGetter === 'function' ? modelOrGetter(props) : modelOrGetter;
    Model[type](props).then(bindSend('onLoadModel'));
    return Model[type === 'get' ? 'localGet' : 'localQuery'](props);
  };
  Component.state = {
    onInit: onInit,
    onProps: onInit,
    onLoadModel: function onLoadModel(component, model) {
      return model;
    }
  };
  return Component;
});

var _xvdomCreateComponent$5 = xvdom.createComponent;
var _xvdomUpdateComponent$5 = xvdom.updateComponent;
var _xvdomSpec2$5 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$5(ChunkedArrayRender, ChunkedArrayRender.state, {
      array: inst.a,
      arrayKey: inst.b,
      render: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$5(ChunkedArrayRender, ChunkedArrayRender.state, {
        array: pInst.a = inst.a,
        arrayKey: pInst.b = inst.b,
        render: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$8 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$5(EventCard, EventCard.state, {
      event: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$5(EventCard, EventCard.state, {
        event: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: new xvdom.Pool()
};
var filterEvents = function filterEvents(_ref) {
  var t = _ref.type;
  return t !== 'WatchEvent' && t !== 'GollumEvent';
};

var renderEvent = function renderEvent(event) {
  return {
    $s: _xvdomSpec$8,
    a: event,
    key: event.id
  };
};

var EventsView = modelStateComponent(GithubEvent, 'query', function (_ref2) {
  var id = _ref2.props.id,
      state = _ref2.state;
  return {
    $s: _xvdomSpec2$5,
    a: (state || []).filter(filterEvents),
    b: id,
    c: renderEvent
  };
});

var _xvdomCreateComponent$8 = xvdom.createComponent;
var _xvdomUpdateComponent$8 = xvdom.updateComponent;
var _xvdomSpec$13 = {
  c: function c(inst) {
    var _n = (inst.e = _xvdomCreateComponent$8(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c,
      transform: inst.d
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$8(List, List.state, {
        className: 'Card',
        context: pInst.a = inst.a,
        item: pInst.b = inst.b,
        list: pInst.c = inst.c,
        transform: pInst.d = inst.d
      }, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var compareRepos = function compareRepos(a, b) {
  return compare(a.name, b.name);
};
var sortRepos = function sortRepos(repos) {
  return repos.sort(compareRepos);
};
var item$2 = function item$2(_ref, id) {
  var name = _ref.name,
      description = _ref.description;
  return {
    href: '#github/' + id + '/' + name,
    icon: 'repo',
    key: name,
    text: name,
    secondaryText: description
  };
};

var UserReposView = modelStateComponent(GithubRepo, 'query', function (_ref2) {
  var id = _ref2.props.id,
      state = _ref2.state;
  return {
    $s: _xvdomSpec$13,
    a: id,
    b: item$2,
    c: state,
    d: sortRepos
  };
});

var _xvdomCreateDynamic$9 = xvdom.createDynamic;
var _xvdomEl$12 = xvdom.el;
var _xvdomUpdateDynamic$9 = xvdom.updateDynamic;
var _xvdomSpec2$8 = {
  c: function c(inst) {
    var _n = _xvdomEl$12('div');

    _n.className = 'Tabs layout horizontal end center-justified c-white l-height10 t-font-size-14 t-uppercase t-normal';
    inst.b = _xvdomCreateDynamic$9(true, _n, inst.a);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$9(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$15 = {
  c: function c(inst) {
    var _n = _xvdomEl$12('a');

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    inst.e = _xvdomCreateDynamic$9(true, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$9(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
function renderTab(tabId) {
  var tabs = this.tabs,
      selected = this.selected,
      hrefPrefix = this.hrefPrefix;
  var _tabs$tabId = tabs[tabId],
      href = _tabs$tabId.href,
      title = _tabs$tabId.title;

  return {
    $s: _xvdomSpec$15,
    a: 'Tabs-tab u-cursor-pointer l-padding-h4 l-padding-b2 ' + (selected === tabId ? 'is-selected' : ''),
    c: '' + hrefPrefix + (href || tabId),
    d: title || tabId,
    key: tabId
  };
}

var Tabs = (function (props) {
  return {
    $s: _xvdomSpec2$8,
    a: Object.keys(props.tabs).map(renderTab, props)
  };
});

var _xvdomCreateComponent$10 = xvdom.createComponent;
var _xvdomCreateDynamic$10 = xvdom.createDynamic;
var _xvdomEl$13 = xvdom.el;
var _xvdomUpdateComponent$10 = xvdom.updateComponent;
var _xvdomUpdateDynamic$10 = xvdom.updateDynamic;
var _xvdomSpec$16 = {
  c: function c(inst) {
    var _n = _xvdomEl$13('div'),
        _n2,
        _n3,
        _n4;

    inst.b = _n;
    _n.className = inst.a;
    _n2 = _xvdomEl$13('div');
    inst.d = _n2;
    _n2.className = inst.c;
    _n3 = _xvdomEl$13('div');
    _n3.className = 'layout horizontal center-center l-height14';
    inst.f = _xvdomCreateDynamic$10(false, _n3, inst.e);
    _n4 = _xvdomEl$13('div');
    _n4.className = 'l-padding-r0 t-truncate t-font-size-20 flex';
    inst.h = _n4;
    _n4.textContent = inst.g;

    _n3.appendChild(_n4);

    _n4 = (inst.j = _xvdomCreateComponent$10(Icon, Icon.state, {
      className: 't-bold c-white l-padding-h4',
      name: 'search',
      onClick: inst.i,
      size: 'small'
    }, inst)).$n;

    _n3.appendChild(_n4);

    inst.l = _xvdomCreateDynamic$10(false, _n3, inst.k);

    _n2.appendChild(_n3);

    inst.n = _xvdomCreateDynamic$10(false, _n2, inst.m);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.className = v;
      pInst.c = v;
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$10(false, pInst.e, pInst.e = inst.e, pInst.f);
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.h.textContent = v;
      pInst.g = v;
    }

    if (inst.i !== pInst.i) {
      pInst.j = _xvdomUpdateComponent$10(Icon, Icon.state, {
        className: 't-bold c-white l-padding-h4',
        name: 'search',
        onClick: pInst.i = inst.i,
        size: 'small'
      }, pInst.j);
    }

    if (inst.k !== pInst.k) {
      pInst.l = _xvdomUpdateDynamic$10(false, pInst.k, pInst.k = inst.k, pInst.l);
    }

    if (inst.m !== pInst.m) {
      pInst.n = _xvdomUpdateDynamic$10(false, pInst.m, pInst.m = inst.m, pInst.n);
    }
  },
  r: xvdom.DEADPOOL
};
var showSearch = function showSearch() {
  App.showSearch();
};

var AppToolbar = function AppToolbar(_ref) {
  var _ref$props = _ref.props,
      title = _ref$props.title,
      secondary = _ref$props.secondary,
      left = _ref$props.left,
      right = _ref$props.right,
      scrollClass = _ref.state.scrollClass;
  return {
    $s: _xvdomSpec$16,
    a: 'AppToolbar ' + (secondary ? 'AppToolbar--withSecondary' : ''),
    c: 'AppToolbar-bar fixed fixed--top c-white bg-purple ' + scrollClass,
    e: left,
    g: title,
    i: showSearch,
    k: right,
    m: secondary
  };
};

var getScrollState = function getScrollState(prevScrollTop) {
  var scrollTop = document.body ? document.body.scrollTop : 0;
  var isScrollingDown = scrollTop > 56 && scrollTop - prevScrollTop > 0;
  return {
    scrollTop: scrollTop,
    scrollClass: isScrollingDown ? ' is-scrolling-down' : ''
  };
};

AppToolbar.state = {
  onInit: function onInit(_ref2) {
    var bindSend = _ref2.bindSend;
    return requestAnimationFrame(function () {
      return document.body.onscroll = bindSend('onScroll');
    }), getScrollState(0);
  },

  onScroll: function onScroll(_ref3) {
    var scrollTop = _ref3.state.scrollTop;
    return getScrollState(scrollTop);
  }
};

var _xvdomCreateComponent$9 = xvdom.createComponent;
var _xvdomUpdateComponent$9 = xvdom.updateComponent;
var _xvdomSpec4$4 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$9(Tabs, Tabs.state, {
      hrefPrefix: inst.a,
      selected: inst.b,
      tabs: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$9(Tabs, Tabs.state, {
        hrefPrefix: pInst.a = inst.a,
        selected: pInst.b = inst.b,
        tabs: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$6 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$9(Icon, Icon.state, {
      className: inst.a,
      name: 'bookmark',
      onClick: inst.b,
      onClickArg: inst.c,
      size: 'small'
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$9(Icon, Icon.state, {
        className: pInst.a = inst.a,
        name: 'bookmark',
        onClick: pInst.b = inst.b,
        onClickArg: pInst.c = inst.c,
        size: 'small'
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$7 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$9(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'three-bars',
      onClick: inst.a,
      size: 'small'
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$9(Icon, Icon.state, {
        className: 'c-white l-padding-h4',
        name: 'three-bars',
        onClick: pInst.a = inst.a,
        size: 'small'
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$14 = {
  c: function c(inst) {
    var _n = (inst.e = _xvdomCreateComponent$9(AppToolbar, AppToolbar.state, {
      left: inst.a,
      right: inst.b,
      secondary: inst.c,
      title: inst.d
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$9(AppToolbar, AppToolbar.state, {
        left: pInst.a = inst.a,
        right: pInst.b = inst.b,
        secondary: pInst.c = inst.c,
        title: pInst.d = inst.d
      }, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var showDrawer = function showDrawer() {
  App.showDrawer();
};

var RepoUserToolbar = (function (_ref) {
  var id = _ref.id,
      tab = _ref.tab,
      TABS = _ref.TABS,
      isBookmarked = _ref.isBookmarked,
      onBookmark = _ref.onBookmark;
  return {
    $s: _xvdomSpec$14,
    a: {
      $s: _xvdomSpec2$7,
      a: showDrawer
    },
    b: {
      $s: _xvdomSpec3$6,
      a: 'c-white l-padding-l2 l-padding-r4 ' + (isBookmarked ? '' : 'c-opacity-50'),
      b: onBookmark,
      c: id
    },
    c: {
      $s: _xvdomSpec4$4,
      a: '#github/' + id + '?',
      b: tab,
      c: TABS
    },
    d: id
  };
});

var fb = function fb(id) {
  return new Firebase('https://ticker-dev.firebaseio.com/users/' + id);
};
var store = function store(user) {
  return storage.setItemObj('ticker:User:' + user.id, user);
};

var User = {
  localGet: function localGet(id) {
    return storage.getItemObj('ticker:User:' + id);
  },
  save: function save(user) {
    return new Promise(function (resolve, reject) {
      fb(user.id).set(user, function (err) {
        if (err) return reject(err);
        resolve(store(_extends({}, user)));
      });
    });
  },
  get: function get(id) {
    return new Promise(function (resolve, reject) {
      fb(id).once('value', function (data) {
        var val = data.val();
        if (!val) return reject("Couldn't find User");
        resolve(store(val));
      });
    });
  }
};

var FIREBASEURL = 'https://ticker-dev.firebaseio.com';
var LAST_LOGIN_ID_STORAGE_KEY = 'ticker:lastLoggedInUserId';
var currentUser = null;

var loadFirebase = function loadFirebase() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      loadScript('../vendor/firebase/firebase.js').then(resolve);
    }, 500);
  });
};

var authWithFirebase = function authWithFirebase() {
  return new Promise(function (resolve, reject) {
    new Firebase(FIREBASEURL).onAuth(function (authData) {
      if (authData && authData.github) resolve(authData);else reject('Firebase auth failed');
    });
  });
};

var getOrCreateUser = function getOrCreateUser(_ref) {
  var _ref$github = _ref.github,
      id = _ref$github.id,
      username = _ref$github.username,
      accessToken = _ref$github.accessToken;
  return (
    // Give load access tokens to use for any third-party API requests.
    // For right now, just Github.
    // TODO(pwong): Split out access tokens into a seperate module?
    loadJSON.setAccessToken(accessToken),

    // Get or create user information
    User.get(id)
    // Couldn't find existing user w/authId, so create a new User
    .catch(function () {
      return User.save({ id: id, username: username, sources: [] });
    }).then(function (user) {
      return storage.setItem(LAST_LOGIN_ID_STORAGE_KEY, id), currentUser = user;
    })
  );
};

var authWithOAuthPopup = function authWithOAuthPopup() {
  return new Promise(function (resolve, reject) {
    new Firebase(FIREBASEURL).authWithOAuthPopup('github', function (error, github) {
      if (error) reject();else resolve(github);
    });
  }).then(getOrCreateUser);
};

var getPreviousUser = function getPreviousUser() {
  var lastUserId = storage.getItem(LAST_LOGIN_ID_STORAGE_KEY);
  if (lastUserId) return User.localGet(lastUserId);
};

var userListener = function userListener() {};
var toggleSource = function toggleSource(type, id) {
  if (!currentUser) return;
  var _currentUser = currentUser,
      _currentUser$sources = _currentUser.sources,
      github = _currentUser$sources.github,
      l = _currentUser$sources.github[type];

  var index = l.map(function (s) {
    return s.id;
  }).indexOf(id);
  github[type] = index > -1 ? (l.splice(index, 1), [].concat(toConsumableArray(l))) : l.concat({ id: id });

  User.save(currentUser).then(function (user) {
    currentUser = user;
    userListener(currentUser);
  });
};

var toggleUserSource = function toggleUserSource(id) {
  return toggleSource('users', id);
};
var toggleRepoSource = function toggleRepoSource(id) {
  return toggleSource('repos', id);
};

var getCurrentUser = function getCurrentUser(cb) {
  if (currentUser) return currentUser;

  loadFirebase().then(authWithFirebase).then(getOrCreateUser).catch(function () {}).then(userListener = cb || userListener);

  return getPreviousUser();
};

var _xvdomCreateComponent$4 = xvdom.createComponent;
var _xvdomCreateDynamic$5 = xvdom.createDynamic;
var _xvdomEl$7 = xvdom.el;
var _xvdomUpdateComponent$4 = xvdom.updateComponent;
var _xvdomUpdateDynamic$5 = xvdom.updateDynamic;
var _xvdomSpec3$4 = {
  c: function c(inst) {
    var _n = _xvdomEl$7('div'),
        _n2;

    _n.className = 'l-padding-b2';
    _n2 = (inst.f = _xvdomCreateComponent$4(RepoUserToolbar, RepoUserToolbar.state, {
      TABS: inst.a,
      id: inst.b,
      isBookmarked: inst.c,
      onBookmark: inst.d,
      tab: inst.e
    }, inst)).$n;

    _n.appendChild(_n2);

    inst.h = _xvdomCreateDynamic$5(false, _n, inst.g);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.d !== pInst.d || inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateComponent$4(RepoUserToolbar, RepoUserToolbar.state, {
        TABS: pInst.a = inst.a,
        id: pInst.b = inst.b,
        isBookmarked: pInst.c = inst.c,
        onBookmark: pInst.d = inst.d,
        tab: pInst.e = inst.e
      }, pInst.f);
    }

    if (inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateDynamic$5(false, pInst.g, pInst.g = inst.g, pInst.h);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$4 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$4(UserReposView, UserReposView.state, {
      id: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$4(UserReposView, UserReposView.state, {
        id: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$7 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$4(EventsView, EventsView.state, {
      id: inst.a,
      type: 'users'
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$4(EventsView, EventsView.state, {
        id: pInst.a = inst.a,
        type: 'users'
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var TABS = {
  news: {
    title: 'News',
    view: function view(id) {
      return {
        $s: _xvdomSpec$7,
        a: id
      };
    }
  },
  repos: {
    title: 'Repos',
    view: function view(id) {
      return {
        $s: _xvdomSpec2$4,
        a: id
      };
    }
  }
};

var isBookmarked = function isBookmarked(user, id) {
  return user && user.sources.github.users.find(function (s) {
    return s.id === id;
  });
};

var UserView = (function (_ref) {
  var id = _ref.id,
      user = _ref.user,
      _ref$viewUrl = _ref.viewUrl,
      viewUrl = _ref$viewUrl === undefined ? 'news' : _ref$viewUrl;
  return {
    $s: _xvdomSpec3$4,
    a: TABS,
    b: id,
    c: isBookmarked(user, id),
    d: toggleUserSource,
    e: viewUrl,
    g: TABS[viewUrl].view(id)
  };
});

var GithubCommit = model({
  get: function get(_ref) {
    var repo = _ref.repo,
        commitId = _ref.commitId;
    return {
      url: 'https://api.github.com/repos/' + repo + '/commits/' + commitId
    };
  }
});

var _xvdomEl$17 = xvdom.el;
var _xvdomSpec$20 = {
  c: function c(inst) {
    var _n = _xvdomEl$17('pre');

    _n.className = 'Code';
    inst.b = _n;
    _n.innerHTML = inst.a;
    _n.textContent = inst.c;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.innerHTML = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.b.textContent = v;
      pInst.c = v;
    }
  },
  r: xvdom.DEADPOOL
};
var Code = function Code(_ref) {
  var code = _ref.props.code,
      state = _ref.state;
  return {
    $s: _xvdomSpec$20,
    a: state,
    c: code || ''
  };
};

Code.state = {
  onInit: function onInit(_ref2) {
    var _ref2$props = _ref2.props,
        code = _ref2$props.code,
        syntax = _ref2$props.syntax,
        bindSend = _ref2.bindSend;

    if (code && syntax) loadHighlight(syntax).then(bindSend('highlight'));
    return '';
  },
  highlight: function highlight(_ref3, hljs) {
    var _ref3$props = _ref3.props,
        syntax = _ref3$props.syntax,
        code = _ref3$props.code;
    return hljs.highlight(syntax, code).value;
  }
};

var _xvdomCreateComponent$13 = xvdom.createComponent;
var _xvdomCreateDynamic$13 = xvdom.createDynamic;
var _xvdomEl$16 = xvdom.el;
var _xvdomUpdateComponent$13 = xvdom.updateComponent;
var _xvdomUpdateDynamic$13 = xvdom.updateDynamic;
var _xvdomSpec2$11 = {
  c: function c(inst) {
    var _n = _xvdomEl$16('div');

    inst.b = _xvdomCreateDynamic$13(true, _n, inst.a);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$13(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$19 = {
  c: function c(inst) {
    var _n = _xvdomEl$16('div'),
        _n2,
        _n3;

    _n.className = 'Card';
    _n2 = _xvdomEl$16('div');
    _n2.className = 'Card-title layout horizontal center t-no-wrap l-padding-r0';
    _n3 = _xvdomEl$16('div');
    _n3.className = 'c-gray-dark t-truncate';
    inst.b = _n3;
    _n3.textContent = inst.a;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$16('div');
    _n3.className = 't-normal l-padding-r1 t-truncate';
    inst.d = _n3;
    _n3.textContent = inst.c;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$16('div');
    _n3.className = 'flex';

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$16('div');
    _n3.className = 'Pill bg-green c-green';
    inst.f = _n3;
    _n3.textContent = inst.e;

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$16('div');
    _n3.className = 'Pill bg-red c-red';
    inst.h = _n3;
    _n3.textContent = inst.g;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = (inst.j = _xvdomCreateComponent$13(Code, Code.state, {
      code: inst.i,
      syntax: 'diff'
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.textContent = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      pInst.d.textContent = v;
      pInst.c = v;
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.f.textContent = v;
      pInst.e = v;
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.h.textContent = v;
      pInst.g = v;
    }

    if (inst.i !== pInst.i) {
      pInst.j = _xvdomUpdateComponent$13(Code, Code.state, {
        code: pInst.i = inst.i,
        syntax: 'diff'
      }, pInst.j);
    }
  },
  r: xvdom.DEADPOOL
};
var PATH_REGEX = /^(.*\/)?([^\/]+)$/;

var renderFile = function renderFile(_ref) {
  var additions = _ref.additions,
      deletions = _ref.deletions,
      filename = _ref.filename,
      patch = _ref.patch;

  var _PATH_REGEX$exec = PATH_REGEX.exec(filename),
      _PATH_REGEX$exec2 = slicedToArray(_PATH_REGEX$exec, 3),
      path = _PATH_REGEX$exec2[1],
      fname = _PATH_REGEX$exec2[2];

  return {
    $s: _xvdomSpec$19,
    a: path,
    c: fname,
    e: '+' + additions,
    g: '\u2013' + deletions,
    i: patch,
    key: filename
  };
};

var DiffFiles = (function (_ref2) {
  var files = _ref2.files;
  return {
    $s: _xvdomSpec2$11,
    a: files.map(renderFile)
  };
});

var _xvdomCreateComponent$12 = xvdom.createComponent;
var _xvdomCreateDynamic$12 = xvdom.createDynamic;
var _xvdomEl$15 = xvdom.el;
var _xvdomUpdateComponent$12 = xvdom.updateComponent;
var _xvdomUpdateDynamic$12 = xvdom.updateDynamic;
var _xvdomSpec3$8 = {
  c: function c(inst) {
    var _n = _xvdomEl$15('a'),
        _n2;

    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$12(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'chevron-left',
      size: 'small'
    }, inst).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$10 = {
  c: function c(inst) {
    var _n = _xvdomEl$15('div'),
        _n2,
        _n3,
        _n4;

    _n2 = (inst.c = _xvdomCreateComponent$12(AppToolbar, AppToolbar.state, {
      left: inst.a,
      title: inst.b
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = _xvdomEl$15('div');
    _n2.className = 'Card Card--fullBleed';
    inst.e = _xvdomCreateDynamic$12(false, _n2, inst.d);
    _n3 = _xvdomEl$15('div');
    _n3.className = 'Card-content horizontal layout';
    _n4 = (inst.h = _xvdomCreateComponent$12(Actor, Actor.state, {
      actionDate: inst.f,
      className: 'flex',
      user: inst.g
    }, inst)).$n;

    _n3.appendChild(_n4);

    _n4 = _xvdomEl$15('div');
    _n4.className = 't-font-size-12 l-margin-h2';
    inst.j = _n4;
    _n4.textContent = inst.i;

    _n3.appendChild(_n4);

    _n4 = _xvdomEl$15('div');
    _n4.className = 'Pill bg-green c-green';
    inst.l = _n4;
    _n4.textContent = inst.k;

    _n3.appendChild(_n4);

    _n4 = _xvdomEl$15('div');
    _n4.className = 'Pill bg-red c-red';
    inst.n = _n4;
    _n4.textContent = inst.m;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$15('pre');
    _n3.className = 'Card-content t-white-space-normal t-word-break-word';
    inst.p = _n3;
    _n3.textContent = inst.o;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    _n2 = (inst.r = _xvdomCreateComponent$12(DiffFiles, DiffFiles.state, {
      files: inst.q
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$12(AppToolbar, AppToolbar.state, {
        left: pInst.a = inst.a,
        title: pInst.b = inst.b
      }, pInst.c);
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$12(false, pInst.d, pInst.d = inst.d, pInst.e);
    }

    if (inst.f !== pInst.f || inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateComponent$12(Actor, Actor.state, {
        actionDate: pInst.f = inst.f,
        className: 'flex',
        user: pInst.g = inst.g
      }, pInst.h);
    }

    v = inst.i;

    if (v !== pInst.i) {
      pInst.j.textContent = v;
      pInst.i = v;
    }

    v = inst.k;

    if (v !== pInst.k) {
      pInst.l.textContent = v;
      pInst.k = v;
    }

    v = inst.m;

    if (v !== pInst.m) {
      pInst.n.textContent = v;
      pInst.m = v;
    }

    v = inst.o;

    if (v !== pInst.o) {
      pInst.p.textContent = v;
      pInst.o = v;
    }

    if (inst.q !== pInst.q) {
      pInst.r = _xvdomUpdateComponent$12(DiffFiles, DiffFiles.state, {
        files: pInst.q = inst.q
      }, pInst.r);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$18 = {
  c: function c(inst) {
    var _n = _xvdomEl$15('h1');

    _n.className = 'Card-title t-word-break-word l-margin-t0 l-margin-b0';
    inst.b = _n;
    _n.textContent = inst.a;
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.textContent = v;
      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var COMMIT_PLACEHOLDER = {
  files: [],
  commit: {
    message: '',
    committer: {
      date: 0
    }
  },
  committer: {
    avatar_url: '',
    login: ''
  },
  stats: {
    additions: 0,
    deletions: 0
  }
};

var getCommitTitleMessage = function getCommitTitleMessage(message) {
  var _$exec = /.*/g.exec(message),
      _$exec2 = slicedToArray(_$exec, 1),
      title = _$exec2[0];

  return title === message ? { title: '', message: message } : { title: title, message: message.substr(title.length) };
};

var CommitView = modelStateComponent(GithubCommit, 'get', function (_ref) {
  var _ref$props = _ref.props,
      repo = _ref$props.repo,
      commitId = _ref$props.commitId,
      state = _ref.state;

  var _ref2 = state || COMMIT_PLACEHOLDER,
      files = _ref2.files,
      commit = _ref2.commit,
      committer = _ref2.committer,
      stats = _ref2.stats;

  var _getCommitTitleMessag = getCommitTitleMessage(commit.message),
      title = _getCommitTitleMessag.title,
      message = _getCommitTitleMessag.message;

  return {
    $s: _xvdomSpec2$10,
    a: {
      $s: _xvdomSpec3$8,
      a: '#github/' + repo
    },
    b: commitId,
    d: title && {
      $s: _xvdomSpec$18,
      a: title
    },
    f: commit.committer.date,
    g: committer || { login: commit.committer.name },
    i: files.length + ' files changed',
    k: '+' + stats.additions,
    m: '\u2013' + stats.deletions,
    o: message,
    q: files
  };
});

var _xvdomCreateDynamic$14 = xvdom.createDynamic;
var _xvdomEl$19 = xvdom.el;
var _xvdomUpdateDynamic$14 = xvdom.updateDynamic;
var _xvdomSpec2$12 = {
  c: function c(inst) {
    var _n = _xvdomEl$19('div'),
        _n2,
        _n3;

    _n.className = 'Card Card--fullBleed';
    _n2 = _xvdomEl$19('div');
    _n2.className = 'Card-content layout horizontal l-padding-v2';
    _n3 = _xvdomEl$19('div');
    _n3.className = 'flex';
    inst.b = _xvdomCreateDynamic$14(true, _n3, inst.a);

    _n2.appendChild(_n3);

    _n3 = _xvdomEl$19('a');
    _n3.className = 'u-link';
    inst.d = _xvdomCreateDynamic$14(true, _n3, inst.c);

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$14(true, pInst.a, pInst.a = inst.a, pInst.b);
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic$14(true, pInst.c, pInst.c = inst.c, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$22 = {
  c: function c(inst) {
    var _n = _xvdomEl$19('a');

    inst.b = _n;
    _n.className = inst.a;
    if (inst.c != null) _n.href = inst.c;
    inst.e = _xvdomCreateDynamic$14(true, _n, inst.d);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    v = inst.c;

    if (v !== pInst.c) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.c = v;
    }

    if (inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateDynamic$14(true, pInst.d, pInst.d = inst.d, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var repoName = function repoName(repo) {
  return repo.split('/')[1];
};
var pathURL = function pathURL(pathArray, i) {
  return pathArray.slice(0, i).map(function (a) {
    return '/' + a;
  }).join('');
};

var PathNavigator = (function (_ref) {
  var pathURLPrefix = _ref.pathURLPrefix,
      pathArray = _ref.pathArray,
      repo = _ref.repo,
      sha = _ref.sha;
  return {
    $s: _xvdomSpec2$12,
    a: [repoName(repo)].concat(toConsumableArray(pathArray)).map(function (component, i) {
      return {
        $s: _xvdomSpec$22,
        a: 'PathNavigator-path ' + (i === pathArray.length ? '' : 'u-link'),
        c: pathURLPrefix + sha + pathURL(pathArray, i),
        d: component,
        key: i
      };
    }),
    c: sha
  };
});

var _xvdomCreateComponent$15 = xvdom.createComponent;
var _xvdomEl$20 = xvdom.el;
var _xvdomUpdateComponent$15 = xvdom.updateComponent;
var _xvdomSpec2$13 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$15(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$15(List, List.state, {
        className: 'Card',
        context: pInst.a = inst.a,
        item: pInst.b = inst.b,
        list: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$23 = {
  c: function c(inst) {
    var _n = _xvdomEl$20('div'),
        _n2;

    _n.className = 'Card l-padding-t4';
    _n2 = (inst.c = _xvdomCreateComponent$15(Code, Code.state, {
      code: inst.a,
      syntax: inst.b
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$15(Code, Code.state, {
        code: pInst.a = inst.a,
        syntax: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var TYPE_TO_ICON = {
  file: 'file-code',
  dir: 'file-directory'
};

var sortFiles = function sortFiles(a, b) {
  return compare(a.type, b.type) || compare(a.name, b.name);
};

var item$3 = function item$3(_ref, context) {
  var name = _ref.name,
      type = _ref.type,
      path = _ref.path;
  return {
    href: '' + context + path,
    icon: TYPE_TO_ICON[type],
    key: name,
    text: name
  };
};

var PathContents = (function (_ref2) {
  var repo = _ref2.repo,
      sha = _ref2.sha,
      contents = _ref2.contents;
  return contents && contents.isFile ? {
    $s: _xvdomSpec$23,
    a: contents.value.content,
    b: getSyntaxForFile(contents.value.name)
  } : {
    $s: _xvdomSpec2$13,
    a: '#github/' + repo + '?code/' + sha + '/',
    b: item$3,
    c: contents && contents.value.sort(sortFiles)
  };
});

var decode = atob;

// Safari/Firefox: atob() cannot handle newlines
try {
  atob('\n');
} catch (e) {
  decode = function decode(content) {
    return atob(content.replace(/\n/g, ''));
  };
}

var atob$1 = decode;

var addTransformedFileProperties = function addTransformedFileProperties(fileContents) {
  return fileContents.parentPath = fileContents.path.replace(/[^\/]+$/, ''), fileContents.content = atob$1(fileContents.content), fileContents;
};

var createGithubFileContent = function createGithubFileContent(contents) {
  return contents.constructor === Array ? { isFile: false, value: contents } : { isFile: true, value: addTransformedFileProperties(contents) };
};

var GithubFileContents = model({
  query: function query(_ref) {
    var repo = _ref.repo,
        _ref$sha = _ref.sha,
        sha = _ref$sha === undefined ? 'master' : _ref$sha,
        _ref$pathArray = _ref.pathArray,
        pathArray = _ref$pathArray === undefined ? [] : _ref$pathArray;
    return {
      url: 'https://api.github.com/repos/' + repo + '/contents/' + pathArray.join('/') + '?ref=' + sha,
      transform: createGithubFileContent
    };
  }
});

var _xvdomCreateComponent$14 = xvdom.createComponent;
var _xvdomEl$18 = xvdom.el;
var _xvdomUpdateComponent$14 = xvdom.updateComponent;
var _xvdomSpec$21 = {
  c: function c(inst) {
    var _n = _xvdomEl$18('div'),
        _n2;

    _n2 = (inst.e = _xvdomCreateComponent$14(PathNavigator, PathNavigator.state, {
      pathArray: inst.a,
      pathURLPrefix: inst.b,
      repo: inst.c,
      sha: inst.d
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = (inst.i = _xvdomCreateComponent$14(PathContents, PathContents.state, {
      contents: inst.f,
      repo: inst.g,
      sha: inst.h
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$14(PathNavigator, PathNavigator.state, {
        pathArray: pInst.a = inst.a,
        pathURLPrefix: pInst.b = inst.b,
        repo: pInst.c = inst.c,
        sha: pInst.d = inst.d
      }, pInst.e);
    }

    if (inst.g !== pInst.g || inst.f !== pInst.f || inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateComponent$14(PathContents, PathContents.state, {
        contents: pInst.f = inst.f,
        repo: pInst.g = inst.g,
        sha: pInst.h = inst.h
      }, pInst.i);
    }
  },
  r: xvdom.DEADPOOL
};
var CodeView = modelStateComponent(GithubFileContents, 'query', function (_ref) {
  var _ref$props = _ref.props,
      repo = _ref$props.repo,
      _ref$props$pathArray = _ref$props.pathArray,
      pathArray = _ref$props$pathArray === undefined ? [] : _ref$props$pathArray,
      _ref$props$sha = _ref$props.sha,
      sha = _ref$props$sha === undefined ? 'master' : _ref$props$sha,
      contents = _ref.state;
  return {
    $s: _xvdomSpec$21,
    a: pathArray,
    b: '#github/' + repo + '?code/',
    c: repo,
    d: sha,
    f: contents,
    g: repo,
    h: sha
  };
});

var GithubIssue = model({
  get: function get(_ref) {
    var repo = _ref.repo,
        id = _ref.id;
    return {
      cache: 'ticker:GithubIssue:' + repo + id,
      url: 'https://api.github.com/repos/' + repo + '/issues/' + id
    };
  },
  query: function query(_ref2) {
    var repo = _ref2.repo;
    return {
      url: 'https://api.github.com/repos/' + repo + '/issues'
    };
  }
});

var GithubPull = model({
  query: function query(_ref) {
    var repo = _ref.repo;
    return {
      url: 'https://api.github.com/repos/' + repo + '/pulls'
    };
  }
});

var _xvdomCreateComponent$16 = xvdom.createComponent;
var _xvdomUpdateComponent$16 = xvdom.updateComponent;
var _xvdomSpec$24 = {
  c: function c(inst) {
    var _n = (inst.e = _xvdomCreateComponent$16(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c,
      transform: inst.d
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$16(List, List.state, {
        className: 'Card',
        context: pInst.a = inst.a,
        item: pInst.b = inst.b,
        list: pInst.c = inst.c,
        transform: pInst.d = inst.d
      }, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var compareCreatedAt = function compareCreatedAt(a, b) {
  return compare(b.created_at, a.created_at);
};
var sortIssues = function sortIssues(issues) {
  return issues.sort(compareCreatedAt);
};
var item$4 = function item$4(_ref, id) {
  var base = _ref.base,
      number = _ref.number,
      title = _ref.title,
      created_at = _ref.created_at,
      user = _ref.user;
  return {
    href: '#github/' + id + '?' + (base ? 'pulls' : 'issues') + '/' + number,
    avatarUrl: user.avatar_url,
    key: number,
    text: title,
    secondaryText: '#' + number + ' opened ' + timeAgo(Date.parse(created_at)) + ' ago by ' + user.login
  };
};

var IssuesPullsView = modelStateComponent(function (_ref2) {
  var modelClass = _ref2.modelClass;
  return modelClass;
}, 'query', function (_ref3) {
  var repo = _ref3.props.repo,
      state = _ref3.state;
  return {
    $s: _xvdomSpec$24,
    a: repo,
    b: item$4,
    c: state,
    d: sortIssues
  };
});

var GithubRepoReadme = model({
  get: function get(_ref) {
    var id = _ref.id;
    return {
      url: 'https://api.github.com/repos/' + id + '/readme',
      transform: function transform(_ref2) {
        var content = _ref2.content;
        return atob$1(content);
      }
    };
  }
});

var _xvdomCreateComponent$17 = xvdom.createComponent;
var _xvdomEl$21 = xvdom.el;
var _xvdomUpdateComponent$17 = xvdom.updateComponent;
var _xvdomSpec$25 = {
  c: function c(inst) {
    var _n = _xvdomEl$21('div'),
        _n2;

    _n.className = 'Card l-margin-t2';
    _n2 = (inst.b = _xvdomCreateComponent$17(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.a
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$17(Markup, Markup.state, {
        className: 'Card-content',
        content: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var ReadmeView = modelStateComponent(GithubRepoReadme, 'get', function (_ref) {
  var state = _ref.state;
  return {
    $s: _xvdomSpec$25,
    a: state
  };
});

var GithubIssueComment = model({
  query: function query(_ref) {
    var repo = _ref.repo,
        issue = _ref.issue;

    return {
      url: 'https://api.github.com/repos/' + repo + '/issues/' + issue.number + '/comments'
    };
  }
});

var _xvdomCreateComponent$19 = xvdom.createComponent;
var _xvdomCreateDynamic$16 = xvdom.createDynamic;
var _xvdomEl$23 = xvdom.el;
var _xvdomUpdateComponent$19 = xvdom.updateComponent;
var _xvdomUpdateDynamic$16 = xvdom.updateDynamic;
var _xvdomSpec2$15 = {
  c: function c(inst) {
    var _n = _xvdomEl$23('div'),
        _n2,
        _n3,
        _n4;

    _n2 = _xvdomEl$23('div');
    _n2.className = 'Card Card--fullBleed';
    _n3 = _xvdomEl$23('div');
    _n3.className = 'Card-title';
    _n4 = _xvdomEl$23('h1');
    _n4.className = 't-word-break-word l-margin-v0';
    inst.b = _n4;
    _n4.textContent = inst.a;

    _n3.appendChild(_n4);

    _n2.appendChild(_n3);

    _n3 = (inst.e = _xvdomCreateComponent$19(Actor, Actor.state, {
      actionDate: inst.c,
      className: 'Card-content',
      user: inst.d
    }, inst)).$n;

    _n2.appendChild(_n3);

    _n3 = (inst.g = _xvdomCreateComponent$19(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.f
    }, inst)).$n;

    _n2.appendChild(_n3);

    _n.appendChild(_n2);

    inst.i = _xvdomCreateDynamic$16(false, _n, inst.h);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.textContent = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$19(Actor, Actor.state, {
        actionDate: pInst.c = inst.c,
        className: 'Card-content',
        user: pInst.d = inst.d
      }, pInst.e);
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateComponent$19(Markup, Markup.state, {
        className: 'Card-content',
        content: pInst.f = inst.f
      }, pInst.g);
    }

    if (inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateDynamic$16(false, pInst.h, pInst.h = inst.h, pInst.i);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$27 = {
  c: function c(inst) {
    var _n = _xvdomEl$23('div'),
        _n2;

    _n.className = 'Card';
    inst.b = _n;
    _n.id = inst.a;
    _n2 = (inst.e = _xvdomCreateComponent$19(Actor, Actor.state, {
      actionDate: inst.c,
      className: 'Card-content',
      user: inst.d
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = (inst.g = _xvdomCreateComponent$19(Markup, Markup.state, {
      className: 'Card-content',
      content: inst.f
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.id = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$19(Actor, Actor.state, {
        actionDate: pInst.c = inst.c,
        className: 'Card-content',
        user: pInst.d = inst.d
      }, pInst.e);
    }

    if (inst.f !== pInst.f) {
      pInst.g = _xvdomUpdateComponent$19(Markup, Markup.state, {
        className: 'Card-content',
        content: pInst.f = inst.f
      }, pInst.g);
    }
  },
  r: xvdom.DEADPOOL
};
var IssuePullInfo = modelStateComponent(GithubIssueComment, 'query', function (_ref) {
  var issue = _ref.props.issue,
      issueComments = _ref.state;
  return {
    $s: _xvdomSpec2$15,
    a: issue.title,
    c: issue.created_at,
    d: issue.user,
    f: issue.body,
    h: issueComments && issueComments.map(function (_ref2) {
      var id = _ref2.id,
          user = _ref2.user,
          body = _ref2.body,
          created_at = _ref2.created_at;
      return {
        $s: _xvdomSpec$27,
        a: id,
        c: created_at,
        d: user,
        f: body,
        key: id
      };
    })
  };
});

var GithubPullCommit = model({
  query: function query(_ref) {
    var repo = _ref.repo,
        id = _ref.id;
    return {
      url: 'https://api.github.com/repos/' + repo + '/pulls/' + id + '/commits'
    };
  }
});

var _xvdomCreateComponent$20 = xvdom.createComponent;
var _xvdomUpdateComponent$20 = xvdom.updateComponent;
var _xvdomSpec$28 = {
  c: function c(inst) {
    var _n = (inst.e = _xvdomCreateComponent$20(List, List.state, {
      className: 'Card',
      context: inst.a,
      item: inst.b,
      list: inst.c,
      transform: inst.d
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.d !== pInst.d) {
      pInst.e = _xvdomUpdateComponent$20(List, List.state, {
        className: 'Card',
        context: pInst.a = inst.a,
        item: pInst.b = inst.b,
        list: pInst.c = inst.c,
        transform: pInst.d = inst.d
      }, pInst.e);
    }
  },
  r: xvdom.DEADPOOL
};
var sortCreatedAt = function sortCreatedAt(a, b) {
  return compare(b.created_at, a.created_at);
};
var sort$1 = function sort$1(commits) {
  return commits.sort(sortCreatedAt);
};

var item$5 = function item$5(_ref, repo) {
  var sha = _ref.sha,
      author = _ref.author,
      _ref$commit = _ref.commit,
      name = _ref$commit.author.name,
      committer = _ref$commit.committer,
      message = _ref$commit.message;
  return {
    href: '#github/' + repo + '?commits/' + sha,
    avatarUrl: author && author.avatar_url,
    icon: 'person',
    key: sha,
    text: message,
    secondaryText: 'committed ' + timeAgo(Date.parse(committer.date)) + ' ago by ' + (author ? author.login : name)
  };
};

var PullCommitsView = modelStateComponent(GithubPullCommit, 'query', function (_ref2) {
  var repo = _ref2.props.repo,
      commits = _ref2.state;
  return {
    $s: _xvdomSpec$28,
    a: repo,
    b: item$5,
    c: commits,
    d: sort$1
  };
});

var GithubPullFile = model({
  query: function query(_ref) {
    var repo = _ref.repo,
        id = _ref.id;

    return {
      url: 'https://api.github.com/repos/' + repo + '/pulls/' + id + '/files'
    };
  }
});

var _xvdomCreateComponent$21 = xvdom.createComponent;
var _xvdomUpdateComponent$21 = xvdom.updateComponent;
var _xvdomSpec$29 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$21(DiffFiles, DiffFiles.state, {
      files: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$21(DiffFiles, DiffFiles.state, {
        files: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var PullDiffView = modelStateComponent(GithubPullFile, 'query', function (_ref) {
  var state = _ref.state;
  return {
    $s: _xvdomSpec$29,
    a: state || []
  };
});

var _xvdomCreateComponent$18 = xvdom.createComponent;
var _xvdomCreateDynamic$15 = xvdom.createDynamic;
var _xvdomEl$22 = xvdom.el;
var _xvdomUpdateComponent$18 = xvdom.updateComponent;
var _xvdomUpdateDynamic$15 = xvdom.updateDynamic;
var _xvdomSpec6$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$22('a'),
        _n2;

    inst.b = _n;
    if (inst.a != null) _n.href = inst.a;
    _n2 = _xvdomCreateComponent$18(Icon, Icon.state, {
      className: 'c-white l-padding-h4',
      name: 'chevron-left',
      size: 'small'
    }, inst).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      if (pInst.b.href !== v) {
        pInst.b.href = v;
      }

      pInst.a = v;
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5$1 = {
  c: function c(inst) {
    var _n = _xvdomEl$22('div'),
        _n2;

    _n2 = (inst.d = _xvdomCreateComponent$18(AppToolbar, AppToolbar.state, {
      left: inst.a,
      secondary: inst.b,
      title: inst.c
    }, inst)).$n;

    _n.appendChild(_n2);

    inst.f = _xvdomCreateDynamic$15(false, _n, inst.e);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$18(AppToolbar, AppToolbar.state, {
        left: pInst.a = inst.a,
        secondary: pInst.b = inst.b,
        title: pInst.c = inst.c
      }, pInst.d);
    }

    if (inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateDynamic$15(false, pInst.e, pInst.e = inst.e, pInst.f);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4$6 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$18(Tabs, Tabs.state, {
      hrefPrefix: inst.a,
      selected: inst.b,
      tabs: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$18(Tabs, Tabs.state, {
        hrefPrefix: pInst.a = inst.a,
        selected: pInst.b = inst.b,
        tabs: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$9 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent$18(PullDiffView, PullDiffView.state, {
      id: inst.a,
      repo: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$18(PullDiffView, PullDiffView.state, {
        id: pInst.a = inst.a,
        repo: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$14 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent$18(PullCommitsView, PullCommitsView.state, {
      id: inst.a,
      repo: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$18(PullCommitsView, PullCommitsView.state, {
        id: pInst.a = inst.a,
        repo: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$26 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent$18(IssuePullInfo, IssuePullInfo.state, {
      issue: inst.a,
      repo: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$18(IssuePullInfo, IssuePullInfo.state, {
        issue: pInst.a = inst.a,
        repo: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var TABS$2 = {
  info: {
    title: 'Info',
    view: function view(repo, id, issue) {
      return {
        $s: _xvdomSpec$26,
        a: issue,
        b: repo
      };
    }
  },
  commits: {
    title: 'Commits',
    view: function view(repo, id) {
      return {
        $s: _xvdomSpec2$14,
        a: id,
        b: repo
      };
    }
  },
  diff: {
    title: 'Diff',
    view: function view(repo, id) {
      return {
        $s: _xvdomSpec3$9,
        a: id,
        b: repo
      };
    }
  }
};

var IssuePullView = modelStateComponent(GithubIssue, 'get', function (_ref) {
  var _ref$props = _ref.props,
      id = _ref$props.id,
      repo = _ref$props.repo,
      _ref$props$tab = _ref$props.tab,
      tab = _ref$props$tab === undefined ? 'info' : _ref$props$tab,
      issue = _ref.state;
  return {
    $s: _xvdomSpec5$1,
    a: {
      $s: _xvdomSpec6$1,
      a: '#github/' + repo
    },
    b: issue && issue.pull_request && {
      $s: _xvdomSpec4$6,
      a: '#github/' + repo + '?pulls/' + id + '/',
      b: tab,
      c: TABS$2
    },
    c: (issue && issue.pull_request ? 'PR' : 'Issue') + ' #' + id + ': ' + (issue ? issue.title : ''),
    e: issue && TABS$2[tab].view(repo, id, issue)
  };
});

var _xvdomCreateComponent$11 = xvdom.createComponent;
var _xvdomCreateDynamic$11 = xvdom.createDynamic;
var _xvdomEl$14 = xvdom.el;
var _xvdomUpdateComponent$11 = xvdom.updateComponent;
var _xvdomUpdateDynamic$11 = xvdom.updateDynamic;
var _xvdomSpec9 = {
  c: function c(inst) {
    var _n = _xvdomEl$14('div');

    inst.b = _xvdomCreateDynamic$11(true, _n, inst.a);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateDynamic$11(true, pInst.a, pInst.a = inst.a, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec8 = {
  c: function c(inst) {
    var _n = _xvdomEl$14('div'),
        _n2;

    _n.className = 'l-padding-b2';
    _n2 = (inst.f = _xvdomCreateComponent$11(RepoUserToolbar, RepoUserToolbar.state, {
      TABS: inst.a,
      id: inst.b,
      isBookmarked: inst.c,
      onBookmark: inst.d,
      tab: inst.e
    }, inst)).$n;

    _n.appendChild(_n2);

    inst.h = _xvdomCreateDynamic$11(false, _n, inst.g);
    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.d !== pInst.d || inst.c !== pInst.c || inst.b !== pInst.b || inst.a !== pInst.a || inst.e !== pInst.e) {
      pInst.f = _xvdomUpdateComponent$11(RepoUserToolbar, RepoUserToolbar.state, {
        TABS: pInst.a = inst.a,
        id: pInst.b = inst.b,
        isBookmarked: pInst.c = inst.c,
        onBookmark: pInst.d = inst.d,
        tab: pInst.e = inst.e
      }, pInst.f);
    }

    if (inst.g !== pInst.g) {
      pInst.h = _xvdomUpdateDynamic$11(false, pInst.g, pInst.g = inst.g, pInst.h);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec7 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent$11(CommitView, CommitView.state, {
      commitId: inst.a,
      repo: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$11(CommitView, CommitView.state, {
        commitId: pInst.a = inst.a,
        repo: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec6 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$11(IssuePullView, IssuePullView.state, {
      id: inst.a,
      repo: inst.b,
      tab: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$11(IssuePullView, IssuePullView.state, {
        id: pInst.a = inst.a,
        repo: pInst.b = inst.b,
        tab: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec5 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent$11(IssuesPullsView, IssuesPullsView.state, {
      modelClass: inst.a,
      repo: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$11(IssuesPullsView, IssuesPullsView.state, {
        modelClass: pInst.a = inst.a,
        repo: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec4$5 = {
  c: function c(inst) {
    var _n = (inst.c = _xvdomCreateComponent$11(IssuesPullsView, IssuesPullsView.state, {
      modelClass: inst.a,
      repo: inst.b
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a || inst.b !== pInst.b) {
      pInst.c = _xvdomUpdateComponent$11(IssuesPullsView, IssuesPullsView.state, {
        modelClass: pInst.a = inst.a,
        repo: pInst.b = inst.b
      }, pInst.c);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec3$7 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent$11(CodeView, CodeView.state, {
      pathArray: inst.a,
      repo: inst.b,
      sha: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent$11(CodeView, CodeView.state, {
        pathArray: pInst.a = inst.a,
        repo: pInst.b = inst.b,
        sha: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2$9 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$11(EventsView, EventsView.state, {
      id: inst.a,
      type: 'repos'
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$11(EventsView, EventsView.state, {
        id: pInst.a = inst.a,
        type: 'repos'
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec$17 = {
  c: function c(inst) {
    var _n = (inst.b = _xvdomCreateComponent$11(ReadmeView, ReadmeView.state, {
      id: inst.a
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.a !== pInst.a) {
      pInst.b = _xvdomUpdateComponent$11(ReadmeView, ReadmeView.state, {
        id: pInst.a = inst.a
      }, pInst.b);
    }
  },
  r: xvdom.DEADPOOL
};
var TABS$1 = {
  readme: {
    title: 'Readme',
    view: function view(id) {
      return {
        $s: _xvdomSpec$17,
        a: id
      };
    }
  },
  news: {
    title: 'News',
    view: function view(id) {
      return {
        $s: _xvdomSpec2$9,
        a: id
      };
    }

  },
  code: {
    title: 'Code',
    view: function view(id, head, tail) {
      return {
        $s: _xvdomSpec3$7,
        a: tail,
        b: id,
        c: head
      };
    }
  },
  pulls: {
    title: 'Pull Requests',
    view: function view(repo) {
      return {
        $s: _xvdomSpec4$5,
        a: GithubPull,
        b: repo
      };
    }
  },
  issues: {
    title: 'Issues',
    view: function view(repo) {
      return {
        $s: _xvdomSpec5,
        a: GithubIssue,
        b: repo
      };
    }
  }
};

var stripURLEnding = function stripURLEnding(url) {
  return url.replace(/\/\s*$/, '');
};

var isBookmarked$1 = function isBookmarked$1(user, id) {
  return user && user.sources.github.repos.find(function (s) {
    return s.id === id;
  });
};

var RepoView = (function (_ref) {
  var id = _ref.id,
      user = _ref.user,
      _ref$viewUrl = _ref.viewUrl,
      viewUrl = _ref$viewUrl === undefined ? 'news' : _ref$viewUrl;

  var _stripURLEnding$split = stripURLEnding(viewUrl).split('/'),
      _stripURLEnding$split2 = toArray(_stripURLEnding$split),
      tab = _stripURLEnding$split2[0],
      head = _stripURLEnding$split2[1],
      tail = _stripURLEnding$split2.slice(2);
  // TODO: Temporary wrapper <div> to workaround xvdom dynamic stateful component
  //       rerendering bug


  return {
    $s: _xvdomSpec9,
    a: (tab === 'issues' || tab === 'pulls') && head ? {
      $s: _xvdomSpec6,
      a: head,
      b: id,
      c: tail[0]
    } : tab === 'commits' && head ? {
      $s: _xvdomSpec7,
      a: head,
      b: id
    } : {
      $s: _xvdomSpec8,
      a: TABS$1,
      b: id,
      c: isBookmarked$1(user, id),
      d: toggleRepoSource,
      e: tab,
      g: TABS$1[tab].view(id, head, tail)
    }
  };
});

var _xvdomCreateComponent = xvdom.createComponent;
var _xvdomCreateDynamic = xvdom.createDynamic;
var _xvdomEl = xvdom.el;
var _xvdomUpdateComponent = xvdom.updateComponent;
var _xvdomUpdateDynamic = xvdom.updateDynamic;
var _xvdomSpec4 = {
  c: function c(inst) {
    var _n = _xvdomCreateComponent(App, App.state, null, inst).$n;

    return _n;
  },
  u: function u() {},
  r: xvdom.DEADPOOL
};
var _xvdomSpec3 = {
  c: function c(inst) {
    var _n = _xvdomEl('body'),
        _n2;

    inst.b = _n;
    _n.className = inst.a;
    inst.d = _xvdomCreateDynamic(false, _n, inst.c);
    _n2 = _xvdomEl('div');
    inst.f = _n2;
    _n2.className = inst.e;
    _n2.onclick = inst.g;

    _n.appendChild(_n2);

    _n2 = (inst.i = _xvdomCreateComponent(AppSearch, AppSearch.state, {
      enabled: inst.h
    }, inst)).$n;

    _n.appendChild(_n2);

    _n2 = (inst.m = _xvdomCreateComponent(AppDrawer, AppDrawer.state, {
      enabled: inst.j,
      onLogin: inst.k,
      user: inst.l
    }, inst)).$n;

    _n.appendChild(_n2);

    return _n;
  },
  u: function u(inst, pInst) {
    var v;
    v = inst.a;

    if (v !== pInst.a) {
      pInst.b.className = v;
      pInst.a = v;
    }

    if (inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateDynamic(false, pInst.c, pInst.c = inst.c, pInst.d);
    }

    v = inst.e;

    if (v !== pInst.e) {
      pInst.f.className = v;
      pInst.e = v;
    }

    v = inst.g;

    if (v !== pInst.g) {
      pInst.f.onclick = v;
      pInst.g = v;
    }

    if (inst.h !== pInst.h) {
      pInst.i = _xvdomUpdateComponent(AppSearch, AppSearch.state, {
        enabled: pInst.h = inst.h
      }, pInst.i);
    }

    if (inst.k !== pInst.k || inst.j !== pInst.j || inst.l !== pInst.l) {
      pInst.m = _xvdomUpdateComponent(AppDrawer, AppDrawer.state, {
        enabled: pInst.j = inst.j,
        onLogin: pInst.k = inst.k,
        user: pInst.l = inst.l
      }, pInst.m);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec2 = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent(RepoView, RepoView.state, {
      id: inst.a,
      user: inst.b,
      viewUrl: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent(RepoView, RepoView.state, {
        id: pInst.a = inst.a,
        user: pInst.b = inst.b,
        viewUrl: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var _xvdomSpec = {
  c: function c(inst) {
    var _n = (inst.d = _xvdomCreateComponent(UserView, UserView.state, {
      id: inst.a,
      user: inst.b,
      viewUrl: inst.c
    }, inst)).$n;

    return _n;
  },
  u: function u(inst, pInst) {
    var v;

    if (inst.b !== pInst.b || inst.a !== pInst.a || inst.c !== pInst.c) {
      pInst.d = _xvdomUpdateComponent(UserView, UserView.state, {
        id: pInst.a = inst.a,
        user: pInst.b = inst.b,
        viewUrl: pInst.c = inst.c
      }, pInst.d);
    }
  },
  r: xvdom.DEADPOOL
};
var APP_CLASS = 'App ' + (window.navigator.standalone ? 'is-apple-standalone' : '');

var App = function App(_ref) {
  var _ref$state = _ref.state,
      user = _ref$state.user,
      hasSearch = _ref$state.hasSearch,
      hasDrawer = _ref$state.hasDrawer,
      view = _ref$state.view,
      viewId = _ref$state.viewId,
      viewUrl = _ref$state.viewUrl,
      bindSend = _ref.bindSend;
  return {
    $s: _xvdomSpec3,
    a: APP_CLASS,
    c: view === 'user' ? {
      $s: _xvdomSpec,
      a: viewId,
      b: user,
      c: viewUrl
    } : {
      $s: _xvdomSpec2,
      a: viewId,
      b: user,
      c: viewUrl
    },
    e: 'App-backdrop fixed ' + (hasSearch || hasDrawer ? 'is-enabled' : ''),
    g: bindSend('disableOverlay'),
    h: hasSearch,
    j: hasDrawer,
    k: bindSend('login'),
    l: user
  };
};

var stateFromHash = function stateFromHash() {
  var _location$hash$split = location.hash.split('?'),
      _location$hash$split2 = slicedToArray(_location$hash$split, 2),
      appUrl = _location$hash$split2[0],
      viewUrl = _location$hash$split2[1];

  var viewId = appUrl.slice(8);
  return {
    hasSearch: false,
    hasDrawer: false,
    view: /\//.test(viewId) ? 'repo' : 'user',
    viewId: viewId,
    viewUrl: viewUrl
  };
};

App.state = {
  onInit: function onInit(_ref2) {
    var bindSend = _ref2.bindSend;

    App.showDrawer = bindSend('enableDrawer');
    App.showSearch = bindSend('enableSearch');
    window.onhashchange = bindSend('onHashChange');
    return _extends({
      user: getCurrentUser(bindSend('onUserChange'))
    }, stateFromHash());
  },

  onHashChange: function onHashChange(_ref3) {
    var state = _ref3.state;

    document.body.scrollTop = 0;
    return _extends({}, state, stateFromHash());
  },

  enableSearch: function enableSearch(_ref4) {
    var state = _ref4.state;
    return _extends({}, state, { hasSearch: true, hasDrawer: false });
  },
  enableDrawer: function enableDrawer(_ref5) {
    var state = _ref5.state;
    return _extends({}, state, { hasSearch: false, hasDrawer: true });
  },
  disableOverlay: function disableOverlay(_ref6) {
    var state = _ref6.state;
    return _extends({}, state, { hasSearch: false, hasDrawer: false });
  },
  onUserChange: function onUserChange(_ref7, user) {
    var state = _ref7.state;
    return _extends({}, state, { user: user });
  },

  login: function login(_ref8) {
    var state = _ref8.state,
        bindSend = _ref8.bindSend;
    return authWithOAuthPopup().then(bindSend('onUserChange')), state;
  }
};

document.body = xvdom.render({
  $s: _xvdomSpec4
});

return App;

}());
