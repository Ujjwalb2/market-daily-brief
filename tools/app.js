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
  $$('[data-act="listen"]').forEach(function(b){b.innerHTML='<span class="pi" aria-hidden="true">'+(on?'❚❚':'▶')+'</span>'+(on?'Pause':t>0?'Resume':'Listen')+' <small>'+mmss(D.audio.dur)+'</small>'});
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
var profile=function(){return store.get('ap-profile',null)};

/* ---------------- TODAY ---------------- */
function sotdViz(){var sp=spark(D.sotd.closes,100,34),oy=D.sotd.oldy.toFixed(1);return '<div class="v-sd"><svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="ag1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00C99A" stop-opacity=".3"/><stop offset="1" stop-color="#00C99A" stop-opacity="0"/></linearGradient></defs><polygon fill="url(#ag1)" points="0,34 '+sp+' 100,34"/><line class="oh" x1="0" x2="100" y1="'+oy+'" y2="'+oy+'" vector-effect="non-scaling-stroke"/><polyline points="'+sp+'" vector-effect="non-scaling-stroke"/></svg><span class="oh-l">Old high ₹'+num(D.sotd.old_hi,0)+'</span></div>'}
var SC=function(id){return (D.scan.filter(function(s){return s.id===id})[0]||{rows:[]})};
function spotSlides(){var S=D.sotd,vol=SC('sc-vol').rows,hi=SC('sc-hi'),del=SC('sc-del').rows;
  var hiN=parseInt((hi.h.match(/(\d+)\s*stocks/)||[0,149])[1],10),loN=parseInt(((SC('sc-lo').h||'').match(/(\d+)\s*stocks/)||[0,7])[1],10),pct=hiN/(hiN+loN)*100;
  var lb=OIB.lb.top[0];
  return [
   {c:'t',ic:'sd',k:'Stock of the day · '+S.date,t:S.s,v:'₹'+num(S.close,0),d:'+'+S.chg.toFixed(2)+'%',sub:'Fresh 52-week high, '+((S.close/S.old_hi-1)*100).toFixed(1)+'% above the old peak.',
    viz:sotdViz()+'<div class="v-ch"><span>Volume<b>'+S.vx+'×</b></span><span>Delivery<b>'+Math.round(S.dl)+'%</b></span><span>Futures OI<b>+'+Math.round(S.oi)+'%</b></span></div>',a:[['#ideas/sd','Why it’s picked']]},
   {c:'a',ic:'vol',k:'Volume shockers',t:vol[0].s,v:vol[0].v,d:vol[0].c,sub:'Volume far above the 20-day average. Check the news first.',
    viz:'<div class="bars">'+vol.slice(0,3).map(function(r){return bar(r.s,r.v,r.w,'a')}).join('')+'</div>',a:[['#markets/scan','See the full scan']]},
   {c:'t',ic:'br',k:'Breadth · Nifty 500',t:hiN+' vs '+loN,v:'',d:'',sub:'New 20-day highs against new lows: a broad rally.',
    viz:'<div class="v-br"><div class="ring" style="--p:'+pct.toFixed(1)+'" role="img" aria-label="'+hiN+' new highs, '+loN+' new lows"><b>'+Math.round(pct)+'%</b><small>highs</small></div><div class="bars">'+hi.rows.slice(0,3).map(function(r){return '<div class="br"><b>'+r.s+'</b><span class="vl u">'+r.c+'</span></div>'}).join('')+'</div></div>',a:[['#markets/scan','See new highs']]},
   {c:'b',ic:'del',k:'Delivery spikes',t:del[0].s,v:del[0].v.split(' ')[0],d:'+'+del[0].v.split(' ')[1]+' pts',sub:'Shares changing hands for delivery, not intraday.',
    viz:'<div class="bars">'+del.slice(0,3).map(function(r){var p=r.v.split(' '),tot=parseFloat(p[0]),j=parseFloat(p[1]);return '<div class="br"><b>'+r.s+'</b><span class="vl">'+p[0]+' <small class="u">+'+p[1]+'</small></span><span class="tr two"><i class="b p" style="width:'+(tot-j)+'%"></i><i class="b" style="width:'+j+'%"></i></span></div>'}).join('')+'</div><div class="v-lg"><span><i class="p"></i>yesterday</span><span><i></i>today’s jump</span></div>',a:[['#markets/scan','See delivery spikes']]},
   {c:'i',ic:'oi',k:'Futures buildup · 211 stocks',t:lb.s,v:'OI +'+Math.round(lb.o)+'%',d:'+'+lb.p.toFixed(1)+'%',sub:'Price and OI rising together: fresh buying.',
    viz:'<div class="v-q">'+OIQ.map(function(q,i){return '<span class="q'+(q[3]==='u'?' qu':'')+(i?'':' on')+'"><small>'+q[1]+'</small><b>'+OIB[q[0]].n+'</b><em>'+OIB[q[0]].top[0].s+'</em></span>'}).join('')+'</div>',a:[['#markets/movers','See OI buildup']]}]}
var PRESET_ROWS={
  basic:['sd','calls','fo','learn'],options:['calls','fo','oib','journal'],picker:['sd','scan','movers','filings'],
  investor:['baskets','indices','filings','learn'],learner:['learn','brief','cal','sd']};
function forYou(){var p=profile(),key=(p&&p.preset)||'basic',S=D.sotd,lrn=learned(),nx=nextEv(),t=todo().length,c=CALLS[0];
  var R={
    sd:['t',ICO.sd,'Stock of the day',S.s+' · fresh 52-week high','+'+S.chg.toFixed(2)+'%','u','#ideas/sd'],
    calls:['i',ICO.tc,'Trade calls',CALLS.length+' active · '+c.n+' '+c.k.toLowerCase(),'','','#ideas/calls'],
    fo:['a',ICO.fo,'Nifty F&O levels','Support '+D.fo.k[0][1]+' · Resist. '+D.fo.k[2][1],D.fo.exp.replace('Expiry ',''),'','#markets/fo'],
    oib:['i',ICO.oi,'OI buildup','Long buildup '+OIB.lb.n+' · short buildup '+OIB.sb.n,'','','#markets/movers'],
    journal:['a',ICO.journal,'Journal',t?t+' trade'+(t>1?'s':'')+' to review':'All trades reviewed',inr(stats(ALL.filter(function(x){return x.d.slice(0,7)===MONTHS().slice(-1)[0]})).net,true),'','#journal'],
    scan:['a',ICO.scan,'Market scan','Volume, delivery, 20-day highs and lows','','','#markets/scan'],
    movers:['t',ICO.mv,'Movers',MVS[0].n+' +'+MVS[0].v.toFixed(2)+'%','','','#markets/movers'],
    filings:['b',ICO.file,'What’s happening',D.filings.reduce(function(s,g){return s+g.items.length},0)+' company filings','','','#markets/filings'],
    baskets:['t',ICO.bk,'Baskets',D.baskets[0].n,D.baskets[0].r,'u','#ideas/baskets'],
    indices:['t',ICO.markets,'Markets','Nifty 50 and 8 more indices','','','#markets/indices'],
    learn:['i',ICO.learn,'Learn today',lrn.length>=LEARN.length?'All 3 ideas learned':(LEARN.length-lrn.length)+' ideas left to keep your streak','','','#you/learn'],
    brief:['b',ICO.brief,'Today’s brief','7 chapters · '+mmss(D.audio.dur),'','','@brief'],
    cal:['a',ICO.cal,'Coming up',nx?nx.t+' '+nx.b:'Market day done','','','#markets/cal']};
  return '<div class="h2 b-dash"><h2>For you</h2><small id="fyName">'+(p&&!p.skipped&&window.apProfile?window.apProfile.names[p.preset]:'Basic')+'</small><span class="sp"></span><button type="button" class="l" data-act="setup">Change</button></div>'+
    '<div class="card" style="padding:0 16px"><div class="list" id="fyRows">'+PRESET_ROWS[key].map(function(k){var r=R[k];return '<a class="row" href="'+(r[6][0]==='@'?'#today':r[6])+'"'+(r[6]==='@brief'?' data-act="chapters"':'')+'><span class="ic '+r[0]+'">'+I(r[1])+'</span><span class="tx"><b>'+r[2]+'</b><small>'+esc(r[3])+'</small></span>'+(r[4]?'<span class="vl '+r[5]+'">'+r[4]+'</span>':'')+'<span class="go" aria-hidden="true">›</span></a>'}).join('')+'</div></div>'}
function rToday(){var s=$('#s-today'),nx=nextEv(),idx=IDX.filter(function(x){return /^(Nifty 50|Nifty Bank|India VIX)$/.test(x.n)});
  var SL=spotSlides();
  s.innerHTML=top('',streakChip()+avatar())+
    '<section class="hero-main" aria-labelledby="tH"><div class="eb">Good morning, Trader · '+esc(D.date)+'</div><h2 id="tH">'+esc(D.head)+'</h2>'+(D.sub?'<p class="sub">'+esc(D.sub)+'</p>':'')+
    '<div class="acts"><button type="button" class="btn p" data-act="listen"></button><button type="button" class="btn g" data-act="chapters">Chapters</button></div></section>'+
    '<div class="nums" role="group" aria-label="Yesterday’s close">'+idx.map(function(x){var v=x.d[x.d.length-1][1],w=x.n==='India VIX';return '<a class="nm" href="#markets/indices" data-ix="'+esc(x.n)+'"><span>'+(x.n==='Nifty Bank'?'Bank Nifty':x.n)+'</span><b>'+num(v,2)+'</b><em class="'+(w?'w':x.up?'u':'d')+'">'+(x.up?'▲ ':'▼ ')+x.pct.replace(/^[+−-]/,'')+'</em></a>'}).join('')+'</div>'+
    '<a class="nxt" href="#markets/cal"><span class="dot" aria-hidden="true"></span><span>'+(nx?'Next: <b>'+esc(nx.b)+'</b> at '+nx.t:'Market day done. Tomorrow’s brief lands at 7:30.')+'</span><span class="go" aria-hidden="true">›</span></a>'+
    '<div class="h2"><h2>Spotlight</h2><small id="spC">1 of '+SL.length+'</small></div>'+
    '<div class="spw"><div class="sp-tr" id="spTr" aria-roledescription="carousel" aria-label="Spotlight">'+SL.map(function(x,i){return '<article class="sl" aria-roledescription="slide" aria-label="'+(i+1)+' of '+SL.length+'"><div class="kr"><span class="ic '+x.c+'">'+I(ICO[x.ic],2)+'</span>'+x.k+'</div><div class="tt"><b>'+x.t+'</b>'+(x.v?'<span class="v">'+x.v+'</span>':'')+(x.d?'<span class="dd">'+x.d+'</span>':'')+'</div><p>'+x.sub+'</p>'+x.viz+'<div class="ac">'+x.a.map(function(l){return '<a href="'+l[0]+'">'+l[1]+' →</a>'}).join('')+'</div></article>'}).join('')+'</div><div class="dots" aria-hidden="true">'+SL.map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div></div>'+
    forYou()+
    '<p class="note">Analysis, not investment advice. Prices are from the 11 Nov close.</p>';
  paintAudio();
  var tr=$('#spTr');tr.addEventListener('scroll',function(){var w=tr.firstChild.offsetWidth+12,i=Math.round(tr.scrollLeft/w);$$('.dots i',s).forEach(function(d,j){d.classList.toggle('on',j===i)});$('#spC').textContent=(i+1)+' of '+SL.length},{passive:true});
}

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
      '<div class="tcw"><div class="tc-tr" id="tcTr">'+CALLS.map(callCard).join('')+'</div></div><p class="note">Research advice from the AlphaPad desk. Prices are indicative.</p></section>'+
    '<section class="sec" id="baskets"><div class="h2"><h2>Baskets</h2><span class="sp"></span><a href="'+L.baskets+'">+ Build</a></div><div class="card" style="padding:0 16px"><div class="list">'+
      D.baskets.map(function(b){return '<a class="row" href="'+L.baskets+'"><span class="ic t">'+I(ICO.bk)+'</span><span class="tx"><b>'+esc(b.n)+'</b><small>'+esc(b.m)+'</small></span><span class="vl u">'+esc(b.r)+'<small class="muted">1 year</small></span></a>'}).join('')+'</div></div><p class="note">Past returns are not a promise of future returns. Not investment advice.</p></section>';
  var tr=$('#tcTr');tr.addEventListener('scroll',function(){var w=tr.firstChild.offsetWidth+12;$('#tcC').textContent=(Math.round(tr.scrollLeft/w)+1)+' of '+CALLS.length},{passive:true})}

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
  var MSL=(typeof MS!=='undefined'?MS:[[7,'Week regular'],[30,'Month regular'],[100,'Market habit'],[250,'Market veteran']]);
  s.innerHTML=top('You')+
    '<div class="prof"><span class="av">T</span><div><b>Trader</b><small>Your screen: '+(p&&!p.skipped&&window.apProfile?window.apProfile.names[p.preset]:'Basic')+' · <button type="button" class="l" style="color:var(--link);font-weight:600" data-act="setup">Change</button></small></div></div>'+
    '<section class="sec" id="streak"><div class="h2"><h2>Streak</h2><span class="sp"></span><small>Rank #'+S.rank+' this week</small></div><div class="card stk"><div class="n"><b>🔥 '+S.n+'</b><span>market days in a row<br><span class="muted">'+(S.next-S.n)+' day to your '+S.next+'-day mark</span></span></div>'+
      '<div class="wk">'+S.week.map(function(d){return '<span class="'+d[1]+'"><i title="'+({done:'Done',hol:'Market holiday',today:'Today',off:'Weekend','':'Coming up'})[d[1]]+'">'+(d[1]==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'+
      '<div class="ms">'+MSL.map(function(m){return '<div class="'+(S.n>=m[0]?'got':'')+'"><b>'+m[0]+'</b>'+m[1]+'</div>'}).join('')+'</div></div></section>'+
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

/* ---------------- streak sheet + global clicks ---------------- */
function streakSheet(){var S=D.streak,lr=learned();sheet('🔥 '+S.n+'-day streak','<p>Open AlphaPad on a market day and learn the day’s 3 ideas to keep it going.</p><div class="wk" style="margin:6px 0 16px">'+S.week.map(function(d){return '<span class="'+d[1]+'"><i>'+(d[1]==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'+
  '<div class="facts"><div>Rank<b>#'+S.rank+'</b></div><div>Next mark<b>'+S.next+' days</b></div><div>Ideas left<b>'+Math.max(0,LEARN.length-lr.length)+'</b></div></div><a class="btn p full" style="margin-top:14px" href="#you/learn" data-close>Learn today’s ideas</a>')}
document.addEventListener('click',function(e){var a=e.target.closest('[data-act],[data-info],[data-jump],[data-ix],[data-mv],[data-sc],[data-ct],[data-review],[data-trade],[data-day],[data-m],[data-lrn],[data-got],[data-theme-set]');if(!a)return;var ds=a.dataset;
  if(ds.act==='listen')return toggleAudio();
  if(ds.act==='chapters'){e.preventDefault();return chapters()}
  if(ds.act==='streak')return streakSheet();
  if(ds.act==='setup'){closeSheet();if(window.apProfile)window.apProfile.open();return}
  if(ds.act==='others'){var o=D.sotd.others;return sheet('Also near 52-week highs','<div class="list">'+o.map(function(x){return '<div class="row"><span class="tx"><b>'+esc(x[0])+'</b><small>'+esc(x[1])+' · '+esc(x[3])+'</small></span><span class="vl u">+'+x[2].toFixed(2)+'%</span></div>'}).join('')+'</div>')}
  if(ds.info){var t=INFO_TXT[ds.info];return info(t[0],t[1],t[2])}
  if(ds.jump){var el=document.getElementById(ds.jump);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return}
  if(ds.ix&&a.tagName==='BUTTON'){ixSel=ds.ix;rMarkets();return}
  if(ds.ix&&a.tagName==='A'){ixSel=ds.ix;return}
  if(ds.mv){mvSeg=ds.mv;var y=scrollY;rMarkets();scrollTo(0,y);return}
  if(ds.sc){scSeg=ds.sc;var y2=scrollY;rMarkets();scrollTo(0,y2);return}
  if(ds.ct){calType=ds.ct;var y3=scrollY;rMarkets();scrollTo(0,y3);return}
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
document.addEventListener('click',function(e){if(!e.target.closest('.ob-go,.ob-skip'))return;
  if(tab==='today'){var h=$('#s-today .b-dash');if(h)h.scrollIntoView({block:'center'});setTimeout(function(){var tmp=document.createElement('div');tmp.innerHTML=forYou();$('#fyRows').innerHTML=tmp.querySelector('#fyRows').innerHTML;$('#fyName').textContent=tmp.querySelector('#fyName').textContent},0)}
  else setTimeout(function(){RENDER[tab]()},0)});

var RENDER={today:rToday,markets:rMarkets,ideas:rIdeas,journal:rJournal,you:rYou};
if(!root.getAttribute('data-theme'))root.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
badge();route();paintAudio();
})();
