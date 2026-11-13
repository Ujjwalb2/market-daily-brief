# Market Daily Brief

Desktop prototype of Springpad's "Today" tab: a daily market brief page plus a 3–5 minute audio briefing.

- `home-2026-11-12.html`: landing page prototype (one-screen Today summary, then the current Trade Calls dashboard); the site root opens it
- `today-demo-2026-11-12.html`: full Today brief, the "Read today's full brief" page, demo for Wednesday 11 Nov 2026 and a voice note
- `today-tab-layout.html`: layout reference, same build as the demo plus blue layout notes (toggle "Hide notes")
- `today-tab-layout-v1-scroll.html`: earlier single-scroll version
- `demo/`: audio briefing, script and chapter timings

Run locally:

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765/today-demo-2026-11-12.html
