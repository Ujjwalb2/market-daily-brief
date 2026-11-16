/* Trade journal page (Idea B). Reads window.JD (sample trades) and renders a performance tracker:
   KPIs, equity curve with drawdown, plan score, P&L calendar with a written review of each day,
   breakdowns and a filterable trade log with a detail drawer. Notes are saved on this device. */
document.documentElement.classList.add('idea-jr');
addEventListener('DOMContentLoaded', function () {
  /* Trades fetched from the broker wait in a review inbox. Once the trader confirms one (setup, plan rules, mood, note)
     it joins the journal like any other trade. Decisions are saved on this device. */
  var BASE = window.JD || [], PEND = window.JDP || [], RKEY = 'ap-journal-review', rv = {};
  try { rv = JSON.parse(localStorage.getItem(RKEY)) || {} } catch (e) {}
  function saveRv() { try { localStorage.setItem(RKEY, JSON.stringify(rv)) } catch (e) {} }
  var MISTAKE = { stop: 'No stop-loss', size: 'Oversized', setup: 'Off-plan setup', revenge: 'Revenge trade', exit: 'Early or late exit' };
  var ALL = [];
  function mergeAll() {
    var mine = PEND.filter(function (p) { return rv[p.id] && rv[p.id].status === 'ok' }).map(function (p) {
      var r = rv[p.id], rules = r.rules || {}, t = JSON.parse(JSON.stringify(p));
      t.setup = r.setup; t.rules = rules; t.score = Object.keys(MISTAKE).filter(function (k) { return rules[k] }).length;
      t.mistakes = Object.keys(MISTAKE).filter(function (k) { return !rules[k] }).map(function (k) { return MISTAKE[k] });
      t.mood = r.mood || '–'; t.note = r.note || ''; t.confirmed = true; return t });
    ALL = BASE.concat(mine).sort(function (a, b) { return (a.d + a.t) < (b.d + b.t) ? -1 : 1 });
  }
  mergeAll();
  var main = document.querySelector('main');
  if (!main) return;
  var root = document.createElement('section'); root.className = 'jp'; root.setAttribute('aria-label', 'Trade journal');
  main.insertBefore(root, main.firstChild);
  var period = 'month', filt = 'all', setupF = 'all', selDay = null;
  var MONTHS = Array.from(new Set(ALL.map(function (t) { return t.d.slice(0, 7) }))).sort();
  var calMonth = MONTHS[MONTHS.length - 1];
  function mname(m, short) { return new Date(m + '-15T12:00:00').toLocaleDateString('en-IN', short ? { month: 'long' } : { month: 'long', year: 'numeric' }) }
  var NKEY = 'ap-journal-notes';
  var notes = {}; try { notes = JSON.parse(localStorage.getItem(NKEY)) || {} } catch (e) {}
  function saveNotes() { try { localStorage.setItem(NKEY, JSON.stringify(notes)) } catch (e) {} }
  var RULES = [['stop', 'Stop-loss placed before entry'], ['size', 'Size within planned risk'], ['setup', 'Setup from my playbook'], ['revenge', 'No revenge trade'], ['exit', 'Exited as planned']];
  function inr(v, sign) { var s = '₹' + Math.abs(Math.round(v)).toLocaleString('en-IN'); return (v < 0 ? '−' : (sign && v > 0 ? '+' : '')) + s }
  function dt(d) { return new Date(d + 'T12:00:00') }
  function dname(d) { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dt(d).getDay()] }
  function dlong(d) { return dt(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) }
  function hrs(m) { return m >= 1440 ? Math.round(m / 1440) + 'd' : m >= 60 ? (m / 60).toFixed(1).replace('.0', '') + 'h' : m + 'm' }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function inPeriod() { if (period === 'all') return ALL.slice(); var last = ALL.length ? ALL[ALL.length - 1].d : ''; if (period === 'week') { var e = dt(last), s = new Date(e); s.setDate(e.getDate() - 4); return ALL.filter(function (t) { return dt(t.d) >= s }) } return ALL.filter(function (t) { return t.d.slice(0, 7) === calMonth }) }
  function stats(tr) {
    var w = tr.filter(function (t) { return t.pnl > 0 }), l = tr.filter(function (t) { return t.pnl < 0 }), sum = function (a) { return a.reduce(function (s, t) { return s + t.pnl }, 0) };
    var gw = sum(w), gl = -sum(l), eq = 0, peak = 0, mdd = 0, R = tr.reduce(function (s, t) { return s + t.pnl / t.risk }, 0);
    tr.forEach(function (t) { eq += t.pnl; peak = Math.max(peak, eq); mdd = Math.max(mdd, peak - eq) });
    return { n: tr.length, net: gw - gl, wr: tr.length ? w.length / tr.length * 100 : 0, w: w.length, l: l.length, pf: gl ? gw / gl : 0, aw: w.length ? gw / w.length : 0, al: l.length ? gl / l.length : 0, exp: tr.length ? R / tr.length : 0, mdd: mdd }
  }
  function ring(p) { var r = 22, c = 2 * Math.PI * r; return '<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="' + r + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="6"/><circle cx="26" cy="26" r="' + r + '" fill="none" stroke="#00C99A" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (c * p / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 26 26)"/></svg>' }
  function equity(tr) {
    var W = 900, H = 230, P = 26, eq = 0, peak = 0, pts = [{ x: 0, v: 0, dd: 0 }];
    tr.forEach(function (t, i) { eq += t.pnl; peak = Math.max(peak, eq); pts.push({ x: i + 1, v: eq, dd: eq - peak }) });
    var mx = Math.max.apply(null, pts.map(function (p) { return p.v }).concat([0])), mn = Math.min.apply(null, pts.map(function (p) { return Math.min(p.v, p.dd) }).concat([0]));
    var X = function (i) { return P + i * (W - 2 * P) / Math.max(1, pts.length - 1) }, Y = function (v) { return 12 + (mx - v) / ((mx - mn) || 1) * (H - 40) };
    var line = pts.map(function (p, i) { return X(i).toFixed(1) + ',' + Y(p.v).toFixed(1) }).join(' ');
    var area = P + ',' + Y(0) + ' ' + line + ' ' + X(pts.length - 1).toFixed(1) + ',' + Y(0);
    var dd = pts.map(function (p, i) { return X(i).toFixed(1) + ',' + Y(0).toFixed(1) }).join(' ') + ' ' + pts.slice().reverse().map(function (p, j) { return X(pts.length - 1 - j).toFixed(1) + ',' + Y(p.dd).toFixed(1) }).join(' ');
    var days = [], lastD = ''; tr.forEach(function (t, i) { if (t.d !== lastD) { days.push('<text class="ax" x="' + X(i + 1).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + +t.d.slice(8) + '</text>'); lastD = t.d } });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Running P&L and drawdown over ' + tr.length + ' trades"><defs><linearGradient id="jpg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00C99A" stop-opacity=".25"/><stop offset="1" stop-color="#00C99A" stop-opacity="0"/></linearGradient></defs>' +
      [.25, .5, .75].map(function (f) { return '<line class="grid" x1="0" x2="' + W + '" y1="' + (12 + (H - 40) * f) + '" y2="' + (12 + (H - 40) * f) + '" vector-effect="non-scaling-stroke"/>' }).join('') +
      '<polygon class="dd" points="' + dd + '"/><polygon class="ar" points="' + area + '"/><line class="zero" x1="0" x2="' + W + '" y1="' + Y(0) + '" y2="' + Y(0) + '" vector-effect="non-scaling-stroke"/><polyline class="ln" points="' + line + '" vector-effect="non-scaling-stroke"/>' + days.join('') + '</svg>'
  }
  function planCard(tr) {
    var avg = tr.reduce(function (s, t) { return s + t.score }, 0) / (tr.length || 1);
    var rows = RULES.map(function (r) { var p = tr.filter(function (t) { return t.rules[r[0]] }).length / (tr.length || 1) * 100; return '<div class="jp-rule"><span>' + r[1] + '</span><span class="bar"><i class="' + (p < 75 ? 'w' : '') + '" style="width:' + p.toFixed(0) + '%"></i></span><b>' + p.toFixed(0) + '%</b></div>' }).join('');
    var full = tr.filter(function (t) { return t.score === 5 }), rest = tr.filter(function (t) { return t.score < 5 }), sf = full.reduce(function (s, t) { return s + t.pnl }, 0), sr = rest.reduce(function (s, t) { return s + t.pnl }, 0);
    return '<div class="jp-card jp-plan"><h2>Plan score <small>every trade checked against your 5 rules</small></h2><div class="big"><b>' + avg.toFixed(1) + '</b><span>out of 5, average per trade</span></div>' + rows +
      '<p class="jp-note">Trades that followed <b>all 5 rules</b> made <b class="' + (sf >= 0 ? 'up' : 'dn') + '">' + inr(sf, 1) + '</b> across ' + full.length + ' trades. The other ' + rest.length + ' made <b class="' + (sr >= 0 ? 'up' : 'dn') + '">' + inr(sr, 1) + '</b>.</p></div>'
  }
  function calendar() {
    /* always the full calendar month on screen, whatever the period filter; arrows move between months */
    var byD = {}; ALL.forEach(function (t) { if (t.d.slice(0, 7) === calMonth) (byD[t.d] = byD[t.d] || []).push(t) });
    var y = +calMonth.slice(0, 4), mo = +calMonth.slice(5, 7) - 1, first = new Date(y, mo, 1, 12), last = new Date(y, mo + 1, 0, 12);
    var monday = new Date(first); monday.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    var cells = '<div class="hd">Mon</div><div class="hd">Tue</div><div class="hd">Wed</div><div class="hd">Thu</div><div class="hd">Fri</div><div class="hd">Week</div>', mt = 0, mn = 0, md = 0;
    for (var w = new Date(monday); w <= last; w.setDate(w.getDate() + 7)) {
      var wk = 0, wn = 0;
      for (var i = 0; i < 5; i++) {
        var d = new Date(w); d.setDate(w.getDate() + i); var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), a = byD[key], out = d.getMonth() !== mo;
        if (a) { var p = a.reduce(function (s, t) { return s + t.pnl }, 0); wk += p; wn += a.length; md++; cells += '<button type="button" class="jp-day ' + (p >= 0 ? 'g' : 'r') + (selDay === key ? ' sel' : '') + '" data-d="' + key + '"><span class="n">' + d.getDate() + '</span><b>' + inr(p, 1) + '</b><small>' + a.length + ' trade' + (a.length > 1 ? 's' : '') + '</small></button>' }
        else cells += '<div class="jp-day e' + (out ? ' o' : '') + '"><span class="n">' + d.getDate() + '</span>' + (out ? '' : '<small>No trades</small>') + '</div>'
      }
      mt += wk; mn += wn;
      cells += '<div class="jp-wk">Week<b class="' + (wk >= 0 ? 'up' : 'dn') + '">' + (wn ? inr(wk, 1) : '–') + '</b>' + wn + ' trades</div>'
    }
    var i0 = MONTHS.indexOf(calMonth);
    return '<div class="jp-card jp-calc"><h2><span class="jp-mn"><button type="button" class="jp-mv" data-m="-1" aria-label="Previous month"' + (i0 <= 0 ? ' disabled' : '') + '>‹</button><span class="jp-ml">' + mname(calMonth) + '</span><button type="button" class="jp-mv" data-m="1" aria-label="Next month"' + (i0 >= MONTHS.length - 1 ? ' disabled' : '') + '>›</button></span>' +
      '<span class="sp"></span><small><b class="' + (mt >= 0 ? 'up' : 'dn') + '">' + inr(mt, 1) + '</b> · ' + mn + ' trades · ' + md + ' days</small></h2>' +
      '<div class="jp-mtabs" role="tablist" aria-label="Months">' + MONTHS.map(function (m) { return '<button type="button" data-cm="' + m + '" aria-selected="' + (m === calMonth) + '">' + mname(m, 1).slice(0, 3) + '</button>' }).join('') + '</div><div class="jp-cal">' + cells + '</div><p class="jp-foot" style="margin-top:10px">Tap a day for its review.</p></div>'
  }
  function goMonth(m) { if (MONTHS.indexOf(m) < 0) return; calMonth = m; period = 'month'; var ds = ALL.filter(function (t) { return t.d.slice(0, 7) === m }); selDay = ds.length ? ds[ds.length - 1].d : null; render() }
  function review(day) {
    var tr = ALL.filter(function (t) { return t.d === day }); if (!tr.length) return '';
    var net = tr.reduce(function (s, t) { return s + t.pnl }, 0), w = tr.filter(function (t) { return t.pnl > 0 }), l = tr.filter(function (t) { return t.pnl < 0 });
    var best = tr.reduce(function (a, t) { return t.pnl > a.pnl ? t : a }), worst = tr.reduce(function (a, t) { return t.pnl < a.pnl ? t : a });
    var broke = tr.filter(function (t) { return t.score < 5 }), brokeP = broke.reduce(function (s, t) { return s + t.pnl }, 0);
    var s1 = 'You ' + (net >= 0 ? 'made <b class="up">' + inr(net) + '</b>' : 'lost <b class="dn">' + inr(-net) + '</b>') + ' across ' + tr.length + ' trade' + (tr.length > 1 ? 's' : '') + ': ' + w.length + ' green, ' + l.length + ' red.';
    var s2 = ' The best was <b>' + esc(best.sym) + '</b> at ' + best.t + ' (' + inr(best.pnl, 1) + ', ' + esc(best.setup.toLowerCase()) + ').';
    var s3 = worst.pnl < 0 ? ' The weakest was <b>' + esc(worst.sym) + '</b> at ' + worst.t + ' (' + inr(worst.pnl, 1) + ')' + (worst.mistakes.length ? ', flagged for ' + esc(worst.mistakes.join(' and ').toLowerCase()) + '.' : '.') : '';
    var s4 = broke.length ? ' ' + broke.length + ' trade' + (broke.length > 1 ? 's' : '') + ' broke a rule; together ' + (brokeP >= 0 ? 'they still made ' : 'they cost you ') + '<b>' + inr(Math.abs(brokeP)) + '</b>.' : ' Every trade followed your plan.';
    var n = notes[day] || {};
    var fills = tr.map(function (t) { return '<tr><td>' + t.t + '</td><td><b>' + esc(t.sym) + '</b></td><td>' + t.side + ' ' + t.qty + '</td><td class="n">' + t.en.toLocaleString('en-IN') + ' → ' + t.ex.toLocaleString('en-IN') + '</td><td class="n"><b class="' + (t.pnl >= 0 ? 'up' : 'dn') + '">' + inr(t.pnl, 1) + '</b></td></tr>' }).join('');
    return '<div class="jp-card jp-rev"><h2>' + dlong(day) + ' <span class="jp-ai">✨ Day review</span><span class="sp"></span><small id="jpSaved"></small></h2><p class="story">' + s1 + s2 + s3 + s4 + '</p><table class="jp-fills"><tbody>' + fills + '</tbody></table>' +
      '<div class="jp-notes"><label>Pre-market plan<textarea data-n="pre" placeholder="Levels to watch, setups you will take, max loss for the day">' + esc(n.pre || '') + '</textarea></label><label>Post-market review<textarea data-n="post" placeholder="What went well, what to repeat, what to stop">' + esc(n.post || '') + '</textarea></label></div>' +
      '<div class="jp-mood">How did you feel? ' + ['Calm', 'Focused', 'Confident', 'Rushed', 'Anxious', 'Frustrated'].map(function (m) { return '<button type="button" data-mood="' + m + '" aria-pressed="' + (n.mood === m) + '">' + m + '</button>' }).join('') + '</div></div>'
  }
  function breakdowns(tr) {
    function group(keyf, order) { var g = {}; tr.forEach(function (t) { var k = keyf(t); (g[k] = g[k] || []).push(t) }); var ks = order || Object.keys(g); return ks.filter(function (k) { return g[k] }).map(function (k) { var a = g[k], p = a.reduce(function (s, t) { return s + t.pnl }, 0), w = a.filter(function (t) { return t.pnl > 0 }).length; return { k: k, p: p, n: a.length, wr: w / a.length * 100 } }) }
    function block(title, rows) { var mx = Math.max.apply(null, rows.map(function (r) { return Math.abs(r.p) }).concat([1])); return '<div class="jp-bl"><h2>' + title + '</h2>' + rows.map(function (r) { var w = Math.abs(r.p) / mx * 50; return '<div class="r"><span>' + esc(r.k) + ' <small style="color:var(--text-tertiary)">· ' + r.n + ' · ' + r.wr.toFixed(0) + '% wins</small></span><b class="' + (r.p >= 0 ? 'up' : 'dn') + '">' + inr(r.p, 1) + '</b><span class="bar"><i style="' + (r.p >= 0 ? 'left:50%;width:' + w + '%;background:var(--teal)' : 'right:50%;width:' + w + '%;background:var(--slate-500,#7B8799)') + '"></i></span></div>' }).join('') + '</div>' }
    var tod = function (t) { var h = +t.t.slice(0, 2); return h < 11 ? 'Morning (9:15–11)' : h < 13 ? 'Midday (11–1)' : 'Afternoon (1–3:30)' };
    return '<div class="jp-card"><div class="jp-brk">' + block('By setup', group(function (t) { return t.setup })) + block('By weekday', group(function (t) { return dname(t.d) }, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])) +
      block('By time of day', group(tod, ['Morning (9:15–11)', 'Midday (11–1)', 'Afternoon (1–3:30)'])) + block('By instrument', group(function (t) { return t.kind === 'Option' ? 'Options' : 'Stocks' })) + '</div></div>'
  }
  function table(tr) {
    var setups = Array.from(new Set(ALL.map(function (t) { return t.setup })));
    var rows = tr.filter(function (t) { return (filt === 'all' || (filt === 'win' && t.pnl > 0) || (filt === 'loss' && t.pnl < 0) || (filt === 'opt' && t.kind === 'Option') || (filt === 'eq' && t.kind === 'Equity')) && (setupF === 'all' || t.setup === setupF) }).slice().reverse();
    return '<div class="jp-card"><h2>All trades <small>' + rows.length + ' shown · tap a trade for details</small></h2><div class="jp-tf"><div class="jp-seg" role="group" aria-label="Filter trades">' + [['all', 'All'], ['win', 'Wins'], ['loss', 'Losses'], ['opt', 'Options'], ['eq', 'Stocks']].map(function (f) { return '<button type="button" data-f="' + f[0] + '" aria-pressed="' + (filt === f[0]) + '">' + f[1] + '</button>' }).join('') + '</div>' +
      '<select aria-label="Filter by setup" id="jpSetup"><option value="all">All setups</option>' + setups.map(function (s) { return '<option' + (setupF === s ? ' selected' : '') + '>' + esc(s) + '</option>' }).join('') + '</select></div>' +
      '<div class="jp-tbl"><table><thead><tr><th>Date</th><th>Time</th><th>Instrument</th><th>Setup</th><th>Plan</th><th>Side</th><th class="n">Qty</th><th class="n">Entry</th><th class="n">Exit</th><th class="n">Held</th><th class="n">R</th><th class="n">P&L</th></tr></thead><tbody>' +
      rows.map(function (t) { var i = ALL.indexOf(t); return '<tr data-i="' + i + '"><td>' + dname(t.d) + ' ' + +t.d.slice(8) + ' Nov</td><td>' + t.t + '</td><td><b>' + esc(t.sym) + '</b>' + (t.mistakes.indexOf('Revenge trade') >= 0 ? ' <span class="jp-tag w">revenge</span>' : '') + '</td><td><span class="jp-tag">' + esc(t.setup) + '</span></td><td><span class="jp-dots" title="' + t.score + ' of 5 rules">' + RULES.map(function (r) { return '<i class="' + (t.rules[r[0]] ? 'on' : '') + '"></i>' }).join('') + '</span></td><td>' + t.side + '</td><td class="n">' + t.qty + '</td><td class="n">' + t.en.toLocaleString('en-IN') + '</td><td class="n">' + t.ex.toLocaleString('en-IN') + '</td><td class="n">' + hrs(t.held) + '</td><td class="n">' + (t.pnl / t.risk).toFixed(1) + 'R</td><td class="n"><b class="' + (t.pnl >= 0 ? 'up' : 'dn') + '">' + inr(t.pnl, 1) + '</b></td></tr>' }).join('') + '</tbody></table></div></div>'
  }
  var dr = document.createElement('aside'); dr.className = 'jp-dr'; dr.setAttribute('role', 'dialog'); dr.setAttribute('aria-label', 'Trade details'); document.body.appendChild(dr);
  function openTrade(i) {
    var t = ALL[i]; if (!t) return;
    dr.innerHTML = '<button type="button" class="x" aria-label="Close">✕</button><h3>' + esc(t.sym) + '</h3><div class="sub">' + dlong(t.d) + ' · ' + t.t + ' · ' + esc(t.setup) + '</div>' +
      '<div class="grid2"><div><span>P&L</span><b class="' + (t.pnl >= 0 ? 'up' : 'dn') + '">' + inr(t.pnl, 1) + '</b></div><div><span>R multiple</span><b>' + (t.pnl / t.risk).toFixed(2) + 'R</b></div><div><span>Entry → exit</span><b>' + t.en + ' → ' + t.ex + '</b></div><div><span>Held</span><b>' + hrs(t.held) + '</b></div><div><span>Quantity</span><b>' + t.side + ' ' + t.qty + '</b></div><div><span>Risk planned</span><b>' + inr(t.risk) + '</b></div></div>' +
      '<h2 style="font:600 14px/1.2 var(--font-sans);margin:0 0 8px;color:var(--text-primary)">Plan check · ' + t.score + ' of 5</h2><ul class="jp-chk">' + RULES.map(function (r) { var ok = t.rules[r[0]]; return '<li class="' + (ok ? '' : 'no') + '"><i>' + (ok ? '✓' : '!') + '</i>' + r[1] + '</li>' }).join('') + '</ul>' +
      '<div class="sub">Feeling at entry: <b style="color:var(--text-primary)">' + esc(t.mood) + '</b></div><p class="jp-foot">Sample trade. Charges and taxes are not deducted.</p>';
    dr.classList.add('open'); dr.querySelector('.x').onclick = function () { dr.classList.remove('open') }
  }
  /* review inbox */
  function inbox() {
    if (!PEND.length) return '';
    var todo = PEND.filter(function (p) { return !rv[p.id] }), done = PEND.filter(function (p) { return rv[p.id] && rv[p.id].status === 'ok' });
    var d0 = PEND[0].d, head = '<h2><span class="jp-inb-t">📥 Fetched from your broker</span><small>' + dlong(d0) + ' · ' + PEND.length + ' trades</small><span class="sp"></span>' +
      (todo.length ? '<span class="jp-badge">' + todo.length + ' to review</span>' : '<span class="jp-badge ok">✓ All reviewed</span>') + '</h2>';
    var rows = PEND.map(function (p) { var st = rv[p.id];
      return '<tr class="' + (st ? (st.status === 'ok' ? 'ok' : 'skip') : 'todo') + '"><td>' + p.t + '</td><td><b>' + esc(p.sym) + '</b></td><td>' + p.side + ' ' + p.qty + '</td><td class="n">' + p.en.toLocaleString('en-IN') + ' → ' + p.ex.toLocaleString('en-IN') + '</td><td class="n">' + hrs(p.held) + '</td><td class="n"><b class="' + (p.pnl >= 0 ? 'up' : 'dn') + '">' + inr(p.pnl, 1) + '</b></td>' +
        '<td>' + (st ? (st.status === 'ok' ? '<span class="jp-tag ok">✓ ' + esc(st.setup) + '</span>' : '<span class="jp-tag">Not mine</span>') : '<span class="jp-tag w">Needs review</span>') + '</td>' +
        '<td class="n"><button type="button" class="jp-rv' + (st ? ' ghost' : '') + '" data-rv="' + p.id + '">' + (st ? 'Edit' : 'Review') + '</button></td></tr>' }).join('');
    return '<div class="jp-card jp-inb' + (todo.length ? '' : ' done') + '" id="review">' + head +
      '<p class="jp-inb-p">Your broker sends the time, instrument, quantity and prices. You add what only you know: the <b>setup</b>, which <b>plan rules</b> you followed, and how you felt. Confirmed trades join your journal' + (done.length ? ' (' + done.length + ' added so far)' : '') + '.</p>' +
      '<div class="jp-tbl jp-inb-tbl"><table><thead><tr><th>Time</th><th>Instrument</th><th>Side</th><th class="n">Entry → exit</th><th class="n">Held</th><th class="n">P&L</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>'
  }
  function reviewForm(id) {
    var p = PEND.filter(function (x) { return x.id === id })[0]; if (!p) return; var prev = rv[id] && rv[id].status === 'ok' ? rv[id] : {};
    var setups = Array.from(new Set(BASE.map(function (t) { return t.setup })));
    var rules = prev.rules || { stop: true, size: true, setup: true, revenge: true, exit: true };
    dr.innerHTML = '<button type="button" class="x" aria-label="Close">✕</button><h3>Review trade</h3><div class="sub">Fetched from your broker · ' + dlong(p.d) + ' · ' + p.t + '</div>' +
      '<div class="grid2"><div><span>Instrument</span><b>' + esc(p.sym) + '</b></div><div><span>P&L</span><b class="' + (p.pnl >= 0 ? 'up' : 'dn') + '">' + inr(p.pnl, 1) + '</b></div><div><span>Side · qty</span><b>' + p.side + ' ' + p.qty + '</b></div><div><span>Entry → exit</span><b>' + p.en + ' → ' + p.ex + '</b></div><div><span>Held</span><b>' + hrs(p.held) + '</b></div><div><span>Planned risk</span><b>' + inr(p.risk) + '</b></div></div>' +
      '<form class="jp-rf"><label class="jp-fl">Setup <em>required</em><select name="setup" aria-required="true"><option value="">Choose the setup you traded</option>' + setups.map(function (s) { return '<option' + (prev.setup === s ? ' selected' : '') + '>' + esc(s) + '</option>' }).join('') + '<option value="__other"' + (prev.setup && setups.indexOf(prev.setup) < 0 ? ' selected' : '') + '>Other…</option></select></label>' +
      '<input class="jp-oth" name="other" placeholder="Name your setup" value="' + (prev.setup && setups.indexOf(prev.setup) < 0 ? esc(prev.setup) : '') + '"' + (prev.setup && setups.indexOf(prev.setup) < 0 ? '' : ' hidden') + '>' +
      '<div class="jp-fl">Plan check <em>untick any rule you broke</em></div><ul class="jp-chk jp-chkf">' + RULES.map(function (r) { return '<li><label><input type="checkbox" name="r_' + r[0] + '"' + (rules[r[0]] ? ' checked' : '') + '>' + r[1] + '</label></li>' }).join('') + '</ul>' +
      '<div class="jp-fl">How did you feel?</div><div class="jp-mood jp-moodf">' + ['Calm', 'Focused', 'Confident', 'Rushed', 'Anxious', 'Frustrated'].map(function (m) { return '<button type="button" data-fm="' + m + '" aria-pressed="' + (prev.mood === m) + '">' + m + '</button>' }).join('') + '</div>' +
      '<label class="jp-fl">Note <em>optional</em><textarea name="note" placeholder="Why you took it, what you would do differently">' + esc(prev.note || '') + '</textarea></label>' +
      '<p class="jp-err" hidden>Choose a setup to confirm this trade.</p>' +
      '<div class="jp-rf-f"><button type="button" class="jp-skip" data-skip="' + id + '">Not my trade</button><button type="submit" class="jp-ok">Confirm & add to journal</button></div></form>';
    dr.classList.add('open');
    var f = dr.querySelector('form'), mood = prev.mood || '';
    dr.querySelector('.x').onclick = function () { dr.classList.remove('open') };
    f.setup.onchange = function () { var o = f.setup.value === '__other'; f.other.hidden = !o; if (o) f.other.focus() };
    dr.querySelectorAll('[data-fm]').forEach(function (b) { b.onclick = function () { mood = b.dataset.fm; dr.querySelectorAll('[data-fm]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }) } });
    dr.querySelector('[data-skip]').onclick = function () { rv[id] = { status: 'skip' }; saveRv(); mergeAll(); dr.classList.remove('open'); render() };
    f.onsubmit = function (e) { e.preventDefault(); var setup = f.setup.value === '__other' ? f.other.value.trim() : f.setup.value;
      if (!setup) { dr.querySelector('.jp-err').hidden = false; f.setup.focus(); return }
      var rr = {}; RULES.forEach(function (r) { rr[r[0]] = f['r_' + r[0]].checked });
      rv[id] = { status: 'ok', setup: setup, rules: rr, mood: mood, note: f.note.value.trim() }; saveRv(); mergeAll();
      MONTHS = Array.from(new Set(ALL.map(function (t) { return t.d.slice(0, 7) }))).sort();
      var next = PEND.filter(function (x) { return !rv[x.id] })[0]; render(); if (next) reviewForm(next.id); else dr.classList.remove('open') }
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dr.classList.remove('open') });
  document.addEventListener('mousedown', function (e) { if (dr.classList.contains('open') && !dr.contains(e.target) && !e.target.closest('.jp-tbl tbody tr') && !e.target.closest('[data-rv]')) dr.classList.remove('open') });
  function render() {
    var tr = inPeriod(), s = stats(tr), inCal = ALL.filter(function (t) { return t.d.slice(0, 7) === calMonth });
    if (!selDay || selDay.slice(0, 7) !== calMonth) selDay = inCal.length ? inCal[inCal.length - 1].d : null;
    root.innerHTML = '<div class="jp-h"><h1>Trade journal</h1><span class="jp-chip">Sample account</span><span class="sp"></span><div class="jp-seg" role="group" aria-label="Period">' + [['week', 'This week'], ['month', mname(calMonth, 1)], ['all', 'All time']].map(function (p) { return '<button type="button" data-p="' + p[0] + '" aria-pressed="' + (period === p[0]) + '">' + p[1] + '</button>' }).join('') + '</div><a class="jp-back" href="idea-b-dashboard.html">← Dashboard</a></div>' + inbox() +
      '<div class="jp-kpi"><div class="jp-k"><span>Net P&L</span><b class="' + (s.net >= 0 ? 'up' : 'dn') + '">' + inr(s.net, 1) + '</b><small>' + s.n + ' closed trades</small></div>' +
      '<div class="jp-k ring">' + ring(s.wr) + '<span>Win rate</span><b>' + s.wr.toFixed(0) + '%</b><small>' + s.w + ' won · ' + s.l + ' lost</small></div>' +
      '<div class="jp-k"><span>Profit factor</span><b>' + s.pf.toFixed(2) + '</b><small>gross win ÷ gross loss</small></div>' +
      '<div class="jp-k"><span>Expectancy</span><b class="' + (s.net >= 0 ? 'up' : 'dn') + '">' + inr(s.n ? s.net / s.n : 0, 1) + '</b><small>average per trade · ' + (s.exp >= 0 ? '+' : '−') + Math.abs(s.exp).toFixed(2) + 'R</small></div>' +
      '<div class="jp-k"><span>Avg win / loss</span><b>' + (s.al ? (s.aw / s.al).toFixed(2) : '0') + '×</b><small>' + inr(s.aw) + ' / ' + inr(s.al) + '</small></div>' +
      '<div class="jp-k"><span>Max drawdown</span><b class="dn">' + inr(-s.mdd) + '</b><small>from the running peak</small></div></div>' +
      '<div class="jp-row"><div class="jp-card jp-eq"><h2>Equity curve <small>running P&L, grey is drawdown from the peak</small></h2>' + equity(tr) + '<div class="jp-leg"><span><i style="background:var(--teal)"></i>Running P&L</span><span><i style="background:rgba(123,135,153,.5)"></i>Drawdown</span><span style="margin-left:auto">x-axis: trading day</span></div></div>' + planCard(tr) + '</div>' +
      '<div class="jp-row b">' + calendar() + review(selDay) + '</div>' + breakdowns(tr) + table(tr) +
      '<p class="jp-foot">Sample trades to show how your journal looks. Charges and taxes are not deducted. Notes and moods you add are saved on this device.</p>';
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button,[data-i]'); if (!b) return;
    if (b.dataset.rv) { reviewForm(b.dataset.rv); return }
    if (b.dataset.m) { goMonth(MONTHS[MONTHS.indexOf(calMonth) + (+b.dataset.m)]); return }
    if (b.dataset.cm) { goMonth(b.dataset.cm); return }
    if (b.dataset.p) { period = b.dataset.p; render(); return }
    if (b.dataset.f) { filt = b.dataset.f; render(); return }
    if (b.dataset.d) { selDay = b.dataset.d; render(); return }
    if (b.dataset.mood) { (notes[selDay] = notes[selDay] || {}).mood = b.dataset.mood; saveNotes(); render(); return }
    if (b.dataset.i) openTrade(+b.dataset.i)
  });
  root.addEventListener('change', function (e) { if (e.target.id === 'jpSetup') { setupF = e.target.value; render() } });
  var tmr; root.addEventListener('input', function (e) { var k = e.target.dataset && e.target.dataset.n; if (!k) return; (notes[selDay] = notes[selDay] || {})[k] = e.target.value; clearTimeout(tmr); tmr = setTimeout(function () { saveNotes(); var s = document.getElementById('jpSaved'); if (s) { s.textContent = 'Saved'; s.className = 'jp-saved' } }, 400) });
  render();
  if (location.hash === '#review') setTimeout(function () { var r = document.getElementById('review'); if (r) r.scrollIntoView({ block: 'start' }) }, 200);
});
