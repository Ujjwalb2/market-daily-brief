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
app.innerHTML=TABS.map(function(t){return '<main class="scr" id="s-'+t[0]+'" aria-label="'+t[1]+'"></main>'}).join('')+
  '<div class="mini" id="mini" hidden><div><button type="button" class="pp" id="mPP" aria-label="Pause">❚❚</button><button type="button" class="tx" id="mOpen" aria-label="Open chapters"><b id="mCh"></b><small id="mT"></small></button><button type="button" class="x" id="mX" aria-label="Stop the brief">✕</button><i class="pr" id="mPr"></i></div></div>'+
  '<div class="tabs"><nav aria-label="App">'+TABS.map(function(t){return '<a href="#'+t[0]+'" data-tab="'+t[0]+'">'+I(ICO[t[0]],1.9)+'<span>'+t[1]+'</span>'+(t[0]==='journal'?'<span class="badge" id="jBadge" hidden></span>':'')+'</a>'}).join('')+'</nav></div>'+
  '<div class="sheet" id="sheet" hidden role="dialog" aria-modal="true"><div class="pn" id="sheetPn"></div></div><div class="toast" id="toast" role="status" hidden></div>';

var tab='today';
function route(){var h=(location.hash||'#today').slice(1).split('/'),t=h[0],sec=h[1];if(!TABS.some(function(x){return x[0]===t}))t='today';tab=t;
  $$('.scr').forEach(function(s){s.classList.toggle('on',s.id==='s-'+t)});$$('.tabs a').forEach(function(a){if(a.dataset.tab===t)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(t==='markets')mark('watch');if(t==='ideas'&&(sec==='calls'||!sec))mark('calls');
  RENDER[t]();if(sec){var el=document.getElementById(sec);if(el)setTimeout(function(){el.scrollIntoView({block:'start'})},30)}else window.scrollTo(0,0)}
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
function streakChip(){return '<button type="button" class="chip" data-act="streak" aria-label="'+D.streak.n+' day streak">🔥 '+D.streak.n+'</button>'}
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
  $('#mini').hidden=!(on||t>0);root.classList.toggle('playing',!$('#mini').hidden);
  $('#mCh').textContent=CH[i][0];$('#mT').textContent='Chapter '+(i+1)+' of '+CH.length+' · '+mmss(t)+' / '+mmss(d);$('#mPr').style.width=(t/d*100)+'%';
  $('#mPP').textContent=on?'❚❚':'▶';$('#mPP').setAttribute('aria-label',on?'Pause':'Play');
  $$('.play[data-act="listen"]').forEach(function(b){b.textContent=on?'\u275A\u275A':'\u25B6';b.setAttribute('aria-label',on?'Pause the brief':'Play the brief')});
  if($('#bpT')){$('#bpT').textContent=on?'Playing':t>0?'Paused \u00B7 '+mmss(t):'Listen';$('#bpS').textContent=t>0?'Chapter '+(i+1)+' \u00B7 '+CH[i][0]:'7 chapters';$('#bpBar').style.width=(t/d*100)+'%'}
  if(t>=20)mark('brief');
  var cs=$('#chs');if(cs)$$('.row',cs).forEach(function(r,j){r.classList.toggle('on',j===i)})}
function toggleAudio(){if(A.paused)A.play().catch(function(){toast('Audio could not start. Try again.')});else A.pause();paintAudio()}
['timeupdate','play','pause','loadedmetadata'].forEach(function(e){A.addEventListener(e,paintAudio)});A.addEventListener('ended',function(){A.currentTime=0;paintAudio()});
$('#mPP').onclick=toggleAudio;$('#mX').onclick=function(){A.pause();A.currentTime=0;paintAudio()};
$('#mOpen').onclick=chapters;
function chapters(){sheet('Today’s brief','<p>'+esc(D.head)+' '+esc(D.sub)+'</p><div class="list chs" id="chs">'+CH.map(function(c,j){return '<button type="button" class="row" data-ch="'+j+'"><span class="tx"><b>'+esc(c[0])+'</b><small>Chapter '+(j+1)+' · starts at '+mmss(c[1])+'</small></span><span class="go">▶</span></button>'}).join('')+'</div>'+
  '<a class="btn g full" style="margin-top:16px" href="'+L.brief+'">Read the full brief '+I(ICO.ext)+'</a>',function(p){p.addEventListener('click',function(e){var r=e.target.closest('[data-ch]');if(!r)return;A.currentTime=CH[+r.dataset.ch][1];A.play().catch(function(){});paintAudio()});paintAudio()})}

/* ---------------- shared bits ---------------- */
function spark(v,W,H,pad){pad=pad||3;var lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),r=(hi-lo)||1;return v.map(function(x,i){return (i*W/(v.length-1)).toFixed(1)+','+(H-pad-(x-lo)/r*(H-2*pad)).toFixed(1)}).join(' ')}
function bar(label,val,w,cls,right){return '<div class="br"><b>'+label+'</b><span class="vl '+(right||'')+'">'+val+'</span><span class="tr"><i class="'+(cls||'')+'" style="width:'+Math.max(2,Math.min(100,w)).toFixed(0)+'%"></i></span></div>'}
var now=new Date(),nowM=now.getHours()*60+now.getMinutes(),toM=function(t){var a=t.split(':');return +a[0]*60+ +a[1]};
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
function goals(){var p=profile();return p&&p.answers&&p.answers.goals&&p.answers.goals.length?p.answers.goals:defaultGoals(p&&p.answers)}
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
var STEP={
  brief:['Listen to the brief','7 chapters · '+mmss(D.audio.dur),function(){return !!mstate().brief},'@listen'],
  calls:['Check today’s calls',CALLS.length+' active · track record inside',function(){return !!mstate().calls},'#ideas/calls'],
  journal:['Review today’s trades',function(){var n=todo().length;return n?n+' fetched from your broker':'All reviewed'},function(){return todo().length===0},'#journal/review'],
  learn:['Learn 3 ideas',function(){var l=learned().length;return l+' of '+LEARN.length+' done'},function(){return learned().length>=LEARN.length},'#you/learn'],
  watch:['Check the market','Indices, F&O levels, filings',function(){return !!mstate().watch},'#markets']};
function mDone(){return goals().filter(function(k){return STEP[k][2]()}).length}
function streakNow(){return D.streak.n+(mDone()===goals().length?1:0)}
function morningHTML(){var g=goals(),d=mDone(),all=d===g.length,pct=d/g.length*100;
  return '<section class="card morning'+(all?' all':'')+'" id="morning" aria-labelledby="mH"><div class="mh"><div class="mring" style="--p:'+pct.toFixed(0)+'" aria-hidden="true"><b>'+d+'/'+g.length+'</b></div><div><h2 id="mH">'+(all?'Morning done 🔥 '+streakNow():'Your morning')+'</h2><small>'+(all?'+10 season points. See you tomorrow at 7:30.':(g.length-d)+' step'+(g.length-d>1?'s':'')+' left to keep your '+D.streak.n+'-day streak')+'</small></div></div>'+
    '<ol class="steps">'+g.map(function(k){var s=STEP[k],ok=s[2](),sub=typeof s[1]==='function'?s[1]():s[1];return '<li><a class="stp'+(ok?' ok':'')+'" href="'+(s[3][0]==='@'?'#today':s[3])+'"'+(s[3]==='@listen'?' data-act="listen"':'')+'><i aria-hidden="true">'+(ok?'✓':'')+'</i><span class="tx"><b>'+s[0]+'</b><small>'+sub+'</small></span><span class="go" aria-hidden="true">'+(ok?'':'›')+'</span><span class="sr">'+(ok?'done':'to do')+'</span></a></li>'}).join('')+'</ol>'+mfootHTML()+'</section>'}
function paintMorning(){var c=$('#morning');if(!c)return;var t=document.createElement('div');t.innerHTML=morningHTML();c.replaceWith(t.firstChild);var sc=$$('[data-act="streak"]');sc.forEach(function(b){b.innerHTML='🔥 '+streakNow()})}

/* ---------------- TODAY ---------------- */
var CL=D.closed||[],CLW=CL.filter(function(c){return c.how==='target'}).length;
function forYou(){var p=profile(),key=(p&&p.preset)||'basic',S=D.sotd,lrn=learned(),nx=nextEv(),t=todo().length,c=CALLS[0];
  var R={
    sd:['t',ICO.sd,'Stock of the day',S.s+' · fresh 52-week high','+'+S.chg.toFixed(2)+'%','u','#ideas/sd'],
    calls:['i',ICO.tc,'Trade calls',CALLS.length+' active · '+CLW+' of '+CL.length+' recent hit target','','','#ideas/calls'],
    fo:['a',ICO.fo,'Nifty F&O levels','S '+D.fo.k[0][1]+' · Max pain '+D.fo.k[1][1]+' · R '+D.fo.k[2][1],'','','#markets/fo'],
    oib:['i',ICO.oi,'OI buildup','Long buildup '+OIB.lb.n+' · short buildup '+OIB.sb.n,'','','#markets/movers'],
    journal:['a',ICO.journal,'Journal',t?t+' trade'+(t>1?'s':'')+' to review':'All trades reviewed',inr(stats(ALL.filter(function(x){return x.d.slice(0,7)===MONTHS().slice(-1)[0]})).net,true),'','#journal'],
    scan:['a',ICO.scan,'Market scan','Volume, delivery, 20-day highs and lows','','','#markets/scan'],
    movers:['t',ICO.mv,'Movers',MVS[0].n+' +'+MVS[0].v.toFixed(2)+'%','','','#markets/movers'],
    filings:['b',ICO.file,'What’s happening',D.filings.reduce(function(s,g){return s+g.items.length},0)+' company filings','','','#markets/filings'],
    baskets:['t',ICO.bk,'Baskets',D.baskets[0].n,D.baskets[0].r,'u','#ideas/baskets'],
    indices:['t',ICO.markets,'Markets','Nifty 50 and 8 more indices','','','#markets/indices'],
    learn:['i',ICO.learn,'Learn today',lrn.length>=LEARN.length?'All 3 ideas learned':(LEARN.length-lrn.length)+' ideas left today','','','#you/learn'],
    cal:['a',ICO.cal,'Coming up',nx?nx.t+' '+nx.b:'Market day done','','','#markets/cal']};
  var BYP={basic:['sd','calls','fo','indices'],options:['calls','fo','oib','sd'],picker:['sd','scan','movers','filings'],investor:['baskets','indices','filings','sd'],learner:['learn','sd','cal','indices']};
  var rows=BYP[key].filter(function(k){return !(k==='calls'&&goals().indexOf('calls')>=0&&key!=='options')});
  if(goals().indexOf('journal')>=0&&rows.indexOf('journal')<0)rows.splice(1,0,'journal');
  rows=rows.slice(0,4);
  return '<div class="h2"><h2>For you</h2><small id="fyName">'+presetName()+'</small><span class="sp"></span><button type="button" class="l" data-act="setup">Change</button></div>'+
    '<div class="card" style="padding:0 16px"><div class="list" id="fyRows">'+rows.map(function(k){var r=R[k];return '<a class="row" href="'+r[6]+'"><span class="ic '+r[0]+'">'+I(r[1])+'</span><span class="tx"><b>'+r[2]+'</b><small>'+esc(r[3])+'</small></span>'+(r[4]?'<span class="vl '+r[5]+'">'+r[4]+'</span>':'')+'<span class="go" aria-hidden="true">›</span></a>'}).join('')+'</div></div>'}
function rToday(){var s=$('#s-today'),nx=nextEv(),idx=IDX.filter(function(x){return /^(Nifty 50|Nifty Bank|India VIX)$/.test(x.n)}),SL=spotSlides(),hr=new Date().getHours();
  var hi=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  s.innerHTML=top('','<button type="button" class="chip" data-act="streak" aria-label="Streak">🔥 '+streakNow()+'</button>'+avatar())+
    '<div class="hello"><h1>'+hi+', Trader</h1><p>'+esc(D.date.replace(/^(\w{3})\w*,\s*(\d+)\s+(\w{3})\w*/,'$1 $2 $3'))+(nx?' \u00B7 '+nx.t+' '+esc(nx.b):'')+'</p></div>'+
    '<section class="brief card" aria-labelledby="tH"><div class="eb">Today’s brief · '+mmss(D.audio.dur)+'</div><h2 id="tH">'+esc(D.head)+'</h2>'+(D.sub?'<p class="sub">'+esc(D.sub)+'</p>':'')+
      '<div class="bp"><button type="button" class="play" data-act="listen" aria-label="Play the brief"></button><div class="bt"><b id="bpT">Listen</b><small id="bpS">7 chapters</small><span class="bpb"><i id="bpBar"></i></span></div><button type="button" class="btn g s" data-act="chapters">Chapters</button></div></section>'+
    '<div class="strip" role="group" aria-label="Yesterday’s close">'+idx.map(function(x){var v=x.d[x.d.length-1][1],w=x.n==='India VIX';return '<a class="nm" href="#markets/indices" data-ix="'+esc(x.n)+'"><span>'+(x.n==='Nifty Bank'?'Bank Nifty':x.n)+'</span><b>'+num(v,2)+'</b><em class="'+(w?'w':x.up?'u':'d')+'">'+(x.up?'▲ ':'▼ ')+x.pct.replace(/^[+−-]/,'')+'</em></a>'}).join('')+'</div>'+
    morningHTML()+
    '<div class="h2"><h2>Spotlight</h2><small id="spC">1 of '+SL.length+'</small></div>'+
    '<div class="spw"><div class="sp-tr" id="spTr" aria-roledescription="carousel" aria-label="Spotlight">'+SL.map(function(x,i){return '<article class="sl" aria-roledescription="slide" aria-label="'+(i+1)+' of '+SL.length+'"><div class="kr"><span class="ic '+x.c+'">'+I(ICO[x.ic],2)+'</span>'+x.k+'</div><div class="tt"><b>'+x.t+'</b>'+(x.v?'<span class="v">'+x.v+'</span>':'')+(x.d?'<span class="dd">'+x.d+'</span>':'')+'</div><p>'+x.sub+'</p>'+(beginner()&&x.tip?'<p class="tip">💡 '+x.tip+'</p>':'')+x.viz+'<div class="ac">'+x.a.map(function(l){return '<a href="'+l[0]+'">'+l[1]+' →</a>'}).join('')+'</div></article>'}).join('')+'</div><div class="dots" aria-hidden="true">'+SL.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div></div>'+
    forYou()+
    '<p class="note">Analysis, not investment advice. Prices are from the 11 Nov close.</p>';
  paintAudio();
  var tr=$('#spTr');tr.addEventListener('scroll',function(){var w=tr.firstChild.offsetWidth+12,i=Math.round(tr.scrollLeft/w);$$('.dots i',s).forEach(function(d,j){d.classList.toggle('on',j===i)});$('#spC').textContent=(i+1)+' of '+SL.length},{passive:true})}

/* ---------------- MARKETS ---------------- */
var ixSel='Nifty 50',mvSeg='stocks',scSeg='sc-vol',calType='all';
function ixChart(x){var W=340,H=150,P=6,v=x.d.map(function(p){return p[1]}),lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),r=(hi-lo)||1;
  var X=function(i){return P+i*(W-2*P)/(v.length-1)},Y=function(y){return P+(hi-y)/r*(H-2*P-14)};
  var pts=v.map(function(y,i){return X(i).toFixed(1)+','+Y(y).toFixed(1)}).join(' ');
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" role="img" aria-label="'+esc(x.n)+' daily closes, '+x.d[0][0]+' to '+x.d[x.d.length-1][0]+'"><line class="gl" x1="0" x2="'+W+'" y1="'+Y(hi).toFixed(1)+'" y2="'+Y(hi).toFixed(1)+'"/><line class="gl" x1="0" x2="'+W+'" y1="'+Y(lo).toFixed(1)+'" y2="'+Y(lo).toFixed(1)+'"/>'+
    '<polyline class="ln'+(x.n==='India VIX'?' w':'')+'" points="'+pts+'" vector-effect="non-scaling-stroke"/><line class="cur" id="ixCur" x1="0" x2="0" y1="0" y2="'+(H-14)+'" hidden/>'+
    '<text x="0" y="'+H+'">'+x.d[0][0]+'</text><text x="'+W+'" y="'+H+'" text-anchor="end">'+x.d[x.d.length-1][0]+'</text></svg><span class="tip" id="ixTip" hidden></span>'}
function rMarkets(){var s=$('#s-markets'),x=IDX.filter(function(i){return i.n===ixSel})[0]||IDX[0],last=x.d[x.d.length-1][1],m=(last/x.d[0][1]-1)*100;
  var NAV=[['indices','Indices'],['fo','F&O levels'],['movers','Movers'],['scan','Scan'],['filings','Filings'],['cal','Calendar']];
  var scan=SC(scSeg),SCN={'sc-vol':'Volume','sc-del':'Delivery','sc-hi':'20-day highs','sc-lo':'20-day lows'};
  var types=Object.keys(TYPES),today0=new Date(2026,10,12),up=EVENTS.filter(function(e){return e.d>=today0&&(calType==='all'||e.t===calType)}).slice(0,10);
  var nm=nowM,nI=DAYS.findIndex(function(e){return toM(e.t)>=nm});
  s.innerHTML=top('Markets',streakChip())+
    '<div class="mk-nav"><div class="chips" role="navigation" aria-label="Sections">'+NAV.map(function(n){return '<button type="button" data-jump="'+n[0]+'">'+n[1]+'</button>'}).join('')+'</div></div>'+
    '<section class="sec" id="indices"><div class="chips" style="margin-top:6px" aria-label="Choose an index">'+IDX.map(function(i){return '<button type="button" data-ix="'+esc(i.n)+'" aria-pressed="'+(i.n===x.n)+'">'+esc(i.n.replace('Nifty Bank','Bank Nifty'))+'</button>'}).join('')+'</div>'+
      '<div class="ixh"><b>'+num(last,2)+'</b><em class="'+(x.n==='India VIX'?'w':x.up?'u':'d')+'">'+(x.up?'▲ ':'▼ ')+x.pts+' ('+x.pct+')</em><small>'+esc(x.n)+' · '+(m>=0?'+':'−')+Math.abs(m).toFixed(1)+'% in a month · 11 Nov close</small></div>'+
      '<div class="ixc" id="ixc">'+ixChart(x)+'</div></section>'+
    '<section class="sec" id="fo"><div class="h2"><h2>F&amp;O levels · Nifty</h2>'+infoBtn('fo')+'<span class="sp"></span><small>'+esc(D.fo.exp)+'</small></div>'+
      '<div class="fo3">'+D.fo.k.map(function(k,i){return '<div class="'+['s','m','r'][i]+'"><span>'+esc(k[0])+'</span><b>'+esc(k[1])+'</b><small>'+esc(k[2])+'</small></div>'}).join('')+'</div>'+
      '<div class="foch">'+D.fo.svg+'</div><a class="btn g full" style="margin-top:14px" href="'+L.studio+'">Open Option Studio '+I(ICO.ext)+'</a></section>'+
    '<section class="sec" id="movers"><div class="h2"><h2>Movers</h2>'+(mvSeg==='oi'?infoBtn('oib'):'')+'</div><div class="seg" role="group" aria-label="Movers view">'+[['stocks','Nifty 100'],['sectors','Sectors'],['oi','OI buildup']].map(function(b){return '<button type="button" data-mv="'+b[0]+'" aria-pressed="'+(mvSeg===b[0])+'">'+b[1]+'</button>'}).join('')+'</div><div style="margin-top:14px">'+movers()+'</div></section>'+
    '<section class="sec" id="scan"><div class="h2"><h2>Market scan</h2><span class="sp"></span><small>Nifty 500 · 11 Nov</small></div><div class="chips" aria-label="Scan">'+Object.keys(SCN).map(function(k){return '<button type="button" data-sc="'+k+'" aria-pressed="'+(scSeg===k)+'">'+SCN[k]+'</button>'}).join('')+'</div>'+
      '<div class="card" style="margin-top:12px;padding:0 16px"><div class="list">'+scan.rows.map(function(r){return '<div class="row"><span class="tx"><b>'+esc(r.s)+'</b><small>'+esc(r.name)+'</small></span><span class="vl">'+(r.v?esc(r.v.split(' ')[0]):'')+'<small class="'+(r.u?'u':'d')+'">'+esc(r.c)+'</small></span></div>'}).join('')+'</div></div>'+
      '<a class="btn g full" style="margin-top:12px" href="'+L.screener+'">Open the screener '+I(ICO.ext)+'</a></section>'+
    '<section class="sec" id="filings"><div class="h2"><h2>What’s happening</h2><span class="sp"></span><small>Filings · 13 Nov</small></div>'+
      D.filings.map(function(g){return '<div class="flh"><i class="'+g.c+'"></i>'+esc(g.h)+'</div><div class="list fl">'+g.items.map(function(it){return '<a class="row" href="'+esc(it.href)+'" target="_blank" rel="noopener"><span class="tm">'+it.t+'</span><span class="tx"><b>'+esc(it.s)+(it.fo?' <span class="tag">F&amp;O</span>':'')+'</b><small>'+esc(it.x)+'</small></span><span class="go" aria-hidden="true">'+I(ICO.ext)+'</span></a>'}).join('')+'</div>'}).join('')+'</section>'+
    '<section class="sec" id="cal"><div class="h2"><h2>Today</h2><span class="sp"></span><small>IST</small></div><ol class="tl">'+DAYS.map(function(e,i){var past=toM(e.t)<nm;return (i===nI?'<li class="now" aria-label="Now">Now '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+'</li>':'')+'<li class="'+(past?'past':'')+(i===nI?' next':'')+(e.ev?' ev':'')+'"><time>'+e.t+'</time><b>'+esc(e.b)+'</b><span class="g">'+esc(e.g)+'</span></li>'}).join('')+'</ol>'+
      '<div class="h2"><h2>Coming up</h2></div><div class="chips">'+['all'].concat(types).map(function(k){return '<button type="button" data-ct="'+k+'" aria-pressed="'+(calType===k)+'">'+(k==='all'?'All':TYPES[k].n)+'</button>'}).join('')+'</div>'+
      '<div class="list cal" style="margin-top:8px">'+(up.length?up.map(function(e){return '<div class="row"><span class="dt"><b>'+e.d.getDate()+'</b><small>'+e.d.toLocaleDateString('en-IN',{month:'short'})+'</small></span><span class="tx"><b><i class="ty '+e.t+'"></i>'+esc(e.title)+'</b><small>'+esc(e.note)+'</small></span></div>'}).join(''):'<p class="muted">Nothing of this kind coming up.</p>')+'</div></section>'+
    '<p class="note">Data from NSE, 11 Nov close. Analysis, not investment advice.</p>';
  wireChart(x)}
function movers(){if(mvSeg==='oi')return '<div class="oib">'+OIQ.map(function(q){var o=OIB[q[0]];return '<div class="q '+q[3]+'"><b>'+q[1]+'</b><span class="n">'+o.n+'</span><small>'+q[2]+'</small><ol>'+o.top.map(function(t){return '<li><span>'+t.s+'</span><em>'+(t.p>0?'+':'−')+Math.abs(t.p).toFixed(1)+'%</em></li>'}).join('')+'</ol></div>'}).join('')+'</div><p class="note">211 stock futures · OI across expiries · NSE 11 Nov</p>';
  var arr=mvSeg==='sectors'?SECS:MVS,mx=Math.max.apply(null,arr.map(function(m){return Math.abs(m.v)}));
  return '<div class="bars">'+arr.map(function(m){return bar(esc(m.n),(m.v>0?'+':'−')+Math.abs(m.v).toFixed(2)+'%',Math.abs(m.v)/mx*100,m.v>0?'':'d',m.v>0?'u':'d')}).join('')+'</div>'}
function wireChart(x){var box=$('#ixc');if(!box)return;var svg=box.querySelector('svg'),tip=$('#ixTip'),cur=$('#ixCur');
  function at(cx){var r=svg.getBoundingClientRect(),f=Math.max(0,Math.min(1,(cx-r.left)/r.width)),i=Math.round(f*(x.d.length-1)),p=x.d[i];
    tip.hidden=false;cur.removeAttribute('hidden');var px=6+i*(340-12)/(x.d.length-1);cur.setAttribute('x1',px);cur.setAttribute('x2',px);
    tip.style.left=Math.max(40,Math.min(r.width-40,(px/340)*r.width))+'px';tip.innerHTML=num(p[1],2)+'<small>'+p[0]+'</small>'}
  function off(){tip.hidden=true;cur.setAttribute('hidden','')}
  box.addEventListener('pointermove',function(e){at(e.clientX)});box.addEventListener('pointerdown',function(e){at(e.clientX)});box.addEventListener('pointerleave',off)}

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
      '<div class="tcw"><div class="tc-tr" id="tcTr">'+CALLS.map(callCard).join('')+'</div></div><a class="trl" href="#ideas/record"><span><b>'+CLW+' of '+CL.length+'</b> recent calls hit target</span><span>See the track record \u203A</span></a><p class="note">Research advice from the AlphaPad desk. Prices are indicative.</p></section>'+
    '<section class="sec" id="record"><div class="h2"><h2>Track record</h2><span class="sp"></span><small>closed in the last 30 days</small></div>'+trackHTML()+'</section>'+
    '<section class="sec" id="baskets"><div class="h2"><h2>Baskets</h2><span class="sp"></span><a href="'+L.baskets+'">+ Build</a></div><div class="card" style="padding:0 16px"><div class="list">'+
      D.baskets.map(function(b){return '<a class="row" href="'+L.baskets+'"><span class="ic t">'+I(ICO.bk)+'</span><span class="tx"><b>'+esc(b.n)+'</b><small>'+esc(b.m)+'</small></span><span class="vl u">'+esc(b.r)+'<small class="muted">1 year</small></span></a>'}).join('')+'</div></div><p class="note">Past returns are not a promise of future returns. Not investment advice.</p></section>';
  var tr=$('#tcTr');tr.addEventListener('scroll',function(){var w=tr.firstChild.offsetWidth+12;$('#tcC').textContent=(Math.round(tr.scrollLeft/w)+1)+' of '+CALLS.length},{passive:true})}


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
function openClosed(i){var x=CL[i];if(!x)return;var dd=days(x.po,x.cl),h=HOW[x.how];
  var pct=function(v){return (v>=x.en?'+':'\u2212')+Math.abs((v-x.en)/x.en*100).toFixed(1)+'%'};
  sheet(esc(x.n)+' \u00B7 '+esc(x.k),'<div class="facts"><div>Result<b class="'+(x.ret>=0?'u':'d')+'">'+(x.ret>=0?'+':'\u2212')+Math.abs(x.ret)+'%</b></div><div>Per lot / qty<b class="'+(x.pnl>=0?'u':'d')+'">'+inr(x.pnl,true)+'</b></div><div>Held<b>'+dd+' day'+(dd>1?'s':'')+'</b></div></div>'+
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
function rJournal(){var s=$('#s-journal'),ms=MONTHS(),mi=ms.indexOf(jMonth);if(mi<0){jMonth=ms[ms.length-1];mi=ms.length-1}
  var tr=ALL.filter(function(t){return t.d.slice(0,7)===jMonth}),st=stats(tr),td=todo(),ins=insights(tr),mist={};tr.forEach(function(t){(t.mistakes||[]).forEach(function(k){mist[k]=(mist[k]||0)+1})});
  var mk=Object.keys(mist).sort(function(a,b){return mist[b]-mist[a]}),mmx=mk.length?mist[mk[0]]:1;
  s.innerHTML=top('Journal','<span class="tag">Sample</span>')+
    (td.length?'<div class="inbox" id="review"><div class="hd"><span class="ic a">'+I('<path d="M4 13h4l2 3h4l2-3h4"/><path d="M5 5h14l1 8v6H4v-6z"/>')+'</span><div>'+td.length+' trade'+(td.length>1?'s':'')+' from today to review<small>Fetched from your broker. Add the setup and plan check to log them.</small></div></div><div class="list">'+
      td.map(function(p){return '<button type="button" class="row" data-review="'+p.id+'"><span class="tx"><b>'+esc(p.sym)+'</b><small>'+p.t+' · '+p.side+' '+p.qty+' · '+p.en+' → '+p.ex+'</small></span><span class="vl '+(p.pnl>=0?'u':'d')+'">'+inr(p.pnl,true)+'</span><span class="go" aria-hidden="true">›</span></button>'}).join('')+'</div></div>':'<div class="inbox" style="background:var(--fin-positive-soft);border-color:rgba(0,201,154,.3)"><div class="hd">✓ All of today’s trades are reviewed</div></div>')+
    '<div class="mnav"><button type="button" data-m="-1" aria-label="Previous month"'+(mi<=0?' disabled':'')+'>‹</button><b>'+mname(jMonth)+'</b><button type="button" data-m="1" aria-label="Next month"'+(mi>=ms.length-1?' disabled':'')+'>›</button></div>'+
    '<div class="kpi"><div><span>Net P&amp;L</span><b class="'+(st.net>=0?'u':'d')+'">'+inr(st.net,true)+'</b><small>'+st.n+' trades</small></div><div><span>Win rate</span><b>'+st.wr.toFixed(0)+'%</b><small>'+st.w+' won · '+st.l+' lost</small></div>'+
      '<div><span>Profit factor</span><b>'+st.pf.toFixed(2)+'</b><small>gross win ÷ gross loss</small></div><div><span>Avg win / loss</span><b>'+(st.al?(st.aw/st.al).toFixed(2):'–')+'×</b><small>'+inr(st.aw)+' / '+inr(st.al)+'</small></div></div>'+
    '<div class="h2"><h2>Equity curve</h2><span class="sp"></span><small>running P&amp;L</small></div><div class="eq">'+equity(tr)+'</div>'+
    '<div class="h2"><h2>Calendar</h2><span class="sp"></span><small>tap a day</small></div>'+jcal(jMonth,tr)+
    (ins.length?'<div class="h2"><h2>Insights</h2></div><div class="ins">'+ins.map(function(x){return '<div class="'+x[0]+'">'+x[1]+'</div>'}).join('')+'</div>':'')+
    '<div class="h2"><h2>Plan score</h2><span class="sp"></span><small>5 rules per trade</small></div><div class="card"><div class="score"><span class="big">'+st.score.toFixed(1)+'</span><small>out of 5 on average.<br>'+(mk.length?'Most missed: <b>'+mk[0].toLowerCase()+'</b>.':'Every rule kept.')+'</small></div>'+
      (mk.length?'<div class="bars mist" style="margin-top:14px">'+mk.map(function(k){return bar(k,mist[k]+'×',mist[k]/mmx*100,'a')}).join('')+'</div>':'')+'</div>'+
    '<div class="h2"><h2>Trades</h2><span class="sp"></span><small>'+st.n+' this month</small></div><div class="card" style="padding:0 16px"><div class="list">'+
      tr.slice().reverse().slice(0,40).map(function(t){var i=ALL.indexOf(t);return '<button type="button" class="row" data-trade="'+i+'"><span class="tx"><b>'+esc(t.sym)+(t.confirmed?' <span class="tag">today</span>':'')+'</b><small>'+dt(t.d).toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' '+t.t+' · '+esc(t.setup||'')+'</small></span><span class="vl '+(t.pnl>=0?'u':'d')+'">'+inr(t.pnl,true)+'<small class="muted">'+(t.score!=null?t.score+'/5':'')+'</small></span></button>'}).join('')+'</div></div>'+
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
function nextReview(){var n=todo()[0];if(n)setTimeout(function(){reviewForm(n.id)},350)}

/* ---------------- YOU ---------------- */
var LKEY='sp-learn-2026-11-12',lrnI=0;
function learned(){return store.get(LKEY,[])}
function rYou(){var s=$('#s-you'),p=profile(),S=D.streak,lr=learned(),x=LEARN[lrnI],th=root.getAttribute('data-theme')||'dark',got=lr.indexOf(x.id)>=0,all=lr.length>=LEARN.length;
  s.innerHTML=top('You')+
    '<div class="prof"><span class="av">T</span><div><b>Trader</b><small>Your screen: '+presetName()+' · <button type="button" class="l" style="color:var(--link);font-weight:600" data-act="setup">Change</button></small></div></div>'+
    freeHTML()+streakHTML()+seasonHTML()+badgesHTML()+
    '<section class="sec" id="learn"><div class="h2"><h2>Learn today</h2><span class="sp"></span><small>'+lr.length+' of '+LEARN.length+' done</small></div><div class="card lrn">'+(all?'<div class="ok">✓ All 3 ideas learned. Streak kept for today.</div>':'')+
      '<div class="kind"><span class="eb">'+esc(x.kind)+'</span>'+(got?'<span class="tag" style="margin-left:auto">✓ Learned</span>':'')+'</div><h3>'+esc(x.h)+'</h3><p>'+x.one+'</p>'+
      '<div class="ft"><button type="button" class="navb" data-lrn="-1" aria-label="Previous idea">‹</button><div class="pg" aria-hidden="true">'+LEARN.map(function(l,j){return '<i class="'+(lr.indexOf(l.id)>=0?'done':'')+(j===lrnI?' on':'')+'"></i>'}).join('')+'</div><button type="button" class="navb" data-lrn="1" aria-label="Next idea">›</button><span class="sp"></span>'+
      (got?'':'<button type="button" class="btn p s" data-got="'+x.id+'">Got it</button>')+'</div></div></section>'+
    '<div class="h2"><h2>Tools</h2></div><div class="card" style="padding:0 16px"><div class="list">'+
      [[L.bt,ICO.bt,'i','Backtesting','Replay a past session candle by candle',1],[L.screener,ICO.scan,'a','Screener','Scan Nifty 500 stocks',0],[L.studio,ICO.studio,'b','Option Studio','Option chain and strategies',0],[L.baskets,ICO.bk,'t','Baskets','Build and track baskets',0],[L.lms,ICO.lms,'i','LMS','Courses and lessons',0],[L.brief,ICO.brief,'b','Full brief','Read today’s brief on the web',0]]
      .map(function(r){return '<a class="row" href="'+r[0]+'"'+(r[5]?' target="_blank" rel="noopener"':'')+'><span class="ic '+r[2]+'">'+I(r[1])+'</span><span class="tx"><b>'+r[3]+'</b><small>'+r[4]+'</small></span><span class="go" aria-hidden="true">'+(r[5]?I(ICO.ext):'›')+'</span></a>'}).join('')+'</div></div>'+
    '<div class="h2"><h2>Settings</h2></div><div class="card"><div class="fld" style="margin:0"><span>Theme</span><div class="seg" role="group" aria-label="Theme">'+[['dark','Dark'],['light','Light']].map(function(t){return '<button type="button" data-theme-set="'+t[0]+'" aria-pressed="'+(th===t[0])+'">'+t[1]+'</button>'}).join('')+'</div></div>'+
      '<div class="list" style="margin-top:8px"><button type="button" class="row" data-act="setup"><span class="ic i">'+I(ICO.setup)+'</span><span class="tx"><b>Change my screen</b><small>Answer the 3 questions again</small></span><span class="go">›</span></button>'+
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
var MILES=[[3,'Getting started','First badge'],[7,'Week regular','+1 streak freeze and a weekly report card'],[21,'Habit formed','+3 free days and a group session with the RA'],[50,'Committed','+7 free days and advanced backtest templates'],[100,'Market habit','+15 free days and a 1-on-1 call with a SEBI-registered RA']];
/* id, icon, name, how to earn, progress() -> [have, need], free days it adds */
var BADGES=[
  ['start','🌱','Getting started','Finish 3 market mornings',function(){return [totalDays(),3]},0],
  ['week','📅','Week regular','Reach a 7-day streak',function(){return [longest(),7]},0],
  ['habit','🧠','Habit formed','Finish 21 market mornings',function(){return [totalDays(),21]},0],
  ['comeback','💪','Comeback','Come back after a break and finish 5 mornings in a row',function(){return [streakNow(),5]},0],
  ['review','📝','Reviewer','Review every trade for a whole week',function(){return [1,1]},1],
  ['early','🌅','Early bird','Hear the brief before 9:15 on 10 days',function(){return [10,10]},1],
  ['plan','🎯','Plan keeper','Follow all 5 rules on 10 reviewed trades',function(){return [7+planKept(),10]},1],
  ['learner','📚','Learner','Learn all 3 ideas on 10 days',function(){return [9+(learned().length>=LEARN.length?1:0),10]},1],
  ['stop','🛡️','Stop-loss always','Set a stop-loss before entry on every trade for a week',function(){return [3,5]},1],
  ['fifty','⭐','Committed','Finish 50 market mornings',function(){return [totalDays(),50]},0],
  ['hund','🏆','Market habit','Finish 100 market mornings',function(){return [totalDays(),100]},0],
  ['hof','👑','Hall of Fame','Get featured in a Monday shoutout',function(){return [0,1]},0]];
function bp(b){var p=b[4]();return [Math.min(p[0],p[1]),p[1]]}
function bGot(b){var p=bp(b);return p[0]>=p[1]}
function freeLog(){var l=[['Full weeks of mornings',HIST.weeks,HIST.weeks+' weeks × 1 day'],['21-day milestone',3,'Habit formed']];
  if(totalDays()>=50)l.push(['50-day milestone',7,'Committed']);
  BADGES.forEach(function(b){if(b[5]&&bGot(b))l.push([b[2]+' badge',b[5],'Badge reward'])});return l}
function freeDays(){return Math.min(30,freeLog().reduce(function(a,x){return a+x[1]},0))}
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

function freeHTML(){var n=freeDays(),stops=[[7,'1 week'],[15,'Half month'],[30,'Month free']],nx=stops.filter(function(s){return n<s[0]})[0];
  return '<section class="sec" id="rewards"><div class="h2"><h2>Free days</h2><span class="sp"></span><small>Renews 2 Dec</small></div><div class="card fd">'+
    '<div class="fdh"><b>'+n+'</b><span>free days of AlphaPad earned<br><span class="muted">'+(nx?(nx[0]-n)+' more to reach '+nx[1].toLowerCase():'A full month free on your next renewal')+'</span></span></div>'+
    '<div class="fdt" role="img" aria-label="'+n+' of 30 free days"><div class="fdbar"><i style="width:'+(n/30*100).toFixed(1)+'%"></i></div>'+stops.map(function(s){return '<span class="stop'+(n>=s[0]?' got':'')+'" style="left:'+(s[0]/30*100).toFixed(1)+'%"><i></i><b>'+s[0]+'</b><small>'+s[1]+'</small></span>'}).join('')+'</div>'+
    '<ul class="fdl">'+freeLog().map(function(x){return '<li><span><b>'+esc(x[0])+'</b><small>'+esc(x[2])+'</small></span><em>+'+x[1]+' day'+(x[1]>1?'s':'')+'</em></li>'}).join('')+'</ul>'+
    '<p class="cap">Taken off your next renewal automatically. Up to 30 days per renewal; days expire after 12 months and only extend a paid plan.</p></div></section>'}

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

function mfootHTML(){var v=seasonScore();return '<a class="mfoot" href="#you/season"><span>⭐ <b>'+v+'</b> pts</span><span>#'+myRank()+' · '+TIERS[tierOf(v)][1]+'</span><span>🎁 <b>'+freeDays()+'</b> free days</span><span class="go" aria-hidden="true">›</span></a>'}

/* ---------------- streak sheet + global clicks ---------------- */
function streakSheet(){var S=D.streak,lr=learned();sheet('\uD83D\uDD25 '+streakNow()+'-day streak','<p>Finish your morning on each market day to keep it going. Weekends and market holidays never count.</p><div class="wk" style="margin:6px 0 16px">'+S.week.map(function(d){return '<span class="'+d[1]+'"><i>'+(d[1]==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'+
  '<div class="facts"><div>Freezes<b>'+freezes()+' of 2</b></div><div>Longest<b>'+longest()+' days</b></div><div>Morning<b>'+mDone()+' of '+goals().length+'</b></div></div><a class="btn p full" style="margin-top:14px" href="#today" data-close data-act="tomorning">'+(mDone()===goals().length?'Morning done for today':'Finish your morning')+'</a><a class="btn g full" style="margin-top:8px" href="#you/rewards" data-close>Free days, badges and season</a>')}
document.addEventListener('click',function(e){var a=e.target.closest('[data-act],[data-info],[data-jump],[data-ix],[data-mv],[data-sc],[data-ct],[data-review],[data-trade],[data-day],[data-m],[data-lrn],[data-got],[data-theme-set],[data-tr],[data-cl],[data-badge]');if(!a)return;var ds=a.dataset;
  if(ds.badge)return badgeSheet(ds.badge);
  if(ds.act==='board')return boardSheet();
  if(ds.act==='listen')return toggleAudio();
  if(ds.act==='chapters'){e.preventDefault();return chapters()}
  if(ds.act==='streak')return streakSheet();
  if(ds.act==='tomorning'){setTimeout(function(){var c=$('#morning');if(c)c.scrollIntoView({block:'center',behavior:'smooth'})},80);return}
  if(ds.act==='setup'){closeSheet();onboard();return}
  if(ds.act==='others'){var o=D.sotd.others;return sheet('Also near 52-week highs','<div class="list">'+o.map(function(x){return '<div class="row"><span class="tx"><b>'+esc(x[0])+'</b><small>'+esc(x[1])+' · '+esc(x[3])+'</small></span><span class="vl u">+'+x[2].toFixed(2)+'%</span></div>'}).join('')+'</div>')}
  if(ds.info){var t=INFO_TXT[ds.info];return info(t[0],t[1],t[2])}
  if(ds.jump){var el=document.getElementById(ds.jump);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return}
  if(ds.ix&&a.tagName==='BUTTON'){ixSel=ds.ix;rMarkets();return}
  if(ds.ix&&a.tagName==='A'){ixSel=ds.ix;return}
  if(ds.mv){mvSeg=ds.mv;var y=scrollY;rMarkets();scrollTo(0,y);return}
  if(ds.sc){scSeg=ds.sc;var y2=scrollY;rMarkets();scrollTo(0,y2);return}
  if(ds.ct){calType=ds.ct;var y3=scrollY;rMarkets();scrollTo(0,y3);return}
  if(ds.tr){trF=ds.tr;var y7=scrollY;rIdeas();scrollTo(0,y7);return}
  if(ds.cl)return openClosed(+ds.cl);
  if(ds.review)return reviewForm(ds.review);
  if(ds.trade)return openTrade(+ds.trade);
  if(ds.day)return openDay(ds.day);
  if(ds.m){var ms=MONTHS(),i=ms.indexOf(jMonth)+ +ds.m;if(i>=0&&i<ms.length){jMonth=ms[i];jDay=null;rJournal()}return}
  if(ds.lrn){lrnI=(lrnI+ +ds.lrn+LEARN.length)%LEARN.length;var y4=scrollY;rYou();scrollTo(0,y4);return}
  if(ds.got){var l=learned();if(l.indexOf(ds.got)<0)l.push(ds.got);store.set(LKEY,l);var nx=LEARN.findIndex(function(x){return l.indexOf(x.id)<0});if(nx>=0)lrnI=nx;var y5=scrollY;rYou();scrollTo(0,y5);toast(l.length>=LEARN.length?'All 3 learned. Streak kept for today.':(LEARN.length-l.length)+' left to keep your streak');return}
  if(ds.themeSet){root.setAttribute('data-theme',ds.themeSet);store.set('today-theme',ds.themeSet);try{localStorage.setItem('today-theme',ds.themeSet)}catch(err){}var y6=scrollY;rYou();scrollTo(0,y6);return}
});
var armed=0;document.addEventListener('click',function(e){var b=e.target.closest('#rstB');if(!b)return;
  if(Date.now()-armed>4000){armed=Date.now();b.classList.add('arm');$('#rstS').textContent='Tap again to confirm';setTimeout(function(){if(Date.now()-armed>=4000&&$('#rstS')){b.classList.remove('arm');$('#rstS').textContent='Clears everything saved on this device'}},4100);return}
  try{Object.keys(localStorage).forEach(function(k){if(/^(ap-|sp-|today-)/.test(k))localStorage.removeItem(k)})}catch(err){}location.replace(location.pathname)});
/* the questions finish → refresh what depends on the chosen screen */
var RENDER={today:rToday,markets:rMarkets,ideas:rIdeas,journal:rJournal,you:rYou};
if(!root.getAttribute('data-theme'))root.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
badge();route();paintAudio();
if(!profile()||/[?&]setup=1/.test(location.search))setTimeout(onboard,/[?&]nosplash/.test(location.search)?60:500);
})();
