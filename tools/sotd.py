"""Stock of the day: one card, shared by the Home builder and the redesign page.

Pick rule (Nifty 500, last close): within 3% of, or above, the 52-week high; up on the day;
volume at least 1.5x its 20-day average; delivery at least 35%; close above the 20-day average.
Highest score wins (volume multiple, day change, delivery, distance to the high).
Sources: NSE security-wise bhavcopy (21+ sessions) and NSE CM 52-week high/low file.

render() returns (css, html). CSS uses AlphaPad tokens and only `sd-` class names, so it can be
dropped into either page. Braces are NOT doubled: callers insert the strings into their output
after any f-string formatting.
"""

SOTD = {
    'date': '11 Nov',
    's': 'NAVINFLUOR', 'name': 'Navin Fluorine International', 'ind': 'Chemicals', 'fo': True,
    'close': 9659.0, 'chg': 5.97, 'day_hi': 9666.0,
    'old_hi': 9245.0, 'old_hi_d': '8 Nov', 'l52': 5440.0, 'l52_d': '9 Dec 2025',
    'vx': 3.1, 'dl': 44.8, 'sma20': 8386.55, 'oi': 68.8,
    'closes': [8136.5, 8272.0, 8536.0, 8490.0, 8417.5, 8352.5, 8561.0, 8468.0, 8457.0, 8247.5, 8167.0, 8152.5, 8014.5,
               7946.5, 7668.5, 7662.0, 8254.0, 8501.0, 8260.5, 8680.0, 8406.0, 8530.0, 8785.0, 8845.0, 9010.0, 9115.0, 9659.0],
    'others': [('PNB', 'Punjab National Bank', 4.77, '+2.5% above 52W high'), ('PETRONET', 'Petronet LNG', 2.92, '+1.0% above 52W high')],
}

SCREENER = 'https://dev.alphapad.in/screener'
STUDIO = 'https://dev.alphapad.in/option-studio'


# Compact layout for a card that gets about half a page's width (wrap the card in .sd-half).
HALF_CSS = '.sd-half .sd{flex:1}.sd-half .sd-f{margin-top:auto}@container (min-width:500px){.sd-half .sd-in{flex:1;gap:10px 18px;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);grid-template-rows:auto auto auto minmax(0,1fr) auto auto;grid-template-areas:"top viz" "h3 viz" "px viz" "risk viz" "why why" "sig sig"}.sd-half .sd-id,.sd-half .sd-side{display:contents}.sd-half .sd-top{grid-area:top}.sd-half .sd h3{grid-area:h3}.sd-half .sd-px{grid-area:px}.sd-half .sd-risk{grid-area:risk;align-self:start}.sd-half .sd-why{grid-area:why;font-size:13px;line-height:1.5}.sd-half .sd-viz{grid-area:viz;gap:8px}.sd-half .sd-chart{flex:1;min-height:120px}.sd-half .sd-sig{grid-area:sig;grid-template-columns:repeat(4,minmax(0,1fr))}.sd-half .sd-sig li{padding:8px 10px}.sd-half .sd-sig small{display:none}.sd-half .sd-sig b{font-size:17px}.sd-half .sd-oth{display:none}.sd-half .sd{padding:16px 18px;gap:10px}.sd-half .sd-f{padding-top:10px}}@container (min-width:500px) and (max-width:580px){.sd-half .sd-in{grid-template-rows:auto auto minmax(0,1fr) auto auto auto;grid-template-areas:"top top" "h3 viz" "px viz" "why why" "risk risk" "sig sig"}.sd-half .sd-chart{min-height:100px}.sd-half .sd-sig b{font-size:15px}.sd-half .sd-sig span{font-size:10.5px}}@container (max-width:640px){.sd-half .sd-f>span:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1 1 0}.sd-half .sd-f{flex-wrap:nowrap}}'


def _inr(v, d=0):
    s = f'{v:,.{d}f}'
    return '₹' + s


def _chart(d, W=520, H=150, P=10):
    v = d['closes']; lo = min(v + [d['old_hi']]); hi = max(v + [d['day_hi']]); pad = (hi - lo) * .08
    X = lambda i: P + i * (W - 2 * P) / (len(v) - 1)
    Y = lambda y: P + (hi + pad - y) / (hi - lo + 2 * pad) * (H - 2 * P)
    pts = ' '.join(f'{X(i):.1f},{Y(y):.1f}' for i, y in enumerate(v))
    yo = Y(d['old_hi'])
    return (f'<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" class="sd-svg" role="img" '
            f'aria-label="{d["s"]} closes over the last {len(v)} sessions, ending above its old 52-week high of {_inr(d["old_hi"])}">'
            f'<defs><linearGradient id="sdg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00C99A" stop-opacity=".28"/>'
            f'<stop offset="1" stop-color="#00C99A" stop-opacity="0"/></linearGradient></defs>'
            f'<rect x="0" y="0" width="{W}" height="{yo:.1f}" class="sd-zone"/>'
            f'<polygon points="{P},{H} {pts} {X(len(v)-1):.1f},{H}" fill="url(#sdg)"/>'
            f'<line x1="0" x2="{W}" y1="{yo:.1f}" y2="{yo:.1f}" class="sd-old" vector-effect="non-scaling-stroke"/>'
            f'<polyline points="{pts}" class="sd-line" vector-effect="non-scaling-stroke"/></svg>'
            f'<span class="sd-oldl" style="top:{yo/H*100:.1f}%">Old 52-week high {_inr(d["old_hi"])} · {d["old_hi_d"]}</span>'
            f'<span class="sd-now" style="left:{X(len(v)-1)/W*100:.1f}%;top:{Y(v[-1])/H*100:.1f}%"><em>New high</em></span>')


def render(d=SOTD):
    above = (d['close'] / d['old_hi'] - 1) * 100
    vs20 = (d['close'] / d['sma20'] - 1) * 100
    rng = (d['close'] - d['l52']) / (d['day_hi'] - d['l52']) * 100
    fo = '<span class="sd-fo">F&amp;O</span>' if d['fo'] else ''
    sig = [
        ('Volume', f'{d["vx"]:g}×', '20-day average', min(d['vx'] / 4, 1)),
        ('Delivery', f'{d["dl"]:.0f}%', 'of traded shares', d['dl'] / 100),
        ('Above 20-day avg', f'+{vs20:.1f}%', f'avg {_inr(d["sma20"])}', min(vs20 / 20, 1)),
        ('Futures OI', f'+{d["oi"]:.0f}%', 'long buildup', min(d['oi'] / 100, 1)),
    ]
    sigs = ''.join(f'<li><span>{a}</span><b>{b}</b><small>{c}</small><i class="sd-m"><i style="width:{w*100:.0f}%"></i></i></li>' for a, b, c, w in sig)
    others = ''.join(f'<li><b>{s}</b><span>{n}</span><em>{t}</em><span class="sd-up">+{c:.2f}%</span></li>' for s, n, c, t in d['others'])
    html = f'''<article class="sd" aria-labelledby="sdH">
  <div class="sd-in">
    <div class="sd-id">
      <div class="sd-top"><span class="sd-eye">Stock of the day · {d["date"]}</span><span class="sd-tag">▲ Fresh 52-week high</span></div>
      <h3 id="sdH"><span class="sd-av" aria-hidden="true">{d["s"][:2]}</span><span><span class="sd-nm"><b>{d["s"]}</b>{fo}</span><small>{d["name"]} · {d["ind"]}</small></span></h3>
      <div class="sd-px"><b>{_inr(d["close"])}</b><span class="sd-up">▲ +{d["chg"]:.2f}%</span></div>
      <p class="sd-why">Closed at a fresh 52-week high, <b>{above:.1f}% above</b> its old peak of {_inr(d["old_hi"])}, on <b>{d["vx"]:g}× its usual volume</b>. Futures OI rose {d["oi"]:.0f}% with the price: fresh buying. Breakouts on heavy volume tend to hold better than quiet ones.</p>
      <p class="sd-risk"><b>What would undo it:</b> a close back below {_inr(d["old_hi"])}.</p>
    </div>
    <div class="sd-viz">
      <div class="sd-chart">{_chart(d)}</div>
      <div class="sd-rng" role="img" aria-label="52-week range {_inr(d["l52"])} to {_inr(d["day_hi"])}; close at {rng:.0f}% of the range">
        <div class="sd-rng-h"><span>52-week range</span><span>{rng:.0f}% of range</span></div>
        <div class="sd-rng-b"><i style="width:{rng:.1f}%"></i><span style="left:{rng:.1f}%"></span></div>
        <div class="sd-rng-l"><span>Low {_inr(d["l52"])}<small>{d["l52_d"]}</small></span><span>High {_inr(d["day_hi"])}<small>{d["date"]}</small></span></div>
      </div>
    </div>
    <div class="sd-side">
      <ul class="sd-sig" aria-label="Why it was picked">{sigs}</ul>
      <div class="sd-oth"><span class="sd-eye">Also at 52-week highs</span><ul>{others}</ul></div>
    </div>
  </div>
  <div class="sd-f"><span title="Nifty 500 stocks within 3% of, or above, their 52-week high; up on the day; volume at least 1.5× the 20-day average; delivery at least 35%; above the 20-day average. Highest score wins.">How it is picked: near 52-week high + heavy volume + strong delivery · NSE data · not a recommendation</span>
    <span class="sd-links"><a href="{STUDIO}">Option chain →</a><a href="{SCREENER}">Screen similar →</a></span></div>
</article>'''
    css = '''
.sd{container-type:inline-size;display:flex;flex-direction:column;gap:14px;padding:20px;border-radius:var(--radius-16,16px);background:var(--surface-raised);border:1px solid var(--border-decorative);min-width:0}
.sd-in{display:grid;grid-template-columns:1fr;gap:18px}
@container (min-width:560px){.sd-in{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.sd-side{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px}}
@container (min-width:1000px){.sd-in{grid-template-columns:minmax(0,1.05fr) minmax(0,1.2fr) minmax(0,1fr)}.sd-side{grid-column:auto;display:flex;flex-direction:column;gap:14px}}
.sd-id{display:flex;flex-direction:column;gap:10px;min-width:0}
.sd-top{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.sd-eye{font:600 11px/1.2 var(--font-sans);letter-spacing:1.1px;text-transform:uppercase;color:var(--text-tertiary)}
.sd-tag{font:600 11px/1 var(--font-sans);padding:5px 9px;border-radius:9999px;background:var(--fin-positive-soft);color:var(--text-primary);box-shadow:inset 0 0 0 1px rgba(0,201,154,.45);white-space:nowrap}
.sd h3{margin:0;display:flex;align-items:center;gap:12px}
.sd h3>span:last-child{display:grid;min-width:0}
.sd h3 b{font:600 24px/1.1 var(--font-sans);letter-spacing:-.3px;color:var(--text-primary)}
.sd h3 small{font:400 12.5px/1.3 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sd-av{width:44px;height:44px;flex:none;border-radius:12px;display:grid;place-items:center;background:var(--fin-positive-soft);box-shadow:inset 0 0 0 1px var(--teal);font:700 14px/1 var(--font-sans);color:var(--text-primary)}
.sd-nm{display:flex;align-items:center;gap:8px}.sd-fo{display:inline-block;font:600 10px/1 var(--font-sans);padding:3px 6px;border-radius:9999px;background:var(--surface-hover);color:var(--text-secondary)}
.sd-px{display:flex;align-items:baseline;gap:10px}.sd-px b{font:600 30px/1 var(--font-sans);letter-spacing:-.6px;font-variant-numeric:tabular-nums;color:var(--text-primary)}
.sd-up{font:600 14px/1 var(--font-sans);color:var(--teal);font-variant-numeric:tabular-nums}
.sd-why{margin:0;font:400 13.5px/1.55 var(--font-sans);color:var(--text-secondary)}.sd-why b{color:var(--text-primary);font-weight:600}
.sd-risk{margin:0;padding:8px 10px;border-radius:8px;background:var(--fb-warning-soft);border-left:3px solid var(--amber);font:400 12.5px/1.4 var(--font-sans);color:var(--text-secondary)}.sd-risk b{color:var(--text-primary);font-weight:600}
.sd-viz{display:flex;flex-direction:column;gap:14px;min-width:0}
.sd-chart{position:relative;height:170px;border-radius:12px;background:var(--surface-glass);overflow:hidden}
.sd-svg{position:absolute;inset:0;width:100%;height:100%}
.sd-zone{fill:rgba(0,201,154,.07)}.sd-old{stroke:var(--text-tertiary);stroke-dasharray:4 4}.sd-line{fill:none;stroke:var(--teal);stroke-width:2.5;stroke-linejoin:round}
.sd-oldl{position:absolute;left:10px;transform:translateY(4px);font:500 10.5px/1 var(--font-sans);color:var(--text-tertiary);white-space:nowrap}
.sd-now{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:var(--teal);box-shadow:0 0 0 4px rgba(0,201,154,.25)}
.sd-now em{position:absolute;right:12px;top:-6px;font:normal 600 11px/1 var(--font-sans);color:var(--text-primary);background:var(--surface-elevated);padding:3px 7px;border-radius:9999px;white-space:nowrap}
.sd-rng-h,.sd-rng-l{display:flex;justify-content:space-between;gap:8px;font:400 11.5px/1.3 var(--font-sans);color:var(--text-tertiary)}
.sd-rng-h span:last-child{color:var(--text-secondary);font-weight:600}
.sd-rng-b{position:relative;height:8px;margin:7px 0;border-radius:4px;background:linear-gradient(90deg,rgba(123,135,153,.25),rgba(0,201,154,.25))}
.sd-rng-b i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,rgba(0,201,154,.25),var(--teal))}
.sd-rng-b span{position:absolute;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--surface-raised);border:3px solid var(--teal)}
.sd-rng-l small{display:block;font-size:10.5px;opacity:.8}.sd-rng-l span:last-child{text-align:right}
.sd-side{min-width:0}
.sd-sig{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sd-sig li{display:grid;gap:2px;padding:10px 12px;border-radius:12px;background:var(--surface-glass);border:1px solid var(--border-decorative);min-width:0}
.sd-sig span{font:500 11px/1.2 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sd-sig b{font:600 20px/1.1 var(--font-sans);font-variant-numeric:tabular-nums;color:var(--text-primary)}
.sd-sig small{font:400 11px/1.2 var(--font-sans);color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sd-m{display:block;height:4px;margin-top:6px;border-radius:2px;background:var(--surface-glass);overflow:hidden}.sd-m i{display:block;height:100%;background:var(--teal);border-radius:2px}
.sd-oth ul{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:6px}
.sd-oth li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"s n c" "s t c";column-gap:10px;align-items:center;padding:7px 10px;border-radius:8px;border:1px solid var(--border-decorative)}
.sd-oth li b{grid-area:s;font:600 12.5px/1 var(--font-sans);color:var(--text-primary)}.sd-oth li>span:nth-child(2){grid-area:n;font:400 11.5px/1.2 var(--font-sans);color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sd-oth li em{grid-area:t;font:normal 400 11px/1.2 var(--font-sans);color:var(--text-tertiary)}.sd-oth .sd-up{grid-area:c;font-size:12.5px}
.sd-f{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--border-decorative);font:400 11.5px/1.3 var(--font-sans);color:var(--text-tertiary)}
.sd-f>span:first-child{cursor:help;min-width:0}
.sd-links{display:flex;gap:16px}.sd-links a{font:600 12.5px/1 var(--font-sans);color:var(--link,#8FA3FF);text-decoration:none;white-space:nowrap}.sd-links a:hover{text-decoration:underline}
@container (max-width:420px){.sd-sig{grid-template-columns:1fr 1fr}.sd-px b{font-size:26px}.sd-chart{height:140px}}
:root[data-theme="light"] .sd-up,:root[data-theme="light"] .sd-links a{color:var(--text-primary)}
'''
    return css, html
