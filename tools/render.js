// Marketing 4U post image renderer
// Usage: node tools/render.js spec.json out.jpg   (or a JSON array of specs + out dir)
// spec: { template, theme, size: "portrait"|"square", ...fields }  — see tools/README.md
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const FONTS = path.join(__dirname, 'fonts');
const f = n => 'file://' + path.join(FONTS, n);

const THEMES = {
  navy:   { bg:'#0E1B3D', bg2:'#13254F', panel:'rgba(255,255,255,.07)', line:'rgba(255,255,255,.14)', text:'#FFFFFF', body:'#D6DBE8', muted:'#9AA6C4', accent:'#FF7A1A', onAccent:'#0E1B3D', bad:'#FF9C94', good:'#6EE7B7', badBg:'rgba(255,90,78,.12)', goodBg:'rgba(61,220,151,.11)' },
  orange: { bg:'#FF7A1A', bg2:'#FF8C3A', panel:'rgba(14,27,61,.10)', line:'rgba(14,27,61,.18)', text:'#0E1B3D', body:'#1B2647', muted:'#5B3A1E', accent:'#0E1B3D', onAccent:'#FFFFFF', bad:'#8E1B10', good:'#0B5B3E', badBg:'rgba(255,255,255,.35)', goodBg:'rgba(255,255,255,.55)' },
  cream:  { bg:'#FFF4E8', bg2:'#FFE9D3', panel:'#FFFFFF', line:'rgba(14,27,61,.10)', text:'#0E1B3D', body:'#2C3655', muted:'#7A8199', accent:'#FF7A1A', onAccent:'#FFFFFF', bad:'#C8321F', good:'#11845B', badBg:'#FFE4DF', goodBg:'#DDF5EA' },
  white:  { bg:'#F4F6FB', bg2:'#E8EDF7', panel:'#FFFFFF', line:'rgba(14,27,61,.10)', text:'#0E1B3D', body:'#2C3655', muted:'#7A8199', accent:'#0E1B3D', onAccent:'#FFFFFF', bad:'#C8321F', good:'#11845B', badBg:'#FDE8E5', goodBg:'#E1F5EC', hi:'#FF7A1A' },
};
const SIZES = { portrait:[1080,1350], square:[1080,1080] };

const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// *word* = highlight, \n = line break
// Burmese has no word spaces for the browser to break on safely, so break lines only at the spaces we write
const nob = h => h.replace(/(^|>)([^<]+)(?=<|$)/g,(m,a,t)=>a+t.split(/( +)/).map(x=>/^ +$/.test(x)||!x?x:'<span class="w">'+x+'</span>').join(''));
const md = s => nob(esc(s).replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\n/g,'<br>'));

const T = {
  statement: d => `
    ${d.kicker?`<div class="chip">${md(d.kicker)}</div>`:''}
    <div class="h" style="font-size:2.7em;line-height:1.5">${md(d.text)}</div>
    ${d.sub?`<div class="p" style="font-size:1.25em">${md(d.sub)}</div>`:''}`,
  tip: d => `
    <div class="row">${d.number?`<div class="num">${esc(d.number)}</div>`:''}${d.kicker?`<div class="chip">${md(d.kicker)}</div>`:''}</div>
    <div class="h" style="font-size:2em">${md(d.title)}</div>
    ${d.body?`<div class="p">${md(d.body)}</div>`:''}
    ${d.example?`<div class="box"><div class="lab">${md(d.exampleLabel||'ဥပမာ')}</div><div class="p strong">${md(d.example)}</div></div>`:''}`,
  beforeafter: d => `
    ${d.title?`<div class="h" style="font-size:1.75em">${md(d.title)}</div>`:''}
    <div class="box bad"><div class="lab">${md(d.beforeLabel||'❌ အရင်')}</div><div class="p strong" style="font-size:1.3em">${md(d.before)}</div></div>
    <div class="arrow">↓</div>
    <div class="box good"><div class="lab">${md(d.afterLabel||'✅ အခု')}</div><div class="p strong" style="font-size:1.3em">${md(d.after)}</div></div>
    ${d.note?`<div class="p muted">${md(d.note)}</div>`:''}`,
  checklist: d => `
    ${d.kicker?`<div class="chip">${md(d.kicker)}</div>`:''}
    <div class="h" style="font-size:1.85em">${md(d.title)}</div>
    <div class="list">${(d.items||[]).map(i=>`<div class="ck"><span class="cb"></span><div class="p strong">${md(i)}</div></div>`).join('')}</div>
    ${d.footer?`<div class="p muted">${md(d.footer)}</div>`:''}`,
  mythfact: d => `
    ${d.title?`<div class="h" style="font-size:1.6em">${md(d.title)}</div>`:''}
    <div class="box bad"><div class="lab">${md(d.mythLabel||'လူအများ ထင်တာ')}</div><div class="h" style="font-size:1.55em">${md(d.myth)}</div></div>
    <div class="box good"><div class="lab">${md(d.factLabel||'တကယ်တမ်းက')}</div><div class="p strong" style="font-size:1.3em">${md(d.fact)}</div></div>`,
  quote: d => `
    <div class="qm">“</div>
    <div class="h" style="font-size:2.15em;line-height:1.6">${md(d.quote)}</div>
    ${d.attribution?`<div class="p muted">— ${md(d.attribution)}</div>`:''}`,
  versus: d => `
    ${d.kicker?`<div class="chip">${md(d.kicker)}</div>`:''}
    <div class="h" style="font-size:1.9em">${md(d.question)}</div>
    <div class="vs">
      <div class="opt"><div class="ab">A</div><div class="p strong" style="font-size:1.25em">${md(d.a)}</div></div>
      <div class="opt"><div class="ab">B</div><div class="p strong" style="font-size:1.25em">${md(d.b)}</div></div>
    </div>
    ${d.footer?`<div class="p muted">${md(d.footer)}</div>`:''}`,
  chat: d => `
    ${d.title?`<div class="h" style="font-size:1.6em">${md(d.title)}</div>`:''}
    <div class="chat">${(d.messages||[]).map(m=>`<div class="bub ${m.from==='shop'?'me':'them'}"><div class="who">${md(m.from==='shop'?(d.shopLabel||'ဆိုင်'):(d.customerLabel||'Customer'))}</div>${md(m.text)}</div>`).join('')}</div>
    ${d.footer?`<div class="p muted">${md(d.footer)}</div>`:''}`,
  steps: d => `
    ${d.kicker?`<div class="chip">${md(d.kicker)}</div>`:''}
    <div class="h" style="font-size:1.85em">${md(d.title)}</div>
    <div class="steps">${(d.steps||[]).map((s,i)=>`<div class="st"><div class="sn">${i+1}</div><div><div class="h" style="font-size:1.2em">${md(s.h)}</div>${s.t?`<div class="p" style="font-size:1em">${md(s.t)}</div>`:''}</div></div>`).join('')}</div>`,
  note: d => `
    <div class="paper"><div class="tape"></div>
      ${d.title?`<div class="h" style="font-size:1.7em;color:#0E1B3D">${md(d.title)}</div>`:''}
      <div class="p" style="color:#2C3655;font-size:1.2em;line-height:1.95">${md(d.body)}</div>
    </div>`,
};

function page(spec){
  const th = THEMES[spec.theme] || THEMES.navy; const [W,H] = SIZES[spec.size] || SIZES.portrait;
  const hi = th.hi || th.accent;
  const body = (T[spec.template]||T.statement)(spec);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:NSM;font-weight:400;src:url(${f('noto-sans-myanmar-myanmar-400-normal.woff2')})}
@font-face{font-family:NSM;font-weight:600;src:url(${f('noto-sans-myanmar-myanmar-600-normal.woff2')})}
@font-face{font-family:NSM;font-weight:800;src:url(${f('noto-sans-myanmar-myanmar-800-normal.woff2')})}
@font-face{font-family:AB;src:url(${f('archivo-black-latin-400-normal.woff2')})}
*{box-sizing:border-box}body{margin:0}
#r{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${spec.template==='quote'||spec.template==='statement'?th.bg:`linear-gradient(160deg,${th.bg} 0%,${th.bg} 70%,${th.bg2} 100%)`};color:${th.text};font-family:NSM,AB,sans-serif;word-break:keep-all;overflow-wrap:break-word;padding:${spec.size==='square'?'80px 84px 120px':'100px 90px 140px'}}
.c{height:100%;display:flex;flex-direction:column;justify-content:${spec.align==='top'?'flex-start':'center'};gap:.95em;font-size:38px}
em{font-style:normal;color:${hi}}
.w{white-space:nowrap}
.h{font-weight:800;line-height:1.55;color:${th.text}}
.p{font-weight:400;font-size:1.15em;line-height:1.8;color:${th.body}}
.p.strong{font-weight:600;color:${th.text}}
.p.muted{color:${th.muted};font-size:1em}
.chip{align-self:flex-start;background:${th.accent};color:${th.onAccent};font-weight:800;font-size:.85em;padding:.25em .9em;border-radius:999px;line-height:1.7}
.chip em{color:${th.onAccent}}
.row{display:flex;align-items:center;gap:.7em}
.num{width:2.6em;height:2.6em;border-radius:50%;background:${th.accent};color:${th.onAccent};font-family:AB;font-size:1.5em;display:flex;align-items:center;justify-content:center}
.box{background:${th.panel};border-radius:.8em;padding:.9em 1.1em;display:flex;flex-direction:column;gap:.25em}
.box.bad{background:${th.badBg};border:2px solid ${th.bad}55}.box.good{background:${th.goodBg};border:2px solid ${th.good}55}
.lab{font-weight:800;font-size:.85em;color:${th.muted}}.bad .lab{color:${th.bad}}.good .lab{color:${th.good}}
.arrow{align-self:center;color:${hi};font-family:AB;font-size:1.6em;line-height:.6}
.list{display:flex;flex-direction:column;gap:.55em}
.ck{display:flex;gap:.7em;align-items:flex-start;background:${th.panel};border-radius:.6em;padding:.55em .8em}
.cb{flex:none;width:1.1em;height:1.1em;margin-top:.35em;border:3px solid ${hi};border-radius:.25em}
.qm{font-family:AB;font-size:6em;line-height:.8;color:${hi};height:.6em}
.vs{display:grid;grid-template-columns:${spec.size==='square'?'1fr 1fr':'1fr'};gap:.7em}
.opt{background:${th.panel};border-radius:.8em;padding:.9em 1em;display:flex;gap:.8em;align-items:center}
.ab{flex:none;width:2em;height:2em;border-radius:50%;background:${th.accent};color:${th.onAccent};font-family:AB;font-size:1.2em;display:flex;align-items:center;justify-content:center}
.chat{display:flex;flex-direction:column;gap:.6em}
.bub{max-width:82%;padding:.6em 1em;border-radius:1.1em;font-size:1.15em;line-height:1.65;font-weight:600}
.bub .who{font-size:.7em;font-weight:800;opacity:.75}
.them{align-self:flex-start;background:${th.panel};color:${th.text};border-bottom-left-radius:.3em}
.me{align-self:flex-end;background:${th.accent};color:${th.onAccent};border-bottom-right-radius:.3em}.me em{color:${th.onAccent};text-decoration:underline}
.steps{display:flex;flex-direction:column;gap:.75em}
.st{display:flex;gap:.8em;align-items:flex-start}
.sn{flex:none;width:1.8em;height:1.8em;border-radius:50%;background:${th.accent};color:${th.onAccent};font-family:AB;font-size:1.1em;display:flex;align-items:center;justify-content:center;margin-top:.2em}
.paper{position:relative;background:#FFFDF7;border-radius:.4em;padding:1.6em 1.4em 1.4em;box-shadow:0 .8em 2em rgba(0,0,0,.25);transform:rotate(-1.2deg);background-image:repeating-linear-gradient(#FFFDF7 0 2.2em,#E9E4D6 2.2em calc(2.2em + 2px))}
.paper em{color:#E8660F}
.tape{position:absolute;top:-.6em;left:50%;width:5em;height:1.3em;margin-left:-2.5em;background:rgba(255,122,26,.75);transform:rotate(2deg)}
.brand{position:absolute;left:${spec.size==='square'?84:90}px;bottom:${spec.size==='square'?48:56}px;font-family:AB;font-size:30px;color:${th.muted}}.brand b{color:${hi};font-weight:400}
.deco{position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;border:60px solid ${hi};opacity:.08}
</style></head><body><div id="r">${spec.deco===false?'':'<div class="deco"></div>'}<div class="c">${body}</div><div class="brand">Marketing <b>4U</b></div></div>
<script>
const c=document.querySelector('.c');let s=38;
function over(){return c.scrollHeight>c.clientHeight+2||[...c.querySelectorAll('*')].some(e=>e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!=='visible'&&false)}
window.fit=()=>{s=38;c.style.fontSize=s+'px';while(over()&&s>16){s-=0.5;c.style.fontSize=s+'px'}return s};
</script></body></html>`;
}

async function render(specs, outFn){
  const b = await chromium.launch(); const results=[];
  for (const [i,spec] of specs.entries()){
    const [W,H] = SIZES[spec.size]||SIZES.portrait;
    const p = await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
    const tmp=path.join(require('os').tmpdir(),'m4u-render-'+process.pid+'-'+i+'.html');fs.writeFileSync(tmp,page(spec));await p.goto('file://'+tmp,{waitUntil:'load'});
    await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(150);
    const fs_ = await p.evaluate(()=>fit());
    const out = outFn(spec,i);
    await p.screenshot({path:out,type:'jpeg',quality:92});
    results.push({out,fontPx:fs_}); await p.close();
  }
  await b.close(); return results;
}
module.exports={render,page,THEMES,TEMPLATES:Object.keys(T)};
if (require.main===module){
  const [,,inp,out] = process.argv; const data=JSON.parse(fs.readFileSync(inp,'utf8'));
  const specs=Array.isArray(data)?data:[data];
  if(Array.isArray(data)) fs.mkdirSync(out,{recursive:true});
  render(specs,(s,i)=>Array.isArray(data)?path.join(out,(s.name||('post-'+(i+1)))+'.jpg'):out)
    .then(r=>{r.forEach(x=>console.log(x.out,'font',x.fontPx,x.fontPx<24?'(WARNING: text too long, shorten it)':''))})
    .catch(e=>{console.error(e);process.exit(1)});
}
