/* AlphaPad phone app. Tabs: Today, Markets, Ideas, Journal, You. Data: window.CD + Home's data globals + JD/JDP. */
(function(){
'use strict';
var D=window.CD,L=D.links,root=document.documentElement,app=document.getElementById('app');
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var inr=function(v,sign){var s='₹'+Math.abs(Math.round(v)).toLocaleString('en-IN');return (v<0?'−\u2060':(sign&&v>0?'+\u2060':''))+s};
var mmss=function(t){t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
var num=function(v,dp){return v.toLocaleString('en-IN',{minimumFractionDigits:dp,maximumFractionDigits:dp})};
var I=function(p,w){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.8)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
var store={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var ICO={
  ipo:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="m8 15 4-4 3 3 5-6"/>',
  inbox:'<path d="M4 13h4l2 3h4l2-3h4"/><path d="M5 5h14l1 8v6H4v-6z"/>',bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  today:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  markets:'<path d="M4 19h16"/><path d="m5 15 4-5 4 3 6-7"/>',
  ideas:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  journal:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M9 9h6M9 13h6"/>',
  you:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  sd:'<path d="m4 15 6-6 4 4 6-6"/><path d="M15 7h5v5"/>',vol:'<path d="M5 20V10M10 20V4M15 20v-7M20 20v-4"/>',br:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8h-8z"/>',
  del:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',oi:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  tc:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',fo:'<path d="M4 20V10M9 20V4M14 20v-8M19 20v-5"/>',bk:'<path d="M3 9h18l-2 11H5z"/><path d="m8 9 4-6 4 6"/>',
  learn:'<path d="M2 8l10-5 10 5-10 5z"/><path d="M6 10v5c3 2 9 2 12 0v-5"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  scan:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',file:'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',mv:'<path d="M7 17V7M3 11l4-4 4 4M17 7v10M13 13l4 4 4-4"/>',
  bt:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/>',brief:'<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>',ext:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  studio:'<path d="M4 4h16v16H4z"/><path d="M4 10h16M10 4v16"/>',lms:'<path d="M4 19V5l8 4 8-4v14l-8 4z"/>',theme:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z"/>',reset:'<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4h4"/>',
  setup:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'};

/* ---------------- journal model (same storage as the desktop journal) ---------------- */
var MISTAKE={stop:'No stop-loss',size:'Oversized',setup:'Off-plan setup',revenge:'Revenge trade',exit:'Early or late exit'};
var RULES=[['stop','Stop-loss placed before entry'],['size','Size within planned risk'],['setup','Setup from my playbook'],['revenge','No revenge trade'],['exit','Exited as planned']];
var SETUPS=['Opening range breakout','VWAP pullback','Breakout retest','Trend continuation','Mean reversion'],MOODS=['Calm','Focused','Confident','Rushed','Anxious'];
var BASE=window.JD||[],PEND=window.JDP||[],rv=store.get('ap-journal-review',{}),notes=store.get('ap-journal-notes',{}),ALL=[];
function mergeAll(){var mine=PEND.filter(function(p){return rv[p.id]&&rv[p.id].status==='ok'}).map(function(p){var r=rv[p.id],rules=r.rules||{},t=JSON.parse(JSON.stringify(p));
    t.setup=r.setup;t.rules=rules;t.score=Object.keys(MISTAKE).filter(function(k){return rules[k]}).length;t.mistakes=Object.keys(MISTAKE).filter(function(k){return !rules[k]}).map(function(k){return MISTAKE[k]});t.mood=r.mood||'–';t.note=r.note||'';t.confirmed=true;return t});
  ALL=BASE.concat(mine).sort(function(a,b){return (a.d+a.t)<(b.d+b.t)?-1:1})}
mergeAll();
var todo=function(){return PEND.filter(function(p){return !rv[p.id]})};
var MONTHS=function(){return Array.from(new Set(ALL.map(function(t){return t.d.slice(0,7)}))).sort()};
var jMonth=MONTHS().slice(-1)[0],jDay=null;
var dt=function(d){return new Date(d+'T12:00:00')},mname=function(m){return new Date(m+'-15T12:00:00').toLocaleDateString('en-IN',{month:'long',year:'numeric'})};
var dlong=function(d){return dt(d).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})};
var hrs=function(m){return m>=1440?Math.round(m/1440)+'d':m>=60?(m/60).toFixed(1).replace('.0','')+'h':m+'m'};
function stats(tr){var w=tr.filter(function(t){return t.pnl>0}),l=tr.filter(function(t){return t.pnl<0}),sum=function(a){return a.reduce(function(s,t){return s+t.pnl},0)},gw=sum(w),gl=-sum(l);
  return {n:tr.length,net:gw-gl,w:w.length,l:l.length,wr:tr.length?w.length/tr.length*100:0,pf:gl?gw/gl:0,aw:w.length?gw/w.length:0,al:l.length?gl/l.length:0,
    score:tr.length?tr.reduce(function(s,t){return s+(t.score||0)},0)/tr.length:0}}

/* ---------------- shell ---------------- */
var TABS=[['today','Today'],['markets','Markets'],['ideas','Ideas'],['journal','Journal'],['you','You']];
app.innerHTML=TABS.map(function(t){return '<main class="scr" id="s-'+t[0]+'" aria-label="'+t[1]+'"></main>'}).join('')+'<main class="scr" id="s-rewards" aria-label="Streak and rewards"></main><main class="scr" id="s-ipos" aria-label="IPOs"></main>'+
  '<div class="mini" id="mini" hidden><div><button type="button" class="pp" id="mPP" aria-label="Pause">❚❚</button><button type="button" class="tx" id="mOpen" aria-label="Open chapters"><b id="mCh"></b><small id="mT"></small></button><a class="nw" id="mNews" href="#markets/filings">News <i aria-hidden="true">→</i></a><button type="button" class="x" id="mX" aria-label="Stop the brief">✕</button><i class="pr" id="mPr"></i></div></div>'+
  '<div class="tabs"><nav aria-label="App"><i class="tind" aria-hidden="true"></i>'+TABS.map(function(t){return '<a href="#'+t[0]+'" data-tab="'+t[0]+'">'+I(ICO[t[0]],1.9)+'<span>'+t[1]+'</span>'+(t[0]==='journal'?'<span class="badge" id="jBadge" hidden></span>':'')+'</a>'}).join('')+'</nav></div>'+
  '<div class="sheet" id="sheet" hidden role="dialog" aria-modal="true"><div class="pn" id="sheetPn"></div></div><div class="toast" id="toast" role="status" hidden></div><div class="ovw" id="ovw" hidden role="dialog" aria-modal="true" aria-label="Market overview"><div class="ovp" id="ovwP"></div></div>';

var tab='today',prevH='#today',lastTab='';
function route(){var h=(location.hash||'#today').slice(1).split('/'),t=h[0],sec=h[1],pg=PAGES.indexOf(t)>=0;if(!pg&&!TABS.some(function(x){return x[0]===t}))t='today';if(!pg)prevH='#'+h.join('/');backH=lastH;lastH='#'+h.join('/');tab=t;
  var ni=TABS.findIndex(function(x){return x[0]===t}),oi=TABS.findIndex(function(x){return x[0]===lastTab}),nv=$('.tabs nav');
  if(nv){nv.style.setProperty('--i',ni<0?(oi<0?0:oi):ni);nv.classList.toggle('noind',ni<0)}
  var dir=t===lastTab?(pg&&sec!==lastSec?'r':''):(pg?'up':(PAGES.indexOf(lastTab)>=0?'dn':(ni>oi?'r':'l')));lastSec=sec;
  $$('.scr').forEach(function(s){var on=s.id==='s-'+t;s.classList.toggle('on',on);s.classList.remove('sl-r','sl-l','sl-up','sl-dn');if(on&&dir){void s.offsetWidth;s.classList.add('sl-'+dir)}});lastTab=t;$$('.tabs a').forEach(function(a){if(a.dataset.tab===t)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(t==='markets')mark('watch');if(t==='ideas'&&(sec==='calls'||!sec))mark('calls');
  setTimeout(paintAudio,0);subSec=sec||null;if(!sec&&SUBS[t])subSel[t]=subSel[t]||null;if(t==='markets'&&sec==='ipos')invSeg='ipo';if(t==='markets'&&/^(mf|sip)/.test(sec||''))invSeg='mf';RENDER[t]();if(t==='markets')flFade();if(t==='journal'&&sec==='review')setTimeout(jRevSheet,80);if(t==='ideas'&&sec==='record')setTimeout(recSheet,60);if(sec&&(!SUBS[t]||!SUBS[t].some(function(x){return x[0]===sec}))){var el=document.getElementById(sec);if(el)setTimeout(function(){el.scrollIntoView({block:'start'})},30)}else window.scrollTo(0,0)}
var PAGES=['rewards','ipos'],backH='',lastH='',lastSec;
function go(h){if(location.hash==='#'+h)route();else location.hash=h}
addEventListener('hashchange',route);
function badge(){var n=todo().length,b=$('#jBadge');b.hidden=!n;b.textContent=n}
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(function(){t.hidden=true},2600)}

/* sheet */
var lastFocus=null;
function sheet(title,body,after){lastFocus=document.activeElement;var s=$('#sheet'),old=$('#sheetPn'),fresh=old.cloneNode(false);old.parentNode.replaceChild(fresh,old);fresh.innerHTML='<div class="grab" aria-hidden="true"></div><div class="sh"><h2 id="shH">'+title+'</h2><button type="button" class="cl" data-close aria-label="Close">✕</button></div>'+body;
  s.setAttribute('aria-labelledby','shH');s.hidden=false;document.body.style.overflow='hidden';if(after)after($('#sheetPn'));setTimeout(function(){var f=$('#sheetPn [data-close]');if(f)f.focus()},50)}
function closeSheet(){$('#sheet').hidden=true;document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}
$('#sheet').addEventListener('click',function(e){if(e.target.id==='sheet'||e.target.closest('[data-close]'))closeSheet()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('#sheet').hidden)closeSheet()});
function top(title,right){return '<header class="top">'+(title?'<h1>'+title+'</h1>':'<a class="logo" href="#today" aria-label="AlphaPad"><span>α</span>lphaPad</a>')+'<span class="sp"></span>'+(right||'')+'</header>'}
function streakChip(){return '<a class="chip" href="#rewards" data-act="streak" aria-label="'+streakNow()+' day streak">🔥 '+streakNow()+'</a>'}
function avatar(){return '<a class="av" href="#you" aria-label="You">T</a>'}
function info(title,text,src){sheet(esc(title),'<p>'+text+'</p>'+(src?'<p class="note">'+esc(src)+'</p>':''))}
function infoBtn(k){return '<button type="button" class="l" data-info="'+k+'" aria-label="About this">ⓘ</button>'}
var INFO_TXT={
  calls:['Trade calls','Research calls from the AlphaPad desk. Each shows the option legs, entry, target, stop loss and last price, plus the payoff worked out from the legs and quantity: max profit, max loss, and capital. A ratio spread can lose more than it costs, so its max loss can read “unlimited”.','Source: AlphaPad Trade Calls · Prices are indicative · Research advice, not a recommendation to trade'],
  fo:['F&O levels','From yesterday’s Nifty option open interest for the nearest expiry. Support is the strike with the most put OI near spot; resistance is the strike with the most call OI near spot. Max pain is where option buyers as a whole would lose the most at expiry. Levels are a guide, not a forecast.','Source: NSE F&O bhavcopy, 11 Nov close'],
  oib:['OI buildup','Futures where price and open interest moved together tell you who is adding positions. Price up with OI up is long buildup; price down with OI up is short buildup; price up with OI down is short covering; price down with OI down is long unwinding.','211 stock futures · OI across expiries · NSE 11 Nov'],
  sd:['Stock of the day','Picked on technicals from the Nifty 500: a fresh 52-week closing high, confirmed by volume, delivery and futures open interest. It is analysis, not advice.','Source: NSE bhavcopy, '+D.sotd.date+' close']};

/* ---------------- audio ---------------- */
var A=new Audio(D.audio.src);A.preload='none';var CH=D.audio.ch;
function chAt(t){var i=0;CH.forEach(function(c,j){if(t>=c[1])i=j});return i}
function paintAudio(){var t=A.currentTime,d=A.duration||D.audio.dur,i=chAt(t),on=!A.paused;
  var idle=!on&&!(t>0);$('#mini').hidden=idle&&tab!=='today';root.classList.toggle('playing',!$('#mini').hidden);$('#mini').classList.toggle('idle',idle);$('#mX').hidden=idle;
  if(idle){$('#mCh').textContent='Today’s brief';$('#mT').textContent=mmss(d)+' · '+CH.length+' chapters · tap to listen'}else{$('#mCh').textContent=CH[i][0];$('#mT').textContent='Chapter '+(i+1)+' of '+CH.length+' · '+mmss(t)+' / '+mmss(d)}$('#mPr').style.width=(t/d*100)+'%';
  $('#mPP').textContent=on?'❚❚':'▶';$('#mPP').setAttribute('aria-label',on?'Pause':'Play');
  $$('.play[data-act="listen"]').forEach(function(b){b.textContent=on?'\u275A\u275A':'\u25B6';b.setAttribute('aria-label',on?'Pause the brief':'Play the brief')});
  if($('#bpT')){$('#bpT').textContent=on?'Playing':t>0?'Paused \u00B7 '+mmss(t):'Listen';$('#bpS').textContent=t>0?'Chapter '+(i+1)+' \u00B7 '+CH[i][0]:'7 chapters';$('#bpBar').style.width=(t/d*100)+'%'}
  if(t>=20)mark('brief');
  var cs=$('#chs');if(cs)$$('.row',cs).forEach(function(r,j){r.classList.toggle('on',j===i)})}
function toggleAudio(){if(A.paused)A.play().catch(function(){toast('Audio could not start. Try again.')});else A.pause();paintAudio()}
['timeupdate','play','pause','loadedmetadata'].forEach(function(e){A.addEventListener(e,paintAudio)});A.addEventListener('ended',function(){A.currentTime=0;paintAudio()});
$('#mPP').onclick=toggleAudio;$('#mX').onclick=function(){A.pause();A.currentTime=0;paintAudio()};
$('#mOpen').onclick=function(){if(A.paused&&!(A.currentTime>0))toggleAudio();else chapters()};
function chapters(){sheet('Today’s brief','<p>'+esc(D.head)+' '+esc(D.sub)+'</p><div class="list chs" id="chs">'+CH.map(function(c,j){return '<button type="button" class="row" data-ch="'+j+'"><span class="tx"><b>'+esc(c[0])+'</b><small>Chapter '+(j+1)+' · starts at '+mmss(c[1])+'</small></span><span class="go">▶</span></button>'}).join('')+'</div>'+
  '<a class="btn g full" style="margin-top:16px" href="'+L.brief+'">Read the full brief '+I(ICO.ext)+'</a>',function(p){p.addEventListener('click',function(e){var r=e.target.closest('[data-ch]');if(!r)return;A.currentTime=CH[+r.dataset.ch][1];A.play().catch(function(){});paintAudio()});paintAudio()})}

/* ---------------- shared bits ---------------- */
function spark(v,W,H,pad){pad=pad||3;var lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),r=(hi-lo)||1;return v.map(function(x,i){return (i*W/(v.length-1)).toFixed(1)+','+(H-pad-(x-lo)/r*(H-2*pad)).toFixed(1)}).join(' ')}
function bar(label,val,w,cls,right){return '<div class="br"><b>'+label+'</b><span class="vl '+(right||'')+'">'+val+'</span><span class="tr"><i class="'+(cls||'')+'" style="width:'+Math.max(2,Math.min(100,w)).toFixed(0)+'%"></i></span></div>'}
function istNow(){var q=/[?&]t=(\d\d):?(\d\d)/.exec(location.search);if(q)return {h:+q[1],m:+q[2],wd:4};var f=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',weekday:'short',hourCycle:'h23'}).formatToParts(new Date()),g=function(t){return (f.filter(function(x){return x.type===t})[0]||{}).value};
  return {h:+g('hour'),m:+g('minute'),wd:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday'))}}
var now=new Date(),IST=istNow(),nowM=IST.h*60+IST.m,toM=function(t){var a=t.split(':');return +a[0]*60+ +a[1]};
var DAYS=(typeof DAY!=='undefined'?DAY:[]);
function nextEv(){var up=DAYS.filter(function(e){return e.t&&toM(e.t)>=nowM});return up[0]}

/* ---------------- TODAY ---------------- */
function sotdViz(){var sp=spark(D.sotd.closes,100,34),oy=D.sotd.oldy.toFixed(1);return '<div class="v-sd"><svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ag1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00C99A" stop-opacity=".3"/><stop offset="1" stop-color="#00C99A" stop-opacity="0"/></linearGradient></defs><polygon fill="url(#ag1)" points="0,34 '+sp+' 100,34"/><line class="oh" x1="0" x2="100" y1="'+oy+'" y2="'+oy+'" vector-effect="non-scaling-stroke"/><polyline points="'+sp+'" vector-effect="non-scaling-stroke"/></svg><span class="oh-l">Old high ₹'+num(D.sotd.old_hi,0)+'</span></div>'}
var SC=function(id){return (D.scan.filter(function(s){return s.id===id})[0]||{rows:[]})};
function spotSlides(){var S=D.sotd,vol=SC('sc-vol').rows,hi=SC('sc-hi'),del=SC('sc-del').rows;
  var hiN=parseInt((hi.h.match(/(\d+)\s*stocks/)||[0,149])[1],10),loN=parseInt(((SC('sc-lo').h||'').match(/(\d+)\s*stocks/)||[0,7])[1],10),pct=hiN/(hiN+loN)*100;
  var lb=OIB.lb.top[0];
  return [
   {c:'t',ic:'sd',tip:'A 52-week high is the highest close in a year. Breaking it with heavy volume is a classic strength signal.',k:'Stock of the day \u00B7 '+S.date,t:S.s,v:'₹'+num(S.close,0),d:'+'+S.chg.toFixed(2)+'%',sub:'Fresh 52-week high, '+((S.close/S.old_hi-1)*100).toFixed(1)+'% above the old peak.',
    viz:sotdViz()+'<div class="v-ch"><span>Volume<b>'+S.vx+'×</b></span><span>Delivery<b>'+Math.round(S.dl)+'%</b></span><span>Futures OI<b>+'+Math.round(S.oi)+'%</b></span></div>',a:[['#ideas/sd','Why it’s picked']]},
   {c:'a',ic:'vol',tip:'Volume is how many shares changed hands. A spike means unusual interest: find the reason before acting.',k:'Volume shockers',t:vol[0].s,v:vol[0].v,d:vol[0].c,sub:'Volume far above the 20-day average. Check the news first.',
    viz:'<div class="bars">'+vol.slice(0,3).map(function(r){return bar(r.s,r.v,r.w,'a')}).join('')+'</div>',a:[['#markets/scan','See the full scan']]},
   {c:'t',ic:'br',tip:'Breadth counts how many stocks rose versus fell. Many new highs means the rally is wide, not just a few big names.',k:'Breadth \u00B7 Nifty 500',t:hiN+' vs '+loN,v:'',d:'',sub:'New 20-day highs against new lows: a broad rally.',
    viz:'<div class="v-br"><div class="ring" style="--p:'+pct.toFixed(1)+'" role="img" aria-label="'+hiN+' new highs, '+loN+' new lows"><b>'+Math.round(pct)+'%</b><small>highs</small></div><div class="bars">'+hi.rows.slice(0,3).map(function(r){return '<div class="br"><b>'+r.s+'</b><span class="vl u">'+r.c+'</span></div>'}).join('')+'</div></div>',a:[['#markets/scan','See new highs']]},
   {c:'b',ic:'del',tip:'Delivery % is the share of trades held overnight rather than squared off the same day. Higher means more conviction.',k:'Delivery spikes',t:del[0].s,v:del[0].v.split(' ')[0],d:'+'+del[0].v.split(' ')[1]+' pts',sub:'Shares changing hands for delivery, not intraday.',
    viz:'<div class="bars">'+del.slice(0,3).map(function(r){var p=r.v.split(' '),tot=parseFloat(p[0]),j=parseFloat(p[1]);return '<div class="br"><b>'+r.s+'</b><span class="vl">'+p[0]+' <small class="u">+'+p[1]+'</small></span><span class="tr two"><i class="b p" style="width:'+(tot-j)+'%"></i><i class="b" style="width:'+j+'%"></i></span></div>'}).join('')+'</div><div class="v-lg"><span><i class="p"></i>yesterday</span><span><i></i>today’s jump</span></div>',a:[['#markets/scan','See delivery spikes']]},
   {c:'i',ic:'oi',tip:'Open interest (OI) is the number of open futures contracts. Price and OI rising together usually means new buyers.',k:'Futures buildup \u00B7 211 stocks',t:lb.s,v:'OI +'+Math.round(lb.o)+'%',d:'+'+lb.p.toFixed(1)+'%',sub:'Price and OI rising together: fresh buying.',
    viz:'<div class="v-q">'+OIQ.map(function(q,i){return '<span class="q'+(q[3]==='u'?' qu':'')+(i?'':' on')+'"><small>'+q[1]+'</small><b>'+OIB[q[0]].n+'</b><em>'+OIB[q[0]].top[0].s+'</em></span>'}).join('')+'</div>',a:[['#markets/movers','See OI buildup']]}]}
/* ---------------- setup: three questions, every answer counts ---------------- */
var NAMES={basic:'Basic',options:'Options trader',picker:'Stock picker',investor:'Investor',learner:'Learner'};
var GOALS={brief:['Hear the market in 5 minutes','The brief, read or listened to'],calls:['Get trade ideas','Calls, levels and the pick of the day'],journal:['Review my trades','Journal, win rate, habits'],learn:['Learn as I go','One idea a day, terms explained'],watch:['Watch the market','Indices, F&O levels, filings']};
var OQ=[
  {k:'exp',q:'How long have you been trading?',sub:'This sets how much we explain.',a:[['new','Just starting','Under 6 months: explain terms as I go'],['some','A year or two','I know the basics'],['pro','Several years','Keep it short, skip the basics']]},
  {k:'what',q:'What do you trade most?',sub:'This decides what your screen leads with.',a:[['fo','Options and futures','Nifty, Bank Nifty, stock F&O'],['swing','Stocks for days or weeks','Swing and positional trades'],['long','Long-term investing','Baskets, SIPs, holding for years'],['explore','Not sure yet','I am still finding my style']]},
  {k:'goals',q:'What should your morning cover?',sub:'Pick up to 3. They become your daily checklist.',multi:3,a:Object.keys(GOALS).map(function(k){return [k,GOALS[k][0],GOALS[k][1]]})}];
function presetFor(a){if(a.what==='fo')return 'options';if(a.what==='swing')return 'picker';if(a.what==='long')return 'investor';return a.exp==='new'?'learner':'basic'}
function defaultGoals(a){var g={fo:['brief','calls','journal'],swing:['calls','watch','journal'],long:['brief','watch','learn'],explore:['brief','learn','watch']}[a&&a.what]||['brief','calls','journal','learn'];return a&&a.exp==='new'&&g.indexOf('learn')<0?g.slice(0,2).concat(['learn']):g}
var profile=function(){return store.get('ap-profile',null)};
function presetName(){var p=profile();return p&&!p.skipped?NAMES[p.preset]:'Basic'}
/* the steps you picked come first; the morning always has at least 3 so the flow is visible */
function goals(){var p=profile(),a=p&&p.answers,g=(a&&a.goals&&a.goals.length?a.goals:defaultGoals(a)).slice();defaultGoals(a).concat(['brief','calls','journal','learn','watch']).forEach(function(k){if(g.length<3&&g.indexOf(k)<0)g.push(k)});return g}
function beginner(){var p=profile();return !!(p&&p.answers&&p.answers.exp==='new')}
var ob=null;
function onboard(){var ans={},step=0;ob=document.createElement('div');ob.className='onb';ob.setAttribute('role','dialog');ob.setAttribute('aria-modal','true');ob.setAttribute('aria-label','Set up AlphaPad');document.body.appendChild(ob);document.body.style.overflow='hidden';
  function finish(p){store.set('ap-profile',p);ob.remove();ob=null;document.body.style.overflow='';if(location.hash!=='#today')location.hash='today';else route();setTimeout(function(){var c=$('#morning');if(c){c.scrollIntoView({block:'center'});c.classList.add('glow');setTimeout(function(){c.classList.remove('glow')},2400)}},120)}
  function skip(){finish({preset:'basic',skipped:true,answers:{goals:defaultGoals(null)},at:Date.now()})}
  function draw(){var n=OQ.length,h='';
    if(step===0){h='<div class="ob-in ob-hello"><div class="logo big"><span>α</span>lphaPad</div><h2>Your market morning, in five minutes.</h2><ul><li><b>Listen</b> to the day’s brief</li><li><b>Check</b> calls, levels and the pick of the day</li><li><b>Review</b> your trades and keep your streak</li></ul><button type="button" class="btn p full" data-ob="start">Set up in 3 questions</button><button type="button" class="ob-skip" data-ob="skip">Skip, show me everything</button></div>'}
    else if(step<=n){var q=OQ[step-1],sel=ans[q.k]||(q.multi?[]:null);
      h='<div class="ob-in"><div class="ob-bar"><button type="button" class="ob-back" data-ob="back" aria-label="Back">‹</button><div class="ob-prog"><i style="width:'+(step/(n+1)*100)+'%"></i></div><button type="button" class="ob-skip" data-ob="skip">Skip</button></div>'+
        '<span class="eb">Question '+step+' of '+n+'</span><h2>'+q.q+'</h2><p class="muted">'+q.sub+'</p><div class="ob-opts" role="'+(q.multi?'group':'radiogroup')+'">'+q.a.map(function(o){var on=q.multi?sel.indexOf(o[0])>=0:sel===o[0];return '<button type="button" class="ob-o'+(on?' on':'')+'" role="'+(q.multi?'checkbox':'radio')+'" aria-checked="'+on+'" data-v="'+o[0]+'"><span><b>'+o[1]+'</b><small>'+o[2]+'</small></span><i aria-hidden="true">'+(on?'✓':'')+'</i></button>'}).join('')+'</div>'+
        (q.multi?'<button type="button" class="btn p full" data-ob="next"'+(sel.length?'':' disabled')+'>'+(sel.length?'Continue with '+sel.length:'Pick at least one')+'</button>':'')+'</div>'}
    else{var p=presetFor(ans),g=ans.goals;
      h='<div class="ob-in ob-done"><div class="ob-bar"><button type="button" class="ob-back" data-ob="back" aria-label="Back">‹</button><div class="ob-prog"><i style="width:100%"></i></div><span></span></div><div class="ob-badge" aria-hidden="true">✨</div><h2>You’re set up</h2>'+
        '<div class="ob-sum"><div><span>Your screen</span><b>'+NAMES[p]+'</b></div><div><span>Your morning</span><b>'+g.map(function(k){return GOALS[k][0]}).join(' · ')+'</b></div><div><span>Explanations</span><b>'+(ans.exp==='new'?'On: we explain terms as you go':ans.exp==='pro'?'Short: basics skipped':'Standard')+'</b></div></div>'+
        '<p class="muted">Finish your morning checklist each market day to keep your streak. Change this any time in You.</p><button type="button" class="btn p full" data-ob="go">Start my day →</button></div>'}
    ob.innerHTML=h;var f=ob.querySelector('.ob-o,.btn');if(f)f.focus({preventScroll:true})}
  ob.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var a=b.dataset.ob;
    if(a==='start'){step=1;return draw()}if(a==='skip')return skip();if(a==='back'){step=Math.max(0,step-1);return draw()}
    if(a==='next'){step++;return draw()}if(a==='go')return finish({preset:presetFor(ans),answers:ans,at:Date.now()});
    if(b.dataset.v){var q=OQ[step-1];if(q.multi){var s=ans[q.k]||[],i=s.indexOf(b.dataset.v);if(i>=0)s.splice(i,1);else if(s.length<q.multi)s.push(b.dataset.v);else{toast('Pick up to '+q.multi);return}ans[q.k]=s;draw()}else{ans[q.k]=b.dataset.v;draw();setTimeout(function(){step++;draw()},160)}}});
  ob.addEventListener('keydown',function(e){if(e.key==='Escape')skip()});draw()}

/* ---------------- your morning: a daily checklist that keeps the streak ---------------- */
var MKEY='ap-morning-2026-11-12';
function mstate(){return store.get(MKEY,{})}
function mark(k){var m=mstate();if(m[k])return;var was=mDone()===goals().length;m[k]=Date.now();store.set(MKEY,m);if(tab==='today')paintMorning();if(!was&&mDone()===goals().length)toast('Morning done: +10 season points, streak '+streakNow())}
/* colour, icon and button word for each morning step */
var SLOOK={brief:['i','brief','Play'],calls:['t','tc','View'],journal:['a','journal','Review'],learn:['b','learn','Learn'],watch:['t','markets','Open']};
var STEP={
  brief:['Listen to the brief','7 chapters · '+mmss(D.audio.dur),function(){return !!mstate().brief},'@listen'],
  calls:['Check today’s calls',CALLS.length+' active · track record inside',function(){return !!mstate().calls},'#ideas/calls'],
  journal:['Review today’s trades',function(){var n=todo().length;return n?n+' fetched from your broker':'All reviewed'},function(){return todo().length===0},'#journal/review'],
  learn:['Learn 3 ideas',function(){var l=learned().length;return l+' of '+LEARN.length+' done'},function(){return learned().length>=LEARN.length},'#ideas/learn'],
  watch:['Check the market','Indices, F&O levels, filings',function(){return !!mstate().watch},'#markets']};
function mDone(){return goals().filter(function(k){return STEP[k][2]()}).length}
function streakNow(){return D.streak.n+(mDone()===goals().length?1:0)}
function morningHTML(){var g=goals(),d=mDone(),all=d===g.length,pct=d/g.length*100;store.set('ap-day-done-2026-11-12',all?1:0);
  return '<section class="card morning'+(all?' all':'')+'" id="morning" aria-labelledby="mH"><div class="mh"><h2 id="mH">'+(all?'Morning done 🔥':'Your morning')+'</h2><small>'+(all?'Streak kept · +10 pts':d+'/'+g.length+' · '+(g.length-d)+' left for 🔥 '+(D.streak.n+1))+'</small></div>'+
    '<ol class="steps">'+g.map(function(k,n){var s=STEP[k],ok=s[2](),sub=typeof s[1]==='function'?s[1]():s[1],m=SLOOK[k];return '<li><a class="stp c-'+m[0]+(ok?' ok':'')+'" href="'+(s[3][0]==='@'?'#today':s[3])+'"'+(s[3]==='@listen'?' data-act="listen"':'')+'><span class="si" aria-hidden="true">'+(ok?I('<path d="m5 12 5 5 9-10"/>',2.6):I(ICO[m[1]],2))+'</span><span class="tx"><em>Step '+(n+1)+' of '+g.length+'</em><b>'+s[0]+'</b><small>'+sub+'</small></span><span class="cta" aria-hidden="true">'+(ok?'Done':m[2])+'</span><span class="sr">'+(ok?'done':'to do')+'</span></a></li>'}).join('')+'</ol><div class="mdots" aria-hidden="true">'+g.map(function(k){return '<i class="'+(STEP[k][2]()?'ok':'')+'"></i>'}).join('')+'</div></section>'}
function morningSlide(){var ol=$('#morning .steps');if(!ol)return;var lis=$$('li',ol),f=lis.findIndex(function(li){return !li.querySelector('.stp.ok')});if(f>0)ol.scrollLeft=lis[f].offsetLeft-ol.offsetLeft-20;
  var dots=$$('#morning .mdots i'),sync=function(){var i=Math.round(ol.scrollLeft/(lis[0].offsetWidth+20));dots.forEach(function(d,j){d.classList.toggle('on',j===i)})};sync();ol.addEventListener('scroll',sync,{passive:true})}
function paintMorning(){var c=$('#morning');if(!c)return;var t=document.createElement('div');t.innerHTML=morningHTML();c.replaceWith(t.firstChild);paintHero();morningSlide();var m=$('#morning');if(m){m.dataset.sub='home';m.classList.toggle('sub-off',!!subSel.today&&subSel.today!=='home')}var sc=$$('[data-act="streak"]');sc.forEach(function(b){b.innerHTML='🔥 '+streakNow()})}

/* ---------------- TODAY ---------------- */
var CL=D.closed||[],CLW=CL.filter(function(c){return c.how==='target'}).length;
function fyRows(){var p=profile(),key=(p&&p.preset)||'basic',mo=MONTHS().slice(-1)[0],st=stats(ALL.filter(function(x){return x.d.slice(0,7)===mo})),v=seasonScore(),nx=nextEv();
  var R=[
    ['b',ICO.journal,'Your month',st.n+' trades · '+st.wr.toFixed(0)+'% win rate',inr(st.net,true),st.net>=0?'u':'','#journal/overview'],
    locked()?['i',ICO.tc,'Your live calls',CALLS.length+' posted today · locked','Unlock','','@pro']:['i',ICO.tc,'Your live calls',CALLS.length+' active · '+CLW+' of '+CL.length+' recent hit target','','','#ideas/calls'],
    ['t',ICO.star,'Your rewards',freeDays()+' free days · '+TIERS[tierOf(v)][1]+' · #'+myRank(),v+' pts','','#rewards']];
  var X={options:['a',ICO.fo,'Your expiry: Nifty '+D.fo.exp.replace(/^Expiry\s*/,''),'Support '+D.fo.k[0][1]+' · max pain '+D.fo.k[1][1]+' · resistance '+D.fo.k[2][1],'','','#markets/fo'],
    investor:['t',ICO.bk,'Your baskets',D.baskets[0].n,D.baskets[0].r,'u','#ideas/baskets'],
    learner:['i',ICO.learn,'Your learning',learned().length+' of '+LEARN.length+' ideas today','','','#ideas/learn'],
    picker:['t',ICO.mv,'Your watch: top mover',MVS[0].n+' +'+MVS[0].v.toFixed(2)+'%','','','#markets/movers'],
    basic:['a',ICO.cal,'Coming up for you',nx?nx.t+' '+nx.b:'Market day done','','','#markets/cal']}[key];
  if(X)R.push(X);return R}
function fyRow(r){var pro=r[6]==='@pro';return '<'+(pro?'button type="button" data-act="pro"':'a href="'+r[6]+'"')+' class="row"><span class="ic '+r[0]+'">'+I(r[1])+'</span><span class="tx"><b>'+r[2]+'</b><small>'+esc(r[3])+'</small></span>'+(r[4]?'<span class="vl '+r[5]+'">'+r[4]+'</span>':'')+'<span class="go" aria-hidden="true">›</span></'+(pro?'button':'a')+'>'}
function forYou(){var p=profile(),key=(p&&p.preset)||'basic',mo=MONTHS().slice(-1)[0],tr=ALL.filter(function(x){return x.d.slice(0,7)===mo}),st=stats(tr),v=seasonScore(),ti=tierOf(v),nx=nextEv();
  /* your month: running P&L line */
  var cum=0,pts=tr.map(function(x){cum+=x.pnl;return cum}),lo=Math.min.apply(null,[0].concat(pts)),hi=Math.max.apply(null,[0].concat(pts)),rg=(hi-lo)||1,W=300,H=56;
  var line=pts.map(function(y,i){return (pts.length>1?i/(pts.length-1)*W:0).toFixed(1)+','+(H-4-(y-lo)/rg*(H-8)).toFixed(1)}).join(' '),zero=(H-4-(0-lo)/rg*(H-8)).toFixed(1);
  var mname=dt(mo+'-01').toLocaleDateString('en-IN',{month:'long'});
  var hero='<a class="fy-hero" href="#journal/overview"><div class="fy-k"><span class="eb">Your '+mname+'</span><span class="go" aria-hidden="true">›</span></div>'+
    '<div class="fy-n"><b class="'+(st.net>=0?'u':'')+'">'+inr(st.net,true)+'</b><small>net P&amp;L</small></div>'+
    '<svg class="fy-sp" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="'+W+'" y1="'+zero+'" y2="'+zero+'" stroke="var(--border-decorative)" stroke-dasharray="3 4"/><polyline points="'+line+'" fill="none" stroke="'+(st.net>=0?'var(--teal)':'var(--slate-500)')+'" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>'+
    '<div class="fy-3"><div><b>'+st.n+'</b><small>trades</small></div><div><b>'+st.wr.toFixed(0)+'%</b><small>win rate</small></div><div><b>'+(st.pf?st.pf.toFixed(2):'–')+'</b><small>profit factor</small></div></div></a>';
  /* two tiles: calls and rewards */
  var calls=locked()?'<button type="button" class="fy-t lk" data-act="pro"><span class="ic a">'+I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',2)+'</span><b>'+CALLS.length+' live calls</b><small>Locked · '+CL.filter(function(x){return x.ret>0}).length+' of '+CL.length+' booked profit</small><em>Unlock →</em></button>'
    :'<a class="fy-t" href="#ideas/calls"><span class="ic i">'+I(ICO.tc,2)+'</span><b>'+CALLS.length+' live calls</b><small>'+CLW+' of '+CL.length+' recent hit target</small><em>Open →</em></a>';
  var rew='<a class="fy-t" href="#rewards"><span class="ic t">'+I(ICO.star,2)+'</span><b>'+freeDays()+' free days</b><small>'+v+' pts · '+TIERS[ti][1]+' · #'+myRank()+'</small><em>Rewards →</em></a>';
  /* one card for what you trade */
  var X;
  if(key==='options')X='<a class="fy-x" href="#markets/fo"><div class="fy-k"><span class="eb">Your expiry · Nifty</span><small>'+esc(D.fo.exp.replace(/^Expiry\s*/,''))+'</small></div><div class="fy-lv">'+D.fo.k.map(function(k,n){return '<div class="'+['u','w',''][n]+'"><small>'+k[0]+'</small><b>'+k[1]+'</b></div>'}).join('')+'</div></a>';
  else if(key==='investor')X='<a class="fy-x" href="#ideas/baskets"><div class="fy-k"><span class="eb">Your baskets</span></div>'+D.baskets.slice(0,2).map(function(b){return '<div class="fy-r"><span>'+esc(b.n)+'</span><b class="u">'+esc(b.r)+'</b></div>'}).join('')+'</a>';
  else if(key==='learner'){var l=learned().length;X='<a class="fy-x" href="#ideas/learn"><div class="fy-k"><span class="eb">Your learning today</span><small>'+l+' of '+LEARN.length+'</small></div><span class="lbar"><em style="width:'+(l/LEARN.length*100)+'%"></em></span></a>'}
  else if(key==='picker')X='<a class="fy-x" href="#markets/movers"><div class="fy-k"><span class="eb">Your watch · top movers</span></div>'+MVS.slice(0,3).map(function(m){return '<div class="fy-r"><span>'+esc(m.n)+'</span><b class="u">+'+m.v.toFixed(2)+'%</b></div>'}).join('')+'</a>';
  else X='<a class="fy-x" href="#markets/cal"><div class="fy-k"><span class="eb">Coming up for you</span></div><div class="fy-r"><span>'+(nx?esc(nx.b):'Market day done')+'</span><b>'+(nx?nx.t:'')+'</b></div></a>';
  return '<div class="h2 fyh"><h2>For you</h2></div>'+
    '<div class="fy-who"><span>Set up for <b id="fyName">'+presetName()+'</b></span><button type="button" class="l" data-act="setup">Change</button></div>'+
    '<div class="fy">'+hero+'<div class="fy-2">'+calls+rew+'</div>'+X+'</div>'}

/* Home previews: two highlights and two of your things, each with a way to see all */
/* ---------------- IPOs going live: name, AlphaPad in-house score, report (sample data, same IPOs as the calendar) ---------------- */
var IPOS=[
  {n:'Northwind Logistics',sec:'Logistics · Mainboard',st:'open',stt:'Open now · closes 13 Nov',size:'₹1,200 cr',band:'₹410–432',lot:'34 shares',min:'₹14,688',sub:'2.1x so far',dates:[['Opens','11 Nov'],['Closes','13 Nov'],['Allotment','16 Nov'],['Lists','18 Nov']],
   sc:7.4,parts:[['Business',8],['Financials',7.5],['Valuation',6.5],['Promoters & governance',7.5]],
   good:['Revenue grew about 24% a year for three years, with steady margins','Most of the money raised goes to new warehouses, not to selling shareholders','Debt falls sharply after the issue'],
   watch:['Priced above most listed logistics peers on earnings','Top five clients bring in over a third of revenue']},
  {n:'Lumen Foods',sec:'Packaged foods · Mainboard',st:'list',stt:'Closed · lists 16 Nov',size:'₹640 cr',band:'₹180–190',lot:'78 shares',min:'₹14,820',sub:'4.2x subscribed',dates:[['Opened','9 Nov'],['Closed','11 Nov'],['Allotment','13 Nov'],['Lists','16 Nov']],
   sc:5.6,parts:[['Business',6.5],['Financials',5.5],['Valuation',4.5],['Promoters & governance',6]],
   good:['Well-known regional brands with loyal buyers','Profitable for the last three years'],
   watch:['Two-thirds of the issue is promoters selling shares','Margins have been shrinking as input costs rise','Rich valuation for its growth rate']},
  {n:'Orion Pharma',sec:'Pharmaceuticals · Mainboard',st:'soon',stt:'Opens 20 Nov',size:'₹900 cr',band:'Price band soon',lot:'–',min:'–',sub:'Not open yet',dates:[['Opens','20 Nov'],['Closes','24 Nov'],['Allotment','27 Nov'],['Lists','1 Dec']],
   sc:6.8,parts:[['Business',7.5],['Financials',7],['Valuation',6],['Promoters & governance',6.5]],
   good:['Export business with approvals in regulated markets','Cash from operations has stayed positive'],
   watch:['Score is early: it will be updated once the price band is out','One product brings in a large share of sales']},
  {n:'Kestrel Energy',sec:'Renewable power · Mainboard',st:'done',stt:'Listed 12 Nov',size:'₹2,050 cr',band:'₹96–101',lot:'148 shares',min:'₹14,948',sub:'38.5x subscribed',dates:[['Opened','4 Nov'],['Closed','6 Nov'],['Allotment','9 Nov'],['Listed','12 Nov']],
   sc:7.8,parts:[['Business',8.5],['Financials',7.5],['Valuation',7],['Promoters & governance',8]],
   good:['Long power-sale contracts give steady, visible cash flows','Strong demand from every investor group'],
   watch:['Heavy borrowing to fund new projects','Earnings depend on weather and grid availability']}];
var IPOG=[['open','Open now'],['soon','Opening soon'],['list','Listing soon'],['done','Recently listed']];
function ipoDate(x,re){var d=x.dates.filter(function(q){return re.test(q[0])})[0];return d?d[1]:'–'}
function ipoTone(v){return v>=7?['Strong','t']:v>=6?['Fair','a']:['Weak','s']}
function ipoRing(v,big){var r=big?30:22,c=2*Math.PI*r,w=big?76:56,t=ipoTone(v);
  return '<span class="ipr '+t[1]+(big?' big':'')+'" role="img" aria-label="AlphaPad score '+v.toFixed(1)+' out of 10, '+t[0]+'"><svg viewBox="0 0 '+w+' '+w+'" aria-hidden="true"><circle cx="'+w/2+'" cy="'+w/2+'" r="'+r+'" fill="none" stroke="var(--track)" stroke-width="'+(big?6:5)+'"/><circle cx="'+w/2+'" cy="'+w/2+'" r="'+r+'" fill="none" stroke="currentColor" stroke-width="'+(big?6:5)+'" stroke-linecap="round" stroke-dasharray="'+(c*v/10).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 '+w/2+' '+w/2+')"/></svg><b>'+v.toFixed(1)+'</b></span>'}
function ipoHTML(){var H=IPOS.map(function(x,i){return [x,i]}).filter(function(q){return q[0].st!=='done'});
  return '<section class="pv ipo"><div class="pvh"><b>IPOs</b><small id="ipoC">1 of '+H.length+'</small><a class="l ipall" href="#markets/ipos">See all '+IPOS.length+' →</a></div>'+
    '<div class="hlt ipt" data-noswipe aria-label="IPOs, swipe for more">'+H.map(function(q){var x=q[0],i=q[1],t=ipoTone(x.sc);
      return '<a class="ipc" href="#ipos/'+i+'" aria-label="'+esc(x.n)+': '+esc(x.stt)+', AlphaPad score '+x.sc.toFixed(1)+'. Open report">'+
        '<span class="ipm"><span class="ipn"><span class="ips '+x.st+'">'+(x.st==='open'?'<i></i>':'')+esc(x.stt)+'</span><b>'+esc(x.n)+'</b><small>'+esc(x.sec)+'</small></span><span class="ipsc">'+ipoRing(x.sc)+'<small>'+t[0]+'</small></span></span>'+
        '<span class="ipf2"><span><small>Price band</small><b>'+(/^₹/.test(x.band)?x.band:'Soon')+'</b></span><span><small>Allotment</small><b>'+ipoDate(x,/^Allot/)+'</b></span><span><small>Listing</small><b>'+ipoDate(x,/^List/)+'</b></span><span class="go" aria-hidden="true">›</span></span></a>'}).join('')+'</div>'+
    '<div class="mdots ipd" aria-hidden="true">'+H.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div>'+
    '<p class="ipnote">AlphaPad score is our in-house rating out of 10. Sample IPOs for the prototype.</p></section>'}
/* listed IPOs: the score we gave before listing, and how each has done against its issue price (sample data) */
var IPOREC=[
  {n:'Kestrel Energy',d:'12 Nov',sc:7.8,iss:101,lst:118.4,cur:121.6},
  {n:'Tidewater Ports',d:'28 Oct',sc:7.2,iss:240,lst:262.1,cur:281.5},
  {n:'Saffron Retail',d:'21 Oct',sc:5.4,iss:332,lst:318.0,cur:289.7},
  {n:'Brightline Health',d:'14 Oct',sc:6.6,iss:415,lst:441.2,cur:452.9},
  {n:'Quarry Infra',d:'6 Oct',sc:4.9,iss:78,lst:74.5,cur:61.2},
  {n:'Ember Fintech',d:'29 Sep',sc:7.5,iss:560,lst:648.0,cur:702.3},
  {n:'Coral Textiles',d:'19 Sep',sc:5.8,iss:145,lst:151.3,cur:139.4},
  {n:'Vantage Auto Parts',d:'8 Sep',sc:6.9,iss:302,lst:330.5,cur:347.1}];
function pctOf(a,b){return (a/b-1)*100}
function sgn(v){return (v>=0?'+':'−')+Math.abs(v).toFixed(1)+'%'}
function ipoRecSheet(){var R=IPOREC.map(function(x){return {x:x,g:pctOf(x.cur,x.iss),l:pctOf(x.lst,x.iss)}}),up=R.filter(function(r){return r.g>=0}).length;
  var band=[['Strong','7 and above',function(v){return v>=7},'t'],['Fair','6 to 6.9',function(v){return v>=6&&v<7},'a'],['Weak','below 6',function(v){return v<6},'s']].map(function(b){var L=R.filter(function(r){return b[2](r.x.sc)});return {b:b,n:L.length,avg:L.length?L.reduce(function(a,r){return a+r.g},0)/L.length:0}});
  sheet('Listed IPO track record','<p class="muted" style="margin-top:0">The AlphaPad score we gave before each IPO opened, and how it has done since against its issue price.</p>'+
    '<div class="irs"><div class="irh"><b>'+up+' of '+R.length+'</b><small>trading above the issue price</small></div>'+
      '<div class="irb">'+band.map(function(z){return '<div class="'+z.b[3]+'"><small>'+z.b[0]+' score</small><b class="'+(z.avg>=0?'u':'')+'">'+sgn(z.avg)+'</b><span>avg · '+z.n+' IPO'+(z.n===1?'':'s')+'</span></div>'}).join('')+'</div></div>'+
    '<div class="card irl" style="padding:0 14px"><div class="list">'+R.map(function(r){var x=r.x;
      return '<div class="row irr">'+ipoRing(x.sc)+'<span class="tx"><b>'+esc(x.n)+'</b><small>'+x.d+' · Issue ₹'+num(x.iss,0)+'</small><small>Now ₹'+num(x.cur,1)+' · Day 1 '+sgn(r.l)+'</small></span><span class="irg '+(r.g>=0?'u':'d')+'"><b>'+sgn(r.g)+'</b><small>since issue</small></span></div>'}).join('')+'</div></div>'+
    '<p class="note">Gain or loss is from the issue price (upper end of the band) to the latest close; Day 1 is the listing-day close. Every listed IPO we scored is shown, losses included. Sample data for the prototype. Past results do not promise future returns.</p>')}
function ipoListHTML(){
  return '<p class="muted ipintro">Every IPO with AlphaPad’s in-house score out of 10. Tap one for the full report.</p>'+
    IPOG.map(function(g){var L=IPOS.map(function(x,i){return [x,i]}).filter(function(q){return q[0].st===g[0]});if(!L.length)return '';
      return '<h3 class="iph3">'+g[1]+' <small>'+L.length+'</small></h3><div class="card ipls" style="padding:0 14px"><div class="list">'+L.map(function(q){var x=q[0],t=ipoTone(x.sc);
        return '<a class="row ipro" href="#ipos/'+q[1]+'">'+ipoRing(x.sc)+'<span class="tx"><b>'+esc(x.n)+'</b><small>'+esc(x.stt)+' · '+x.size+'</small></span><span class="vl"><span class="ips '+({t:'open',a:'list',s:'mute'})[t[1]]+'">'+t[0]+'</span></span><span class="go" aria-hidden="true">›</span></a>'}).join('')+'</div></div>'}).join('')+
    '<a class="trl" href="#markets/ipos" data-act="iporec"><span><b>'+IPOREC.filter(function(x){return x.cur>=x.iss}).length+' of '+IPOREC.length+'</b> listed IPOs above issue price</span><span>See the track record ›</span></a>'+
    '<p class="note">Sample IPOs for the prototype.</p>'}
function ipoReportHTML(i){var x=IPOS[i],t=ipoTone(x.sc);
  return '<div class="ipr-h">'+ipoRing(x.sc,true)+'<div><span class="ips '+x.st+'">'+(x.st==='open'?'<i></i>':'')+esc(x.stt)+'</span><b>AlphaPad score: '+t[0]+'</b><small>'+esc(x.sec)+'</small></div></div>'+
    '<div class="ipbars">'+x.parts.map(function(q){return '<div><span>'+q[0]+'</span><i><em class="'+ipoTone(q[1])[1]+'" style="width:'+q[1]*10+'%"></em></i><b>'+q[1].toFixed(1)+'</b></div>'}).join('')+'</div>'+
    '<div class="facts"><div>Issue size<b>'+x.size+'</b></div><div>Price band<b>'+x.band+'</b></div><div>Lot<b>'+x.lot+'</b></div><div>Min. amount<b>'+x.min+'</b></div><div>Demand<b>'+x.sub+'</b></div></div>'+
    '<h3 class="iph3">What looks good</h3><ul class="ipl g">'+x.good.map(function(g){return '<li>'+g+'</li>'}).join('')+'</ul>'+
    '<h3 class="iph3">What to watch</h3><ul class="ipl w">'+x.watch.map(function(g){return '<li>'+g+'</li>'}).join('')+'</ul>'+
    '<h3 class="iph3">Key dates</h3><div class="ipdt">'+x.dates.map(function(d){return '<div><small>'+d[0]+'</small><b>'+d[1]+'</b></div>'}).join('')+'</div>'+
    '<a class="btn g full" style="margin-top:16px" href="#markets/ipos">See all IPOs</a>'+
    '<p class="note">AlphaPad’s in-house score, based on the offer document. Sample data for the prototype. Analysis, not investment advice.</p>'}
function rIpos(){var sc=$('#s-ipos'),n=subSec!=null&&IPOS[+subSec]?+subSec:-1;
  sc.innerHTML='<header class="top"><a class="bk" href="#today" data-back aria-label="Back">‹</a><h1>'+(n<0?'All IPOs':esc(IPOS[n].n))+'</h1><span class="sp"></span></header>'+
    '<div class="ippg">'+(n<0?ipoListHTML():ipoReportHTML(n))+'</div>'}
function mfHomeHTML(){var F=MFT.funds.slice().sort(function(a,b){return (b.r[1]||0)-(a.r[1]||0)})[0],fv=sipFV(5000,10,12);
  var C=[
    ['i','#markets/mfgoal','Plan a goal','<span class="mfe">'+GOALS.slice(0,4).map(function(g){return '<i>'+g[1]+'</i>'}).join('')+'</span>','How much SIP for a child’s education, retirement or a house?','Plan a goal'],
    ['t','#markets/sipc','SIP calculator','<b class="mfbig">'+rupL(fv)+'</b>','₹5,000 a month for 10 years at 12%. You put in ₹6 L.','Try the calculator'],
    ['a','#markets/mftop','Top Flexi Cap fund','<b class="mfbig u">'+F.r[1].toFixed(2)+'%<small> a year · 3Y</small></b>',esc(F.n)+' · AUM ₹'+num(F.aum,0)+' Cr','See top funds']];
  return '<section class="pv mfh"><div class="pvh"><b>Mutual funds</b><small id="mfC">1 of '+C.length+'</small><a class="l ipall" href="#markets/mf">See all →</a></div>'+
    '<div class="hlt mft2" data-noswipe aria-label="Mutual funds, swipe for more">'+C.map(function(c){return '<a class="mfhc '+c[0]+'" href="'+c[1]+'"><span class="eb">'+c[2]+'</span>'+c[3]+'<span class="mfs">'+c[4]+'</span><span class="hg">'+c[5]+' →</span></a>'}).join('')+'</div>'+
    '<div class="mdots mfd" aria-hidden="true">'+C.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div></section>'}
function homePreview(mid){var SL=spotSlides(),st=function(h){return String(h||'').replace(/<[^>]+>/g,'')};
  return (mid||'')+'<section class="pv hl"><div class="pvh"><b>Market highlights</b><small id="hlC">1 of '+SL.length+'</small></div>'+
    '<div class="hlt" data-noswipe aria-label="Market highlights, swipe for more">'+SL.map(function(x,i){return '<button type="button" class="hlc '+x.c+'" data-sub-go="spot" data-spot="'+i+'" aria-label="'+(i+1)+' of '+SL.length+': '+esc(st(x.t))+'">'+
      '<span class="hk"><span class="ic '+x.c+'">'+I(ICO[x.ic],2)+'</span><span>'+st(x.k)+'</span></span>'+
      '<span class="ht"><b>'+x.t+'</b>'+(x.v?'<small>'+x.v+'</small>':'')+(x.d?'<em>'+x.d+'</em>':'')+'</span>'+
      '<span class="hs">'+st(x.sub)+'</span><span class="hg">Open in Spotlight →</span></button>'}).join('')+'</div>'+
    (SL.length>1?'<div class="mdots hld" aria-hidden="true">'+SL.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div>':'')+'</section>'}

function rToday(){var s=$('#s-today'),nx=nextEv(),idx=IDX.filter(function(x){return /^(Nifty 50|Nifty Bank|India VIX)$/.test(x.n)}),SL=spotSlides(),hr=new Date().getHours();
  var hi=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  s.innerHTML='<header class="top"><a class="logo" href="#today" aria-label="AlphaPad"><span>α</span>lphaPad</a><span class="sp"></span>'+heroHTML()+avatar()+'</header>'+tickHTML()+
    '<div class="hello"><h1>'+hi+', Trader</h1></div>'+
    morningHTML()+

    homePreview(locked()?profitHTML('home'):liveHTML())+ipoHTML()+mfHomeHTML()+
    '<div class="h2 sph"><h2>Spotlight</h2><small id="spC">'+SL.length+' today</small></div>'+
    '<div class="spw"><div class="sp-tr" id="spTr" aria-label="Spotlight">'+SL.map(function(x,i){return '<article class="sl" id="spot-'+i+'" aria-label="'+(i+1)+' of '+SL.length+'"><div class="kr"><span class="ic '+x.c+'">'+I(ICO[x.ic],2)+'</span>'+x.k+'</div><div class="tt"><b>'+x.t+'</b>'+(x.v?'<span class="v">'+x.v+'</span>':'')+(x.d?'<span class="dd">'+x.d+'</span>':'')+'</div><p>'+x.sub+'</p>'+(beginner()&&x.tip?'<p class="tip">💡 '+x.tip+'</p>':'')+x.viz+'<div class="ac">'+x.a.map(function(l){return '<a href="'+l[0]+'">'+l[1]+' →</a>'}).join('')+'</div></article>'}).join('')+'</div><div class="dots" aria-hidden="true">'+SL.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div></div>'+
    forYou()+
    '<p class="note">Analysis, not investment advice. Prices are from the 11 Nov close.</p>';
  paintAudio();
  morningSlide();liveSlide();
  var hh=$('#hero');if(hh&&wasAll===false&&allDone())hh.classList.add('win');wasAll=allDone();
  var tr=$('#spTr');tr.addEventListener('scroll',function(){var w=tr.firstChild.offsetWidth+12,i=Math.round(tr.scrollLeft/w);$$('.dots i',s).forEach(function(d,j){d.classList.toggle('on',j===i)});$('#spC').textContent=(i+1)+' of '+SL.length},{passive:true})}


/* ---------------- market overview: pull down from the top (or tap the ticker) to see the indices ---------------- */
var SENSEX={n:'Sensex',v:81879.40,pts:'+773.00',pct:'+0.95%',up:true};
function ixShort(n){return n==='Nifty Bank'?'Bank Nifty':n}
function tickHTML(){var a=IDX.filter(function(x){return x.n==='Nifty 50'}).concat([SENSEX],IDX.filter(function(x){return /^(Nifty Bank|Midcap 100|India VIX)$/.test(x.n)}));
  var one=a.map(function(x){return '<span>'+(x.n==='Nifty 50'?'Nifty':ixShort(x.n))+' <b>'+num(x.d?x.d[x.d.length-1][1]:x.v,2)+'</b> <em class="'+(x.vix?'w':x.up?'u':'d')+'">'+x.pct+'</em></span><i></i>'}).join('');
  return '<button type="button" class="tick tkf" data-act="ovw" aria-label="Market overview: '+a.map(function(x){return ixShort(x.n)+' '+x.pct}).join(', ')+'"><span class="tkw" aria-hidden="true"><span class="tkt">'+one+one+'</span></span><span class="tkd" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span></button>'}
function ovSpark(x){var v=x.d.map(function(p){return p[1]}),lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),r=(hi-lo)||1,W=150,H=40;
  var pts=v.map(function(y,i){return (i/(v.length-1)*W).toFixed(1)+','+(H-3-(y-lo)/r*(H-6)).toFixed(1)}).join(' ');
  var c=x.vix?'var(--amber)':x.up?'var(--teal)':'var(--slate-500)';
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="g'+x.n.replace(/\W/g,'')+'" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="'+c+'" stop-opacity=".28"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></linearGradient></defs>'+
    '<polygon points="0,'+H+' '+pts+' '+W+','+H+'" fill="url(#g'+x.n.replace(/\W/g,'')+')"/><polyline points="'+pts+'" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>'}
function ovwHTML(){var d0=IDX[0].d[0][0],d1=IDX[0].d[IDX[0].d.length-1][0];
  return '<div class="ovh"><h2>Overview</h2><span class="sp"></span><button type="button" class="ovx" data-ovx aria-label="Close overview">✕</button></div>'+
    '<div class="ovg">'+[IDX.filter(function(x){return x.n==='Nifty 50'})[0],SENSEX].concat(IDX.filter(function(x){return /^(Midcap 100|India VIX)$/.test(x.n)})).map(function(x){var v=x.d?x.d[x.d.length-1][1]:x.v;return '<a class="ovi" href="#markets/indices"'+(x.d?' data-ix="'+esc(x.n)+'"':'')+' data-ovgo><span class="eb">'+esc(ixShort(x.n))+'</span><b>'+num(v,2)+'</b><em class="'+(x.vix?'w':x.up?'u':'d')+'">'+x.pts+'  '+x.pct+'</em>'+(x.d?ovSpark(x):'<span class="ovn">BSE · close only</span>')+'</a>'}).join('')+'</div>'+
    '<p class="ovc">Charts show '+esc(d0)+' to '+esc(d1)+'. Prices are from the last close.</p><a class="btn g full" href="#markets/indices" data-ovgo>All '+IDX.length+' indices in Markets →</a><div class="ovgrab" aria-hidden="true"></div>'}
function openOvw(){var o=$('#ovw');$('#ovwP').innerHTML=ovwHTML();o.hidden=false;document.body.style.overflow='hidden';requestAnimationFrame(function(){o.classList.add('on')});setTimeout(function(){var b=$('#ovwP [data-ovx]');if(b)b.focus()},280)}
document.addEventListener('click',function(e){var o=$('#ovw');if(!o||o.hidden)return;if(e.target===o||e.target.closest('[data-ovx]'))return closeOvw();if(e.target.closest('[data-ovgo]'))closeOvw()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeOvw()});
function closeOvw(){var o=$('#ovw');if(o.hidden)return;o.classList.remove('on');document.body.style.overflow='';setTimeout(function(){o.hidden=true},260)}
(function(){var y0=0,x0=0,can=false,pn=null;
  document.addEventListener('touchstart',function(e){var t=e.touches[0];y0=t.clientY;x0=t.clientX;pn=e.target.closest('#ovwP');can=!pn&&window.scrollY<=0&&$('#sheet').hidden&&$('#ovw').hidden&&!e.target.closest('.steps,.sp-tr,.chips,.subbar,.brow,input,textarea')},{passive:true});
  document.addEventListener('touchend',function(e){var t=e.changedTouches[0],dy=t.clientY-y0,dx=Math.abs(t.clientX-x0);
    if(can&&dy>90&&dy>dx*1.5)openOvw();else if(pn&&dy<-60&&-dy>dx)closeOvw();can=false;pn=null},{passive:true})})();


/* ---------------- live day timeline (India time, refreshed every 30 s) ---------------- */
function hhmm(m){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function inFor(d){return d<60?d+' min':Math.floor(d/60)+'h'+(d%60?' '+d%60+'m':'')}
function tlStatus(){var m=nowM,wk=IST.wd>0&&IST.wd<6;
  if(!wk)return '<i class="ld off"></i>Market closed · weekend';
  if(m>=555&&m<930)return '<i class="ld on"></i>Market open · closes in '+inFor(930-m);
  if(m>=540&&m<555)return '<i class="ld pre"></i>Pre-open · opens in '+inFor(555-m);
  if(m<540)return '<i class="ld off"></i>Opens in '+inFor(555-m);
  return '<i class="ld off"></i>Market closed'}
function tlHTML(){var m=nowM,nI=DAYS.findIndex(function(e){return toM(e.t)>=m}),nowLi='<li class="now" aria-label="Now"><span>Now '+hhmm(m)+'</span>'+(nI<0?'<small>Day’s events done</small>':'<small>Next in '+inFor(toM(DAYS[nI].t)-m)+'</small>')+'</li>';
  return DAYS.map(function(e,i){var t=toM(e.t),past=t<m,cur=i===nI;
    return (cur?nowLi:'')+'<li class="'+(past?'past':'')+(cur?' next':'')+(e.ev?' ev':'')+'"><time>'+e.t+'</time><b>'+esc(e.b)+'</b>'+(cur?'<span class="g nx">Up next</span>':'<span class="g">'+esc(e.g)+'</span>')+'</li>'}).join('')+(nI<0?nowLi:'')}
function tlTick(){IST=istNow();var m=IST.h*60+IST.m;if(m===nowM&&$('#tlO'))return;nowM=m;var o=$('#tlO'),st=$('#tlS');if(o)o.innerHTML=tlHTML();if(st)st.innerHTML=tlStatus()}
setInterval(tlTick,30000);document.addEventListener('visibilitychange',function(){if(!document.hidden)tlTick()});

/* ---------------- Markets → Invest: mutual funds (from mf.springpad.in) and IPOs ---------------- */
var invSeg='mf',MFU='https://mf.springpad.in/',MFS='https://mfview.springpad.in/signup';
/* top Flexi Cap funds as listed on mf.springpad.in (Regular plan, Growth), 19 Nov 2026 */
var MFT={cat:'Equity: Flexi Cap',asof:'19 Nov 2026',funds:[
  {n:'ITI Flexi Cap Fund',l:'17 Feb 2023',aum:1619.63,r:[12.75,16.91,null]},
  {n:'Taurus Flexi Cap Fund',l:'29 Jan 1994',aum:374.13,r:[10.36,12.64,10.86]},
  {n:'Bank of India Flexi Cap Fund',l:'5 Jun 2020',aum:3133.66,r:[9.85,16.29,14.68]},
  {n:'360 ONE FlexiCap Fund',l:'4 Jun 2023',aum:2197.45,r:[7.75,15.72,null]}]};
var MFNEWS=[['18 Nov','Nippon India Mutual Fund launches a new CRISIL-index fund'],['17 Nov','Kotak Mutual Fund SIF launches Infinity Equity Long-Short'],['16 Nov','SBI Mutual Fund launches SBI BSE India Defence ETF']];
var GOALS=[['edu','🎓','Child education',2500000,12],['wealth','📈','Wealth creation',10000000,20],['marry','💍','Kids marriage',3000000,18],['retire','🏖️','Retirement',20000000,25],['car','🚗','Buying a car',1000000,4],['trip','✈️','Vacation',300000,2],['home','🏠','Property',5000000,10],['other','🎯','Other goal',1000000,5]];
function rupL(v){v=Math.round(v);return v>=1e7?'₹'+(v/1e7).toFixed(2).replace(/\.?0+$/,'')+' Cr':v>=1e5?'₹'+(v/1e5).toFixed(2).replace(/\.?0+$/,'')+' L':'₹'+v.toLocaleString('en-IN')}
function sipFV(m,y,r){var i=r/1200,n=y*12;return i?m*((Math.pow(1+i,n)-1)/i)*(1+i):m*n}
function sipNeed(fv,y,r){var i=r/1200,n=y*12;return i?fv/(((Math.pow(1+i,n)-1)/i)*(1+i)):fv/n}
function sipOut(m,y,r){var fv=sipFV(m,y,r),inv=m*y*12,g=fv-inv;
  return '<div class="sipr"><div><small>You invest</small><b>'+rupL(inv)+'</b></div><div><small>Estimated gain</small><b class="u">'+rupL(g)+'</b></div><div><small>Total value</small><b>'+rupL(fv)+'</b></div></div>'+
    '<div class="sipbar" aria-hidden="true"><i style="width:'+(inv/fv*100).toFixed(1)+'%"></i><em style="width:'+(g/fv*100).toFixed(1)+'%"></em></div><div class="sipk"><span><i></i>Invested</span><span><i class="g"></i>Gain</span></div>'}
function rng(name,lab,min,max,step,val,fmt){return '<label class="rg"><span><b>'+lab+'</b><em data-rv="'+name+'">'+fmt(val)+'</em></span><input type="range" name="'+name+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"></label>'}
var FM={m:function(v){return '₹'+(+v).toLocaleString('en-IN')},y:function(v){return v+' yrs'},r:function(v){return v+'%'},t:function(v){return rupL(+v)}};
function mfHTML(){var F=MFT.funds,mx=Math.max.apply(null,F.map(function(f){return f.r[1]||0}));
  var cmp=[['Bank',3],['Fixed deposit',6],['Gold',9],['Sensex',11],['Mutual fund',15]].map(function(x){return [x[0],x[1],sipFV(5000,25,x[1])]}),cmx=cmp[cmp.length-1][2];
  return '<div class="mfgo"><a class="mfcta" href="'+MFS+'" target="_blank" rel="noopener"><span><b>Start a SIP with SpringPad</b><small>AMFI-registered · ARN-256518</small></span><span class="btn p s">Sign up</span></a></div>'+
    '<div class="h2" id="mfgoal"><h2>Plan a goal</h2><span class="sp"></span><small>tap one</small></div>'+
    '<div class="mfgl">'+GOALS.map(function(g,i){return '<button type="button" class="mfg" data-goal="'+i+'"><span aria-hidden="true">'+g[1]+'</span><b>'+g[2]+'</b></button>'}).join('')+'</div>'+
    '<div class="h2"><h2>SIP calculator</h2></div><div class="card sipc" id="sipc">'+rng('m','Monthly SIP',500,100000,500,5000,FM.m)+rng('y','For',1,40,1,10,FM.y)+rng('r','Expected return',4,20,0.5,12,FM.r)+'<div class="sipo">'+sipOut(5000,10,12)+'</div></div>'+
    '<div class="h2"><h2>₹5,000 a month for 25 years</h2></div><div class="card mfcmp">'+cmp.map(function(c){return '<div class="mfcr'+(c[0]==='Mutual fund'?' hi':'')+'"><span>'+c[0]+'<small>@'+c[1]+'%</small></span><i><em style="width:'+(c[2]/cmx*100).toFixed(1)+'%"></em></i><b>'+rupL(c[2])+'</b></div>'}).join('')+
      '<p class="muted mfn">Same illustrative rates as mf.springpad.in. Not a promise of returns.</p></div>'+
    '<div class="h2" id="mftop"><h2>Top funds · Flexi Cap</h2><span class="sp"></span><small>Regular · Growth</small></div><div class="card" style="padding:0 14px"><div class="list mft">'+F.map(function(f){var r3=f.r[1];
      return '<a class="row" href="'+MFU+'" target="_blank" rel="noopener"><span class="tx"><b>'+esc(f.n)+'</b><small>Since '+f.l+'</small><small>AUM ₹'+num(f.aum,0)+' Cr</small><span class="mfb"><i style="width:'+(r3/mx*100).toFixed(0)+'%"></i></span></span><span class="mfr"><b class="u">'+r3.toFixed(2)+'%</b><small>3Y a year</small><small>1Y '+f.r[0].toFixed(1)+'% · 5Y '+(f.r[2]?f.r[2].toFixed(1)+'%':'–')+'</small></span></a>'}).join('')+'</div></div>'+
    '<a class="trl" href="'+MFU+'" target="_blank" rel="noopener"><span>70+ categories, fund comparison, portfolio overlap and more calculators</span><span>mf.springpad.in ↗</span></a>'+
    '<div class="h2"><h2>Mutual fund news</h2></div><div class="card" style="padding:0 14px"><div class="list mfnw">'+MFNEWS.map(function(n){return '<a class="row" href="'+MFU+'" target="_blank" rel="noopener"><span class="tm">'+n[0]+'</span><span class="tx"><b>'+esc(n[1])+'</b></span><span class="go" aria-hidden="true">'+I(ICO.ext)+'</span></a>'}).join('')+'</div></div>'+
    '<p class="note">Returns as listed on mf.springpad.in on '+MFT.asof+'; past returns do not promise future returns. Mutual fund investments are subject to market risks, read all scheme-related documents carefully. SpringPad is an AMFI-registered mutual fund distributor (ARN-256518) and earns commission on distribution; this is not investment advice.</p>'}
function goalSheet(i){var g=GOALS[i],T=g[3],Y=g[4],R=12;
  var out=function(t,y,r){var need=sipNeed(t,y,r);return '<div class="gout"><small>You need a monthly SIP of about</small><b>'+rupL(need)+'</b><small>to reach '+rupL(t)+' in '+y+' years at '+r+'% a year. You put in '+rupL(need*y*12)+'.</small></div>'};
  sheet(g[1]+' '+g[2],'<p class="muted" style="margin-top:0">Move the sliders to set your goal.</p><div class="sipc" id="gsc">'+rng('t','Goal amount',100000,50000000,100000,T,FM.t)+rng('y','In',1,40,1,Y,FM.y)+rng('r','Expected return',4,20,0.5,R,FM.r)+'</div><div id="gso">'+out(T,Y,R)+'</div>'+
    '<a class="btn p full" style="margin-top:14px" href="'+MFS+'" target="_blank" rel="noopener">Start this SIP on SpringPad ↗</a><p class="note">An estimate only, not a promise of returns. Mutual fund investments are subject to market risks.</p>',
    function(pn){pn.addEventListener('input',function(e){var f=e.target;if(f.type!=='range')return;var c=$('#gsc',pn),v=function(n){return +$('[name='+n+']',c).value};$('[data-rv='+f.name+']',c).textContent=FM[f.name](f.value);$('#gso',pn).innerHTML=out(v('t'),v('y'),v('r'))})})}
document.addEventListener('input',function(e){var f=e.target;if(f.type!=='range'||!f.closest('#sipc'))return;var c=$('#sipc'),v=function(n){return +$('[name='+n+']',c).value};$('[data-rv='+f.name+']',c).textContent=FM[f.name](f.value);$('.sipo',c).innerHTML=sipOut(v('m'),v('y'),v('r'))});
/* ---------------- MARKETS ---------------- */
var flSeg=0,ixSel='Nifty 50',mvSeg='stocks',scSeg='sc-vol',calType='all';
function ixChart(x){var W=340,H=150,P=6,v=x.d.map(function(p){return p[1]}),lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),r=(hi-lo)||1,pad=r*.08,lo2=lo-pad,hi2=hi+pad;
  var X=function(i){return P+i*(W-2*P)/(v.length-1)},Y=function(y){return (hi2-y)/(hi2-lo2)*H};
  var pts=v.map(function(y,i){return X(i).toFixed(1)+','+Y(y).toFixed(1)}).join(' '),c=x.vix?'var(--amber)':x.up?'var(--teal)':'var(--slate-500)',lv=[hi,(hi+lo)/2,lo],last=v[v.length-1],mid=x.d[Math.floor((x.d.length-1)/2)][0];
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="'+esc(x.n)+' daily closes, '+x.d[0][0]+' to '+x.d[x.d.length-1][0]+'"><defs><linearGradient id="ixg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="'+c+'" stop-opacity=".28"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></linearGradient></defs>'+
    lv.map(function(l){return '<line class="gl" x1="0" x2="'+W+'" y1="'+Y(l).toFixed(1)+'" y2="'+Y(l).toFixed(1)+'" vector-effect="non-scaling-stroke"/>'}).join('')+
    '<polygon points="'+X(0).toFixed(1)+','+H+' '+pts+' '+X(v.length-1).toFixed(1)+','+H+'" fill="url(#ixg)"/>'+
    '<polyline class="ln" style="stroke:'+c+'" points="'+pts+'" vector-effect="non-scaling-stroke"/><line class="cur" id="ixCur" x1="0" x2="0" y1="0" y2="'+H+'" hidden vector-effect="non-scaling-stroke"/></svg>'+
    lv.map(function(l){return '<span class="ixy" style="top:'+(Y(l)/H*100).toFixed(1)+'%">'+num(l,0)+'</span>'}).join('')+
    '<span class="ixdot" style="top:'+(Y(last)/H*100).toFixed(1)+'%;background:'+c+'"></span>'+
    '<span class="tip" id="ixTip" hidden></span>'}
function ixDates(x){var d=x.d;return '<div class="ixx"><span>'+d[0][0]+'</span><span>'+d[Math.floor((d.length-1)/2)][0]+'</span><span>'+d[d.length-1][0]+'</span></div>'}
function ixList(){return '<div class="h2 ixlh"><h2>All indices</h2><span class="sp"></span><small>tap one to chart it</small></div><div class="card ixall" style="padding:0 14px"><div class="list">'+
  IDX.map(function(i){var v=i.d[i.d.length-1][1],on=i.n===ixSel;return '<button type="button" class="row'+(on?' on':'')+'" data-ix="'+esc(i.n)+'"'+(on?' aria-current="true"':'')+'><span class="tx"><b>'+esc(ixShort(i.n))+'</b><small>'+num(v,2)+'</small></span><span class="ixsp">'+ovSpark(i)+'</span><span class="vl '+(i.vix?'w':i.up?'u':'d')+'">'+i.pct+'</span></button>'}).join('')+'</div></div>'}
function rMarkets(){setTimeout(flFade,0);var s=$('#s-markets'),x=IDX.filter(function(i){return i.n===ixSel})[0]||IDX[0],last=x.d[x.d.length-1][1],m=(last/x.d[0][1]-1)*100;
  var NAV=[['indices','Indices'],['fo','F&O levels'],['movers','Movers'],['scan','Scan'],['ipos','IPOs'],['filings','Filings'],['cal','Calendar']];
  var scan=SC(scSeg),SCN={'sc-vol':'Volume','sc-del':'Delivery','sc-hi':'20D highs','sc-lo':'20D lows'};
  var today0=new Date(2026,10,12),types=Object.keys(TYPES).filter(function(k){return k!=='ipo'&&EVENTS.some(function(e){return e.t===k&&e.d>today0})});if(calType==='ipo')calType='all';var up=EVENTS.filter(function(e){return e.d>today0&&e.t!=='ipo'&&(calType==='all'||e.t===calType)}).slice(0,10);
  var nm=nowM,nI=DAYS.findIndex(function(e){return toM(e.t)>=nm});
  s.innerHTML=top('Markets',streakChip())+
    '<div class="mk-nav"><div class="chips" role="navigation" aria-label="Sections">'+NAV.map(function(n){return '<button type="button" data-jump="'+n[0]+'">'+n[1]+'</button>'}).join('')+'</div></div>'+
    '<section class="sec" id="indices"><div class="ixt"><h2>'+esc(ixShort(x.n))+'</h2><button type="button" class="l" data-act="ixpick" aria-haspopup="dialog">Change ⌄</button></div>'+
      '<div class="ixh"><b>'+num(last,2)+'</b><em class="'+(x.n==='India VIX'?'w':x.up?'u':'d')+'">'+(x.up?'▲ ':'▼ ')+x.pts+' ('+x.pct+')</em><small>'+(m>=0?'+':'−')+Math.abs(m).toFixed(1)+'% in a month · 11 Nov close</small></div>'+
      '<div class="ixc" id="ixc">'+ixChart(x)+'</div>'+ixDates(x)+(function(){var v=x.d.map(function(q){return q[1]}),hi=Math.max.apply(null,v),lo=Math.min.apply(null,v);return '<div class="ixs"><div><small>Month high</small><b>'+num(hi,2)+'</b></div><div><small>Month low</small><b>'+num(lo,2)+'</b></div><div><small>From low</small><b class="u">+'+((last/lo-1)*100).toFixed(1)+'%</b></div></div>'})()+ixList()+'</section>'+
    '<section class="sec" id="fo"><div class="h2"><h2>F&amp;O levels · Nifty</h2>'+infoBtn('fo')+'<span class="sp"></span><small>'+esc(D.fo.exp)+'</small></div>'+
      '<div class="fo3">'+D.fo.k.map(function(k,i){return '<div class="'+['s','m','r'][i]+'"><span>'+esc(k[0])+'</span><b>'+esc(k[1])+'</b><small>'+esc(k[2])+'</small></div>'}).join('')+'</div>'+
      '<div class="foch">'+D.fo.svg+'</div><a class="btn g full" style="margin-top:14px" href="'+L.studio+'">Open Option Studio '+I(ICO.ext)+'</a></section>'+
    '<section class="sec" id="movers"><div class="h2"><h2>Movers</h2>'+(mvSeg==='oi'?infoBtn('oib'):'')+'</div><div class="seg" role="group" aria-label="Movers view">'+[['stocks','Nifty 100'],['sectors','Sectors'],['oi','OI buildup']].map(function(b){return '<button type="button" data-mv="'+b[0]+'" aria-pressed="'+(mvSeg===b[0])+'">'+b[1]+'</button>'}).join('')+'</div><div style="margin-top:14px">'+movers()+'</div></section>'+
    '<section class="sec" id="scan"><div class="h2"><h2>Market scan</h2><span class="sp"></span><small>Nifty 500 · 11 Nov</small></div><div class="seg scseg" role="group" aria-label="Scan">'+Object.keys(SCN).map(function(k){return '<button type="button" data-sc="'+k+'" aria-pressed="'+(scSeg===k)+'">'+SCN[k]+'</button>'}).join('')+'</div>'+
      '<p class="mvcap">'+({'sc-vol':'Traded volume compared with each stock’s 20-day average','sc-del':'Share of traded shares taken for delivery, and the jump over usual','sc-hi':((/(\d+) stocks/.exec(scan.h)||[])[1]||'')+' stocks closed at a 20-day high','sc-lo':((/(\d+) stocks/.exec(scan.h)||[])[1]||'')+' stocks closed at a 20-day low'})[scSeg]+'</p>'+
      '<div class="card scl" style="padding:0 16px"><div class="list">'+scan.rows.map(function(r){var v=String(r.v||'').split(' '),big=scSeg==='sc-vol'?v[0]:scSeg==='sc-del'?v[0]:r.c,sub=scSeg==='sc-del'?(v[1]?v[1]+' pts':''):'';
        return '<div class="row"><span class="tx"><b>'+esc(r.s)+'</b><small>'+esc(r.name)+'</small></span><span class="scv"><b class="'+(scSeg==='sc-hi'||scSeg==='sc-lo'?(r.u?'u':'d'):'')+'">'+esc(big)+'</b><small>'+(scSeg==='sc-hi'||scSeg==='sc-lo'?'on the day':(sub?esc(sub)+' · ':'')+'<em class="'+(r.u?'u':'d')+'">'+esc(r.c)+'</em>')+'</small></span></div>'}).join('')+'</div></div>'+
      '<a class="btn g full" style="margin-top:12px" href="'+L.screener+'">Open the screener '+I(ICO.ext)+'</a></section>'+
    '<section class="sec" id="invest"><div class="seg invseg" role="group" aria-label="Invest in">'+[['mf','Mutual funds'],['ipo','IPOs']].map(function(b){return '<button type="button" data-inv="'+b[0]+'" aria-pressed="'+(invSeg===b[0])+'">'+b[1]+'</button>'}).join('')+'</div>'+(invSeg==='mf'?mfHTML():'')+'</section>'+
    (invSeg==='ipo'?'<section class="sec" id="ipos">'+ipoListHTML()+'</section>':'')+
    '<section class="sec" id="filings"><div class="h2"><h2>What’s happening</h2><span class="sp"></span><small>Filings · 13 Nov</small></div>'+
      (function(){var FL=['Orders','Results','People'].map(function(k){return D.filings.filter(function(g){return g.h.indexOf(k)===0})[0]}).filter(Boolean),NM={Orders:'Orders',Results:'Results',People:'People'};if(!FL.length)FL=D.filings;if(flSeg>=FL.length)flSeg=0;
        return '<div class="seg flseg" role="group" aria-label="Filings view">'+FL.map(function(g,i){return '<button type="button" data-fl="'+i+'" aria-pressed="'+(i===flSeg)+'" aria-label="'+esc(g.h)+', '+g.items.length+'">'+esc(NM[g.h.split(/[ ,&]/)[0]]||g.h)+'<small>'+g.items.length+'</small></button>'}).join('')+'</div>'+
        [FL[flSeg]].map(function(g){return '<div class="list fl">'+g.items.map(function(it){return '<a class="row" href="'+esc(it.href)+'" target="_blank" rel="noopener"><span class="tm">'+it.t+'</span><span class="tx"><b>'+esc(it.s)+(it.fo?' <span class="tag">F&amp;O</span>':'')+'</b><small>'+esc(it.x)+'</small></span><span class="go" aria-hidden="true">'+I(ICO.ext)+'</span></a>'}).join('')+'</div>'}).join('')})()+'</section>'+
    '<section class="sec" id="cal"><div class="h2"><h2>Today</h2><span class="sp"></span><small id="tlS">'+tlStatus()+'</small></div><div class="card tlc"><ol class="tl" id="tlO">'+tlHTML()+'</ol></div>'+
      '<div class="h2"><h2>Coming up</h2></div><div class="seg ctseg" role="group" aria-label="Show events">'+['all'].concat(types).map(function(k){return '<button type="button" data-ct="'+k+'" aria-pressed="'+(calType===k)+'"'+(k==='all'?'':' aria-label="'+esc(TYPES[k].n)+'"')+'>'+(k==='all'?'All':({earn:'Results',fno:'Expiry',eco:'Economy',hol:'Holidays'})[k]||TYPES[k].n)+'</button>'}).join('')+'</div>'+
      (up.length?'<div class="card calc">'+(function(){var G=[];up.forEach(function(e){var k=e.d.toDateString(),g=G[G.length-1];if(g&&g.k===k)g.e.push(e);else G.push({k:k,d:e.d,e:[e]})});
        return G.map(function(g){var wd=g.d.toLocaleDateString('en-IN',{weekday:'short'});return '<div class="cday"><span class="dt"><small>'+wd+'</small><b>'+g.d.getDate()+'</b><small>'+g.d.toLocaleDateString('en-IN',{month:'short'})+'</small></span><div class="cev">'+
          g.e.map(function(e){return '<div class="ce"><i class="ty '+e.t+'"></i><span><b>'+esc(e.title)+'</b>'+(e.note?'<small>'+esc(e.note)+'</small>':'')+'</span></div>'}).join('')+'</div></div>'}).join('')})()+'</div>'
        :'<p class="muted">Nothing of this kind coming up.</p>')+'</section>'+
    '<p class="note">Data from NSE, 11 Nov close. Analysis, not investment advice.</p>';
  wireChart(x)}
function movers(){if(mvSeg==='oi')return '<div class="oih"><span>Price and open-interest moves in stock futures</span>'+infoBtn('oib')+'</div><div class="oib">'+OIQ.map(function(q){var o=OIB[q[0]];return '<div class="q '+q[3]+'"><b>'+q[1]+'</b><span class="n">'+o.n+'</span><small>'+q[2]+'</small><ol>'+o.top.map(function(t){return '<li><span>'+t.s+'</span><em>'+(t.p>0?'+':'−')+Math.abs(t.p).toFixed(1)+'%</em></li>'}).join('')+'</ol></div>'}).join('')+'</div><p class="note">211 stock futures · OI across expiries · NSE 11 Nov</p>';
  var arr=mvSeg==='sectors'?SECS:MVS,mx=Math.max.apply(null,arr.map(function(m){return Math.abs(m.v)}));
  var sec=mvSeg==='sectors',G=arr.filter(function(m){return m.v>0}).sort(function(a,b){return b.v-a.v}),Lo=arr.filter(function(m){return m.v<0}).sort(function(a,b){return a.v-b.v});
  var grp=function(t,c,L){if(!L.length)return '';return '<div class="mvg"><div class="mvh"><i class="'+c+'"></i><b>'+t+'</b><small>'+L.length+'</small></div><div class="card mvc">'+L.map(function(m,i){
      return '<div class="mvr"><span class="mvn">'+(i+1)+'</span><b>'+esc(m.n)+'</b><span class="mvb"><i class="'+c+'" style="width:'+(Math.abs(m.v)/mx*100).toFixed(0)+'%"></i></span><em class="'+c+'">'+(m.v>0?'+':'−')+Math.abs(m.v).toFixed(2)+'%</em></div>'}).join('')+'</div></div>'};
  return '<p class="mvcap">'+(sec?'Nifty sector indices, change on the day':'Biggest moves in the Nifty 100 on the day')+' · 11 Nov close</p>'+grp(sec?'Sectors up':'Top gainers','u',G)+grp(sec?'Sectors down':'Top losers','d',Lo)}
function wireChart(x){var box=$('#ixc');if(!box)return;var svg=box.querySelector('svg'),tip=$('#ixTip'),cur=$('#ixCur');
  function at(cx){var r=svg.getBoundingClientRect(),f=Math.max(0,Math.min(1,(cx-r.left)/r.width)),i=Math.round(f*(x.d.length-1)),p=x.d[i];
    tip.hidden=false;cur.removeAttribute('hidden');var px=6+i*(340-12)/(x.d.length-1);cur.setAttribute('x1',px);cur.setAttribute('x2',px);
    tip.style.left=Math.max(40,Math.min(r.width-40,(px/340)*r.width))+'px';tip.innerHTML=num(p[1],2)+'<small>'+p[0]+'</small>'}
  function off(){tip.hidden=true;cur.setAttribute('hidden','')}
  box.addEventListener('pointermove',function(e){at(e.clientX)});box.addEventListener('pointerdown',function(e){at(e.clientX)});box.addEventListener('pointerleave',off)}


/* ---------------- Learn (Ideas → Learn): three idea cards with a picture each, swipe between them ---------------- */
var LTONE={term:'i',relation:'a',learning:'t'};
function lvizOf(id){var v=(typeof LVIZ!=='undefined'&&LVIZ[id])||'';return v.replace(/<button class="linkbtn" data-go="markets">([^<]*)<\/button>/g,'<a class="lk" href="#markets/indices">$1</a>')}
function learnHTML(){var lr=learned(),all=lr.length>=LEARN.length,first=Math.max(0,LEARN.findIndex(function(x){return lr.indexOf(x.id)<0}));
  return '<section class="sec" id="learn"><div class="lnh"><span>Three short ideas a day · learn all 3 to keep your streak</span><small id="lnC">'+lr.length+' of '+LEARN.length+' done</small></div>'+
    (all?'<div class="lnok">✓ All 3 ideas learned. Streak kept for today.</div>':'')+
    '<div class="lnt" aria-label="Ideas to learn">'+LEARN.map(function(x,i){var got=lr.indexOf(x.id)>=0,t=LTONE[x.id]||'i';
      return '<article class="lc '+t+'" aria-label="'+(i+1)+' of '+LEARN.length+': '+esc(x.h)+'"><div class="lck"><span class="ic '+t+'">'+I(ICO.learn,2)+'</span><span class="eb">'+esc(x.kind)+'</span>'+(got?'<span class="tag lgot">✓ Learned</span>':'')+'</div>'+
        '<h3>'+esc(x.h)+'</h3>'+lvizOf(x.id)+'<p class="one">'+x.one+'</p>'+
        '<div class="lcf">'+(got?'<span class="muted">'+(i<LEARN.length-1?'Next idea below ↓':'Done for today')+'</span>':'<button type="button" class="btn p s" data-got="'+x.id+'">Got it</button><span class="muted">'+(i+1)+' of '+LEARN.length+'</span>')+'</div></article>'}).join('')+'</div></section>'}
function lrnSlide(go){return;var tr=$('#s-ideas .lnt');if(!tr)return;var n=go!=null?go:+tr.dataset.first;if(n>0)tr.scrollLeft=tr.children[n].offsetLeft-tr.children[0].offsetLeft;
  var dots=$$('#s-ideas .lnd i'),sync=function(){var i=Math.round(tr.scrollLeft/(tr.children[0].offsetWidth+12));dots.forEach(function(d,j){d.classList.toggle('on',j===i)})};tr.addEventListener('scroll',sync,{passive:true});sync()}
/* ---------------- IDEAS ---------------- */
var rs=function(x){return parseFloat(String(x).replace(/[₹,]/g,''))};
function callCard(c,i){var e=rs(c.lv[0]),t=rs(c.lv[1]),l=rs(c.lv[3]),left=t-l,pc=left/l*100,done=Math.max(0,Math.min(100,(l-e)/(t-e)*100));
  return '<article class="tc" aria-label="'+esc(c.n)+' trade call"><div class="hd"><div><b>'+esc(c.n)+'</b><small>'+esc(c.k)+' · '+esc(c.when)+'</small></div><span class="tag">Active</span></div>'+
    '<small class="muted" style="margin-top:-8px">'+esc(c.meta)+'</small>'+
    '<div class="legs">'+c.legs.map(function(g){return '<div><i class="'+g[0]+'">'+(g[0]==='b'?'Buy':'Sell')+'</i><span>'+esc(g[1])+(g[3]>1?' <small class="muted">×'+g[3]+'</small>':'')+'</span><b>'+esc(g[2])+'</b></div>'}).join('')+'</div>'+
    '<div class="lv4"><div>Entry<b>'+c.lv[0]+'</b></div><div>Target<b class="u">'+c.lv[1]+'</b></div><div>Stop loss<b>'+c.lv[2]+'</b></div><div>Last<b>'+c.lv[3]+'</b></div></div>'+
    '<div class="pot"><div class="h"><span>Potential left</span><b>+₹'+left.toFixed(2)+' <span class="u">'+(pc>=0?'+':'')+pc.toFixed(0)+'%</span></b></div><div class="bar" role="img" aria-label="'+done.toFixed(0)+'% of the way from entry to target"><i style="width:'+done.toFixed(1)+'%"></i><span style="left:'+done.toFixed(1)+'%"></span></div><div class="l"><span>Entry</span><span>'+done.toFixed(0)+'% of the way</span><span>Target</span></div></div>'+
    (c.tflag?'<div class="flag">'+esc(c.tflag)+'</div>':'')+
    '<div class="risk3"><div>Max profit<b class="u">'+esc(c.mp)+'</b></div><div>Max loss<b>'+esc(c.ml)+'</b></div><div>Capital<b>'+esc(c.cap)+'</b></div></div></article>'}
function sotdWhy(){var S=D.sotd,ab=(S.close/S.old_hi-1)*100,fromLo=(S.close/S.l52-1)*100,sma=(S.close/S.sma20-1)*100;
  return ['Closed at a fresh 52-week high of ₹'+num(S.close,0)+', '+ab.toFixed(1)+'% above the old high of ₹'+num(S.old_hi,0)+' ('+S.old_hi_d+').',
    'Volume was '+S.vx+'× its 20-day average, so the move had real participation.',
    Math.round(S.dl)+'% of traded shares were taken for delivery, a sign of buyers holding on.',
    'Futures open interest rose '+Math.round(S.oi)+'% with the price: fresh long positions.',
    'Up '+fromLo.toFixed(0)+'% from its 52-week low (₹'+num(S.l52,0)+', '+S.l52_d+') and '+sma.toFixed(1)+'% above its 20-day average.']}
function rIdeas(){var s=$('#s-ideas'),S=D.sotd;
  s.innerHTML=top('Ideas',streakChip())+
    '<section class="sec" id="sd"><div class="h2"><h2>Stock of the day</h2>'+infoBtn('sd')+'<span class="sp"></span><small>'+S.date+' close</small></div><div class="card sd">'+
      '<div class="eb">'+esc(S.name)+' · '+esc(S.ind)+(S.fo?' · F&amp;O':'')+'</div><div class="px"><b>'+S.s+'</b><span class="v">₹'+num(S.close,0)+'</span><span class="u" style="font-weight:600">+'+S.chg.toFixed(2)+'%</span></div>'+sotdViz()+
      '<div class="v-ch" style="margin-top:10px"><span>Volume<b>'+S.vx+'×</b></span><span>Delivery<b>'+Math.round(S.dl)+'%</b></span><span>Futures OI<b>+'+Math.round(S.oi)+'%</b></span></div>'+
      '<ul class="why">'+sotdWhy().map(function(w){return '<li>'+w+'</li>'}).join('')+'<li class="r">Check the stop before you act: the day’s high was ₹'+num(S.day_hi,0)+'. Analysis, not advice.</li></ul>'+
      '<div style="display:flex;gap:10px;margin-top:16px"><a class="btn p s" href="'+L.screener+'">Screen similar</a><button type="button" class="btn g s" data-act="others">Also near highs</button></div></div></section>'+
    '<section class="sec" id="calls"><div class="h2"><h2>Trade calls</h2>'+infoBtn('calls')+'<span class="sp"></span><small id="tcC">1 of '+CALLS.length+'</small></div>'+
      profitHTML()+'<div class="tcw"><div class="tc-tr" id="tcTr">'+CALLS.map(locked()?lockedCard:callCard).join('')+'</div></div><a class="trl" href="#ideas/record" data-act="record"><span><b>'+CLW+' of '+CL.length+'</b> recent calls hit target</span><span>See the track record \u203A</span></a><p class="note">Research advice from the AlphaPad desk. Prices are indicative.</p></section>'+
    '<section class="sec" id="baskets">'+(function(){var B=D.baskets.slice().sort(function(x,y){return (parseFloat(y.r)||0)-(parseFloat(x.r)||0)}),mx=Math.max.apply(null,B.map(function(b){return Math.abs(parseFloat(b.r))||0}).concat([1])),
        RK={low:[1,'Low risk','t'],medium:[2,'Medium risk','a'],high:[3,'High risk','w']};
      return '<p class="bk-in">Ready-made stock baskets from the AlphaPad desk, ranked by 1-year return.</p>'+
        '<div class="bkl">'+B.map(function(b,n){var m=String(b.m).split('·').map(function(x){return x.trim()}),rk=RK[(m[0]||'').split(' ')[0].toLowerCase()]||[2,m[0]||'','a'],v=parseFloat(b.r)||0,up=v>=0;
          return '<a class="bkc" href="'+L.baskets+'" target="_blank" rel="noopener">'+
            '<span class="bkh"><span class="ic t">'+I(ICO.bk,2)+'</span><span class="bkn"><b>'+esc(b.n)+'</b><small>'+esc(m[1]||'')+'</small></span>'+(n===0?'<span class="bkt">Best 1-year</span>':'')+'</span>'+
            '<span class="bkr"><span class="bkv"><b class="'+(up?'u':'')+'">'+esc(b.r)+'</b><small>1-year return</small></span>'+
              '<span class="bkm" aria-label="'+esc(rk[1])+'"><span class="bkmb">'+[1,2,3].map(function(k){return '<i class="'+(k<=rk[0]?'on '+rk[2]:'')+'"></i>'}).join('')+'</span><small>'+esc(rk[1])+'</small></span></span>'+
            '<span class="bkbar" aria-hidden="true"><i class="'+(up?'':'d')+'" style="width:'+(Math.abs(v)/mx*100).toFixed(0)+'%"></i></span>'+
            '<span class="bkgo">View basket →</span></a>'}).join('')+'</div>'+
        '<a class="bkb" href="'+L.baskets+'" target="_blank" rel="noopener"><span class="ic i">'+I('<path d="M12 5v14M5 12h14"/>',2)+'</span><span><b>Build your own basket</b><small>Pick your own stocks and weights on AlphaPad</small></span><span class="go" aria-hidden="true">›</span></a>'+
        '<p class="note">Past returns are not a promise of future returns. Not investment advice.</p>'})()+'</section>'+learnHTML();
  lrnSlide();var tr=$('#tcTr');tr.addEventListener('scroll',function(){var w=tr.firstChild.offsetWidth+12;$('#tcC').textContent=(Math.round(tr.scrollLeft/w)+1)+' of '+CALLS.length},{passive:true})}



/* ---------------- Pro teaser: live calls stay hidden, booked profits are shown ----------------
   To remove the teaser later, set PRO_LOCK=false (or open the app with ?pro=1). */
var PRO_LOCK=true;
function locked(){return PRO_LOCK&&!store.get('ap-pro',0)&&!/[?&]pro=1/.test(location.search)}
function segOf(k){return /fut/i.test(k)?'Futures':/stock|equity|positional|swing|delivery/i.test(k)?'Equity':'Options'}
function profitHTML(where){var wins=CL.filter(function(x){return x.ret>0}),loss=CL.filter(function(x){return x.ret<=0}),net=CL.reduce(function(a,x){return a+x.pnl},0),segs=['Options','Futures','Equity'],
    cnt=segs.map(function(g){return [g,wins.filter(function(x){return segOf(x.k)===g}).length,CL.filter(function(x){return segOf(x.k)===g}).length]}).filter(function(x){return x[2]}),mx=Math.max.apply(null,cnt.map(function(x){return x[1]}).concat([1])),
    days=CL.map(function(x){return x.cl}).sort(),from=dshort(days[0]),to=dshort(days[days.length-1]);
  return '<section class="pbk'+(where?' '+where:'')+'" aria-label="Profits booked"><div class="pbh"><span class="eb">Performance on AlphaPad</span><small>'+from+' – '+to+'</small></div>'+
    '<div class="pbn"><b>'+wins.length+'</b><span>profits booked<small>of '+CL.length+' calls closed · '+loss.length+' closed at a loss</small></span></div>'+
    '<div class="pbb">'+cnt.map(function(x){return '<div><em>'+x[1]+'</em><i style="height:'+(18+x[1]/mx*46).toFixed(0)+'px"></i><span>'+x[0]+'</span></div>'}).join('')+'<div class="net"><em>'+inr(net,true)+'</em><span>net on the suggested size</span></div></div>'+
    (locked()?'<button type="button" class="btn full pbc" data-act="pro">Unlock today’s '+CALLS.length+' live calls →</button>':'')+
    '<p class="pbf">Every closed call is counted, losses included. Past results do not promise future returns.</p></section>'}
function liveHTML(){var w=CL.filter(function(x){return x.ret>0}).length;
  return '<section class="pbk home live" aria-label="Live trade calls"><div class="pbh"><span class="eb">Live trade calls</span><small id="lvC">1 of '+CALLS.length+' live</small></div>'+
    '<div class="lvl" data-noswipe aria-label="Live trade calls, swipe for more">'+CALLS.map(function(c,i){var e=rs(c.lv[0]),t=rs(c.lv[1]),l=rs(c.lv[3]),pc=(t-l)/l*100,done=Math.max(0,Math.min(100,(l-e)/(t-e)*100));
      return '<a class="lvr" href="#ideas/calls" data-call="'+i+'"><div class="lvt"><b>'+esc(c.n)+'</b><small>'+esc(c.k)+' · '+esc(c.when)+'</small></div>'+
        '<div class="lvp"><b>'+(pc>=0?'+':'')+pc.toFixed(0)+'%</b><small>left to target</small></div>'+
        '<div class="lvb" role="img" aria-label="'+done.toFixed(0)+'% of the way from entry to target"><i style="width:'+done.toFixed(1)+'%"></i></div>'+
        '<div class="lvx"><span>Entry <b>'+c.lv[0]+'</b></span><span>Last <b>'+c.lv[3]+'</b></span><span>Target <b class="u">'+c.lv[1]+'</b></span></div></a>'}).join('')+'</div>'+
    (CALLS.length>1?'<div class="mdots lvd" aria-hidden="true">'+CALLS.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div>':'')+
    '<a class="btn full pbc" href="#ideas/calls">Open all calls with levels →</a>'+
    '<p class="pbf">'+w+' of the last '+CL.length+' closed calls booked profit. Analysis, not investment advice.</p></section>'}
function slideSync(tq,dq,cq,sfx){var tr=$(tq);if(!tr||!tr.children.length)return;var n=tr.children.length,dots=$$(dq);
  var sync=function(){var i=Math.round(tr.scrollLeft/(tr.children[0].offsetWidth+12));dots.forEach(function(d,j){d.classList.toggle('on',j===i)});var c=$(cq);if(c)c.textContent=(i+1)+' of '+n+sfx};
  tr.addEventListener('scroll',sync,{passive:true});sync()}
function liveSlide(){slideSync('#s-today .lvl','#s-today .lvd i','#lvC',' live');slideSync('#s-today .pv.hl .hlt','#s-today .hld i','#hlC','');slideSync('#s-today .ipt','#s-today .ipd i','#ipoC','');slideSync('#s-today .mft2','#s-today .mfd i','#mfC','')}
function flFade(){var l=$('#filings .list.fl');if(!l)return;var f=function(){l.classList.toggle('more',l.scrollHeight-l.clientHeight-l.scrollTop>=4)};l.addEventListener('scroll',f,{passive:true});f()}
function lockedCard(c){var nm=String(c.n),e=rs(c.lv[0]),t=rs(c.lv[1]),l=rs(c.lv[3]),left=t-l,pc=left/l*100,done=Math.max(0,Math.min(100,(l-e)/(t-e)*100));
  return '<article class="tc lk" aria-label="Locked trade call"><div class="hd"><div><b class="lkn">••••••••</b><small>'+esc(c.k)+' · '+esc(c.when)+'</small></div><span class="tag">Active</span></div>'+
  '<div class="pot"><div class="h"><span>Potential left</span><b>'+(pc>=0?'+':'')+pc.toFixed(0)+'% <span class="u">to target</span></b></div><div class="bar" role="img" aria-label="'+done.toFixed(0)+'% of the way from entry to target"><i style="width:'+done.toFixed(1)+'%"></i><span style="left:'+done.toFixed(1)+'%"></span></div><div class="l"><span>Entry</span><span>'+done.toFixed(0)+'% of the way</span><span>Target</span></div></div>'+
  '<div class="lkz"><div class="lkb" aria-hidden="true"><div class="legs"><div><i class="b">Buy</i><span>•••• ••••</span><b>₹•••</b></div><div><i class="s">Sell</i><span>•••• ••••</span><b>₹•••</b></div></div>'+
  '<div class="lv4"><div>Entry<b>₹•••</b></div><div>Target<b>₹•••</b></div><div>Stop loss<b>₹•••</b></div><div>Last<b>₹•••</b></div></div></div>'+
  '<div class="lkov"><span class="lki" aria-hidden="true">'+I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',2)+'</span><b>Unlock the stock and levels</b><small>'+CL.filter(function(x){return x.ret>0}).length+' of the last '+CL.length+' calls booked profit</small><button type="button" class="btn p s" data-act="pro">Unlock with Pro</button></div></div></article>'}
function proSheet(){var w=CL.filter(function(x){return x.ret>0}).length;
  sheet('AlphaPad Pro','<p>See every live call the moment the desk posts it.</p><ul class="prol"><li>All live trade calls: entry, target, stop loss and size</li><li>Alerts when a call hits target or stop</li><li>Full track record and option payoffs</li><li>Everything else in AlphaPad stays free</li></ul>'+
    '<div class="facts"><div>Profits booked<b>'+w+' of '+CL.length+'</b></div><div>Closed at a loss<b>'+(CL.length-w)+'</b></div><div>Live now<b>'+CALLS.length+' calls</b></div></div>'+
    '<button type="button" class="btn p full" style="margin-top:14px" data-act="prook">Unlock Pro</button><button type="button" class="btn g full" style="margin-top:8px" data-close>Not now</button><p class="note" style="text-align:center">Prototype: unlocking here only changes this device.</p>')}

/* ---------------- track record: every closed call, losses included ---------------- */
var trF='all';
var HOW={target:['Target hit','u'],stop:['Stop loss hit','d'],early:['Exited early','w']};
var dshort=function(d){return dt(d).toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
var days=function(a,b){return Math.max(1,Math.round((dt(b)-dt(a))/864e5))};
function trackHTML(){var c=CL,n=c.length,tg=c.filter(function(x){return x.how==='target'}),sl=c.filter(function(x){return x.how==='stop'}),ea=c.filter(function(x){return x.how==='early'});
  var avg=c.reduce(function(s,x){return s+x.ret},0)/n,aw=tg.length?tg.reduce(function(s,x){return s+x.ret},0)/tg.length:0,al=sl.length?sl.reduce(function(s,x){return s+x.ret},0)/sl.length:0;
  var mx=Math.max.apply(null,c.map(function(x){return Math.abs(x.ret)}));
  var seq=c.slice().reverse().map(function(x){var h=Math.max(4,Math.abs(x.ret)/mx*30);return '<i class="'+(x.ret>=0?'u':'d')+'" style="height:'+h.toFixed(0)+'px;'+(x.ret>=0?'margin-bottom:':'margin-top:')+h.toFixed(0)+'px" title="'+x.n+' '+(x.ret>=0?'+':'\u2212')+Math.abs(x.ret)+'%"></i>'}).join('');
  var list=c.filter(function(x){return trF==='all'||x.how===trF});
  return '<div class="card trk"><div class="th"><div><b>'+tg.length+' of '+n+'</b><small>calls hit their target</small></div><div><b class="'+(avg>=0?'u':'d')+'">'+(avg>=0?'+':'\u2212')+Math.abs(avg).toFixed(1)+'%</b><small>average per call</small></div></div>'+
    '<div class="seq" role="img" aria-label="Last '+n+' closed calls, oldest to newest: '+tg.length+' hit target, '+sl.length+' hit stop loss, '+ea.length+' exited early">'+seq+'</div><div class="seqx"><span>'+dshort(c[n-1].cl)+'</span><span>'+dshort(c[0].cl)+'</span></div>'+
    '<div class="t3"><div><span>Target hit</span><b>'+tg.length+'</b><small>avg +'+aw.toFixed(0)+'%</small></div><div><span>Stop loss hit</span><b>'+sl.length+'</b><small>avg \u2212'+Math.abs(al).toFixed(0)+'%</small></div><div><span>Exited early</span><b>'+ea.length+'</b><small>booked partial</small></div></div></div>'+
    '<div class="chips" style="margin-top:12px" aria-label="Filter closed calls">'+[['all','All '+n],['target','Target hit'],['stop','Stop loss'],['early','Exited early']].map(function(f){return '<button type="button" data-tr="'+f[0]+'" aria-pressed="'+(trF===f[0])+'">'+f[1]+'</button>'}).join('')+'</div>'+
    '<div class="card" style="margin-top:12px;padding:0 16px"><div class="list">'+list.map(function(x){var i=CL.indexOf(x);return '<button type="button" class="row" data-cl="'+i+'"><span class="dotc '+HOW[x.how][1]+'" aria-hidden="true"></span><span class="tx"><b>'+esc(x.n)+' <small class="muted">'+esc(x.k)+'</small></b><small>'+HOW[x.how][0]+' \u00B7 closed '+dshort(x.cl)+' \u00B7 '+days(x.po,x.cl)+' day'+(days(x.po,x.cl)>1?'s':'')+'</small></span><span class="vl '+(x.ret>=0?'u':'d')+'">'+(x.ret>=0?'+':'\u2212')+Math.abs(x.ret)+'%<small class="muted">'+inr(x.pnl,true)+'</small></span></button>'}).join('')+'</div></div>'+
    '<p class="note">Every call closed in the last 30 days is listed, losses included. Returns are per call on the premium or price, before charges. Sample data for the prototype.</p>'}
var recFrom=false;
function recSheet(){recFrom=false;sheet('Track record','<p class="muted" style="margin-top:0">Every call closed in the last 30 days, losses included.</p>'+trackHTML())}
function openClosed(i){var x=CL[i];if(!x)return;var back=recFrom;recFrom=false;var dd=days(x.po,x.cl),h=HOW[x.how];
  var pct=function(v){return (v>=x.en?'+':'\u2212')+Math.abs((v-x.en)/x.en*100).toFixed(1)+'%'};
  sheet(esc(x.n)+' \u00B7 '+esc(x.k),(back?'<button type="button" class="l ipback" data-act="record">\u2190 Track record</button>':'')+'<div class="facts"><div>Result<b class="'+(x.ret>=0?'u':'d')+'">'+(x.ret>=0?'+':'\u2212')+Math.abs(x.ret)+'%</b></div><div>Per lot / qty<b class="'+(x.pnl>=0?'u':'d')+'">'+inr(x.pnl,true)+'</b></div><div>Held<b>'+dd+' day'+(dd>1?'s':'')+'</b></div></div>'+
    '<p class="muted" style="margin-top:8px">'+esc(x.legs)+' \u00B7 qty '+x.q.toLocaleString('en-IN')+'</p>'+
    '<div class="lv4" style="margin:14px 0"><div>Entry<b>\u20B9'+x.en+'</b></div><div>Target<b>\u20B9'+x.tg+'</b><small class="muted">'+pct(x.tg)+'</small></div><div>Stop loss<b>\u20B9'+x.sl+'</b><small class="muted">'+pct(x.sl)+'</small></div><div>Exit<b>\u20B9'+x.ex+'</b></div></div>'+
    '<ol class="tl"><li class="past"><time>'+dshort(x.po)+'</time><b>Call posted at \u20B9'+x.en+'</b></li><li class="'+(x.how==='target'?'ev':'')+'"><time>'+dshort(x.cl)+'</time><b>'+h[0]+' at \u20B9'+x.ex+'</b></li></ol>'+
    '<p class="note">'+(x.how==='stop'?'The stop loss did its job: the loss stayed close to the planned risk.':x.how==='early'?'The desk asked to exit before the target as momentum faded.':'Closed at the target set when the call was posted.')+' Past results do not promise future returns.</p>')}

/* ---------------- JOURNAL ---------------- */
function insights(tr){var out=[],opt=tr.filter(function(t){return t.kind==='Option'}),ow=opt.filter(function(t){return t.pnl>0}),ol=opt.filter(function(t){return t.pnl<0});
  var avg=function(a){return a.reduce(function(x,t){return x+t.held},0)/a.length};
  if(ow.length&&ol.length){var r=avg(ol)/avg(ow);if(r>1.3)out.push(['w','You hold losing option trades <b>'+r.toFixed(1)+'× longer</b> than winners.'])}
  var by={};tr.forEach(function(t){var k=dt(t.d).toLocaleDateString('en-IN',{weekday:'long'});by[k]=(by[k]||0)+t.pnl});var wd=Object.keys(by).sort(function(a,b){return by[a]-by[b]})[0];
  if(wd&&by[wd]<0)out.push(['w','<b>'+wd+'s cost you '+inr(by[wd])+'</b>, your weakest day. Consider trading smaller.']);
  var ss={};tr.forEach(function(t){if(!t.setup)return;var b=ss[t.setup]||(ss[t.setup]={p:0,n:0});b.p+=t.pnl;b.n++});var best=Object.keys(ss).sort(function(a,b){return ss[b].p-ss[a].p})[0];
  if(best&&ss[best].p>0)out.push(['g','<b>'+best+'</b> is your best setup: '+inr(ss[best].p,true)+' over '+ss[best].n+' trades.']);
  var off=tr.filter(function(t){return (t.score||5)<4}),on=tr.filter(function(t){return (t.score||0)>=4});
  if(off.length&&on.length)out.push(['i','Trades that kept 4–5 plan rules made <b>'+inr(on.reduce(function(s,t){return s+t.pnl},0),true)+'</b>; the rest made <b>'+inr(off.reduce(function(s,t){return s+t.pnl},0),true)+'</b>.']);
  return out.slice(0,3)}
function equity(tr){var W=340,H=140,c=0,pts=tr.map(function(t){c+=t.pnl;return c});if(pts.length<2)return '';var mx=Math.max.apply(null,pts.concat([0])),mn=Math.min.apply(null,pts.concat([0]));
  var X=function(i){return i*W/(pts.length-1)},Y=function(v){return 6+(mx-v)/((mx-mn)||1)*(H-12)},line=pts.map(function(v,i){return X(i).toFixed(1)+','+Y(v).toFixed(1)}).join(' ');
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="Running P&L over '+tr.length+' trades, ending at '+inr(c,true)+'"><polygon class="ar" points="0,'+Y(0).toFixed(1)+' '+line+' '+W+','+Y(0).toFixed(1)+'"/><line class="z" x1="0" x2="'+W+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'" vector-effect="non-scaling-stroke"/><polyline class="ln" points="'+line+'" vector-effect="non-scaling-stroke"/></svg>'}
function jcal(m,tr){var y=+m.slice(0,4),mo=+m.slice(5,7),days=new Date(y,mo,0).getDate(),by={};tr.forEach(function(t){(by[t.d]=by[t.d]||[]).push(t)});
  var mx=Math.max.apply(null,Object.keys(by).map(function(d){return Math.abs(by[d].reduce(function(s,t){return s+t.pnl},0))}).concat([1]));
  var cells=[],first=new Date(y,mo-1,1).getDay();var lead=(first+6)%7;if(lead<5)for(var k=0;k<lead;k++)cells.push('<span class="x"></span>');
  for(var d=1;d<=days;d++){var wd=new Date(y,mo-1,d).getDay();if(wd===0||wd===6)continue;var key=m+'-'+String(d).padStart(2,'0'),list=by[key];
    if(!list){cells.push('<button type="button" class="nt" data-day="'+key+'" aria-label="'+dlong(key)+', no trades">'+d+'</button>');continue}
    var p=list.reduce(function(s,t){return s+t.pnl},0),a=(0.12+Math.abs(p)/mx*0.5).toFixed(2);
    cells.push('<button type="button" class="'+(p>=0?'p':'n')+(jDay===key?' sel':'')+'" style="--a:'+a+'" data-day="'+key+'" aria-label="'+dlong(key)+', '+list.length+' trades, '+inr(p,true)+'">'+d+'<small>'+(Math.abs(p)>=1000?(p<0?'−':'+')+(Math.abs(p)/1000).toFixed(1)+'k':inr(p,true))+'</small></button>')}
  return '<div class="jcal" role="group" aria-label="'+mname(m)+' by day">'+['Mon','Tue','Wed','Thu','Fri'].map(function(w){return '<span class="hd">'+w+'</span>'}).join('')+cells.join('')+'</div>'}
var jTF='all';
function rJournal(){var s=$('#s-journal'),ms=MONTHS(),mi=ms.indexOf(jMonth);if(mi<0){jMonth=ms[ms.length-1];mi=ms.length-1}
  var tr=ALL.filter(function(t){return t.d.slice(0,7)===jMonth}),st=stats(tr),td=todo(),ins=insights(tr),mist={};tr.forEach(function(t){(t.mistakes||[]).forEach(function(k){mist[k]=(mist[k]||0)+1})});
  var mk=Object.keys(mist).sort(function(a,b){return mist[b]-mist[a]}),mmx=mk.length?mist[mk[0]]:1;
  s.innerHTML=top('Journal','<span class="tag">Sample</span>')+
    (td.length?'<button type="button" class="jrv" id="review" data-act="jrev"><span class="ic a">'+I('<path d="M4 13h4l2 3h4l2-3h4"/><path d="M5 5h14l1 8v6H4v-6z"/>',2)+'</span><span class="tx"><b>'+td.length+' trade'+(td.length>1?'s':'')+' to review</b><small>From today · about a minute</small></span><span class="jrn">'+td.length+'</span><span class="go" aria-hidden="true">›</span></button>'
      :'<div class="jrv ok" id="review"><span class="ic t">✓</span><span class="tx"><b>All of today’s trades are reviewed</b><small>New trades from your broker show up here</small></span></div>')+
    '<div class="mnav"><button type="button" data-m="-1" aria-label="Previous month"'+(mi<=0?' disabled':'')+'>‹</button><b>'+mname(jMonth)+'</b><button type="button" data-m="1" aria-label="Next month"'+(mi>=ms.length-1?' disabled':'')+'>›</button></div>'+
    '<div class="kpi"><div><span>Net P&amp;L</span><b class="'+(st.net>=0?'u':'d')+'">'+inr(st.net,true)+'</b><small>'+st.n+' trades</small></div><div><span>Win rate</span><b>'+st.wr.toFixed(0)+'%</b><small>'+st.w+' won · '+st.l+' lost</small></div>'+
      '<div><span>Profit factor</span><b>'+st.pf.toFixed(2)+'</b><small>gross win ÷ gross loss</small></div><div><span>Avg win / loss</span><b>'+(st.al?(st.aw/st.al).toFixed(2):'–')+'×</b><small>'+inr(st.aw)+' / '+inr(st.al)+'</small></div></div>'+
    '<div class="h2"><h2>Equity curve</h2><span class="sp"></span><small>running P&amp;L</small></div><div class="eq">'+equity(tr)+'</div>'+
    '<div class="h2"><h2>Calendar</h2><span class="sp"></span><small>tap a day</small></div>'+jcal(jMonth,tr)+
    (ins.length?'<div class="h2 jhide"><h2>Insights</h2></div><div class="ins">'+ins.map(function(x){return '<div class="'+x[0]+'">'+x[1]+'</div>'}).join('')+'</div>':'')+
    '<div class="h2"><h2>Plan score</h2><span class="sp"></span><small>5 rules per trade</small></div><div class="card"><div class="score"><span class="big">'+st.score.toFixed(1)+'</span><small>out of 5 on average.<br>'+(mk.length?'Most missed: <b>'+mk[0].toLowerCase()+'</b>.':'Every rule kept.')+'</small></div>'+
      (mk.length?'<div class="bars mist" style="margin-top:14px">'+mk.map(function(k){return bar(k,mist[k]+'×',mist[k]/mmx*100,'a')}).join('')+'</div>':'')+'</div>'+
    '<div class="h2 jtr"><h2>Trades</h2><small>'+st.n+' this month · '+st.w+' won · '+st.l+' lost</small></div>'+
    '<div class="seg jtseg" role="group" aria-label="Show trades">'+[['all','All '+st.n],['win','Wins '+st.w],['loss','Losses '+st.l]].map(function(b){return '<button type="button" data-jt="'+b[0]+'" aria-pressed="'+(jTF===b[0])+'">'+b[1]+'</button>'}).join('')+'</div>'+
    (function(){var L=tr.slice().reverse().filter(function(t){return jTF==='all'||(jTF==='win'?t.pnl>0:t.pnl<0)}),G=[];L.forEach(function(t){var g=G[G.length-1];if(g&&g.d===t.d)g.t.push(t);else G.push({d:t.d,t:[t]})});
      if(!G.length)return '<p class="muted" style="margin-top:12px">No trades of this kind this month.</p>';
      return G.map(function(g){var dp=g.t.reduce(function(a,t){return a+t.pnl},0);
        return '<div class="jday"><button type="button" class="jdh" data-day="'+g.d+'"><b>'+dt(g.d).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})+'</b><small>'+g.t.length+' trade'+(g.t.length>1?'s':'')+'</small><span class="'+(dp>=0?'u':'d')+'">'+inr(dp,true)+'</span></button>'+
          '<div class="card jdl"><div class="list">'+g.t.map(function(t){var i=ALL.indexOf(t),sc=t.score,cl=sc==null?'':sc>=5?'t':sc>=3?'a':'s';
            return '<button type="button" class="row" data-trade="'+i+'"><span class="tx"><b>'+esc(t.sym)+(t.confirmed?' <span class="tag">today</span>':'')+'</b><small>'+t.t+' · '+esc(t.setup||'No setup')+'</small></span><span class="vl '+(t.pnl>=0?'u':'d')+'">'+inr(t.pnl,true)+(sc!=null?'<span class="jps '+cl+'">Plan '+sc+'/5</span>':'')+'</span></button>'}).join('')+'</div></div></div>'}).join('')})()+
    '<p class="note">Sample trades to show how your journal looks. Charges and taxes are not deducted.</p>';
  badge()}
function dayBody(d){var list=ALL.filter(function(t){return t.d===d}),p=list.reduce(function(s,t){return s+t.pnl},0),n=notes[d]||{};
  return '<div class="facts"><div>Trades<b>'+list.length+'</b></div><div>P&amp;L<b class="'+(p>=0?'u':'d')+'">'+inr(p,true)+'</b></div><div>Wins<b>'+list.filter(function(t){return t.pnl>0}).length+'</b></div></div>'+
    (list.length?'<div class="list">'+list.map(function(t){return '<button type="button" class="row" data-trade="'+ALL.indexOf(t)+'"><span class="tx"><b>'+esc(t.sym)+'</b><small>'+t.t+' · '+esc(t.setup||'')+'</small></span><span class="vl '+(t.pnl>=0?'u':'d')+'">'+inr(t.pnl,true)+'</span></button>'}).join('')+'</div>':'<p class="muted">No trades this day.</p>')+
    '<label class="fld"><span>Before the market: plan</span><textarea data-n="pre" placeholder="Levels, setups, max loss for the day">'+esc(n.pre||'')+'</textarea></label>'+
    '<label class="fld"><span>After the close: what I learned</span><textarea data-n="post" placeholder="What went well, what to change">'+esc(n.post||'')+'</textarea></label>'+
    '<div class="fld"><span>How the day felt</span><div class="moods">'+MOODS.map(function(m){return '<button type="button" data-dmood="'+m+'" aria-pressed="'+(n.mood===m)+'">'+m+'</button>'}).join('')+'</div></div><p class="note">Notes save on this device as you type.</p>'}
function openDay(d){jDay=d;sheet(dlong(d),dayBody(d),function(p){var tm;p.addEventListener('input',function(e){var k=e.target.dataset.n;if(!k)return;(notes[d]=notes[d]||{})[k]=e.target.value;clearTimeout(tm);tm=setTimeout(function(){store.set('ap-journal-notes',notes)},300)});
  p.addEventListener('click',function(e){var b=e.target.closest('[data-dmood]');if(!b)return;(notes[d]=notes[d]||{}).mood=b.dataset.dmood;store.set('ap-journal-notes',notes);$$('[data-dmood]',p).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})})});if(tab==='journal')rJournal()}
function openTrade(i){var t=ALL[i];if(!t)return;var r=t.risk?t.pnl/t.risk:0;
  sheet(esc(t.sym),'<div class="facts"><div>P&amp;L<b class="'+(t.pnl>=0?'u':'d')+'">'+inr(t.pnl,true)+'</b></div><div>R multiple<b>'+(r>=0?'+':'−')+Math.abs(r).toFixed(2)+'R</b></div><div>Held<b>'+hrs(t.held)+'</b></div><div>Side<b>'+t.side+' '+t.qty+'</b></div><div>Entry<b>'+t.en+'</b></div><div>Exit<b>'+t.ex+'</b></div></div>'+
    '<p class="muted" style="margin-top:10px">'+dlong(t.d)+' at '+t.t+' · '+esc(t.kind)+' · '+esc(t.setup||'No setup')+' · Mood: '+esc(t.mood||'–')+'</p>'+
    '<div class="fld"><span>Plan check · '+(t.score!=null?t.score:'–')+' of 5</span></div><div>'+RULES.map(function(rr){var ok=t.rules&&t.rules[rr[0]];return '<div class="chk"><span aria-hidden="true" class="'+(ok?'u':'w')+'">'+(ok?'✓':'✕')+'</span>'+rr[1]+'</div>'}).join('')+'</div>'+
    (t.note?'<p style="margin-top:14px">“'+esc(t.note)+'”</p>':''))}
function reviewForm(id){var p=PEND.filter(function(x){return x.id===id})[0];if(!p)return;var prev={};
  sheet('Review '+esc(p.sym),'<div class="facts"><div>P&amp;L<b class="'+(p.pnl>=0?'u':'d')+'">'+inr(p.pnl,true)+'</b></div><div>Entry → exit<b>'+p.en+' → '+p.ex+'</b></div><div>Held<b>'+hrs(p.held)+'</b></div></div><p class="muted">'+p.t+' · '+p.side+' '+p.qty+' · from '+esc(p.broker)+'</p>'+
    '<form id="rvF" novalidate><label class="fld"><span>Setup</span><select name="setupSel"><option value="">Choose the setup</option>'+SETUPS.map(function(x){return '<option>'+x+'</option>'}).join('')+'<option>Other</option></select><span class="err" id="rvErr" hidden>Choose a setup to log this trade.</span></label>'+
    '<div class="fld"><span>Did you follow your plan?</span></div><div>'+RULES.map(function(r){return '<label class="chk"><input type="checkbox" name="'+r[0]+'" checked>'+r[1]+'</label>'}).join('')+'</div>'+
    '<div class="fld"><span>Mood</span><div class="moods">'+MOODS.map(function(m){return '<button type="button" data-mood="'+m+'" aria-pressed="false">'+m+'</button>'}).join('')+'</div></div>'+
    '<label class="fld"><span>Note (optional)</span><textarea name="note" placeholder="Why you took it, what you saw"></textarea></label>'+
    '<div class="acts"><button type="button" class="btn g" data-skip>Skip</button><button type="submit" class="btn p">Add to journal</button></div></form>',
  function(pn){var mood='';pn.addEventListener('click',function(e){var b=e.target.closest('[data-mood]');if(b){mood=b.dataset.mood;$$('[data-mood]',pn).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})}
      if(e.target.closest('[data-skip]')){rv[id]={status:'skip'};store.set('ap-journal-review',rv);mergeAll();closeSheet();toast('Skipped. It stays out of your stats.');rJournal();nextReview()}});
    $('#rvF',pn).addEventListener('submit',function(e){e.preventDefault();var f=e.target;if(!f.setupSel.value){$('#rvErr',pn).hidden=false;f.setupSel.focus();return}
      var rules={};RULES.forEach(function(r){rules[r[0]]=f[r[0]].checked});rv[id]={status:'ok',setup:f.setupSel.value,rules:rules,mood:mood,note:f.note.value.trim()};store.set('ap-journal-review',rv);mergeAll();
      jMonth=p.d.slice(0,7);closeSheet();toast('Added to your journal');rJournal();nextReview()})})}
function jRevSheet(){var td=todo();if(!td.length){toast('All of today’s trades are reviewed');return}
  sheet('Trades to review','<p class="muted" style="margin-top:0">Fetched from your broker today. Add the setup and plan check to log each one.</p>'+
    '<div class="card" style="padding:0 14px"><div class="list jrl">'+td.map(function(p){return '<button type="button" class="row" data-review="'+p.id+'"><span class="tx"><b>'+esc(p.sym)+'</b><small>'+p.t+' · '+p.side+' '+p.qty+' · '+p.en+' → '+p.ex+'</small></span><span class="vl '+(p.pnl>=0?'u':'d')+'">'+inr(p.pnl,true)+'</span><span class="go" aria-hidden="true">›</span></button>'}).join('')+'</div></div>'+
    '<button type="button" class="btn p full" style="margin-top:14px" data-review="'+td[0].id+'">Start review · '+td.length+' trade'+(td.length>1?'s':'')+'</button>')}
function nextReview(){var n=todo()[0];if(n)setTimeout(function(){reviewForm(n.id)},350)}

/* ---------------- YOU ---------------- */
var LKEY='sp-learn-2026-11-12',lrnI=0;
function learned(){return store.get(LKEY,[])}
function rYou(){var s=$('#s-you'),p=profile(),S=D.streak,lr=learned(),x=LEARN[lrnI],th=root.getAttribute('data-theme')||'dark',got=lr.indexOf(x.id)>=0,all=lr.length>=LEARN.length;
  s.innerHTML=top('You')+
    '<div class="prof"><span class="av">T</span><div><b>Trader</b><small>Your screen: '+presetName()+' · <button type="button" class="l" style="color:var(--link);font-weight:600" data-act="setup">Change</button></small></div></div>'+
    '<a class="card ylink" href="#rewards"><span class="fl" aria-hidden="true">🔥</span><span class="tx"><b>'+streakNow()+'-day streak</b><small>🎁 '+freeDays()+' free days · ⭐ '+seasonScore()+' pts · 🏅 '+BADGES.filter(bGot).length+' badges</small></span><span class="go" aria-hidden="true">›</span></a>'+
    '<div class="h2" id="tools"><h2>Tools</h2></div><div class="card" style="padding:0 16px"><div class="list">'+
      [[L.bt,ICO.bt,'i','Backtesting','Replay past days, candle by candle',1],[L.screener,ICO.scan,'a','Screener','Scan Nifty 500 stocks',0],[L.studio,ICO.studio,'b','Option Studio','Option chain and strategies',0],[L.baskets,ICO.bk,'t','Baskets','Build and track baskets',0],[L.lms,ICO.lms,'i','LMS','Courses and lessons',0],[L.brief,ICO.brief,'b','Full brief','Read today’s brief on the web',0]]
      .map(function(r){return '<a class="row" href="'+r[0]+'"'+(r[5]?' target="_blank" rel="noopener"':'')+'><span class="ic '+r[2]+'">'+I(r[1])+'</span><span class="tx"><b>'+r[3]+'</b><small>'+r[4]+'</small></span><span class="go" aria-hidden="true">'+(r[5]?I(ICO.ext):'›')+'</span></a>'}).join('')+'</div></div>'+
    '<div class="h2" id="settings"><h2>Settings</h2></div><div class="card"><div class="fld" style="margin:0"><span>Theme</span><div class="seg" role="group" aria-label="Theme">'+[['dark','Dark'],['light','Light']].map(function(t){return '<button type="button" data-theme-set="'+t[0]+'" aria-pressed="'+(th===t[0])+'">'+t[1]+'</button>'}).join('')+'</div></div>'+
      '<div class="list" style="margin-top:8px"><button type="button" class="row" data-act="setup"><span class="ic i">'+I(ICO.setup)+'</span><span class="tx"><b>Change my screen</b><small>Answer the 3 questions again</small></span><span class="go">›</span></button>'+
      (PRO_LOCK?(store.get('ap-pro',0)?'<button type="button" class="row" data-act="prolock"><span class="ic a">'+I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>')+'</span><span class="tx"><b>Show the free view</b><small>Lock live calls again (demo)</small></span></button>':'<button type="button" class="row" data-act="pro"><span class="ic a">'+I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>')+'</span><span class="tx"><b>AlphaPad Pro</b><small>Unlock live trade calls</small></span><span class="go">›</span></button>'):'')+
      '<button type="button" class="row rst" id="rstB"><span class="ic s">'+I(ICO.reset)+'</span><span class="tx"><b>Start fresh</b><small id="rstS">Clears everything saved on this device</small></span></button></div></div>'+
    '<p class="note">AlphaPad by Springpad. Analysis, not investment advice. Prototype with sample data.</p>'}

/* ---------------- rewards: streak freezes, milestones, badges, seasons, free days ----------------
   Sample history before today (prototype). Everything done today is added live on top. */
var HIST={total:34,longest:23,freezes:1,season:238,weeks:6,week:34,lastWeek:60};
function reviewsOk(){var rv=store.get('ap-journal-review',{});return Object.keys(rv).map(function(k){return rv[k]}).filter(function(r){return r&&r.status==='ok'})}
function planKept(){return reviewsOk().filter(function(r){return r.rules&&RULES.every(function(x){return r.rules[x[0]]})}).length}
function allDone(){return mDone()===goals().length}
function totalDays(){return HIST.total+(allDone()?1:0)}
function longest(){return Math.max(HIST.longest,streakNow())}
function freezes(){return Math.min(2,HIST.freezes+(streakNow()>=7&&D.streak.n<7?1:0))}
var MILES=[[3,'Getting started','First badge'],[7,'Week regular','+1 streak freeze'],[21,'Habit formed','+2 free days and a group session with the RA'],[50,'Committed','+3 free days and advanced backtest templates'],[100,'Market habit','+5 free days and a 1-on-1 call with a SEBI-registered RA']];
/* id, icon, name, how to earn, progress() -> [have, need], free days it adds */
var BADGES=[
  ['start','🌱','Getting started','Finish 3 market mornings',function(){return [totalDays(),3]},0],
  ['week','📅','Week regular','Reach a 7-day streak',function(){return [longest(),7]},0],
  ['habit','🧠','Habit formed','Finish 21 market mornings',function(){return [totalDays(),21]},0],
  ['comeback','💪','Comeback','Come back after a break and finish 5 mornings in a row',function(){return [streakNow(),5]},0],
  ['review','📝','Reviewer','Review every trade for a whole week',function(){return [1,1]},0],
  ['early','🌅','Early bird','Hear the brief before 9:15 on 10 days',function(){return [10,10]},0],
  ['plan','🎯','Plan keeper','Follow all 5 rules on 10 reviewed trades',function(){return [7+planKept(),10]},1],
  ['learner','📚','Learner','Learn all 3 ideas on 10 days',function(){return [9+(learned().length>=LEARN.length?1:0),10]},0],
  ['stop','🛡️','Stop-loss always','Set a stop-loss before entry on every trade for a week',function(){return [3,5]},1],
  ['fifty','⭐','Committed','Finish 50 market mornings',function(){return [totalDays(),50]},0],
  ['hund','🏆','Market habit','Finish 100 market mornings',function(){return [totalDays(),100]},0],
  ['hof','👑','Hall of Fame','Get featured in a Monday shoutout',function(){return [0,1]},0]];
function bp(b){var p=b[4]();return [Math.min(p[0],p[1]),p[1]]}
function bGot(b){var p=bp(b);return p[0]>=p[1]}
function freeLog(){var fw=Math.floor(HIST.weeks/2),l=[];if(fw)l.push(['Full weeks of mornings',fw,HIST.weeks+' full weeks · 1 day per 2 weeks']);if(totalDays()>=21)l.push(['21-day milestone',2,'Habit formed']);
  if(totalDays()>=50)l.push(['50-day milestone',3,'Committed']);if(totalDays()>=100)l.push(['100-day milestone',5,'Market habit']);
  BADGES.forEach(function(b){if(b[5]&&bGot(b))l.push([b[2]+' badge',b[5],'Badge reward'])});return l}
var FD_MAX=7;
function freeDays(){return Math.min(FD_MAX,freeLog().reduce(function(a,x){return a+x[1]},0))}
function seasonLive(){var p=[],r=reviewsOk().length,l=learned().length,k=planKept();
  if(allDone())p.push(['Full morning today',10]);if(r)p.push(['Trades reviewed × '+r,5*r]);if(l)p.push(['Ideas learned × '+l,5*l]);if(k)p.push(['Trades on plan × '+k,5*k]);return p}
function liveSum(){return seasonLive().reduce(function(a,x){return a+x[1]},0)}
function seasonScore(){return HIST.season+liveSum()}
var BOARD=[['Aarav S.',412],['Meera K.',389],['Rohan P.',366],['Ishita R.',341],['Kabir M.',330],['Ananya D.',318],['Vikram T.',305],['Sneha J.',296],['Arjun N.',281],['Pooja V.',270],['Dev B.',262],['Nikhil A.',251],['Riya G.',229],['Karan L.',214],['Tanvi H.',198],['Sahil C.',176],['Meghna P.',153],['Omkar R.',121]];
var TIERS=[['gold','Gold',300],['silver','Silver',200],['bronze','Bronze',100],['start','Starter',0]];
function tierOf(v){for(var i=0;i<TIERS.length;i++)if(v>=TIERS[i][2])return i;return TIERS.length-1}
function myRank(){var v=seasonScore();return BOARD.filter(function(x){return x[1]>v}).length+1}
var SEASON={name:'November season',ends:'30 Nov',left:18,players:'1,284'};
var SHOUT={week:'2–6 Nov',cat:'Most consistent',why:'Everyone who finished every market morning last week',names:['Meera K.','Rohan P.','Ishita R.','Aditya S.','Farah Q.','Gaurav M.','Lakshmi V.','Neel D.'],more:37};
var ROT=['Most consistent','Most improved','Best reviewer','Best learner'];
var HOF=[['Aarav S.','Most consistent','26–30 Oct'],['Kabir M.','Best reviewer','19–23 Oct'],['Ananya D.','Most improved','12–16 Oct'],['Vikram T.','Best learner','5–9 Oct']];
function tierPill(i){return '<span class="tier '+TIERS[i][0]+'"><i aria-hidden="true"></i>'+TIERS[i][1]+'</span>'}

function freeHTML(){var n=freeDays(),stops=[[2,'2 days'],[5,'5 days'],[7,'Week free']],nx=stops.filter(function(s){return n<s[0]})[0];
  return '<section class="sec" id="rewards"><div class="h2"><h2>Free days</h2><span class="sp"></span><small>Renews 2 Dec</small></div><div class="card fd">'+
    '<div class="fdh"><b>'+n+'</b><span>free days earned this month<br><span class="muted">'+(nx?(nx[0]-n)+' more to reach '+nx[1].toLowerCase():'A full week free on next month’s subscription')+'</span></span></div>'+
    '<div class="fdt" role="img" aria-label="'+n+' of '+FD_MAX+' free days"><div class="fdbar"><i style="width:'+(n/FD_MAX*100).toFixed(1)+'%"></i></div>'+stops.map(function(s){return '<span class="stop'+(n>=s[0]?' got':'')+'" style="left:'+(s[0]/FD_MAX*100).toFixed(1)+'%"><i></i><b>'+s[0]+'</b><small>'+s[1]+'</small></span>'}).join('')+'</div>'+
    (function(){var L=freeLog(),raw=L.reduce(function(a,x){return a+x[1]},0);
      return '<ul class="fdl">'+L.map(function(x){return '<li><span><b>'+esc(x[0])+'</b><small>'+esc(x[2])+'</small></span><em>+'+x[1]+' day'+(x[1]>1?'s':'')+'</em></li>'}).join('')+
        '<li class="fdtot"><span><b>Total this month</b><small>'+(raw>FD_MAX?'You earned '+raw+'; the most per month is '+FD_MAX:'Up to '+FD_MAX+' days (1 week) per month')+'</small></span><em>'+n+' of '+FD_MAX+' days</em></li></ul>'})()+
    '<p class="cap">At most 1 extra week for every month you pay for. Free days can only be used on next month’s subscription: they are added when you renew on 2 Dec and lapse if you don’t renew.</p></div></section>'}

function streakHTML(){var S=D.streak,f=freezes(),t=totalDays(),nm=MILES.filter(function(m){return t<m[0]})[0];
  return '<section class="sec" id="streak"><div class="h2"><h2>Streak</h2><span class="sp"></span><small>Market days only</small></div><div class="card stk"><div class="n"><b>🔥 '+streakNow()+'</b><span>market days in a row<br><span class="muted">Longest '+longest()+' · weekends and holidays never count</span></span></div>'+
    '<div class="wk">'+S.week.map(function(d){return '<span class="'+d[1]+'"><i title="'+({done:'Done',hol:'Market holiday',today:'Today',off:'Weekend','':'Coming up'})[d[1]]+'">'+(d[1]==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'+
    '<div class="frz"><span class="fz">'+[0,1].map(function(i){return '<i class="'+(i<f?'on':'')+'" aria-hidden="true">🧊</i>'}).join('')+'</span><span><b>'+f+' of 2 freezes ready</b><small>A missed day uses one. Earn one every 7 days. Missed and no freeze? Do both mornings within 24 hours to repair it.</small></span></div></div>'+
    '<div class="h2 sm"><h3>Milestones</h3><span class="sp"></span><small>'+t+' mornings done</small></div><ol class="ladder card">'+MILES.map(function(m){var g=t>=m[0],cur=m===nm;return '<li class="'+(g?'got':'')+(cur?' cur':'')+'"><i aria-hidden="true">'+(g?'✓':m[0])+'</i><span><b>'+m[0]+' days · '+m[1]+'</b><small>'+m[2]+'</small>'+(cur?'<span class="lbar"><em style="width:'+(t/m[0]*100).toFixed(0)+'%"></em></span><small class="muted">'+(m[0]-t)+' to go</small>':'')+'</span></li>'}).join('')+'</ol>'+
    '<p class="cap">Milestones count every morning you finish, so a broken streak never takes them away.</p></section>'}

function seasonHTML(){var v=seasonScore(),ti=tierOf(v),nx=ti>0?TIERS[ti-1]:null,live=seasonLive(),gold=BOARD.filter(function(x){return x[1]>=300});
  if(v>=300)gold=gold.concat([['You',v]]).sort(function(a,b){return b[1]-a[1]});
  var wk=HIST.week+liveSum();
  return '<section class="sec" id="season"><div class="h2"><h2>Season</h2><span class="sp"></span><small>'+SEASON.left+' days left</small></div><div class="card sea">'+
    '<div class="seh"><div><span class="eb">'+SEASON.name+'</span><b>'+v+'</b><small>points · #'+myRank()+' of '+SEASON.players+'</small></div>'+tierPill(ti)+'</div>'+
    (nx?'<div class="tb"><span class="lbar"><em style="width:'+((v-TIERS[ti][2])/(nx[2]-TIERS[ti][2])*100).toFixed(0)+'%"></em></span><small>'+(nx[2]-v)+' points to '+nx[1]+'</small></div>':'<div class="tb"><small>Top tier. Everyone in Gold is named on the board.</small></div>')+
    '<ul class="fdl"><li><span><b>Before today</b><small>1–11 Nov</small></span><em>'+HIST.season+'</em></li>'+live.map(function(x){return '<li><span><b>'+esc(x[0])+'</b><small>Today</small></span><em>+'+x[1]+'</em></li>'}).join('')+'</ul>'+
    '<p class="cap">+10 full morning · +5 each trade reviewed · +5 each idea learned · +5 each trade on plan. Points never come from profit or how much you trade. Resets on 1 Dec; badges and free days stay.</p>'+
    '<div class="gold"><span class="eb">In Gold this season · '+gold.length+'</span><div class="names">'+gold.map(function(x){return '<span class="nmc'+(x[0]==='You'?' me':'')+'">'+esc(x[0])+'</span>'}).join('')+'</div></div>'+
    '<button type="button" class="btn g s full" data-act="board">See every tier</button></div>'+
    '<div class="card sho"><span class="eb">Monday shoutout · '+SHOUT.week+'</span><h3>'+SHOUT.cat+'</h3><p class="muted">'+SHOUT.why+'</p><div class="names">'+SHOUT.names.map(function(x){return '<span class="nmc">'+esc(x)+'</span>'}).join('')+'<span class="nmc more">+'+SHOUT.more+' more</span></div>'+
      '<div class="rot" aria-label="Category rotation">'+ROT.map(function(r,i){return '<span class="'+(i===0?'now':i===1?'next':'')+'">'+r+(i===1?' · next':'')+'</span>'}).join('')+'</div>'+
      '<div class="qual"><b>Next Monday, 16 Nov: Most improved</b><small>Beat last week’s '+HIST.lastWeek+' points to be named. You have '+wk+' so far this week.</small><span class="lbar"><em style="width:'+Math.min(100,wk/HIST.lastWeek*100).toFixed(0)+'%"></em></span></div>'+
      '<div class="hof"><span class="eb">Hall of Fame</span>'+HOF.map(function(h){return '<div><i aria-hidden="true">👑</i><b>'+esc(h[0])+'</b><small>'+h[1]+' · '+h[2]+'</small></div>'}).join('')+'</div>'+
      '<p class="cap">Anyone featured rests for 4 weeks and moves to the Hall of Fame, so new names get a turn.</p></div></section>'}

function badgesHTML(){var got=BADGES.filter(bGot).length;
  return '<section class="sec" id="badges"><div class="h2"><h2>Badges</h2><span class="sp"></span><small>'+got+' of '+BADGES.length+'</small></div><div class="bdg">'+
    BADGES.map(function(b){var p=bp(b),g=p[0]>=p[1];return '<button type="button" class="bd'+(g?' got':'')+'" data-badge="'+b[0]+'" aria-label="'+esc(b[2])+(g?', earned':', '+p[0]+' of '+p[1])+'"><span class="be" aria-hidden="true">'+b[1]+'</span><b>'+b[2]+'</b>'+(g?'<small>Earned</small>':'<span class="lbar"><em style="width:'+(p[0]/p[1]*100).toFixed(0)+'%"></em></span>')+'</button>'}).join('')+'</div></section>'}

function badgeSheet(id){var b=BADGES.filter(function(x){return x[0]===id})[0];if(!b)return;var p=bp(b),g=p[0]>=p[1];
  sheet(b[1]+' '+b[2],'<p>'+b[3]+'.</p><div class="facts"><div>Progress<b>'+p[0]+' of '+p[1]+'</b></div><div>Status<b>'+(g?'Earned':'In progress')+'</b></div><div>Reward<b>'+(b[5]?'+'+b[5]+' free day':'Badge')+'</b></div></div>'+
    (g?'':'<span class="lbar" style="margin-top:10px"><em style="width:'+(p[0]/p[1]*100).toFixed(0)+'%"></em></span>'))}

function boardSheet(){var v=seasonScore(),all=BOARD.concat([['You',v]]).sort(function(a,b){return b[1]-a[1]});
  sheet(SEASON.name,'<p class="muted">Everyone who reaches a tier is listed in it. Ends '+SEASON.ends+'.</p>'+TIERS.map(function(t,i){var hi=i?TIERS[i-1][2]:1e9,ps=all.filter(function(x){return x[1]>=t[2]&&x[1]<hi});if(!ps.length)return '';
    return '<div class="tg">'+tierPill(i)+'<small>'+t[2]+'+ points</small></div><div class="list">'+ps.map(function(x){return '<div class="row'+(x[0]==='You'?' me':'')+'"><span class="tx"><b>'+esc(x[0])+'</b></span><span class="vl">'+x[1]+'</span></div>'}).join('')+'</div>'}).join('')+
    '<p class="cap">Sample names for the prototype.</p>')}

function mfootHTML(){var v=seasonScore();return '<a class="mfoot" href="#rewards"><span>⭐ <b>'+v+'</b> pts</span><span>#'+myRank()+' · '+TIERS[tierOf(v)][1]+'</span><span>🎁 <b>'+freeDays()+'</b> free days</span><span class="go" aria-hidden="true">›</span></a>'}

/* ---------------- streak sheet + global clicks ---------------- */
/* ---------------- streak hero (top of Today) + Streak & rewards screen ---------------- */
var wasAll=null;
function weekHTML(){return '<div class="wk">'+D.streak.week.map(function(d,i){var st=d[1];if(st==='today'&&allDone())st='done';return '<span class="'+st+'"><i>'+(st==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'}
function heroHTML(){var g=goals(),d=mDone(),all=d===g.length;
  return '<a class="spill'+(all?' all':'')+'" id="hero" href="#rewards" aria-label="'+streakNow()+' day streak, '+d+' of '+g.length+' steps done today. Open streak and rewards"><span class="sring" style="--p:'+(d/g.length*100).toFixed(0)+'"><span aria-hidden="true">🔥</span></span><b>'+streakNow()+'</b><small>day streak</small><em aria-hidden="true">›</em></a>'}
function paintHero(){var h=$('#hero');if(!h)return;var all=allDone(),t=document.createElement('div');t.innerHTML=heroHTML();var n=t.firstChild;if(wasAll===false&&all)n.classList.add('win');h.replaceWith(n);wasAll=all}
function strip(h){return h.replace(/<div class="h2"><h2>[^<]*<\/h2><span class="sp"><\/span><small>[^<]*<\/small><\/div>/,'')}
function tileSheet(k){
  if(k==='free')return sheet('🎁 Free days',strip(freeHTML()));
  if(k==='season'||k==='shout'){var h=strip(seasonHTML()),i=h.indexOf('<div class="card sho">');return k==='season'?sheet('⭐ '+SEASON.name,h.slice(0,i)+'</section>'):sheet('📣 Monday shoutout','<section>'+h.slice(i))}
  if(k==='badges')return sheet('🏅 Badges',strip(badgesHTML()));
  if(k==='miles'){var s=streakHTML(),a=s.indexOf('<ol class="ladder'),b=s.indexOf('</ol>')+5;return sheet('🏁 Milestones','<p>'+totalDays()+' market mornings done. Breaking a streak never takes these away.</p>'+s.slice(a,b))}
  if(k==='freeze')return sheet('🧊 Streak freezes','<p>A missed market day uses a freeze, so your streak survives. You earn one every 7 days and can hold 2.</p><p>No freeze left? Do both mornings within 24 hours to repair the streak.</p><div class="facts"><div>Ready<b>'+freezes()+' of 2</b></div><div>Longest<b>'+longest()+' days</b></div><div>Counts<b>Market days</b></div></div>')}
function rRewards(){var s=$('#s-rewards'),v=seasonScore(),ti=tierOf(v),t=totalDays(),nm=MILES.filter(function(m){return t<m[0]})[0],fd=freeDays(),bs=BADGES.slice().sort(function(a,b){return bGot(b)-bGot(a)}),bg=BADGES.filter(bGot).length,nx=ti>0?TIERS[ti-1]:null;
  var tile=function(k,ic,lab,val,sub,p){return '<button type="button" class="rt" data-tile="'+k+'"><span class="eb">'+ic+' '+lab+'</span><b>'+val+'</b><small>'+sub+'</small><span class="lbar"><em style="width:'+Math.min(100,p*100).toFixed(0)+'%"></em></span></button>'};
  s.innerHTML='<header class="top"><a class="bk" href="#today" data-back aria-label="Back">‹</a><h1>Streak & rewards</h1><span class="sp"></span></header>'+
    '<div class="rhead"><span class="fl" aria-hidden="true">🔥</span><b>'+streakNow()+'</b><small>day streak · longest '+longest()+'</small>'+weekHTML()+
      '<button type="button" class="frl" data-tile="freeze">'+[0,1].map(function(i){return '<i class="'+(i<freezes()?'on':'')+'">🧊</i>'}).join('')+' '+freezes()+' of 2 freezes ready <em>›</em></button></div>'+
    '<div class="rgrid">'+
      tile('free','🎁','Free days',fd,'of '+FD_MAX+' · for your Dec subscription',fd/FD_MAX)+
      tile('season','⭐','Season',v+' <span class="tier '+TIERS[ti][0]+'"><i></i>'+TIERS[ti][1]+'</span>',nx?(nx[2]-v)+' pts to '+nx[1]+' · #'+myRank():'#'+myRank()+' · top tier',nx?(v-TIERS[ti][2])/(nx[2]-TIERS[ti][2]):1)+
      tile('miles','🏁','Next milestone',nm?nm[0]+' days':'All done',nm?(nm[0]-t)+' to go · '+nm[2].split(' and ')[0]:'You reached 100',nm?t/nm[0]:1)+
      tile('badges','🏅','Badges',bg+' <small>of '+BADGES.length+'</small>','Tap to see what’s next',bg/BADGES.length)+'</div>'+
    '<div class="h2"><h2>Badges</h2><span class="sp"></span><button type="button" class="l" data-tile="badges">See all</button></div><div class="brow">'+bs.map(function(b){var g=bGot(b);return '<button type="button" class="bc'+(g?' got':'')+'" data-badge="'+b[0]+'"><span aria-hidden="true">'+b[1]+'</span><small>'+b[2]+'</small></button>'}).join('')+'</div>'+
    '<button type="button" class="shl" data-tile="shout"><span class="eb">📣 Monday shoutout</span><b>'+SHOUT.cat+': '+SHOUT.names.slice(0,2).join(', ')+' +'+(SHOUT.names.length-2+SHOUT.more)+'</b><small>Next Monday: Most improved. Beat last week’s '+HIST.lastWeek+' pts to be named.</small></button>'+
    '<p class="note">Rewards come from habits, never from profit or how much you trade.</p>';}
function streakSheet(){var S=D.streak,lr=learned();sheet('\uD83D\uDD25 '+streakNow()+'-day streak','<p>Finish your morning on each market day to keep it going. Weekends and market holidays never count.</p><div class="wk" style="margin:6px 0 16px">'+S.week.map(function(d){return '<span class="'+d[1]+'"><i>'+(d[1]==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'+
  '<div class="facts"><div>Freezes<b>'+freezes()+' of 2</b></div><div>Longest<b>'+longest()+' days</b></div><div>Morning<b>'+mDone()+' of '+goals().length+'</b></div></div><a class="btn p full" style="margin-top:14px" href="#today" data-close data-act="tomorning">'+(mDone()===goals().length?'Morning done for today':'Finish your morning')+'</a><a class="btn g full" style="margin-top:8px" href="#rewards" data-close>Free days, badges and season</a>')}
document.addEventListener('click',function(e){var a=e.target.closest('[data-act],[data-info],[data-jump],[data-ix],[data-mv],[data-fl],[data-jt],[data-inv],[data-goal],[data-sc],[data-ct],[data-review],[data-trade],[data-day],[data-m],[data-lrn],[data-got],[data-theme-set],[data-tr],[data-cl],[data-badge],[data-tile],[data-back],[data-call],[data-sub-go]');if(!a)return;var ds=a.dataset;
  if(ds.call!=null)setTimeout(function(){var tr=$('#tcTr');if(tr&&tr.children[+ds.call])tr.scrollTo({left:tr.children[+ds.call].offsetLeft-tr.firstChild.offsetLeft,behavior:'smooth'})},450);
  if(ds.subGo){var spot=a.getAttribute('data-spot');if(spot!=null)setTimeout(function(){var el=document.getElementById('spot-'+spot);if(el){var y=el.getBoundingClientRect().top+scrollY-150;window.scrollTo({top:y,behavior:'smooth'});el.classList.add('flash');setTimeout(function(){el.classList.remove('flash')},1200)}},60);var bs=$$('#s-'+tab+' .subbar button'),a1=bs.findIndex(function(b){return b.hasAttribute('aria-current')}),a2=bs.findIndex(function(b){return b.dataset.subGo===ds.subGo});subDir=a2>a1?'r':'l';subSel[tab]=ds.subGo;RENDER[tab]();window.scrollTo({top:0,behavior:'smooth'});return}
  if(ds.tile){closeSheet();return tileSheet(ds.tile)}
  if(a.hasAttribute('data-back')){e.preventDefault();location.hash=(tab==='ipos'&&subSec!=null&&/^#(markets\/)?ipos$/.test(backH))?backH:(PAGES.indexOf(prevH.slice(1).split('/')[0])>=0?'#today':prevH);return}
  if(ds.badge)return badgeSheet(ds.badge);
  if(ds.act==='board')return boardSheet();
  if(ds.act==='listen')return toggleAudio();
  if(ds.act==='chapters'){e.preventDefault();return chapters()}
  if(ds.act==='streak')return;
  if(ds.act==='pro')return proSheet();
  if(ds.act==='ovw')return openOvw();
  if(ds.act==='jrev')return jRevSheet();
  if(ds.act==='record'){e.preventDefault();return recSheet()}
  if(ds.act==='iporec'){e.preventDefault();return ipoRecSheet()}
  if(ds.act==='ixpick')return sheet('Choose an index','<div class="list ixl">'+IDX.map(function(i){var v=i.d[i.d.length-1][1];return '<button type="button" class="row'+(i.n===ixSel?' on':'')+'" data-ix="'+esc(i.n)+'" data-close><span class="tx"><b>'+esc(ixShort(i.n))+'</b><small>'+num(v,2)+'</small></span><span class="vl '+(i.vix?'w':i.up?'u':'d')+'">'+i.pct+'</span>'+(i.n===ixSel?'<span class="ck" aria-hidden="true">✓</span>':'')+'</button>'}).join('')+'</div>');
  if(ds.act==='prook'){store.set('ap-pro',1);closeSheet();toast('Pro unlocked on this device');RENDER[tab]();return}
  if(ds.act==='prolock'){try{localStorage.removeItem('ap-pro')}catch(e){}toast('Showing the free view again');RENDER[tab]();return}
  if(ds.act==='tomorning'){setTimeout(function(){var c=$('#morning');if(c)c.scrollIntoView({block:'center',behavior:'smooth'})},80);return}
  if(ds.act==='setup'){closeSheet();onboard();return}
  if(ds.act==='others'){var o=D.sotd.others;return sheet('Also near 52-week highs','<div class="list">'+o.map(function(x){return '<div class="row"><span class="tx"><b>'+esc(x[0])+'</b><small>'+esc(x[1])+' · '+esc(x[3])+'</small></span><span class="vl u">+'+x[2].toFixed(2)+'%</span></div>'}).join('')+'</div>')}
  if(ds.info){var t=INFO_TXT[ds.info];return info(t[0],t[1],t[2])}
  if(ds.jump){var el=document.getElementById(ds.jump);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return}
  if(ds.ix&&a.tagName==='BUTTON'){ixSel=ds.ix;rMarkets();if(a.closest('.ixall'))window.scrollTo({top:0,behavior:'smooth'});return}
  if(ds.ix&&a.tagName==='A'){ixSel=ds.ix;return}
  if(ds.jt){jTF=ds.jt;var y8=scrollY;rJournal();applySub('journal','trades');scrollTo(0,y8);return}
  if(ds.inv){invSeg=ds.inv;var y9=scrollY;rMarkets();applySub('markets','invest');scrollTo(0,y9);return}
  if(ds.goal!=null)return goalSheet(+ds.goal);
  if(ds.mv){mvSeg=ds.mv;var y=scrollY;rMarkets();scrollTo(0,y);return}
  if(ds.fl!=null){flSeg=+ds.fl;var y2=scrollY;rMarkets();flFade();scrollTo(0,y2);return}
  if(ds.sc){scSeg=ds.sc;var y2=scrollY;rMarkets();scrollTo(0,y2);return}
  if(ds.ct){calType=ds.ct;var y3=scrollY;rMarkets();scrollTo(0,y3);return}
  if(ds.tr){trF=ds.tr;var pn=$('#sheetPn'),st=pn?pn.scrollTop:0;recSheet();var pn2=$('#sheetPn');if(pn2)pn2.scrollTop=st;return}
  if(ds.cl){recFrom=!!a.closest('#sheetPn .trk,#sheetPn');return openClosed(+ds.cl)}
  if(ds.review)return reviewForm(ds.review);
  if(ds.trade)return openTrade(+ds.trade);
  if(ds.day)return openDay(ds.day);
  if(ds.m){var ms=MONTHS(),i=ms.indexOf(jMonth)+ +ds.m;if(i>=0&&i<ms.length){jMonth=ms[i];jDay=null;rJournal()}return}
  if(ds.lrn){lrnI=(lrnI+ +ds.lrn+LEARN.length)%LEARN.length;var y4=scrollY;rYou();scrollTo(0,y4);return}
  if(ds.got){var l=learned();if(l.indexOf(ds.got)<0)l.push(ds.got);store.set(LKEY,l);var nx=LEARN.findIndex(function(x){return l.indexOf(x.id)<0});if(nx>=0)lrnI=nx;var y5=scrollY;rIdeas();applySub('ideas','learn');scrollTo(0,y5);setTimeout(function(){var c=$$('#s-ideas .lnt .lc')[nx];if(c&&nx>=0)window.scrollTo({top:c.getBoundingClientRect().top+scrollY-150,behavior:'smooth'})},200);if(typeof paintMorning==='function')paintMorning();toast(l.length>=LEARN.length?'All 3 learned. Streak kept for today.':(LEARN.length-l.length)+' left to keep your streak');return}
  if(ds.themeSet){root.setAttribute('data-theme',ds.themeSet);store.set('today-theme',ds.themeSet);try{localStorage.setItem('today-theme',ds.themeSet)}catch(err){}var y6=scrollY;rYou();scrollTo(0,y6);return}
});
var armed=0;document.addEventListener('click',function(e){var b=e.target.closest('#rstB');if(!b)return;
  if(Date.now()-armed>4000){armed=Date.now();b.classList.add('arm');$('#rstS').textContent='Tap again to confirm';setTimeout(function(){if(Date.now()-armed>=4000&&$('#rstS')){b.classList.remove('arm');$('#rstS').textContent='Clears everything saved on this device'}},4100);return}
  try{Object.keys(localStorage).forEach(function(k){if(/^(ap-|sp-|today-)/.test(k))localStorage.removeItem(k)})}catch(err){}location.replace(location.pathname)});
/* the questions finish → refresh what depends on the chosen screen */

/* ---------------- top tabs: they change with the bottom tab and show one part of the screen at a time ----------------
   Each entry: key, label, icon, and where that part starts on the screen ('h2:Title' = the heading with that title). */
var SUBS={
  today:[['home','Home','home','.hello'],['spot','Spotlight','star','h2:Spotlight'],['foryou','For you','you','h2:For you']],
  markets:[['indices','Indices','markets','#indices'],['movers','Movers','mv','#movers'],['invest','Invest','ipo','#invest'],['filings','News','file','#filings']],
  ideas:[['sd','Pick','sd','#sd'],['calls','Calls','tc','#calls'],['baskets','Baskets','bk','#baskets'],['learn','Learn','learn','#learn']],
  journal:[['overview','Overview','chart','.jrv'],['insights','Insights','bulb','h2:Insights'],['trades','Trades','list','h2:Trades']]};
var SUBDESC={home:'Everything for today in one place',brief:'Listen or read in five minutes',spot:'Stock of the day and the big moves',foryou:'Picked for your setup',
  indices:'Nifty, Bank Nifty, VIX and F&O levels',movers:'Gainers, losers, OI build-up and scans',invest:'Mutual funds, SIP goals and IPOs',filings:'Filings, results and the calendar',cal:'Events and timings today',
  sd:'Today’s stock of the day and why',calls:'Active calls from the desk',record:'Every closed call, wins and losses',baskets:'Ready-made stock baskets',
  review:'Tag today’s trades in a minute',overview:'P&L, win rate and calendar',insights:'Patterns and your plan score',trades:'Every trade, one by one',
  profile:'Your streak, rewards and badges',learn:'Three short ideas a day',tools:'Backtesting, screener and more',settings:'Theme and your screen'};
var SHOWALL={},subSel={};
function subStart(c,m){if(m.slice(0,3)==='h2:')return c.classList.contains('h2')&&(c.textContent||'').trim().indexOf(m.slice(3))===0;return c.matches(m)}
var subInd={},subDir='';
function applySub(t,sec){var defs=SUBS[t],scr=$('#s-'+t);if(!defs||!scr)return;var old=$('.subbar',scr);if(old)old.remove();
  var kids=[].slice.call(scr.children),grp=null,found={},cur=null;
  kids.forEach(function(c){if(c.tagName==='HEADER')return;var d=defs.filter(function(x){return subStart(c,x[3])})[0];if(d){cur=d[0];found[cur]=1}
    c.dataset.sub=(c.classList.contains('note')||c.classList.contains('tick'))?'*':(cur||'-')});
  var live=defs.filter(function(x){return found[x[0]]});if(!live.length)return;
  if(sec&&found[sec])subSel[t]=sec;else if(sec){var el=document.getElementById(sec);if(el){var host=kids.filter(function(c){return c===el||c.contains(el)})[0];if(host&&host.dataset.sub&&found[host.dataset.sub])subSel[t]=host.dataset.sub}}
  if(!subSel[t]||!found[subSel[t]])subSel[t]=live[0][0];
  var k=subSel[t],all=SHOWALL[t]===k;
  kids.forEach(function(c){if(c.tagName==='HEADER')return;var g=c.dataset.sub;c.classList.toggle('sub-off',!(g==='*'||(all&&g!=='-')||g===k));c.classList.remove('ssl-r','ssl-l');if(subDir&&!c.classList.contains('sub-off')){void c.offsetWidth;c.classList.add('ssl-'+subDir)}});subDir='';
  var bar=document.createElement('nav');bar.className='subbar';bar.setAttribute('aria-label','Sections');
  bar.innerHTML='<div class="sbt"><i class="ind" aria-hidden="true"></i>'+live.map(function(x){return '<button type="button" data-sub-go="'+x[0]+'"'+(x[0]===k?' aria-current="true"':'')+'>'+I(ICO[x[2]]||ICO.today,2)+'<span>'+x[1]+'</span></button>'}).join('')+'</div>';
  var hd=$('header',scr),tk=hd&&hd.nextElementSibling&&hd.nextElementSibling.classList.contains('tick')?hd.nextElementSibling:hd;if(tk)tk.after(bar);else scr.prepend(bar);
  var on=$('[aria-current]',bar),ind=$('.ind',bar),pv=subInd[t];
  if(on){var to={x:on.offsetLeft,w:on.offsetWidth};if(pv){ind.style.transition='none';ind.style.transform='translateX('+pv.x+'px)';ind.style.width=pv.w+'px';ind.offsetWidth;ind.style.transition=''}
    ind.style.transform='translateX('+to.x+'px)';ind.style.width=to.w+'px';subInd[t]=to;
    bar.scrollLeft=Math.max(0,on.offsetLeft-bar.offsetWidth/2+on.offsetWidth/2)}
  var edge=function(){bar.classList.toggle('more-r',bar.scrollLeft+bar.clientWidth<bar.scrollWidth-6);bar.classList.toggle('more-l',bar.scrollLeft>6)};edge();bar.addEventListener('scroll',edge,{passive:true})
  if(t==='ideas'&&k==='calls')mark('calls')}
/* swipe left or right on a screen to move between its top tabs */
(function(){var x0=0,y0=0,t0=0,ok=false;
  document.addEventListener('touchstart',function(e){var tt=e.touches[0];ok=!!(SUBS[tab]&&!e.target.closest('.steps,.sp-tr,.spw,.chips,.subbar,.brow,.strip,.jcal,.seg,.sheet,input,textarea,select,[data-noswipe]'));x0=tt.clientX;y0=tt.clientY;t0=Date.now()},{passive:true});
  document.addEventListener('touchend',function(e){if(!ok)return;ok=false;var tt=e.changedTouches[0],dx=tt.clientX-x0,dy=tt.clientY-y0;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.6||Date.now()-t0>700)return;
    var bs=$$('#s-'+tab+' .subbar button'),cur=bs.findIndex(function(b){return b.hasAttribute('aria-current')}),n=cur+(dx<0?1:-1);if(cur<0||n<0||n>=bs.length)return;
    subSel[tab]=bs[n].dataset.subGo;subDir=dx<0?'r':'l';RENDER[tab]();window.scrollTo(0,0)},{passive:true})})();
[['today','rToday'],['markets','rMarkets'],['ideas','rIdeas'],['journal','rJournal'],['you','rYou']].forEach(function(x){var f={rToday:rToday,rMarkets:rMarkets,rIdeas:rIdeas,rJournal:rJournal,rYou:rYou}[x[1]],w=function(){f.apply(this,arguments);applySub(x[0],subSec);subSec=null};
  if(x[1]==='rToday')rToday=w;else if(x[1]==='rMarkets')rMarkets=w;else if(x[1]==='rIdeas')rIdeas=w;else if(x[1]==='rJournal')rJournal=w;else rYou=w});
var subSec=null;
var RENDER={today:rToday,markets:rMarkets,ideas:rIdeas,journal:rJournal,you:rYou,rewards:rRewards,ipos:rIpos};
if(!root.getAttribute('data-theme'))root.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
badge();route();paintAudio();
if(!profile()||/[?&]setup=1/.test(location.search))setTimeout(onboard,/[?&]nosplash/.test(location.search)?60:500);
})();
