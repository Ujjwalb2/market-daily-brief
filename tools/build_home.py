import re, json
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
calmodal=cut('<div class="calmodal" id="calModal"','<div class="calmodal" id="stkModal"')
js_cal=cut('/* ================= CALENDAR','/* ================= MINI CALENDAR')
js_cal_open=cut('function openCal(){','/* ================= STREAK')
dock=cut('<div class="dock"','\n\n<script>')
js_helpers=cut('/* ================= helpers','/* ================= hero')
js_ticker=cut('/* ================= LIVE TICKER','/* ================= SIDE RAILS')
js_day=cut('const DAY=[','function renderClock')
js_streak=cut('/* ================= STREAK','renderStreak();\n\n/* RIGHT RAIL')
js_events=cut('const TYPES=','const STORIES=')
def _block(start):
    k=s.index(start);depth=0
    for m in re.finditer(r'<div\b|</div>', s[k:]):
        depth += 1 if m.group().startswith('<div') else -1
        if depth==0: return s[k:k+m.end()]
MV_LIST=_block('<div class="mv-list"')
MV_DATA=json.dumps([{'n':n.replace('&amp;','&'),'v':float(v.replace('−','-').replace('%','').replace('+',''))} for n,v in re.findall(r'class="nm">([^<]*)</span>.*?<b>([^<]*)</b>', MV_LIST)],ensure_ascii=False)
SEC_DATA=json.dumps([{'n':n,'v':float(v)} for n,v in re.findall(r"\['([^']+)',(-?[\d.]+)\]", s[s.index("$('#heat').innerHTML="):s.index(".join('');",s.index("$('#heat').innerHTML="))])])
js_heat=s[s.index("$('#heat').innerHTML="):s.index(".join('');",s.index("$('#heat').innerHTML="))+len(".join('');")]

import re as _re
STORY_TOC=json.dumps([{'h':h,'d':d} for h,d in _re.findall(r"h:'([^']*)',n:.*?dur:'([^']*)'", cut('const STORIES=[','\n];'))],ensure_ascii=False)

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
  f'<div class="home-cta"><a class="btn primary read-cta" href="{BRIEF}#brief">Read today\'s full brief →</a>'
  '<button class="btn ghost listen-cta" id="listenBtn">▶ Listen · 4:46</button></div>'
  '<div class="toc"><div class="toc-h"><span class="eyebrow">In today\'s brief</span><span>5 stories · tap one to hear it</span></div><ol id="toc"></ol></div>',hero,count=1,flags=re.S)
hero=hero.replace('<span class="src">Today\'s numbers arrive after the 3:30 pm close</span>','')
def _bal(h, start):
    k = h.index(start); depth = 0
    for m in re.finditer(r'<div\b|</div>', h[k:]):
        depth += 1 if m.group().startswith('<div') else -1
        if depth == 0: return h[k:k + m.end()]
_strip = _bal(hero, '<div class="idx-strip"')
_br = re.search(r'<div class="idx-src">.*?</div>', _strip).group(0)  # becomes the breadth bar below
hero = hero.replace(_strip, '''<div class="ixc">
  <div class="ixc-top"><label class="ixc-sel"><span class="sr">Index</span><select id="ixSel" aria-label="Choose index"><option value="0">Nifty 50</option><option value="1">Nifty Bank</option><option value="2">Midcap 100</option><option value="3">Smallcap 100</option><option value="4">India VIX</option><option value="5">Nifty 500</option><option value="6">Nifty Next 50</option><option value="7">Fin Services</option><option value="8">Nifty IT</option></select></label><span class="ixc-rng" id="ixM">1M</span></div>
  <div class="ixc-val"><b id="ixVal">–</b><span class="up" id="ixChg"></span></div>
  <div class="ixc-ch" id="ixCh" role="img" aria-label="One-month chart"></div>
</div>''' + _br, 1)
hero=hero.replace('<div class="eyebrow">Good morning · Edition 144</div>','<div class="eyebrow">Good morning · FIIs back, banks led</div>')
hero=hero.replace('<span class="eyebrow">Markets · Wed 11 Nov close</span>','<span class="eyebrow">Markets · 11 Nov close</span>')
hero=hero.replace('<div class="idx-src">Wednesday 11 Nov close · Source: NSE closing index data</div>','<div class="breadth"><div class="br-h"><span class="eyebrow">Breadth · rose vs fell</span><b>2.5 : 1</b></div><div class="br-bar" role="img" aria-label="2,085 rose, 24 unchanged, 835 fell"><i class="u" style="width:70.8%"></i><i class="f" style="width:0.8%"></i><i class="d" style="width:28.4%"></i></div><div class="br-l"><span>▲ 2,085 rose</span><span>24 flat</span><span>▼ 835 fell</span></div></div><div class="idx-src">Wednesday 11 Nov close · Source: NSE closing index data and bhavcopy</div>')
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
.hl.spot{animation:hlSpot 1.8s ease}
@keyframes hlSpot{0%,40%{box-shadow:0 0 0 3px var(--action-primary),0 0 24px rgba(99,102,241,.45)}100%{box-shadow:0 0 0 0 transparent}}
@media (prefers-reduced-motion:reduce){.hl.spot{animation:none;box-shadow:0 0 0 3px var(--action-primary)}}
#hlGot:focus-visible{outline:2px solid var(--action-primary);outline-offset:2px}
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
  .hg{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-areas:"s s s s" "tc c mk tl" "fo one dl bk"}
  .hg-dl{display:flex!important}
  .hg-ln{display:none!important}
  .hg-ln .card{padding:var(--space-16) var(--space-20)}
  .hg-c{display:flex}.hg-c .hero{flex:1;align-items:stretch}.hg-c .hero-main,.hg-c .hero-side,.hg-c .idx-card{height:100%}
  .tc-more,.tc-others{display:grid;gap:8px}
  .tl .grp-h{display:block;margin-top:6px;font:600 10px/1 var(--font-sans);letter-spacing:.8px;text-transform:uppercase;color:var(--text-tertiary)}
  .hg-tl .tl{gap:3px}
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

@media (min-width:1400px) and (max-height:1000px){
  .hg-tc .tc-why{display:none}
  .lr3 .one{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .lr3 .lviz{zoom:.8}
  .lr3-b{grid-template-columns:minmax(0,1fr) minmax(230px,50%)}
}
/* ticker under the header */
body > .ticker{top:55px;z-index:39}
/* streak in the spotlight */
.home .stk-strip{padding:14px 22px;gap:26px;background:linear-gradient(90deg,var(--fb-warning-soft),var(--fin-positive-soft));border:1px solid rgba(240,160,75,.45);box-shadow:0 6px 20px rgba(240,160,75,.12)}
.home .stk-strip .flame{width:54px;height:54px;border-radius:14px;background:var(--surface-raised)}
.home .stk-strip .flame svg{width:32px!important;height:32px!important}
.home .ss-n{gap:12px}.home .ss-n b{font:700 40px/1 var(--font-sans)}
.home .ss-hi{font:700 16px/1.3 var(--font-sans)}
.home .stk-strip .days div{width:28px}.home .stk-strip .days i{width:28px;height:28px}
.home .stk-strip .stk-goal{padding:10px 14px;font:500 14px/1.3 var(--font-sans);background:var(--surface-raised);border-color:rgba(240,160,75,.45)}
.home .stk-strip .stk-goal.done{border-color:rgba(0,201,154,.5)}
.home .stk-strip .stk-goal{margin:0 auto!important}
.home .stk-strip .stk-goal .linkbtn{display:inline-flex;align-items:center;height:28px;padding:0 12px;margin-left:6px;border-radius:var(--radius-pill);background:var(--action-primary);color:var(--action-on-primary);text-decoration:none;font:600 13px/1 var(--font-sans)}
.home .stk-strip .pips i{width:22px;height:8px;border-radius:4px}
.home .ss-ms{font:600 12px/1.3 var(--font-sans);color:var(--text-secondary)}
/* centre cards: no empty band at the bottom */
.hg-c .hero-main{display:flex;flex-direction:column}
.hg-c .hero-main .hero-row{margin-top:auto}
.hg-c .idx-card .idx-src{margin-top:8px}

/* fill: story list, breadth, coming up */
.toc{margin-top:10px;display:grid;gap:4px}
.toc-h{display:flex;align-items:baseline;gap:10px}.toc-h>span:last-child{font:var(--type-caption);color:var(--text-tertiary)}
.toc ol{list-style:none;margin:0;padding:0;display:grid;gap:0}
.toc button{display:grid;grid-template-columns:18px 1fr auto;gap:8px;align-items:center;width:100%;padding:2px 6px;border:0;border-radius:var(--radius-6);background:none;color:var(--text-primary);font:500 13px/1.35 var(--font-sans);text-align:left;cursor:pointer}
.toc button:hover{background:var(--surface-hover)}
.toc .n{display:grid;place-items:center;width:17px;height:17px;border-radius:50%;background:var(--surface-glass);border:1px solid var(--border-decorative);font:600 11px/1 var(--font-sans);color:var(--text-secondary)}
.toc .h{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.toc .d{font:var(--type-caption);color:var(--text-tertiary);font-variant-numeric:tabular-nums}
.breadth{grid-column:1/-1;margin-top:auto;padding-top:10px;display:grid;gap:6px}
.br-h{display:flex;justify-content:space-between;align-items:baseline}.br-h b{font:600 16px/1 var(--font-sans);font-variant-numeric:tabular-nums}
.br-bar{display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px}
.br-bar .u{background:var(--teal)}.br-bar .f{background:var(--border-control)}.br-bar .d{background:var(--slate-500)}
.br-l{display:flex;justify-content:space-between;font:var(--type-caption);color:var(--text-secondary);font-variant-numeric:tabular-nums}
.home .idx-card .idx-src{margin-top:8px}
.tl-next{margin-top:auto;padding-top:10px;border-top:1px solid var(--border-decorative);display:grid;gap:6px}
.tl-next ul{list-style:none;margin:0;padding:0;display:grid;gap:5px}
.tl-next li{display:grid;grid-template-columns:44px 1fr;gap:8px;font:var(--type-caption);color:var(--text-secondary)}
.tl-next li .t{color:var(--text-tertiary)}
.tl-next .linkbtn{font:var(--type-caption)}
.hg-tl .tl-next+.hc-foot{margin-top:6px}
@media (max-width:1399px){.home .toc,.home .breadth,.home .tl-next{display:none}}

@media (min-width:1400px) and (max-height:920px){.home .tl-next{display:none}.toc li:nth-child(n+4){display:none}.toc-h>span:last-child{display:none}}
/* ---------- v3: merged summary block, highlighted Read, deals card, rotating learning ---------- */
.hg-dl{grid-area:dl;display:none}
.hg-c .hero{background:var(--surface-raised);border:1px solid var(--border-decorative);border-radius:var(--radius-20);gap:0;overflow:hidden}
.hg-c .hero-main{border:none;border-radius:0;background:none}
.hg-c .hero-side{border-left:1px solid var(--border-decorative);gap:0}
.hg-c .idx-card{border:none;box-shadow:none;background:none;border-radius:0;padding:var(--space-16) var(--space-20)}
.read-cta{height:44px;padding:0 22px;font:600 15px/1 var(--font-sans);box-shadow:0 6px 18px rgba(63,91,217,.35);display:inline-flex;align-items:center}
.read-cta:hover{transform:translateY(-1px)}
.listen-cta{height:44px}
.hl-grid{display:grid;gap:10px}
.hl-t{display:grid;gap:6px;align-content:start}
.hl .lviz{min-height:0;padding:8px 10px;gap:5px}
.hl .lviz .cap{font-size:11px}.hl .lviz .cap .linkbtn{font:inherit}
.hl .lviz svg{max-height:120px}
.hl .lrow{grid-template-columns:72px 1fr 50px;font-size:11px}
.hl .cause{grid-template-columns:1fr;padding:5px 8px}.hl .cause svg{display:none}.hl .cause b{font-size:14px}
.hl .effects{grid-template-columns:repeat(3,1fr);gap:4px}.hl .lviz>svg:not(:first-child){display:none}
.hl .effects>*{padding:4px 5px!important;font-size:10.5px;line-height:1.25}
.hl-dots{display:flex;gap:4px}.hl-dots i{width:8px;height:8px;border-radius:50%;background:var(--border-decorative)}
.hl-dots i.done{background:var(--teal)}.hl-dots i.on{box-shadow:0 0 0 2px var(--action-primary)}
.hl-all{font:600 12.5px/1 var(--font-sans);color:var(--action-primary);text-decoration:none;white-space:nowrap}
.hl .hc-foot{gap:10px}
.dl3{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.dl3 li{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"who k" "bar v";gap:4px 10px;align-items:center}
.dl3 li>div{grid-area:who;min-width:0}.dl3 li>div b{font:var(--type-label)}.dl3 li>div small{display:block;font:var(--type-caption);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dl3 .dk{grid-area:k;font:600 10px/1 var(--font-sans);text-transform:uppercase;letter-spacing:.5px;padding:4px 6px;border-radius:var(--radius-6)}
.dl3 .dk.t{background:var(--surface-glass);border:1px solid var(--border-decorative)}.dl3 .dk.k{background:var(--fb-info-soft)}.dl3 .dk.b{background:var(--fin-positive-soft)}
.dl3 .bar{grid-area:bar;height:8px;border-radius:4px;background:var(--border-decorative);overflow:hidden}.dl3 .bar i{display:block;height:100%;background:var(--blue)}
.dl3 .v{grid-area:v;font:var(--type-data);font-variant-numeric:tabular-nums;text-align:right}
@media (min-width:1400px){
  .hl-grid{grid-template-columns:minmax(0,1fr) minmax(200px,48%);align-items:start}
  .hg-tc .tc-why,.hg-tc .tc-others,.hg-tc .tc-meta2{display:grid!important}
  .home .tl-next{display:grid!important}
  .toc li{display:list-item!important}
}
@media (max-width:1399px){.hl .lviz,.hl-all,.hl-dots{display:none}.hg>.hg-dl{display:none}}

.tc-an{display:none}
@media (min-width:1400px){
  .hg-tc .tc-why{display:none!important}
  .tc-an{display:grid;gap:4px}.tc-an p{margin:0;font:var(--type-caption);line-height:1.5;color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:9;-webkit-box-orient:vertical;overflow:hidden}
  .hg-one .lviz{zoom:.82}
  .dl3{gap:8px}
  .dl3 li>div{display:flex;gap:8px;align-items:baseline}
  .dl3 li>div small{display:inline;min-width:0}
}
@media (min-width:1400px) and (max-height:920px){.tc-an p{-webkit-line-clamp:5}.home .toc li:nth-child(n+4){display:none!important}.hg-one .lviz{display:none}.hg-one .hl-grid{grid-template-columns:1fr}.hg-dl .mv-ref{display:none}.hg-dl .hc-head .src{display:none}}

/* movers + sectors in the bottom slot (compact) */
.hg-dl.movers{gap:6px}
.hg-dl .mv-list{margin-top:0}
.hg-dl .mv-row,.hg-dl .mv-ref{padding:3px 0;grid-template-columns:12px minmax(0,1fr) 38% 54px;gap:8px}
.hg-dl .mv-row{font:500 13px/1.3 var(--font-sans)}
.hg-dl .mv-row .bar{height:9px}
.hg-dl .mv-sec{margin-top:4px;padding-top:8px;border-top:1px solid var(--border-decorative);display:grid;gap:4px}
.hg-dl .heat{margin-top:2px}
.hg-dl .heat div{min-height:0;padding:5px 6px;font-size:11px}
.hg-dl .heat div b{font-size:12.5px}
@media (min-width:1400px){
  .hg-dl.movers{display:grid!important;grid-template-columns:minmax(0,1fr) 156px;grid-template-rows:auto 1fr auto;column-gap:16px;row-gap:6px;align-content:start}
  .hg-dl.movers>.hc-head:first-child{grid-column:1/-1}
  .hg-dl .mv-list{grid-column:1;grid-row:2}
  .hg-dl .mv-sec{grid-column:2;grid-row:2;margin:0;padding:0 0 0 14px;border-top:none;border-left:1px solid var(--border-decorative);align-content:start}
  .hg-dl .mv-sec .linkbtn{display:none}
  .hg-dl .heat{grid-template-columns:1fr!important;gap:2px}
  .hg-dl .heat div{display:flex;justify-content:space-between;align-items:baseline;gap:6px;padding:3px 7px;white-space:nowrap;font-size:11px}
  .hg-dl .heat div b{font-size:11.5px}
}

/* Baskets (bottom right) */
.hg-bk{grid-area:bk}.hg>.hg-bk{display:none}
.bk-sub{margin:-4px 0 0;font:var(--type-caption);color:var(--text-tertiary)}
.bk-list{list-style:none;margin:0;padding:0;display:grid;gap:0}
.bk-list li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-decorative)}.bk-list li:last-child{border-bottom:none}
.bk-build{font:600 12px/1 var(--font-sans);padding:7px 10px;border-radius:var(--radius-6);background:#E8762B;color:#fff;text-decoration:none;white-space:nowrap}
.bk-ic{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;font:700 11px/1 var(--font-sans);color:var(--text-primary)}
.bk-list b{display:block;font:var(--type-label);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bk-list small{display:block;font:var(--type-caption);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bk-r{text-align:right;font:600 15px/1.2 var(--font-sans);font-variant-numeric:tabular-nums}.bk-r.up{color:var(--teal)}.bk-r.dn{color:var(--red)}
.bk-r small{font-size:10px;text-align:right}
.bk-tabs{display:flex;gap:6px;flex-wrap:wrap}.bk-tabs span{font:500 11px/1 var(--font-sans);padding:5px 8px;border-radius:var(--radius-pill);border:1px solid var(--border-decorative);color:var(--text-secondary)}
@media (min-width:1400px){
  .hg>.hg-bk{display:flex}
  .hg-tl .tl-next li:nth-child(n+3){display:none}
}
@media (min-width:1400px) and (max-height:920px){.bk-tabs,.bk-sub{display:none}.home .hg-tl .tl-next{display:none!important}.bk-list small{display:none}.hg-bk .hc-foot>span{display:none}}

@media (min-width:1400px) and (max-width:1700px){.hg-dl .mv-row,.hg-dl .mv-ref{grid-template-columns:12px minmax(0,1fr) 20% 50px;gap:6px}.hg-dl.movers{grid-template-columns:minmax(0,1fr) 132px!important}.hg-dl .heat div{padding:3px 5px}}
/* movers v2: one chart, Nifty 100 / Sectors switch, bars from a zero line */
.mvx{gap:8px}
.seg2{display:inline-flex;padding:2px;border-radius:var(--radius-pill);background:var(--surface-glass);border:1px solid var(--border-decorative)}
.seg2 button{border:0;background:none;color:var(--text-secondary);font:600 11.5px/1 var(--font-sans);padding:6px 10px;border-radius:var(--radius-pill);cursor:pointer}
.seg2 button.on{background:var(--surface-raised);color:var(--text-primary);box-shadow:0 1px 3px rgba(0,0,0,.15)}
.mvx-list{display:grid;gap:2px}
.mvx-list.in{animation:hlIn .35s ease}
.mvx-r{display:grid;grid-template-columns:minmax(0,1fr) minmax(90px,34%) 56px;gap:10px;align-items:center;padding:3px 0;font:500 13px/1.3 var(--font-sans)}
.mvx-r .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary)}
.mvx-r .b{display:grid;grid-template-columns:1fr 1fr;height:12px}
.mvx-r .b i{display:flex}.mvx-r .b .l{justify-content:flex-end;border-right:1.5px solid var(--text-tertiary)}
.mvx-r .b em{display:block;height:100%}
.mvx-r.u .b em{background:var(--teal);border-radius:0 3px 3px 0}
.mvx-r.d .b em{background:var(--slate-500);border-radius:3px 0 0 3px}
.mvx-r b{text-align:right;font:600 13px/1 var(--font-sans);font-variant-numeric:tabular-nums}
.mvx-r.u b{color:var(--teal)}
.mvx-foot{margin-top:auto;font:var(--type-caption);color:var(--text-tertiary)}.mvx-foot b{color:var(--text-secondary)}

@media (min-width:1400px) and (max-height:920px){.mvx-r{padding:1px 0}.mvx{gap:6px}}
/* less text on Home: the full brief keeps the long copy */
.home .toc{display:none!important}
@media (min-width:1400px) and (min-height:921px){
  .home .hero-main{display:flex;flex-direction:column}
  .home .hero .hero-main h1{font:600 44px/1.1 var(--font-sans);letter-spacing:-.6px;margin:8px 0 14px}
  .home .hero-main .home-cta{margin-top:auto;margin-bottom:auto;padding:12px 0}
  .home .hero-main .home-cta .btn{padding:14px 24px;font-size:15px}
  .home .mood-mini .mood-scale{display:flex!important}
}
.home .dayline,.home .mood-mini .src,.home .idx-src,.hl .lviz .cap{display:none!important}
.tc-sig{list-style:none;margin:0;padding:0;display:grid;gap:0}
.tc-sig li{display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--border-decorative);font:500 13px/1.2 var(--font-sans);color:var(--text-primary)}
.tc-sig li:last-child{border-bottom:none}
.tc-sig i{font-style:normal;font:700 10px/1 var(--font-sans);display:grid;place-items:center;width:18px;height:18px;border-radius:5px}
.tc-sig i.dn{background:var(--surface-glass);color:var(--slate-500)}
.tc-sig i.wa{background:var(--fb-warning-soft);color:var(--amber)}
.tc-sig b{font:600 12px/1 var(--font-sans);color:var(--text-secondary);font-variant-numeric:tabular-nums;white-space:nowrap}

.tc-lvl{display:none}
@media (min-width:1400px){.tc-lvl{display:flex;flex-direction:column;gap:6px;flex:1 1 auto;min-height:0}.tc-lvl svg{width:100%;height:auto;max-height:170px}}
@media (min-width:1400px) and (max-height:880px){.tc-lvl{display:none}}

/* F&O levels (bottom left) */
@media (min-width:1400px){.hg-tc .tc-more{flex:1 1 auto;align-content:space-evenly}}
.hg-fo{grid-area:fo}.hg>.hg-fo{display:none}
@media (min-width:1400px){.hg>.hg-fo{display:flex}}
.fo-exp{font:600 11px/1 var(--font-sans);padding:5px 8px;border-radius:var(--radius-pill);background:var(--fb-warning-soft);color:var(--amber);white-space:nowrap}
.fo-k{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.fo-k>div{display:grid;gap:2px;padding:7px 9px;border-radius:var(--radius-8);background:var(--surface-glass);border:1px solid var(--border-decorative)}
.fo-k span{font:600 10.5px/1.2 var(--font-sans);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.6px}
.fo-k b{font:600 17px/1.2 var(--font-sans);font-variant-numeric:tabular-nums}
.fo-k small{font:var(--type-caption);color:var(--text-tertiary)}
.fo-k .s b{color:var(--teal)}.fo-k .r b{color:var(--slate-500)}
.fo-ch{flex:1 1 0;min-height:64px;position:relative}.fo-ch svg{position:absolute;inset:0;width:100%;height:100%}
.fo-lg{display:flex;gap:12px;font:var(--type-caption);color:var(--text-tertiary)}.fo-lg span:last-child{margin-left:auto}
.fo-lg i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px;vertical-align:0}.fo-lg i.p{background:var(--teal)}.fo-lg i.c{background:var(--slate-500)}
@media (min-width:1400px) and (max-width:1799px){.fo-k small,.fo-lg span:last-child{display:none}.fo-k b{font-size:15px}.fo-k>div{padding:6px 7px}}
@media (min-width:1400px) and (max-height:920px){.fo-k small{display:none}.hg-fo .hc-foot>span{display:none}}

/* rotating cards never resize the grid: their size comes from the row, not their content */
@media (min-width:1400px){.hg>.hg-one{contain:size;overflow:hidden}}
@media (min-width:1400px){.hg-one .lviz .cause .chg,.hg-one .lviz .fan{display:none}.hg-one .lviz .effects{gap:4px}.hg-one .lviz .effect{font-size:11px;padding:4px 7px;line-height:1.25}}
@media (min-width:1400px){#hlBody{flex:1 1 0;min-height:0;overflow:hidden}.hg-one>.hc-foot{flex:none;margin-top:0}}
/* Trade Calls rotation */
.tc-body{display:flex;flex-direction:column;gap:10px;flex:1 1 auto;min-height:0}
.tc-body.in{animation:hlIn .35s ease}
@media (prefers-reduced-motion:reduce){.tc-body.in{animation:none}}
.tc-legs2 small{font:600 11px/1 var(--font-sans);color:var(--text-tertiary);margin-left:2px;white-space:nowrap}.tc-legs2>div{white-space:nowrap}
.tc-dots{display:flex!important}.tc-dots i{cursor:pointer}

/* trade call risk row: max profit / max loss / capital */
.tc-risk{display:grid;grid-template-columns:1fr 1.25fr 1fr;gap:6px;padding:8px 10px;border-radius:var(--radius-8);background:var(--navy-900);color:var(--white)}
.tc-risk>div{display:flex!important;flex-direction:column;gap:3px;min-width:0;align-items:stretch!important}.tc-risk>div>b,.tc-risk>div>span{display:block!important;width:auto!important;max-width:100%;text-align:left!important}
.tc-risk span{font:600 9.5px/1 var(--font-sans);letter-spacing:.6px;text-transform:uppercase;color:rgba(255,255,255,.6)}
.tc-risk b{font:600 13.5px/1.15 var(--font-sans);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:visible;padding-left:1px}
.tc-risk b.rk-up{color:#5fd3b5}.tc-risk b.rk-dn{color:#ff8a8a}.tc-risk b.x{font-size:12px}
.tc-flag{display:inline-grid;place-items:center;width:13px;height:13px;margin-left:3px;border-radius:50%;background:var(--amber);color:#1a1a1a;font:700 9px/1 var(--font-sans);font-style:normal;vertical-align:1px;cursor:help}
.tc-note{margin:0;font:var(--type-caption);color:var(--amber)}

/* Markets card: tabbed one-month chart */
.ixc{display:flex;flex-direction:column;gap:8px;flex:1 1 auto;min-height:0}
.ixc-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ixc-rng{font:var(--type-caption);color:var(--text-tertiary);white-space:nowrap}
.ixc-val{display:flex;align-items:baseline;gap:8px;white-space:nowrap}
.ixc-val b{font:600 22px/1.1 var(--font-sans);font-variant-numeric:tabular-nums}
.ixc-val .up{font:600 13px/1 var(--font-sans);color:var(--teal)}
.ixc-tabs button{white-space:nowrap}.ixc-rng{min-width:0;flex:none}
@media (min-width:1400px) and (max-width:1799px){.ixc-rng .dc{display:none}.ixc-tabs button{padding:6px 8px}}
.ixc-rng b.up{color:var(--teal)}.ixc-rng b.dn2{color:var(--red)}
.ixc-ch{position:relative;flex:1 1 0;min-height:64px;margin-bottom:14px}
.ixc-ch svg{position:absolute;inset:0;width:100%;height:100%}
.ixc-ch .yl{position:absolute;right:0;transform:translateY(-50%);font:500 10px/1 var(--font-sans);color:var(--text-tertiary);font-variant-numeric:tabular-nums}
.ixc-ch .tag{position:absolute;right:0;transform:translateY(-50%);padding:3px 5px;border-radius:4px;font:700 10.5px/1 var(--font-sans);color:#fff;font-variant-numeric:tabular-nums;z-index:1}
.ixc-ch .xl{position:absolute;bottom:-14px;transform:translateX(-50%);font:500 10px/1 var(--font-sans);color:var(--text-tertiary);white-space:nowrap}
.ixc-chips{display:flex;flex-wrap:wrap;gap:4px 10px;font:500 11.5px/1.3 var(--font-sans);color:var(--text-secondary)}
.ixc-chips b{font-weight:600}.ixc-chips b.up{color:var(--teal)}.ixc-chips .vix b{color:var(--amber)}
.hg-c .hero-side .breadth{margin-top:0}
@media (max-width:1399px){.ixc-ch{min-height:110px}}

.ixc-sel{position:relative;display:inline-flex}
.ixc-sel .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.ixc-sel select{appearance:none;-webkit-appearance:none;font:600 13px/1 var(--font-sans);color:var(--text-primary);background:var(--surface-glass);border:1px solid var(--border-decorative);border-radius:var(--radius-pill);padding:7px 30px 7px 12px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);background-position:calc(100% - 15px) 50%,calc(100% - 10px) 50%;background-size:5px 5px;background-repeat:no-repeat}
.ixc-sel select:focus-visible{outline:2px solid var(--action-primary);outline-offset:2px}
.ixc-sel option{color:#111;background:#fff}
.ixc-val .vix{font:600 13px/1 var(--font-sans);color:var(--amber)}.ixc-val .dn2{font:600 13px/1 var(--font-sans);color:var(--red)}
.ixc-rng b.vixb{color:var(--amber)}

/* OI buildup view */
.oib{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:6px;height:100%}
.oib-q{display:flex;flex-direction:column;gap:1px;justify-content:center;padding:4px 8px;border-radius:var(--radius-8);background:var(--surface-glass);border:1px solid var(--border-decorative);border-left:3px solid var(--teal);min-width:0;overflow:hidden}
.oib-q.d{border-left-color:var(--slate-500)}
.oib-h{display:flex;justify-content:space-between;align-items:baseline;gap:6px}.oib-h b{font:600 12.5px/1.2 var(--font-sans)}
.oib-n{font:700 16px/1 var(--font-sans);font-variant-numeric:tabular-nums}
.oib-s{font:500 10.5px/1.2 var(--font-sans);color:var(--text-tertiary)}
.oib-t{font:500 11px/1.3 var(--font-sans);color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.oib-t em{font-style:normal;color:var(--text-tertiary)}
.mvx .seg2{flex:none}.mvx .seg2 button{padding:5px 8px;font-size:11px;white-space:nowrap}
/* daily poll */
.poll{display:flex;align-items:center;gap:6px;white-space:nowrap}
.poll-q{font:600 13px/1 var(--font-sans);color:var(--text-primary)}.poll-q b{font-weight:700}
.poll button{border:1px solid var(--border-decorative);background:var(--surface-raised);color:var(--text-primary);font:600 12px/1 var(--font-sans);padding:7px 10px;border-radius:var(--radius-pill);cursor:pointer}
.poll button:hover{border-color:var(--action-primary)}
.poll-bar{display:flex;width:90px;height:8px;border-radius:4px;overflow:hidden;background:var(--surface-glass)}
.poll-bar i{display:block;height:100%;opacity:.45}.poll-bar i.me{opacity:1}
.poll-bar .up{background:var(--teal)}.poll-bar .flat{background:var(--slate-400,#94a3b8)}.poll-bar .down{background:var(--red)}
.poll-r{font:500 12px/1 var(--font-sans);color:var(--text-secondary)}.poll-r small{color:var(--text-tertiary)}
@media (max-width:1799px){.poll-bar,.poll-t,.poll-r small{display:none}.home .stk-strip{gap:16px}.poll button{padding:6px 8px}}
@media (max-width:1599px){.home .stk-strip .ss-n span em+*,.home .stk-strip .ss-ms{display:none}}
@media (max-width:1399px){.poll .poll-bar,.poll-r{display:none}.home .stk-strip .ss-days{display:none}}
/* what is this? */
.ibtn{flex:none;display:inline-grid;place-items:center;width:16px;height:16px;margin-left:6px;margin-right:auto;border-radius:50%;border:1px solid var(--border-decorative);background:none;color:var(--text-tertiary);font:italic 700 10px/1 Georgia,serif;cursor:pointer;padding:0}
.ibtn:hover,.ibtn[aria-expanded=true]{color:var(--action-primary);border-color:var(--action-primary)}
.ipop{position:fixed;z-index:200;width:min(320px,calc(100vw - 16px));padding:12px 14px;border-radius:var(--radius-12);background:var(--surface-raised);border:1px solid var(--border-decorative);box-shadow:0 12px 32px rgba(0,0,0,.35);font:var(--type-caption);color:var(--text-secondary)}
.ipop b{display:block;margin-bottom:4px;font:600 13px/1.3 var(--font-sans);color:var(--text-primary)}.ipop p{margin:0 0 6px;line-height:1.5}.ipop small{color:var(--text-tertiary)}

/* Market scan (below the first screen) */
.scan{margin:56px 0 90px}
.scan-h{display:flex;align-items:baseline;gap:12px;margin:0 2px 10px}
.scan-h h2{margin:0;font:600 18px/1.2 var(--font-sans);color:var(--text-primary)}
.scan-h span{font:var(--type-caption);color:var(--text-tertiary)}
.scan-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--space-16)}
.sc{display:flex;flex-direction:column;gap:10px;padding:var(--space-16) var(--space-20)}
.sc .hc-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.sc-k{font:var(--type-caption);color:var(--text-tertiary);white-space:nowrap}
.sc-cnt{font:700 13px/1 var(--font-sans);white-space:nowrap}.sc-cnt.sc-hic{color:var(--teal)}.sc-cnt.sc-loc{color:var(--red)}
.sc ul{list-style:none;margin:0;padding:0;display:grid;gap:7px}
.sc-f{margin-top:auto;padding-top:8px;border-top:1px solid var(--border-decorative)}.sc-f a{font:600 12.5px/1 var(--font-sans);color:var(--action-primary);text-decoration:none;white-space:nowrap}.sc-f a:hover{text-decoration:underline}.sc-f span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.sc li{display:grid;grid-template-columns:minmax(0,1fr) 60px auto 58px;gap:8px;align-items:center;font:500 13px/1.2 var(--font-sans)}
.sc-hi li,.sc-lo li{grid-template-columns:minmax(0,1fr) 90px 58px}.sc-hi .sc-v,.sc-lo .sc-v{display:none}
.sc-n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary)}
.sc-b{height:8px;border-radius:4px;background:var(--surface-glass);overflow:hidden}.sc-b i{display:block;height:100%;background:var(--indigo-500,#6366f1);border-radius:4px}
.sc-hi .sc-b i{background:var(--teal)}.sc-lo .sc-b i{background:var(--red)}
.sc-v{font:600 12.5px/1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary);white-space:nowrap}.sc-v small{color:var(--teal);font-weight:600}
.sc-c{text-align:right;font:600 12.5px/1 var(--font-sans);font-variant-numeric:tabular-nums}.sc-c.u{color:var(--teal)}.sc-c.d{color:var(--red)}
@media (max-width:1399px){.scan-g{grid-template-columns:repeat(2,minmax(0,1fr))}}
.scan-cue{position:fixed;left:50%;bottom:58px;transform:translateX(-50%);z-index:40;padding:7px 14px;border-radius:var(--radius-pill);background:var(--surface-raised);border:1px solid var(--border-decorative);box-shadow:0 6px 18px rgba(0,0,0,.3);font:600 12px/1 var(--font-sans);color:var(--text-secondary);text-decoration:none;transition:opacity .2s}
.scan-cue:hover{color:var(--text-primary);border-color:var(--action-primary)}
.scan-cue.gone{opacity:0;pointer-events:none}
@media (prefers-reduced-motion:reduce){.scan-cue{transition:none}}

/* What's happening: filings grouped into three columns, plus the streak leaderboard */
.wh{margin:8px 0 90px}
.scan{margin-bottom:24px!important}
.wh-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--space-16);align-items:stretch}
.wh-col{display:flex;flex-direction:column;gap:8px;padding:var(--space-16) var(--space-20);border-top:3px solid var(--teal)}
.wh-col.b{border-top-color:var(--action-primary)}.wh-col.w{border-top-color:var(--amber)}
.wh-col .hc-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.wh-n{font:700 12px/1 var(--font-sans);padding:4px 8px;border-radius:var(--radius-pill);background:var(--surface-glass);color:var(--text-secondary)}
.wh-list{list-style:none;margin:0;padding:0;display:grid}
.wh-i{display:grid;gap:3px;padding:8px 0;text-decoration:none;color:inherit;border-bottom:1px solid var(--border-decorative)}
.wh-list li:last-child .wh-i{border-bottom:none}
.wh-i:hover .wh-l{color:var(--text-primary)}.wh-i:hover b{color:var(--action-primary)}.wh-i:focus-visible{outline:2px solid var(--action-primary);outline-offset:2px;border-radius:4px}
.wh-m{display:flex;align-items:center;gap:6px;min-width:0}
.wh-m b{font:700 12.5px/1 var(--font-sans);letter-spacing:.3px;color:var(--text-primary)}
.wh-m time{margin-left:auto;font:500 11px/1 var(--font-sans);color:var(--text-tertiary);font-variant-numeric:tabular-nums}
.wh-fo{font:700 9.5px/1 var(--font-sans);padding:3px 5px;border-radius:4px;background:var(--indigo-soft);color:var(--text-secondary)}
.wh-l{font:500 12.5px/1.4 var(--font-sans);color:var(--text-secondary)}
.lb{display:flex;flex-direction:column;gap:8px;padding:var(--space-16) var(--space-20);border-top:3px solid #E8762B}
.lb .hc-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.lb-tag{font:600 10.5px/1 var(--font-sans);padding:4px 8px;border-radius:var(--radius-pill);background:var(--surface-glass);color:var(--text-tertiary)}
.lb-list{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.lb-list li,.lb-you{display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-decorative)}
.lb-list li:last-child{border-bottom:none}
.lb-r{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--surface-glass);font:700 11px/1 var(--font-sans);color:var(--text-secondary)}
.lb-list li:nth-child(1) .lb-r{background:#F5C451;color:#3a2a00}.lb-list li:nth-child(2) .lb-r{background:#C9D1DA;color:#22303c}.lb-list li:nth-child(3) .lb-r{background:#D9A274;color:#3a1f08}
.lb-n{font:600 13px/1.2 var(--font-sans);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lb-n small{margin-left:6px;font:500 11px/1 var(--font-sans);color:var(--text-tertiary)}
.lb-s{font:700 13px/1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary);white-space:nowrap}.lb-s i{font-style:normal;margin-left:3px}
.lb-you{margin-top:auto;border:1px solid rgba(240,160,75,.45);border-radius:var(--radius-8);padding:6px 8px;background:var(--fb-warning-soft)}
.lb-you .lb-r{width:auto;min-width:22px;padding:0 5px;border-radius:11px;font-size:10px}
.lb .hc-foot{margin-top:0}
@media (max-width:1399px){.wh-g{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* fit the landing page on one screen */
.home .hero{grid-template-columns:1.25fr 1fr;margin-top:var(--space-12)}
.home .hero-main{padding:14px var(--space-20)}
.home .hero h1{font:600 28px/1.2 var(--font-sans);margin:2px 0 6px}
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

body=f"""@media (min-width:1800px){{.hg-c .idx-strip .nm{{font:600 12.5px/1.2 var(--font-sans)!important;letter-spacing:0!important;text-transform:none!important}}}}
@media (min-width:1800px){{.home .hero .hero-main h1{{font-size:30px!important;letter-spacing:-.3px;white-space:nowrap}}}}
/* even grid: summary and markets become two separate, equal cards (no card inside a card) */
@media (min-width:1400px){{
  .hg-c,.hg-c .hero{{display:contents}}
  .hg-c .hero-main,.hg-c .hero-side{{background:var(--surface-raised);border:1px solid var(--border-decorative);border-radius:var(--radius-12);min-width:0;height:auto}}
  .hg-c .hero-main{{grid-area:c}}
  .hg-tc>.tc-an{{margin-top:auto}}
  .hg-c .hero-side .idx-card{{min-width:0;width:100%}}
  .hg-c .idx-strip{{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
  .hg-c .idx-strip .ix{{min-width:0}}
  .hg-c .idx-card .head{{display:flex!important;flex-wrap:nowrap!important;justify-content:space-between;align-items:center;gap:8px}}.hg-c .idx-card .head .linkbtn{{white-space:nowrap;flex:none}}
  .hg-c .idx-card .head .eyebrow{{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}}
  .hg-c .hero-main .asof-pill{{white-space:normal}}
}}
@media (min-width:1400px) and (max-width:1799px){{
  .home .hero .hero-main h1{{font-size:26px!important;margin:4px 0 10px!important}}
  .hg-c .idx-strip .lv{{font-size:16px!important}}
  .hg-c .hero-side .idx-card{{padding:14px 14px!important}}
  .hg-c .idx-strip{{gap:6px!important}}
  .hg-c .idx-strip .ix{{padding:6px 8px!important}}
  .hg-c .idx-strip .nm{{font:600 11.5px/1.2 var(--font-sans)!important;letter-spacing:0!important;text-transform:none!important;overflow:visible!important;text-overflow:clip!important}}
  .home .hero-main .home-cta .btn{{padding:10px 14px!important;font-size:13px!important}}
  .hg-tc .tc-sig li{{padding:10px 0}}
  .hg-c .hero-side{{grid-area:mk;display:flex}}
  .hg-c .hero-side .idx-card{{flex:1;height:auto;padding:var(--space-16) var(--space-20)}}
  .home .hero .hero-main h1{{font:600 32px/1.15 var(--font-sans);letter-spacing:-.4px;margin:6px 0 12px}}
  .home .hero-main .home-cta .btn{{padding:12px 18px;font-size:14px}}
}}
</style>
</head>
<body>
<header class="ap-bar">
  <div class="wrap">
    <a class="ap-logo" href="home-2026-11-12.html" aria-label="AlphaPad home"><span class="a">α</span>lpha<span class="p">Pad</span></a>
    <nav class="ap-nav" aria-label="AlphaPad">
      <button class="ap-btn ap-ic" aria-label="Notifications, 9+ new"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><span class="ap-badge">9+</span></button>
      <a class="ap-btn" href="https://dev.alphapad.in/baskets"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="3.2"/><circle cx="7" cy="16" r="3.2"/><circle cx="17" cy="16" r="3.2"/></svg>Baskets</a>
      <a class="ap-btn" href="https://dev.alphapad.in/option-studio"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></svg>Option Studio</a>
      <a class="ap-btn" href="https://dev.alphapad.in/lms"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 10 12 5l10 5-10 5z"/><path d="M6 12v4c3 2 9 2 12 0v-4"/></svg>LMS</a>
      <button class="ap-btn" aria-label="Account"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>TRADER</button>
      <div class="ap-more"><button class="ap-btn ap-ic" id="apMore" aria-haspopup="true" aria-expanded="false" aria-label="More">⋮</button>
        <div class="ap-menu" id="apMenu" hidden><a href="{BRIEF}#brief">Today's full brief</a><a href="https://dev.alphapad.in/dashboard">Trade calls</a><button id="themeBtn">Light</button></div></div>
    </nav>
  </div>
</header>
{ticker}

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
      <div class="tc-body" id="tcBody" aria-live="polite"></div>
      <div class="hc-foot"><span class="hl-dots tc-dots" id="tcDots"></span><a href="https://dev.alphapad.in/dashboard">Open Trade Calls →</a></div>
    </article>
    <article class="card hg-fo" aria-label="Nifty F&amp;O levels">
      <div class="hc-head"><span class="eyebrow">F&amp;O levels · Nifty</span><span class="fo-exp">Expiry Tue 17 Nov</span></div>
      <div class="fo-k">
        <div class="s"><span>Support</span><b>25,000</b><small>most put OI</small></div>
        <div><span>Max pain</span><b>25,100</b><small>expiry pull</small></div>
        <div class="r"><span>Resistance</span><b>25,500</b><small>most call OI</small></div>
      </div>
      <div class="fo-ch"><svg viewBox="0 0 380 74" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Nifty open interest by strike for the 17 Nov expiry: puts largest at 25,000, calls largest at 25,500, max pain 25,100, spot 25,255"><rect x="306" y="2" width="7" height="7" rx="1.5" fill="var(--teal)"/><text x="316" y="9" font-size="10" font-family="Inter" fill="var(--text-tertiary)">Puts</text><rect x="344" y="2" width="7" height="7" rx="1.5" fill="var(--slate-500)"/><text x="354" y="9" font-size="10" font-family="Inter" fill="var(--text-tertiary)">Calls</text><line x1="0" x2="380" y1="60" y2="60" stroke="var(--border-decorative)"/><rect x="7.7" y="37.6" width="12.2" height="22.4" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="21.9" y="56.2" width="12.2" height="3.8" rx="1.5" fill="var(--slate-500)" opacity=".55"/><text x="20.9" y="73" text-anchor="middle" font-size="10" font-family="Inter" fill="var(--text-tertiary)">24,800</text><rect x="41.6" y="44.9" width="12.2" height="15.1" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="55.7" y="55.9" width="12.2" height="4.1" rx="1.5" fill="var(--slate-500)" opacity=".55"/><rect x="75.4" y="32.4" width="12.2" height="27.6" rx="1.5" fill="var(--teal)"/><rect x="89.5" y="44.5" width="12.2" height="15.5" rx="1.5" fill="var(--slate-500)" opacity=".55"/><text x="88.5" y="73" text-anchor="middle" font-size="10" font-family="Inter" fill="var(--text-tertiary)">25,000</text><rect x="109.2" y="46.9" width="12.2" height="13.1" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="123.4" y="53.0" width="12.2" height="7.0" rx="1.5" fill="var(--slate-500)" opacity=".55"/><rect x="143.0" y="44.8" width="12.2" height="15.2" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="157.2" y="42.0" width="12.2" height="18.0" rx="1.5" fill="var(--slate-500)" opacity=".55"/><text x="156.2" y="73" text-anchor="middle" font-size="10" font-family="Inter" fill="var(--text-tertiary)">25,200</text><rect x="176.8" y="46.0" width="12.2" height="14.0" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="191.0" y="33.4" width="12.2" height="26.6" rx="1.5" fill="var(--slate-500)" opacity=".55"/><rect x="210.6" y="50.7" width="12.2" height="9.3" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="224.8" y="26.0" width="12.2" height="34.0" rx="1.5" fill="var(--slate-500)" opacity=".55"/><text x="223.8" y="73" text-anchor="middle" font-size="10" font-family="Inter" fill="var(--text-tertiary)">25,400</text><rect x="244.5" y="50.7" width="12.2" height="9.3" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="258.6" y="14.0" width="12.2" height="46.0" rx="1.5" fill="var(--slate-500)"/><rect x="278.3" y="58.5" width="12.2" height="1.5" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="292.5" y="37.3" width="12.2" height="22.7" rx="1.5" fill="var(--slate-500)" opacity=".55"/><text x="291.5" y="73" text-anchor="middle" font-size="10" font-family="Inter" fill="var(--text-tertiary)">25,600</text><rect x="312.1" y="59.1" width="12.2" height="0.9" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="326.3" y="37.8" width="12.2" height="22.2" rx="1.5" fill="var(--slate-500)" opacity=".55"/><rect x="345.9" y="59.4" width="12.2" height="0.6" rx="1.5" fill="var(--teal)" opacity=".55"/><rect x="360.1" y="29.3" width="12.2" height="30.7" rx="1.5" fill="var(--slate-500)" opacity=".55"/><text x="359.1" y="73" text-anchor="middle" font-size="10" font-family="Inter" fill="var(--text-tertiary)">25,800</text><line x1="174.8" x2="174.8" y1="12" y2="60" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="3 2"/><text x="178.8" y="9" font-size="10" font-family="Inter" font-weight="600" fill="var(--amber)">Spot 25,255</text><line x1="122.4" x2="122.4" y1="12" y2="60" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="2 3"/><text x="118.4" y="9" text-anchor="end" font-size="10" font-family="Inter" font-weight="600" fill="var(--text-secondary)">Max pain 25,100</text></svg></div>
      <div class="hc-foot"><span>NSE F&amp;O · 11 Nov close</span><a href="https://dev.alphapad.in/option-studio">Open Option Studio →</a></div>
    </article>
    <article class="card hg-tl" aria-label="Today's market timeline">
      <div class="hc-head"><span class="eyebrow">Today · Thu 12 Nov</span><button class="linkbtn" data-go="calendar">Calendar →</button></div>
      <div class="tl-st"><b id="tlCount">–</b><span id="tlSub"></span></div>
      <div class="tl-bar"><i id="tlFill"></i></div>
      <ul class="tl" id="tl"></ul>
      <div class="tl-next"><span class="eyebrow">Coming up</span><ul id="tlNext"></ul></div>
    </article>
    <article class="card lcard hl hg-one" id="learnCard" aria-label="Today's learning">
      <div class="hc-head"><span class="eyebrow" id="hlKind">Learn</span><span class="num" id="hlCount" style="font:var(--type-caption);color:var(--text-tertiary)">1 / 3</span></div>
      <div class="hl-body" id="hlBody" aria-live="polite"></div>
      <div class="hc-foot"><div class="lnav"><button class="round" id="hlPrev" aria-label="Previous idea">←</button><span class="hl-dots" id="hlDots"><i></i><i></i><i></i></span><button class="round" id="hlNext" aria-label="Next idea">→</button></div><a class="hl-all" href="{BRIEF}#learn">Read all 3 in full →</a><button class="got" id="hlGot" data-learn="term">✓ Got it</button></div>
    </article>
    <article class="card hg-dl mvx" aria-label="Today's movers">
      <div class="hc-head"><span class="eyebrow">Movers</span><div class="seg2" role="tablist"><button class="on" data-m="s" role="tab" aria-selected="true">Nifty 100</button><button data-m="x" role="tab" aria-selected="false">Sectors</button><button data-m="o" role="tab" aria-selected="false">OI buildup</button></div></div>
      <div class="mvx-list" id="mvx" aria-live="polite"></div>
      <div class="mvx-foot" id="mvxFoot"></div>
    </article>
    <article class="card hg-bk" aria-label="Baskets">
      <div class="hc-head"><span class="eyebrow">Baskets</span><a class="bk-build" href="https://dev.alphapad.in/baskets">+ Build basket</a></div>
      <ul class="bk-list">
        <li><div><b>Updated Momentum Basket</b><small>Medium risk · 2 stocks</small></div><span class="bk-r up">+17.26%<small>1Y</small></span></li>
        <li><div><b>All Weather Alpha</b><small>High risk · 5 stocks</small></div><span class="bk-r up">+8.87%<small>1Y</small></span></li>
        <li><div><b>Alphapad Smart Factor Plus</b><small>High risk · 5 stocks</small></div><span class="bk-r up">+2.46%<small>1Y</small></span></li>
      </ul>
      <div class="hc-foot"><span>Not investment advice</span><a href="https://dev.alphapad.in/baskets">All baskets →</a></div>
    </article>
    <section class="hg-ln" id="learnRow" aria-label="Today's three ideas"></section>
  </div>

  <section class="scan" id="scan" aria-labelledby="scanH">
    <div class="scan-h"><h2 id="scanH">Market scan</h2><span>Nifty 500 stocks · NSE, 11 Nov close</span></div>
    <div class="scan-g">
      <article class="card sc sc-vol"><div class="hc-head"><span class="eyebrow">Volume shockers</span><span class="sc-k">vs 20-day avg</span></div><ul><li><span class="sc-n" title="Fertilisers and Chemicals Travancore Ltd.">FACT</span><span class="sc-b"><i style="width:100%"></i></span><span class="sc-v">29.6×</span><span class="sc-c u">+8.67%</span></li><li><span class="sc-n" title="BEML Ltd.">BEML</span><span class="sc-b"><i style="width:66%"></i></span><span class="sc-v">19.4×</span><span class="sc-c u">+6.05%</span></li><li><span class="sc-n" title="IIFL Finance Ltd.">IIFL</span><span class="sc-b"><i style="width:42%"></i></span><span class="sc-v">12.3×</span><span class="sc-c u">+6.26%</span></li><li><span class="sc-n" title="Kalyan Jewellers India Ltd.">KALYANKJIL</span><span class="sc-b"><i style="width:36%"></i></span><span class="sc-v">10.8×</span><span class="sc-c u">+8.63%</span></li><li><span class="sc-n" title="Cochin Shipyard Ltd.">COCHINSHIP</span><span class="sc-b"><i style="width:35%"></i></span><span class="sc-v">10.4×</span><span class="sc-c d">−6.82%</span></li></ul><div class="hc-foot sc-f"><span>Volume vs 20-day average</span><a href="https://dev.alphapad.in/screener" aria-label="Open volume shockers in the screener">Screen →</a></div></article>
      <article class="card sc sc-del"><div class="hc-head"><span class="eyebrow">Delivery spikes</span><span class="sc-k">delivery % · jump</span></div><ul><li><span class="sc-n" title="Home First Finance Company India Ltd.">HOMEFIRST</span><span class="sc-b"><i style="width:100%"></i></span><span class="sc-v">86% <small>+42.8</small></span><span class="sc-c d">−0.02%</span></li><li><span class="sc-n" title="Mankind Pharma Ltd.">MANKIND</span><span class="sc-b"><i style="width:86%"></i></span><span class="sc-v">64% <small>+36.8</small></span><span class="sc-c d">−0.31%</span></li><li><span class="sc-n" title="Gland Pharma Ltd.">GLAND</span><span class="sc-b"><i style="width:70%"></i></span><span class="sc-v">53% <small>+30</small></span><span class="sc-c d">−1.17%</span></li><li><span class="sc-n" title="Supreme Industries Ltd.">SUPREMEIND</span><span class="sc-b"><i style="width:69%"></i></span><span class="sc-v">69% <small>+29.7</small></span><span class="sc-c u">+0.71%</span></li><li><span class="sc-n" title="DOMS Industries Ltd.">DOMS</span><span class="sc-b"><i style="width:69%"></i></span><span class="sc-v">78% <small>+29.5</small></span><span class="sc-c d">−1.05%</span></li></ul><div class="hc-foot sc-f"><span>Delivery % and its jump</span><a href="https://dev.alphapad.in/screener" aria-label="Open delivery spikes in the screener">Screen →</a></div></article>
      <article class="card sc sc-hi"><div class="hc-head"><span class="eyebrow">New 20-day highs</span><span class="sc-cnt sc-hic">149 stocks</span></div><ul><li><span class="sc-n" title="Fertilisers and Chemicals Travancore Ltd.">FACT</span><span class="sc-b"><i style="width:100%"></i></span><span class="sc-v"></span><span class="sc-c u">+8.67%</span></li><li><span class="sc-n" title="Kalyan Jewellers India Ltd.">KALYANKJIL</span><span class="sc-b"><i style="width:100%"></i></span><span class="sc-v"></span><span class="sc-c u">+8.63%</span></li><li><span class="sc-n" title="Sun TV Network Ltd.">SUNTV</span><span class="sc-b"><i style="width:83%"></i></span><span class="sc-v"></span><span class="sc-c u">+7.21%</span></li><li><span class="sc-n" title="Ramkrishna Forgings Ltd.">RKFORGE</span><span class="sc-b"><i style="width:83%"></i></span><span class="sc-v"></span><span class="sc-c u">+7.19%</span></li><li><span class="sc-n" title="IIFL Finance Ltd.">IIFL</span><span class="sc-b"><i style="width:72%"></i></span><span class="sc-v"></span><span class="sc-c u">+6.26%</span></li></ul><div class="hc-foot sc-f"><span>Closed above the last 20 closes</span><a href="https://dev.alphapad.in/screener" aria-label="Open new 20-day highs in the screener">Screen →</a></div></article>
      <article class="card sc sc-lo"><div class="hc-head"><span class="eyebrow">New 20-day lows</span><span class="sc-cnt sc-loc">7 stocks</span></div><ul><li><span class="sc-n" title="Prime Focus Ltd.">PFOCUS</span><span class="sc-b"><i style="width:100%"></i></span><span class="sc-v"></span><span class="sc-c d">−5.38%</span></li><li><span class="sc-n" title="Thermax Ltd.">THERMAX</span><span class="sc-b"><i style="width:40%"></i></span><span class="sc-v"></span><span class="sc-c d">−2.17%</span></li><li><span class="sc-n" title="Hexaware Technologies Ltd.">HEXT</span><span class="sc-b"><i style="width:18%"></i></span><span class="sc-v"></span><span class="sc-c d">−0.96%</span></li><li><span class="sc-n" title="Schneider Electric Infrastructure Ltd.">SCHNEIDER</span><span class="sc-b"><i style="width:10%"></i></span><span class="sc-v"></span><span class="sc-c d">−0.54%</span></li><li><span class="sc-n" title="Escorts Kubota Ltd.">ESCORTS</span><span class="sc-b"><i style="width:9%"></i></span><span class="sc-v"></span><span class="sc-c d">−0.48%</span></li></ul><div class="hc-foot sc-f"><span>Closed below the last 20 closes</span><a href="https://dev.alphapad.in/screener" aria-label="Open new 20-day lows in the screener">Screen →</a></div></article>
    </div>
  </section>


  <section class="wh" id="happening" aria-labelledby="whH">
    <div class="scan-h"><h2 id="whH">What’s happening</h2><span>Company filings, Nifty 500 · NSE, Fri 13 Nov · tap a line to open the filing</span></div>
    <div class="wh-g"><article class="card wh-col g"><div class="hc-head"><span class="eyebrow">Results & dividends</span><span class="wh-n">3</span></div><ul class="wh-list"><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/ABB_13112026180525_PressReleaseQ32026signed.pdf" target="_blank" rel="noopener" aria-label="ABB: Q2 results; demand expanding across segments. Opens the NSE filing"><span class="wh-m"><b>ABB</b><span class="wh-fo">F&amp;O</span><time>18:06</time></span><span class="wh-l">Q2 results; demand expanding across segments</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/EICHERMOT_13112026170319_EMLPressReleaseNovember132026Signed.pdf" target="_blank" rel="noopener" aria-label="EICHERMOT: Best-ever quarter: record revenue and EBITDA. Opens the NSE filing"><span class="wh-m"><b>EICHERMOT</b><span class="wh-fo">F&amp;O</span><time>17:03</time></span><span class="wh-l">Best-ever quarter: record revenue and EBITDA</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/NATCOPHARM_13112026141002_Outcome_13112026.pdf" target="_blank" rel="noopener" aria-label="NATCOPHARM: Q2 results + 2nd interim dividend, record date 19 Nov. Opens the NSE filing"><span class="wh-m"><b>NATCOPHARM</b><time>14:15</time></span><span class="wh-l">Q2 results + 2nd interim dividend, record date 19 Nov</span></a></li></ul></article><article class="card wh-col b"><div class="hc-head"><span class="eyebrow">Orders, deals & approvals</span><span class="wh-n">5</span></div><ul class="wh-list"><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/BEL_13112026182841_Lettersigned.pdf" target="_blank" rel="noopener" aria-label="BEL: New order / contract win disclosed. Opens the NSE filing"><span class="wh-m"><b>BEL</b><span class="wh-fo">F&amp;O</span><time>18:31</time></span><span class="wh-l">New order / contract win disclosed</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/JSWINFRA_13112026170704_SE_intimation-_LOA-Shambhu.pdf" target="_blank" rel="noopener" aria-label="JSWINFRA: Letter of award for a new contract. Opens the NSE filing"><span class="wh-m"><b>JSWINFRA</b><time>17:13</time></span><span class="wh-l">Letter of award for a new contract</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/AMBER_13112026161730_SE_Intimation_Update_on_ILJINs_Resumption_of_Operations.pdf" target="_blank" rel="noopener" aria-label="AMBER: Operations resume at subsidiary IL JIN’s factory. Opens the NSE filing"><span class="wh-m"><b>AMBER</b><span class="wh-fo">F&amp;O</span><time>16:18</time></span><span class="wh-l">Operations resume at subsidiary IL JIN’s factory</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/PAYTM_13112026144214_SE_Disclosure_PPSL_Wallet_License_in_principal_approval_Nov_2026_sd.pdf" target="_blank" rel="noopener" aria-label="PAYTM: In-principle RBI nod for payments arm’s wallet licence. Opens the NSE filing"><span class="wh-m"><b>PAYTM</b><span class="wh-fo">F&amp;O</span><time>14:42</time></span><span class="wh-l">In-principle RBI nod for payments arm’s wallet licence</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/ZEEL_13112026130852_SEIntimationBR13NovBBsigned.pdf" target="_blank" rel="noopener" aria-label="ZEEL: Board resolution for share buyback filed. Opens the NSE filing"><span class="wh-m"><b>ZEEL</b><time>13:11</time></span><span class="wh-l">Board resolution for share buyback filed</span></a></li></ul></article><article class="card wh-col w"><div class="hc-head"><span class="eyebrow">People & risks</span><span class="wh-n">4</span></div><ul class="wh-list"><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/RHIM_13112026180912_Outcome.pdf" target="_blank" rel="noopener" aria-label="RHIM: CFO resigns; successor named from 1 Jan 2027. Opens the NSE filing"><span class="wh-m"><b>RHIM</b><time>18:09</time></span><span class="wh-l">CFO resigns; successor named from 1 Jan 2027</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/PGEL_13112026172525_FINALBSENSESEBISCN13112026.pdf" target="_blank" rel="noopener" aria-label="PGEL: Receives a show cause notice. Opens the NSE filing"><span class="wh-m"><b>PGEL</b><span class="wh-fo">F&amp;O</span><time>17:26</time></span><span class="wh-l">Receives a show cause notice</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/SHREECEM_13112026155359_NSE_BSE_Demand_order_131126.pdf" target="_blank" rel="noopener" aria-label="SHREECEM: Appeal against Punjab state-tax demand dismissed. Opens the NSE filing"><span class="wh-m"><b>SHREECEM</b><span class="wh-fo">F&amp;O</span><time>15:54</time></span><span class="wh-l">Appeal against Punjab state-tax demand dismissed</span></a></li><li><a class="wh-i" href="https://nsearchives.nseindia.com/corporate/TVSMOTOR_13112026150251_TVSM_SMP_intimationSD.pdf" target="_blank" rel="noopener" aria-label="TVSMOTOR: India two-wheeler business president resigns (24 Dec). Opens the NSE filing"><span class="wh-m"><b>TVSMOTOR</b><span class="wh-fo">F&amp;O</span><time>15:03</time></span><span class="wh-l">India two-wheeler business president resigns (24 Dec)</span></a></li></ul></article><article class="card lb" aria-label="Streak leaderboard"><div class="hc-head"><span class="eyebrow">Streak leaderboard</span><span class="lb-tag">Sample</span></div><ol class="lb-list"><li><span class="lb-r">1</span><span class="lb-n">Ananya S.<small>Pune</small></span><span class="lb-s">41<i aria-hidden="true">🔥</i></span></li><li><span class="lb-r">2</span><span class="lb-n">Rohit K.<small>Indore</small></span><span class="lb-s">38<i aria-hidden="true">🔥</i></span></li><li><span class="lb-r">3</span><span class="lb-n">Meera J.<small>Kochi</small></span><span class="lb-s">33<i aria-hidden="true">🔥</i></span></li><li><span class="lb-r">4</span><span class="lb-n">Vikram P.<small>Jaipur</small></span><span class="lb-s">29<i aria-hidden="true">🔥</i></span></li><li><span class="lb-r">5</span><span class="lb-n">Farhan A.<small>Lucknow</small></span><span class="lb-s">24<i aria-hidden="true">🔥</i></span></li><li><span class="lb-r">6</span><span class="lb-n">Sneha R.<small>Nagpur</small></span><span class="lb-s">21<i aria-hidden="true">🔥</i></span></li></ol><div class="lb-you"><span class="lb-r">142</span><span class="lb-n">You<small>of 2,318 traders</small></span><span class="lb-s" id="lbYou">6<i aria-hidden="true">🔥</i></span></div><div class="hc-foot"><span>Market days in a row</span><button class="linkbtn" id="lbOpen">Your streak →</button></div></article></div>
  </section>
  <div style="height:8px"></div>
</main>
<a class="scan-cue" href="#scan" id="scanCue">Market scan · What’s happening · Leaderboard ↓</a>

{calmodal}{modal}{dock}

<script>
const TODAY=new Date(2026,10,12);
{js_helpers}
/* any [data-go] link (ticker items, Markets desk…) opens that part of the full brief */
document.addEventListener('click',e=>{{const g=e.target.closest('[data-go]');if(!g)return;e.preventDefault();
  if(g.dataset.go==='calendar'){{openCal();return}}
  if(g.dataset.go==='learn'){{location.href='{BRIEF}#learn';return}}  /* same place as “Read all 3 in full” */
  location.href='{BRIEF}#'+g.dataset.go}});

{js_ticker}
/* ================= TODAY TIMELINE (same day list as the brief's left rail) ================= */
{js_day}function renderToday(){{const ist=istNow(),now=ist.getHours()*60+ist.getMinutes(),wd=ist.getDay(),trading=wd>0&&wd<6;
  const OPEN=555,CLOSE=930,open=trading&&now>=OPEN&&now<CLOSE;
  $('#tlCount').textContent=!trading?'Weekend':open?`Closes in ${{dur(CLOSE-now)}}`:now<OPEN?`Opens in ${{dur(OPEN-now)}}`:'Closed for today';
  $('#tlSub').textContent=open?'Market open':now<OPEN?'Pre-market':'After market';
  $('#tlFill').style.width=`${{Math.max(0,Math.min(100,(now-OPEN)/(CLOSE-OPEN)*100))}}%`;
  const wide=matchMedia('(min-width:1400px)').matches&&innerHeight>920,nxt=DAY.find(d=>mins(d.t)>now),ni=nxt?DAY.indexOf(nxt):DAY.length,from=wide?0:Math.max(0,Math.min(ni-1,DAY.length-6));let grp='';
  $('#tl').innerHTML=DAY.slice(from,wide?DAY.length:from+6).map(d=>(d.g!==grp?(grp=d.g,`<li class="grp-h">${{d.g}}</li>`):'')+`<li class="${{mins(d.t)<=now?'past':''}} ${{d===nxt?'next':''}} ${{d.ev?'ev':''}}"><span class="t">${{d.t}}</span><span class="d"></span><span>${{d.b}}</span></li>`).join('')}}
{js_events}
function renderNext(){{const up=EVENTS.filter(e=>e.d>TODAY).sort((a,b)=>a.d-b.d).slice(0,3);
  $('#tlNext').innerHTML=up.map(e=>`<li class="${{TYPES[e.t].c}}"><span class="t">${{fmt(e.d).replace(/ [A-Za-z]+$/,'')}}</span><span>${{e.title}}</span></li>`).join('')}}
renderNext();
{js_cal}
{js_cal_open}
const MVS={MV_DATA},SECS={SEC_DATA};
const OIB={{"lb": {{"n": 64, "top": [{{"s": "COROMANDEL", "p": 6.49, "o": 91.2}}, {{"s": "NAVINFLUOR", "p": 5.79, "o": 68.8}}, {{"s": "CUB", "p": 3.08, "o": 17.3}}]}}, "sb": {{"n": 44, "top": [{{"s": "COCHINSHIP", "p": -8.16, "o": 39.6}}, {{"s": "AMBER", "p": -1.37, "o": 12.8}}, {{"s": "BPCL", "p": -0.14, "o": 11.3}}]}}, "sc": {{"n": 75, "top": [{{"s": "RBLBANK", "p": 2.3, "o": -8.2}}, {{"s": "POWERINDIA", "p": 2.81, "o": -7.1}}, {{"s": "NAM-INDIA", "p": 0.75, "o": -6.0}}]}}, "lu": {{"n": 28, "top": [{{"s": "ICICIBANK", "p": -0.83, "o": -7.5}}, {{"s": "IREDA", "p": -0.28, "o": -6.5}}, {{"s": "ADANIGREEN", "p": -2.69, "o": -5.8}}]}}}};
const OIQ=[['lb','Long buildup','Price ▲ · OI ▲','u'],['sb','Short buildup','Price ▼ · OI ▲','d'],['sc','Short covering','Price ▲ · OI ▼','u'],['lu','Long unwinding','Price ▼ · OI ▼','d']];
function renderOib(){{$('#mvx').innerHTML=`<div class="oib">${{OIQ.map(([k,t,h,c])=>`<div class="oib-q ${{c}}"><div class="oib-h"><b>${{t}}</b><span class="oib-n">${{OIB[k].n}}</span></div><span class="oib-s">${{h}}</span><span class="oib-t">Top: ${{OIB[k].top.slice(0,1).map(x=>`${{x.s}} <em>${{x.p>0?'+':'−'}}${{Math.abs(x.p).toFixed(1)}}%</em>`).join('')}}</span></div>`).join('')}}</div>`;
  $('#mvxFoot').innerHTML='211 stock futures · OI across expiries · NSE 11 Nov';
  $$('.seg2 button').forEach(b=>{{const on=b.dataset.m==='o';b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on))}})}}
function renderMvx(m){{if(m==='o')return renderOib();const rows=m==='x'?SECS:MVS,mx=Math.max(...rows.map(r=>Math.abs(r.v)));
  $('#mvx').innerHTML=rows.map(r=>{{const w=(Math.abs(r.v)/mx*100).toFixed(1),up=r.v>=0;
    return `<div class="mvx-r ${{up?'u':'d'}}"><span class="n">${{r.n}}</span><span class="b"><i class="l">${{up?'':`<em style="width:${{w}}%"></em>`}}</i><i class="r">${{up?`<em style="width:${{w}}%"></em>`:''}}</i></span><b>${{up?'+':'−'}}${{Math.abs(r.v).toFixed(2)}}%</b></div>`}}).join('');
  $('#mvxFoot').innerHTML=m==='x'?'Sector indices · 11 Nov close':'Nifty 100 <b>+0.86%</b> · 72 of 100 rose · 11 Nov';
  $$('.seg2 button').forEach(b=>{{const on=b.dataset.m===m;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on))}})}}
$('.seg2').addEventListener('click',e=>{{const b=e.target.closest('button');if(b)renderMvx(b.dataset.m)}});
renderMvx('s');
function lockMvx(){{const l=$('#mvx'),cur=($$('.seg2 button.on')[0]||{{}}).dataset?.m||'s';l.style.height='';renderMvx('s');l.style.height=l.offsetHeight+'px';renderMvx(cur)}}
lockMvx();addEventListener('resize',lockMvx);
/* switches between Nifty 100 and Sectors every 5 s; pauses while the reader hovers or uses the card */
{{let mvMode='s',mvHold=false;const c=$('.hg-dl');c.addEventListener('mouseenter',()=>mvHold=true);c.addEventListener('mouseleave',()=>mvHold=false);
  c.addEventListener('focusin',()=>mvHold=true);c.addEventListener('focusout',()=>mvHold=false);
  $('.seg2').addEventListener('click',e=>{{const b=e.target.closest('button');if(b)mvMode=b.dataset.m}});
  setInterval(()=>{{if(mvHold||document.hidden)return;mvMode={{s:'x',x:'o',o:'s'}}[mvMode];renderMvx(mvMode);const l=$('#mvx');l.classList.remove('in');void l.offsetWidth;l.classList.add('in')}},5000)}}
renderToday();setInterval(renderToday,30000);

/* ================= DAILY POLL: where will Nifty close today? ================= */
{{const K='sp-poll-2026-11-12',CROWD={{up:58,flat:17,down:25}};/* sample split for the demo */
  const L={{up:'▲ Up',flat:'Flat',down:'▼ Down'}};
  {{const g=$('#stkGoal');if(g&&!$('#poll')){{const el=document.createElement('div');el.className='poll';el.id='poll';el.setAttribute('role','group');el.setAttribute('aria-label','Daily poll: where will Nifty close today?');g.before(el)}}}}
  const get=()=>{{try{{return localStorage.getItem(K)}}catch(e){{return null}}}};
  function draw(){{const v=get(),el=$('#poll');if(!el)return;
    if(!v){{el.innerHTML=`<span class="poll-q">Nifty today?</span>${{Object.keys(L).map(k=>`<button data-v="${{k}}">${{L[k]}}</button>`).join('')}}`;return}}
    el.innerHTML=`<span class="poll-q">You: <b>${{L[v]}}</b></span><span class="poll-bar" title="Sample split for the demo">${{Object.keys(L).map(k=>`<i class="${{k}}${{k===v?' me':''}}" style="width:${{CROWD[k]}}%"></i>`).join('')}}</span><span class="poll-r">${{CROWD[v]}}% agree <small>(sample)</small><span class="poll-t"> · result 3:30 pm</span></span>`}}
  $('#poll')?.addEventListener('click',e=>{{const b=e.target.closest('button[data-v]');if(!b)return;try{{localStorage.setItem(K,b.dataset.v)}}catch(e){{}}draw()}});
  draw()}}

/* ================= WHAT IS THIS? one short explainer per card ================= */
const INFO=[
 ['.hg-tc .hc-head .eyebrow','Trade calls','Research calls from the AlphaPad desk. Each shows the option legs, entry, target, stop loss and last price, plus the payoff worked out from the legs and quantity: max profit, max loss, and capital (approximate margin needed). A ratio spread can lose more than it costs, so its max loss can read “unlimited”.','Source: AlphaPad Trade Calls · Prices are indicative'],
 ['.hg-fo .hc-head .eyebrow','F&O levels','From yesterday’s Nifty option open interest for the nearest expiry. Support is the strike with the most put OI near spot; resistance is the strike with the most call OI near spot. Max pain is the strike where option buyers as a whole would lose the most at expiry. Levels are a guide, not a forecast.','Source: NSE F&O bhavcopy, 11 Nov close · Updates each evening'],
 ['.hg-c .hero-side .head .eyebrow','Markets','One month of daily closing values for the index you pick. India VIX measures expected volatility: when it rises, traders expect bigger swings, so it is shown in amber, not green. Breadth counts NSE stocks that rose versus fell.','Source: NSE daily index files and bhavcopy, 11 Nov close'],
 ['.mood-mini .head .eyebrow','Market mood','This is a demo score. The live version will combine market breadth, India VIX, FII/DII flows, momentum and sector participation, and this note will show each factor’s weight and today’s reading before launch.','Status: method under review'],
 ['.hg-tl .hc-head .eyebrow','Today','Market events for today in IST: before the open, market hours and after the close. Amber marks today’s scheduled releases. Open the calendar for the full week ahead.','Source: AlphaPad market calendar'],
 ['.hg-one .hc-head .eyebrow','Learning','Three short ideas a day, each tied to what moved the market. Tap “Got it” on all three to keep your streak. The full lessons are in the brief and in LMS.','Learn more: dev.alphapad.in/lms'],
 ['.hg-dl .hc-head .eyebrow','Movers','Nifty 100: the biggest gainers and losers. Sectors: sector index moves. OI buildup sorts stock futures by how price and open interest moved together: long buildup (price ▲ OI ▲), short buildup (▼ ▲), short covering (▲ ▼), long unwinding (▼ ▼).','Source: NSE closing data and F&O bhavcopy, 11 Nov'],
 ['.hg-bk .hc-head .eyebrow','Baskets','Curated stock baskets from the AlphaPad Marketplace with their one-year return. Benchmark comparison and maximum drawdown are being added so returns can be judged in context.','Source: AlphaPad Baskets · Not investment advice']];


{{const y=$('#lbYou'),n=$('#stkN');if(y&&n)y.firstChild.textContent=n.textContent;$('#lbOpen')?.addEventListener('click',()=>$('#stkOpen')?.click())}}
/* Market scan cue: shown on the first screen only */
{{const cue=$('#scanCue');const f=()=>cue.classList.toggle('gone',scrollY>40);addEventListener('scroll',f,{{passive:true}});f()}}
INFO.push(['.sc-vol .hc-head .eyebrow','Volume shockers','Nifty 500 stocks whose traded volume today was highest relative to their own average over the previous 20 sessions. A spike often means news or a big player moving.','Source: NSE security-wise bhavcopy, 11 Nov'],
 ['.sc-del .hc-head .eyebrow','Delivery spikes','Delivery % is the share of traded quantity actually taken into demat accounts, not squared off the same day. A big jump from yesterday (shown as + points) can signal real buying or selling rather than day trading. Listed: stocks with at least 50% delivery today.','Source: NSE security-wise bhavcopy, 10–11 Nov'],
 ['.sc-hi .hc-head .eyebrow','New 20-day highs','Nifty 500 stocks that closed above every close of the previous 20 sessions. Many new highs at once means the rally is broad.','Source: NSE security-wise bhavcopy, last 21 sessions'],
 ['.sc-lo .hc-head .eyebrow','New 20-day lows','Nifty 500 stocks that closed below every close of the previous 20 sessions.','Source: NSE security-wise bhavcopy, last 21 sessions']);
{{const pop=document.createElement('div');pop.className='ipop';pop.id='ipop';pop.setAttribute('role','dialog');pop.hidden=true;document.body.appendChild(pop);let openBtn=null;
  const close=()=>{{pop.hidden=true;if(openBtn){{openBtn.setAttribute('aria-expanded','false');openBtn=null}}}};
  INFO.forEach(([sel,t,b,src],i)=>{{const h=$(sel);if(!h)return;const btn=document.createElement('button');btn.className='ibtn';btn.type='button';btn.textContent='i';btn.setAttribute('aria-label','What is '+t+'?');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','ipop');h.after(btn);
    btn.addEventListener('click',e=>{{e.preventDefault();e.stopPropagation();if(openBtn===btn){{close();return}}close();pop.innerHTML=`<b>${{t}}</b><p>${{b}}</p><small>${{src}}</small>`;pop.hidden=false;openBtn=btn;btn.setAttribute('aria-expanded','true');
      const r=btn.getBoundingClientRect(),w=pop.offsetWidth,hh=pop.offsetHeight;let x=Math.min(Math.max(8,r.left-12),innerWidth-w-8),y=r.bottom+8;if(y+hh>innerHeight-8)y=Math.max(8,r.top-hh-8);pop.style.left=x+'px';pop.style.top=y+'px'}})}});
  document.addEventListener('click',e=>{{if(!pop.hidden&&!pop.contains(e.target))close()}});document.addEventListener('keydown',e=>{{if(e.key==='Escape')close()}});addEventListener('resize',close);addEventListener('scroll',close,true)}}

/* ================= MARKETS CARD: one-month index chart, tabs switch every 5 s ================= */
const IDX=[{{"n": "Nifty 50", "pts": "+210.40", "pct": "+0.84%", "up": true, "vix": false, "d": [["12 Oct", 22363.35], ["13 Oct", 22721.95], ["14 Oct", 22622.7], ["15 Oct", 22997.35], ["16 Oct", 23146.15], ["19 Oct", 22888.95], ["21 Oct", 22811.35], ["22 Oct", 22687.65], ["23 Oct", 22600.0], ["26 Oct", 22753.2], ["27 Oct", 22749.75], ["28 Oct", 22698.85], ["29 Oct", 22936.75], ["30 Oct", 23053.1], ["02 Nov", 23440.8], ["03 Nov", 23810.85], ["04 Nov", 23960.6], ["05 Nov", 24536.6], ["06 Nov", 25030.35], ["09 Nov", 25044.65], ["11 Nov", 25255.05]]}}, {{"n": "Nifty Bank", "pts": "+1,051.15", "pct": "+1.76%", "up": true, "vix": false, "d": [["12 Oct", 54918.0], ["13 Oct", 55481.05], ["14 Oct", 55316.0], ["15 Oct", 55810.5], ["16 Oct", 55844.0], ["19 Oct", 55488.1], ["21 Oct", 54976.9], ["22 Oct", 54925.7], ["23 Oct", 54287.35], ["26 Oct", 54366.7], ["27 Oct", 53974.9], ["28 Oct", 54267.4], ["29 Oct", 54909.65], ["30 Oct", 54686.95], ["02 Nov", 55002.2], ["03 Nov", 55540.05], ["04 Nov", 55913.6], ["05 Nov", 57773.65], ["06 Nov", 59086.0], ["09 Nov", 59741.25], ["11 Nov", 60792.4]]}}, {{"n": "Midcap 100", "pts": "+496.55", "pct": "+0.81%", "up": true, "vix": false, "d": [["12 Oct", 58834.55], ["13 Oct", 59459.2], ["14 Oct", 59409.1], ["15 Oct", 59197.25], ["16 Oct", 59129.75], ["19 Oct", 58487.95], ["21 Oct", 57565.85], ["22 Oct", 57063.95], ["23 Oct", 55800.65], ["26 Oct", 56465.4], ["27 Oct", 57029.9], ["28 Oct", 57274.7], ["29 Oct", 57841.65], ["30 Oct", 57301.25], ["02 Nov", 57983.4], ["03 Nov", 58596.25], ["04 Nov", 59505.5], ["05 Nov", 60620.9], ["06 Nov", 60606.65], ["09 Nov", 61022.55], ["11 Nov", 61519.1]]}}, {{"n": "Smallcap 100", "pts": "+304.30", "pct": "+1.59%", "up": true, "vix": false, "d": [["12 Oct", 19425.8], ["13 Oct", 19447.4], ["14 Oct", 19384.8], ["15 Oct", 19131.7], ["16 Oct", 19129.8], ["19 Oct", 18935.75], ["21 Oct", 18487.3], ["22 Oct", 18275.9], ["23 Oct", 17739.45], ["26 Oct", 17985.0], ["27 Oct", 18468.7], ["28 Oct", 18634.9], ["29 Oct", 18811.35], ["30 Oct", 18463.6], ["02 Nov", 18595.3], ["03 Nov", 18652.85], ["04 Nov", 19026.4], ["05 Nov", 19132.45], ["06 Nov", 18975.05], ["09 Nov", 19185.05], ["11 Nov", 19489.35]]}}, {{"n": "India VIX", "pts": "+0.14", "pct": "+0.77%", "up": true, "vix": true, "d": [["12 Oct", 15.25], ["13 Oct", 14.12], ["14 Oct", 14.63], ["15 Oct", 14.03], ["16 Oct", 14.06], ["19 Oct", 14.77], ["21 Oct", 15.68], ["22 Oct", 15.76], ["23 Oct", 16.86], ["26 Oct", 17.16], ["27 Oct", 16.4], ["28 Oct", 16.25], ["29 Oct", 15.12], ["30 Oct", 15.3], ["02 Nov", 15.5], ["03 Nov", 15.72], ["04 Nov", 15.19], ["05 Nov", 15.58], ["06 Nov", 17.47], ["09 Nov", 17.42], ["11 Nov", 17.56]]}}, {{"n": "Nifty 500", "pts": "+212.30", "pct": "+0.90%", "up": true, "vix": false, "d": [["12 Oct", 21822.75], ["13 Oct", 22090.0], ["14 Oct", 22038.0], ["15 Oct", 22180.8], ["16 Oct", 22270.05], ["19 Oct", 22041.6], ["21 Oct", 21837.9], ["22 Oct", 21696.55], ["23 Oct", 21427.6], ["26 Oct", 21608.75], ["27 Oct", 21734.9], ["28 Oct", 21727.45], ["29 Oct", 21941.5], ["30 Oct", 21895.9], ["02 Nov", 22241.4], ["03 Nov", 22520.35], ["04 Nov", 22769.2], ["05 Nov", 23224.7], ["06 Nov", 23456.95], ["09 Nov", 23567.0], ["11 Nov", 23779.3]]}}, {{"n": "Nifty Next 50", "pts": "+696.75", "pct": "+0.96%", "up": true, "vix": false, "d": [["12 Oct", 68351.7], ["13 Oct", 68927.95], ["14 Oct", 68999.3], ["15 Oct", 68671.6], ["16 Oct", 68988.6], ["19 Oct", 68695.85], ["21 Oct", 67655.3], ["22 Oct", 67354.15], ["23 Oct", 65828.6], ["26 Oct", 66477.15], ["27 Oct", 67343.95], ["28 Oct", 67303.7], ["29 Oct", 68121.6], ["30 Oct", 67709.1], ["02 Nov", 68962.65], ["03 Nov", 69624.35], ["04 Nov", 70795.0], ["05 Nov", 71768.65], ["06 Nov", 71657.8], ["09 Nov", 72789.45], ["11 Nov", 73486.2]]}}, {{"n": "Fin Services", "pts": "+278.50", "pct": "+1.02%", "up": true, "vix": false, "d": [["12 Oct", 24866.35], ["13 Oct", 25228.55], ["14 Oct", 24948.7], ["15 Oct", 25364.2], ["16 Oct", 25387.1], ["19 Oct", 24987.1], ["21 Oct", 24691.45], ["22 Oct", 24657.7], ["23 Oct", 24403.0], ["26 Oct", 24454.35], ["27 Oct", 24303.75], ["28 Oct", 24418.25], ["29 Oct", 24704.55], ["30 Oct", 24712.2], ["02 Nov", 24899.05], ["03 Nov", 25357.9], ["04 Nov", 25580.6], ["05 Nov", 26600.45], ["06 Nov", 27283.95], ["09 Nov", 27384.9], ["11 Nov", 27663.4]]}}, {{"n": "Nifty IT", "pts": "−173.30", "pct": "−0.53%", "up": false, "vix": false, "d": [["12 Oct", 28349.6], ["13 Oct", 29830.1], ["14 Oct", 30171.0], ["15 Oct", 30719.8], ["16 Oct", 31924.1], ["19 Oct", 31516.3], ["21 Oct", 32422.5], ["22 Oct", 32081.25], ["23 Oct", 31995.5], ["26 Oct", 32273.05], ["27 Oct", 32189.45], ["28 Oct", 31553.4], ["29 Oct", 31866.4], ["30 Oct", 32606.9], ["02 Nov", 32442.5], ["03 Nov", 32551.6], ["04 Nov", 32061.9], ["05 Nov", 32837.85], ["06 Nov", 32977.9], ["09 Nov", 32468.9], ["11 Nov", 32295.6]]}}];
let ixI=0,ixHold=false;
function ixDraw(i){{ixI=i;const x=IDX[i],d=x.d,W=380,H=150,P=[6,52,16,4];/* top,right,bottom,left */
  const v=d.map(p=>p[1]),lo=Math.min(...v),hi=Math.max(...v),pad=(hi-lo)*.08,y0=lo-pad,y1=hi+pad;
  const X=j=>P[3]+j*(W-P[1]-P[3])/(d.length-1),Y=val=>P[0]+(y1-val)/(y1-y0)*(H-P[0]-P[2]);
  const pts=d.map((p,j)=>`${{X(j).toFixed(1)}},${{Y(p[1]).toFixed(1)}}`).join(' ');
  const last=v[v.length-1],m1=(last/v[0]-1)*100,col=x.vix?'var(--amber)':(m1>=0?'var(--teal)':'var(--red)');
  const ticks=[0,.5,1].map(f=>y0+pad+(hi-lo)*f);
  const fmt=n=>n.toLocaleString('en-IN',{{maximumFractionDigits:0}});
  const xl=[0,Math.round((d.length-1)/2),d.length-1];
  $('#ixCh').innerHTML=`<svg viewBox="0 0 ${{W}} ${{H}}" preserveAspectRatio="none"><defs><linearGradient id="ixG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${{col}}" stop-opacity=".28"/><stop offset="1" stop-color="${{col}}" stop-opacity="0"/></linearGradient></defs>
    ${{ticks.map(t=>`<line x1="${{P[3]}}" x2="${{W-P[1]}}" y1="${{Y(t).toFixed(1)}}" y2="${{Y(t).toFixed(1)}}" stroke="var(--border-decorative)" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/>`).join('')}}
    <polygon points="${{P[3]}},${{H-P[2]}} ${{pts}} ${{X(d.length-1).toFixed(1)}},${{H-P[2]}}" fill="url(#ixG)"/>
    <polyline points="${{pts}}" fill="none" stroke="${{col}}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
    ${{ticks.map(t=>`<span class="yl" style="top:${{(Y(t)/H*100).toFixed(1)}}%">${{fmt(t)}}</span>`).join('')}}
    <span class="tag" style="top:${{(Y(last)/H*100).toFixed(1)}}%;background:${{col}}">${{last.toLocaleString('en-IN',{{minimumFractionDigits:2}})}}</span>
    ${{xl.map(j=>`<span class="xl" style="left:${{(X(j)/W*100).toFixed(1)}}%;transform:${{j===0?'none':'translateX(-50%)'}}">${{d[j][0]}}</span>`).join('')}}`;
  $('#ixVal').textContent=last.toLocaleString('en-IN',{{minimumFractionDigits:2}});
  const cg=$('#ixChg');cg.textContent=`${{x.up?'▲':'▼'}} ${{x.pts}} (${{x.pct}})`;cg.className=x.vix?'vix':(x.up?'up':'dn2');
  $('#ixM').innerHTML=`1M <b class="${{x.vix?'vixb':(m1>=0?'up':'dn2')}}">${{m1>=0?'+':''}}${{m1.toFixed(1)}}%</b><span class="dc"> · daily close</span>`;
  $('#ixSel').value=String(i);
  $('#ixCh').setAttribute('aria-label',`${{x.n}}, one month of daily closes, ${{d[0][0]}} to ${{d[d.length-1][0]}}: ${{fmt(v[0])}} to ${{fmt(last)}}`)}}
ixDraw(0);
$('#ixSel').addEventListener('change',e=>ixDraw(+e.target.value));
{{const c=$('.hg-c .hero-side');['mouseenter','focusin'].forEach(ev=>c.addEventListener(ev,()=>ixHold=true));['mouseleave','focusout'].forEach(ev=>c.addEventListener(ev,()=>ixHold=false));
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{{if(!ixHold&&!document.hidden)ixDraw((ixI+1)%IDX.length)}},5000)}}

/* ================= TRADE CALLS: one call at a time, switches every 5 s ================= */
const CALLS=[
 {{n:'SWIGGY',k:'Put spread',when:'Posted today',meta:'Expiry 23 Nov · 1,825 qty · Medium risk',legs:[['b','PUT 185','₹4.22',1],['s','PUT 180','₹2.35',1]],lv:['₹1.87','₹5.80','₹0.25','₹1.92'],tflag:'Above this spread’s ₹5.00 maximum value. Being checked with the research desk.',mp:'₹5,712',ml:'₹3,413',cap:'₹21,000'}},
 {{n:'FEDERALBNK',k:'Call ratio spread 1:2',when:'Posted 11 Nov',meta:'Expiry 23 Nov · 2,500 qty/lot · High risk',legs:[['b','CALL 360','₹5.55',1],['s','CALL 380','₹1.40',2]],lv:['₹2.75','₹5.90','₹1.40','₹3.95'],mp:'₹43,125',ml:'Unlimited >397',mlx:1,cap:'₹1,14,000'}}];
let ti=0,tcHold=false;
$('#tcDots').innerHTML=CALLS.map(()=>'<i></i>').join('');
function tcShow(i,anim){{ti=(i+CALLS.length)%CALLS.length;const c=CALLS[ti],b=$('#tcBody');
  b.innerHTML=`<div class="tc-new"><span class="eyebrow" style="color:var(--text-tertiary)">${{c.when}} · ${{ti+1}} of ${{CALLS.length}} active</span>
    <div class="top"><b>${{c.n}} · ${{c.k}}</b><span class="tc-act">Active</span></div><div class="meta">${{c.meta}}</div></div>
    <div class="tc-more"><div class="tc-legs2">${{c.legs.map(l=>`<div><i class="${{l[0]}}">${{l[0]==='b'?'Buy':'Sell'}}</i><span>${{l[1]}}${{l[3]>1?` <small>×${{l[3]}}</small>`:''}}</span><b>${{l[2]}}</b></div>`).join('')}}</div>
    <div class="tc-lv4"><div>Entry<b>${{c.lv[0]}}</b></div><div>Target<b class="up">${{c.lv[1]}}${{c.tflag?`<i class="tc-flag" title="${{c.tflag}}" aria-label="${{c.tflag}}">!</i>`:''}}</b></div><div>Stop loss<b class="dn">${{c.lv[2]}}</b></div><div>LTP<b>${{c.lv[3]}}</b></div></div>
    <div class="tc-risk"><div><span>Max profit</span><b class="rk-up">${{c.mp}}</b></div><div><span>Max loss</span><b class="rk-dn${{c.mlx?' x':''}}">${{c.ml}}</b></div><div><span>Capital</span><b>${{c.cap}}</b></div></div></div>`;
  [...$('#tcDots').children].forEach((d,j)=>d.classList.toggle('on',j===ti));
  if(anim){{b.classList.remove('in');void b.offsetWidth;b.classList.add('in')}}}}
tcShow(0,false);
$('#tcDots').addEventListener('click',e=>{{const d=e.target.closest('i');if(d)tcShow([...$('#tcDots').children].indexOf(d),true)}});
{{const card=$('.hg-tc');['mouseenter','focusin'].forEach(ev=>card.addEventListener(ev,()=>tcHold=true));['mouseleave','focusout'].forEach(ev=>card.addEventListener(ev,()=>tcHold=false));
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{{if(!tcHold&&!document.hidden)tcShow(ti+1,true)}},5000)}}
addEventListener('resize',()=>{{clearTimeout(window._tlr);window._tlr=setTimeout(renderToday,150)}});

{js_streak}renderStreak();

/* ================= ONE LEARNING CARD AT A TIME ================= */
const LVIZ={LVIZ};
const LEARN=[
 {{id:'term',kind:'Term of the day',h:'Short covering',one:'Traders who <b>bet on a fall buy back</b>, and that buying lifts the price.'}},
 {{id:'relation',kind:'Relation of the day',h:'Cheaper crude, relief for India',one:'India imports most of its oil, so <b>cheaper crude eases costs</b> at home.'}},
 {{id:'learning',kind:'Learning of the day',h:'Broad rallies beat narrow ones',one:'When <b>smaller stocks beat the index</b>, buying is wide and the rally sturdier.'}}];
let hi=Math.max(0,LEARN.findIndex(x=>!LRN.has(x.id)));
function hlShow(i,anim){{hi=(i+LEARN.length)%LEARN.length;const x=LEARN[hi],b=$('#hlBody');
  $('#hlKind').textContent=x.kind;$('#hlCount').textContent=`${{hi+1}} / ${{LEARN.length}}`;
  b.innerHTML=(doneToday()?`<div class="hl-done">✓ All 3 ideas learned · streak kept for today</div>`:'')+`<div class="hl-grid"><div class="hl-t"><h3 class="term">${{x.h}}</h3><p class="one">${{x.one}}</p></div>${{LVIZ[x.id]||''}}</div>`;
  [...$('#hlDots').children].forEach((d,j)=>{{d.classList.toggle('on',j===hi);d.classList.toggle('done',LRN.has(LEARN[j].id))}});
  $('#hlGot').dataset.learn=x.id;renderStreak();
  if(anim){{b.classList.remove('in');void b.offsetWidth;b.classList.add('in')}}}}
$('#hlPrev').onclick=()=>hlShow(hi-1,true);$('#hlNext').onclick=()=>hlShow(hi+1,true);
/* Got it → the next idea not yet learned comes up by itself (the streak handler above saves it first) */
$('#hlGot').addEventListener('click',()=>setTimeout(()=>{{if(doneToday()){{hlShow(hi,true);return}}if(!LRN.has(LEARN[hi].id))return;const k=LEARN.findIndex(x=>!LRN.has(x.id));setTimeout(()=>hlShow(k,true),450)}},0));
hlShow(hi,false);
/* changes idea every 5 s; pauses while the reader hovers or uses the card */
{{let hold=false;const c=$('#learnCard');c.addEventListener('mouseenter',()=>hold=true);c.addEventListener('mouseleave',()=>hold=false);
  c.addEventListener('focusin',()=>hold=true);c.addEventListener('focusout',()=>hold=false);
  setInterval(()=>{{if(!hold&&!document.hidden)hlShow(hi+1,true)}},5000)}}
if(location.hash==='#learn')setTimeout(()=>{{const t=getComputedStyle($('#learnRow')).display!=='none'?$('#learnRow'):$('#learnCard');t.scrollIntoView({{behavior:'smooth',block:'center'}});t.classList.add('pulse')}},400);
const TOC={STORY_TOC};
$('#toc').innerHTML=TOC.map((x,i)=>`<li><button data-ch="${{i+1}}"><span class="n">${{i+1}}</span><span class="h">${{x.h}}</span><span class="d">${{x.d}}</span></button></li>`).join('');
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
$('#toc').addEventListener('click',e=>{{const b=e.target.closest('[data-ch]');if(!b)return;const i=+b.dataset.ch;AUD.currentTime=CH[i].start+.05;ch=-1;showChapter(i);play(true)}});
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
