function j(){}function et(t,e){for(const n in e)t[n]=e[n];return t}function I(t){return t()}function W(){return Object.create(null)}function w(t){t.forEach(I)}function J(t){return typeof t=="function"}function $t(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let k;function wt(t,e){return k||(k=document.createElement("a")),k.href=e,t===k.href}function nt(t){return Object.keys(t).length===0}function it(t,...e){if(t==null)return j;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function vt(t,e,n){t.$$.on_destroy.push(it(e,n))}function Et(t,e,n,i){if(t){const s=K(t,e,n,i);return t[0](s)}}function K(t,e,n,i){return t[1]&&i?et(n.ctx.slice(),t[1](i(e))):n.ctx}function kt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)o[l]=e.dirty[l]|s[l];return o}return e.dirty|s}return e.dirty}function Nt(t,e,n,i,s,o){if(s){const r=K(e,n,i,o);t.p(r,s)}}function St(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function At(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function jt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}let T=!1;function st(){T=!0}function rt(){T=!1}function ct(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function ot(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&c.push(a)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,a=(s>0&&e[n[s]].claim_order<=u?s+1:ct(1,s,_=>e[n[_]].claim_order,u))-1;i[c]=n[a]+1;const d=a+1;n[d]=c,s=Math.max(d,s)}const o=[],r=[];let l=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);l>=c;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);o.reverse(),r.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<r.length;c++){for(;u<o.length&&r[c].claim_order>=o[u].claim_order;)u++;const a=u<o.length?o[u]:null;t.insertBefore(r[c],a)}}function lt(t,e){if(T){for(ot(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Tt(t,e,n){T&&!n?lt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ut(t){t.parentNode&&t.parentNode.removeChild(t)}function Ct(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function ft(t){return document.createElement(t)}function at(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function H(t){return document.createTextNode(t)}function Mt(){return H(" ")}function Dt(){return H("")}function Ot(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Pt(t){return function(e){return e.preventDefault(),t.call(this,e)}}function Q(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Lt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:Q(t,i,e[i])}function qt(t,e){for(const n in e)Q(t,n,e[n])}function _t(t){return Array.from(t.childNodes)}function dt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function U(t,e,n,i,s=!1){dt(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function V(t,e,n,i){return U(t,s=>s.nodeName===e,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||o.push(l.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Bt(t,e,n){return V(t,e,n,ft)}function Ht(t,e,n){return V(t,e,n,at)}function ht(t,e){return U(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>H(e),!0)}function zt(t){return ht(t," ")}function Ft(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Rt(t,e){t.value=e??""}function Wt(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Gt(t,e,n){t.classList[n?"add":"remove"](e)}function mt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function It(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(s)):o===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}function Jt(t,e){return new t(e)}let $;function x(t){$=t}function z(){if(!$)throw new Error("Function called outside component initialization");return $}function Kt(t){z().$$.on_mount.push(t)}function Qt(t){z().$$.after_update.push(t)}function Ut(){const t=z();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const o=mt(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}function Vt(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const b=[],G=[],S=[],L=[],X=Promise.resolve();let q=!1;function Y(){q||(q=!0,X.then(Z))}function Xt(){return Y(),X}function B(t){S.push(t)}function Yt(t){L.push(t)}const P=new Set;let N=0;function Z(){const t=$;do{for(;N<b.length;){const e=b[N];N++,x(e),pt(e.$$)}for(x(null),b.length=0,N=0;G.length;)G.pop()();for(let e=0;e<S.length;e+=1){const n=S[e];P.has(n)||(P.add(n),n())}S.length=0}while(b.length);for(;L.length;)L.pop()();q=!1,P.clear(),x(t)}function pt(t){if(t.fragment!==null){t.update(),w(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(B)}}const A=new Set;let g;function Zt(){g={r:0,c:[],p:g}}function te(){g.r||w(g.c),g=g.p}function tt(t,e){t&&t.i&&(A.delete(t),t.i(e))}function yt(t,e,n,i){if(t&&t.o){if(A.has(t))return;A.add(t),g.c.push(()=>{A.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const ee=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function ne(t,e){yt(t,1,1,()=>{e.delete(t.key)})}function ie(t,e,n,i,s,o,r,l,c,u,a,d){let _=t.length,m=o.length,h=_;const C={};for(;h--;)C[t[h].key]=h;const v=[],M=new Map,D=new Map;for(h=m;h--;){const f=d(s,o,h),p=n(f);let y=r.get(p);y?i&&y.p(f,e):(y=u(p,f),y.c()),M.set(p,v[h]=y),p in C&&D.set(p,Math.abs(h-C[p]))}const F=new Set,R=new Set;function O(f){tt(f,1),f.m(l,a),r.set(f.key,f),a=f.first,m--}for(;_&&m;){const f=v[m-1],p=t[_-1],y=f.key,E=p.key;f===p?(a=f.first,_--,m--):M.has(E)?!r.has(y)||F.has(y)?O(f):R.has(E)?_--:D.get(y)>D.get(E)?(R.add(y),O(f)):(F.add(E),_--):(c(p,r),_--)}for(;_--;){const f=t[_];M.has(f.key)||c(f,r)}for(;m;)O(v[m-1]);return v}function se(t,e){const n={},i={},s={$$scope:1};let o=t.length;for(;o--;){const r=t[o],l=e[o];if(l){for(const c in r)c in l||(i[c]=1);for(const c in l)s[c]||(n[c]=l[c],s[c]=1);t[o]=l}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function re(t){return typeof t=="object"&&t!==null?t:{}}function ce(t,e,n,i){const s=t.$$.props[e];s!==void 0&&(t.$$.bound[s]=n,i===void 0&&n(t.$$.ctx[s]))}function oe(t){t&&t.c()}function le(t,e){t&&t.l(e)}function gt(t,e,n,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(e,n),i||B(()=>{const r=t.$$.on_mount.map(I).filter(J);t.$$.on_destroy?t.$$.on_destroy.push(...r):w(r),t.$$.on_mount=[]}),o.forEach(B)}function bt(t,e){const n=t.$$;n.fragment!==null&&(w(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function xt(t,e){t.$$.dirty[0]===-1&&(b.push(t),Y(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ue(t,e,n,i,s,o,r,l=[-1]){const c=$;x(t);const u=t.$$={fragment:null,ctx:[],props:o,update:j,not_equal:s,bound:W(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:W(),dirty:l,skip_bound:!1,root:e.target||c.$$.root};r&&r(u.root);let a=!1;if(u.ctx=n?n(t,e.props||{},(d,_,...m)=>{const h=m.length?m[0]:_;return u.ctx&&s(u.ctx[d],u.ctx[d]=h)&&(!u.skip_bound&&u.bound[d]&&u.bound[d](h),a&&xt(t,d)),_}):[],u.update(),a=!0,w(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){st();const d=_t(e.target);u.fragment&&u.fragment.l(d),d.forEach(ut)}else u.fragment&&u.fragment.c();e.intro&&tt(t.$$.fragment),gt(t,e.target,e.anchor,e.customElement),rt(),Z()}x(c)}class fe{$destroy(){bt(this,1),this.$destroy=j}$on(e,n){if(!J(n))return j;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!nt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ne as $,Xt as A,j as B,Et as C,Nt as D,St as E,kt as F,lt as G,vt as H,et as I,at as J,Ht as K,qt as L,se as M,jt as N,At as O,Lt as P,Gt as Q,Ot as R,fe as S,Pt as T,w as U,Vt as V,G as W,Ut as X,Rt as Y,re as Z,ie as _,Mt as a,It as a0,wt as a1,Ct as a2,ee as a3,ce as a4,Yt as a5,Tt as b,zt as c,te as d,Dt as e,tt as f,Zt as g,ut as h,ue as i,Qt as j,ft as k,Bt as l,_t as m,Q as n,Kt as o,Wt as p,H as q,ht as r,$t as s,yt as t,Ft as u,Jt as v,oe as w,le as x,gt as y,bt as z};
