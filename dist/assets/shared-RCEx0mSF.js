const be=document.querySelector("[data-site-header]");if(be){const s=window.location.pathname.replace(/\/+$/,"").split("/").pop(),e=`https://stackblitz.com/github/kai1992cool/nghtml/tree/main/demos/${encodeURIComponent(s)}/stackblitz`;be.innerHTML=`
    <a class="brand" href="../../" aria-label="NGHTML home">
      <span class="brand-mark">&lt;/&gt;</span>
      <span>nghtml<span class="brand-period">.</span></span>
    </a>
    <nav class="topbar-actions" aria-label="Project links">
      <a class="header-link" href="../../getting-started/">Getting started</a>
      <a class="header-link" href="../">Demos</a>
      <a class="header-button" href="https://www.npmjs.com/package/@kurama-labs/nghtml" target="_blank" rel="noopener noreferrer" aria-label="View NGHTML on npm">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1.5 1.5h21v21h-21v-21Zm3.75 3.75v13.5h6.75v-3.75H9v-6h3v9.75h6.75V5.25H5.25Z"/></svg>
        <span aria-hidden="true">npm</span>
      </a>
      <a class="header-button" href="https://github.com/kai1992cool/nghtml" target="_blank" rel="noopener noreferrer" aria-label="View NGHTML on GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.67 0 8.19c0 3.62 2.29 6.69 5.47 7.77.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.95-.09-.23-.48-.95-.82-1.14-.28-.15-.68-.52-.01-.53.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.04 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.54 7.54 0 0 1 8 3.78c.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.29.82 2.19 0 3.14-1.87 3.83-3.65 4.04.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.03 8.03 0 0 0 16 8.19C16 3.67 12.42 0 8 0Z"/></svg>
        <span>GitHub</span>
      </a>
      <a class="header-button" href="https://github.com/kai1992cool/nghtml/stargazers" target="_blank" rel="noopener noreferrer" aria-label="Star NGHTML on GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="m8 11.3-4.33 2.28.83-4.82L.78 5.57l4.84-.7L8 .66l2.38 4.21 4.84.7-3.72 3.19.83 4.82L8 11.3Z"/></svg>
        <span>Star</span>
      </a>
      <a class="header-button issue-button" href="https://github.com/kai1992cool/nghtml/issues" target="_blank" rel="noopener noreferrer" aria-label="Open NGHTML GitHub issues">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM7.25 3.5h1.5v5h-1.5v-5Zm0 6.5h1.5v1.5h-1.5V10Z"/></svg>
        <span>Issue</span>
      </a>
    </nav>
  `;const t=document.querySelector(".demo-intro");t&&t.insertAdjacentHTML("beforeend",`<div class="stackblitz-demo-action">
        <a class="header-button stackblitz-button" href="${e}" target="_blank" rel="noopener noreferrer" aria-label="Open this demo in StackBlitz">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M9.3 0 3 8h4l-.3 8L13 7H9l.3-7Z"/></svg>
          <span>StackBlitz</span>
        </a>
        <p class="stackblitz-note">If the stackblitz link doesn’t load, wait 2 minutes, then refresh the opened tab.</p>
      </div>`)}class b extends SyntaxError{constructor(e,t,i=0){const n=Math.max(0,Math.min(i,t.length)),r=t.slice(0,n),o=r.split(`
`).length,c=n-r.lastIndexOf(`
`);super(`${e} (line ${o}, column ${c})`),this.line=o,this.column=c,this.name="NghtmlSyntaxError"}}const Fe=/\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g;function Ke(s,e){v(s,new Set,e),y(s)}function v(s,e,t){const i=new Set(e);for(const n of s)if(n.type==="text")for(const r of n.value.matchAll(Fe)){const o=r[1].split(".")[0];if(!i.has(o))throw new b(`Unknown template variable "${o}"`,t,t.indexOf(r[0]))}else if(n.type==="let")i.add(n.name);else if(n.type==="if"){for(const r of n.branches){const o=new Set(i);r.alias&&o.add(r.alias),v(r.children,o,t)}v(n.elseChildren,i,t)}else if(n.type==="switch"){for(const r of n.cases)v(r.children,i,t);v(n.defaultChildren,i,t)}else if(n.type==="defer")v(n.children,i,t),v(n.placeholderChildren,i,t),v(n.loadingChildren,i,t),v(n.errorChildren,i,t);else{const r=new Set(i);r.add(n.name);for(const o of["$count","$index","$first","$last","$even","$odd"])r.add(o);for(const o of n.aliases)r.add(o.name);v(n.children,r,t),v(n.emptyChildren,i,t)}}function y(s,e){for(const t of s)t.type!=="text"&&(t.type==="if"?(t.branches.forEach(i=>y(i.children)),y(t.elseChildren)):t.type==="switch"?(t.cases.forEach(i=>y(i.children)),y(t.defaultChildren)):t.type==="defer"?(y(t.children),y(t.placeholderChildren),y(t.loadingChildren),y(t.errorChildren)):t.type==="for"&&(y(t.children),y(t.emptyChildren)))}function M(s,e,t){const i=s.match(/^__NGHTML_VALUE_(\d+)__$/);if(i)return{type:"value",index:Number(i[1])};if(s==="true"||s==="false")return{type:"literal",value:s==="true"};if(s==="null")return{type:"literal",value:null};if(/^-?(?:\d+|\d*\.\d+)$/.test(s))return{type:"literal",value:Number(s)};const n=s.match(/^(['"])([\s\S]*)\1$/);if(n)return{type:"literal",value:n[2]};if(/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(s))return{type:"scope",path:s};throw new b("Directive expressions must be supplied as ${values}, paths, or literals",e,t)}function T(s,e,t){return s.type==="value"?t[s.index]:s.type==="literal"?s.value:he(e,s.path)}function he(s,e){const[t,...i]=e.split(".");let n=s.get(t);for(const r of i){if(n==null||typeof n!="object"&&typeof n!="function")return;n=n[r]}return n}function X(s,e){const t=[];let i=0,n=null,r=!1,o=0;for(let c=0;c<s.length;c++){const a=s[c];if(r){r=!1;continue}if(a==="\\"&&n){r=!0;continue}if(n){a===n&&(n=null);continue}if(a==='"'||a==="'"){n=a;continue}a==="{"?o++:a==="}"?o=Math.max(0,o-1):a===e&&o===0&&(t.push(s.slice(i,c)),i=c+1)}return t.push(s.slice(i)),t}const Je="if|for|let|switch|defer";function Qe(s){return A(s,0,s.length)}function A(s,e,t){const i=[];let n=e;for(;n<t;){const r=Ye(s,n,t);if(!r){s.slice(n,t)&&i.push({type:"text",value:s.slice(n,t)});break}if(r.index>n&&i.push({type:"text",value:s.slice(n,r.index)}),r.name==="let"){const o=s.slice(r.index,t).match(/^@let\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+);/);if(!o)throw new b("Expected @let name = ${value};",s,r.index);i.push({type:"let",name:o[1],value:M(o[2].trim(),s,r.index)}),n=r.index+o[0].length}else if(r.name==="if"){const o=et(s,r.index);i.push(o.node),n=o.next}else if(r.name==="switch"){const o=it(s,r.index);i.push(o.node),n=o.next}else if(r.name==="defer"){const o=st(s,r.index);i.push(o.node),n=o.next}else{const o=tt(s,r.index);i.push(o.node),n=o.next}}return i}function Ye(s,e,t){const i=new RegExp(`@(${Je})\\b`,"g");i.lastIndex=e;let n;for(;(n=i.exec(s))&&n.index<t;)if(Xe(s,n.index))return{index:n.index,name:n[1]};return null}function Xe(s,e){const t=s.slice(0,e);let i=null,n=!1;for(let d=0;d<t.length;d++){const l=t[d];if(n){n=!1;continue}if(l==="\\"&&i){n=!0;continue}i?l===i&&(i=null):(l==='"'||l==="'")&&(i=l)}if(i)return!1;const r=t.lastIndexOf("<"),o=t.lastIndexOf(">");if(r>o)return!1;const c=t.lastIndexOf("<style"),a=t.lastIndexOf("</style>");if(c>a)return!1;const f=t.lastIndexOf("<script"),m=t.lastIndexOf("<\/script>");return!(f>m)}function et(s,e){const t=s.slice(e).match(/^@if\s*\(([\s\S]*?)\)\s*\{/);if(!t)throw new b("Expected @if (test; as alias) { ... }",s,e);const i=X(t[1],";");if(i.length>2)throw new b("Invalid @if header",s,e);const n=_e(i[1],s,e),r=e+t[0].lastIndexOf("{"),o=k(s,r);if(o===-1)throw new b("Unclosed @if block",s,e);const c=[{condition:M(i[0].trim(),s,e),alias:n,children:A(s,r+1,o)}];let a=o+1;for(;a<s.length;){const f=s.slice(a).match(/^(\s*)@else\s+if\s*\(([\s\S]*?)\)\s*\{/);if(f){const d=a+f[0].lastIndexOf("{"),l=k(s,d);if(l===-1)throw new b("Unclosed @else if block",s,a);const p=X(f[2],";");c.push({condition:M(p[0].trim(),s,a),alias:_e(p[1],s,a),children:A(s,d+1,l)}),a=l+1;continue}const m=s.slice(a).match(/^(\s*)@else\s*\{/);if(m){const d=a+m[0].lastIndexOf("{"),l=k(s,d);if(l===-1)throw new b("Unclosed @else block",s,a);return{node:{type:"if",branches:c,elseChildren:A(s,d+1,l)},next:l+1}}break}return{node:{type:"if",branches:c,elseChildren:[]},next:a}}function _e(s,e,t){if(s===void 0)return null;const i=s.trim().match(/^as\s+([A-Za-z_$][\w$]*)$/);if(!i)throw new b("Expected @if (...; as alias)",e,t);return i[1]}function tt(s,e){const t=s.slice(e).match(/^@for\s*\(([\s\S]*?)\)\s*\{/);if(!t)throw new b("Expected @for (item of items; track item.id)",s,e);const i=X(t[1],";"),n=i[0].trim().match(/^(?:(?:const|let|var)\s+)?([A-Za-z_$][\w$]*)\s+of\s+(.+)$/);if(!n)throw new b("Expected @for (item of items; track item.id)",s,e);let r=null;const o=[];for(const l of i.slice(1)){const p=l.trim(),u=p.match(/^track\s+(.+)$/);if(u){if(r)throw new b("Duplicate @for track expression",s,e);r=M(u[1].trim(),s,e);continue}const g=p.match(/^let\s+(.+)$/);if(g){for(const h of g[1].split(",")){const $=h.trim().match(/^([A-Za-z_$][\w$]*)\s*=\s*(\$[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)$/);if(!$)throw new b("Expected @for (...; let alias = $first)",s,e);o.push({name:$[1],source:$[2]})}continue}throw new b("Expected track expression or let aliases",s,e)}if(!r)throw new b("Angular @for blocks require a track expression",s,e);const c=e+t[0].lastIndexOf("{"),a=k(s,c);if(a===-1)throw new b("Unclosed @for block",s,e);let f=a+1,m=[];const d=s.slice(f).match(/^(\s*)@empty\s*\{/);if(d){const l=f+d[0].lastIndexOf("{"),p=k(s,l);if(p===-1)throw new b("Unclosed @empty block",s,f);m=A(s,l+1,p),f=p+1}return{node:{type:"for",name:n[1],iterable:M(n[2].trim(),s,e),track:r,aliases:o,children:A(s,c+1,a),emptyChildren:m},next:f}}function it(s,e){const t=s.slice(e).match(/^@switch\s*\(([\s\S]*?)\)\s*\{/);if(!t)throw new b("Expected @switch (value) { ... }",s,e);const i=e+t[0].lastIndexOf("{"),n=k(s,i);if(n===-1)throw new b("Unclosed @switch block",s,e);const r=[];let o=[];const c=s.slice(i+1,n),a=/@(?:case|default)\b/g;let f=0,m;for(;m=a.exec(c),!!m;){const d=m.index;if(c.slice(f,d).trim())throw new b("Unexpected content inside @switch block",s,i+d);if(m[0]==="@case"){const p=c.slice(d).match(/^@case\s*\(([\s\S]*?)\)\s*\{/);if(!p)throw new b("Expected @case (value) { ... }",s,i+d);const u=d+p[0].lastIndexOf("{"),g=i+1+u,h=k(s,g);if(h===-1||h>=n)throw new b("Unclosed @case block",s,i+d);r.push({values:X(p[1],",").map($=>M($.trim(),s,i+d)),children:A(s,g+1,h)}),f=h-i,a.lastIndex=f}else{const p=c.slice(d).match(/^@default\s*\{/);if(!p)throw new b("Expected @default { ... }",s,i+d);const u=d+p[0].lastIndexOf("{"),g=i+1+u,h=k(s,g);if(h===-1||h>=n)throw new b("Unclosed @default block",s,i+d);o=A(s,g+1,h),f=h-i,a.lastIndex=f}}return{node:{type:"switch",value:M(t[1].trim(),s,e),cases:r,defaultChildren:o},next:n+1}}function st(s,e){const t=s.slice(e).match(/^@defer(?:\s*\(([^)]*)\))?\s*\{/);if(!t)throw new b("Expected @defer { ... }",s,e);const i=(t[1]??"").trim();let n="idle";if(i==="on immediate")n="immediate";else if(i==="on viewport")n="viewport";else if(i&&i!=="on idle")throw new b("Supported defer triggers are on idle, on immediate, and on viewport",s,e);const r=e+t[0].lastIndexOf("{"),o=k(s,r);if(o===-1)throw new b("Unclosed @defer block",s,e);let c=o+1,a=[],f=[],m=[];for(;c<s.length;){const d=s.slice(c).match(/^(\s*)@(placeholder|loading|error)(?:\s*\([^)]*\))?\s*\{/);if(!d)break;const l=d[2],p=c+d[0].lastIndexOf("{"),u=k(s,p);if(u===-1)throw new b(`Unclosed @${l} block`,s,c);const g=A(s,p+1,u);l==="placeholder"?a=g:l==="loading"?f=g:m=g,c=u+1}return{node:{type:"defer",trigger:n,children:A(s,r+1,o),placeholderChildren:a,loadingChildren:f,errorChildren:m},next:c}}function k(s,e){let t=1,i=null;for(let n=e+1;n<s.length;n++){if(s.startsWith("{{",n)){const o=s.indexOf("}}",n+2);if(o===-1)return-1;n=o+1;continue}const r=s[n];if(i){r===i&&s[n-1]!=="\\"&&(i=null);continue}if(r==='"'||r==="'")i=r;else if(r==="{")t++;else if(r==="}"&&--t===0)return n}return-1}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=globalThis,fe=Y.ShadowRoot&&(Y.ShadyCSS===void 0||Y.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),we=new WeakMap;let Re=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(fe&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=we.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&we.set(t,e))}return e}toString(){return this.cssText}};const nt=s=>new Re(typeof s=="string"?s:s+"",void 0,pe),rt=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((i,n,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[r+1],s[0]);return new Re(t,s,pe)},ot=(s,e)=>{if(fe)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),n=Y.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=t.cssText,s.appendChild(i)}},ve=fe?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return nt(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:at,defineProperty:lt,getOwnPropertyDescriptor:ct,getOwnPropertyNames:dt,getOwnPropertySymbols:ht,getPrototypeOf:ft}=Object,C=globalThis,ye=C.trustedTypes,pt=ye?ye.emptyScript:"",ne=C.reactiveElementPolyfillSupport,Z=(s,e)=>s,de={toAttribute(s,e){switch(e){case Boolean:s=s?pt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},Be=(s,e)=>!at(s,e),xe={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:Be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let P=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=xe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);n!==void 0&&lt(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=ct(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:n,set(o){const c=n==null?void 0:n.call(this);r==null||r.call(this,o),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??xe}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;const e=ft(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){const t=this.properties,i=[...dt(t),...ht(t)];for(const n of i)this.createProperty(n,t[n])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,n]of t)this.elementProperties.set(i,n)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const n=this._$Eu(t,i);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const n of i)t.unshift(ve(n))}else e!==void 0&&t.push(ve(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ot(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var r;const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(n!==void 0&&i.reflect===!0){const o=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:de).toAttribute(t,i.type);this._$Em=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,t){var r,o;const i=this.constructor,n=i._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const c=i.getPropertyOptions(n),a=typeof c.converter=="function"?{fromAttribute:c.converter}:((r=c.converter)==null?void 0:r.fromAttribute)!==void 0?c.converter:de;this._$Em=n;const f=a.fromAttribute(t,c.type);this[n]=f??((o=this._$Ej)==null?void 0:o.get(n))??f,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){var o;if(e!==void 0){const c=this.constructor;if(n===!1&&(r=this[e]),i??(i=c.getPropertyOptions(e)),!((i.hasChanged??Be)(r,t)||i.useDefault&&i.reflect&&r===((o=this._$Ej)==null?void 0:o.get(e))&&!this.hasAttribute(c._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},o){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[r,o]of n){const{wrapped:c}=o,a=this[r];c!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,o,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(n=>{var r;return(r=n.hostUpdate)==null?void 0:r.call(n)}),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdated)==null?void 0:n.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[Z("elementProperties")]=new Map,P[Z("finalized")]=new Map,ne==null||ne({ReactiveElement:P}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis,Ae=s=>s,ee=j.trustedTypes,ke=ee?ee.createPolicy("lit-html",{createHTML:s=>s}):void 0,De="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Ze="?"+E,ut=`<${Ze}>`,I=document,V=()=>I.createComment(""),W=s=>s===null||typeof s!="object"&&typeof s!="function",ue=Array.isArray,mt=s=>ue(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",re=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Se=/-->/g,Ee=/>/g,z=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ce=/'/g,Me=/"/g,je=/^(?:script|style|textarea|title)$/i,gt=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),$t=gt(1),N=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ne=new WeakMap,O=I.createTreeWalker(I,129);function Ge(s,e){if(!ue(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ke!==void 0?ke.createHTML(e):e}const bt=(s,e)=>{const t=s.length-1,i=[];let n,r=e===2?"<svg>":e===3?"<math>":"",o=D;for(let c=0;c<t;c++){const a=s[c];let f,m,d=-1,l=0;for(;l<a.length&&(o.lastIndex=l,m=o.exec(a),m!==null);)l=o.lastIndex,o===D?m[1]==="!--"?o=Se:m[1]!==void 0?o=Ee:m[2]!==void 0?(je.test(m[2])&&(n=RegExp("</"+m[2],"g")),o=z):m[3]!==void 0&&(o=z):o===z?m[0]===">"?(o=n??D,d=-1):m[1]===void 0?d=-2:(d=o.lastIndex-m[2].length,f=m[1],o=m[3]===void 0?z:m[3]==='"'?Me:Ce):o===Me||o===Ce?o=z:o===Se||o===Ee?o=D:(o=z,n=void 0);const p=o===z&&s[c+1].startsWith("/>")?" ":"";r+=o===D?a+ut:d>=0?(i.push(f),a.slice(0,d)+De+a.slice(d)+E+p):a+E+(d===-2?c:p)}return[Ge(s,r+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class F{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,o=0;const c=e.length-1,a=this.parts,[f,m]=bt(e,t);if(this.el=F.createElement(f,i),O.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=O.nextNode())!==null&&a.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(const d of n.getAttributeNames())if(d.endsWith(De)){const l=m[o++],p=n.getAttribute(d).split(E),u=/([.?@])?(.*)/.exec(l);a.push({type:1,index:r,name:u[2],strings:p,ctor:u[1]==="."?wt:u[1]==="?"?vt:u[1]==="@"?yt:ie}),n.removeAttribute(d)}else d.startsWith(E)&&(a.push({type:6,index:r}),n.removeAttribute(d));if(je.test(n.tagName)){const d=n.textContent.split(E),l=d.length-1;if(l>0){n.textContent=ee?ee.emptyScript:"";for(let p=0;p<l;p++)n.append(d[p],V()),O.nextNode(),a.push({type:2,index:++r});n.append(d[l],V())}}}else if(n.nodeType===8)if(n.data===Ze)a.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(E,d+1))!==-1;)a.push({type:7,index:r}),d+=E.length-1}r++}}static createElement(e,t){const i=I.createElement("template");return i.innerHTML=e,i}}function R(s,e,t=s,i){var o,c;if(e===N)return e;let n=i!==void 0?(o=t._$Co)==null?void 0:o[i]:t._$Cl;const r=W(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==r&&((c=n==null?void 0:n._$AO)==null||c.call(n,!1),r===void 0?n=void 0:(n=new r(s),n._$AT(s,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=n:t._$Cl=n),n!==void 0&&(e=R(s,n._$AS(s,e.values),n,i)),e}class _t{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=((e==null?void 0:e.creationScope)??I).importNode(t,!0);O.currentNode=n;let r=O.nextNode(),o=0,c=0,a=i[0];for(;a!==void 0;){if(o===a.index){let f;a.type===2?f=new K(r,r.nextSibling,this,e):a.type===1?f=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(f=new xt(r,this,e)),this._$AV.push(f),a=i[++c]}o!==(a==null?void 0:a.index)&&(r=O.nextNode(),o++)}return O.currentNode=I,n}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class K{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=R(this,e,t),W(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==N&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):mt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&W(this._$AH)?this._$AA.nextSibling.data=e:this.T(I.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=F.createElement(Ge(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===n)this._$AH.p(t);else{const o=new _t(n,this),c=o.u(this.options);o.p(t),this.T(c),this._$AH=o}}_$AC(e){let t=Ne.get(e.strings);return t===void 0&&Ne.set(e.strings,t=new F(e)),t}k(e){ue(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new K(this.O(V()),this.O(V()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e!==this._$AB;){const n=Ae(e).nextSibling;Ae(e).remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(e,t=this,i,n){const r=this.strings;let o=!1;if(r===void 0)e=R(this,e,t,0),o=!W(e)||e!==this._$AH&&e!==N,o&&(this._$AH=e);else{const c=e;let a,f;for(e=r[0],a=0;a<r.length-1;a++)f=R(this,c[i+a],t,a),f===N&&(f=this._$AH[a]),o||(o=!W(f)||f!==this._$AH[a]),f===_?e=_:e!==_&&(e+=(f??"")+r[a+1]),this._$AH[a]=f}o&&!n&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class wt extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class vt extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class yt extends ie{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=R(this,e,t,0)??_)===N)return;const i=this._$AH,n=e===_&&i!==_||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==_&&(i===_||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class xt{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){R(this,e)}}const oe=j.litHtmlPolyfillSupport;oe==null||oe(F,K),(j.litHtmlVersions??(j.litHtmlVersions=[])).push("3.3.3");const At=(s,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let n=i._$litPart$;if(n===void 0){const r=(t==null?void 0:t.renderBefore)??null;i._$litPart$=n=new K(e.insertBefore(V(),r),r,void 0,t??{})}return n._$AI(s),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis;let G=class extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=At(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return N}};var Pe;G._$litElement$=!0,G.finalized=!0,(Pe=H.litElementHydrateSupport)==null||Pe.call(H,{LitElement:G});const ae=H.litElementPolyfillSupport;ae==null||ae({LitElement:G});(H.litElementVersions??(H.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me={ATTRIBUTE:1,CHILD:2},B=s=>(...e)=>({_$litDirective$:s,values:e});let se=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=s=>s.strings===void 0,St={},Et=(s,e=St)=>s._$AH=e;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=B(class extends se{constructor(){super(...arguments),this.key=_}render(s,e){return this.key=s,e}update(s,[e,t]){return e!==this.key&&(Et(s),this.key=e),t}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function*Mt(s,e){if(s!==void 0){let t=0;for(const i of s)yield e(i,t++)}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function J(s,e,t){return s?e(s):t==null?void 0:t(s)}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=B(class extends se{constructor(s){var e;if(super(s),s.type!==me.ATTRIBUTE||s.name!=="class"||((e=s.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(e=>s[e]).join(" ")+" "}update(s,[e]){var i,n;if(this.st===void 0){this.st=new Set,s.strings!==void 0&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(const r in e)e[r]&&!((i=this.nt)!=null&&i.has(r))&&this.st.add(r);return this.render(e)}const t=s.element.classList;for(const r of this.st)r in e||(t.remove(r),this.st.delete(r));for(const r in e){const o=!!e[r];o===this.st.has(r)||(n=this.nt)!=null&&n.has(r)||(o?(t.add(r),this.st.add(r)):(t.remove(r),this.st.delete(r)))}return N}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qe="important",Tt=" !"+qe,zt=B(class extends se{constructor(s){var e;if(super(s),s.type!==me.ATTRIBUTE||s.name!=="style"||((e=s.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(s){return Object.keys(s).reduce((e,t)=>{const i=s[t];return i==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(s,[e]){const{style:t}=s.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const i of this.ft)e[i]==null&&(this.ft.delete(i),i.includes("-")?t.removeProperty(i):t[i]=null);for(const i in e){const n=e[i];if(n!=null){this.ft.add(i);const r=typeof n=="string"&&n.endsWith(Tt);i.includes("-")||r?t.setProperty(i,r?n.slice(0,-11):n,r?qe:""):t[i]=n}}return N}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=(s,e)=>{var i;const t=s._$AN;if(t===void 0)return!1;for(const n of t)(i=n._$AO)==null||i.call(n,e,!1),q(n,e);return!0},te=s=>{let e,t;do{if((e=s._$AM)===void 0)break;t=e._$AN,t.delete(s),s=e}while((t==null?void 0:t.size)===0)},Ve=s=>{for(let e;e=s._$AM;s=e){let t=e._$AN;if(t===void 0)e._$AN=t=new Set;else if(t.has(s))break;t.add(s),It(e)}};function Ot(s){this._$AN!==void 0?(te(this),this._$AM=s,Ve(this)):this._$AM=s}function Ht(s,e=!1,t=0){const i=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(i))for(let r=t;r<i.length;r++)q(i[r],!1),te(i[r]);else i!=null&&(q(i,!1),te(i));else q(this,s)}const It=s=>{s.type==me.CHILD&&(s._$AP??(s._$AP=Ht),s._$AQ??(s._$AQ=Ot))};class ge extends se{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),Ve(this),this.isConnected=e._$AU}_$AO(e,t=!0){var i,n;e!==this.isConnected&&(this.isConnected=e,e?(i=this.reconnected)==null||i.call(this):(n=this.disconnected)==null||n.call(this)),t&&(q(this,e),te(this))}setValue(e){if(kt(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const S=new WeakMap,Te=new WeakMap,ze=new WeakSet,Q=new WeakSet;function We(s){return Array.isArray(s)?s.flatMap(e=>typeof e=="string"?e.trim().split(/\s+/).filter(Boolean):[]):typeof s=="string"?s.trim().split(/\s+/).filter(Boolean):[]}function Oe(s){return typeof s=="function"?s:void 0}class Ut extends ge{constructor(){super(...arguments),this.element=null,this.classes=[],this.isStarting=!1}_$initialize(e,t,i){super._$initialize(e,t,i),"element"in e&&(this.element=e.element)}render(e,t){const i=We(e);if(this.element){const n=this.classes;this.classes=i,Q.has(this.element)?this.element.classList.remove(...n):queueMicrotask(()=>this.startEnter(t))}return this.callback=t,""}startEnter(e){if(!this.element||this.isStarting||Q.has(this.element))return;Q.add(this.element),this.isStarting=!0,this.timeout!==void 0&&window.clearTimeout(this.timeout);const t=this.element;t.classList.add(...this.classes);let i=!1;const n=()=>{i||(i=!0,t.classList.remove(...this.classes),this.isStarting=!1,this.timeout!==void 0&&window.clearTimeout(this.timeout))},r={target:t,animationComplete:n};e==null||e(r),e||Pt(t,n),this.timeout=window.setTimeout(n,4e3)}disconnected(){this.timeout!==void 0&&window.clearTimeout(this.timeout)}reconnected(){this.element&&!Q.has(this.element)&&queueMicrotask(()=>this.startEnter(this.callback))}}class Lt extends ge{constructor(){super(...arguments),this.element=null,this.classes=[]}_$initialize(e,t,i){super._$initialize(e,t,i),"element"in e&&(this.element=e.element)}render(e,t){return this.element&&(this.classes=We(e),this.callback=t,S.set(this.element,{classes:this.classes,callback:t,parent:this.element.parentNode??this.element}),He(this.element)),""}disconnected(){this.element&&S.delete(this.element)}reconnected(){this.element&&(S.set(this.element,{classes:this.classes,callback:this.callback,parent:this.element.parentNode??this.element}),He(this.element))}}const le=B(Ut),ce=B(Lt);async function Pt(s,e){if(typeof s.getAnimations!="function"){const i=()=>e();s.addEventListener("animationend",i,{once:!0}),s.addEventListener("transitionend",i,{once:!0}),window.setTimeout(i,4e3);return}const t=s.getAnimations();if(t.length===0){queueMicrotask(e);return}await Promise.allSettled(t.map(i=>i.finished)),e()}function He(s){const e=s.getRootNode();if(!(e instanceof Node)||Te.has(e))return;const t=new MutationObserver(i=>{for(const n of i)for(const r of n.removedNodes)Rt(r,n)});t.observe(e,{childList:!0,subtree:!0}),Te.set(e,t)}function Rt(s,e){var r;const t=[];if(s instanceof Element&&(S.has(s)&&t.push(s),s.querySelectorAll("*").forEach(o=>{S.has(o)&&t.push(o)})),t.length===0)return;const i=t.find(o=>S.has(o));if(!i||ze.has(i))return;ze.add(i),!i.isConnected&&((r=e.nextSibling)!=null&&r.parentNode)?e.nextSibling.parentNode.insertBefore(i,e.nextSibling):i.isConnected||e.target.appendChild(i);const n=t.map(o=>S.get(o)).filter(o=>!!o);for(const o of t){const c=S.get(o);c&&o.classList.add(...c.classes)}Bt(t,n).finally(()=>{var o;if((o=e.nextSibling)!=null&&o.parentNode)for(const c of t)c.remove();else for(const c of t)c.remove()})}async function Bt(s,e){const t=e.filter(i=>i.callback);t.length>0?await Promise.all(t.map(i=>new Promise(n=>{var a;const r=s.find(f=>{var m;return((m=S.get(f))==null?void 0:m.callback)===i.callback});if(!r){n();return}let o=!1;const c=()=>{o||(o=!0,n())};(a=i.callback)==null||a.call(i,{target:r,animationComplete:c}),window.setTimeout(c,4e3)}))):await Promise.all(s.map(i=>Dt(i)))}async function Dt(s){if(typeof s.getAnimations!="function"){await new Promise(t=>{const i=()=>t();s.addEventListener("animationend",i,{once:!0}),s.addEventListener("transitionend",i,{once:!0}),window.setTimeout(i,4e3)});return}const e=s.getAnimations();if(e.length===0){await new Promise(t=>window.setTimeout(t,0));return}await Promise.allSettled(e.map(t=>t.finished))}function Zt(s,e,t){const i=new Map,n=[];let r=s;const o={},c={};let a=!1,f=!1;r=r.replace(/\s*\[animate\.(enter|leave)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,(d,l,p,u,g)=>{const $=L(u??g,e,t),w=Oe($),U=`__NGHTML_BINDING_${i.size}__`;return i.set(String(i.size),l==="enter"?le(w?void 0:$,w):ce(w?void 0:$,w)),n.push({name:`data-cf-${l}`,marker:U}),""}),r=r.replace(/\s*animate\.(enter|leave)\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,(d,l,p,u,g)=>{const h=L(u??g,e,t),$=`__NGHTML_BINDING_${i.size}__`;return i.set(String(i.size),l==="enter"?le(h):ce(h)),n.push({name:`data-cf-${l}`,marker:$}),""}),r=r.replace(/\s*\(animate\.(enter|leave)\)\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,(d,l,p,u,g)=>{const $=Oe(L(u??g,e,t)),w=`__NGHTML_BINDING_${i.size}__`;return i.set(String(i.size),l==="enter"?le(void 0,$):ce(void 0,$)),n.push({name:`data-cf-${l}-callback`,marker:w}),""}),r=r.replace(/\s*\[(class(?:\.[A-Za-z_$][\w$-]*)?)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,(d,l,p,u,g)=>{a=!0;const h=L(u??g,e,t);return l==="class"?jt(h,o):o[l.slice(6)]=!!h,""}),r=r.replace(/\s*\[(style(?:\.[A-Za-z_$][\w$.-]*)?)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,(d,l,p,u,g)=>{f=!0;const h=L(u??g,e,t);if(l==="style")Gt(h,c);else{const $=l.slice(6).split("."),w=$.length>1?$.pop():void 0,U=$.join("-");c[U]=h==null||h===!1?"":typeof h=="number"&&w?`${h}${w}`:h}return""});const m=[];r=r.replace(/\s*\[attr\.([A-Za-z_:][A-Za-z0-9_.:-]*)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,(d,l,p,u,g)=>{let h=L(u??g,e,t);h===!0?h="":(h==null||h===!1)&&(h=null);const $=`__NGHTML_BINDING_${i.size}__`;return i.set(String(i.size),h),m.push({name:l,marker:$}),""});for(const d of m)r=r.replace(/>$/,` ${d.name}=${d.marker}>`);for(const d of n)r=r.replace(/>$/,` ${d.name}=${d.marker}>`);if(a){const d=`__NGHTML_BINDING_${i.size}__`;i.set(String(i.size),Nt(o)),r=r.replace(/>$/,` class=${d}>`)}if(f){const d=`__NGHTML_BINDING_${i.size}__`;i.set(String(i.size),zt(c)),r=r.replace(/>$/,` style=${d}>`)}return{text:r,directives:i}}function L(s,e,t){const i=s.match(/^__NGHTML_VALUE_(\d+)__$/);return i?t[Number(i[1])]:(/__NGHTML_VALUE_\d+__/.test(s)&&(s=s.replace(/__NGHTML_VALUE_(\d+)__/g,(n,r)=>String(t[Number(r)]??""))),s=s.replace(/\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g,(n,r)=>String(he(e,r)??"")),s==="true"?!0:s==="false"?!1:s==="null"?null:/^-?(?:\d+|\d*\.\d+)$/.test(s)?Number(s):s)}function jt(s,e){typeof s=="string"?s.split(/\s+/).filter(Boolean).forEach(t=>{e[t]=!0}):Array.isArray(s)?s.forEach(t=>{typeof t=="string"&&(e[t]=!0)}):s&&typeof s=="object"&&Object.entries(s).forEach(([t,i])=>{e[t]=!!i})}function Gt(s,e){typeof s=="string"?s.split(";").forEach(t=>{const i=t.indexOf(":");if(i===-1)return;const n=t.slice(0,i).trim(),r=t.slice(i+1).trim();n&&(e[n]=r)}):s&&typeof s=="object"&&Object.assign(e,s)}class qt extends ge{constructor(){super(...arguments),this.active=!1,this.loaded=!1,this.observationTarget=null,this.startNode=null}_$initialize(e,t,i){var n;if(super._$initialize(e,t,i),e.type===2){this.startNode=e.startNode;const r=(n=e.startNode)==null?void 0:n.parentNode;r instanceof Element?this.observationTarget=r:"firstElementChild"in(r??{})&&r.firstElementChild instanceof Element&&(this.observationTarget=r.firstElementChild)}}render(e,t,i,n,r){if(this.currentMain=e,this.currentError=n,this.loaded)return e;if(this.active=!0,r==="immediate")return queueMicrotask(()=>{this.active&&this.activate()}),i??t;if(typeof window>"u")return queueMicrotask(()=>{this.active&&this.activate()}),i??t;if(r==="idle"){const o=window;o.requestIdleCallback?this.idleHandle=o.requestIdleCallback(()=>{this.active&&this.activate()}):this.timeout=window.setTimeout(()=>{this.active&&this.activate()},0)}else if(r==="viewport"){const o=window.IntersectionObserver??globalThis.IntersectionObserver;o?(this.observer=new o(c=>{c.some(a=>a.isIntersecting)&&this.activate()}),queueMicrotask(()=>{this.discoverAndObserveViewport(),this.observationTarget||(this.timeout=window.setTimeout(()=>{this.discoverAndObserveViewport()},0))})):this.timeout=window.setTimeout(()=>{this.active&&this.activate()},0)}return i??t}discoverAndObserveViewport(){var t,i,n;const e=(t=this.startNode)==null?void 0:t.nextSibling;e instanceof Element&&(this.observationTarget=e),!this.observationTarget&&((i=this.startNode)!=null&&i.parentNode)&&"firstElementChild"in this.startNode.parentNode&&this.startNode.parentNode.firstElementChild instanceof Element&&(this.observationTarget=this.startNode.parentNode.firstElementChild),this.observationTarget&&((n=this.observer)==null||n.observe(this.observationTarget))}activate(){!this.active||this.loaded||(this.loaded=!0,this.cleanupScheduling(),this.setValue(this.currentMain))}disconnected(){this.active=!1,this.cleanupScheduling()}reconnected(){this.active=!0,this.loaded&&this.setValue(this.currentMain)}cleanupScheduling(){var e,t;if(this.timeout!==void 0&&(window.clearTimeout(this.timeout),this.timeout=void 0),this.idleHandle!==void 0){const i=window;(e=i.cancelIdleCallback)==null||e.call(i,this.idleHandle),this.idleHandle=void 0}(t=this.observer)==null||t.disconnect(),this.observer=void 0}fail(){this.loaded=!1,this.cleanupScheduling(),this.setValue(this.currentError)}}const Vt=B(qt),Wt=/__NGHTML_VALUE_(\d+)__|\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g,Ie=new WeakMap;function x(s,e,t,i){const n=[""],r=[],o=l=>{r.push(l),n.push("")},c=l=>{const p=/<[A-Za-z][^<>]*>/g;let u=0,g;for(;g=p.exec(l);){a(l.slice(u,g.index));const h=Zt(g[0],e,t);a(h.text,h.directives),u=g.index+g[0].length}a(l.slice(u))},a=(l,p)=>{const u=new RegExp(`${Wt.source}|__NGHTML_BINDING_(\\d+)__`,"g");let g=0,h;for(;h=u.exec(l);)n[n.length-1]+=l.slice(g,h.index),h[1]!==void 0?o(t[Number(h[1])]):h[2]!==void 0?o(he(e,h[2])):h[3]!==void 0&&o(p==null?void 0:p.get(h[3])),g=h.index+h[0].length;n[n.length-1]+=l.slice(g)};for(const l of s)if(l.type==="text")c(l.value);else if(l.type==="let")e.set(l.name,T(l.value,e,t));else if(l.type==="if"){let p=!1;for(const u of l.branches){if(!u.condition)continue;const g=T(u.condition,e,t);if(g){const h=new Map(e);u.alias&&h.set(u.alias,g),o(J(!0,()=>x(u.children,h,t,i))),p=!0;break}}p||o(J(!0,()=>x(l.elseChildren,new Map(e),t,i)))}else if(l.type==="switch"){const p=T(l.value,e,t),u=l.cases.find(g=>g.values.some(h=>T(h,e,t)===p));o(J(!0,()=>x((u==null?void 0:u.children)??l.defaultChildren,new Map(e),t,i)))}else if(l.type==="defer")o(Vt(x(l.children,new Map(e),t,i),x(l.placeholderChildren,new Map(e),t,i),x(l.loadingChildren,new Map(e),t,i),x(l.errorChildren,new Map(e),t,i),l.trigger));else{const p=T(l.iterable,e,t);if(p==null||typeof(p==null?void 0:p[Symbol.iterator])!="function")throw new TypeError("@for expects an iterable value");const u=[...p];if(!u.length){o(J(!0,()=>x(l.emptyChildren,new Map(e),t,i)));continue}o(Mt(u,(g,h)=>{const $=new Map(e);$.set(l.name,g),$.set("$count",u.length),$.set("$index",h),$.set("$first",h===0),$.set("$last",h===u.length-1),$.set("$even",h%2===0),$.set("$odd",h%2===1);for(const U of l.aliases)$.set(U.name,T(M(U.source,i,0),$,t));const w=T(l.track,$,t);return Ct(w,x(l.children,$,t,i))}))}let f=Ie.get(s);f||(f=new Map,Ie.set(s,f));const m=JSON.stringify(n);let d=f.get(m);return d||(Object.defineProperty(n,"raw",{value:[...n]}),d=n,f.set(m,d)),$t(d,...r)}const Ue=new WeakMap;function Xt(s,...e){let t=Ue.get(s);if(!t){const i=s.raw.reduce((r,o,c)=>r+o+(c<e.length?`__NGHTML_VALUE_${c}__`:""),""),n=Qe(i);Ke(n,i),t={ast:n,source:i},Ue.set(s,t)}return x(t.ast,new Map,e,t.source)}const Ft=rt`
  :host {
    display: block;
    color: #f1eadc;
    font: 400 16px/1.5 'DM Sans', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .stack {
    display: grid;
    gap: 14px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .between {
    justify-content: space-between;
  }

  .muted {
    color: #c1c5d2;
  }

  .small {
    font-size: 14px;
  }

  .field,
  .select {
    min-width: 0;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #40506d;
    border-radius: 9px;
    outline: none;
    color: #f1eadc;
    background: #101624;
  }

  .field:focus,
  .select:focus {
    border-color: #718bb9;
    box-shadow: 0 0 0 3px #718bb920;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid #40506d;
    border-radius: 9px;
    padding: 9px 13px;
    color: #f1eadc;
    background: #20283a;
    transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
  }

  .button:hover {
    border-color: #718bb9;
    background: #263451;
  }

  .button:active {
    transform: translateY(1px);
  }

  .button.primary {
    border-color: #d6c6ac;
    color: #172038;
    background: #dbcdb5;
    font-weight: 700;
  }

  .button.primary:hover {
    background: #eadfc9;
  }

  .button.danger {
    padding: 5px 9px;
    color: #ff9a9a;
  }

  .button.icon {
    width: 34px;
    height: 34px;
    padding: 0;
    font-size: 18px;
  }

  .chip {
    border: 1px solid #35343f;
    border-radius: 99px;
    padding: 6px 11px;
    color: #c1c5d2;
    background: transparent;
    font-size: 14px;
  }

  .chip.active {
    border-color: #718bb9;
    color: #eadfc9;
    background: #718bb920;
  }

  .list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .list-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 10px;
    border: 1px solid #2c2b35;
    border-radius: 10px;
    background: #191920;
  }

  .list-row > .grow {
    flex: 1;
    min-width: 0;
  }

  .check {
    accent-color: #a68aff;
    width: 16px;
    height: 16px;
  }

  .done {
    color: #858493;
    text-decoration: line-through;
  }

  .empty {
    padding: 22px 12px;
    border: 1px dashed #383743;
    border-radius: 10px;
    color: #8f8e9b;
    text-align: center;
  }

  .metric {
    border: 1px solid #302f3a;
    border-radius: 12px;
    padding: 12px;
    background: #1a1921;
  }

  .metric strong {
    display: block;
    color: #f5f2ff;
    font: 700 22px/1.2 'Manrope', sans-serif;
  }

  .metric span {
    color: #9695a4;
    font-size: 13px;
  }

  .progress {
    height: 7px;
    overflow: hidden;
    border-radius: 99px;
    background: #30303a;
  }

  .progress > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #8e6dff, #d29aff);
    transition: width 250ms ease;
  }

  .tag {
    display: inline-block;
    border: 1px solid #45404f;
    border-radius: 99px;
    padding: 3px 8px;
    color: #c3b4ff;
    background: #9c7bff14;
    font-size: 13px;
  }

  .success {
    border: 1px solid #315d4a;
    border-radius: 10px;
    padding: 12px;
    color: #9ee0bd;
    background: #193126;
  }

  .choice {
    width: 100%;
    padding: 11px 13px;
    border: 1px solid #363540;
    border-radius: 9px;
    color: #eae8f0;
    background: #191920;
    text-align: left;
  }

  .choice:hover,
  .choice.selected {
    border-color: #9778ec;
    background: #8b6de51a;
  }

  .divider {
    height: 1px;
    border: 0;
    background: #2d2c36;
  }

  .timer-face {
    display: grid;
    place-items: center;
    min-height: 150px;
    border: 1px solid #37313f;
    border-radius: 16px;
    background: radial-gradient(circle at 50% 45%, #533d762d, #191820 65%);
  }

  .timer-face strong {
    font: 800 48px/1 'DM Mono', monospace;
    letter-spacing: -3px;
  }

  .timer-face span {
    margin-top: 8px;
    color: #aaa4bb;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  .day {
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid #363540;
    border-radius: 8px;
    color: #aaa8b5;
    background: #191920;
    font-size: 13px;
  }

  .day.checked {
    border-color: #9474ee;
    color: #e2d9ff;
    background: #8264d7;
  }

  .grid-two {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .kanban {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .lane {
    min-width: 0;
    padding: 10px;
    border: 1px solid #2d2c36;
    border-radius: 11px;
    background: #17171e;
  }

  .lane-title {
    margin: 0 0 9px;
    color: #bbb9c7;
    font-size: 14px;
    font-weight: 700;
  }

  .lane-card {
    margin-top: 7px;
    padding: 9px;
    border: 1px solid #34333e;
    border-radius: 8px;
    color: #dedce6;
    background: #22212a;
    font-size: 14px;
  }

  .album {
    display: grid;
    place-items: center;
    min-height: 170px;
    border: 1px solid #443853;
    border-radius: 14px;
    background:
      radial-gradient(circle at 35% 35%, #c290ef88, transparent 34%),
      radial-gradient(circle at 70% 70%, #7b67ee77, transparent 38%),
      linear-gradient(145deg, #312239, #181721 70%);
  }

  .album-disc {
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border: 1px solid #ffffff3a;
    border-radius: 50%;
    color: #dfcdfc;
    background: radial-gradient(circle, #221b2a 0 10%, #b181cf 12% 14%, #342746 16% 100%);
    box-shadow: 0 10px 35px #05040966;
    font-size: 14px;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #ab8aff;
  }

  @media (max-width: 560px) {
    .kanban {
      grid-template-columns: 1fr;
    }
  }
`,$e=class $e extends G{};$e.styles=Ft;let Le=$e;export{Le as D,Xt as n};
