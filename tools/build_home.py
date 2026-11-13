import re
import os
B=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")+"/"
s=open(B+"today-demo-2026-11-12.html",encoding="utf-8").read()
BRIEF="today-demo-2026-11-12.html"
def cut(a,b,inc_b=False):
    i=s.index(a); j=s.index(b,i); return s[i:j+(len(b) if inc_b else 0)]

head=s[:s.index("</style>")].replace("<title>Springpad Today Demo</title>","<title>AlphaPad Home Demo</title>")
ticker=cut('<div class="ticker"','\n\n<header')
strip=cut('<div class="stk-strip"','\n\n  <!-- ===== HERO')
hero=cut('<section class="hero"','</section>',True)
modal=cut('<div class="calmodal" id="stkModal"','<!-- ===== DOCKED PLAYER')
dock=cut('<div class="dock"','\n\n<script>')
js_helpers=cut('/* ================= helpers','/* ================= hero')
js_ticker=cut('/* ================= LIVE TICKER','/* ================= SIDE RAILS')
js_day=cut('const DAY=[','function renderClock')
js_streak=cut('/* ================= STREAK','renderStreak();\n\n/* RIGHT RAIL')
import json
def lviz_for(lid):
    j = s.index('data-learn="%s"' % lid)
    i = s.rindex('<article class="card lcard">', 0, j)
    art = s[i:j]
    k = art.index('<div class="lviz">')
    depth, pos = 0, k
    for m in re.finditer(r'<div\b|</div>', art[k:]):
        depth += 1 if m.group().startswith('<div') else -1
        if depth == 0:
            pos = k + m.end(); break
    return art[k:pos]
LVIZ = json.dumps({x: lviz_for(x) for x in ['term', 'relation', 'learning']}, ensure_ascii=False)


# hero tweaks: CTA row instead of chips; links go to the full brief
hero=re.sub(r'<div class="chips">.*?</div>',
  '<div class="home-cta"><button class="btn primary" id="listenBtn">▶ Listen · 4:46</button>'
  f'<a class="btn ghost" href="{BRIEF}#brief">Read today\'s full brief →</a></div>'
  '<div class="top-story"><span class="eyebrow">Top story</span><a href="'+BRIEF+'#brief">Foreign investors return as buyers after the Diwali break</a></div>',hero,count=1,flags=re.S)
hero=hero.replace('<span class="src">Today\'s numbers arrive after the 3:30 pm close</span>','')
hero=hero.replace('href="#markets" data-go="markets"',f'href="{BRIEF}#markets"')
strip=strip.replace('<button class="linkbtn" id="stkOpen">','<button class="linkbtn" id="stkOpen">')

CSS="""
/* ---------- home (landing) ---------- */
.home-cta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:var(--space-16)}
.home-cta .btn{text-decoration:none}
.top-story{display:flex;gap:10px;align-items:baseline;margin-top:var(--space-12);font:var(--type-label)}
.top-story a{color:var(--text-primary);text-decoration:none}.top-story a:hover{text-decoration:underline}
.home-row{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:var(--space-16);margin-top:var(--space-16);align-items:stretch}
.hg>.card,.hg-ln>.card{display:flex;flex-direction:column;gap:10px;padding:var(--space-16) var(--space-20)}
.hc-head{display:flex;justify-content:space-between;align-items:center;gap:8px}
.hc-foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:8px;font:var(--type-caption);color:var(--text-tertiary)}
.hc-foot a{font:var(--type-label);color:var(--action-primary);text-decoration:none;white-space:nowrap}
/* trade calls (advice: kept visually apart from the education cards) */
.tc{border-top:3px solid var(--amber)}
.tc-tag{font:600 10px/1 var(--font-sans);letter-spacing:.6px;text-transform:uppercase;padding:4px 7px;border-radius:var(--radius-pill);background:var(--fb-warning-soft);color:var(--text-primary)}
.tc-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tc-stats div{padding:6px 8px;border-radius:var(--radius-8);background:var(--surface-glass);border:1px solid var(--border-decorative);font:500 10px/1.2 var(--font-sans);letter-spacing:.4px;text-transform:uppercase;color:var(--text-tertiary)}
.tc-stats b{display:block;margin-top:3px;font:600 16px/1 var(--font-sans);letter-spacing:0;text-transform:none;color:var(--text-primary)}
.tc-call{padding:10px 12px;border-radius:var(--radius-8);border:1px solid var(--border-decorative);display:grid;gap:6px}
.tc-call .top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.tc-call .top b{font:var(--type-title)}
.tc-call .meta{font:var(--type-caption);color:var(--text-tertiary)}
.tc-legs{display:flex;gap:8px;font:var(--type-caption);color:var(--text-secondary)}
.tc-legs span b{font-weight:600;color:var(--teal)}.tc-legs span.s b{color:var(--slate-500)}
.tc-lv{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font:var(--type-caption);color:var(--text-tertiary)}
.tc-lv b{display:block;font:var(--type-data);color:var(--text-primary);font-variant-numeric:tabular-nums}
.tc-act{font:600 10px/1 var(--font-sans);letter-spacing:.5px;text-transform:uppercase;padding:4px 7px;border-radius:var(--radius-pill);background:var(--fin-positive-soft);color:var(--text-primary)}
/* today's timeline */
.tl-st{display:flex;align-items:baseline;gap:8px}
.tl-st b{font:600 18px/1.2 var(--font-sans)}
.tl-st span{font:var(--type-caption);color:var(--text-tertiary)}
.tl-bar{height:6px;border-radius:3px;background:var(--border-decorative);overflow:hidden}.tl-bar i{display:block;height:100%;background:var(--teal)}
.tl{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.tl li{display:grid;grid-template-columns:44px 8px 1fr;gap:8px;align-items:center;font:var(--type-caption);color:var(--text-secondary)}
.tl li .t{font-variant-numeric:tabular-nums;color:var(--text-tertiary)}
.tl li .d{width:8px;height:8px;border-radius:50%;border:1.5px solid var(--text-tertiary)}
.tl li.ev .d{border-color:var(--amber);background:var(--amber)}
.tl li.past{opacity:.5}
.tl li.next{color:var(--text-primary);font-weight:600}.tl li.next .d{box-shadow:0 0 0 3px var(--indigo-soft);border-color:var(--action-primary)}
/* one learning card at a time */
.hl .term{margin:0;font:var(--type-title)}
.hl .one{margin:0;font:var(--type-body-md);color:var(--text-secondary)}
.hl .one b{color:var(--text-primary)}
.hl-body{display:grid;gap:8px}
.hl-body.in{animation:hlIn .35s ease}
@keyframes hlIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.hl-body.in{animation:none}}
.hl .lnav{display:flex;align-items:center;gap:8px}
.hl .lnav .round{width:28px;height:28px;font-size:13px}
.hl.pulse{animation:lrPulse 1.2s ease 2}
.home .hero{margin-top:var(--space-16)}


/* ---------- AlphaPad header, as on dev.alphapad.in ---------- */
.ap-bar{position:sticky;top:0;z-index:40;background:var(--surface-raised);border-bottom:1px solid var(--border-decorative)}
.ap-bar .wrap{display:flex;align-items:center;justify-content:space-between;height:54px}
.ap-logo{font:700 26px/1 var(--font-sans);letter-spacing:-.5px;color:var(--text-primary);text-decoration:none}
.ap-logo .a{font-style:italic;font-weight:800;margin-right:1px}.ap-logo .p{color:var(--blue)}
.ap-nav{display:flex;align-items:center;gap:8px}
.ap-btn{position:relative;display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:var(--radius-6);border:1px solid var(--border-decorative);background:var(--surface-raised);color:var(--text-primary);font:600 12.5px/1 var(--font-sans);text-decoration:none;cursor:pointer}
.ap-btn:hover{background:var(--surface-hover)}
.ap-ic{width:34px;padding:0;justify-content:center;font-size:16px}
.ap-badge{position:absolute;top:-8px;right:-8px;min-width:20px;height:18px;padding:0 4px;border-radius:9px;background:var(--red);color:var(--white);font:700 10px/18px var(--font-sans);text-align:center}
.ap-more{position:relative}
.ap-menu{position:absolute;right:0;top:40px;min-width:190px;display:grid;padding:6px;border-radius:var(--radius-8);background:var(--surface-elevated);border:1px solid var(--border-glass);box-shadow:0 12px 32px rgba(0,0,0,.2)}
.ap-menu a,.ap-menu button{display:block;text-align:left;padding:8px 10px;border-radius:var(--radius-6);border:0;background:none;color:var(--text-primary);font:var(--type-label);text-decoration:none;cursor:pointer}
.ap-menu a:hover,.ap-menu button:hover{background:var(--surface-hover)}
.ap-menu[hidden]{display:none}

/* ---------- layout: narrow = summary then 3 cards; wide (1400px+) = timeline | summary | calls, ideas along the bottom ---------- */
.hg{display:grid;gap:var(--space-16);margin-top:12px;grid-template-columns:1.2fr 1fr 1fr;grid-template-areas:"s s s" "c c c" "tc tl one";align-items:stretch}
.hg-s{grid-area:s;min-width:0}.hg-c{grid-area:c;min-width:0}.hg-s .stk-strip{margin-top:0!important}.hg-c .hero{margin-top:0!important}
.hg-tc{grid-area:tc}.hg-tl{grid-area:tl}.hg-one{grid-area:one}
.hg-ln{grid-area:ln;display:none}
.tc-more,.tc-others,.tl .grp-h{display:none}
@media (min-width:1400px){
  .home.wrap,.ap-bar .wrap{max-width:min(1760px,calc(100vw - 48px))!important}
  .hg{grid-template-columns:minmax(250px,16%) minmax(0,1fr) minmax(300px,20%);grid-template-areas:"s s s" "tl c tc" "ln ln ln"}
  .hg>.hg-one{display:none}
  .hg-ln{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-16)}
  .hg-ln .card{padding:var(--space-16) var(--space-20)}
  .hg-c{display:flex}.hg-c .hero{flex:1;align-items:stretch}.hg-c .hero-main,.hg-c .hero-side,.hg-c .idx-card{height:100%}
  .tc-more,.tc-others{display:grid;gap:8px}
  .tl .grp-h{display:block;margin-top:6px;font:600 10px/1 var(--font-sans);letter-spacing:.8px;text-transform:uppercase;color:var(--text-tertiary)}
  .hg-tl .tl{gap:6px}
}
.tc-legs2{display:grid;gap:6px}
.tc-legs2>div{display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--radius-8);border:1px solid var(--border-decorative);font:var(--type-label)}
.tc-legs2 i{font-style:normal;font:600 10px/1 var(--font-sans);text-transform:uppercase;padding:4px 6px;border-radius:var(--radius-6);text-align:center}
.tc-legs2 i.b{background:var(--fin-positive-soft)}.tc-legs2 i.s{background:var(--fb-error-soft)}
.tc-legs2 b{font-variant-numeric:tabular-nums}
.tc-lv4{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;text-align:center;font:500 10px/1.2 var(--font-sans);letter-spacing:.4px;text-transform:uppercase;color:var(--text-tertiary)}
.tc-lv4 b{display:block;margin-top:3px;font:600 14px/1.2 var(--font-sans);letter-spacing:0;color:var(--text-primary);font-variant-numeric:tabular-nums}
.tc-lv4 b.up{color:var(--teal)}.tc-lv4 b.dn{color:var(--red)}
.tc-cap{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:var(--radius-8);background:var(--navy-900);color:var(--white);font:600 11px/1 var(--font-sans);letter-spacing:1px;text-transform:uppercase}
.tc-cap b{font:600 16px/1 var(--font-sans);letter-spacing:0}
.tc-meta2{font:var(--type-caption);color:var(--text-tertiary)}
.tc-others p{margin:0;font:var(--type-caption);color:var(--text-secondary)}
.lr3 .term{margin:0;font:var(--type-title)}.lr3 .one{margin:0;font:var(--type-body-md);color:var(--text-secondary)}.lr3 .one b{color:var(--text-primary)}

@media (min-width:1400px) and (max-height:1000px){
  .tc-others,.tc-meta2,.hg-tl .hc-foot>span{display:none!important}
  .hg-ln .card{padding:12px 16px;gap:6px}
  .home .top-story{display:none}
}
.lr3-b{display:grid;grid-template-columns:minmax(0,1fr) minmax(210px,46%);gap:14px;align-items:start}
.lr3-t{display:grid;gap:6px;align-content:start}
.lr3 .lviz{min-height:0;padding:8px 10px;gap:5px}
.lr3 .lviz .cap{font-size:11px}
.lr3 .lviz .cap .linkbtn{font:inherit}
.lr3 .lviz svg{max-height:120px}
.lr3 .lrow{grid-template-columns:72px 1fr 50px;font-size:11px}
.lr3 .cause{grid-template-columns:1fr;padding:6px 8px}.lr3 .cause svg{display:none}.lr3 .cause b{font-size:14px}
.lr3 .effects{grid-template-columns:repeat(3,1fr);gap:4px}
.lr3 .lviz>svg:not(:first-child){display:none}
.lr3 .cause{padding:5px 8px}.lr3 .cause .lbl{font-size:10.5px}
.lr3 .effects>*{padding:4px 5px!important;font-size:10.5px;line-height:1.25}
.lr3 .meter-l{font-size:10.5px}

@media (min-width:1400px) and (max-height:920px){
  .hg-tc .tc-why{display:none}
  .lr3 .one{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .lr3 .lviz{zoom:.8}
  .lr3-b{grid-template-columns:minmax(0,1fr) minmax(230px,50%)}
}
/* fit the landing page on one screen */
.home .hero{grid-template-columns:1.25fr 1fr;margin-top:var(--space-12)}
.home .hero-main{padding:var(--space-16) var(--space-20)}
.home .hero h1{font:600 30px/1.2 var(--font-sans);margin:4px 0 8px}
.home .asof{margin:0 0 8px}
.home .dayline{font:var(--type-body-md);margin:0}
.home .home-cta{margin-top:var(--space-12)}
.home .top-story{margin-top:8px}
.home .hero-row{margin-top:var(--space-12)}
.home .mood-mini .mood-read{margin:2px 0 6px}.home .mood-mini .mood-read b{font:600 22px/1 var(--font-sans)}
.home .mood-scale,.home .mood-why{display:none}
.home .idx-card .idx-strip{grid-template-columns:repeat(3,1fr)}
.home .idx-card .ix{padding:6px 10px}
.home .idx-card .ix .lv{font:600 16px/1.25 var(--font-sans);margin:2px 0}
.tc-stats-line{font:var(--type-caption);color:var(--text-secondary)}.tc-stats-line b{color:var(--text-primary)}
.home .tl{gap:3px}
.home .lcard.hl.learned,.home .lcard.hl.learned *{opacity:1;filter:none}
.hl-done{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radius-8);background:var(--fin-positive-soft);font:var(--type-caption);color:var(--text-primary)}
@media (max-height:820px){.home .top-story{display:none}.home .hero-row{margin-top:8px}.home .stk-strip{margin-top:8px}.hl .one{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.hl-body>a.linkbtn,.home .hc-foot>span{display:none}.hg>.card{padding:12px 16px;gap:8px}.hl-done{padding:5px 8px}}
.home .ix .ch{white-space:nowrap}.home .ix .pt{display:none}
.home .idx-card .ix .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media (min-width:1100px){.home .stk-strip{margin-top:10px;padding:8px 16px}}
@media (max-width:1100px){.hg{grid-template-columns:1fr 1fr;grid-template-areas:"s s" "c c" "tc tc" "tl one"}}
"""

body=f"""</style>
</head>
<body>
{ticker}

<header class="ap-bar">
  <div class="wrap">
    <a class="ap-logo" href="home-2026-11-12.html" aria-label="AlphaPad home"><span class="a">α</span>lpha<span class="p">Pad</span></a>
    <nav class="ap-nav" aria-label="AlphaPad">
      <button class="ap-btn ap-ic" aria-label="Notifications, 9+ new"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><span class="ap-badge">9+</span></button>
      <a class="ap-btn" href="#"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="3.2"/><circle cx="7" cy="16" r="3.2"/><circle cx="17" cy="16" r="3.2"/></svg>Baskets</a>
      <a class="ap-btn" href="#"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></svg>Option Studio</a>
      <a class="ap-btn" href="#"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 10 12 5l10 5-10 5z"/><path d="M6 12v4c3 2 9 2 12 0v-4"/></svg>LMS</a>
      <button class="ap-btn" aria-label="Account"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>TRADER</button>
      <div class="ap-more"><button class="ap-btn ap-ic" id="apMore" aria-haspopup="true" aria-expanded="false" aria-label="More">⋮</button>
        <div class="ap-menu" id="apMenu" hidden><a href="{BRIEF}#brief">Today's full brief</a><a href="https://dev.alphapad.in/dashboard">Trade calls</a><button id="themeBtn">Light</button></div></div>
    </nav>
  </div>
</header>

<main class="wrap home">
  <div class="hg">
    <div class="hg-s">
  {strip}
    </div>
    <div class="hg-c">
  {hero}
    </div>
    <article class="card tc hg-tc" aria-label="Trade calls">
      <div class="hc-head"><span class="eyebrow">Trade calls</span><span class="tc-tag">Research advice</span></div>
      <div class="tc-new"><span class="eyebrow" style="color:var(--text-tertiary)">Latest call</span>
        <div class="top"><b>SWIGGY · Put spread</b><span class="tc-act">Active</span></div>
        <div class="meta">Swing · 1 month · Risk medium · new today</div></div>
      <div class="tc-more">
        <div class="tc-legs2"><div><i class="b">Buy</i>PUT 185<b>₹4.22</b></div><div><i class="s">Sell</i>PUT 180<b>₹2.35</b></div></div>
        <div class="tc-lv4"><div>Entry<b>₹1.87</b></div><div>Target<b class="up">₹5.80</b></div><div>Stop loss<b class="dn">₹0.25</b></div><div>LTP<b>₹1.92</b></div></div>
        <div class="tc-cap"><span>Approx capital</span><b>₹21,000</b></div>
        <div class="tc-meta2">1,825 qty · expiry 23 Nov 2026</div>
      </div>
      <p class="tc-why">Bearish continuation after a failed relief rally into the 20 EMA. Full analysis in Trade Calls.</p>
      <div class="tc-others"><span class="eyebrow" style="color:var(--text-tertiary)">Also active</span><p>2 more calls · open Trade Calls to see them</p></div>
      <div class="hc-foot"><span>Research advice</span><a href="https://dev.alphapad.in/dashboard">Open Trade Calls →</a></div>
    </article>
    <article class="card hg-tl" aria-label="Today's market timeline">
      <div class="hc-head"><span class="eyebrow">Today · Thu 12 Nov</span><a class="linkbtn" href="{BRIEF}#calendar">Calendar →</a></div>
      <div class="tl-st"><b id="tlCount">–</b><span id="tlSub"></span></div>
      <div class="tl-bar"><i id="tlFill"></i></div>
      <ul class="tl" id="tl"></ul>
      <div class="hc-foot"><span>IST · amber = today's events</span></div>
    </article>
    <article class="card lcard hl hg-one" id="learnCard" aria-label="Today's learning">
      <div class="hc-head"><span class="eyebrow" id="hlKind">Learn</span><span class="num" id="hlCount" style="font:var(--type-caption);color:var(--text-tertiary)">1 / 3</span></div>
      <div class="hl-body" id="hlBody" aria-live="polite"></div>
      <div class="hc-foot"><div class="lnav"><button class="round" id="hlPrev" aria-label="Previous idea">←</button><button class="round" id="hlNext" aria-label="Next idea">→</button></div><button class="got" id="hlGot" data-learn="term">✓ Got it</button></div>
    </article>
    <section class="hg-ln" id="learnRow" aria-label="Today's three ideas"></section>
  </div>

  <div style="height:8px"></div>
</main>

{modal}{dock}

<script>
const TODAY=new Date(2026,10,12);
{js_helpers}
/* any [data-go] link (ticker items, Markets desk…) opens that part of the full brief */
document.addEventListener('click',e=>{{const g=e.target.closest('[data-go]');if(!g)return;e.preventDefault();
  if(g.dataset.go==='learn'){{const c=$('#learnCard');c.scrollIntoView({{behavior:'smooth',block:'nearest'}});c.classList.remove('pulse');void c.offsetWidth;c.classList.add('pulse');return}}
  location.href='{BRIEF}#'+g.dataset.go}});

{js_ticker}
/* ================= TODAY TIMELINE (same day list as the brief's left rail) ================= */
{js_day}function renderToday(){{const ist=istNow(),now=ist.getHours()*60+ist.getMinutes(),wd=ist.getDay(),trading=wd>0&&wd<6;
  const OPEN=555,CLOSE=930,open=trading&&now>=OPEN&&now<CLOSE;
  $('#tlCount').textContent=!trading?'Weekend':open?`Closes in ${{dur(CLOSE-now)}}`:now<OPEN?`Opens in ${{dur(OPEN-now)}}`:'Closed for today';
  $('#tlSub').textContent=open?'Market open':now<OPEN?'Pre-market':'After market';
  $('#tlFill').style.width=`${{Math.max(0,Math.min(100,(now-OPEN)/(CLOSE-OPEN)*100))}}%`;
  const wide=matchMedia('(min-width:1400px)').matches,nxt=DAY.find(d=>mins(d.t)>now),ni=nxt?DAY.indexOf(nxt):DAY.length,from=wide?0:Math.max(0,Math.min(ni-1,DAY.length-6));let grp='';
  $('#tl').innerHTML=DAY.slice(from,wide?DAY.length:from+6).map(d=>(d.g!==grp?(grp=d.g,`<li class="grp-h">${{d.g}}</li>`):'')+`<li class="${{mins(d.t)<=now?'past':''}} ${{d===nxt?'next':''}} ${{d.ev?'ev':''}}"><span class="t">${{d.t}}</span><span class="d"></span><span>${{d.b}}</span></li>`).join('')}}
renderToday();setInterval(renderToday,30000);
addEventListener('resize',()=>{{clearTimeout(window._tlr);window._tlr=setTimeout(renderToday,150)}});

{js_streak}renderStreak();

/* ================= ONE LEARNING CARD AT A TIME ================= */
const LEARN=[
 {{id:'term',kind:'Term of the day',h:'Short covering',one:'When traders who <b>bet on a fall buy back</b> to close those bets, that buying itself pushes prices up. Most FII shorts have now been covered.'}},
 {{id:'relation',kind:'Relation of the day',h:'Cheaper crude, relief for India',one:'India imports most of its oil, so <b>every drop in crude ripples outward</b>: fewer dollars spent, softer prices at home, lower costs for companies that burn or use oil.'}},
 {{id:'learning',kind:'Learning of the day',h:'Broad rallies beat narrow ones',one:'When <b>smaller companies rise more than the big index</b>, buying is spread widely, not just in a few heavyweights. That usually makes a rally sturdier.'}}];
let hi=Math.max(0,LEARN.findIndex(x=>!LRN.has(x.id)));
function hlShow(i,anim){{hi=(i+LEARN.length)%LEARN.length;const x=LEARN[hi],b=$('#hlBody');
  $('#hlKind').textContent=x.kind;$('#hlCount').textContent=`${{hi+1}} / ${{LEARN.length}}`;
  b.innerHTML=(doneToday()?`<div class="hl-done">✓ All 3 ideas learned · streak kept for today</div>`:'')+`<h3 class="term">${{x.h}}</h3><p class="one">${{x.one}}</p><a class="linkbtn" href="{BRIEF}#learn" style="font:var(--type-caption)">See the picture in the full brief →</a>`;
  $('#hlGot').dataset.learn=x.id;renderStreak();
  if(anim){{b.classList.remove('in');void b.offsetWidth;b.classList.add('in')}}}}
$('#hlPrev').onclick=()=>hlShow(hi-1,true);$('#hlNext').onclick=()=>hlShow(hi+1,true);
/* Got it → the next idea not yet learned comes up by itself (the streak handler above saves it first) */
$('#hlGot').addEventListener('click',()=>setTimeout(()=>{{if(doneToday()){{hlShow(hi,true);return}}if(!LRN.has(LEARN[hi].id))return;const k=LEARN.findIndex(x=>!LRN.has(x.id));setTimeout(()=>hlShow(k,true),450)}},0));
hlShow(hi,false);
const LVIZ={LVIZ};
$('#learnRow').innerHTML=LEARN.map(x=>`<article class="card lcard hl lr3"><div class="hc-head"><span class="eyebrow">${{x.kind}}</span></div><div class="lr3-b"><div class="lr3-t"><h3 class="term">${{x.h}}</h3><p class="one">${{x.one}}</p></div>${{LVIZ[x.id]||''}}</div><div class="hc-foot"><a class="linkbtn" href="{BRIEF}#learn" style="font:var(--type-caption)">Open in the full brief →</a><button class="got" data-learn="${{x.id}}">✓ Got it</button></div></article>`).join('');
renderStreak();

document.addEventListener('click',e=>{{const m=$('#apMenu'),b=$('#apMore');if(b.contains(e.target)){{m.hidden=!m.hidden;b.setAttribute('aria-expanded',String(!m.hidden))}}else if(!m.contains(e.target)||e.target.closest('a')){{m.hidden=true;b.setAttribute('aria-expanded','false')}}}});
/* ================= AUDIO (same file and chapters as the full brief) ================= */
const AUD=new Audio('demo/springpad-today-2026-11-12.m4a');AUD.preload='metadata';
const CH=[{{t:'Market in 30 seconds',start:0}},{{t:'Foreign investors are back',start:39.85}},{{t:'Banks lead, IT lags',start:85.79}},{{t:'Oil slips below 90 dollars',start:133.37}},{{t:'Silver and gold climb',start:174.62}},{{t:"Anthropic's giant IPO",start:204.7}},{{t:'Quick hits, term of the day, sign-off',start:239.17}}];
$('#chapters').innerHTML=CH.map((c,i)=>`<button aria-label="Chapter ${{i+1}}: ${{c.t}}"></button>`).join('');
let ch=-1,playing=false,sp=0;const mmss=t=>`${{Math.floor(t/60)}}:${{String(Math.floor(t%60)).padStart(2,'0')}}`;
function showChapter(i){{if(i===ch)return;ch=i;[...$('#chapters').children].forEach((b,j)=>b.className=j<i?'done':j===i?'now':'');$('#pSub').textContent=CH[i].t}}
function play(on){{playing=on;$('#playBtn').textContent=on?'❚❚':'▶';$('#listenBtn').textContent=on?'❚❚ Pause':'▶ Listen · 4:46';if(on){{if(ch<0)showChapter(0);AUD.play()}}else AUD.pause()}}
AUD.addEventListener('timeupdate',()=>{{const t=AUD.currentTime;let i=0;CH.forEach((c,j)=>{{if(t>=c.start)i=j}});showChapter(i);
  $('#pTitle').textContent=`Chapter ${{i+1}} of ${{CH.length}} · ${{mmss(t)}} / ${{mmss(AUD.duration||286)}}`}});
AUD.addEventListener('ended',()=>play(false));
$('#playBtn').onclick=()=>play(!playing);$('#listenBtn').onclick=()=>play(!playing);
$('#chapters').onclick=e=>{{const i=[...$('#chapters').children].indexOf(e.target);if(i>=0){{AUD.currentTime=CH[i].start+.05;ch=-1;showChapter(i);play(true)}}}};
$('#speedBtn').onclick=e=>{{sp=(sp+1)%3;AUD.playbackRate=[1,1.25,1.5][sp];e.target.textContent=['1x','1.25x','1.5x'][sp]}};
</script>
</body>
</html>
"""
out=head+CSS+body
# the dock's Transcript button points at the brief
out=out.replace('<button class="iconbtn" data-go="brief">Transcript</button>',f'<a class="iconbtn" href="{BRIEF}#brief" style="text-decoration:none">Full brief</a>')
open(B+"home-2026-11-12.html","w",encoding="utf-8").write(out)
print("written",len(out))
