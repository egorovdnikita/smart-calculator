#!/usr/bin/env python3
"""Промо Smart Calculator для README: запись настоящего прототипа в Playwright и монтаж WebP.

Запуск: python promo.py ПАПКА [--only-record | --only-compose] [--keys-only] [--fps 30] [--quality 75]

1. Запись. Поднимает serve.py проекта, открывает калькулятор в headless Chromium (1520 × 950, Retina 2x)
   и проходит сценарий настоящими кликами мыши. Время страницы виртуальное: часы Playwright двигают
   таймеры и requestAnimationFrame, а CSS-анимации и переходы ставятся на паузу и перематываются
   на то же время. Поэтому каждый кадр 60 к/с снимается без пропусков, сколько бы ни шёл скриншот.
   Шапка и подвал сайта скрыты: в ролике только калькулятор. Корзина и оформление не трогаются.
2. Монтаж. Плавная камера, кольца кликов по измеренным центрам элементов, фон GitHub Dark,
   обводка #3d444d, скругление 20. Последний кадр совпадает с первым — петля без стыка.

Нужны playwright (с chromium), pillow, numpy. Итог — ПАПКА/smart-calculator-demo.webp.
"""
import argparse, json, math, pickle, subprocess, sys, time
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
VW, VH, DPR = 1520, 950, 2          # окно браузера, CSS px
MARGIN = 40                          # поле фона вокруг страницы
OUT_W, OUT_H = VW + 2 * MARGIN, VH + 2 * MARGIN   # 1600 × 1030
FPS = 60
DURATION = 31.0
BG = "#0d1117"
BORDER = "#3d444d"
TRACE = bool(__import__("os").environ.get("PROMO_TRACE"))
LIMIT = float(__import__("os").environ.get("PROMO_LIMIT", "1e9"))   # отладка: записать только начало

# Шапка, подвал и плавающие элементы сайта не входят в калькулятор и несут бренд магазина.
HIDE_CSS = "header,.header,footer,.footer,.scroll-top-btn,.pm-cart-alert{display:none!important}"

# ---------------------------------------------------------------- сценарий
# Клик: (время, имя, селектор). Ползунок: (начало, длительность, имя, селектор, минимум, максимум, значение).
POWER = '.tlsc-priority:has(input[name=priority_power]) .tlsc-range'
CLICKS = [
    (1.90, 'ride', '.tlsc-option:has(input[name=ride][value=extreme])'),
    (2.90, 'season', '.tlsc-option:has(input[name=season][value=winter])'),
    (8.30, 'tab-compare', '[data-tlsc-tab="comparison"]'),
    (9.70, 'alt', '[data-alt-index="1"]'),
    (11.10, 'tab-profile', '[data-tlsc-tab="profile"]'),
    (12.50, 'tab-why', '[data-tlsc-tab="recommendation"]'),
    (15.70, 'finalist', '.tlsc-journey-finalist:nth-child(2)'),
    (19.20, 'banner', '[data-tlsc-territory-next]'),
    (23.60, 'ride-back', '.tlsc-option:has(input[name=ride][value=active])'),
    (24.40, 'terrain-back', '.tlsc-option:has(input[name=terrain][value=forest])'),
    (25.20, 'season-back', '.tlsc-option:has(input[name=season][value=summer])'),
]
DRAGS = [(3.95, 1.25, 'budget', 'input[name=budget]', 500_000, 9_000_000, 4_000_000),
         (5.55, .85, 'power', POWER, 0, 2, 2),
         (25.95, .75, 'power-back', POWER, 0, 2, 0),
         (26.95, 1.10, 'budget-back', 'input[name=budget]', 500_000, 9_000_000, 2_000_000)]
# Прокрутка: (начало, длительность, точка). Точки считаются по разметке после загрузки.
SCROLLS = [(7.00, .95, 'result'), (13.30, 1.30, 'journey'), (17.40, 1.20, 'banner'), (21.20, 1.50, 'top')]
# Камера: (начало, длительность, кадр).
CAMERA = [(1.00, .85, 'controls'), (6.35, .85, 'wide'), (22.80, .85, 'controls'), (28.20, .9, 'wide')]


def cubic_in_out(t):
    t = min(max(t, 0.0), 1.0)
    return 4 * t * t * t if t < .5 else 1 - (-2 * t + 2) ** 3 / 2


def cubic_out(t):
    t = min(max(t, 0.0), 1.0)
    return 1 - (1 - t) ** 3


def tap_state(rel):
    """Кольцо касания как в Agent Pulse: радиус / максимум, прозрачность, отверстие / радиус."""
    hole = .58
    if rel < -.37 or rel > .28:
        return 0.0, 0.0, hole
    if rel < -.17:
        p = (rel + .37) / .20
        return .45 + .55 * cubic_out(p), cubic_in_out(p / .6), hole
    if rel < 0:
        p = (rel + .17) / .17
        return 1 - .5 * cubic_in_out(p), 1.0, hole
    p = rel / .28
    return .5 + .24 * cubic_out(p), 1 - cubic_in_out(p), hole + .2 * cubic_in_out(p)


def drag_state(t, start, dur):
    """Нажатие → удержание на ползунке → отпускание."""
    if t < start:
        return tap_state(t - start)
    if t <= start + dur:
        return .5, 1.0, .58
    return tap_state(t - start - dur)


# ---------------------------------------------------------------- запись
SYNC_JS = """(vt) => {
  for (const a of document.getAnimations()) {
    if (a.__t0 === undefined) { a.__t0 = vt - %f; a.pause(); }
    a.currentTime = vt - a.__t0;
  }
}"""


def start_server():
    proc = subprocess.Popen([sys.executable, '-u', str(ROOT / 'serve.py'), '5300'], stdout=subprocess.PIPE, text=True)
    url = proc.stdout.readline().strip()
    if not url.startswith('http'):
        proc.kill()
        raise RuntimeError('serve.py не запустился')
    return proc, url + '/'


def fetch_origin(path):
    import re, urllib.request
    origin = re.search(r"ORIGIN = '([^']+)'", (ROOT / 'serve.py').read_text()).group(1)
    try:
        req = urllib.request.Request(f'{origin}/{path}', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=90) as r:
            return r.status, {'content-type': r.headers.get('Content-Type', 'application/octet-stream')}, r.read()
    except Exception:
        return None


def make_cache_route(cache):
    def handle(route):
        req = route.request
        if req.method != 'GET' or '/local/cart/' in req.url:
            return route.continue_()
        key = req.url.split('://', 1)[-1].split('/', 1)[-1]      # путь без хоста и порта
        hit = cache.get(key)
        if hit is None:
            resp = None
            for _ in range(3):                  # исходный сайт медленный: повторяем 502/504 и таймауты
                try:
                    resp = route.fetch(timeout=60_000)
                except Exception:
                    resp = None
                if resp is not None and resp.status < 500:
                    break
            if (resp is None or resp.status >= 500) and key.startswith('upload/'):
                direct = fetch_origin(key)         # прокси serve.py ждёт сайт только 20 с
                if direct:
                    cache[key] = direct
                    status, headers, body = direct
                    return route.fulfill(status=status, headers=headers, body=body)
            if resp is None:
                cache.setdefault('__failed__', set()).add(req.url)
                return route.abort()
            hit = (resp.status, dict(resp.headers), resp.body())
            if resp.status < 400:           # ошибки не кэшируем: следующий запуск попробует снова
                cache[key] = hit
            else:
                cache.setdefault('__failed__', set()).add(req.url)
        status, headers, body = hit
        route.fulfill(status=status, headers=headers, body=body)
    return handle


def center(page, sel):
    """Центр элемента; если его перекрывает другой (слово баннера под фото техники) —
    ближайшая к центру точка, где клик действительно попадает в элемент."""
    loc = page.locator(sel).first
    box = loc.bounding_box()
    if not box:
        raise RuntimeError(f'Нет элемента: {sel}')
    point = loc.evaluate("""el => {
      const r = el.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2, pts = [];
      for (let i = 1; i < 12; i++) for (let j = 1; j < 6; j++) pts.push([r.x + r.width * i / 12, r.y + r.height * j / 6]);
      pts.unshift([cx, cy]);
      pts.sort((a, b) => Math.hypot(a[0] - cx, a[1] - cy) - Math.hypot(b[0] - cx, b[1] - cy));
      return pts.find(([x, y]) => { const hit = document.elementFromPoint(x, y); return hit && el.contains(hit); }) || null;
    }""")
    if not point:
        raise RuntimeError(f'Элемент перекрыт: {sel}')
    return point[0], point[1], box


def range_x(page, sel, lo, hi, value):
    box = page.locator(sel).first.bounding_box()
    thumb = 16
    frac = (value - lo) / (hi - lo)
    return box['x'] + thumb / 2 + frac * (box['width'] - thumb), box['y'] + box['height'] / 2


def scroll_points(page):
    js = """() => {
      const top = s => document.querySelector(s).getBoundingClientRect().top + scrollY;
      const terr = document.querySelector('[data-tlsc-territory]').getBoundingClientRect();
      return {top: top('.tlsc-title') - 64, result: top('.tlsc-price') - 300,
              journey: top('.tlsc-journey') - 40, banner: terr.top + scrollY + terr.height / 2 - %d / 2};
    }""" % VH
    return page.evaluate(js)


def camera_rects(page):
    """Кадры камеры в координатах окна при прокрутке «top»."""
    box = page.locator('.tlsc-controls').bounding_box()
    title = page.locator('.tlsc-title').bounding_box()
    power = page.locator(POWER).first.bounding_box()
    y = max(0, title['y'] - 28)
    h = power['y'] + power['height'] + 34 - y     # от заголовка до ползунка «Мощность»
    w = h * VW / VH
    x = max(0, box['x'] - 36)
    return {'wide': [0, 0, VW, VH], 'controls': [x, y, w, h]}


def scroll_at(t, points):
    y = points['top']
    for start, dur, name in SCROLLS:
        if t >= start:
            y = y + (points[name] - y) * cubic_in_out((t - start) / dur)
    return y


def warm_up(browser, url, cache):
    """Проход сценария в реальном времени: все фото и ответы API попадают в кэш записи."""
    ctx = browser.new_context(viewport={'width': VW, 'height': VH}, device_scale_factor=1)
    ctx.route('**/*', make_cache_route(cache))
    page = ctx.new_page()
    page.goto(url, wait_until='networkidle')
    page.add_style_tag(content=HIDE_CSS)
    points = scroll_points(page)
    events = sorted([(c[0], 'click', c) for c in CLICKS] + [(d[0], 'drag', d) for d in DRAGS], key=lambda e: e[0])
    for t, kind, ev in events:
        page.evaluate(f'scrollTo(0,{scroll_at(t, points)})')
        page.wait_for_timeout(150)
        if kind == 'click':
            try:
                x, y, _ = center(page, ev[2])
            except Exception:
                print(f'Прогрев: пропущен {ev[1]}', flush=True)
                continue
            page.mouse.click(x, y)
        else:
            _, _, _, sel, lo, hi, value = ev
            page.mouse.move(*range_x(page, sel, lo, hi, int(page.locator(sel).first.input_value())))
            page.mouse.down(); page.mouse.move(*range_x(page, sel, lo, hi, value), steps=8); page.mouse.up()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(600)
    ctx.unroute_all(behavior='ignoreErrors')
    ctx.close()


def record(folder):
    from playwright.sync_api import sync_playwright
    frames_dir = folder / 'frames'
    frames_dir.mkdir(parents=True, exist_ok=True)
    for old in frames_dir.glob('*.jpg'):
        old.unlink()
    server, url = start_server()
    cache_file = folder / 'cache.pickle'      # фото и ответы API: исходный сайт запрашивается один раз
    cache = pickle.loads(cache_file.read_bytes()) if cache_file.exists() else {}
    cache.pop('__failed__', None)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            warm_up(browser, url, cache)
            failed = cache.pop('__failed__', set())
            # На диск — только проксированное с исходного сайта; файлы проекта всегда свежие.
            remote = {k: v for k, v in cache.items() if k not in ('', 'index.html') and not (ROOT / k.split('?')[0]).is_file()}
            cache_file.write_bytes(pickle.dumps(remote))
            print(f'Кэш: {len(cache)} ответов', flush=True)
            if failed:
                raise RuntimeError('Не загрузились: ' + ', '.join(sorted(failed)[:5]))
            ctx = browser.new_context(viewport={'width': VW, 'height': VH}, device_scale_factor=DPR,
                                      reduced_motion='no-preference')
            ctx.route('**/*', make_cache_route(cache))
            page = ctx.new_page()
            page.clock.install(time=datetime(2026, 11, 1, 12, 0))
            page.goto(url, wait_until='networkidle')
            page.add_style_tag(content=HIDE_CSS)
            page.wait_for_timeout(1500)
            points = scroll_points(page)
            page.evaluate(f'scrollTo(0,{points["top"]})')
            page.mouse.move(VW - 4, VH - 4)        # курсор вне элементов
            page.wait_for_timeout(800)
            rects = camera_rects(page)
            # Время только как datetime: целое число Playwright понимает иначе, часы уходят к 1e18 мс,
            # точности double не хватает, и requestAnimationFrame зацикливается на одном моменте.
            now = page.evaluate('Date.now()')
            page.clock.pause_at(datetime.fromtimestamp(now / 1000 + 1))
            page.clock.run_for(2000)               # все стартовые таймеры отработали
            page.wait_for_timeout(2500)            # и CSS-анимации загрузки доиграли в реальном времени
            vt = 0.0
            # Уже идущие анимации (бесконечные, если есть) подхватываются с их текущего места.
            page.evaluate("() => { for (const a of document.getAnimations()) { a.__t0 = -(a.currentTime || 0); a.pause(); } }")
            frames = int(round(min(DURATION, LIMIT) * FPS))
            clicks, drags = [], []
            pending = sorted([(c[0], 'click', c) for c in CLICKS] + [(d[0], 'drag', d) for d in DRAGS], key=lambda e: e[0])
            active_drag = None
            neutral_at = None
            t_start = time.time()
            for i in range(frames):
                t = i / FPS
                trace = (lambda m: print(f'{i} {t:.2f} {m}', flush=True)) if TRACE else (lambda m: None)
                trace('scroll')
                page.evaluate(f'scrollTo(0,{scroll_at(t, points):.2f})')
                while pending and pending[0][0] <= t + 1e-6:
                    _, kind, ev = pending.pop(0)
                    if kind == 'click':
                        x, y, box = center(page, ev[2])
                        page.mouse.move(x, y)
                        page.mouse.down(); page.mouse.up()
                        clicks.append({'t': t, 'name': ev[1], 'x': x, 'y': y, 'box': box})
                        neutral_at = t + .45
                    else:
                        _, dur, name, sel, lo, hi, value = ev
                        x0, y0 = range_x(page, sel, lo, hi, int(page.locator(sel).first.input_value()))
                        x1, _ = range_x(page, sel, lo, hi, value)
                        page.mouse.move(x0, y0)
                        v0 = float(page.locator(sel).first.input_value())
                        active_drag = {'start': t, 'dur': dur, 'name': name, 'sel': sel, 'x0': x0, 'x1': x1,
                                       'y': y0, 'v0': v0, 'target': value, 'path': []}
                if active_drag:
                    k = cubic_in_out((t - active_drag['start']) / active_drag['dur'])
                    x = active_drag['x0'] + (active_drag['x1'] - active_drag['x0']) * k
                    # Значение ведём теми же событиями input/change, что браузер шлёт при перетаскивании.
                    v = active_drag['v0'] + (active_drag['target'] - active_drag['v0']) * k
                    page.locator(active_drag['sel']).first.evaluate(
                        "(el, v) => { const before = el.value; el.value = v; if (el.value !== before)"
                        " el.dispatchEvent(new Event('input', {bubbles: true})); }", v)
                    active_drag['path'].append([t, x, active_drag['y']])
                    if k >= 1:
                        page.locator(active_drag['sel']).first.dispatch_event('change')
                        got = int(page.locator(active_drag['sel']).first.input_value())
                        if got != active_drag['target']:
                            raise RuntimeError(f'{active_drag["name"]}: {got} вместо {active_drag["target"]}')
                        drags.append(active_drag); active_drag = None
                        neutral_at = t + .45
                if neutral_at is not None and t >= neutral_at:
                    page.mouse.move(VW - 4, VH - 4); neutral_at = None
                if i:
                    ms = 17 if i % 3 else 16                  # 17+17+16 = 50 мс на три кадра
                    trace('run'); page.clock.run_for(ms); vt += ms
                    trace('sync'); page.evaluate(SYNC_JS % ms, vt); trace('shot')
                page.screenshot(path=str(frames_dir / f'{i:05d}.jpg'), type='jpeg', quality=94,
                                scale='device', caret='hide')
                if i % FPS == 0:
                    print(f'Запись: {t:.0f}/{DURATION:.0f} с · {time.time() - t_start:.0f} с', flush=True)
            if cache.get('__failed__'):
                raise RuntimeError('Во время записи не загрузились: ' + ', '.join(sorted(cache['__failed__'])[:5]))
            meta = {'fps': FPS, 'frames': frames, 'viewport': [VW, VH], 'dpr': DPR, 'points': points,
                    'camera': rects, 'clicks': clicks, 'drags': drags}
            (folder / 'record.json').write_text(json.dumps(meta, ensure_ascii=False, indent=1))
            ctx.unroute_all(behavior='ignoreErrors')
            browser.close()
    finally:
        server.terminate()


# ---------------------------------------------------------------- монтаж
def camera_at(t, rects):
    r = rects['wide']
    for start, dur, name in CAMERA:
        if t >= start:
            k = cubic_in_out((t - start) / dur)
            r = [a + (b - a) * k for a, b in zip(r, rects[name])]
    return r


def rounded_mask(size, radius, sup=3):
    m = Image.new('L', (size[0] * sup, size[1] * sup), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] * sup - 1, size[1] * sup - 1), radius=radius * sup, fill=255)
    return m.resize(size, Image.LANCZOS)


def draw_ring(img, cx, cy, state, radius=24):
    share, alpha, hole = state
    if alpha <= .01:
        return
    r = radius * share
    pad = int(r + 12)
    box = (int(cx - pad), int(cy - pad), int(cx + pad), int(cy + pad))
    sample = img.crop(box).filter(ImageFilter.GaussianBlur(max(2, r * .16)))
    light = sample.convert('L').resize((1, 1), Image.BOX).getpixel((0, 0)) > 170
    tint = Image.new('RGBA', sample.size, (120, 126, 140, 255) if light else (234, 241, 250, 255))
    glass = Image.blend(sample, tint, .45 if light else .28)
    sup = 4
    mask = Image.new('L', (sample.width * sup, sample.height * sup), 0)
    d = ImageDraw.Draw(mask)
    ox, oy = (cx - box[0]) * sup, (cy - box[1]) * sup
    d.ellipse((ox - r * sup, oy - r * sup, ox + r * sup, oy + r * sup), fill=int(235 * alpha))
    ri = r * hole
    d.ellipse((ox - ri * sup, oy - ri * sup, ox + ri * sup, oy + ri * sup), fill=0)
    mask = mask.resize(sample.size, Image.LANCZOS)
    shadow = Image.new('RGBA', sample.size, (0, 0, 0, 0))
    shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(r * .12 + 2)).point(lambda v: int(v * .3)))
    img.alpha_composite(shadow, (box[0], box[1] + max(1, int(r * .05))))
    glass.putalpha(mask)
    img.alpha_composite(glass, (box[0], box[1]))


def compose_frame(folder, meta, i, card_mask, outer_mask, border):
    t = i / FPS
    cam = camera_at(t, meta['camera'])
    src = Image.open(folder / 'frames' / f'{i:05d}.jpg')
    crop = [round(v * DPR) for v in (cam[0], cam[1], cam[0] + cam[2], cam[1] + cam[3])]
    page = src.crop(crop).resize((VW, VH), Image.LANCZOS).convert('RGBA')
    scale = VW / cam[2]
    to_out = lambda x, y: (MARGIN + (x - cam[0]) * scale, MARGIN + (y - cam[1]) * scale)
    for c in meta['clicks']:
        draw_ring(page, *[v - MARGIN for v in to_out(c['x'], c['y'])], tap_state(t - c['t']))
    for d in meta['drags']:
        pos = min(d['path'], key=lambda p: abs(p[0] - t))
        draw_ring(page, *[v - MARGIN for v in to_out(pos[1], pos[2])], drag_state(t, d['start'], d['dur']))
    frame = Image.new('RGBA', (OUT_W, OUT_H), BG)
    frame.paste(page, (MARGIN, MARGIN), card_mask)
    frame.putalpha(outer_mask)
    frame.alpha_composite(border)
    return frame


def compose(folder, keys_only=False, out_fps=FPS, quality=70):
    meta = json.loads((folder / 'record.json').read_text())
    frames = meta['frames']
    sup = 3
    border = Image.new('RGBA', (OUT_W * sup, OUT_H * sup))
    ImageDraw.Draw(border).rounded_rectangle((sup / 2, sup / 2, OUT_W * sup - sup / 2, OUT_H * sup - sup / 2),
                                             radius=20 * sup, outline=BORDER, width=sup)
    border = border.resize((OUT_W, OUT_H), Image.LANCZOS)
    outer_mask = rounded_mask((OUT_W, OUT_H), 20)
    card_mask = rounded_mask((VW, VH), 12)
    keys_dir = folder / 'keys'
    keys_dir.mkdir(exist_ok=True)
    key_frames = set(range(0, frames, FPS // 2)) | {frames - 1}
    out = folder / 'smart-calculator-demo.webp'
    step = FPS // out_fps
    indices = sorted(key_frames) if keys_only else list(range(0, frames, step))

    def stream():
        for i in indices:
            frame = compose_frame(folder, meta, i, card_mask, outer_mask, border)
            if i in key_frames:
                frame.save(keys_dir / f'key-{i / FPS:05.2f}.png')
            if i % (FPS * 5) == 0:
                print(f'Монтаж: {i / FPS:.0f}/{frames / FPS:.0f} с', flush=True)
            yield frame

    if keys_only:
        for _ in stream():
            pass
        return out
    # Pillow вместо ffmpeg: нужен kmax. WebPAnimEncoder с потерями не обновляет пиксели, если разница
    # меньше порога, и плавные затухания оставляют «призраки» старого текста. Ключевой кадр каждые
    # 0,5 с смывает остатки. Кадры идут генератором — в памяти их не держим.
    gen = stream()
    first = next(gen)
    stamps = [round(k * 1000 / out_fps) for k in range(len(indices) + 1)]
    durations = [b - a for a, b in zip(stamps, stamps[1:])]
    first.save(out, save_all=True, append_images=gen, duration=durations, loop=0, lossless=False,
               quality=quality, method=4, kmin=out_fps // 2 - 1, kmax=out_fps // 2, allow_mixed=False,
               background=(0, 0, 0, 0))
    return out


def verify(folder):
    """Стык петли: первый и последний смонтированные кадры."""
    import numpy as np
    meta = json.loads((folder / 'record.json').read_text())
    sup = 3
    border = Image.new('RGBA', (OUT_W, OUT_H))
    outer, card = rounded_mask((OUT_W, OUT_H), 20), rounded_mask((VW, VH), 12)
    a = np.asarray(compose_frame(folder, meta, 0, card, outer, border).convert('RGB'), dtype=float)
    b = np.asarray(compose_frame(folder, meta, meta['frames'] - 1, card, outer, border).convert('RGB'), dtype=float)
    rms = float(np.sqrt(((a - b) ** 2).mean()))
    print(f'Стык петли: RMS первого и последнего кадра = {rms:.3f}')
    return rms


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('folder')
    ap.add_argument('--only-record', action='store_true')
    ap.add_argument('--only-compose', action='store_true')
    ap.add_argument('--keys-only', action='store_true')
    ap.add_argument('--fps', type=int, default=30)   # 30 к/с: ≈18 МБ
    ap.add_argument('--quality', type=int, default=75)
    args = ap.parse_args()
    folder = Path(args.folder).resolve()
    if ROOT in folder.parents or folder == ROOT:
        sys.exit('Папка промо должна быть вне репозитория')
    folder.mkdir(parents=True, exist_ok=True)
    if not args.only_compose:
        record(folder)
    verify(folder)
    if not args.only_record:
        out = compose(folder, args.keys_only, args.fps, args.quality)
        if not args.keys_only:
            print(f'{out} · {out.stat().st_size / 1e6:.1f} МБ')


if __name__ == '__main__':
    main()
