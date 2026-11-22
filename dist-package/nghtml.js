import { html as j } from "lit";
import { keyed as W } from "lit/directives/keyed.js";
import { map as F } from "lit/directives/map.js";
import { when as C } from "lit/directives/when.js";
import { classMap as K } from "lit/directives/class-map.js";
import { styleMap as J } from "lit/directives/style-map.js";
import { AsyncDirective as L } from "lit/async-directive.js";
import { directive as B } from "lit/directive.js";
class g extends SyntaxError {
  constructor(i, t, n = 0) {
    const s = Math.max(0, Math.min(n, t.length)), l = t.slice(0, s), r = l.split(`
`).length, c = s - l.lastIndexOf(`
`);
    super(`${i} (line ${r}, column ${c})`), this.line = r, this.column = c, this.name = "NghtmlSyntaxError";
  }
}
const Q = /\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g;
function X(e, i) {
  v(e, /* @__PURE__ */ new Set(), i), $(e);
}
function v(e, i, t) {
  const n = new Set(i);
  for (const s of e)
    if (s.type === "text")
      for (const l of s.value.matchAll(Q)) {
        const r = l[1].split(".")[0];
        if (!n.has(r))
          throw new g(
            `Unknown template variable "${r}"`,
            t,
            t.indexOf(l[0])
          );
      }
    else if (s.type === "let")
      n.add(s.name);
    else if (s.type === "if") {
      for (const l of s.branches) {
        const r = new Set(n);
        l.alias && r.add(l.alias), v(l.children, r, t);
      }
      v(s.elseChildren, n, t);
    } else if (s.type === "switch") {
      for (const l of s.cases)
        v(l.children, n, t);
      v(s.defaultChildren, n, t);
    } else if (s.type === "defer")
      v(s.children, n, t), v(s.placeholderChildren, n, t), v(s.loadingChildren, n, t), v(s.errorChildren, n, t);
    else {
      const l = new Set(n);
      l.add(s.name);
      for (const r of ["$count", "$index", "$first", "$last", "$even", "$odd"])
        l.add(r);
      for (const r of s.aliases) l.add(r.name);
      v(s.children, l, t), v(s.emptyChildren, n, t);
    }
}
function $(e, i) {
  for (const t of e)
    t.type !== "text" && (t.type === "if" ? (t.branches.forEach((n) => $(n.children)), $(t.elseChildren)) : t.type === "switch" ? (t.cases.forEach((n) => $(n.children)), $(t.defaultChildren)) : t.type === "defer" ? ($(t.children), $(t.placeholderChildren), $(t.loadingChildren), $(t.errorChildren)) : t.type === "for" && ($(t.children), $(t.emptyChildren)));
}
function E(e, i, t) {
  const n = e.match(/^__NGHTML_VALUE_(\d+)__$/);
  if (n) return { type: "value", index: Number(n[1]) };
  if (e === "true" || e === "false")
    return { type: "literal", value: e === "true" };
  if (e === "null") return { type: "literal", value: null };
  if (/^-?(?:\d+|\d*\.\d+)$/.test(e))
    return { type: "literal", value: Number(e) };
  const s = e.match(/^(['"])([\s\S]*)\1$/);
  if (s) return { type: "literal", value: s[2] };
  if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(e))
    return { type: "scope", path: e };
  throw new g(
    "Directive expressions must be supplied as ${values}, paths, or literals",
    i,
    t
  );
}
function N(e, i, t) {
  return e.type === "value" ? t[e.index] : e.type === "literal" ? e.value : q(i, e.path);
}
function q(e, i) {
  const [t, ...n] = i.split(".");
  let s = e.get(t);
  for (const l of n) {
    if (s == null || typeof s != "object" && typeof s != "function") return;
    s = s[l];
  }
  return s;
}
function I(e, i) {
  const t = [];
  let n = 0, s = null, l = !1, r = 0;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (l) {
      l = !1;
      continue;
    }
    if (d === "\\" && s) {
      l = !0;
      continue;
    }
    if (s) {
      d === s && (s = null);
      continue;
    }
    if (d === '"' || d === "'") {
      s = d;
      continue;
    }
    d === "{" ? r++ : d === "}" ? r = Math.max(0, r - 1) : d === i && r === 0 && (t.push(e.slice(n, c)), n = c + 1);
  }
  return t.push(e.slice(n)), t;
}
const Y = "if|for|let|switch|defer";
function ee(e) {
  return x(e, 0, e.length);
}
function x(e, i, t) {
  const n = [];
  let s = i;
  for (; s < t; ) {
    const l = te(e, s, t);
    if (!l) {
      e.slice(s, t) && n.push({ type: "text", value: e.slice(s, t) });
      break;
    }
    if (l.index > s && n.push({ type: "text", value: e.slice(s, l.index) }), l.name === "let") {
      const r = e.slice(l.index, t).match(
        /^@let\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+);/
      );
      if (!r) throw new g("Expected @let name = ${value};", e, l.index);
      n.push({
        type: "let",
        name: r[1],
        value: E(r[2].trim(), e, l.index)
      }), s = l.index + r[0].length;
    } else if (l.name === "if") {
      const r = ie(e, l.index);
      n.push(r.node), s = r.next;
    } else if (l.name === "switch") {
      const r = le(e, l.index);
      n.push(r.node), s = r.next;
    } else if (l.name === "defer") {
      const r = re(e, l.index);
      n.push(r.node), s = r.next;
    } else {
      const r = se(e, l.index);
      n.push(r.node), s = r.next;
    }
  }
  return n;
}
function te(e, i, t) {
  const n = new RegExp(`@(${Y})\\b`, "g");
  n.lastIndex = i;
  let s;
  for (; (s = n.exec(e)) && s.index < t; )
    if (ne(e, s.index))
      return {
        index: s.index,
        name: s[1]
      };
  return null;
}
function ne(e, i) {
  const t = e.slice(0, i);
  let n = null, s = !1;
  for (let f = 0; f < t.length; f++) {
    const o = t[f];
    if (s) {
      s = !1;
      continue;
    }
    if (o === "\\" && n) {
      s = !0;
      continue;
    }
    n ? o === n && (n = null) : (o === '"' || o === "'") && (n = o);
  }
  if (n) return !1;
  const l = t.lastIndexOf("<"), r = t.lastIndexOf(">");
  if (l > r) return !1;
  const c = t.lastIndexOf("<style"), d = t.lastIndexOf("</style>");
  if (c > d) return !1;
  const w = t.lastIndexOf("<script"), _ = t.lastIndexOf("<\/script>");
  return !(w > _);
}
function ie(e, i) {
  const t = e.slice(i).match(/^@if\s*\(([\s\S]*?)\)\s*\{/);
  if (!t) throw new g("Expected @if (test; as alias) { ... }", e, i);
  const n = I(t[1], ";");
  if (n.length > 2) throw new g("Invalid @if header", e, i);
  const s = D(n[1], e, i), l = i + t[0].lastIndexOf("{"), r = k(e, l);
  if (r === -1) throw new g("Unclosed @if block", e, i);
  const c = [{
    condition: E(n[0].trim(), e, i),
    alias: s,
    children: x(e, l + 1, r)
  }];
  let d = r + 1;
  for (; d < e.length; ) {
    const w = e.slice(d).match(/^(\s*)@else\s+if\s*\(([\s\S]*?)\)\s*\{/);
    if (w) {
      const f = d + w[0].lastIndexOf("{"), o = k(e, f);
      if (o === -1) throw new g("Unclosed @else if block", e, d);
      const m = I(w[2], ";");
      c.push({
        condition: E(m[0].trim(), e, d),
        alias: D(m[1], e, d),
        children: x(e, f + 1, o)
      }), d = o + 1;
      continue;
    }
    const _ = e.slice(d).match(/^(\s*)@else\s*\{/);
    if (_) {
      const f = d + _[0].lastIndexOf("{"), o = k(e, f);
      if (o === -1) throw new g("Unclosed @else block", e, d);
      return {
        node: { type: "if", branches: c, elseChildren: x(e, f + 1, o) },
        next: o + 1
      };
    }
    break;
  }
  return { node: { type: "if", branches: c, elseChildren: [] }, next: d };
}
function D(e, i, t) {
  if (e === void 0) return null;
  const n = e.trim().match(/^as\s+([A-Za-z_$][\w$]*)$/);
  if (!n) throw new g("Expected @if (...; as alias)", i, t);
  return n[1];
}
function se(e, i) {
  const t = e.slice(i).match(/^@for\s*\(([\s\S]*?)\)\s*\{/);
  if (!t) throw new g("Expected @for (item of items; track item.id)", e, i);
  const n = I(t[1], ";"), s = n[0].trim().match(/^(?:(?:const|let|var)\s+)?([A-Za-z_$][\w$]*)\s+of\s+(.+)$/);
  if (!s) throw new g("Expected @for (item of items; track item.id)", e, i);
  let l = null;
  const r = [];
  for (const o of n.slice(1)) {
    const m = o.trim(), h = m.match(/^track\s+(.+)$/);
    if (h) {
      if (l) throw new g("Duplicate @for track expression", e, i);
      l = E(h[1].trim(), e, i);
      continue;
    }
    const p = m.match(/^let\s+(.+)$/);
    if (p) {
      for (const a of p[1].split(",")) {
        const u = a.trim().match(/^([A-Za-z_$][\w$]*)\s*=\s*(\$[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)$/);
        if (!u) throw new g("Expected @for (...; let alias = $first)", e, i);
        r.push({ name: u[1], source: u[2] });
      }
      continue;
    }
    throw new g("Expected track expression or let aliases", e, i);
  }
  if (!l) throw new g("Angular @for blocks require a track expression", e, i);
  const c = i + t[0].lastIndexOf("{"), d = k(e, c);
  if (d === -1) throw new g("Unclosed @for block", e, i);
  let w = d + 1, _ = [];
  const f = e.slice(w).match(/^(\s*)@empty\s*\{/);
  if (f) {
    const o = w + f[0].lastIndexOf("{"), m = k(e, o);
    if (m === -1) throw new g("Unclosed @empty block", e, w);
    _ = x(e, o + 1, m), w = m + 1;
  }
  return {
    node: {
      type: "for",
      name: s[1],
      iterable: E(s[2].trim(), e, i),
      track: l,
      aliases: r,
      children: x(e, c + 1, d),
      emptyChildren: _
    },
    next: w
  };
}
function le(e, i) {
  const t = e.slice(i).match(/^@switch\s*\(([\s\S]*?)\)\s*\{/);
  if (!t) throw new g("Expected @switch (value) { ... }", e, i);
  const n = i + t[0].lastIndexOf("{"), s = k(e, n);
  if (s === -1) throw new g("Unclosed @switch block", e, i);
  const l = [];
  let r = [];
  const c = e.slice(n + 1, s), d = /@(?:case|default)\b/g;
  let w = 0, _;
  for (; _ = d.exec(c), !!_; ) {
    const f = _.index;
    if (c.slice(w, f).trim()) throw new g("Unexpected content inside @switch block", e, n + f);
    if (_[0] === "@case") {
      const m = c.slice(f).match(/^@case\s*\(([\s\S]*?)\)\s*\{/);
      if (!m) throw new g("Expected @case (value) { ... }", e, n + f);
      const h = f + m[0].lastIndexOf("{"), p = n + 1 + h, a = k(e, p);
      if (a === -1 || a >= s) throw new g("Unclosed @case block", e, n + f);
      l.push({
        values: I(m[1], ",").map(
          (u) => E(u.trim(), e, n + f)
        ),
        children: x(e, p + 1, a)
      }), w = a - n, d.lastIndex = w;
    } else {
      const m = c.slice(f).match(/^@default\s*\{/);
      if (!m) throw new g("Expected @default { ... }", e, n + f);
      const h = f + m[0].lastIndexOf("{"), p = n + 1 + h, a = k(e, p);
      if (a === -1 || a >= s) throw new g("Unclosed @default block", e, n + f);
      r = x(e, p + 1, a), w = a - n, d.lastIndex = w;
    }
  }
  return {
    node: {
      type: "switch",
      value: E(t[1].trim(), e, i),
      cases: l,
      defaultChildren: r
    },
    next: s + 1
  };
}
function re(e, i) {
  const t = e.slice(i).match(/^@defer(?:\s*\(([^)]*)\))?\s*\{/);
  if (!t) throw new g("Expected @defer { ... }", e, i);
  const n = (t[1] ?? "").trim();
  let s = "idle";
  if (n === "on immediate") s = "immediate";
  else if (n === "on viewport") s = "viewport";
  else if (n && n !== "on idle")
    throw new g("Supported defer triggers are on idle, on immediate, and on viewport", e, i);
  const l = i + t[0].lastIndexOf("{"), r = k(e, l);
  if (r === -1) throw new g("Unclosed @defer block", e, i);
  let c = r + 1, d = [], w = [], _ = [];
  for (; c < e.length; ) {
    const f = e.slice(c).match(/^(\s*)@(placeholder|loading|error)(?:\s*\([^)]*\))?\s*\{/);
    if (!f) break;
    const o = f[2], m = c + f[0].lastIndexOf("{"), h = k(e, m);
    if (h === -1) throw new g(`Unclosed @${o} block`, e, c);
    const p = x(e, m + 1, h);
    o === "placeholder" ? d = p : o === "loading" ? w = p : _ = p, c = h + 1;
  }
  return {
    node: {
      type: "defer",
      trigger: s,
      children: x(e, l + 1, r),
      placeholderChildren: d,
      loadingChildren: w,
      errorChildren: _
    },
    next: c
  };
}
function k(e, i) {
  let t = 1, n = null;
  for (let s = i + 1; s < e.length; s++) {
    if (e.startsWith("{{", s)) {
      const r = e.indexOf("}}", s + 2);
      if (r === -1) return -1;
      s = r + 1;
      continue;
    }
    const l = e[s];
    if (n) {
      l === n && e[s - 1] !== "\\" && (n = null);
      continue;
    }
    if (l === '"' || l === "'") n = l;
    else if (l === "{") t++;
    else if (l === "}" && --t === 0) return s;
  }
  return -1;
}
const S = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakSet(), T = /* @__PURE__ */ new WeakSet();
function R(e) {
  return Array.isArray(e) ? e.flatMap(
    (i) => typeof i == "string" ? i.trim().split(/\s+/).filter(Boolean) : []
  ) : typeof e == "string" ? e.trim().split(/\s+/).filter(Boolean) : [];
}
function H(e) {
  return typeof e == "function" ? e : void 0;
}
class oe extends L {
  constructor() {
    super(...arguments), this.element = null, this.classes = [], this.isStarting = !1;
  }
  _$initialize(i, t, n) {
    super._$initialize(i, t, n), "element" in i && (this.element = i.element);
  }
  render(i, t) {
    const n = R(i);
    if (this.element) {
      const s = this.classes;
      this.classes = n, T.has(this.element) ? this.element.classList.remove(...s) : queueMicrotask(() => this.startEnter(t));
    }
    return this.callback = t, "";
  }
  startEnter(i) {
    if (!this.element || this.isStarting || T.has(this.element)) return;
    T.add(this.element), this.isStarting = !0, this.timeout !== void 0 && window.clearTimeout(this.timeout);
    const t = this.element;
    t.classList.add(...this.classes);
    let n = !1;
    const s = () => {
      n || (n = !0, t.classList.remove(...this.classes), this.isStarting = !1, this.timeout !== void 0 && window.clearTimeout(this.timeout));
    }, l = {
      target: t,
      animationComplete: s
    };
    i == null || i(l), i || ce(t, s), this.timeout = window.setTimeout(s, 4e3);
  }
  disconnected() {
    this.timeout !== void 0 && window.clearTimeout(this.timeout);
  }
  reconnected() {
    this.element && !T.has(this.element) && queueMicrotask(() => this.startEnter(this.callback));
  }
}
class ae extends L {
  constructor() {
    super(...arguments), this.element = null, this.classes = [];
  }
  _$initialize(i, t, n) {
    super._$initialize(i, t, n), "element" in i && (this.element = i.element);
  }
  render(i, t) {
    return this.element && (this.classes = R(i), this.callback = t, S.set(this.element, {
      classes: this.classes,
      callback: t,
      parent: this.element.parentNode ?? this.element
    }), U(this.element)), "";
  }
  disconnected() {
    this.element && S.delete(this.element);
  }
  reconnected() {
    this.element && (S.set(this.element, {
      classes: this.classes,
      callback: this.callback,
      parent: this.element.parentNode ?? this.element
    }), U(this.element));
  }
}
const z = B(oe), O = B(ae);
async function ce(e, i) {
  if (typeof e.getAnimations != "function") {
    const n = () => i();
    e.addEventListener("animationend", n, { once: !0 }), e.addEventListener("transitionend", n, { once: !0 }), window.setTimeout(n, 4e3);
    return;
  }
  const t = e.getAnimations();
  if (t.length === 0) {
    queueMicrotask(i);
    return;
  }
  await Promise.allSettled(t.map((n) => n.finished)), i();
}
function U(e) {
  const i = e.getRootNode();
  if (!(i instanceof Node) || G.has(i)) return;
  const t = new MutationObserver((n) => {
    for (const s of n)
      for (const l of s.removedNodes)
        fe(l, s);
  });
  t.observe(i, { childList: !0, subtree: !0 }), G.set(i, t);
}
function fe(e, i) {
  var l;
  const t = [];
  if (e instanceof Element && (S.has(e) && t.push(e), e.querySelectorAll("*").forEach((r) => {
    S.has(r) && t.push(r);
  })), t.length === 0) return;
  const n = t.find((r) => S.has(r));
  if (!n || Z.has(n)) return;
  Z.add(n), !n.isConnected && ((l = i.nextSibling) != null && l.parentNode) ? i.nextSibling.parentNode.insertBefore(n, i.nextSibling) : n.isConnected || i.target.appendChild(n);
  const s = t.map((r) => S.get(r)).filter((r) => !!r);
  for (const r of t) {
    const c = S.get(r);
    c && r.classList.add(...c.classes);
  }
  de(t, s).finally(() => {
    var r;
    if ((r = i.nextSibling) != null && r.parentNode)
      for (const c of t) c.remove();
    else
      for (const c of t) c.remove();
  });
}
async function de(e, i) {
  const t = i.filter((n) => n.callback);
  t.length > 0 ? await Promise.all(t.map(
    (n) => new Promise((s) => {
      var d;
      const l = e.find(
        (w) => {
          var _;
          return ((_ = S.get(w)) == null ? void 0 : _.callback) === n.callback;
        }
      );
      if (!l) {
        s();
        return;
      }
      let r = !1;
      const c = () => {
        r || (r = !0, s());
      };
      (d = n.callback) == null || d.call(n, {
        target: l,
        animationComplete: c
      }), window.setTimeout(c, 4e3);
    })
  )) : await Promise.all(e.map(
    (n) => he(n)
  ));
}
async function he(e) {
  if (typeof e.getAnimations != "function") {
    await new Promise((t) => {
      const n = () => t();
      e.addEventListener("animationend", n, { once: !0 }), e.addEventListener("transitionend", n, { once: !0 }), window.setTimeout(n, 4e3);
    });
    return;
  }
  const i = e.getAnimations();
  if (i.length === 0) {
    await new Promise((t) => window.setTimeout(t, 0));
    return;
  }
  await Promise.allSettled(i.map((t) => t.finished));
}
function me(e, i, t) {
  const n = /* @__PURE__ */ new Map(), s = [];
  let l = e;
  const r = {}, c = {};
  let d = !1, w = !1;
  l = l.replace(
    /\s*\[animate\.(enter|leave)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (f, o, m, h, p) => {
      const u = M(h ?? p, i, t), b = H(u), A = `__NGHTML_BINDING_${n.size}__`;
      return n.set(
        String(n.size),
        o === "enter" ? z(b ? void 0 : u, b) : O(b ? void 0 : u, b)
      ), s.push({ name: `data-cf-${o}`, marker: A }), "";
    }
  ), l = l.replace(
    /\s*animate\.(enter|leave)\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (f, o, m, h, p) => {
      const a = M(h ?? p, i, t), u = `__NGHTML_BINDING_${n.size}__`;
      return n.set(
        String(n.size),
        o === "enter" ? z(a) : O(a)
      ), s.push({ name: `data-cf-${o}`, marker: u }), "";
    }
  ), l = l.replace(
    /\s*\(animate\.(enter|leave)\)\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (f, o, m, h, p) => {
      const u = H(M(h ?? p, i, t)), b = `__NGHTML_BINDING_${n.size}__`;
      return n.set(
        String(n.size),
        o === "enter" ? z(void 0, u) : O(void 0, u)
      ), s.push({ name: `data-cf-${o}-callback`, marker: b }), "";
    }
  ), l = l.replace(
    /\s*\[(class(?:\.[A-Za-z_$][\w$-]*)?)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (f, o, m, h, p) => {
      d = !0;
      const a = M(h ?? p, i, t);
      return o === "class" ? pe(a, r) : r[o.slice(6)] = !!a, "";
    }
  ), l = l.replace(
    /\s*\[(style(?:\.[A-Za-z_$][\w$.-]*)?)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (f, o, m, h, p) => {
      w = !0;
      const a = M(h ?? p, i, t);
      if (o === "style")
        ue(a, c);
      else {
        const u = o.slice(6).split("."), b = u.length > 1 ? u.pop() : void 0, A = u.join("-");
        c[A] = a == null || a === !1 ? "" : typeof a == "number" && b ? `${a}${b}` : a;
      }
      return "";
    }
  );
  const _ = [];
  l = l.replace(
    /\s*\[attr\.([A-Za-z_:][A-Za-z0-9_.:-]*)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (f, o, m, h, p) => {
      let a = M(h ?? p, i, t);
      a === !0 ? a = "" : (a == null || a === !1) && (a = null);
      const u = `__NGHTML_BINDING_${n.size}__`;
      return n.set(String(n.size), a), _.push({ name: o, marker: u }), "";
    }
  );
  for (const f of _)
    l = l.replace(/>$/, ` ${f.name}=${f.marker}>`);
  for (const f of s)
    l = l.replace(/>$/, ` ${f.name}=${f.marker}>`);
  if (d) {
    const f = `__NGHTML_BINDING_${n.size}__`;
    n.set(String(n.size), K(r)), l = l.replace(/>$/, ` class=${f}>`);
  }
  if (w) {
    const f = `__NGHTML_BINDING_${n.size}__`;
    n.set(String(n.size), J(c)), l = l.replace(/>$/, ` style=${f}>`);
  }
  return { text: l, directives: n };
}
function M(e, i, t) {
  const n = e.match(/^__NGHTML_VALUE_(\d+)__$/);
  return n ? t[Number(n[1])] : (/__NGHTML_VALUE_\d+__/.test(e) && (e = e.replace(
    /__NGHTML_VALUE_(\d+)__/g,
    (s, l) => String(t[Number(l)] ?? "")
  )), e = e.replace(
    /\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g,
    (s, l) => String(q(i, l) ?? "")
  ), e === "true" ? !0 : e === "false" ? !1 : e === "null" ? null : /^-?(?:\d+|\d*\.\d+)$/.test(e) ? Number(e) : e);
}
function pe(e, i) {
  typeof e == "string" ? e.split(/\s+/).filter(Boolean).forEach((t) => {
    i[t] = !0;
  }) : Array.isArray(e) ? e.forEach((t) => {
    typeof t == "string" && (i[t] = !0);
  }) : e && typeof e == "object" && Object.entries(e).forEach(([t, n]) => {
    i[t] = !!n;
  });
}
function ue(e, i) {
  typeof e == "string" ? e.split(";").forEach((t) => {
    const n = t.indexOf(":");
    if (n === -1) return;
    const s = t.slice(0, n).trim(), l = t.slice(n + 1).trim();
    s && (i[s] = l);
  }) : e && typeof e == "object" && Object.assign(i, e);
}
class we extends L {
  constructor() {
    super(...arguments), this.active = !1, this.loaded = !1, this.observationTarget = null, this.startNode = null;
  }
  _$initialize(i, t, n) {
    var s;
    if (super._$initialize(i, t, n), i.type === 2) {
      this.startNode = i.startNode;
      const l = (s = i.startNode) == null ? void 0 : s.parentNode;
      l instanceof Element ? this.observationTarget = l : "firstElementChild" in (l ?? {}) && l.firstElementChild instanceof Element && (this.observationTarget = l.firstElementChild);
    }
  }
  render(i, t, n, s, l) {
    if (this.currentMain = i, this.currentError = s, this.loaded) return i;
    if (this.active = !0, l === "immediate")
      return queueMicrotask(() => {
        this.active && this.activate();
      }), n ?? t;
    if (typeof window > "u")
      return queueMicrotask(() => {
        this.active && this.activate();
      }), n ?? t;
    if (l === "idle") {
      const r = window;
      r.requestIdleCallback ? this.idleHandle = r.requestIdleCallback(() => {
        this.active && this.activate();
      }) : this.timeout = window.setTimeout(() => {
        this.active && this.activate();
      }, 0);
    } else if (l === "viewport") {
      const r = window.IntersectionObserver ?? globalThis.IntersectionObserver;
      r ? (this.observer = new r((c) => {
        c.some((d) => d.isIntersecting) && this.activate();
      }), queueMicrotask(() => {
        this.discoverAndObserveViewport(), this.observationTarget || (this.timeout = window.setTimeout(() => {
          this.discoverAndObserveViewport();
        }, 0));
      })) : this.timeout = window.setTimeout(() => {
        this.active && this.activate();
      }, 0);
    }
    return n ?? t;
  }
  discoverAndObserveViewport() {
    var t, n, s;
    const i = (t = this.startNode) == null ? void 0 : t.nextSibling;
    i instanceof Element && (this.observationTarget = i), !this.observationTarget && ((n = this.startNode) != null && n.parentNode) && "firstElementChild" in this.startNode.parentNode && this.startNode.parentNode.firstElementChild instanceof Element && (this.observationTarget = this.startNode.parentNode.firstElementChild), this.observationTarget && ((s = this.observer) == null || s.observe(this.observationTarget));
  }
  activate() {
    !this.active || this.loaded || (this.loaded = !0, this.cleanupScheduling(), this.setValue(this.currentMain));
  }
  disconnected() {
    this.active = !1, this.cleanupScheduling();
  }
  reconnected() {
    this.active = !0, this.loaded && this.setValue(this.currentMain);
  }
  cleanupScheduling() {
    var i, t;
    if (this.timeout !== void 0 && (window.clearTimeout(this.timeout), this.timeout = void 0), this.idleHandle !== void 0) {
      const n = window;
      (i = n.cancelIdleCallback) == null || i.call(n, this.idleHandle), this.idleHandle = void 0;
    }
    (t = this.observer) == null || t.disconnect(), this.observer = void 0;
  }
  fail() {
    this.loaded = !1, this.cleanupScheduling(), this.setValue(this.currentError);
  }
}
const ge = B(we), _e = /__NGHTML_VALUE_(\d+)__|\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g, V = /* @__PURE__ */ new WeakMap();
function y(e, i, t, n) {
  const s = [""], l = [], r = (o) => {
    l.push(o), s.push("");
  }, c = (o) => {
    const m = /<[A-Za-z][^<>]*>/g;
    let h = 0, p;
    for (; p = m.exec(o); ) {
      d(o.slice(h, p.index));
      const a = me(p[0], i, t);
      d(a.text, a.directives), h = p.index + p[0].length;
    }
    d(o.slice(h));
  }, d = (o, m) => {
    const h = new RegExp(
      `${_e.source}|__NGHTML_BINDING_(\\d+)__`,
      "g"
    );
    let p = 0, a;
    for (; a = h.exec(o); )
      s[s.length - 1] += o.slice(p, a.index), a[1] !== void 0 ? r(t[Number(a[1])]) : a[2] !== void 0 ? r(q(i, a[2])) : a[3] !== void 0 && r(m == null ? void 0 : m.get(a[3])), p = a.index + a[0].length;
    s[s.length - 1] += o.slice(p);
  };
  for (const o of e)
    if (o.type === "text")
      c(o.value);
    else if (o.type === "let")
      i.set(o.name, N(o.value, i, t));
    else if (o.type === "if") {
      let m = !1;
      for (const h of o.branches) {
        if (!h.condition) continue;
        const p = N(h.condition, i, t);
        if (p) {
          const a = new Map(i);
          h.alias && a.set(h.alias, p), r(C(
            !0,
            () => y(h.children, a, t, n)
          )), m = !0;
          break;
        }
      }
      m || r(C(
        !0,
        () => y(o.elseChildren, new Map(i), t, n)
      ));
    } else if (o.type === "switch") {
      const m = N(o.value, i, t), h = o.cases.find(
        (p) => p.values.some(
          (a) => N(a, i, t) === m
        )
      );
      r(C(
        !0,
        () => y(
          (h == null ? void 0 : h.children) ?? o.defaultChildren,
          new Map(i),
          t,
          n
        )
      ));
    } else if (o.type === "defer")
      r(ge(
        y(o.children, new Map(i), t, n),
        y(o.placeholderChildren, new Map(i), t, n),
        y(o.loadingChildren, new Map(i), t, n),
        y(o.errorChildren, new Map(i), t, n),
        o.trigger
      ));
    else {
      const m = N(o.iterable, i, t);
      if (m == null || typeof (m == null ? void 0 : m[Symbol.iterator]) != "function")
        throw new TypeError("@for expects an iterable value");
      const h = [...m];
      if (!h.length) {
        r(C(
          !0,
          () => y(o.emptyChildren, new Map(i), t, n)
        ));
        continue;
      }
      r(F(h, (p, a) => {
        const u = new Map(i);
        u.set(o.name, p), u.set("$count", h.length), u.set("$index", a), u.set("$first", a === 0), u.set("$last", a === h.length - 1), u.set("$even", a % 2 === 0), u.set("$odd", a % 2 === 1);
        for (const A of o.aliases)
          u.set(
            A.name,
            N(E(A.source, n, 0), u, t)
          );
        const b = N(o.track, u, t);
        return W(b, y(o.children, u, t, n));
      }));
    }
  let w = V.get(e);
  w || (w = /* @__PURE__ */ new Map(), V.set(e, w));
  const _ = JSON.stringify(s);
  let f = w.get(_);
  return f || (Object.defineProperty(s, "raw", { value: [...s] }), f = s, w.set(_, f)), j(f, ...l);
}
const P = /* @__PURE__ */ new WeakMap();
function Ne(e, ...i) {
  let t = P.get(e);
  if (!t) {
    const n = e.raw.reduce(
      (l, r, c) => l + r + (c < i.length ? `__NGHTML_VALUE_${c}__` : ""),
      ""
    ), s = ee(n);
    X(s, n), t = { ast: s, source: n }, P.set(e, t);
  }
  return y(t.ast, /* @__PURE__ */ new Map(), i, t.source);
}
export {
  g as NghtmlSyntaxError,
  Ne as nghtml
};
