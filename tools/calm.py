"""Calm landing: a fresh, uncluttered first screen built from the same data as Home.

One message (the day's story), one action (listen or read), three numbers, one visual card (Spotlight)
and a single quiet row of next steps. The onboarding questions are the same ones Idea B uses.
Writes calm.html next to Home. Styles and behaviour live in calm.css and calm.js beside this file."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# Demo data for the day that Home builds in its own scripts (timeline, calls, expiry, streak).
EVENTS = [['09:15', 'Market opens'], ['15:30', 'Close · Sensex expiry'], ['16:00', 'CPI inflation (Oct)'], ['18:00', 'FII / DII data'], ['20:00', 'US markets open']]
CALLS = {'n': 2, 'lead': 'SWIGGY', 'more': 1}
EXPIRY = {'day': 'Tue 17 Nov', 'mp': '25,100'}
STREAK = {'n': 6, 'week': [['M', 'done'], ['T', 'hol'], ['W', 'done'], ['T', 'today'], ['F', ''], ['S', 'off'], ['S', 'off']], 'left': 3, 'rank': 142, 'next': 7}
LINKS = {'brief': 'today-demo-2026-11-12.html#brief', 'dash': 'idea-b-dashboard.html', 'journal': 'idea-b-journal.html',
         'review': 'idea-b-journal.html#review', 'learn': 'today-demo-2026-11-12.html#learn',
         'bt': 'https://ujjwalb2.github.io/tradin-simulator/replay/', 'baskets': 'https://dev.alphapad.in/baskets',
         'studio': 'https://dev.alphapad.in/option-studio', 'lms': 'https://dev.alphapad.in/lms',
         'screener': 'https://dev.alphapad.in/screener', 'calls': 'idea-b-dashboard.html#tc', 'fo': 'idea-b-dashboard.html#fo'}


def _text(pat, html, default=''):
    m = re.search(pat, html, re.S)
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else default


def data(home_html):
    from sotd import SOTD
    from journal_data import build as jd_build, pending as jd_pending
    date = _text(r'<h1>(.*?)</h1>', home_html, 'Today')
    story = _text(r'class="dayline">(.*?)</', home_html)
    driver = _text(r'class="eyebrow">Good morning · (.*?)</', home_html)
    head, sub = story, ''
    if ' as ' in story:  # "X happened as Y and Z" -> headline X, supporting line Y and Z
        a, b = story.split(' as ', 1)
        head, sub = a.strip() + '.', b[0].upper() + b[1:]
    idx = json.loads(re.search(r'(?:var|const|let) IDX\s*=\s*(\[.*?\]);', home_html, re.S).group(1))
    want = {'Nifty 50': 'Nifty 50', 'Nifty Bank': 'Bank Nifty', 'India VIX': 'India VIX'}
    nums = [{'n': want[x['n']], 'pct': x['pct'], 'up': x['up'], 'vix': x['n'] == 'India VIX', 'd': [p[1] for p in x['d']]}
            for x in idx if x['n'] in want]
    lo, hi = min(SOTD['closes']), max(SOTD['closes'])
    ch = json.load(open(os.path.join(ROOT, 'demo', 'chapters-2026-11-12.json')))
    jd = jd_build(); lm = jd[-1]['d'][:7]; month = [t for t in jd if t['d'][:7] == lm]
    return {
        'date': date, 'driver': driver, 'head': head, 'sub': sub, 'nums': nums, 'events': EVENTS, 'calls': CALLS,
        'expiry': EXPIRY, 'streak': STREAK, 'links': LINKS,
        'audio': {'src': 'demo/springpad-today-2026-11-12.m4a', 'dur': ch['duration'], 'ch': [[c['title'], c['start']] for c in ch['chapters']]},
        'sotd': {'closes': SOTD['closes'], 'oldy': 34 - 3 - (SOTD['old_hi'] - lo) / ((hi - lo) or 1) * 28},
        'journal': {'pending': [p['id'] for p in jd_pending()], 'net': sum(t['pnl'] for t in month),
                    'wr': round(sum(1 for t in month if t['pnl'] > 0) / len(month) * 100)},
    }


def page(home_html):
    from variants import OB_CSS, OB_JS
    css = open(os.path.join(HERE, 'calm.css'), encoding='utf-8').read()
    js = open(os.path.join(HERE, 'calm.js'), encoding='utf-8').read()
    d = json.dumps(data(home_html), ensure_ascii=False, separators=(',', ':'))
    return f'''<!doctype html>
<html lang="en" class="calm">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AlphaPad · Today</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script>try{{var t=localStorage.getItem('today-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}}catch(e){{}}</script>
<style>{css}{OB_CSS}</style>
</head>
<body>
<div id="app"></div>
<script>window.CD={d};</script>
<script>{js}</script>
{OB_JS}
</body>
</html>
'''


def write(home_html):
    out = page(home_html)
    open(os.path.join(ROOT, 'calm.html'), 'w', encoding='utf-8').write(out)
    return len(out)


if __name__ == '__main__':
    import sys
    sys.path.insert(0, HERE)
    print('written calm.html', write(open(os.path.join(ROOT, 'home-2026-11-12.html'), encoding='utf-8').read()))
