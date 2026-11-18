"""Desktop rewards panel: the phone app's rewards (free days, streak freezes, milestones, season,
Monday shoutout, badges) in a side panel that every desktop page can open.

The logic and markup are lifted from tools/app.js (between the "rewards:" marker and the
"streak sheet" marker) and the styles from the rewards block at the end of tools/app.css,
so the phone app and the desktop pages always show the same numbers. Both read the same
localStorage keys (journal reviews, learned ideas, and the app's "morning done" flag)."""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
STREAK = {'n': 6, 'week': [['M', 'done'], ['T', 'hol'], ['W', 'done'], ['T', 'today'], ['F', ''], ['S', 'off'], ['S', 'off']]}

# app.css rules the reward markup also needs (cards, headings, buttons, rows, week strip, facts)
BASE = ('.h2', '.muted', '.card', '.btn', '.list', '.row', '.tag', '.stk', '.wk', '.facts')

TOKENS = '''
.rwd{--track:rgba(255,255,255,.08);--up-text:#00C99A;--link:#8FA3FF;--surface-glass:rgba(255,255,255,.05);--fb-info-soft:rgba(50,130,232,.12);--fb-warning-soft:rgba(240,160,75,.12);--fin-positive-soft:rgba(0,201,154,.12);
  --surface-raised:#171B26;--surface-elevated:#1D2432;--surface-canvas:#101827;--text-primary:#F8FAFC;--text-secondary:#CBD5E1;--text-tertiary:#8793A5;--border-decorative:#252F3F;
  --teal:#00C99A;--amber:#F0A04B;--navy-900:#101827;--slate-200:#CBD5E1;--slate-400:#8793A5;--slate-500:#7B8799;--slate-600:#63758F;--action-primary:#3F5BD9;--action-hover:#3452C9;
  --font-sans:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color-scheme:dark}
:host([data-theme="light"]) .rwd{--track:rgba(16,24,39,.08);--up-text:rgb(4,120,87);--link:#3F5BD9;--surface-glass:rgba(16,24,39,.04);--surface-raised:#FFFFFF;--surface-elevated:#FFFFFF;--surface-canvas:#F8FAFC;
  --text-primary:#101827;--text-secondary:#34445B;--text-tertiary:#34445B;--border-decorative:#CBD5E1;color-scheme:light}
@media (prefers-color-scheme:light){:host(:not([data-theme="dark"])) .rwd{--track:rgba(16,24,39,.08);--up-text:rgb(4,120,87);--link:#3F5BD9;--surface-glass:rgba(16,24,39,.04);--surface-raised:#FFFFFF;--surface-elevated:#FFFFFF;--surface-canvas:#F8FAFC;
  --text-primary:#101827;--text-secondary:#34445B;--text-tertiary:#34445B;--border-decorative:#CBD5E1;color-scheme:light}}
'''

PAGE_CSS = '''
html.rwd-open .ob-tip,html.rwd-open .ob-ov{visibility:hidden}
.rwd-pill{display:inline-flex;align-items:center;gap:7px;height:38px;margin-left:20px;padding:0 12px 0 4px;border-radius:9999px;cursor:pointer;white-space:nowrap;vertical-align:middle;flex:none;
  background:linear-gradient(90deg,rgba(240,160,75,.16),rgba(240,160,75,.06));border:1px solid rgba(240,160,75,.3);color:#F8FAFC;font:500 12px/1 Inter,system-ui,sans-serif}
.rwd-pill.all{background:linear-gradient(90deg,rgba(0,201,154,.18),rgba(0,201,154,.06));border-color:rgba(0,201,154,.35)}
.rwd-pill:hover{border-color:rgba(240,160,75,.6)}.rwd-pill.all:hover{border-color:rgba(0,201,154,.7)}
.rwd-pill .rr{--p:0;position:relative;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#00C99A calc(var(--p)*1%),rgba(255,255,255,.1) 0)}
.rwd-pill .rr::before{content:"";position:absolute;inset:3px;border-radius:50%;background:#101827}
.rwd-pill .rr span{position:relative;font-size:14px;line-height:1}
.rwd-pill b{font:800 17px/1 Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums}
.rwd-pill small{font:500 12px/1 Inter,system-ui,sans-serif;color:#CBD5E1}
.rwd-pill em{font-style:normal;font-size:16px;line-height:1;color:#8793A5}
:root[data-theme="light"] .rwd-pill{color:#101827}:root[data-theme="light"] .rwd-pill small{color:#34445B}:root[data-theme="light"] .rwd-pill em{color:#34445B}
:root[data-theme="light"] .rwd-pill .rr{background:conic-gradient(#00C99A calc(var(--p)*1%),rgba(16,24,39,.1) 0)}:root[data-theme="light"] .rwd-pill .rr::before{background:#FFFFFF}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .rwd-pill{color:#101827}:root:not([data-theme="dark"]) .rwd-pill small{color:#34445B}:root:not([data-theme="dark"]) .rwd-pill .rr::before{background:#FFFFFF}}
.rwd-pill.float{position:fixed;right:20px;bottom:20px;z-index:8000;height:42px;background-color:#171B26;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.rwd-hide{display:none!important}
'''

SHELL = '''
.rwd-scrim{position:fixed;inset:0;z-index:2147483000;background:rgba(8,12,20,.6);opacity:0;transition:opacity .2s}
.rwd-scrim.on{opacity:1}
.rwd{position:fixed;top:0;right:0;bottom:0;z-index:2147483001;width:min(940px,100vw);display:flex;flex-direction:column;background:var(--surface-canvas);color:var(--text-primary);
  border-left:1px solid var(--border-decorative);box-shadow:-24px 0 60px rgba(0,0,0,.35);font:400 15px/1.5 var(--font-sans);letter-spacing:normal;word-spacing:normal;text-transform:none;transform:translateX(100%);transition:transform .25s ease;text-align:left}
.rwd.on{transform:none}
.rwd *{box-sizing:border-box}
:where(.rwd) button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
:where(.rwd) a{color:inherit;text-decoration:none}
.rwd-hd{flex:none;display:flex;align-items:center;gap:16px;padding:18px 28px;border-bottom:1px solid var(--border-decorative)}
.rwd-hd h2{margin:0;font:600 22px/1.2 var(--font-sans);letter-spacing:-.3px}
.rwd-hd small{font:500 13px/1.2 var(--font-sans);color:var(--text-tertiary)}
.rwd-hd .sp{flex:1}
.rwd .rwd-x{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;font-size:16px;color:var(--text-secondary)}
.rwd .rwd-x:hover{background:var(--surface-glass)}
.rwd-bd{flex:1;overflow:auto;padding:4px 28px 32px;overscroll-behavior:contain}
.rwd-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:20px}
.rwd-sum a{display:grid;gap:4px;padding:14px 16px;border-radius:14px;background:var(--surface-raised);border:1px solid var(--border-decorative)}
.rwd-sum a:hover{border-color:rgba(63,91,217,.5)}
.rwd-sum span{font:600 11.5px/1.2 var(--font-sans);letter-spacing:1px;text-transform:uppercase;color:var(--text-tertiary)}
.rwd-sum b{font:700 26px/1.1 var(--font-sans);font-variant-numeric:tabular-nums}
.rwd-sum small{font:500 12.5px/1.2 var(--font-sans);color:var(--text-secondary)}
.rwd-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 24px;align-items:start}
@media (max-width:820px){.rwd-cols{grid-template-columns:1fr}.rwd-sum{grid-template-columns:repeat(2,minmax(0,1fr))}.rwd-bd,.rwd-hd{padding-left:16px;padding-right:16px}}
.rwd .eb{font:600 11.5px/1.3 var(--font-sans);letter-spacing:1.1px;text-transform:uppercase;color:var(--text-tertiary)}
.rwd .sp{flex:1}
.rwd section.sec{scroll-margin-top:12px}
.rwd-sub{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,12,20,.55)}
.rwd-sub[hidden]{display:none}
.rwd-sub>div{width:min(460px,100%);max-height:86%;overflow:auto;padding:20px 22px 22px;border-radius:16px;background:var(--surface-elevated);border:1px solid var(--border-decorative);box-shadow:0 24px 60px rgba(0,0,0,.4)}
.rwd-sub .sh{display:flex;align-items:center;gap:12px;margin-bottom:8px}.rwd-sub .sh h3{flex:1;margin:0;font:600 18px/1.3 var(--font-sans)}
.rwd-sub p{margin:0 0 12px;color:var(--text-secondary);font-size:14px}
'''


def _app_css_block():
    css = open(os.path.join(HERE, 'app.css'), encoding='utf-8').read()
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    keep = []
    for line in css.splitlines():
        sel = line.split('{', 1)[0].strip()
        if sel and any(sel == b or sel.startswith(b + ' ') or sel.startswith(b + '.') or sel.startswith(b + ':') or sel.startswith(b + '>') for b in BASE):
            keep.append(line)
    tail = css[css.index('.cap{'):]          # the rewards block appended at the end of app.css
    block = '\n'.join(keep) + '\n' + tail

    return block


def _app_js_block():
    js = open(os.path.join(HERE, 'app.js'), encoding='utf-8').read()
    a = js.index('/* ---------------- rewards:')
    b = js.index('/* ---------------- streak sheet')
    return js[a:b]


JS = r'''
(function(){'use strict';
var store={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var D={streak:STREAK_JSON},LEARN={length:3},RULES=[['stop'],['size'],['setup'],['revenge'],['exit']];
function learned(){return store.get('sp-learn-2026-11-12',[])}
/* a day counts when the phone app's morning is done, or (on desktop) when all 3 ideas are learned */
function dayDone(){return !!store.get('ap-day-done-2026-11-12',0)||learned().length>=3}
function goals(){return [0]}function mDone(){return dayDone()?1:0}
function streakNow(){return D.streak.n+(dayDone()?1:0)}
var pn,scrim,sub,last;
function sheet(title,body){last=document.activeElement;sub.innerHTML='<div role="dialog" aria-modal="true" aria-label="'+esc(title.replace(/<[^>]+>/g,''))+'"><div class="sh"><h3>'+title+'</h3><button type="button" class="rwd-x" data-rwd-sub-x aria-label="Close">✕</button></div>'+body+'</div>';sub.hidden=false;sub.querySelector('[data-rwd-sub-x]').focus()}
function closeSub(){sub.hidden=true;sub.innerHTML='';if(last&&last.focus)last.focus()}
/*BLOCK*/
function bodyHTML(){var v=seasonScore(),ti=tierOf(v);
  return '<div class="rwd-sum">'+
    '<a href="#rwd-rewards"><span>Free days</span><b>'+freeDays()+'</b><small>off your next renewal</small></a>'+
    '<a href="#rwd-season"><span>Season</span><b>'+v+'</b><small>#'+myRank()+' · '+TIERS[ti][1]+'</small></a>'+
    '<a href="#rwd-streak"><span>Streak</span><b>🔥 '+streakNow()+'</b><small>'+freezes()+' of 2 freezes ready</small></a>'+
    '<a href="#rwd-badges"><span>Badges</span><b>'+BADGES.filter(bGot).length+'</b><small>of '+BADGES.length+' earned</small></a></div>'+
    '<div class="rwd-cols"><div>'+freeHTML()+streakHTML()+'</div><div>'+seasonHTML()+badgesHTML()+'</div></div>'}
function paintPills(){var d=dayDone(),p=d?100:Math.min(100,learned().length/3*100),t='<span class="rr" style="--p:'+p.toFixed(0)+'"><span aria-hidden="true">\uD83D\uDD25</span></span><b>'+streakNow()+'</b><small>day streak</small><em aria-hidden="true">\u203A</em>';[].forEach.call(document.querySelectorAll('.rwd-pill'),function(b){b.innerHTML=t;b.classList.toggle('all',d);b.setAttribute('aria-label',streakNow()+' day streak. Open streak and rewards')})}
function open(sec){if(!pn)build();pn.querySelector('.rwd-bd').innerHTML=bodyHTML().replace(/id="(rewards|streak|season|badges)"/g,'id="rwd-$1"');
  scrim.hidden=false;pn.hidden=false;requestAnimationFrame(function(){scrim.classList.add('on');pn.classList.add('on')});document.documentElement.style.overflow='hidden';document.documentElement.classList.add('rwd-open');
  setTimeout(function(){var el=sec&&pn.querySelector('#rwd-'+sec);if(el)el.scrollIntoView({block:'start'});else pn.querySelector('.rwd-x').focus()},60)}
function close(){if(!pn||pn.hidden)return;closeSub();scrim.classList.remove('on');pn.classList.remove('on');document.documentElement.style.overflow='';document.documentElement.classList.remove('rwd-open');
  setTimeout(function(){scrim.hidden=true;pn.hidden=true},250);if(/^#rewards/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);paintPills()}
function build(){var host=document.createElement('div');host.id='rwd-host';document.body.appendChild(host);var root=host.attachShadow({mode:'open'}),st=document.createElement('style');st.textContent=SHADOW_CSS;root.appendChild(st);
  var sync=function(){var t=document.documentElement.getAttribute('data-theme');if(t)host.setAttribute('data-theme',t);else host.removeAttribute('data-theme')};sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  scrim=document.createElement('div');scrim.className='rwd-scrim';scrim.hidden=true;
  pn=document.createElement('aside');pn.className='rwd';pn.hidden=true;pn.setAttribute('role','dialog');pn.setAttribute('aria-modal','true');pn.setAttribute('aria-labelledby','rwdH');
  pn.innerHTML='<div class="rwd-hd"><h2 id="rwdH">Your rewards</h2><small>Earned from habits, never from profit or how much you trade</small><span class="sp"></span><button type="button" class="rwd-x" aria-label="Close rewards">✕</button></div><div class="rwd-bd"></div><div class="rwd-sub" hidden></div>';
  root.appendChild(scrim);root.appendChild(pn);sub=pn.querySelector('.rwd-sub');
  scrim.addEventListener('click',close);
  pn.addEventListener('click',function(e){var a=e.target.closest('[data-badge],[data-act],[data-rwd-sub-x],.rwd-x,.rwd-sum a,.rwd-sub');if(!a)return;
    if(a.hasAttribute('data-rwd-sub-x'))return closeSub();
    if(a.classList.contains('rwd-sub')){if(e.target===a)closeSub();return}
    if(a.classList.contains('rwd-x'))return close();
    if(a.matches('.rwd-sum a')){e.preventDefault();var t=pn.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({block:'start',behavior:'smooth'});return}
    if(a.dataset.badge)return badgeSheet(a.dataset.badge);
    if(a.dataset.act==='board')return boardSheet()})}
function pill(){var b=document.createElement('button');b.type='button';b.className='rwd-pill';b.setAttribute('aria-label','Open your rewards');return b}
function place(){var vis=function(e){return e&&e.getClientRects().length},t;
  if(vis(t=document.querySelector('.ap-bar .ap-logo')))t.parentNode.insertBefore(pill(),t.nextSibling);
  else if(vis(t=document.getElementById('stkB'))){var p=pill();p.style.marginLeft='0';t.parentNode.insertBefore(p,t);t.classList.add('rwd-hide');var pp=document.getElementById('stkP');if(pp)pp.classList.add('rwd-hide')}
  else{var f=pill();f.classList.add('float');document.body.appendChild(f)}
  paintPills()}
document.addEventListener('click',function(e){var a=e.target.closest('.rwd-pill,a[href="#rewards"],a[href^="#rewards/"]');if(!a)return;e.preventDefault();open((a.getAttribute('href')||'').split('/')[1])});
document.addEventListener('keydown',function(e){if(e.key!=='Escape'||!pn||pn.hidden)return;if(!sub.hidden)closeSub();else close()});
function boot(){setTimeout(place,400);if(/^#rewards/.test(location.hash))setTimeout(function(){open(location.hash.split('/')[1])},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
addEventListener('storage',paintPills);
})();
'''


def css():
    return PAGE_CSS


def shadow_css():
    return TOKENS + SHELL + _app_css_block()


def js():
    return JS.replace('SHADOW_CSS', json.dumps(shadow_css())).replace('STREAK_JSON', json.dumps(STREAK, separators=(',', ':'))).replace('/*BLOCK*/', _app_js_block())


def inject(html):
    """Add the rewards panel to a finished desktop page."""
    html = html.replace('</head>', '<style>' + css() + '</style>\n</head>', 1)
    i = html.rindex('</body>')
    return html[:i] + '<script>' + js() + '</script>\n' + html[i:]
