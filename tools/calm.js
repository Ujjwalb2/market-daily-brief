/* Calm landing: renders from window.CD. */
(function(){
  var D=window.CD,L=D.links,app=document.getElementById('app');
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var inr=function(v){return (v<0?'−':'+')+'₹'+Math.abs(v).toLocaleString('en-IN')};
  var mmss=function(t){t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')};
  var SVG=function(p,w){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.8)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
  function spark(v,W,H){var lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),r=(hi-lo)||1;return v.map(function(x,i){return (i*W/(v.length-1)).toFixed(1)+','+(H-3-(x-lo)/r*(H-6)).toFixed(1)}).join(' ')}
  var last=function(a){return a[a.length-1]};

  /* the journal review count respects what was already reviewed */
  var reviewed={};try{reviewed=JSON.parse(localStorage.getItem('ap-journal-review'))||{}}catch(e){}
  var todo=D.journal.pending.filter(function(id){return !reviewed[id]}).length;

  /* ---------- next event ---------- */
  var now=new Date(),nm=now.getHours()*60+now.getMinutes(),toM=function(t){var a=t.split(':');return +a[0]*60+ +a[1]};
  var up=D.events.filter(function(e){return toM(e[0])>=nm}),nx=up[0],then=up[1];

  /* ---------- top bar ---------- */
  var S=D.streak;
  var bar='<header class="cb"><a class="logo" href="calm.html" aria-label="AlphaPad, today"><span>α</span>lphaPad</a>'+
    '<nav class="tabs" aria-label="Main"><a href="calm.html" aria-current="page">Today</a><a href="'+L.dash+'">Dashboard</a><a href="'+L.journal+'">Journal</a></nav><span class="sp"></span>'+
    '<div class="cb-r">'+
      '<button type="button" class="pill" id="stkB" aria-expanded="false" aria-controls="stkP">🔥 '+S.n+' <small>day streak</small></button>'+
      '<button type="button" class="icb" id="thB" aria-label="Switch theme"></button>'+
      '<button type="button" class="icb" id="mnB" aria-expanded="false" aria-controls="mnP" aria-label="All pages and tools">'+SVG('<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',2)+'</button>'+
      '<span class="av" title="Trader" aria-hidden="true">T</span>'+
      '<div class="pop" id="stkP" role="dialog" aria-label="Your streak" hidden><h3>'+S.n+' market days in a row</h3><p>Open AlphaPad on a market day to keep it going.</p>'+
        '<div class="wk">'+S.week.map(function(d){return '<span class="'+d[1]+'"><i title="'+({done:'Done',hol:'Market holiday',today:'Today',off:'Weekend','':'Coming up'})[d[1]]+'">'+(d[1]==='done'?'✓':'')+'</i>'+d[0]+'</span>'}).join('')+'</div>'+
        '<p>'+S.left+' ideas left today to keep it. <a class="l" href="'+L.learn+'">Learn →</a></p>'+
        '<div class="row"><span>🏆 Rank <b>#'+S.rank+'</b> this week</span><span>'+(S.next-S.n)+' day to your '+S.next+'-day mark</span></div></div>'+
      '<div class="pop menu" id="mnP" role="menu" aria-label="All pages and tools" hidden>'+
        '<div class="g">Your day</div><a role="menuitem" href="calm.html">Today<small>this page</small></a><a role="menuitem" href="'+L.dash+'">Dashboard<small>your cards</small></a><a role="menuitem" href="'+L.journal+'">Trade journal<small>P&amp;L, reviews</small></a><a role="menuitem" href="'+L.brief+'">Today’s full brief<small>4:46</small></a>'+
        '<div class="g">Trade</div><a role="menuitem" href="'+L.bt+'" target="_blank" rel="noopener">Backtesting<small>replay ↗</small></a><a role="menuitem" href="'+L.screener+'">Screener</a><a role="menuitem" href="'+L.studio+'">Option Studio</a><a role="menuitem" href="'+L.baskets+'">Baskets</a>'+
        '<div class="g">Learn</div><a role="menuitem" href="'+L.lms+'">LMS<small>courses</small></a>'+
        '<hr><button type="button" role="menuitem" id="setupB">Change my screen<small>3 questions</small></button><button type="button" role="menuitem" class="rst" id="rstB">Start fresh<small>clears this device</small></button></div>'+
    '</div></header>';

  /* ---------- hero ---------- */
  var nums=D.nums.map(function(x){var v=last(x.d),w=x.vix;return '<div class="nm'+(w?' vx':'')+'"><span>'+x.n+'</span><b>'+v.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})+'</b><em class="'+(w?'w':(x.up?'u':''))+'">'+(x.up?'▲ ':'▼ ')+x.pct.replace(/^[+−-]/,'')+'</em>'+
    '<svg viewBox="0 0 140 22" preserveAspectRatio="none" aria-hidden="true"><polyline points="'+spark(x.d,140,22)+'" vector-effect="non-scaling-stroke"/></svg></div>'}).join('');
  var hero='<section class="hero-main" aria-labelledby="hH"><div class="eb">Good morning, Trader · <b>'+esc(D.date)+'</b></div>'+
    '<h1 id="hH">'+esc(D.head)+'</h1>'+(D.sub?'<p class="sub">'+esc(D.sub)+'</p>':'')+
    '<div class="acts"><button type="button" class="btn p" id="lsB"><span class="pi" aria-hidden="true">▶</span><span class="lb">Listen</span> <small>'+mmss(D.audio.dur)+'</small></button><a class="btn g" href="'+L.brief+'">Read the brief →</a></div>'+
    '<div class="player" id="pl" hidden><div class="bar" id="plBar" role="slider" aria-label="Brief position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"><i style="width:0"></i></div><div class="t"><b id="plCh"></b><span id="plT"></span></div></div>'+
    '<div class="nums" role="group" aria-label="Yesterday’s close">'+nums+'</div>'+
    (nx?'<div class="next"><span class="dot" aria-hidden="true"></span><span>Next: <b>'+esc(nx[1])+'</b> at '+nx[0]+(then?' · then '+esc(then[1])+' at '+then[0]:'')+'</span></div>':'<div class="next"><span>Market day done. Tomorrow’s brief lands at 8:00.</span></div>')+
    '</section>';

  /* ---------- spotlight ---------- */
  var SCR=L.screener,IC={sd:'<path d="m4 15 6-6 4 4 6-6"/><path d="M15 7h5v5"/>',vol:'<path d="M5 20V10M10 20V4M15 20v-7M20 20v-4"/>',br:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8h-8z"/>',del:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',oi:'<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'};
  function rank(rows,mx,unit){return '<ol class="v-rk a">'+rows.map(function(r,i){return '<li><span class="n">'+(i+1)+'</span><b>'+r[0]+'</b><span class="bar"><i style="width:'+(r[1]/mx*100).toFixed(0)+'%"></i></span><span class="v">'+r[1]+unit+'</span><em>'+r[2]+'</em></li>'}).join('')+'</ol>'}
  var sp=spark(D.sotd.closes,100,34),oy=D.sotd.oldy.toFixed(1);
  var SL=[
   {c:'t',ic:'sd',k:'Stock of the day · 11 Nov',t:'NAVINFLUOR',v:'₹9,659',d:'+5.97%',sub:'Fresh 52-week high, 4.5% above the old peak.',
    viz:'<div class="v-sd"><svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cg1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00C99A" stop-opacity=".3"/><stop offset="1" stop-color="#00C99A" stop-opacity="0"/></linearGradient></defs><polygon fill="url(#cg1)" points="0,34 '+sp+' 100,34"/><line class="oh" x1="0" x2="100" y1="'+oy+'" y2="'+oy+'" vector-effect="non-scaling-stroke"/><polyline points="'+sp+'" vector-effect="non-scaling-stroke"/></svg><span class="oh-l">Old high ₹9,245</span></div>'+
        '<div class="v-ch"><span>Volume<b>3.1×</b></span><span>Delivery<b>45%</b></span><span>Futures OI<b>+69%</b></span></div>',
    a:[[L.dash+'#sd','Why it’s picked'],[SCR,'Screen similar']]},
   {c:'a',ic:'vol',k:'Volume shockers',t:'FACT',v:'29.6×',d:'+8.67%',sub:'Volume far above the 20-day average. Check the news first.',
    viz:rank([['FACT',29.6,'+8.67%'],['BEML',19.4,'+6.05%'],['IIFL',12.3,'+6.26%']],29.6,'×'),a:[[SCR,'Screen volume shockers']]},
   {c:'t',ic:'br',k:'Breadth · Nifty 500',t:'149 vs 7',v:'',d:'',sub:'New 20-day highs against new lows: a broad rally.',
    viz:'<div class="v-br"><div class="ring" style="--p:95.5" role="img" aria-label="149 new highs, 7 new lows"><b>96%</b><small>highs</small></div><div class="v-top"><span class="tl">Strongest new highs</span><ul><li><b>FACT</b><em>+8.67%</em></li><li><b>KALYANKJIL</b><em>+8.63%</em></li><li><b>SUNTV</b><em>+7.21%</em></li></ul></div></div>',
    a:[[SCR,'Screen 20-day highs']]},
   {c:'b',ic:'del',k:'Delivery spikes',t:'HOMEFIRST',v:'86%',d:'+42.8 pts',sub:'Shares changing hands for delivery, not intraday.',
    viz:'<ol class="v-rk b">'+[['HOMEFIRST',43,43,'86%'],['MANKIND',27,37,'64%'],['GLAND',23,30,'53%']].map(function(r,i){return '<li><span class="n">'+(i+1)+'</span><b>'+r[0]+'</b><span class="bar"><i class="p" style="width:'+r[1]+'%"></i><i style="width:'+r[2]+'%"></i></span><span class="v">'+r[3]+'</span><em>+'+r[2]+'</em></li>'}).join('')+'</ol><div class="v-lg"><span><i class="p"></i>yesterday</span><span><i></i>today’s jump</span></div>',
    a:[[SCR,'Screen delivery spikes']]},
   {c:'i',ic:'oi',k:'Futures buildup · 211 stocks',t:'COROMANDEL',v:'OI +91%',d:'+6.5%',sub:'Price and OI rising together: fresh buying.',
    viz:'<div class="v-q"><span class="q qu on"><small>Long buildup</small><b>64</b><em>COROMANDEL</em></span><span class="q"><small>Short buildup</small><b>44</b><em>COCHINSHIP</em></span><span class="q qu"><small>Short covering</small><b>75</b><em>RBLBANK</em></span><span class="q"><small>Long unwinding</small><b>28</b><em>ICICIBANK</em></span></div>',
    a:[[L.studio,'Open option chain']]}];
  var spot='<section class="spot" aria-roledescription="carousel" aria-label="Spotlight"><div class="sp-h"><b>Spotlight</b><span class="c" aria-live="polite">1 / '+SL.length+'</span><span class="sp"></span><button type="button" data-d="-1" aria-label="Previous">‹</button><button type="button" data-d="1" aria-label="Next">›</button></div>'+
    '<div class="sp-tr">'+SL.map(function(x,i){return '<article class="sl'+(i?'':' on')+'" aria-roledescription="slide" aria-label="'+(i+1)+' of '+SL.length+'" aria-hidden="'+(i?'true':'false')+'"><div class="kr"><span class="ic '+x.c+'">'+SVG(IC[x.ic],2)+'</span>'+x.k+'</div>'+
      '<div class="tt"><b>'+x.t+'</b>'+(x.v?'<span class="v">'+x.v+'</span>':'')+(x.d?'<span class="d">'+x.d+'</span>':'')+'</div><p>'+x.sub+'</p><div class="viz">'+x.viz+'</div>'+
      '<div class="ac">'+x.a.map(function(l,j){return '<a class="'+(j?'':'p')+'" href="'+l[0]+'"'+(i?' tabindex="-1"':'')+'>'+l[1]+' →</a>'}).join('')+'</div></article>'}).join('')+'</div>'+
    '<div class="dots" role="tablist" aria-label="Choose a slide">'+SL.map(function(_,i){return '<button type="button" role="tab" aria-label="Slide '+(i+1)+'" aria-selected="'+(i?'false':'true')+'"></button>'}).join('')+'</div></section>';

  /* ---------- your day ---------- */
  var C=D.calls,E=D.expiry,J=D.journal;
  var day='<nav class="day" aria-label="Your day"><ul>'+
    '<li><a href="'+L.calls+'"><span class="k">Trade calls</span><span class="m">'+C.n+' active</span><span class="s">'+C.lead+(C.more?' +'+C.more+' more':'')+'</span></a></li>'+
    '<li><a href="'+(todo?L.review:L.journal)+'"><span class="k">Journal</span><span class="m">'+(todo?'<i class="flag" aria-hidden="true"></i>'+todo+' trade'+(todo>1?'s':'')+' to review':'All trades reviewed')+'</span><span class="s">'+inr(J.net)+' this month · '+J.wr+'% wins</span></a></li>'+
    '<li><a href="'+L.fo+'"><span class="k">Nifty expiry</span><span class="m">'+E.day+'</span><span class="s">Max pain '+E.mp+'</span></a></li>'+
    '<li><a class="b-dash" href="'+L.dash+'"><span class="k">Dashboard</span><span class="m">Open your dashboard →</span><span class="s" id="dashS">Your cards, set up for you</span></a></li>'+
    '</ul></nav>';

  app.innerHTML=bar+'<main class="cm">'+hero+spot+'</main>'+day;
  var $=function(s){return document.querySelector(s)};

  /* dashboard line names the screen people chose */
  function dashLine(){try{var pf=JSON.parse(localStorage.getItem('ap-profile'));if(pf&&!pf.skipped&&window.apProfile)$('#dashS').textContent='Set up as '+window.apProfile.names[pf.preset]}catch(e){}}
  addEventListener('load',dashLine);document.addEventListener('click',function(e){if(e.target.closest('.ob-go,.ob-skip'))setTimeout(dashLine,50)});

  /* ---------- popovers ---------- */
  function pop(btn,panel){btn.addEventListener('click',function(e){e.stopPropagation();var o=panel.hidden;closeAll();panel.hidden=!o;btn.setAttribute('aria-expanded',String(o))})}
  function closeAll(){[['#stkB','#stkP'],['#mnB','#mnP']].forEach(function(p){$(p[1]).hidden=true;$(p[0]).setAttribute('aria-expanded','false')})}
  pop($('#stkB'),$('#stkP'));pop($('#mnB'),$('#mnP'));
  document.addEventListener('click',function(e){if(!e.target.closest('.pop'))closeAll()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
  $('#setupB').onclick=function(){closeAll();if(window.apProfile)window.apProfile.open()};
  var armed=0;$('#rstB').onclick=function(e){e.stopPropagation();var b=this;
    if(Date.now()-armed>4000){armed=Date.now();b.classList.add('arm');b.querySelector('small').textContent='tap again to confirm';setTimeout(function(){if(Date.now()-armed>=4000){b.classList.remove('arm');b.querySelector('small').textContent='clears this device'}},4100);return}
    try{Object.keys(localStorage).forEach(function(k){if(/^(ap-|sp-|today-)/.test(k))localStorage.removeItem(k)})}catch(err){}location.href='calm.html'};

  /* ---------- theme ---------- */
  var root=document.documentElement,SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',MOON='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  function isLight(){var t=root.getAttribute('data-theme');return t?t==='light':matchMedia('(prefers-color-scheme: light)').matches}
  function syncTheme(){var l=isLight();$('#thB').innerHTML=SVG(l?MOON:SUN);$('#thB').setAttribute('aria-label',l?'Switch to dark theme':'Switch to light theme')}
  if(!root.getAttribute('data-theme'))root.setAttribute('data-theme',isLight()?'light':'dark');
  syncTheme();$('#thB').onclick=function(){var t=isLight()?'dark':'light';root.setAttribute('data-theme',t);try{localStorage.setItem('today-theme',t)}catch(e){}syncTheme()};

  /* ---------- audio: plays in place, no bar at the bottom ---------- */
  var A=new Audio(D.audio.src);A.preload='none';var CH=D.audio.ch,pl=$('#pl'),lb=$('#lsB');
  function chAt(t){var i=0;CH.forEach(function(c,j){if(t>=c[1])i=j});return i}
  function paint(){var t=A.currentTime,d=A.duration||D.audio.dur,i=chAt(t);$('#plBar i').style.width=(t/d*100)+'%';$('#plBar').setAttribute('aria-valuenow',Math.round(t/d*100));
    $('#plCh').textContent='Chapter '+(i+1)+' of '+CH.length+' · '+CH[i][0];$('#plT').textContent=mmss(t)+' / '+mmss(d)}
  function setBtn(on){lb.querySelector('.pi').textContent=on?'❚❚':'▶';lb.querySelector('.lb').textContent=on?'Pause':(A.currentTime>0?'Resume':'Listen')}
  lb.onclick=function(){if(A.paused){pl.hidden=false;A.play().catch(function(){});setBtn(true);paint()}else{A.pause();setBtn(false)}};
  A.addEventListener('timeupdate',paint);A.addEventListener('ended',function(){setBtn(false);A.currentTime=0});
  $('#plBar').addEventListener('click',function(e){var r=this.getBoundingClientRect(),d=A.duration||D.audio.dur;A.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*d;paint()});
  $('#plBar').addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){A.currentTime=Math.max(0,A.currentTime+(e.key==='ArrowRight'?10:-10));paint();e.preventDefault()}});

  /* ---------- spotlight carousel ---------- */
  var sl=[].slice.call(document.querySelectorAll('.sl')),dots=[].slice.call(document.querySelectorAll('.dots button')),cur=0,timer,hold=false,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(i){cur=(i+sl.length)%sl.length;sl.forEach(function(s,j){var on=j===cur;s.classList.toggle('on',on);s.setAttribute('aria-hidden',String(!on));s.querySelectorAll('a').forEach(function(a){a.tabIndex=on?0:-1})});
    dots.forEach(function(d,j){d.setAttribute('aria-selected',String(j===cur))});$('.sp-h .c').textContent=(cur+1)+' / '+sl.length}
  function auto(){clearInterval(timer);if(!reduce)timer=setInterval(function(){if(!hold&&!document.hidden)go(cur+1)},7000)}
  document.querySelectorAll('.sp-h button').forEach(function(b){b.onclick=function(){go(cur+ +b.dataset.d);auto()}});
  dots.forEach(function(d,j){d.onclick=function(){go(j);auto()}});
  var spEl=$('.spot');spEl.addEventListener('mouseenter',function(){hold=true});spEl.addEventListener('mouseleave',function(){hold=false});
  spEl.addEventListener('focusin',function(){hold=true});spEl.addEventListener('focusout',function(){hold=false});
  spEl.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(cur+1);auto()}if(e.key==='ArrowLeft'){go(cur-1);auto()}});
  auto();
})();
