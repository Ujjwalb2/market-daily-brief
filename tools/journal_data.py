"""Sample trades for the journal prototype: September to 13 Nov 2026, options and stocks, each scored against a five-rule plan.
Deterministic (seeded) so the page looks the same on every build."""
import random, json

DAYS = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']
OPT = [('NIFTY {} CE', 75, 60, 160, 25000, 25400), ('NIFTY {} PE', 75, 50, 150, 24800, 25300), ('BANKNIFTY {} CE', 35, 120, 260, 54000, 55500), ('BANKNIFTY {} PE', 35, 110, 240, 53500, 55000)]
STK = [('RELIANCE', 1412, 40), ('HDFCBANK', 1688, 60), ('INFY', 1504, 30), ('TCS', 3105, 20), ('SBIN', 812, 120), ('NAVINFLUOR', 9120, 5), ('PNB', 132, 400), ('ICICIBANK', 1290, 60)]
SETUPS = ['Opening range breakout', 'VWAP pullback', 'Breakout retest', 'Trend continuation', 'Mean reversion']
MOODS = ['Calm', 'Confident', 'Rushed', 'Anxious', 'Calm', 'Focused']


HOLIDAYS = {'2026-10-02'}


def weekdays(year, month):
    import calendar
    days = []
    for day in range(1, calendar.monthrange(year, month)[1] + 1):
        d = f'{year}-{month:02d}-{day:02d}'
        if calendar.weekday(year, month, day) < 5 and d not in HOLIDAYS:
            days.append(d)
    return days


def build():
    """September and October come from their own seeds (and skip some days), so November stays exactly as before."""
    out = []
    for days, seed in ((weekdays(2026, 9), 926), (weekdays(2026, 10), 1026)):
        rnd = random.Random(seed)
        out += _month([d for d in days if rnd.random() > 0.28], rnd)
    out += _month(DAYS, random.Random(1112))
    out.sort(key=lambda x: (x['d'], x['t']))
    return out


def _month(DAYS, rnd):
    out = []
    for d in DAYS:
        n = rnd.choice([2, 3, 3, 4])
        lost_prev = False
        for _ in range(n):
            hh = rnd.choice([9, 9, 10, 10, 11, 12, 13, 14]); mm = rnd.choice([16, 22, 34, 41, 48, 55, 5, 12])
            t = f'{hh:02d}:{mm:02d}'
            rules = {'stop': rnd.random() > 0.1, 'size': rnd.random() > 0.15, 'setup': rnd.random() > 0.15,
                     'revenge': not (lost_prev and rnd.random() > 0.55), 'exit': rnd.random() > 0.2}
            score = sum(rules.values())
            edge = (score - 4.2) * 0.32 + rnd.uniform(-0.42, 0.5)
            if rnd.random() < 0.62:
                tpl, lot, lo, hi, s_lo, s_hi = rnd.choice(OPT)
                strike = rnd.randrange(s_lo, s_hi, 100)
                sym = tpl.format(strike); qty = lot * rnd.choice([1, 1, 2]); entry = round(rnd.uniform(lo, hi), 1)
                exitp = round(max(1.0, entry * (1 + edge * 0.55)), 1); kind = 'Option'
                held = rnd.choice([18, 35, 52, 70, 95, 140, 185, 230])
                risk = round(entry * 0.3 * qty)
            else:
                sym, base, q = rnd.choice(STK); qty = q; entry = round(base * rnd.uniform(0.97, 1.03), 1)
                exitp = round(entry * (1 + edge * 0.035), 1); kind = 'Equity'
                held = rnd.choice([75, 120, 210, 1440, 2880])
                risk = round(entry * 0.012 * qty)
            side = 'Buy' if kind == 'Option' or rnd.random() > 0.2 else 'Sell'
            pnl = round((exitp - entry) * qty * (1 if side == 'Buy' else -1))
            mistakes = [m for m, ok in (('No stop-loss', rules['stop']), ('Oversized', rules['size']), ('Off-plan setup', rules['setup']),
                                        ('Revenge trade', rules['revenge']), ('Early or late exit', rules['exit'])) if not ok]
            out.append({'d': d, 't': t, 'sym': sym, 'kind': kind, 'side': side, 'qty': qty, 'en': entry, 'ex': exitp, 'pnl': pnl, 'held': held,
                        'risk': max(risk, 1), 'setup': rnd.choice(SETUPS), 'rules': rules, 'score': score, 'mistakes': mistakes, 'mood': rnd.choice(MOODS)})
            lost_prev = pnl < 0
    return out


def pending():
    """Trades 'fetched from the broker' today that the trader has not reviewed yet.
    The broker gives the facts; setup, plan rules, mood and notes are left for the trader."""
    rows = [('pend-1', '09:24', 'NIFTY 25300 CE', 'Option', 'Buy', 75, 84.5, 112.0, 47),
            ('pend-2', '10:41', 'BANKNIFTY 55200 PE', 'Option', 'Buy', 35, 168.0, 131.5, 96),
            ('pend-3', '11:58', 'HDFCBANK', 'Equity', 'Buy', 60, 1712.4, 1729.8, 205),
            ('pend-4', '14:06', 'NIFTY 25250 PE', 'Option', 'Buy', 75, 58.0, 44.5, 31)]
    out = []
    for pid, t, sym, kind, side, qty, en, ex, held in rows:
        pnl = round((ex - en) * qty * (1 if side == 'Buy' else -1))
        risk = round(en * (0.3 if kind == 'Option' else 0.012) * qty)
        out.append({'id': pid, 'd': '2026-11-16', 't': t, 'sym': sym, 'kind': kind, 'side': side, 'qty': qty, 'en': en, 'ex': ex,
                    'pnl': pnl, 'held': held, 'risk': risk, 'broker': 'Your broker'})
    return out


def as_json():
    return json.dumps(build(), separators=(',', ':'))


if __name__ == '__main__':
    tr = build(); net = sum(t['pnl'] for t in tr); w = sum(1 for t in tr if t['pnl'] > 0)
    print(len(tr), 'trades, net', net, 'win rate', round(w / len(tr) * 100), '%')
