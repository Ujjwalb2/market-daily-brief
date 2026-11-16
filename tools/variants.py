"""Two desktop ideas built from the same Home output, so the content is identical.

  idea-a.html            Idea A: the current Home, refined: less text, more space, a splash on load.
  idea-b.html            Idea B: a calm landing page (streak, Good morning, brief + audio, "View your dashboard").
  idea-b-journal.html    Idea B: a full trade journal (performance tracker) on sample trades.
  idea-b-dashboard.html  Idea B: a dashboard where people add, remove, resize and drag the cards,
                         including a Trade journal (connect broker, trades, stats, insights; sample data).

make(out) takes the finished Home HTML and returns {filename: html}. Nothing here is pushed by default.
"""

SPLASH = '''<div id="apSplash" class="ap-splash" role="status" aria-label="Loading AlphaPad">
  <div class="sp-in">
    <div class="sp-logo"><span class="a">α</span>lpha<span class="p">Pad</span></div>
    <p class="sp-tag">Built by traders, <span>for traders</span></p>
    <div class="sp-bar" aria-hidden="true"><i></i></div>
  </div>
</div>
<script>
(function(){var s=document.getElementById('apSplash');if(!s)return;
  if(/[?&]nosplash/.test(location.search)){s.remove();return}
  var t0=Date.now(),done=false;function hide(){if(done)return;done=true;s.classList.add('out');setTimeout(function(){s.remove()},450)}
  addEventListener('load',function(){setTimeout(hide,Math.max(0,1300-(Date.now()-t0)))});setTimeout(hide,3200);})();
</script>
'''

SPLASH_CSS = '''
.ap-splash{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:radial-gradient(60% 50% at 50% 40%,rgba(63,91,217,.22),transparent 70%),var(--surface-canvas,#101827);transition:opacity .45s ease,visibility .45s}
.ap-splash.out{opacity:0;visibility:hidden}
.sp-in{display:grid;justify-items:center;gap:14px;animation:spIn .6s ease both}
.sp-logo{font:700 44px/1 var(--font-sans);letter-spacing:-1px;color:var(--text-primary)}.sp-logo .a{color:var(--teal)}.sp-logo .p{color:var(--indigo-500,#3F5BD9)}
.sp-tag{margin:0;font:500 16px/1.3 var(--font-sans);color:var(--text-secondary);letter-spacing:.2px}.sp-tag span{color:var(--text-primary);font-weight:600}
.sp-bar{width:180px;height:3px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:6px}
.sp-bar i{display:block;width:40%;height:100%;border-radius:2px;background:linear-gradient(90deg,var(--teal),var(--indigo-500,#3F5BD9));animation:spBar 1.1s ease-in-out infinite}
@keyframes spIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes spBar{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}
@media (prefers-reduced-motion:reduce){.sp-in,.sp-bar i{animation:none}}
'''

# ---------------------------------------------------------------- Idea A: refined Home
A_CSS = '''
/* Idea A: same cards, less text, more room to breathe */
html.idea-a .hg{gap:24px}
html.idea-a .hg>.card,html.idea-a .hg-c .hero-main,html.idea-a .hg-c .hero-side{padding:22px 24px!important}
html.idea-a .ticker .tk-src{display:none}
/* Good morning: headline, two actions, mood. No extra pills. */
html.idea-a .hero-main .asof{display:none}
html.idea-a .hero-main .hero-row .scale,html.idea-a .hero-main .hero-row small{display:none}
/* Trade calls: legs, levels and potential left. Payoff and posting line move behind the card. */
html.idea-a .hg-tc .tc-risk,html.idea-a .hg-tc .tc-new>.eyebrow{display:none}
/* Stock of the day: the picture first; the reasoning opens on request */
html.idea-a .sd-why,html.idea-a .sd-risk{display:none}
html.idea-a .sd.open .sd-why,html.idea-a .sd.open .sd-risk{display:block}
html.idea-a .sd-f>span:first-child{display:none}
html.idea-a .sd-more{justify-self:start;align-self:start;margin-top:2px;border:0;background:none;padding:0;font:600 13px/1 var(--font-sans);color:var(--link,#8FA3FF);cursor:pointer}
html.idea-a .sd-more:hover{text-decoration:underline}
/* A quiet section break before the rest of the day */
html.idea-a .a-sec{grid-area:h2;display:flex;align-items:baseline;gap:12px;margin:16px 2px -6px}
html.idea-a .a-sec h2{margin:0;font:600 18px/1.2 var(--font-sans);letter-spacing:-.2px;color:var(--text-primary)}
html.idea-a .a-sec span{font:400 13px/1.3 var(--font-sans);color:var(--text-tertiary)}
@media (min-width:1400px){html.idea-a .hg{grid-template-areas:"s s s s" "c tc sd sd" "h2 h2 h2 h2" "fo mk tl one" "dl dl bk bk"!important}}
@media (min-width:1101px) and (max-width:1399px){html.idea-a .hg{grid-template-areas:"s s s" "c tc sd" "h2 h2 h2" "mk tl one"!important}}
@media (max-width:1100px){html.idea-a .a-sec{display:none}}
/* Below the fold: three lines per list instead of five */
html.idea-a .scan .sc li:nth-child(n+4),html.idea-a .wh-list li:nth-child(n+4){display:none}
html.idea-a .scan{margin-top:72px}
html.idea-a .card .hc-foot>span{display:none}
'''

A_JS = '''<script>
document.documentElement.classList.add('idea-a');
addEventListener('DOMContentLoaded',function(){
  var hg=document.querySelector('.hg');if(hg){var h=document.createElement('div');h.className='a-sec';h.innerHTML='<h2>Markets today</h2><span>Levels, indices, the day ahead and one idea to learn</span>';hg.appendChild(h)}
  var sd=document.querySelector('.sd'),px=sd&&sd.querySelector('.sd-px');
  if(px){var b=document.createElement('button');b.type='button';b.className='sd-more';b.setAttribute('aria-expanded','false');b.textContent='Why this stock? \\u25BE';
    b.onclick=function(){var o=sd.classList.toggle('open');b.setAttribute('aria-expanded',String(o));b.textContent=o?'Hide reasoning \\u25B4':'Why this stock? \\u25BE'};px.insertAdjacentElement('afterend',b)}
});
</script>'''


AT_CSS = '''
/* Idea A: your trading — the journal and backtesting from the dashboard */
html.idea-a .a-trade{grid-column:1/-1;display:grid;gap:14px;margin-top:16px;min-width:0}
html.idea-a .a-sec2{display:flex;align-items:baseline;gap:12px;margin:0 2px}
html.idea-a .a-sec2 h2{margin:0;font:600 18px/1.2 var(--font-sans);letter-spacing:-.2px;color:var(--text-primary)}
html.idea-a .a-sec2 span{font:400 13px/1.3 var(--font-sans);color:var(--text-tertiary)}
html.idea-a .a-tg{display:grid;grid-template-columns:minmax(0,3fr) minmax(300px,1fr);gap:24px;align-items:stretch;min-width:0}
html.idea-a #journal{padding:22px 24px}
html.idea-a #journal .jr-tbl,html.idea-a #journal .jr-note{display:none}
html.idea-a #journal .jr-ins li:nth-child(n+4){display:none}
html.idea-a .a-bt{display:flex;flex-direction:column;gap:14px;padding:22px 24px;border-radius:12px;background:var(--surface-raised);border:1px solid var(--border-decorative);min-width:0}
html.idea-a .a-bt .k{display:flex;align-items:center;gap:8px;font:600 11px/1.2 var(--font-sans);letter-spacing:1.1px;text-transform:uppercase;color:var(--text-tertiary)}
html.idea-a .a-bt .k i{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:var(--fb-info-soft);color:var(--blue)}
html.idea-a .a-bt .k svg{width:15px;height:15px}
html.idea-a .a-bt h3{margin:0;font:600 19px/1.25 var(--font-sans);letter-spacing:-.2px;color:var(--text-primary)}
html.idea-a .a-bt p{margin:0;font:400 13.5px/1.5 var(--font-sans);color:var(--text-secondary)}
html.idea-a .a-bt .cd{display:block;width:100%;height:84px;border-radius:10px;background:var(--surface-glass);border:1px solid var(--border-decorative)}
html.idea-a .a-bt .cd .u{fill:var(--teal);stroke:var(--teal)}html.idea-a .a-bt .cd .d{fill:var(--slate-500,#7B8799);stroke:var(--slate-500,#7B8799)}
html.idea-a .a-bt .cd .ph{stroke:var(--action-primary);stroke-width:1.5;stroke-dasharray:3 3}
html.idea-a .a-bt .fj{padding:12px 14px;border-radius:10px;background:var(--fb-warning-soft);border-left:3px solid var(--amber);font:400 13px/1.45 var(--font-sans);color:var(--text-secondary)}
html.idea-a .a-bt .fj b{color:var(--text-primary);font-weight:600}
html.idea-a .a-bt .fj small{display:block;margin-bottom:3px;font:600 10.5px/1.2 var(--font-sans);letter-spacing:.9px;text-transform:uppercase;color:var(--text-tertiary)}
html.idea-a .a-bt .go{margin-top:auto;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
html.idea-a .a-bt .go a.p{display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:9px;background:var(--action-primary);color:#fff!important;font:600 13.5px/1 var(--font-sans);text-decoration:none}
html.idea-a .a-bt .go a.p:hover{background:var(--action-hover)}
html.idea-a .a-bt .go a.s{font:600 13px/1 var(--font-sans);color:var(--link,#8FA3FF);text-decoration:none}html.idea-a .a-bt .go a.s:hover{text-decoration:underline}
@media (max-width:1100px){html.idea-a .a-tg{grid-template-columns:minmax(0,1fr)}html.idea-a .a-sec2 span{display:none}}
@media (max-width:640px){html.idea-a #journal,html.idea-a .a-bt{padding:18px 16px}}
'''

AT_JS = r'''<script>
/* Idea A: move the journal card into a "Your trading" row and add a backtesting card beside it */
addEventListener('DOMContentLoaded',function(){
  var hg=document.querySelector('.hg'),jr=document.getElementById('journal');if(!hg||!jr)return;
  var BT='https://ujjwalb2.github.io/tradin-simulator/replay/';
  var w=document.createElement('section');w.className='a-trade';w.setAttribute('aria-label','Your trading');
  w.innerHTML='<div class="a-sec2"><h2>Your trading</h2><span>Your journal, today’s trades to review, and a place to practise</span></div><div class="a-tg"></div>';
  hg.appendChild(w);var g=w.querySelector('.a-tg');g.appendChild(jr);
  /* Weakest setup this month, from the journal */
  var JDA=window.JD||[],LM=JDA.length?JDA[JDA.length-1].d.slice(0,7):'',by={};
  JDA.filter(function(t){return t.d.slice(0,7)===LM}).forEach(function(t){var b=by[t.setup]||(by[t.setup]={p:0,n:0});b.p+=t.pnl;b.n++});
  var ws=Object.keys(by).sort(function(a,b){return by[a].p-by[b].p})[0];
  var inr=function(v){return (v<0?'−':'+')+'₹'+Math.abs(v).toLocaleString('en-IN')};
  /* A small replay picture: candles up to a dashed playhead */
  var c='',x=10,o=40,seed=7,rnd=function(){seed=(seed*9301+49297)%233280;return seed/233280};
  for(var i=0;i<22;i++){var cl=Math.max(14,Math.min(70,o+(rnd()-.45)*16)),hi=Math.min(o,cl)-3-rnd()*6,lo=Math.max(o,cl)+3+rnd()*6,up=cl<o;
    c+='<line class="'+(up?'u':'d')+'" x1="'+(x+3)+'" x2="'+(x+3)+'" y1="'+hi.toFixed(1)+'" y2="'+lo.toFixed(1)+'" stroke-width="1"/><rect class="'+(up?'u':'d')+'" x="'+x+'" y="'+Math.min(o,cl).toFixed(1)+'" width="6" height="'+Math.max(1.5,Math.abs(cl-o)).toFixed(1)+'" rx="1"/>';o=cl;x+=11}
  c+='<line class="ph" x1="'+(x+2)+'" x2="'+(x+2)+'" y1="4" y2="80"/>';
  var bt=document.createElement('section');bt.className='a-bt';bt.setAttribute('aria-labelledby','abtH');
  bt.innerHTML='<div class="k"><i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg></i>Backtesting</div>'+
    '<h3 id="abtH">Practise before you risk money</h3><p>Replay a past session candle by candle and trade it as if it were live.</p>'+
    '<svg class="cd" viewBox="0 0 280 84" preserveAspectRatio="none" aria-hidden="true">'+c+'</svg>'+
    (ws&&by[ws].p<0?'<div class="fj"><small>From your journal</small>Your weakest setup this month is <b>'+ws+'</b>: <b>'+inr(by[ws].p)+'</b> over '+by[ws].n+' trades. Replay a few days and try it again.</div>':'')+
    '<div class="go"><a class="p" href="'+BT+'" target="_blank" rel="noopener">Open replay ↗</a><a class="s" href="idea-b-journal.html">See the journal →</a></div>';
  g.appendChild(bt);
});
</script>'''

# ---------------------------------------------------------------- Idea B: calm landing
B_CSS = '''
/* Idea B landing: one screen. Left, today; right, your streak. Everything else lives on the dashboard. */
html.idea-b .hg>*:not(.hg-s):not(.hg-c):not(.b-spot),html.idea-b .hero-side,html.idea-b #scan,html.idea-b #happening,html.idea-b .scan-cue{display:none!important}
html.idea-b .hg-c,html.idea-b .hg-c .hero{display:contents!important}
html.idea-b .hg{grid-template-columns:minmax(0,1.6fr) minmax(340px,1fr)!important;grid-template-areas:"c s" "c sp"!important;grid-template-rows:auto minmax(0,1fr);align-items:stretch;gap:24px;max-width:1240px;margin:clamp(20px,4vh,48px) auto 0;min-height:min(640px,calc(100vh - 250px))}
html.idea-b .hero-main{grid-area:c;display:flex!important;flex-direction:column;gap:16px;padding:clamp(28px,4vh,48px) clamp(28px,3.4vw,52px)!important;border-radius:24px!important;border:1px solid var(--border-decorative)!important;
  background:radial-gradient(90% 120% at 0% 0%,rgba(63,91,217,.28),transparent 55%),radial-gradient(70% 90% at 100% 100%,rgba(0,201,154,.14),transparent 60%),var(--surface-raised)!important;position:relative;overflow:hidden}
html.idea-b .hero-main::after{content:"";position:absolute;right:-90px;top:-90px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(143,163,255,.16),transparent 70%);pointer-events:none}
html.idea-b .hero-main .eyebrow{font-size:12.5px!important;letter-spacing:1.4px!important}
html.idea-b .home .hero .hero-main h1,html.idea-b .hero-main h1{font-size:clamp(40px,4.2vw,58px)!important;line-height:1.04!important;letter-spacing:-1.6px!important;white-space:normal!important;margin:0!important}
html.idea-b .hero-main .dayline{display:block!important;max-width:34em;margin:0!important;font:400 18px/1.55 var(--font-sans)!important;color:var(--text-secondary)!important}
html.idea-b .hero-main .asof{display:none!important}
html.idea-b .hero-main .home-cta{display:flex!important;flex-wrap:wrap;gap:12px;align-items:center;margin-top:8px}
html.idea-b .hero-main .home-cta .btn{height:48px;padding:0 22px;font-size:15px}
html.idea-b .b-dash{display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 22px;border-radius:12px;border:1px solid rgba(143,163,255,.45);background:rgba(63,91,217,.10);color:var(--text-primary);font:600 15px/1 var(--font-sans);text-decoration:none;transition:background .15s,border-color .15s}
html.idea-b .b-dash:hover{background:var(--surface-hover);border-color:var(--action-primary)}
html.idea-b .b-dash svg{width:18px;height:18px}
html.idea-b .b-peek{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:auto;padding-top:22px;border-top:1px solid var(--border-decorative)}
html.idea-b .b-peek a{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid var(--border-decorative);color:var(--text-secondary);font:500 12.5px/1.3 var(--font-sans);text-decoration:none;transition:border-color .15s,background .15s}
html.idea-b .b-peek a:hover{border-color:var(--surface-hover-stroke);background:var(--surface-hover)}
html.idea-b .b-peek a span{display:grid;min-width:0}
html.idea-b .b-peek a b{color:var(--text-primary);font:600 14.5px/1.25 var(--font-sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
html.idea-b .b-peek a em{font-style:normal;font:600 13px/1 var(--font-sans);color:var(--teal);white-space:nowrap}
html.idea-b .b-peek a em.n{color:var(--text-tertiary);font-weight:500}
html.idea-b .b-peek i{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--fin-positive-soft);font-style:normal;font-size:15px}
html.idea-b .b-peek i.b{background:var(--fb-info-soft)}html.idea-b .b-peek i.w{background:var(--fb-warning-soft)}html.idea-b .b-peek i.v{background:rgba(63,91,217,.18)}
html.idea-b .hero-main .hero-row{display:none!important}
html.idea-b .home .stk-strip{padding:20px 22px!important;gap:14px 14px}
html.idea-b .b-spot{grid-area:sp;display:flex;flex-direction:column;gap:12px;padding:20px 22px;border-radius:24px;border:1px solid var(--border-decorative);background:radial-gradient(90% 80% at 100% 0%,rgba(0,201,154,.12),transparent 60%),var(--surface-raised);min-width:0}
html.idea-b .bs-h{display:flex;align-items:center;gap:10px}
html.idea-b .bs-h>b{font:600 14px/1 var(--font-sans);color:var(--text-primary)}
html.idea-b .bs-c{font:500 12px/1 var(--font-sans);color:var(--text-tertiary)}
html.idea-b .bs-h .sp{flex:1}
html.idea-b .bs-nav{width:30px;height:30px;border-radius:9px;border:1px solid var(--border-decorative);background:rgba(255,255,255,.04);color:var(--text-primary);font:600 16px/1 var(--font-sans);cursor:pointer}
html.idea-b .bs-nav:hover{border-color:var(--surface-hover-stroke);background:var(--surface-hover)}
html.idea-b .bs-track{position:relative;flex:1;display:grid}
html.idea-b .bs-s{grid-area:1/1;position:relative;display:flex;flex-direction:column;gap:8px;opacity:0;transform:translateX(14px);transition:opacity .35s ease,transform .35s ease;pointer-events:none}
html.idea-b .bs-s.on{opacity:1;transform:none;pointer-events:auto}
@media (prefers-reduced-motion:reduce){html.idea-b .bs-s{transition:none}}
html.idea-b .bs-k{font:600 11px/1.2 var(--font-sans);letter-spacing:1.1px;text-transform:uppercase;color:var(--text-tertiary)}
html.idea-b .bs-t{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
html.idea-b .bs-t b{font:600 26px/1.1 var(--font-sans);letter-spacing:-.4px;color:var(--text-primary)}
html.idea-b .bs-t .v{font:600 18px/1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary)}
html.idea-b .bs-t .d{font:600 14px/1 var(--font-sans);color:var(--teal)}
html.idea-b .bs-s p{margin:0;font:400 13.5px/1.5 var(--font-sans);color:var(--text-secondary)}
html.idea-b .bs-viz{margin-top:auto}
html.idea-b .spk{display:block;width:100%;height:46px}html.idea-b .spk polyline{fill:none;stroke:var(--teal);stroke-width:2;vector-effect:non-scaling-stroke;stroke-linejoin:round}
html.idea-b .sbar{position:relative;display:flex;height:10px;border-radius:5px;background:rgba(255,255,255,.06)}
html.idea-b .sbar i{display:block;height:100%;border-radius:5px;background:var(--amber)}
html.idea-b .sbar.two i{background:var(--blue);border-radius:0 5px 5px 0}html.idea-b .sbar.two i.p{opacity:.35;border-radius:5px 0 0 5px}
html.idea-b .sbar b{position:absolute;top:-4px;width:2px;height:18px;background:var(--text-primary);border-radius:1px}
html.idea-b .ssplit{display:flex;gap:3px;height:10px}html.idea-b .ssplit i{display:block;border-radius:5px;background:var(--teal)}html.idea-b .ssplit i+i{background:var(--slate-500,#7B8799)}
html.idea-b .slab{display:flex;justify-content:space-between;margin-top:6px;font:500 11.5px/1 var(--font-sans);color:var(--text-tertiary)}
html.idea-b .soi{display:grid;grid-template-columns:1fr 1fr;gap:6px}
html.idea-b .soi .q{display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:9px;background:rgba(255,255,255,.04);font:500 11.5px/1.2 var(--font-sans);color:var(--text-tertiary)}
html.idea-b .soi .q b{font:600 13px/1 var(--font-sans);color:var(--text-secondary)}
html.idea-b .soi .q.on{background:var(--fin-positive-soft);color:var(--text-primary);box-shadow:inset 0 0 0 1px rgba(0,201,154,.45)}html.idea-b .soi .q.on b{color:var(--text-primary)}
html.idea-b .bs-a{display:flex;gap:14px;flex-wrap:wrap;margin-top:4px}
html.idea-b .bs-a a{font:600 13px/1 var(--font-sans);text-decoration:none;color:var(--link,#8FA3FF)}html.idea-b .bs-a a.p{padding:9px 14px;border-radius:9px;background:var(--action-primary);color:#fff}
html.idea-b .bs-a a.g{align-self:center}html.idea-b .bs-a a:hover{text-decoration:underline}html.idea-b .bs-a a.p:hover{text-decoration:none;background:var(--action-hover,#3452C9)}
html.idea-b .bs-dots{display:flex;gap:6px;justify-content:center}
html.idea-b .bs-dots button{width:7px;height:7px;padding:0;border:0;border-radius:9999px;background:rgba(255,255,255,.2);cursor:pointer;transition:width .2s}
html.idea-b .bs-dots button[aria-selected=true]{width:20px;background:var(--teal)}
html.idea-b body{padding-bottom:76px!important}
html.idea-b .hg{margin-top:clamp(12px,2.2vh,32px)!important;min-height:0!important;gap:20px!important}
html.idea-b .hero-main{padding:clamp(22px,3.4vh,44px) clamp(26px,3vw,48px)!important;gap:clamp(10px,1.6vh,16px)!important}
html.idea-b .home .hero .hero-main h1,html.idea-b .hero-main h1{font-size:clamp(34px,5.4vh,56px)!important}
html.idea-b .hero-main .dayline{font-size:clamp(15px,2.1vh,18px)!important}
html.idea-b .hero-main .home-cta{margin-top:2px!important}
html.idea-b .hero-main .home-cta .btn,html.idea-b .b-dash{height:clamp(40px,5.6vh,48px)!important}
html.idea-b .b-peek{grid-template-columns:repeat(4,minmax(0,1fr))!important;margin-top:4px!important;padding-top:clamp(12px,1.8vh,18px)!important}
html.idea-b .b-peek a{grid-template-columns:auto minmax(0,1fr)!important;padding:10px 12px!important}
html.idea-b .b-peek a em{grid-column:2;font-size:12px!important}
html.idea-b .b-peek i{width:30px!important;height:30px!important;font-size:14px!important}
html.idea-b .b-glance div{padding:clamp(8px,1.3vh,12px) 14px!important}
html.idea-b .b-glance b{font-size:clamp(17px,2.5vh,20px)!important}

html.idea-b .b-spot{padding:clamp(14px,2.2vh,20px) 20px!important;gap:clamp(8px,1.2vh,12px)!important}
html.idea-b .home .stk-strip{padding:clamp(14px,2.2vh,20px) 20px!important;gap:clamp(10px,1.4vh,14px) 14px!important}
html.idea-b .home .stk-strip .days{padding:clamp(8px,1.3vh,14px) 12px!important}
html.idea-b .home .stk-strip .flame{width:clamp(44px,6vh,56px)!important;height:clamp(44px,6vh,56px)!important}
html.idea-b .b-glance{margin-top:0!important}
html.idea-b .b-peek{margin-top:clamp(10px,1.6vh,16px)!important}
html.idea-b .hero-main .home-cta{margin-bottom:clamp(12px,2vh,24px)!important}
html.idea-b .b-peek a b{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.2!important}
@media (max-width:1250px){html.idea-b .b-peek{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media (max-height:705px) and (min-width:1101px){html.idea-b .bs-dots{display:none!important}html.idea-b body{padding-bottom:66px!important}html.idea-b .home .hero .hero-main h1,html.idea-b .hero-main h1{font-size:30px!important}html.idea-b .hero-main{padding-top:18px!important;padding-bottom:18px!important}html.idea-b .bs-s p{-webkit-line-clamp:2;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}html.idea-b .hg{margin-top:10px!important}}
@media (max-height:740px) and (min-width:1101px){html.idea-b .b-glance{display:none!important}html.idea-b .home .stk-strip .ss-end{display:none!important}html.idea-b .home .stk-strip{grid-template-areas:"fl nm" "dy dy" "go go" "lb lb"!important}html.idea-b .home .stk-strip .stk-goal{font-size:12.5px!important;padding:8px 10px!important;flex-wrap:nowrap!important}html.idea-b .home .stk-strip .stk-goal .pips{display:none!important}html.idea-b .home .stk-strip .days{padding:6px 10px!important}html.idea-b .home .stk-strip .flame{width:44px!important;height:44px!important}}
@media (max-height:860px) and (min-width:1101px){html.idea-b .home .stk-strip .ss-end{display:none!important}html.idea-b .home .stk-strip{position:relative;grid-template-areas:"fl nm" "dy dy" "go go"!important}html.idea-b .home .stk-strip .lb-pill{position:absolute!important;top:18px;right:18px}html.idea-b .home .stk-strip .stk-goal{font-size:12.5px!important;padding:8px 10px!important;flex-wrap:nowrap!important}html.idea-b .home .stk-strip .stk-goal .pips{display:none!important}html.idea-b .home .stk-strip .days{padding:6px 10px!important}html.idea-b .home .stk-strip .flame{width:44px!important;height:44px!important}}
html.idea-b .bs-s{gap:6px!important}html.idea-b .bs-s p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px!important}html.idea-b .soi{gap:5px!important}html.idea-b .soi .q{padding:5px 9px!important}html.idea-b .bs-t b{font-size:24px!important}html.idea-b .spk{height:38px!important}
html.idea-b .b-glance{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:6px}
html.idea-b .b-glance div{padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid var(--border-decorative);min-width:0}
html.idea-b .b-glance span{display:block;font:500 11.5px/1.2 var(--font-sans);color:var(--text-tertiary)}
html.idea-b .b-glance b{display:block;margin:5px 0 2px;font:600 20px/1.1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary)}
html.idea-b .b-glance em{font-style:normal;font:600 12px/1 var(--font-sans);color:var(--teal)}html.idea-b .b-glance em.w{color:var(--amber)}html.idea-b .b-glance em.n{color:var(--text-secondary);font-weight:500}
@media (max-width:900px){html.idea-b .b-glance{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* streak becomes a compact panel on the right */
html.idea-b .hg-s{grid-area:s;display:flex;min-width:0}
html.idea-b .home .stk-strip{flex:1;display:grid!important;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"fl nm" "dy dy" "go go" "lb en";align-content:start;gap:18px 14px;padding:26px 24px!important;border-radius:24px!important;margin:0!important}
html.idea-b .home .stk-strip .flame{grid-area:fl;width:56px!important;height:56px!important}
html.idea-b .home .stk-strip .ss-n{grid-area:nm;min-width:0}
html.idea-b .home .stk-strip .days{grid-area:dy;display:flex!important;justify-content:space-between;padding:14px 12px;border-radius:14px;background:rgba(255,255,255,.04)}
html.idea-b .home .stk-strip .poll{display:none!important;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:14px;border-radius:14px;background:rgba(255,255,255,.04)}
html.idea-b .home .stk-strip .poll button{padding:8px 12px!important}
html.idea-b .home .stk-strip .stk-goal{grid-area:go;margin:0!important;flex-wrap:wrap;row-gap:8px;white-space:normal}
html.idea-b .home .stk-strip .lb-pill{grid-area:lb;justify-self:start}
html.idea-b .home .stk-strip .ss-end{grid-area:en;justify-self:end;align-self:center}
html.idea-b .home .stk-strip .ss-n span em+*,html.idea-b .home .stk-strip .ss-ms{display:revert!important}
@media (max-width:1100px){html.idea-b .hg{grid-template-columns:minmax(0,1fr)!important;grid-template-areas:"c" "s" "sp"!important;grid-template-rows:none;min-height:0}}
@media (max-width:700px){html.idea-b .b-peek{grid-template-columns:minmax(0,1fr)}html.idea-b .hero-main .home-cta .btn,html.idea-b .b-dash{flex:1 1 100%;justify-content:center}}
'''

DASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>'

B_JS = '''<script>
document.documentElement.classList.add('idea-b');
function buildSpot(){
  var hg=document.querySelector('.hg');if(!hg)return;
  var SCR='https://dev.alphapad.in/screener',OS='https://dev.alphapad.in/option-studio';
  var IC={sd:'<path d="m4 15 6-6 4 4 6-6"/><path d="M15 7h5v5"/>',vol:'<path d="M5 20V10M10 20V4M15 20v-7M20 20v-4"/>',br:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8h-8z"/>',del:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',oi:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'};
  function rank(rows,mx,unit,col){return '<ol class="sv-rank '+col+'">'+rows.map(function(r,i){return '<li><span class="n">'+(i+1)+'</span><b>'+r[0]+'</b><span class="bar"><i style="width:'+(r[1]/mx*100).toFixed(0)+'%"></i></span><span class="v">'+r[1]+unit+'</span><em class="'+(r[2][0]==='+'?'u':'d')+'">'+r[2]+'</em></li>'}).join('')+'</ol>'}
  var S=[
   {c:'t',ic:'sd',k:'Stock of the day · 11 Nov',t:'NAVINFLUOR',v:'₹9,659',d:'+5.97%',sub:'Fresh 52-week high, 4.5% above the old peak.',
    viz:'<div class="sv-sd"><svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="svg1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00C99A" stop-opacity=".35"/><stop offset="1" stop-color="#00C99A" stop-opacity="0"/></linearGradient></defs><polygon fill="url(#svg1)" points="0,34 SPARK 100,34"/><line class="oh" x1="0" x2="100" y1="OLDY" y2="OLDY" vector-effect="non-scaling-stroke"/><polyline points="SPARK" vector-effect="non-scaling-stroke"/></svg><span class="oh-l">Old high ₹9,245</span></div>'+
        '<div class="sv-chips"><span>Volume<b>3.1×</b></span><span>Delivery<b>45%</b></span><span>Futures OI<b>+69%</b></span></div>',
    a:[['idea-b-dashboard.html#sd','Why it’s picked'],[SCR,'Screen similar']]},
   {c:'a',ic:'vol',k:'Volume shockers',t:'FACT',v:'29.6×',d:'+8.67%',sub:'Volume far above the 20-day average. Check the news first.',
    viz:rank([['FACT',29.6,'+8.67%'],['BEML',19.4,'+6.05%'],['IIFL',12.3,'+6.26%']],29.6,'×','a'),
    a:[[SCR,'Screen volume shockers']]},
   {c:'t',ic:'br',k:'Breadth · Nifty 500',t:'149 vs 7',v:'',d:'',sub:'New 20-day highs against new lows: a broad rally.',
    viz:'<div class="sv-br"><div class="sv-ring" style="--p:95.5" role="img" aria-label="149 new highs, 7 new lows"><b>96%</b><small>highs</small></div><div class="sv-top"><span class="sv-tl">Strongest new highs</span><ul><li><b>FACT</b><em class="u">+8.67%</em></li><li><b>KALYANKJIL</b><em class="u">+8.63%</em></li><li><b>SUNTV</b><em class="u">+7.21%</em></li></ul></div></div>',
    a:[[SCR,'Screen 20-day highs']]},
   {c:'b',ic:'del',k:'Delivery spikes',t:'HOMEFIRST',v:'86%',d:'+42.8 pts',sub:'Shares changing hands for delivery, not intraday.',
    viz:'<ol class="sv-rank b two">'+[['HOMEFIRST',43,43,'86%'],['MANKIND',27,37,'64%'],['GLAND',23,30,'53%']].map(function(r,i){return '<li><span class="n">'+(i+1)+'</span><b>'+r[0]+'</b><span class="bar"><i class="p" style="width:'+r[1]+'%"></i><i style="width:'+r[2]+'%"></i></span><span class="v">'+r[3]+'</span><em class="u">+'+r[2]+'</em></li>'}).join('')+'</ol><div class="sv-leg"><span><i class="p"></i>yesterday</span><span><i></i>today’s jump</span></div>',
    a:[[SCR,'Screen delivery spikes']]},
   {c:'i',ic:'oi',k:'Futures buildup · 211 stocks',t:'COROMANDEL',v:'OI +91%',d:'+6.5%',sub:'Price and OI rising together: fresh buying.',
    viz:'<div class="sv-quad"><span class="q qu on"><small>Long buildup</small><b>64</b><em>COROMANDEL</em></span><span class="q qd"><small>Short buildup</small><b>44</b><em>COCHINSHIP</em></span><span class="q qu"><small>Short covering</small><b>75</b><em>RBLBANK</em></span><span class="q qd"><small>Long unwinding</small><b>28</b><em>ICICIBANK</em></span></div>',
    a:[[OS,'Open option chain']]}];
  var el=document.createElement('section');el.className='b-spot';el.setAttribute('aria-roledescription','carousel');el.setAttribute('aria-label','Spotlight');
  el.innerHTML='<div class="bs-h"><b>Spotlight</b><span class="bs-c" aria-live="polite">1 / '+S.length+'</span><span class="sp"></span><button type="button" class="bs-nav" data-d="-1" aria-label="Previous">\\u2039</button><button type="button" class="bs-nav" data-d="1" aria-label="Next">\\u203A</button></div>'+
    '<div class="bs-track">'+S.map(function(x,i){return '<article class="bs-s'+(i?'':' on')+'" aria-hidden="'+(i?'true':'false')+'"><div class="bs-kr"><span class="bs-ic '+x.c+'" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[x.ic]+'</svg></span><span class="bs-k">'+x.k+'</span></div><div class="bs-t"><b>'+x.t+'</b>'+(x.v?'<span class="v">'+x.v+'</span>':'')+(x.d?'<span class="d">'+x.d+'</span>':'')+'</div><p>'+x.sub+'</p><div class="bs-viz">'+x.viz+'</div>'+
      '<div class="bs-a">'+x.a.map(function(l,j){return '<a class="'+(j?'g':'p')+'" href="'+l[0]+'">'+l[1]+' \\u2192</a>'}).join('')+'</div></article>'}).join('')+'</div>'+
    '<div class="bs-dots" role="tablist">'+S.map(function(_,i){return '<button type="button" role="tab" aria-label="Item '+(i+1)+'"'+(i?'':' aria-selected="true"')+'></button>'}).join('')+'</div>';
  hg.appendChild(el);
  var cur=0,hold=false,sl=el.querySelectorAll('.bs-s'),dots=el.querySelectorAll('.bs-dots button');
  function go(n){cur=(n+S.length)%S.length;sl.forEach(function(s,i){s.classList.toggle('on',i===cur);s.setAttribute('aria-hidden',String(i!==cur))});dots.forEach(function(d,i){d.setAttribute('aria-selected',String(i===cur))});el.querySelector('.bs-c').textContent=(cur+1)+' / '+S.length}
  el.addEventListener('click',function(e){var b=e.target.closest('.bs-nav');if(b)go(cur+(+b.dataset.d));var d=e.target.closest('.bs-dots button');if(d)go([].indexOf.call(dots,d))});
  ['mouseenter','focusin'].forEach(function(t){el.addEventListener(t,function(){hold=true})});['mouseleave','focusout'].forEach(function(t){el.addEventListener(t,function(){hold=false})});
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(function(){if(!hold&&!document.hidden)go(cur+1)},5000);
}

addEventListener('DOMContentLoaded',function(){
  var cta=document.querySelector('.hero-main .home-cta');
  if(cta){var a=document.createElement('a');a.className='b-dash';a.href='idea-b-dashboard.html';a.innerHTML='DASH_ICON View your dashboard';cta.appendChild(a);
    var p=document.createElement('div');p.className='b-peek';p.setAttribute('aria-label','On your dashboard today');
    p.innerHTML='<a href="idea-b-dashboard.html#bk"><i>\\uD83E\\uDDFA</i><span>Baskets<b>Updated Momentum</b></span><em>+17.26%</em></a>'+
      '<a href="idea-b-dashboard.html#tc"><i class="b">\\uD83C\\uDFAF</i><span>Trade calls<b>2 active</b></span><em class="n">\\u2192</em></a>'+
      '<a href="idea-b-dashboard.html#fo"><i class="w">\\u23F1</i><span>Nifty expiry<b>Tue 17 Nov</b></span><em class="n">Max pain 25,100</em></a>'+
      '<a href="idea-b-journal.html"><i class="v">\\uD83D\\uDCD3</i><span>Trade journal<b>JWR% win rate</b></span><em>JNET</em></a>';
    var main=document.querySelector('.hero-main');
    var g=document.createElement('div');g.className='b-glance';g.setAttribute('aria-label','Today at a glance');
    g.innerHTML='<div><span>Nifty 50</span><b>25,255.05</b><em>\u25B2 0.84%</em></div><div><span>Bank Nifty</span><b>60,792.40</b><em>\u25B2 1.76%</em></div>'+
      '<div><span>India VIX</span><b>17.56</b><em class="w">\u25B2 0.77%</em></div><div><span>Market mood</span><b>62</b><em class="n">Optimistic</em></div>';
    cta.insertAdjacentElement('afterend',g);main.appendChild(p)}
  buildSpot();
});
</script>'''.replace('DASH_ICON', DASH_ICON)

# ---------------------------------------------------------------- Idea B: customisable dashboard
D_CSS = '''
/* Idea B dashboard: the same cards, chosen and arranged by the person. Masonry: cards keep their natural height. */
html.idea-dash .scan-cue{display:none!important}
html.idea-dash .hg>*:not(.dbar),html.idea-dash .hg-c .hero>*{opacity:0;transition:opacity .3s ease}html.idea-dash.dready .hg>*,html.idea-dash.dready .hg-c .hero>*{opacity:1}
@media (prefers-reduced-motion:reduce){html.idea-dash .hg>*{transition:none}}
html.idea-dash .hg{grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-areas:none!important;grid-auto-flow:row dense;grid-auto-rows:4px;row-gap:0!important;column-gap:20px;align-items:start}
html.idea-dash .hg>*,html.idea-dash .dw,html.idea-dash .hg-c .hero>*{min-width:0;align-self:start!important;justify-self:stretch}
html.idea-dash .hg-c,html.idea-dash .hg-c .hero{display:contents!important}

html.idea-dash .hg-ln{display:none!important}
html.idea-dash .hg-s{display:none!important}
html.idea-dash .hg-one .hl-grid{grid-template-columns:minmax(0,1fr)!important;gap:10px!important}
html.idea-dash .hg-fo .fo-ch{flex:none!important;height:120px!important;min-height:120px!important}
html.idea-dash .hero-side .ixc{flex:none!important}
html.idea-dash .hero-side .ixc>*:has(>svg),html.idea-dash .hero-side .ixc svg:only-child{flex:none!important;height:130px!important;min-height:130px!important}
html.idea-dash .hero-side .ixc-top,html.idea-dash .hero-side .ixc-val{flex-wrap:wrap!important;white-space:normal!important;row-gap:4px}
html.idea-dash .hero-side .ixc-rng{white-space:normal!important}
html.idea-dash .hg-one .hc-foot{flex-wrap:wrap!important;row-gap:10px!important}
html.idea-dash .dw svg{max-width:100%}
html.idea-dash .in,html.idea-dash .tc-body,html.idea-dash .hl-body,html.idea-dash .mvx-list{animation:none!important;opacity:1!important}
@media (max-width:1100px){html.idea-dash .hg{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media (max-width:640px){html.idea-dash .hg{grid-template-columns:minmax(0,1fr)!important}}
html.idea-dash .dw{display:flex!important;position:relative;flex-direction:column;contain:none!important;height:auto!important;min-height:0!important;align-self:start}
html.idea-dash .dw.off{display:none!important}
html.idea-dash .dw *{min-height:0}
html.idea-dash #hlBody,html.idea-dash .hl-body{flex:none!important;overflow:visible!important}
html.idea-dash .hero-main.dw,html.idea-dash .hero-side.dw{background:var(--surface-raised);border:1px solid var(--border-decorative);border-radius:12px;padding:16px 20px}
html.idea-dash .hg-tc .tc-more{display:grid!important;gap:8px}
html.idea-dash #scan.dw,html.idea-dash #happening.dw{margin:0!important;padding:18px 20px;border-radius:12px;background:var(--surface-raised);border:1px solid var(--border-decorative)}
html.idea-dash #scan .scan-g{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))!important}
html.idea-dash #happening .wh-g{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))!important}



/* title row */
.dbar{display:grid;gap:12px;padding:6px 2px 0}
.dbar-t{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.dbar .sub em{font-style:normal;color:var(--amber)}
.dbar{padding:4px 2px 0}.dbar-t{align-items:center;flex-wrap:nowrap}.dbar h2{font-size:21px;white-space:nowrap}.dbar .sub{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dbar .sp{display:none}
.dvw-k{font:600 10px/1 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary);padding-right:8px;margin-right:2px;border-right:1px solid var(--border-decorative)}
.dstreak{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 6px 0 12px;border-radius:9999px;background:linear-gradient(90deg,var(--fb-warning-soft),var(--fin-positive-soft));border:1px solid rgba(240,160,75,.35);font:500 12.5px/1 var(--font-sans);color:var(--text-secondary);white-space:nowrap}
.dstreak b{font:700 15px/1 var(--font-sans);color:var(--text-primary)}.dstreak .fl{font-size:14px}
.dstreak i{width:1px;height:16px;background:rgba(255,255,255,.14)}
.dstreak .g{color:var(--text-primary)}
.dstreak a{padding:6px 10px;border-radius:9999px;background:var(--action-primary);color:#fff!important;font:600 12px/1 var(--font-sans);text-decoration:none!important}
.dstreak .rk{padding-right:8px;color:var(--text-primary);font-weight:600}
.dback{font:600 13px/1 var(--font-sans);color:var(--link,#8FA3FF);text-decoration:none}.dback:hover{text-decoration:underline}
@media (max-width:1250px){.dstreak .t,.dstreak .g{display:none}}
.dlink{border:0;background:none;padding:0;font:600 12.5px/1 var(--font-sans);color:var(--link,#8FA3FF);cursor:pointer}.dlink:hover{text-decoration:underline}
.dviews{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dv-lab{font:600 10.5px/1 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary);margin-right:2px}
.dv-sep{width:1px;height:22px;background:var(--border-decorative);margin:0 6px}
.dv{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:9999px;border:1px solid var(--border-decorative);background:var(--surface-raised);color:var(--text-secondary);font:600 13px/1 var(--font-sans);cursor:pointer;white-space:nowrap}
.dv:hover{border-color:var(--surface-hover-stroke);color:var(--text-primary)}
.dv.on{background:var(--action-primary);border-color:var(--action-primary);color:#fff}
.dv.add{border-style:dashed;background:transparent}
.dvw{position:relative}
.dvw-b{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:10px;border:1px solid var(--border-decorative);background:var(--surface-raised);color:var(--text-primary);font:600 13.5px/1 var(--font-sans);cursor:pointer}
.dvw-b:hover,.dvw-b[aria-expanded=true]{border-color:var(--action-primary)}
.dvw-b span{font-size:11px;color:var(--text-tertiary)}
.dvw-m{position:absolute;z-index:75;top:44px;left:0;width:340px;padding:8px;border-radius:14px;background:var(--surface-elevated);border:1px solid var(--border-glass,rgba(255,255,255,.12));box-shadow:0 18px 40px rgba(0,0,0,.45)}
.dvw-m[hidden]{display:none}
.dvw-l{padding:8px 10px 4px;font:600 10.5px/1 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary)}
.dvw-m button[data-v]{display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;border:0;border-radius:10px;background:none;text-align:left;cursor:pointer;color:var(--text-primary)}
.dvw-m button[data-v]:hover{background:var(--surface-hover)}
.dvw-m button[aria-checked=true]{background:rgba(63,91,217,.18)}
.dvw-m .i{width:30px;height:30px;flex:none;display:grid;place-items:center;border-radius:9px;background:rgba(255,255,255,.06);font-size:15px}
.dvw-m button[data-v]>span:last-child{display:grid;min-width:0}.dvw-m b{font:600 13px/1.25 var(--font-sans)}.dvw-m small{font:400 11.5px/1.3 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dvw-c{display:flex;align-items:center}.dvw-c button[data-v]{flex:1}
.dvw-x{width:28px;height:28px;border:0;border-radius:8px;background:none;color:var(--text-tertiary);cursor:pointer}.dvw-x:hover{background:rgba(224,82,82,.2);color:var(--text-primary)}
.dvw-sep{height:1px;margin:6px 4px;background:var(--border-decorative)}
.dvw-new{width:100%;padding:10px;border:1px dashed var(--border-decorative);border-radius:10px;background:none;color:var(--link,#8FA3FF);font:600 13px/1 var(--font-sans);cursor:pointer}
.dvw-f{display:flex;gap:8px;padding:2px}.dvw-f .dv-in{flex:1;width:auto}.dvw-ok{height:34px;padding:0 14px;border:0;border-radius:9999px;background:var(--action-primary);color:#fff;font:600 13px/1 var(--font-sans);cursor:pointer}
.dp-w{display:grid;grid-template-columns:repeat(4,6px);gap:2px}.dp-w i{height:14px;border-radius:2px;background:rgba(255,255,255,.12)}
.dp-w.w1 i:nth-child(1),.dp-w.w2 i:nth-child(-n+2),.dp-w.w4 i{background:var(--teal)}
.dv-form{display:inline-flex;align-items:center;gap:8px}.dv-in{height:34px;width:180px;padding:0 12px;border-radius:9999px;border:1px solid var(--action-primary);background:var(--surface-raised);color:var(--text-primary);font:500 13px/1 var(--font-sans)}.dv-q{font:500 13px/1 var(--font-sans);color:var(--text-secondary)}
.dbar h2{margin:0;font:600 22px/1.2 var(--font-sans);letter-spacing:-.3px;color:var(--text-primary)}
.dbar .sub{font:400 13px/1.3 var(--font-sans);color:var(--text-tertiary)}
.dbar .sp{flex:1}
.dbar a{font:600 13px/1 var(--font-sans);color:var(--link,#8FA3FF);text-decoration:none}.dbar a:hover{text-decoration:underline}
/* floating customize button */
.dfab{position:fixed;right:24px;bottom:84px;z-index:70;display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 18px 0 16px;border-radius:9999px;border:0;background:var(--action-primary);color:#fff;font:600 14px/1 var(--font-sans);cursor:pointer;box-shadow:0 10px 26px rgba(63,91,217,.45)}
.dfab:hover{background:var(--action-hover,#3452C9)}
.dfab svg{width:18px;height:18px}
html.dedit .dfab{display:none}
/* side panel */
.dpanel{position:fixed;top:0;right:0;bottom:0;z-index:80;width:380px;max-width:92vw;display:flex;flex-direction:column;background:var(--surface-elevated);border-left:1px solid var(--border-glass,rgba(255,255,255,.12));box-shadow:-20px 0 40px rgba(0,0,0,.4);transform:translateX(100%);transition:transform .22s ease}
html.dedit .dpanel{transform:none}
@media (prefers-reduced-motion:reduce){.dpanel{transition:none}}
.dp-h{display:flex;align-items:center;gap:10px;padding:20px 20px 12px}
.dp-h h3{margin:0;flex:1;font:600 17px/1.2 var(--font-sans);color:var(--text-primary)}
.dp-x{width:32px;height:32px;border-radius:8px;border:0;background:rgba(255,255,255,.06);color:var(--text-secondary);font:600 14px/1 var(--font-sans);cursor:pointer}
.dp-x:hover{background:var(--surface-hover);color:var(--text-primary)}
.dp-p{margin:0 20px 12px;font:400 12.5px/1.45 var(--font-sans);color:var(--text-tertiary)}
.dp-list{list-style:none;margin:0;padding:0 12px;flex:1;overflow:auto;display:grid;gap:6px;align-content:start}
.dp-list li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;border:1px solid var(--border-decorative);background:var(--surface-raised)}
.dp-list li.off{opacity:.55}
.dp-list li.drag{opacity:.35}
.dp-list li.ov-b{box-shadow:0 -3px 0 0 var(--action-primary)}.dp-list li.ov-a{box-shadow:0 3px 0 0 var(--action-primary)}
.dp-grip{color:var(--text-tertiary);font-size:14px;letter-spacing:-2px}
.dp-nm{display:grid;min-width:0}.dp-nm b{font:600 13.5px/1.25 var(--font-sans);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dp-nm small{font:400 11.5px/1.3 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dp-sz{display:inline-flex;padding:2px;border-radius:9999px;background:rgba(255,255,255,.06)}
.dp-sz button{border:0;background:none;color:var(--text-secondary);font:600 11px/1 var(--font-sans);padding:5px 8px;border-radius:9999px;cursor:pointer}
.dp-sz button[aria-pressed=true]{background:var(--action-primary);color:#fff}
.dp-sw{position:relative;width:36px;height:20px;border-radius:9999px;border:0;background:rgba(255,255,255,.14);cursor:pointer;flex:none}
.dp-sw::after{content:"";position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s}
.dp-sw[aria-checked=true]{background:var(--teal)}.dp-sw[aria-checked=true]::after{transform:translateX(16px)}
.dp-f{display:flex;gap:10px;padding:14px 20px 20px;border-top:1px solid var(--border-decorative)}
.dp-f button{flex:1;height:40px;border-radius:10px;border:1px solid var(--border-decorative);background:var(--surface-raised);color:var(--text-primary);font:600 13px/1 var(--font-sans);cursor:pointer}
.dp-f button.p{background:var(--action-primary);border-color:var(--action-primary);color:#fff}
/* edit mode on the grid itself: cards can be dragged directly */
html.dedit .hg{padding-right:0}
html.dedit .dw{outline:1px dashed rgba(143,163,255,.5);outline-offset:3px}
html.dedit .dw>*:not(.dc-x){pointer-events:none;user-select:none}
html.dedit .dw.drag{opacity:.3}
html.dedit .dw.ov-b{box-shadow:-5px 0 0 0 var(--action-primary)}html.dedit .dw.ov-a{box-shadow:5px 0 0 0 var(--action-primary)}
html.dedit .dw.ov-t{box-shadow:0 -5px 0 0 var(--action-primary)}html.dedit .dw.ov-d{box-shadow:0 5px 0 0 var(--action-primary)}
html.dedit .hg-s{display:none!important}
html.dedit .dw::before{content:attr(data-name);position:absolute;z-index:5;top:-12px;left:14px;padding:5px 9px;border-radius:8px;background:var(--surface-elevated);border:1px solid var(--border-glass,rgba(255,255,255,.12));font:600 11.5px/1 var(--font-sans);color:var(--text-primary);pointer-events:none}
@media (max-width:1100px){html.dedit .hg{padding-right:0}}
.dctl{display:none}
html.dedit .dctl-unused{display:flex;position:absolute;z-index:6;top:-14px;right:12px;align-items:center;gap:4px;padding:3px;border-radius:9999px;background:var(--surface-elevated);border:1px solid var(--border-glass,rgba(255,255,255,.14));box-shadow:0 6px 16px rgba(0,0,0,.35)}
.dc-sz{display:inline-flex}
.dc-sz button{border:0;background:none;color:var(--text-secondary);font:600 11px/1 var(--font-sans);width:26px;height:24px;border-radius:9999px;cursor:pointer}
.dc-sz button[aria-pressed=true]{background:var(--action-primary);color:#fff}
.dc-sz button:hover{color:var(--text-primary)}
.dc-x{display:none}
html.dedit .dc-x{display:grid;place-items:center;position:absolute;z-index:6;top:-12px;right:12px;border:1px solid var(--border-glass,rgba(255,255,255,.14));width:26px;height:26px;border-radius:50%;background:var(--surface-elevated);color:var(--text-secondary);font:600 11px/1 var(--font-sans);cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.35)}
.dc-x:hover{background:rgba(224,82,82,.25);color:var(--text-primary)}
'''

GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'

D_JS = '''<script>
document.documentElement.classList.add('idea-dash');
addEventListener('DOMContentLoaded',function(){
  var $=function(s,r){return (r||document).querySelector(s)},root=document.documentElement;
  var hg=$('.hg');if(!hg)return;
  ['#scan','#happening'].forEach(function(s){var e=$(s);if(e)hg.appendChild(e)});
  var W=[
    {id:'sd',  sel:'.hg-sd',     name:'Stock of the day',             note:'Fresh 52-week high, picked on technicals'},
    {id:'gm',  sel:'.hero-main', name:'Good morning',                 note:'Date, today’s driver, brief and audio'},
    {id:'tc',  sel:'.hg-tc',     name:'Trade calls',                  note:'Legs, levels, potential left, payoff'},
    {id:'mk',  sel:'.hero-side', name:'Markets',                      note:'Index chart, nine NSE indices'},
    {id:'fo',  sel:'.hg-fo',     name:'F&O levels · Option chain', note:'Support, max pain, resistance, OI by strike'},
    {id:'tl',  sel:'.hg-tl',     name:'Today',                        note:'Market hours and events'},
    {id:'one', sel:'.hg-one',    name:'Learning',                     note:'One idea at a time'},
    {id:'dl',  sel:'.hg-dl',     name:'Movers · OI buildup',     note:'Nifty 100, sectors, OI buildup'},
    {id:'bk',  sel:'.hg-bk',     name:'Baskets',                      note:'Marketplace baskets and returns'},
    {id:'jr',  sel:'#journal',   name:'Trade journal',                note:'Your trades, stats and insights (sample)'},
    {id:'scan',sel:'#scan',      name:'Market scan · Screener',  note:'Volume, delivery, 20-day highs and lows'},
    {id:'wh',  sel:'#happening', name:'What’s happening',        note:'Company filings in three groups'}];
  W.forEach(function(w){w.el=$(w.sel)});W=W.filter(function(w){return w.el});
  function byId(id){return W.filter(function(w){return w.id===id})[0]}
  /* Each preset fixes the order and width of every card. People choose only what is shown;
     we decide where it goes, so the layout never breaks. Cards not in the preset can be added; they join at the end at their default width. */
  var DEF_SIZE={sd:2,gm:1,tc:1,mk:1,fo:1,tl:1,one:1,dl:2,bk:2,jr:4,scan:4,wh:4};
  var PRESETS=[
    {id:'basic',  name:'Basic',          icon:'☀️', note:'A calm start: today, the pick, calls and levels',
     cards:[['sd',2],['gm',1],['tc',1],['mk',1],['dl',2],['fo',1],['tl',1],['one',1],['bk',2],['jr',4],['scan',4],['wh',4]],on:['sd','gm','tc','mk','dl','fo','tl','one','bk']},
    {id:'options',name:'Options trader', icon:'\\uD83C\\uDFAF', note:'Calls, levels and OI up front, then your journal',
     cards:[['tc',1],['dl',2],['mk',1],['tl',1],['sd',2],['fo',1],['jr',4],['scan',4],['gm',1],['one',1],['bk',2],['wh',4]],on:['tc','dl','mk','tl','sd','fo','jr']},
    {id:'picker', name:'Stock picker',   icon:'\\uD83D\\uDD0D', note:'The pick, scans, movers and filings',
     cards:[['sd',2],['mk',1],['tl',1],['dl',2],['bk',2],['fo',1],['scan',4],['wh',4],['gm',1],['tc',1],['one',1],['jr',4]],on:['sd','mk','tl','dl','bk','fo','scan','wh']},
    {id:'investor',name:'Investor',      icon:'\\uD83C\\uDF31', note:'Baskets, the big picture and filings',
     cards:[['gm',1],['one',1],['mk',1],['sd',2],['bk',2],['tl',1],['wh',4],['tc',1],['fo',1],['dl',2],['jr',4],['scan',4]],on:['gm','one','mk','sd','bk','tl','wh']},
    {id:'learner',name:'Learner',        icon:'\\uD83D\\uDCDA', note:'Brief, one idea a day and the calendar',
     cards:[['gm',1],['one',1],['sd',2],['tl',1],['mk',1],['bk',2],['tc',1],['fo',1],['dl',2],['jr',4],['scan',4],['wh',4]],on:['gm','one','sd','tl','mk','bk']}];
  var ALL=W.map(function(w){return w.id});
  function presetById(id){return PRESETS.filter(function(p){return p.id===id})[0]}
  var KEY='ap-dash-v4',S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  if(!S||!S.on)S={active:'basic',on:{},custom:[]};
  function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
  function base(){var p=presetById(S.active);if(p)return p;var c=S.custom.filter(function(x){return x.id===S.active})[0];return c?presetById(c.base)||PRESETS[0]:PRESETS[0]}
  function onList(){var o=S.on[S.active];return o?o.slice():base().on.slice()}
  function setOnList(l){S.on[S.active]=l;save()}
  function order(){var b=base(),ids=b.cards.map(function(c){return c[0]});return ids.concat(ALL.filter(function(i){return ids.indexOf(i)<0}))}
  function sizeOf(id){var c=base().cards.filter(function(x){return x[0]===id})[0];return c?c[1]:DEF_SIZE[id]||1}
  function edited(){var p=presetById(S.active);return p&&S.on[S.active]&&S.on[S.active].slice().sort().join()!==p.on.slice().sort().join()}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function viewName(){var p=presetById(S.active);if(p)return p.icon+' '+p.name;var c=S.custom.filter(function(x){return x.id===S.active})[0];return '⭐ '+(c?esc(c.name):'My view')}
  /* title row with a view dropdown */
  var bar=document.createElement('div');bar.className='dbar';$('.hg-s').insertAdjacentElement('afterend',bar);
  function renderBar(){var p=presetById(S.active);
    bar.innerHTML='<div class="dbar-t"><h2>Your dashboard</h2><div class="dvw"><button type="button" class="dvw-b" aria-haspopup="menu" aria-expanded="false"><span class="dvw-k">Screen</span>'+viewName()+'<span aria-hidden="true">▾</span></button><div class="dvw-m" role="menu" hidden></div></div>'+
      '<span class="sub">'+(p?esc(p.note):'Your own view')+(edited()?' · <em>edited</em> <button type="button" class="dlink" data-act="reset">Reset</button>':'')+'</span><span class="sp"></span>'+streak()+'<a class="dback" href="idea-b.html">← Today</a></div>'}
  /* the full streak strip belongs to the landing page; here it shrinks to one pill */
  function streak(){var st=$('.stk-strip');if(!st)return '';var n=((($('.ss-n',st)||{}).textContent||'').match(/\\d+/)||[''])[0];
    var g=(($('.stk-goal',st)||{}).textContent||'').replace(/Learn.*$/,'').replace(/[·\\s]+$/,'').trim(),rk=(($('.lb-pill',st)||{}).textContent||'').replace(/\\s+/g,' ').trim();
    return '<div class="dstreak" aria-label="Your streak"><span class="fl" aria-hidden="true">🔥</span><b>'+esc(n)+'</b><span class="t">day streak</span><i></i><span class="g">'+esc(g)+'</span><a href="today-demo-2026-11-12.html#learn">Learn →</a><i></i><span class="rk">'+esc(rk)+'</span></div>'}
  function renderMenu(form){var m=$('.dvw-m',bar),cust=S.custom;
    m.innerHTML='<div class="dvw-l">Preset views</div>'+PRESETS.map(function(p){return '<button type="button" role="menuitemradio" aria-checked="'+(S.active===p.id)+'" data-v="'+p.id+'"><span class="i">'+p.icon+'</span><span><b>'+p.name+'</b><small>'+esc(p.note)+'</small></span></button>'}).join('')+
      (cust.length?'<div class="dvw-l">My views</div>'+cust.map(function(c){return '<div class="dvw-c"><button type="button" role="menuitemradio" aria-checked="'+(S.active===c.id)+'" data-v="'+c.id+'"><span class="i">⭐</span><span><b>'+esc(c.name)+'</b><small>Based on '+esc((presetById(c.base)||PRESETS[0]).name)+'</small></span></button><button type="button" class="dvw-x" data-del="'+c.id+'" aria-label="Delete '+esc(c.name)+'">✕</button></div>'}).join(''):'')+
      '<div class="dvw-sep"></div>'+(form?'<div class="dvw-f"><input class="dv-in" maxlength="30" aria-label="View name" value="My view '+(cust.length+1)+'"><button type="button" class="dvw-ok" data-act="ok">Save</button></div>':'<button type="button" class="dvw-new" data-act="new">+ Save current as a view</button>');
    var i=$('.dv-in',m);if(i){i.focus();i.select();i.addEventListener('keydown',function(e){if(e.key==='Enter')$('[data-act=ok]',m).click()})}}
  function menu(o){var m=$('.dvw-m',bar),b=$('.dvw-b',bar);if(!m)return;m.hidden=!o;b.setAttribute('aria-expanded',String(o));if(o)renderMenu(false)}
  bar.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
    if(t.classList.contains('dvw-b')){menu($('.dvw-m',bar).hidden);return}
    if(t.dataset.v){S.active=t.dataset.v;save();menu(false);renderBar();layout(true);if(open_)renderList();return}
    if(t.dataset.del){S.custom=S.custom.filter(function(x){return x.id!==t.dataset.del});delete S.on[t.dataset.del];if(S.active===t.dataset.del)S.active='basic';save();renderBar();layout(true);menu(true);return}
    var a=t.dataset.act;
    if(a==='new'){renderMenu(true);return}
    if(a==='ok'){var n=($('.dv-in',bar).value||'').trim().slice(0,30);if(!n)return;var id='c'+Date.now();S.custom.push({id:id,name:n,base:base().id});S.on[id]=onList();S.active=id;save();menu(false);renderBar();layout(true);if(open_)renderList();return}
    if(a==='reset'){delete S.on[S.active];save();renderBar();layout(true);if(open_)renderList()}});
  document.addEventListener('mousedown',function(e){var m=$('.dvw-m',bar);if(m&&!m.hidden&&!e.target.closest('.dvw'))menu(false)});
  /* floating button + side panel: show or hide cards only */
  var fab=document.createElement('button');fab.type='button';fab.className='dfab';fab.innerHTML='GEAR Customize';fab.setAttribute('aria-haspopup','dialog');document.body.appendChild(fab);
  var pn=document.createElement('aside');pn.className='dpanel';pn.setAttribute('role','dialog');pn.setAttribute('aria-label','Customize dashboard');
  pn.innerHTML='<div class="dp-h"><h3>Customize dashboard</h3><button class="dp-x" type="button" aria-label="Close">✕</button></div>'+
    '<p class="dp-p">Choose what this view shows. We place each card for you, so the layout always stays neat. Remove a card and the rest move up.</p><ul class="dp-list"></ul>'+
    '<div class="dp-f"><button type="button" class="dp-save">Save as a view</button><button type="button" class="p dp-done">Done</button></div>';
  document.body.appendChild(pn);var list=$('.dp-list',pn),open_=false;
  function open(o){open_=o;root.classList.toggle('dedit',o);if(o)renderList();setTimeout(function(){layout(true)},260)}
  fab.onclick=function(e){e.stopPropagation();open(true)};
  $('.dp-x',pn).onclick=$('.dp-done',pn).onclick=function(){open(false)};
  $('.dp-save',pn).onclick=function(){open(false);menu(true);renderMenu(true)};
  document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var m=$('.dvw-m',bar);if(m&&!m.hidden){menu(false);return}if(open_)open(false)});
  document.addEventListener('mousedown',function(e){if(!open_)return;if(pn.contains(e.target)||e.target.closest('.dw')||e.target.closest('.dbar'))return;open(false)});
  function renderList(){var on=onList();list.innerHTML=order().map(function(id){var w=byId(id);if(!w)return '';var v=on.indexOf(id)>=0;
      return '<li class="'+(v?'':'off')+'"><span class="dp-w w'+sizeOf(id)+'" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="dp-nm"><b>'+w.name+'</b><small>'+w.note+'</small></span>'+
        '<button type="button" class="dp-sw" role="switch" aria-checked="'+v+'" data-id="'+id+'" aria-label="Show '+w.name+'"></button></li>'}).join('')}
  function setOn(id,v){var l=onList(),i=l.indexOf(id);if(v&&i<0)l.push(id);if(!v&&i>=0)l.splice(i,1);setOnList(l);renderBar();layout(true);if(open_)renderList()}
  list.addEventListener('click',function(e){var b=e.target.closest('.dp-sw');if(b)setOn(b.dataset.id,b.getAttribute('aria-checked')!=='true')});
  W.forEach(function(w){var el=w.el;el.classList.add('dw');el.dataset.dw=w.id;el.dataset.name=w.name;
    var x=document.createElement('button');x.type='button';x.className='dc-x';x.setAttribute('aria-label','Remove '+w.name);x.textContent='✕';
    x.addEventListener('click',function(e){e.stopPropagation();setOn(w.id,false)});el.insertBefore(x,el.firstChild)});
  /* placement: masonry into the shortest column, smaller cards fill gaps before a wide card drops in.
     Heights only grow during a visit, so rotating content (Learning, Trade calls, Movers) never makes the layout jump. */
  var lastCols=0,busyUntil=0;
  function cols(){return innerWidth<=640?1:innerWidth<=1100?2:4}
  function layout(force){var C=cols();lastCols=C;busyUntil=performance.now()+400;
    var on=onList(),ids=order().filter(function(id){return on.indexOf(id)>=0});
    W.forEach(function(w){var v=ids.indexOf(w.id)>=0;w.el.classList.toggle('off',!v)});
    if(force)lockRot();
    function rows(h){return Math.max(1,Math.ceil((h+20)/4))}
    function measure(it,s){it.w.el.style.setProperty('grid-column','1 / span '+s,'important');it.w.el.style.removeProperty('grid-row');it.w.el.style.removeProperty('min-height');return it.w.el.getBoundingClientRect().height}
    var items=ids.map(function(id){var w=byId(id),it={w:w,s:Math.min(sizeOf(id),C)};it.h=measure(it,it.s);it.r=rows(it.h);
      if(it.s===1&&C>=2){it.h2=measure(it,2);it.r2=rows(it.h2);measure(it,1)}return it});
    var head=[$('.hg-s'),bar].filter(function(el){return el&&getComputedStyle(el).display!=='none'}),y0=0;
    head.forEach(function(el){var r=rows(el.getBoundingClientRect().height)-(el===bar?1:0);el.style.setProperty('grid-column','1 / -1','important');el.style.setProperty('grid-row',(y0+1)+' / span '+r,'important');y0+=r});
    /* pack one ordering on paper: shortest-column masonry, then widen a single card into an empty neighbour column */
    function pack(seq,commit){var H=[],last=[],pl=[],gaps=0;for(var c=0;c<C;c++){H.push(y0);last.push(null)}
      function fit(s){var best=null;for(var c=0;c+s<=C;c++){var t=Math.max.apply(null,H.slice(c,c+s));if(!best||t<best.t)best={c:c,t:t}}return best}
      function put(it,s,r){var f=fit(s),p={it:it,c:f.c,t:f.t,s:s,r:r,grow:0};for(var c=f.c;c<f.c+s;c++){gaps+=f.t-H[c];H[c]=f.t+r;last[c]=p}pl.push(p);return p}
      function settle(){for(var c=0;c<C;c++){var p=last[c];if(!p||p.s!==1||p.c!==c||!p.it.r2)continue;
          for(var n of [c+1,c-1]){if(n<0||n>=C||last[n]===p||H[n]>p.t+2)continue;var nc=Math.min(c,n);gaps-=p.t-H[n]>0?0:0;p.s=2;p.c=nc;p.r=p.it.r2;H[c]=H[n]=p.t+p.r;last[c]=last[n]=p;break}}}
      var band=[],grown=0;
      function equalize(B){var seen=[];for(var c=0;c<C;c++){var p=last[c];if(!p||seen.indexOf(p)>=0)continue;seen.push(p);var ok=true;for(var k=p.c;k<p.c+p.s;k++)if(last[k]!==p||H[k]!==H[p.c])ok=false;if(!ok)continue;
          var g=B-(p.t+p.r);if(g>0&&g*4<=240){p.grow=(p.grow||0)+g;p.r+=g;grown+=g*p.s;for(var k=p.c;k<p.c+p.s;k++)H[k]=B}}}
      function flush(){band.forEach(function(it){put(it,it.s,it.r)});band=[];settle()}
      seq.forEach(function(it){if(it.s>=C){flush();var B=Math.max.apply(null,H);equalize(B);for(var c=0;c<C;c++){gaps+=B-H[c];H[c]=B}put(it,it.s,it.r);for(var c=0;c<C;c++)last[c]=null}else band.push(it)});flush();
      var E=Math.max.apply(null,H);equalize(E);var rag=0;for(var c=0;c<C;c++)rag+=E-H[c];
      return {pl:pl,H:H,last:last,score:gaps+rag*0.8+grown*0.35+E*0.02}}
    /* try the orders of the smaller cards (the preset's lead card stays first, full-width cards stay last) and keep the tightest */
    var lead=items[0],small=items.slice(1).filter(function(i){return i.s<C}),wide=items.filter(function(i){return i!==lead&&i.s>=C});
    var best=pack(items),n=small.length,tries=0;
    if(C>1&&n>1&&n<=8){var a=small.slice(),cnt=[];for(var i=0;i<n;i++)cnt.push(0);
      var test=function(){tries++;var r=pack([lead].concat(a,wide));if(r.score<best.score)best=r};test();
      var i=0;while(i<n){if(cnt[i]<i){var k=i%2?cnt[i]:0,tmp=a[k];a[k]=a[i];a[i]=tmp;test();cnt[i]++;i=0}else{cnt[i]=0;i++}}}
    /* commit; cards that grew to close a gap get a matching min-height */
    best.pl.forEach(function(p){p.minH=p.grow?p.r*4-20:0});
    best.pl.forEach(function(p){var el=p.it.w.el;el.style.setProperty('grid-column',(p.c+1)+' / span '+p.s,'important');el.style.setProperty('grid-row',(p.t+1)+' / span '+p.r,'important');
      if(p.minH)el.style.setProperty('min-height',p.minH+'px','important');else el.style.removeProperty('min-height')});
  }
  /* rotating cards are locked to their tallest state, so their height never changes while they rotate */
  function lockRot(){try{if(window.tcLock)tcLock()}catch(e){}try{if(window.lockMvx)lockMvx()}catch(e){}
    try{var b=$('#hlBody');if(b&&typeof hlShow==='function'&&typeof LEARN!=='undefined'){var k=(typeof hi!=='undefined'?hi:0),m=0;b.style.minHeight='';for(var i=0;i<LEARN.length;i++){hlShow(i,false);m=Math.max(m,b.offsetHeight)}b.style.minHeight=m+'px';hlShow(k,false)}}catch(e){}}
  var lastH={},ro=window.ResizeObserver?new ResizeObserver(function(es){if(performance.now()<busyUntil){es.forEach(function(e){lastH[e.target.dataset.dw]=Math.round(e.target.getBoundingClientRect().height)});return}var ch=es.some(function(e){var h=Math.round(e.target.getBoundingClientRect().height),k=e.target.dataset.dw;if(lastH[k]===h)return false;lastH[k]=h;return true});if(ch){clearTimeout(window._dl);window._dl=setTimeout(function(){layout(false)},80)}}):null;
  renderBar();layout(true);if(ro)W.forEach(function(w){ro.observe(w.el)});
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){layout(true)},120)});
  setTimeout(function(){layout(false)},500);setTimeout(function(){layout(false);root.classList.add('dready')},900);setTimeout(function(){layout(false)},1600);
  var h=location.hash.slice(1),t=h&&byId(h);if(t){if(onList().indexOf(h)<0)setOn(h,true);
    setTimeout(function(){t.el.scrollIntoView({block:'center'});t.el.animate&&t.el.animate([{boxShadow:'0 0 0 3px rgba(63,91,217,.7)'},{boxShadow:'0 0 0 0 rgba(63,91,217,0)'}],{duration:1600})},600)}
});
</script>'''.replace('GEAR', GEAR)


# ---------------------------------------------------------------- Trade journal (dashboard card)
J_CSS = '''
/* Trade journal card */
#journal{padding:20px 22px;border-radius:12px;background:var(--surface-raised);border:1px solid var(--border-decorative)}.jr-body{display:flex;flex-direction:column;gap:16px}
.jr-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.jr-h h3{margin:0;font:600 17px/1.2 var(--font-sans);color:var(--text-primary)}
.jr-chip{font:600 11px/1 var(--font-sans);padding:5px 9px;border-radius:9999px;background:var(--fb-warning-soft);color:var(--text-primary);box-shadow:inset 0 0 0 1px rgba(240,160,75,.4)}
.jr-h .sp{flex:1}
.jr-todo{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:9px;background:var(--fb-warning-soft);box-shadow:inset 0 0 0 1px rgba(240,160,75,.45);color:var(--text-primary)!important;font:600 12.5px/1 var(--font-sans);text-decoration:none}.jr-todo:hover{background:rgba(240,160,75,.2)}
.jr-open{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:9px;background:var(--action-primary);color:#fff!important;font:600 12.5px/1 var(--font-sans);text-decoration:none}.jr-open:hover{background:var(--action-hover,#3452C9)}
.jr-h .who{font:500 12.5px/1.3 var(--font-sans);color:var(--text-secondary)}.jr-h .who b{color:var(--text-primary)}
.jr-link{border:0;background:none;padding:0;font:600 12.5px/1 var(--font-sans);color:var(--link,#8FA3FF);cursor:pointer}
.jr-link:hover{text-decoration:underline}
.jr-empty{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:28px;align-items:center;padding:8px 4px}
.jr-empty h4{margin:0 0 8px;font:600 22px/1.25 var(--font-sans);letter-spacing:-.3px;color:var(--text-primary)}
.jr-empty p{margin:0 0 10px;font:400 14px/1.55 var(--font-sans);color:var(--text-secondary)}
.jr-safe{display:flex;gap:8px;align-items:flex-start;font:400 12.5px/1.45 var(--font-sans);color:var(--text-tertiary)}.jr-safe b{color:var(--text-secondary)}
.jr-brokers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.jr-brokers button{display:flex;align-items:center;gap:10px;padding:12px;border-radius:12px;border:1px solid var(--border-decorative);background:var(--surface-glass);color:var(--text-primary);font:600 13.5px/1.2 var(--font-sans);cursor:pointer;text-align:left}
.jr-brokers button:hover{border-color:var(--surface-hover-stroke);background:var(--surface-hover)}
.jr-brokers i{width:32px;height:32px;flex:none;border-radius:9px;display:grid;place-items:center;background:var(--surface-hover);font:700 12px/1 var(--font-sans);font-style:normal;color:var(--text-primary)}
.jr-brokers small{display:block;font:400 11px/1.3 var(--font-sans);color:var(--text-tertiary)}
.jr-busy{display:flex;align-items:center;justify-content:center;gap:12px;padding:46px 0;font:500 14px/1.4 var(--font-sans);color:var(--text-secondary)}
.jr-spin{width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,.15);border-top-color:var(--teal);animation:jrSpin .8s linear infinite}
@keyframes jrSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.jr-spin{animation:none}}
.jr-kpi{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
.jr-kpi div{padding:10px 12px;border-radius:12px;background:var(--surface-glass);border:1px solid var(--border-decorative);min-width:0}
.jr-kpi span{display:block;font:500 11px/1.2 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jr-kpi b{display:block;margin-top:4px;font:600 19px/1.1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary);white-space:nowrap}
.jr-kpi small{display:block;margin-top:2px;font:400 11px/1.2 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jr-up{color:var(--teal)!important}.jr-dn{color:var(--slate-500,#7B8799)!important}
.jr-mid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px}
.jr-curve{position:relative;padding:12px 14px;border-radius:12px;background:var(--surface-glass);border:1px solid var(--border-decorative)}
.jr-curve .t{display:flex;justify-content:space-between;font:500 12px/1.2 var(--font-sans);color:var(--text-tertiary);margin-bottom:6px}
.jr-curve svg{display:block;width:100%;height:150px}
.jr-curve .zero{stroke:var(--text-tertiary);stroke-dasharray:3 4;opacity:.6}
.jr-curve .ln{fill:none;stroke:var(--teal);stroke-width:2.2;stroke-linejoin:round}
.jr-curve .bar-u{fill:rgba(0,201,154,.55)}.jr-curve .bar-d{fill:rgba(123,135,153,.55)}
.jr-ins{display:grid;gap:8px;align-content:start}
.jr-ins h4,.jr-tbl h4{margin:0 0 2px;font:600 11px/1.2 var(--font-sans);letter-spacing:1.1px;text-transform:uppercase;color:var(--text-tertiary)}
.jr-ins li{list-style:none;display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;padding:10px 12px;border-radius:10px;background:var(--surface-glass);border-left:3px solid var(--blue);font:400 13px/1.45 var(--font-sans);color:var(--text-secondary)}
.jr-ins li.w{border-left-color:var(--amber)}.jr-ins li.g{border-left-color:var(--teal)}
.jr-ins li b{color:var(--text-primary);font-weight:600}
.jr-ins li>i{font-style:normal;font-size:15px;line-height:1.3}
.jr-ins ul{margin:0;padding:0;display:grid;gap:8px}
.jr-tbl{overflow:auto;max-height:300px;border-radius:12px;border:1px solid var(--border-decorative)}
.jr-tbl h4{padding:12px 14px 0}
.jr-tbl table{width:100%;border-collapse:collapse;font:500 12.5px/1.3 var(--font-sans);font-variant-numeric:tabular-nums}
.jr-tbl th{position:sticky;top:0;background:var(--surface-elevated);text-align:left;font:500 11px/1.2 var(--font-sans);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.5px;padding:9px 12px;border-bottom:1px solid var(--border-decorative)}
.jr-tbl td{padding:8px 12px;border-bottom:1px solid var(--border-decorative);color:var(--text-secondary);white-space:nowrap}
.jr-tbl td.n,.jr-tbl th.n{text-align:right}
.jr-tbl td b{color:var(--text-primary);font-weight:600}
.jr-tbl tr:hover td{background:var(--surface-hover)}
.jr-tag{font:600 10px/1 var(--font-sans);padding:3px 6px;border-radius:6px;background:var(--surface-hover);color:var(--text-secondary)}
.jr-tag.flag{background:var(--fb-warning-soft);color:var(--text-primary)}
.jr-note{margin:0;font:400 11.5px/1.4 var(--font-sans);color:var(--text-tertiary)}
@container (max-width:900px){.jr-kpi{grid-template-columns:repeat(3,minmax(0,1fr))}.jr-mid,.jr-empty{grid-template-columns:minmax(0,1fr)}}
@container (max-width:520px){.jr-kpi{grid-template-columns:repeat(2,minmax(0,1fr))}.jr-brokers{grid-template-columns:repeat(2,minmax(0,1fr))}}
#journal{container-type:inline-size}
'''

J_JS = r'''<script>
addEventListener('DOMContentLoaded',function(){
  var hg=document.querySelector('.hg');if(!hg)return;
  var host=document.createElement('section');host.id='journal';host.setAttribute('aria-labelledby','jrH');hg.appendChild(host);var card=document.createElement('div');card.className='jr-body';host.appendChild(card);
  var BROKERS=[['ZE','Zerodha','Kite'],['UP','Upstox',''],['AN','Angel One','SmartAPI'],['DH','Dhan',''],['FY','Fyers',''],['IC','ICICI Direct','Breeze']];
  /* Sample trades for the prototype: date, minutes held, symbol, kind, side, qty, entry, exit */
  var JDA=window.JD||[],LM=JDA.length?JDA[JDA.length-1].d.slice(0,7):'';
  var tr=JDA.filter(function(t){return t.d.slice(0,7)===LM}).map(function(t){return {d:t.d,hold:t.held,sym:t.sym,kind:t.kind,side:t.side,qty:t.qty,en:t.en,ex:t.ex,pnl:t.pnl}});
  var KEY='ap-journal-v1',st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
  var inr=function(v){var s=Math.abs(v).toLocaleString('en-IN');return (v<0?'−':v>0?'+':'')+'₹'+s};
  var day=function(d){return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d+'T12:00:00').getDay()]};
  var hrs=function(m){return m>=1440?Math.round(m/1440)+'d':m>=60?(m/60).toFixed(1).replace('.0','')+'h':m+'m'};
  function head(extra){return '<div class="jr-h"><h3 id="jrH">Trade journal</h3><span class="jr-chip">Sample journal</span><span class="sp"></span>'+(extra||'')+'<a class="jr-open" href="idea-b-journal.html">Open full journal \u2192</a></div>'}
  function empty(){card.innerHTML=head()+'<div class="jr-empty"><div><h4>See what your trades are telling you.</h4><p>Connect your broker and every trade is pulled in automatically: options, futures and stocks. AlphaPad works out your win rate, what you hold too long, and the habits that cost you money.</p>'+
    '<div class="jr-safe"><span aria-hidden="true">🔒</span><span><b>Read-only.</b> We read your trade history. We can never place orders or move money, and you can disconnect at any time.</span></div></div>'+
    '<div class="jr-brokers" role="group" aria-label="Choose your broker">'+BROKERS.map(function(b){return '<button type="button" data-b="'+b[1]+'"><i>'+b[0]+'</i><span>'+b[1]+(b[2]?'<small>'+b[2]+'</small>':'')+'</span></button>'}).join('')+'</div></div>'}
  function busy(b){card.innerHTML=head()+'<div class="jr-busy" role="status"><span class="jr-spin" aria-hidden="true"></span>Connecting to '+b+' and fetching your trades…</div>'}
  function stats(){var w=tr.filter(function(t){return t.pnl>0}),l=tr.filter(function(t){return t.pnl<0});
    var sum=function(a){return a.reduce(function(s,t){return s+t.pnl},0)},gw=sum(w),gl=-sum(l);
    return {net:gw-gl,n:tr.length,wr:Math.round(w.length/tr.length*100),pf:(gw/gl),aw:Math.round(gw/w.length),al:Math.round(gl/l.length),
      best:tr.reduce(function(a,t){return t.pnl>a.pnl?t:a}),worst:tr.reduce(function(a,t){return t.pnl<a.pnl?t:a}),w:w,l:l}}
  function insights(s){var out=[];
    var opt=tr.filter(function(t){return t.kind==='Option'}),ow=opt.filter(function(t){return t.pnl>0}),ol=opt.filter(function(t){return t.pnl<0});
    var avg=function(a){return a.reduce(function(x,t){return x+t.hold},0)/a.length};
    if(ow.length&&ol.length){var r=avg(ol)/avg(ow);if(r>1.3)out.push(['w','⏳','You hold losing option trades <b>'+r.toFixed(1)+'× longer</b> than winners ('+hrs(Math.round(avg(ol)))+' vs '+hrs(Math.round(avg(ow)))+'). A time stop could cut the bleed.'])}
    var by={};tr.forEach(function(t){var k=day(t.d);by[k]=(by[k]||0)+t.pnl});var wd=Object.keys(by).sort(function(a,b){return by[a]-by[b]})[0];
    var FULL={Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday'};if(by[wd]<0)out.push(['w','📅','<b>'+FULL[wd]+'s cost you '+inr(by[wd])+'</b> this month, your weakest day of the week. Consider trading smaller on '+FULL[wd]+'s.']);
    var rev=0;tr.forEach(function(t,i){var p=tr[i-1];if(p&&p.d===t.d&&p.pnl<0&&p.sym.split(' ')[0]===t.sym.split(' ')[0])rev++});
    if(rev)out.push(['w','🔁','<b>'+rev+' revenge trade'+(rev>1?'s':'')+'</b>: re-entering the same underlying right after a loss. '+(rev>1?'Each one':'It')+' lost money.']);
    var eq=tr.filter(function(t){return t.kind==='Equity'}),eqp=eq.reduce(function(x,t){return x+t.pnl},0),op=opt.reduce(function(x,t){return x+t.pnl},0);
    var ewr=Math.round(eq.filter(function(t){return t.pnl>0}).length/eq.length*100),owr=Math.round(ow.length/opt.length*100);
    out.push([eqp>op?'g':'i','📊','Stocks: <b>'+inr(eqp)+'</b> at '+ewr+'% wins. Options: <b>'+inr(op)+'</b> at '+owr+'% wins. '+(eqp>op?'Your edge is in stocks so far.':'Options are carrying your P&L.')]);
    return out.slice(0,4)}
  function curve(){var W=600,H=150,P=8,c=0,pts=tr.map(function(t){c+=t.pnl;return c}),mx=Math.max.apply(null,pts.concat([0])),mn=Math.min.apply(null,pts.concat([0])),bm=Math.max.apply(null,tr.map(function(t){return Math.abs(t.pnl)}));
    var X=function(i){return P+i*(W-2*P)/(pts.length-1)},Y=function(v){return P+(mx-v)/((mx-mn)||1)*(H-2*P)},z=Y(0);
    var bars=tr.map(function(t,i){var h=Math.abs(t.pnl)/bm*28;return '<rect class="'+(t.pnl>=0?'bar-u':'bar-d')+'" x="'+(X(i)-5).toFixed(1)+'" y="'+(H-h).toFixed(1)+'" width="10" height="'+h.toFixed(1)+'" rx="2"><title>'+t.sym+' '+inr(t.pnl)+'</title></rect>'}).join('');
    return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="Running P&L across '+tr.length+' trades"><line class="zero" x1="0" x2="'+W+'" y1="'+z.toFixed(1)+'" y2="'+z.toFixed(1)+'" vector-effect="non-scaling-stroke"/>'+bars+'<polyline class="ln" vector-effect="non-scaling-stroke" points="'+pts.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1)}).join(' ')+'"/></svg>'}
  function full(){var s=stats(),ins=insights(s);
    var rev={};tr.forEach(function(t,i){var p=tr[i-1];if(p&&p.d===t.d&&p.pnl<0&&p.sym.split(' ')[0]===t.sym.split(' ')[0])rev[i]=1});
    var rvd={};try{rvd=JSON.parse(localStorage.getItem('ap-journal-review'))||{}}catch(e){}var todo=(window.JDP||[]).filter(function(p){return !rvd[p.id]}).length;
    card.innerHTML=head((todo?'<a class="jr-todo" href="idea-b-journal.html#review">\uD83D\uDCE5 '+todo+' trade'+(todo>1?'s':'')+' from today to review \u2192</a>':'')+'<span class="who"><b>'+s.n+' trades</b> · 2–13 Nov · options and stocks</span>')+
      '<div class="jr-kpi"><div><span>Net P&L</span><b class="'+(s.net>=0?'jr-up':'jr-dn')+'">'+inr(s.net)+'</b><small>'+s.n+' closed trades</small></div>'+
      '<div><span>Win rate</span><b>'+s.wr+'%</b><small>'+s.w.length+' won · '+s.l.length+' lost</small></div>'+
      '<div><span>Profit factor</span><b>'+s.pf.toFixed(2)+'</b><small>gross win ÷ gross loss</small></div>'+
      '<div><span>Avg win / loss</span><b>'+(s.aw/s.al).toFixed(2)+'×</b><small>'+inr(s.aw)+' / '+inr(-s.al)+'</small></div>'+
      '<div><span>Best trade</span><b class="jr-up">'+inr(s.best.pnl)+'</b><small>'+s.best.sym+'</small></div>'+
      '<div><span>Worst trade</span><b class="jr-dn">'+inr(s.worst.pnl)+'</b><small>'+s.worst.sym+'</small></div></div>'+
      '<div class="jr-mid"><div class="jr-curve"><div class="t"><span>Running P&L</span><span>each bar is one trade</span></div>'+curve()+'</div>'+
      '<div class="jr-ins"><h4>Insights</h4><ul>'+ins.map(function(x){return '<li class="'+x[0]+'"><i aria-hidden="true">'+x[1]+'</i><span>'+x[2]+'</span></li>'}).join('')+'</ul></div></div>'+
      '<div class="jr-tbl"><table><thead><tr><th>Date</th><th>Instrument</th><th>Type</th><th>Side</th><th class="n">Qty</th><th class="n">Entry</th><th class="n">Exit</th><th class="n">Held</th><th class="n">P&L</th></tr></thead><tbody>'+
      tr.slice().reverse().map(function(t){var i=tr.indexOf(t);return '<tr><td>'+day(t.d)+' '+t.d.slice(8)+' Nov</td><td><b>'+t.sym+'</b>'+(rev[i]?' <span class="jr-tag flag">revenge</span>':'')+'</td><td><span class="jr-tag">'+t.kind+'</span></td><td>'+t.side+'</td><td class="n">'+t.qty+'</td><td class="n">'+t.en.toLocaleString('en-IN')+'</td><td class="n">'+t.ex.toLocaleString('en-IN')+'</td><td class="n">'+hrs(t.hold)+'</td><td class="n"><b class="'+(t.pnl>=0?'jr-up':'jr-dn')+'">'+inr(t.pnl)+'</b></td></tr>'}).join('')+'</tbody></table></div>'+
      '<p class="jr-note">Sample trades, to show how your journal looks. Charges and taxes are not deducted.</p>'}
  function render(){full()}
  card.addEventListener('click',function(e){var b=e.target.closest('[data-b]');
    if(b){var name=b.dataset.b;busy(name);setTimeout(function(){st.broker=name;save();render()},1400);return}
    if(e.target.id==='jrOff'){delete st.broker;save();render()}
    if(e.target.id==='jrSync'){var n=st.broker;busy(n);setTimeout(render,900)}});
  render();
});
</script>'''


OB_JS = '<script>\n/* Onboarding: three questions on the first visit pick a starting screen; skipping gives Basic. Saved on this device; change any time. */\n(function(){\n  var PROFILE_KEY=\'ap-profile\',TIP_KEY=\'ap-tip-dash\';\n  var Q=[\n    {k:\'exp\',q:\'How long have you been trading?\',a:[[\'new\',\'Just starting\',\'Less than 6 months\'],[\'mid\',\'6 months to 2 years\',\'I place trades most weeks\'],[\'pro\',\'More than 2 years\',\'Trading is a routine for me\']]},\n    {k:\'what\',q:\'What do you trade most?\',a:[[\'fo\',\'Options and futures\',\'Nifty, Bank Nifty, stock F&O\'],[\'swing\',\'Stocks for days or weeks\',\'Swing and positional trades\'],[\'long\',\'Long-term investing\',\'Baskets, SIPs, holding for years\'],[\'explore\',\'Still exploring\',\'I am finding my style\']]},\n    {k:\'want\',q:\'What should AlphaPad help you with each morning?\',a:[[\'learn\',\'Learn how markets work\',\'One idea a day, explained simply\'],[\'ideas\',\'Find trade ideas\',\'Calls, scans and the pick of the day\'],[\'track\',\'Review my trades\',\'Journal, win rate, habits\'],[\'watch\',\'Keep an eye on the market\',\'Indices, filings and the big picture\']]}];\n  var NAMES={basic:\'Basic\',options:\'Options trader\',picker:\'Stock picker\',investor:\'Investor\',learner:\'Learner\'};\n  var WHY={basic:\'today, the pick of the day, calls and levels\',options:\'trade calls, F&O levels, OI buildup and your journal\',picker:\'the pick of the day, scans, movers and filings\',investor:\'baskets, the big picture and company filings\',learner:\'the brief, one idea a day and the calendar\'};\n  function pick(a){if(a.exp===\'new\'||a.what===\'explore\'||a.want===\'learn\')return \'learner\';if(a.what===\'fo\')return \'options\';if(a.what===\'swing\')return \'picker\';if(a.what===\'long\'||a.want===\'watch\')return \'investor\';return \'basic\'}\n  function get(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY))}catch(e){return null}}\n  function set(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));localStorage.removeItem(\'ap-dash-v4\');localStorage.removeItem(\'ap-dash-seen\')}catch(e){}}\n  window.apProfile={get:get,names:NAMES,why:WHY,open:function(){open()}};\n  var ans={},step=0,ov;\n  function open(){ans={};step=0;ov=document.createElement(\'div\');ov.className=\'ob-ov\';ov.setAttribute(\'role\',\'dialog\');ov.setAttribute(\'aria-modal\',\'true\');ov.setAttribute(\'aria-label\',\'Set up your AlphaPad\');document.body.appendChild(ov);draw()}\n  function close(){if(ov){ov.remove();ov=null}}\n  function draw(){var n=Q.length;\n    if(step<n){var q=Q[step];\n      ov.innerHTML=\'<div class="ob-card"><div class="ob-top"><span class="ob-step">Step \'+(step+1)+\' of \'+n+\'</span><button type="button" class="ob-skip">Skip for now</button></div><div class="ob-prog"><i style="width:\'+((step+1)/(n+1)*100)+\'%"></i></div>\'+\n        (step===0?\'<p class="ob-hi">Welcome to AlphaPad 👋<br><span>Three quick questions and we will set up a screen that fits how you trade.</span></p>\':\'\')+\n        \'<h2>\'+q.q+\'</h2><div class="ob-opts">\'+q.a.map(function(o){return \'<button type="button" class="ob-o\'+(ans[q.k]===o[0]?\' on\':\'\')+\'" data-v="\'+o[0]+\'"><b>\'+o[1]+\'</b><small>\'+o[2]+\'</small></button>\'}).join(\'\')+\'</div>\'+\n        \'<div class="ob-f">\'+(step?\'<button type="button" class="ob-back">← Back</button>\':\'<span></span>\')+\'</div></div>\'}\n    else{var p=pick(ans);\n      ov.innerHTML=\'<div class="ob-card ob-done"><div class="ob-prog"><i style="width:100%"></i></div><div class="ob-badge">✨</div><h2>Your screen is ready: \'+NAMES[p]+\'</h2><p class="ob-sum">Based on your answers, your dashboard opens with \'+WHY[p]+\'. You can change this any time.</p><div class="ob-f"><button type="button" class="ob-back">← Change answers</button><button type="button" class="ob-go" data-p="\'+p+\'">Start my day →</button></div></div>\'}}\n  document.addEventListener(\'click\',function(e){if(!ov||!ov.contains(e.target))return;var b=e.target.closest(\'button\');if(!b)return;\n    if(b.classList.contains(\'ob-o\')){ans[Q[step].k]=b.dataset.v;step++;setTimeout(draw,120);b.classList.add(\'on\');return}\n    if(b.classList.contains(\'ob-back\')){step=Math.max(0,step-1);draw();return}\n    if(b.classList.contains(\'ob-skip\')){set({preset:\'basic\',skipped:true,at:Date.now()});close();chip();tip();return}\n    if(b.classList.contains(\'ob-go\')){set({preset:b.dataset.p,answers:ans,at:Date.now()});close();chip();tip()}});\n  document.addEventListener(\'keydown\',function(e){if(e.key===\'Escape\'&&ov){set({preset:\'basic\',skipped:true,at:Date.now()});close();chip();tip()}});\n  /* profile chip on the landing card, so people can change their screen later */\n  function chip(){var m=document.querySelector(\'.hero-main\');if(!m)return;var p=get(),c=m.querySelector(\'.ob-chip\');if(!c){c=document.createElement(\'button\');c.type=\'button\';c.className=\'ob-chip\';m.appendChild(c);c.onclick=function(){open()}}\n    c.innerHTML=\'<span aria-hidden="true">👤</span>\'+(p&&!p.skipped?\'Your screen: <b>\'+NAMES[p.preset]+\'</b>\':\'Personalise your screen\')+\'<em>Change</em>\'}\n  /* one-time tip pointing at View your dashboard */\n  function tip(){try{if(localStorage.getItem(TIP_KEY))return}catch(e){}var b=document.querySelector(\'.b-dash\');if(!b||document.querySelector(\'.ob-tip\'))return;var p=get();\n    b.classList.add(\'ob-pulse\');var t=document.createElement(\'div\');t.className=\'ob-tip\';t.setAttribute(\'role\',\'dialog\');t.setAttribute(\'aria-label\',\'Your dashboard is ready\');\n    t.innerHTML=\'<span class="ob-tip-i" aria-hidden="true">\\u2728</span><div class="ob-tip-t"><b>Your dashboard is ready</b><span>\'+(p&&!p.skipped?\'We set it up as <em>\'+NAMES[p.preset]+\'</em> from your answers.\':\'Start with the Basic screen and make it yours.\')+\'</span></div><button type="button">Got it</button>\';\n    document.body.appendChild(t);\n    function place(){var r=b.getBoundingClientRect();t.style.left=Math.max(12,Math.min(innerWidth-t.offsetWidth-12,r.left))+\'px\';t.style.top=(r.bottom+12)+\'px\';t.style.setProperty(\'--ax\',(r.left+24-Math.max(12,Math.min(innerWidth-t.offsetWidth-12,r.left)))+\'px\')}\n    place();addEventListener(\'scroll\',place,{passive:true});addEventListener(\'resize\',place);\n    function done(){try{localStorage.setItem(TIP_KEY,\'1\')}catch(e){}t.remove();b.classList.remove(\'ob-pulse\');removeEventListener(\'scroll\',place);removeEventListener(\'resize\',place)}\n    t.querySelector(\'button\').addEventListener(\'click\',done);b.addEventListener(\'click\',done);document.addEventListener(\'keydown\',function k(e){if(e.key===\'Escape\'&&document.body.contains(t)){done();document.removeEventListener(\'keydown\',k)}})}\n  addEventListener(\'load\',function(){chip();if(/[?&]setup=1/.test(location.search)){setTimeout(open,200);return}if(!get()){setTimeout(open,/[?&]nosplash/.test(location.search)?100:1500)}else tip()});\n})();\n/* Coming up today: the rest of today\'s events, read from the timeline card */\naddEventListener(\'load\',function(){setTimeout(function(){var main=document.querySelector(\'.hero-main\'),pk=document.querySelector(\'.b-peek\');if(!main||!pk)return;\n  var li=[].slice.call(document.querySelectorAll(\'#tl li\')).map(function(x){return x.textContent.replace(/\\s+/g,\' \').trim()}).filter(function(t){return /^\\d{1,2}:\\d{2}/.test(t)}),k=-1;\n  li.forEach(function(t,i){if(k<0&&/close/i.test(t))k=i});var ev=(k>=0?li.slice(k):li.slice(-4)).slice(0,4);if(!ev.length)return;\n  var box=document.createElement(\'div\');box.className=\'b-next\';box.innerHTML=\'<span class="bn-h">Coming up today</span><ol>\'+ev.map(function(t){var m=t.match(/^(\\d{1,2}:\\d{2})\\s*(.*)$/);return \'<li><time>\'+(m?m[1]:\'\')+\'</time><span>\'+(m?m[2]:t)+\'</span></li>\'}).join(\'\')+\'</ol>\';\n  pk.insertAdjacentElement(\'beforebegin\',box)},300)});\n</script>\n'
OB_CSS = '.ob-ov{position:fixed;inset:0;z-index:9000;display:grid;place-items:center;padding:20px;background:rgba(8,12,20,.72);backdrop-filter:blur(6px);animation:obIn .25s ease}\n@keyframes obIn{from{opacity:0}to{opacity:1}}\n.ob-card{width:min(620px,100%);padding:28px 30px;border-radius:22px;background:radial-gradient(80% 60% at 0% 0%,rgba(63,91,217,.22),transparent 60%),var(--surface-elevated);border:1px solid var(--border-glass,rgba(255,255,255,.12));box-shadow:0 30px 70px rgba(0,0,0,.5)}\n.ob-top{display:flex;justify-content:space-between;align-items:center}\n.ob-step{font:600 11px/1 var(--font-sans);letter-spacing:1.1px;text-transform:uppercase;color:var(--text-tertiary)}\n.ob-skip{border:0;background:none;font:600 13px/1 var(--font-sans);color:var(--text-secondary);cursor:pointer}.ob-skip:hover{color:var(--text-primary);text-decoration:underline}\n.ob-prog{height:4px;margin:14px 0 20px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden}.ob-prog i{display:block;height:100%;background:linear-gradient(90deg,var(--teal),var(--indigo-500,#3F5BD9));border-radius:2px;transition:width .3s}\n.ob-hi{margin:0 0 16px;font:600 18px/1.35 var(--font-sans);color:var(--text-primary)}.ob-hi span{font:400 14px/1.5 var(--font-sans);color:var(--text-secondary)}\n.ob-card h2{margin:0 0 16px;font:600 24px/1.25 var(--font-sans);letter-spacing:-.3px;color:var(--text-primary)}\n.ob-opts{display:grid;gap:10px}\n.ob-o{display:grid;gap:3px;text-align:left;padding:14px 16px;border-radius:14px;border:1px solid var(--border-decorative);background:rgba(255,255,255,.03);color:var(--text-primary);cursor:pointer;transition:border-color .15s,background .15s}\n.ob-o:hover{border-color:var(--surface-hover-stroke);background:var(--surface-hover)}.ob-o.on{border-color:var(--action-primary);background:rgba(63,91,217,.18)}\n.ob-o b{font:600 15px/1.25 var(--font-sans)}.ob-o small{font:400 12.5px/1.35 var(--font-sans);color:var(--text-tertiary)}\n.ob-f{display:flex;justify-content:space-between;align-items:center;margin-top:18px}\n.ob-back{border:0;background:none;font:600 13px/1 var(--font-sans);color:var(--text-secondary);cursor:pointer}.ob-back:hover{color:var(--text-primary)}\n.ob-go{height:44px;padding:0 20px;border:0;border-radius:12px;background:var(--action-primary);color:#fff;font:600 14.5px/1 var(--font-sans);cursor:pointer}.ob-go:hover{background:var(--action-hover,#3452C9)}\n.ob-done{text-align:left}.ob-badge{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:24px;background:var(--fin-positive-soft);margin-bottom:14px}\n.ob-sum{margin:0;font:400 15px/1.55 var(--font-sans);color:var(--text-secondary)}\n.ob-chip{position:absolute;top:22px;right:24px;display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:9999px;border:1px solid var(--border-decorative);background:rgba(255,255,255,.05);color:var(--text-secondary);font:500 12.5px/1 var(--font-sans);cursor:pointer;z-index:2}\n.ob-chip b{color:var(--text-primary);font-weight:600}.ob-chip em{font-style:normal;color:var(--link,#8FA3FF);font-weight:600}.ob-chip:hover{border-color:var(--surface-hover-stroke)}\n.ob-pulse{box-shadow:0 0 0 0 rgba(143,163,255,.6);animation:obPulse 1.8s ease-out infinite}\n@keyframes obPulse{0%{box-shadow:0 0 0 0 rgba(143,163,255,.55)}100%{box-shadow:0 0 0 14px rgba(143,163,255,0)}}\n.ob-tip{position:fixed;z-index:9500;display:flex;align-items:center;gap:14px;max-width:min(440px,calc(100vw - 24px));padding:14px 14px 14px 16px;border-radius:14px;background:#3F5BD9;color:#fff;box-shadow:0 18px 44px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.12)}\n.ob-tip::before{content:"";position:absolute;top:-6px;left:var(--ax,28px);width:12px;height:12px;background:#3F5BD9;transform:rotate(45deg);border-radius:2px}\n.ob-tip-i{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.16);font-size:16px}\n.ob-tip-t{display:grid;gap:3px;min-width:0}.ob-tip-t b{font:600 14px/1.25 var(--font-sans)}.ob-tip-t span{font:400 13px/1.4 var(--font-sans);color:rgba(255,255,255,.9)}.ob-tip em{font-style:normal;font-weight:600}\n.ob-tip button{flex:none;height:34px;padding:0 14px;border:0;border-radius:9px;background:#fff;color:#3F5BD9;font:600 13px/1 var(--font-sans);cursor:pointer}.ob-tip button:hover{background:#EEF1FF}\n@media (prefers-reduced-motion:reduce){.ob-ov,.ob-pulse{animation:none}}\n.b-next{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,.035);border:1px dashed var(--border-decorative);margin-top:auto}\n.bn-h{flex:none;font:600 11px/1.2 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary)}\n.b-next ol{list-style:none;margin:0;padding:0;display:flex;gap:18px;flex-wrap:wrap;min-width:0}\n.b-next li{display:flex;align-items:baseline;gap:8px;font:500 13px/1.3 var(--font-sans);color:var(--text-primary);white-space:nowrap}\n.b-next time{font:600 12px/1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--amber)}\n'
DP_JS = '<script>\n/* Dashboard: start on the screen picked in onboarding, and explain that once */\n(function(){\n  try{var p=JSON.parse(localStorage.getItem(\'ap-profile\'));if(p&&p.preset&&!localStorage.getItem(\'ap-dash-v4\'))localStorage.setItem(\'ap-dash-v4\',JSON.stringify({active:p.preset,on:{},custom:[]}))}catch(e){}\n  addEventListener(\'load\',function(){setTimeout(function(){var p=null;try{if(localStorage.getItem(\'ap-dash-seen\'))return;p=JSON.parse(localStorage.getItem(\'ap-profile\'))}catch(e){return}\n    var N={basic:\'Basic\',options:\'Options trader\',picker:\'Stock picker\',investor:\'Investor\',learner:\'Learner\'},name=N[(p&&p.preset)||\'basic\'];\n    var ov=document.createElement(\'div\');ov.className=\'ob-ov\';ov.setAttribute(\'role\',\'dialog\');ov.setAttribute(\'aria-modal\',\'true\');ov.setAttribute(\'aria-label\',\'Your personalised dashboard\');\n    ov.innerHTML=\'<div class="ob-card ob-done"><div class="ob-badge">🎯</div><h2>\'+(p&&!p.skipped?\'This dashboard is personalised for you\':\'Welcome to your dashboard\')+\'</h2>\'+\n      \'<p class="ob-sum">\'+(p&&!p.skipped?\'Based on your answers, we set it up as <b>\'+name+\'</b>.\':\'You are on the <b>Basic</b> screen.\')+\' You can switch screens any time from <b>Screen ▾</b> at the top left, and show or hide cards with <b>Customize</b>.</p>\'+\n      \'<div class="ob-f"><span></span><button type="button" class="ob-go">Got it</button></div></div>\';\n    document.body.appendChild(ov);var b=document.querySelector(\'.dvw-b\');if(b)b.classList.add(\'ob-pulse\');\n    function done(){try{localStorage.setItem(\'ap-dash-seen\',\'1\')}catch(e){}ov.remove();if(b)setTimeout(function(){b.classList.remove(\'ob-pulse\')},4000)}\n    ov.querySelector(\'.ob-go\').onclick=done;ov.addEventListener(\'click\',function(e){if(e.target===ov)done()});document.addEventListener(\'keydown\',function k(e){if(e.key===\'Escape\'){done();document.removeEventListener(\'keydown\',k)}})},700)});\n})();\n</script>\n'


NAV_JS = '<script>\n/* Top bar: every page and tool in the ⋮ menu, plus a Backtesting button next to Baskets */\naddEventListener(\'DOMContentLoaded\',function(){\n  var BT=\'https://ujjwalb2.github.io/tradin-simulator/replay/\',here=location.pathname.split(\'/\').pop()||\'idea-b.html\';\n  var G=[[\'Your day\',[[\'idea-b.html\',\'\\u2600\\uFE0F\',\'Today\',\'Good morning, brief and streak\'],[\'idea-b-dashboard.html\',\'\\u25A6\',\'Dashboard\',\'Your cards and screens\'],[\'idea-b-journal.html\',\'\\uD83D\\uDCD3\',\'Trade journal\',\'P&L, plan score, day reviews\'],[\'today-demo-2026-11-12.html#brief\',\'\\uD83D\\uDCF0\',\'Today\\u2019s full brief\',\'Read or listen, 4:46\']]],\n    [\'Trade\',[[\'https://dev.alphapad.in/dashboard\',\'\\uD83C\\uDFAF\',\'Trade calls\',\'Active calls from the desk\'],[\'https://dev.alphapad.in/screener\',\'\\uD83D\\uDD0D\',\'Screener\',\'Scan Nifty 500 stocks\'],[\'https://dev.alphapad.in/option-studio\',\'\\uD83D\\uDCC8\',\'Option Studio\',\'Option chain and strategies\'],[\'https://dev.alphapad.in/baskets\',\'\\uD83E\\uDDFA\',\'Baskets\',\'Ready-made stock baskets\'],[BT,\'\\u23EA\',\'Backtesting\',\'Replay the market and test a strategy\']]],\n    [\'Learn\',[[\'https://dev.alphapad.in/lms\',\'\\uD83C\\uDF93\',\'LMS\',\'Courses and lessons\']]]];\n  var m=document.getElementById(\'apMenu\');if(m){var theme=document.getElementById(\'themeBtn\');\n    m.classList.add(\'apm\');m.innerHTML=G.map(function(g){return \'<div class="apm-l">\'+g[0]+\'</div>\'+g[1].map(function(x){var ext=/^https?:/.test(x[0]),cur=x[0].split(\'#\')[0]===here;\n      return \'<a href="\'+x[0]+\'"\'+(ext&&x[0]===BT?\' target="_blank" rel="noopener"\':\'\')+(cur?\' aria-current="page" class="cur"\':\'\')+\'><span class="i" aria-hidden="true">\'+x[1]+\'</span><span class="t"><b>\'+x[2]+\'</b><small>\'+x[3]+\'</small></span>\'+(x[0]===BT?\'<em>New tab</em>\':\'\')+\'</a>\'}).join(\'\')}).join(\'\')+\n      \'<div class="apm-l">Settings</div><a href="idea-b.html?setup=1"><span class="i" aria-hidden="true">\\uD83D\\uDC64</span><span class="t"><b>Personalise my screen</b><small>Answer 3 questions again</small></span></a>\'+\n      \'<button type="button" class="apm-reset"><span class="i" aria-hidden="true">\\u21BA</span><span class="t"><b>Start fresh</b><small>Clear everything saved on this device</small></span></button>\';\n    var rb=m.querySelector(\'.apm-reset\'),armed=false;rb.addEventListener(\'click\',function(e){e.stopPropagation();\n      if(!armed){armed=true;rb.classList.add(\'arm\');rb.querySelector(\'b\').textContent=\'Tap again to reset\';rb.querySelector(\'small\').textContent=\'Clears your answers, layout, notes, poll and streak progress\';setTimeout(function(){if(!armed)return;armed=false;rb.classList.remove(\'arm\');rb.querySelector(\'b\').textContent=\'Start fresh\';rb.querySelector(\'small\').textContent=\'Clear everything saved on this device\'},4000);return}\n      [localStorage,sessionStorage].forEach(function(st){try{Object.keys(st).forEach(function(k){if(/^(ap-|sp-|today-)/.test(k))st.removeItem(k)})}catch(err){}});location.href=\'idea-b.html\'});\n    if(theme){var w=document.createElement(\'div\');w.className=\'apm-th\';w.innerHTML=\'<span class="i" aria-hidden="true">\\uD83C\\uDF17</span><span class="t"><b>Theme</b></span>\';w.appendChild(theme);m.appendChild(w)}}\n  var nav=document.querySelector(\'.ap-nav\'),bk=nav&&nav.querySelector(\'a[href*="/baskets"]\');\n  if(nav&&!nav.querySelector(\'.ap-bt\')){var a=document.createElement(\'a\');a.className=\'ap-btn ap-bt ap-x\';a.href=BT;a.target=\'_blank\';a.rel=\'noopener\';a.innerHTML=\'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/></svg>Backtesting\';\n    nav.insertBefore(a,bk||nav.firstChild)}\n});\n</script>\n<script>\n/* Light theme: brand text colours are darkened to readable shades (5:1+), and white-on-dark tints become soft dark tints.\n   Dark theme is left untouched; switching back restores everything. */\n(function(){\n  var TXT={\'0,201,154\':\'4,120,87\',\'240,160,75\':\'180,83,9\',\'143,163,255\':\'63,91,217\'};\n  function light(){var t=document.documentElement.getAttribute(\'data-theme\');return t?t===\'light\':matchMedia(\'(prefers-color-scheme: light)\').matches}\n  function rgba(c){var m=c&&c.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;var p=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {k:p[0]+\',\'+p[1]+\',\'+p[2],a:p.length>3?p[3]:1}}\n  var busy=false;\n  function run(){if(busy)return;busy=true;var L=light();\n    document.querySelectorAll(\'[data-lfx]\').forEach(function(e){e.setAttribute(\'style\',e.getAttribute(\'data-lfx\')===\'∅\'?\'\':e.getAttribute(\'data-lfx\'));e.removeAttribute(\'data-lfx\')});\n    if(L){document.querySelectorAll(\'body *\').forEach(function(e){if(e.closest(\'.ap-splash\'))return;var cs=getComputedStyle(e),set={};\n      var own=[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()});\n      if(own){var c=rgba(cs.color);if(c&&c.a>.5&&TXT[c.k])set.color=\'rgb(\'+TXT[c.k]+\')\'}\n      var bb=rgba(cs.backgroundColor),fc=rgba(cs.color);if(own&&bb&&bb.a>.9&&TXT[bb.k]&&fc&&fc.k===\'255,255,255\')set[\'background-color\']=\'rgb(\'+TXT[bb.k]+\')\';\n      var b=rgba(cs.backgroundColor);if(b&&b.k===\'255,255,255\'){if(b.a>0&&b.a<.36)set[\'background-color\']=\'rgba(16,24,39,\'+Math.min(.075,b.a*.9+.02).toFixed(3)+\')\';else if(b.a>.9){var r=e.getBoundingClientRect();if(r.width&&r.width<14&&r.height<24)set[\'background-color\']=\'#101827\'}}\n      [\'top\',\'right\',\'bottom\',\'left\'].forEach(function(s){var bc=rgba(cs[\'border-\'+s+\'-color\']);if(bc&&bc.k===\'255,255,255\'&&bc.a>0&&bc.a<.5&&parseFloat(cs[\'border-\'+s+\'-width\'])>0)set[\'border-\'+s+\'-color\']=\'rgba(16,24,39,\'+(bc.a*.8+.08).toFixed(3)+\')\'});\n      if(e instanceof SVGElement){[\'stroke\',\'fill\'].forEach(function(p){var v=rgba(cs[p]);if(v&&v.k===\'255,255,255\'&&v.a<.5)set[p]=\'rgba(16,24,39,\'+(v.a+.08).toFixed(3)+\')\'})}\n      var keys=Object.keys(set);if(!keys.length)return;e.setAttribute(\'data-lfx\',e.getAttribute(\'style\')||\'∅\');keys.forEach(function(k){e.style.setProperty(k,set[k],\'important\')})})}\n    busy=false}\n  var t;function later(){clearTimeout(t);t=setTimeout(run,120)}\n  addEventListener(\'load\',function(){setTimeout(run,700);setTimeout(run,1800)});\n  new MutationObserver(later).observe(document.documentElement,{attributes:true,attributeFilter:[\'data-theme\']});\n  addEventListener(\'DOMContentLoaded\',function(){new MutationObserver(function(ms){if(busy)return;if(ms.some(function(m){return m.addedNodes.length}))later()}).observe(document.body,{childList:true,subtree:true})});\n  matchMedia(\'(prefers-color-scheme: light)\').addEventListener(\'change\',later);\n})();\n</script>\n'
NAV_CSS = '.ap-menu.apm{min-width:310px;max-height:min(78vh,640px);overflow:auto;padding:8px;gap:2px;border-radius:14px}\n.apm .apm-l{padding:10px 10px 4px;font:600 10.5px/1 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary)}\n.apm a{display:flex!important;align-items:center;gap:10px;padding:8px 10px!important;border-radius:10px!important}\n.apm a.cur{background:rgba(63,91,217,.18)}\n.apm .i{width:30px;height:30px;flex:none;display:grid;place-items:center;border-radius:9px;background:rgba(255,255,255,.06);font-size:14px}\n.apm .t{display:grid;min-width:0;flex:1}.apm .t b{font:600 13px/1.25 var(--font-sans);color:var(--text-primary)}.apm .t small{font:400 11.5px/1.3 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.apm em{font-style:normal;font:600 10px/1 var(--font-sans);padding:4px 6px;border-radius:6px;background:var(--surface-hover);color:var(--text-secondary)}\n.apm-th{display:flex;align-items:center;gap:10px;padding:8px 10px;border-top:1px solid var(--border-decorative);margin-top:6px}\n.apm-th #themeBtn{margin-left:auto;padding:6px 12px!important;border:1px solid var(--border-decorative)!important;border-radius:8px!important;font:600 12px/1 var(--font-sans)!important}\n@media (max-width:1250px){.ap-nav .ap-bt{display:none!important}}\n.apm .apm-reset{display:flex!important;align-items:center;gap:10px;width:100%;padding:8px 10px!important;border-radius:10px!important;text-align:left;margin-top:2px}.apm .apm-reset:hover{background:rgba(224,82,82,.14)!important}.apm .apm-reset.arm{background:rgba(224,82,82,.22)!important;box-shadow:inset 0 0 0 1px rgba(224,82,82,.5)}\n/* larger audio bar */\n.dock .wrap{padding-top:12px!important;padding-bottom:12px!important;gap:16px!important}\n.dock .play{width:46px!important;height:46px!important;font-size:16px!important}\n.dock .p-title{font:600 16px/1.3 var(--font-sans)!important}\n.dock .p-sub{font:400 13.5px/1.3 var(--font-sans)!important;margin-left:10px!important}\n.dock .chapters{margin-top:8px!important}\n.dock .speed,.dock .iconbtn{height:36px!important;font-size:13.5px!important;padding:0 14px!important}\n:root[data-theme="light"] .tc-risk{background:var(--surface-canvas)!important;border:1px solid var(--border-decorative)!important}\n@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .tc-risk{background:var(--surface-canvas)!important;border:1px solid var(--border-decorative)!important}}\n'


LP_JS = '<script>\n/* Landing polish: glance tiles with sparklines, a real timeline for "Coming up today", and one consistent shortcut tile */\naddEventListener(\'load\',function(){setTimeout(function(){\n  var main=document.querySelector(\'.hero-main\');if(!main)return;\n  function spark(vals,up){if(!vals||vals.length<2)return \'\';var lo=Math.min.apply(null,vals),hi=Math.max.apply(null,vals),r=(hi-lo)||1,W=100,H=28;\n    var p=vals.map(function(v,i){return (i*W/(vals.length-1)).toFixed(1)+\',\'+(H-2-(v-lo)/r*(H-4)).toFixed(1)}).join(\' \');\n    return \'<svg class="lg-sp \'+(up?\'u\':\'w\')+\'" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline points="\'+p+\'"/></svg>\'}\n  var data={};try{(typeof IDX!==\'undefined\'?IDX:[]).forEach(function(x){data[x.n]=x})}catch(e){}\n  function tile(name,label,warn){var x=data[name];if(!x)return \'\';var last=x.d[x.d.length-1][1],vals=x.d.map(function(p){return p[1]}),m=(last/x.d[0][1]-1)*100;\n    return \'<div class="lg-t"><div class="lg-h"><span>\'+label+\'</span></div><div class="lg-v"><b>\'+last.toLocaleString(\'en-IN\',{minimumFractionDigits:2,maximumFractionDigits:2})+\'</b><em class="\'+(warn?\'w\':(x.up?\'u\':\'d\'))+\'">\'+(x.up?\'▲ \':\'▼ \')+x.pct.replace(/^[+−-]/,\'\')+\'</em></div>\'+spark(vals,!warn)+\'<small>\'+(m>=0?\'+\':\'−\')+Math.abs(m).toFixed(1)+\'% in a month</small></div>\'}\n  var g=document.querySelector(\'.b-glance\');\n  if(g){var mood=62;g.classList.add(\'lgd\');g.innerHTML=tile(\'Nifty 50\',\'Nifty 50\')+tile(\'Nifty Bank\',\'Bank Nifty\')+tile(\'India VIX\',\'India VIX\',true)+\n    \'<div class="lg-t"><div class="lg-h"><span>Market mood</span></div><div class="lg-v"><b>\'+mood+\'<i>/100</i></b><em class="u">Optimistic</em></div><div class="lg-mood" aria-hidden="true"><i style="left:\'+mood+\'%"></i></div><small>Fear · Neutral · Greed</small></div>\'}\n  /* Coming up today: a timeline, next event highlighted, a marker for now */\n  var nx=document.querySelector(\'.b-next\');\n  if(nx){var ev=[].slice.call(nx.querySelectorAll(\'li\')).map(function(li){return [li.querySelector(\'time\').textContent,li.querySelector(\'span\').textContent]});\n    var toM=function(t){var a=t.split(\':\');return +a[0]*60+ +a[1]},now=new Date(),nm=now.getHours()*60+now.getMinutes(),first=toM(ev[0][0])-60,last=toM(ev[ev.length-1][0]);\n    var n=ev.length,P=ev.map(function(_,i){return 14+i*(86/Math.max(1,n-1))}),pos=function(m){if(m<=toM(ev[0][0]))return Math.max(0,14*(m-first)/(toM(ev[0][0])-first));for(var i=1;i<n;i++){var a=toM(ev[i-1][0]),b=toM(ev[i][0]);if(m<=b)return P[i-1]+(P[i]-P[i-1])*(m-a)/((b-a)||1)}return 100},nextI=ev.findIndex(function(e){return toM(e[0])>=nm});\n    nx.className=\'b-next lt\';nx.innerHTML=\'<div class="lt-h"><span>Coming up today</span><small>\'+(nextI>=0?\'Next: <b>\'+ev[nextI][1]+\'</b> at \'+ev[nextI][0]:\'All done for today\')+\'</small></div>\'+\n      \'<div class="lt-track"><i class="lt-fill" style="width:\'+pos(nm)+\'%"></i><span class="lt-now" style="left:\'+pos(nm)+\'%"><em>Now \'+String(now.getHours()).padStart(2,\'0\')+\':\'+String(now.getMinutes()).padStart(2,\'0\')+\'</em></span>\'+\n      ev.map(function(e,i){var m=toM(e[0]);return \'<span class="lt-ev\'+(m<nm?\' past\':\'\')+(i===nextI?\' next\':\'\')+(i===n-1?\' end\':\'\')+\'" style="left:\'+P[i]+\'%"><i></i><b>\'+e[0]+\'</b><small>\'+e[1]+\'</small></span>\'}).join(\'\')+\'</div>\'}\n  /* Shortcut tiles: same structure everywhere */\n  var IC={bk:\'<path d="M3 9h18l-2 11H5z"/><path d="m8 9 4-6 4 6"/>\',tc:\'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>\',ex:\'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M12 14v3h2"/>\',jr:\'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M9 9h6M9 13h6"/>\'};\n  var pk=document.querySelector(\'.b-peek\');\n  if(pk){var rows=[].slice.call(pk.querySelectorAll(\'a\')).map(function(a){var sp=a.querySelector(\'span\'),b=sp&&sp.querySelector(\'b\'),lab=sp?sp.firstChild.textContent.trim():\'\',em=a.querySelector(\'em\');return {h:a.getAttribute(\'href\'),l:lab,v:b?b.textContent.trim():\'\',m:em?em.textContent.trim():\'\',mc:em&&em.classList.contains(\'n\')?\'n\':\'u\'}});\n    var key=function(l){return /basket/i.test(l)?\'bk\':/call/i.test(l)?\'tc\':/expiry/i.test(l)?\'ex\':\'jr\'},tone={bk:\'t\',tc:\'b\',ex:\'a\',jr:\'i\'};\n    var extra={tc:\'SWIGGY +1 more\',ex:\'Max pain 25,100\'};\n    pk.className=\'b-peek sc\';pk.innerHTML=rows.map(function(r){var k=key(r.l),meta=r.m&&r.m!==\'→\'?r.m:(extra[k]||\'\');if(k===\'ex\')meta=\'Max pain 25,100\';\n        r.l={bk:\'Baskets\',tc:\'Trade calls\',ex:\'Nifty expiry\',jr:\'Journal\'}[k];if(k===\'bk\'){r.v=r.v.replace(/^Updated\\s+/,\'\');meta=meta+\' in a year\'}if(k===\'jr\')meta=meta+\' P&L\';\n      return \'<a class="sc-t \'+tone[k]+\'" href="\'+r.h+\'"><span class="sc-i" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">\'+IC[k]+\'</svg></span><span class="sc-go" aria-hidden="true">↗</span>\'+\n        \'<span class="sc-l">\'+r.l+\'</span><b class="sc-v" title="\'+r.v+\'">\'+r.v+\'</b><span class="sc-m \'+(k===\'bk\'||k===\'jr\'?\'u\':\'n\')+\'">\'+meta+\'</span></a>\'}).join(\'\')}\n},450)});\n</script>\n<script>\n/* Listen as a proper button with a play circle */\naddEventListener(\'load\',function(){var b=document.querySelector(\'.hero-main .listen-cta\');if(!b||b.querySelector(\'.lc-ic\'))return;\n  var sync=function(){var playing=/pause|❚❚|⏸/i.test(b.textContent);b.innerHTML=\'<span class="lc-ic" aria-hidden="true">\'+(playing?\'❚❚\':\'▶\')+\'</span>\'+(playing?\'Pause\':\'Listen\')+\' <small>4:46</small>\'};\n  sync();new MutationObserver(function(){if(!b.querySelector(\'.lc-ic\'))sync()}).observe(b,{childList:true,characterData:true,subtree:true})});\n</script>\n'
LP_CSS = '/* glance tiles */\nhtml.idea-b .b-glance{gap:12px!important}\nhtml.idea-b .b-glance .lg-t{display:grid!important;gap:4px;padding:12px 14px 10px!important;border-radius:14px;background:rgba(255,255,255,.035)!important;border:1px solid var(--border-decorative)!important;min-width:0}\nhtml.idea-b .lg-h{display:flex;justify-content:space-between;align-items:center;gap:8px}\nhtml.idea-b .lg-h span{font:500 12px/1.2 var(--font-sans)!important;color:var(--text-tertiary)!important;display:inline!important;margin:0!important}\nhtml.idea-b .lg-v{display:flex;align-items:baseline;gap:8px;min-width:0;flex-wrap:wrap}\nhtml.idea-b .lg-h span{white-space:nowrap}\nhtml.idea-b .lg-v em{font-style:normal;font:600 11.5px/1 var(--font-sans);padding:3px 6px;border-radius:6px;white-space:nowrap}\nhtml.idea-b .lg-v em.u{color:var(--teal);background:var(--fin-positive-soft)}html.idea-b .lg-v em.d{color:var(--text-secondary);background:var(--fin-negative-soft)}html.idea-b .lg-v em.w{color:var(--amber);background:var(--fb-warning-soft)}\nhtml.idea-b .b-glance .lg-v b{font:600 clamp(18px,2.4vh,22px)/1.1 var(--font-sans)!important;font-variant-numeric:tabular-nums;color:var(--text-primary);margin:2px 0 0!important}\nhtml.idea-b .lg-v b i{font-style:normal;font-size:13px;color:var(--text-tertiary);margin-left:2px}\nhtml.idea-b .lg-sp{display:block;width:100%;height:24px}html.idea-b .lg-sp polyline{fill:none;stroke-width:1.8;vector-effect:non-scaling-stroke;stroke-linejoin:round}\nhtml.idea-b .lg-sp.u polyline{stroke:var(--teal)}html.idea-b .lg-sp.w polyline{stroke:var(--amber)}\nhtml.idea-b .lg-t small{font:400 11px/1.2 var(--font-sans);color:var(--text-tertiary)}\nhtml.idea-b .lg-mood{position:relative;height:8px;margin:8px 0;border-radius:4px;background:linear-gradient(90deg,#7B8799,#8793A5 35%,#5fb39b 65%,#00C99A)}\nhtml.idea-b .lg-mood i{position:absolute;top:-4px;width:3px;height:16px;margin-left:-1.5px;border-radius:2px;background:#fff;box-shadow:0 0 0 2px var(--surface-raised)}\n/* coming up today: timeline */\nhtml.idea-b .b-next.lt{display:grid!important;gap:14px;padding:14px 18px 16px!important;border-radius:14px!important;border:1px solid var(--border-decorative)!important;background:rgba(255,255,255,.03)!important;margin-top:auto}\nhtml.idea-b .lt-h{display:flex;justify-content:space-between;align-items:baseline;gap:12px}\nhtml.idea-b .lt-h span{font:600 11px/1.2 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary)}\nhtml.idea-b .lt-h small{font:400 12.5px/1.3 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}html.idea-b .lt-h small b{color:var(--text-primary);font-weight:600}\nhtml.idea-b .lt-track{position:relative;height:58px;margin:0 8px 0 6px}\nhtml.idea-b .lt-track::before{content:"";position:absolute;left:0;right:0;top:7px;height:2px;border-radius:1px;background:rgba(255,255,255,.1)}\nhtml.idea-b .lt-fill{position:absolute;left:0;top:7px;height:2px;border-radius:1px;background:linear-gradient(90deg,rgba(0,201,154,.2),var(--teal))}\nhtml.idea-b .lt-now{position:absolute;top:1px;width:2px;height:14px;margin-left:-1px;background:var(--teal);border-radius:1px}\nhtml.idea-b .lt-now em{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);font:normal 600 10px/1 var(--font-sans);color:var(--teal);white-space:nowrap}\nhtml.idea-b .lt-ev{position:absolute;top:0;display:grid;justify-items:start;gap:3px;transform:translateX(-7px);max-width:150px}\nhtml.idea-b .lt-ev i{width:14px;height:14px;border-radius:50%;background:var(--surface-raised);border:2px solid var(--amber);box-sizing:border-box}\nhtml.idea-b .lt-ev b{margin-top:4px;font:600 12.5px/1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--amber)}\nhtml.idea-b .lt-ev small{font:500 12px/1.25 var(--font-sans);color:var(--text-primary);white-space:nowrap}\nhtml.idea-b .lt-ev.past{opacity:.45}html.idea-b .lt-ev.past i{border-color:var(--text-tertiary)}html.idea-b .lt-ev.past b{color:var(--text-tertiary)}\nhtml.idea-b .lt-ev.next i{background:var(--amber);box-shadow:0 0 0 4px rgba(240,160,75,.22)}\n/* shortcut tiles */\nhtml.idea-b .b-peek.sc{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;border-top:0!important;padding-top:0!important}\nhtml.idea-b .b-peek.sc .sc-t{position:relative;display:grid!important;grid-template-columns:none!important;align-content:start;gap:2px;padding:14px 14px 13px!important;border-radius:14px!important;border:1px solid var(--border-decorative)!important;background:rgba(255,255,255,.035)!important;text-decoration:none;min-width:0;transition:border-color .15s,background .15s,transform .15s}\nhtml.idea-b .b-peek.sc .sc-t:hover{border-color:var(--surface-hover-stroke)!important;background:var(--surface-hover)!important;transform:translateY(-1px)}\nhtml.idea-b .sc-i{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;margin-bottom:10px}\nhtml.idea-b .sc-i svg{width:18px;height:18px}\nhtml.idea-b .sc-t.t .sc-i{background:var(--fin-positive-soft);color:var(--teal)}html.idea-b .sc-t.b .sc-i{background:var(--fb-info-soft);color:var(--blue)}\nhtml.idea-b .sc-t.a .sc-i{background:var(--fb-warning-soft);color:var(--amber)}html.idea-b .sc-t.i .sc-i{background:rgba(63,91,217,.2);color:#8FA3FF}\nhtml.idea-b .sc-go{position:absolute;top:14px;right:14px;font:600 14px/1 var(--font-sans);color:var(--text-tertiary);transition:color .15s}\nhtml.idea-b .sc-t:hover .sc-go{color:var(--text-primary)}\nhtml.idea-b .sc-l{font:500 11.5px/1.2 var(--font-sans)!important;color:var(--text-tertiary)!important;display:block!important}\nhtml.idea-b .b-peek.sc .sc-v{font:600 15px/1.3 var(--font-sans)!important;color:var(--text-primary)!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;display:block}\nhtml.idea-b .sc-m{font:600 12px/1.3 var(--font-sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nhtml.idea-b .sc-m.u{color:var(--teal)}html.idea-b .sc-m.n{color:var(--text-secondary);font-weight:500}\n@media (max-width:1250px){html.idea-b .b-peek.sc{grid-template-columns:repeat(2,minmax(0,1fr))!important}}\n@media (max-width:700px){html.idea-b .lt-track{margin-right:20px}html.idea-b .lt-ev small{display:none}}\n@media (max-height:740px) and (min-width:1101px){html.idea-b .sc-i{width:28px;height:28px;margin-bottom:6px}html.idea-b .b-peek.sc .sc-t{padding:10px 12px!important}html.idea-b .lt-track{height:50px}}\nhtml.idea-b .lt-ev.end{transform:translateX(calc(-100% + 7px));justify-items:end;text-align:right}\nhtml.idea-b .lt-now em{bottom:auto;top:20px;left:4px;transform:none}\nhtml.idea-b .b-glance .lg-t .lg-h,html.idea-b .b-glance .lg-t .lg-v{padding:0!important;background:none!important;border:0!important;border-radius:0!important}\nhtml.idea-b .b-glance .lg-t .lg-mood{padding:0!important;border:0!important;border-radius:4px!important;background:linear-gradient(90deg,#7B8799,#8793A5 35%,#5fb39b 65%,#00C99A)!important}\nhtml.idea-b .lg-sp{height:20px}html.idea-b .b-glance .lg-t{gap:3px;padding:10px 12px 9px!important}\nhtml.idea-b .b-next.lt{gap:10px;padding:12px 16px 12px!important}html.idea-b .lt-track{height:52px}\nhtml.idea-b .sc-i{width:30px;height:30px;margin-bottom:8px}html.idea-b .b-peek.sc .sc-t{padding:12px 12px 11px!important}\nhtml.idea-b .b-peek.sc .sc-v{white-space:normal!important;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.25!important}\nhtml.idea-b .sc-m{white-space:normal;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical}\nhtml.idea-b .b-peek.sc .sc-t{grid-template-columns:auto minmax(0,1fr) auto!important;grid-template-areas:"i l g" "v v v" "m m m";column-gap:8px!important;row-gap:2px!important;align-items:center;padding:11px 12px 11px!important}\nhtml.idea-b .b-peek.sc .sc-i{grid-area:i;margin:0 0 4px;width:26px;height:26px;border-radius:8px}html.idea-b .b-peek.sc .sc-i svg{width:15px;height:15px}\nhtml.idea-b .b-peek.sc .sc-l{grid-area:l;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nhtml.idea-b .b-peek.sc .sc-go{grid-area:g;position:static;margin-bottom:4px}\nhtml.idea-b .b-peek.sc .sc-v{grid-area:v;-webkit-line-clamp:1!important;white-space:nowrap!important;display:block!important}\nhtml.idea-b .b-peek.sc .sc-m{grid-area:m}\n@media (max-height:900px){html.idea-b .lg-t small{display:none}html.idea-b .lg-sp{height:18px}}\n\n/* action row: three balanced buttons */\nhtml.idea-b .hero-main .home-cta{gap:12px!important}\nhtml.idea-b .hero-main .home-cta .btn,html.idea-b .b-dash{height:50px!important;padding:0 22px!important;border-radius:12px!important;font:600 15px/1 var(--font-sans)!important;display:inline-flex!important;align-items:center;gap:10px}\nhtml.idea-b .hero-main .home-cta .read-cta{background:var(--action-primary)!important;color:#fff!important;box-shadow:0 8px 22px rgba(63,91,217,.38)!important}\nhtml.idea-b .hero-main .home-cta .read-cta:hover{background:var(--action-hover,#3452C9)!important}\nhtml.idea-b .hero-main .home-cta .listen-cta{background:rgba(255,255,255,.06)!important;border:1px solid var(--border-glass,rgba(255,255,255,.14))!important;color:var(--text-primary)!important;padding-left:8px!important}\nhtml.idea-b .hero-main .home-cta .listen-cta:hover{background:rgba(255,255,255,.1)!important}\nhtml.idea-b .listen-cta .lc-ic{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:50%;background:var(--teal);color:#0b1220;font-size:12px}\nhtml.idea-b .listen-cta small{font:500 13px/1 var(--font-sans);color:var(--text-tertiary);margin-left:2px}\nhtml.idea-b .b-dash{border:1px solid rgba(143,163,255,.5)!important;background:rgba(63,91,217,.12)!important;color:var(--text-primary)!important}\nhtml.idea-b .b-dash:hover{background:rgba(63,91,217,.22)!important;border-color:var(--action-primary)!important}\n/* cards below: a little smaller */\nhtml.idea-b .b-glance{gap:10px!important}\nhtml.idea-b .b-glance .lg-t{padding:9px 11px 8px!important;border-radius:12px!important}\nhtml.idea-b .b-glance .lg-v b{font-size:clamp(16px,2.2vh,19px)!important}\nhtml.idea-b .lg-h span{font-size:11.5px!important}\nhtml.idea-b .lg-v em{font-size:11px!important;padding:2px 5px!important}\nhtml.idea-b .lg-sp{height:16px!important}\nhtml.idea-b .b-peek.sc{gap:10px!important}\nhtml.idea-b .b-peek.sc .sc-t{padding:9px 11px 9px!important;border-radius:12px!important}\nhtml.idea-b .b-peek.sc .sc-v{font-size:14px!important}\nhtml.idea-b .sc-m{font-size:11.5px!important}\nhtml.idea-b .b-next.lt{padding:10px 14px 10px!important;border-radius:12px!important}\nhtml.idea-b .hero-main .b-glance,html.idea-b .hero-main .b-next.lt,html.idea-b .hero-main .b-peek.sc{margin-top:auto!important}\nhtml.idea-b .hero-main .home-cta{margin-bottom:6px!important}\n:root[data-theme="light"] html.idea-b .lt-now em,html.idea-b .lt-now em{padding:1px 4px;border-radius:4px;background:var(--surface-raised)}\nhtml.idea-b .hero-main .dayline{display:block!important;-webkit-line-clamp:unset!important;overflow:visible!important;max-width:40em!important}\n@media (max-height:860px) and (min-width:1101px){html.idea-b .hero-main .dayline{font-size:15px!important;line-height:1.45!important}}\n@media (max-height:800px) and (min-width:1101px){html.idea-b .hero-main{gap:8px!important}html.idea-b .home .hero .hero-main h1,html.idea-b .hero-main h1{font-size:38px!important}html.idea-b .hero-main .dayline{font-size:14.5px!important}}\nhtml.idea-b .lt-track::before{height:3px!important;top:6px!important;background:rgba(255,255,255,.16)!important}\nhtml.idea-b .lt-fill{height:3px!important;top:6px!important}\n:root[data-theme="light"] .lt-track::before{background:rgba(16,24,39,.14)!important}\n@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .lt-track::before{background:rgba(16,24,39,.14)!important}}\n:root[data-theme="light"] .lt-fill{background:linear-gradient(90deg,rgba(4,120,87,.25),#047857)!important}\n:root[data-theme="light"] .lt-now{background:#047857!important}\n:root[data-theme="light"] .lt-ev i{background:#fff!important}\nhtml.idea-b .lt-now em{top:auto!important;bottom:9px!important;left:50%!important;transform:translateX(-50%)!important}\nhtml.idea-b .lt-track{margin-top:6px;height:50px!important}\nhtml.idea-b .b-glance:not(.lgd),html.idea-b .b-peek:not(.sc),html.idea-b .b-next:not(.lt){visibility:hidden}\n'


SV_CSS = '/* Spotlight slides: richer visuals */\nhtml.idea-b .bs-kr{display:flex;align-items:center;gap:8px}\nhtml.idea-b .bs-ic{width:24px;height:24px;flex:none;display:grid;place-items:center;border-radius:7px}\nhtml.idea-b .bs-ic svg{width:14px;height:14px}\nhtml.idea-b .bs-ic.t{background:var(--fin-positive-soft);color:var(--teal)}html.idea-b .bs-ic.a{background:var(--fb-warning-soft);color:var(--amber)}html.idea-b .bs-ic.b{background:var(--fb-info-soft);color:var(--blue)}html.idea-b .bs-ic.i{background:rgba(63,91,217,.18);color:#8FA3FF}\nhtml.idea-b .bs-viz{margin-top:auto;display:grid;gap:8px}\nhtml.idea-b .sv-sd{position:relative;height:64px;border-radius:10px;overflow:hidden;background:rgba(255,255,255,.03)}\nhtml.idea-b .sv-sd svg{position:absolute;inset:0;width:100%;height:100%}\nhtml.idea-b .sv-sd polyline{fill:none;stroke:var(--teal);stroke-width:2;stroke-linejoin:round}\nhtml.idea-b .sv-sd .oh{stroke:var(--text-tertiary);stroke-dasharray:3 3;stroke-width:1}\nhtml.idea-b .oh-l{position:absolute;left:8px;top:6px;font:500 10.5px/1 var(--font-sans);color:var(--text-tertiary)}\nhtml.idea-b .sv-chips{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}\nhtml.idea-b .sv-chips span{display:grid;gap:2px;padding:6px 8px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid var(--border-decorative);font:500 10.5px/1.2 var(--font-sans);color:var(--text-tertiary)}\nhtml.idea-b .sv-chips b{font:600 13px/1.1 var(--font-sans);color:var(--text-primary)}\nhtml.idea-b .sv-rank{list-style:none;margin:0;padding:0;display:grid;gap:7px}\nhtml.idea-b .sv-rank li{display:grid;grid-template-columns:16px 82px minmax(0,1fr) 44px 48px;align-items:center;gap:8px;font:500 12px/1.2 var(--font-sans);color:var(--text-secondary)}\nhtml.idea-b .sv-rank .n{font:700 11px/1 var(--font-sans);color:var(--text-tertiary)}\nhtml.idea-b .sv-rank b{font:600 12.5px/1.2 var(--font-sans);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nhtml.idea-b .sv-rank .bar{display:flex;height:8px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden}\nhtml.idea-b .sv-rank .bar i{display:block;height:100%}\nhtml.idea-b .sv-rank.a .bar i{background:var(--amber);border-radius:4px}\nhtml.idea-b .sv-rank.b .bar i{background:var(--blue)}html.idea-b .sv-rank.b .bar i.p{opacity:.35}\nhtml.idea-b .sv-rank .v{font:600 12.5px/1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary);text-align:right}\nhtml.idea-b .sv-rank em{font-style:normal;font:600 11.5px/1 var(--font-sans);text-align:right}\nhtml.idea-b .sv-rank em.u{color:var(--teal)}html.idea-b .sv-rank em.d{color:var(--text-tertiary)}\nhtml.idea-b .sv-leg{display:flex;gap:14px;font:500 11px/1 var(--font-sans);color:var(--text-tertiary)}\nhtml.idea-b .sv-leg i{display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--blue);margin-right:5px;vertical-align:-1px}html.idea-b .sv-leg i.p{opacity:.35}\nhtml.idea-b .sv-br{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center}\nhtml.idea-b .sv-ring{--p:50;position:relative;width:82px;height:82px;border-radius:50%;background:conic-gradient(var(--teal) calc(var(--p)*1%),var(--slate-500,#7B8799) 0);display:grid;place-items:center;align-content:center}\nhtml.idea-b .sv-ring::before{content:"";position:absolute;inset:9px;border-radius:50%;background:var(--surface-raised)}\nhtml.idea-b .sv-ring b,html.idea-b .sv-ring small{position:relative;line-height:1}html.idea-b .sv-ring b{font:700 17px/1 var(--font-sans);color:var(--text-primary)}html.idea-b .sv-ring small{font:500 10.5px/1.3 var(--font-sans);color:var(--text-tertiary)}\nhtml.idea-b .sv-tl{display:block;font:600 10.5px/1 var(--font-sans);letter-spacing:.8px;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px}\nhtml.idea-b .sv-top ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}\nhtml.idea-b .sv-top li{display:flex;justify-content:space-between;gap:8px;padding:6px 10px;border-radius:8px;background:rgba(255,255,255,.04);font:500 12.5px/1 var(--font-sans)}\nhtml.idea-b .sv-top li b{color:var(--text-primary);font-weight:600}html.idea-b .sv-top em{font-style:normal;font-weight:600;color:var(--teal)}\nhtml.idea-b .sv-quad{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-content:center}\nhtml.idea-b .sv-quad .q{margin:0!important;height:auto!important;min-height:0!important;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:1px 8px;padding:7px 10px;border-radius:9px;background:rgba(255,255,255,.04);border-left:3px solid var(--slate-500,#7B8799)}\nhtml.idea-b .sv-quad .q.qu{border-left-color:var(--teal)}html.idea-b .sv-quad .q.on{background:var(--fin-positive-soft)}\nhtml.idea-b .sv-quad small{font:500 10.5px/1.2 var(--font-sans);color:var(--text-tertiary)}html.idea-b .sv-quad b{grid-row:span 2;font:700 17px/1 var(--font-sans);color:var(--text-primary);font-variant-numeric:tabular-nums}\nhtml.idea-b .sv-quad em{font-style:normal;font:600 11.5px/1.2 var(--font-sans);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n:root[data-theme="light"] html.idea-b .sv-ring::before,:root[data-theme="light"] .sv-ring::before{background:#fff}\n@media (max-height:860px) and (min-width:1101px){html.idea-b .sv-sd{height:50px}html.idea-b .sv-ring{width:68px;height:68px}html.idea-b .sv-ring::before{inset:8px}html.idea-b .sv-rank{gap:5px}html.idea-b .sv-top ul{gap:4px}html.idea-b .sv-top li{padding:5px 9px}html.idea-b .sv-quad .q{padding:5px 9px}html.idea-b .sv-chips span{padding:5px 7px}}\n@media (max-height:800px) and (min-width:1101px){html.idea-b .bs-s p{display:none!important}html.idea-b .bs-t b{font-size:22px!important}}\n@media (max-height:765px) and (min-width:1101px){html.idea-b .home .stk-strip .days{display:none!important}html.idea-b .home .stk-strip{grid-template-areas:"fl nm" "go go"!important}}\n'


def _spark(vals, w=100, h=34):
    lo, hi = min(vals), max(vals); r = (hi - lo) or 1
    return ' '.join(f'{i*w/(len(vals)-1):.1f},{h-3-(v-lo)/r*(h-6):.1f}' for i, v in enumerate(vals))


def _inject(out, css, head_js='', body_top=''):
    assert out.count('</head>') == 1 and out.count('<body>') == 1
    out = out.replace('</head>', '<style>' + css + NAV_CSS + '</style>\n' + head_js + NAV_JS + '\n</head>', 1)
    if body_top:
        out = out.replace('<body>', '<body>\n' + body_top, 1)
    return out


def make(out):
    from sotd import SOTD
    _lo, _hi = min(SOTD['closes']), max(SOTD['closes']); _oy = 34 - 3 - (SOTD['old_hi'] - _lo) / ((_hi - _lo) or 1) * 28
    b = _inject(out, SPLASH_CSS + B_CSS + OB_CSS + LP_CSS + SV_CSS, B_JS.replace('SPARK', _spark(SOTD['closes'])).replace('OLDY', f'{_oy:.1f}') + OB_JS + LP_JS, SPLASH)
    import os, json
    from journal_data import build as _jd, pending as _jp
    here = os.path.dirname(os.path.abspath(__file__)); jd = _jd()
    jdata = '<script>window.JD=' + json.dumps(jd, separators=(',', ':')) + ';window.JDP=' + json.dumps(_jp(), separators=(',', ':')) + ';</script>'
    lm = jd[-1]['d'][:7]; jm = [t for t in jd if t['d'][:7] == lm]
    wr = round(sum(1 for t in jm if t['pnl'] > 0) / len(jm) * 100); net = sum(t['pnl'] for t in jm)
    b = b.replace('JWR%', f'{wr}%').replace('JNET', ('+' if net >= 0 else '\u2212') + '\u20B9' + f'{abs(net):,}')
    d = _inject(out, D_CSS + J_CSS + OB_CSS, jdata + DP_JS + J_JS + D_JS)
    a = _inject(out, SPLASH_CSS + A_CSS + J_CSS + AT_CSS, A_JS + jdata + J_JS + AT_JS, SPLASH)
    jp = _inject(out, open(os.path.join(here, 'journal_page.css')).read(), jdata + '<script>' + open(os.path.join(here, 'journal_page.js')).read() + '</script>')
    titles = {'idea-a.html': 'AlphaPad · Idea A', 'idea-b.html': 'AlphaPad · Idea B', 'idea-b-dashboard.html': 'AlphaPad · Dashboard', 'idea-b-journal.html': 'AlphaPad · Trade journal'}
    for name, html in (('idea-a.html', a), ('idea-b.html', b), ('idea-b-dashboard.html', d), ('idea-b-journal.html', jp)):
        html = html.replace('<title>AlphaPad Home Demo</title>', '<title>' + titles[name] + '</title>', 1)
        yield name, html
