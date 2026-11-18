"""AlphaPad phone app: every Home feature in a calm mobile layout (bottom tabs, sheets).

Data comes from the Home build: its script data (indices, calls, timeline, calendar, movers, OI buildup,
learning) is copied verbatim, and the parts that only exist as markup (F&O levels, baskets, market scan,
company filings) are parsed out. Writes app.html next to Home. Styles and behaviour: app.css, app.js."""
import html as _h, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
JS_DATA = ['IDX', 'DAY', 'TYPES', 'E', 'EVENTS', 'MVS', 'OIB', 'OIQ', 'CALLS', 'LEARN', 'LVIZ']

# Closed trade calls for the track record (sample data for the prototype; every call is listed, losses included).
# name, strategy, legs, posted, closed, entry, target, stop, exit, how it closed, quantity
CLOSED = [
    ('TATAMOTORS', 'Call spread', 'Buy CALL 720 · Sell CALL 740', '2026-10-28', '2026-11-04', 6.10, 14.00, 3.00, 13.60, 'target', 1400),
    ('HDFCBANK', 'Stock · positional', 'Buy 1,688 shares', '2026-10-20', '2026-11-06', 1652.0, 1760.0, 1598.0, 1758.0, 'target', 60),
    ('NIFTY', 'Put spread', 'Buy PUT 24800 · Sell PUT 24600', '2026-10-30', '2026-11-03', 58.0, 120.0, 30.0, 29.0, 'stop', 75),
    ('ICICIBANK', 'Call', 'Buy CALL 1300', '2026-10-27', '2026-10-31', 18.5, 34.0, 10.0, 33.2, 'target', 700),
    ('INFY', 'Stock · swing', 'Buy 1,520 shares', '2026-10-15', '2026-10-29', 1498.0, 1580.0, 1460.0, 1461.0, 'stop', 30),
    ('BANKNIFTY', 'Call spread', 'Buy CALL 55000 · Sell CALL 55500', '2026-11-05', '2026-11-09', 142.0, 300.0, 80.0, 296.0, 'target', 35),
    ('SBIN', 'Stock · swing', 'Buy 812 shares', '2026-10-22', '2026-11-05', 804.0, 860.0, 778.0, 838.0, 'early', 120),
    ('RELIANCE', 'Put', 'Buy PUT 1400', '2026-11-02', '2026-11-04', 22.0, 40.0, 13.0, 12.6, 'stop', 500),
    ('LT', 'Call spread', 'Buy CALL 3600 · Sell CALL 3700', '2026-10-24', '2026-11-03', 31.0, 70.0, 18.0, 68.5, 'target', 175),
    ('M&M', 'Stock · positional', 'Buy 3,050 shares', '2026-10-09', '2026-11-10', 2988.0, 3300.0, 2860.0, 3296.0, 'target', 25),
]


def closed():
    out = []
    for n, k, legs, po, cl, en, tg, sl, ex, how, q in CLOSED:
        out.append({'n': n, 'k': k, 'legs': legs, 'po': po, 'cl': cl, 'en': en, 'tg': tg, 'sl': sl, 'ex': ex, 'how': how, 'q': q,
                    'ret': round((ex - en) / en * 100, 1), 'pnl': round((ex - en) * q)})
    return sorted(out, key=lambda x: x['cl'], reverse=True)


def _decl(src, name):
    """Return the full `const NAME=...;` statement from a script, matching brackets and skipping strings."""
    m = re.search(r'\b(?:const|let|var)\s+' + name + r'\s*=', src)
    if not m:
        raise ValueError('missing ' + name)
    i, depth, q = m.end(), 0, None
    while i < len(src):
        c = src[i]
        if q:
            if c == '\\':
                i += 2; continue
            if c == q:
                q = None
        elif c in '\'"`':
            q = c
        elif c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
        elif c == ';' and depth == 0:
            return src[m.start():i + 1].replace('const ', 'var ', 1).replace('let ', 'var ', 1)
        i += 1
    raise ValueError('unterminated ' + name)


def _strip(s):
    return _h.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s))).strip()


def _fo(home):
    i = home.find('aria-label="Nifty F&amp;O levels"')
    seg = home[i:i + 9000]
    k = re.findall(r'<span>([^<]+)</span><b>([^<]+)</b><small>([^<]+)</small>', seg)[:3]
    exp = _strip(re.search(r'class="fo-exp">(.*?)</span>', seg).group(1))
    svg = re.search(r'(<svg viewBox="0 0 380 74".*?</svg>)', seg, re.S).group(1)
    return {'exp': exp, 'k': [list(x) for x in k], 'svg': svg}


def _baskets(home):
    i = home.find('<ul class="bk-list">')
    seg = home[i:home.find('</ul>', i)]
    return [{'n': _strip(a), 'm': _strip(b), 'r': _strip(c)} for a, b, c in
            re.findall(r'<b>(.*?)</b><small>(.*?)</small></div><span class="bk-r[^"]*">(.*?)<small>', seg)]


def _scan(home):
    i = home.find('id="scan"'); j = home.find('id="happening"')
    out = []
    for art in re.findall(r'<article class="card sc (sc-[a-z]+)">(.*?)</article>', home[i:j], re.S):
        cls, body = art
        head = re.search(r'class="hc-head">(.*?)</div>', body, re.S)
        title = _strip(re.search(r'<h3[^>]*>(.*?)</h3>', body, re.S).group(1)) if '<h3' in body else _strip(head.group(1))
        rows = []
        for li in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S):
            n = re.search(r'class="sc-n"[^>]*title="([^"]*)"[^>]*>(.*?)</span>', li)
            v = re.search(r'class="sc-v">(.*?)</span>', li)
            c = re.search(r'class="sc-c ([ud])">(.*?)</span>', li)
            w = re.search(r'width:(\d+)%', li)
            rows.append({'s': _strip(n.group(2)) if n else '', 'name': _h.unescape(n.group(1)) if n else '',
                         'v': _strip(v.group(1)) if v else '', 'c': _strip(c.group(2)) if c else '', 'u': bool(c and c.group(1) == 'u'),
                         'w': int(w.group(1)) if w else 0})
        out.append({'id': cls, 'h': title, 'rows': rows})
    return out


def _filings(home):
    i = home.find('id="happening"'); j = home.find('id="calModal"', i)
    seg = home[i:j]
    groups = []
    for cls, body in re.findall(r'<article class="card wh-col ([a-z])">(.*?)</article>', seg, re.S):
        head = _strip(re.search(r'class="hc-head">(.*?)</div>', body, re.S).group(1))
        title = re.sub(r'\s*\d+$', '', head)
        items = []
        for li in re.findall(r'<li[^>]*>(.*?)</li>', body, re.S):
            a = re.search(r'href="([^"]+)"', li)
            items.append({'s': _strip(re.search(r'<b>(.*?)</b>', li).group(1)), 'fo': 'F&amp;O' in li or 'F&O' in li,
                          't': (re.search(r'\b(\d{1,2}:\d{2})\b', _strip(li)) or [None, ''])[1],
                          'x': _strip(re.sub(r'.*\d{1,2}:\d{2}', '', _strip(li), count=1)), 'href': _h.unescape(a.group(1)) if a else ''})
        groups.append({'c': cls, 'h': title, 'items': items})
    return groups


def data(home):
    import sys
    sys.path.insert(0, HERE)
    from calm import data as calm_data
    from sotd import SOTD
    from journal_data import build as jd_build, pending as jd_pending
    d = calm_data(home)
    d['links'].update({'app': 'app.html'})
    d['fo'] = _fo(home)
    d['baskets'] = _baskets(home)
    d['scan'] = _scan(home)
    d['filings'] = _filings(home)
    d['sotd'].update({k: SOTD[k] for k in ('date', 's', 'name', 'ind', 'fo', 'close', 'chg', 'day_hi', 'old_hi', 'old_hi_d', 'l52', 'l52_d', 'vx', 'dl', 'sma20', 'oi')})
    d['sotd']['others'] = [list(x) for x in SOTD['others']]
    d['closed'] = closed()
    return d, jd_build(), jd_pending()


def page(home):
    script = re.findall(r'<script[^>]*>(.*?)</script>', home, re.S)
    src = max(script, key=len)
    decls = '\n'.join(_decl(src, n) for n in JS_DATA)
    d, jd, jp = data(home)
    css = open(os.path.join(HERE, 'app.css'), encoding='utf-8').read()
    js = open(os.path.join(HERE, 'app.js'), encoding='utf-8').read()
    dj = lambda x: json.dumps(x, ensure_ascii=False, separators=(',', ':'))
    return f'''<!doctype html>
<html lang="en" class="app">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101827">
<title>AlphaPad</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script>try{{var t=localStorage.getItem('today-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<style>{css}</style>
</head>
<body>
<div id="app"></div>
<script>
{decls}
window.CD={dj(d)};window.JD={dj(jd)};window.JDP={dj(jp)};
</script>
<script>{js}</script>
</body>
</html>
'''


def write(home):
    out = page(home)
    open(os.path.join(ROOT, 'app.html'), 'w', encoding='utf-8').write(out)
    return len(out)


if __name__ == '__main__':
    import sys
    sys.path.insert(0, HERE)
    home = open(os.path.join(ROOT, 'home-2026-11-12.html'), encoding='utf-8').read()
    d, jd, jp = data(home)
    print(json.dumps({k: d[k] for k in ('fo', 'baskets', 'scan', 'filings')}, ensure_ascii=False)[:2500])
    src = max(re.findall(r'<script[^>]*>(.*?)</script>', home, re.S), key=len)
    for n in JS_DATA:
        print(n, len(_decl(src, n)))
