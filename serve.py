#!/usr/bin/env python3
"""Локальный сервер: отдаёт файлы проекта, всё отсутствующее (фото /upload, шрифты /local,
?tlsc_api=product_details, корзина /local/cart/ajax) проксирует на исходный сайт (ORIGIN).
Запуск: python3 serve.py [порт]  (по умолчанию 5173)"""
import http.server, os, re, sys, urllib.request, urllib.error
ORIGIN = 'https://turbolemons.ru'
ROOT = os.path.dirname(os.path.abspath(__file__))

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw): super().__init__(*a, directory=ROOT, **kw)
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def _local(self):
        path = self.path.split('?', 1)[0]
        if 'tlsc_api=' in self.path: return False
        f = os.path.join(ROOT, path.lstrip('/'))
        return path == '/' or os.path.isfile(f)
    def _proxy(self, body=None):
        path = self.path.replace('/index.html', '/smart-calculator/')
        if path.startswith('/?'): path = '/smart-calculator' + path
        headers = {'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest',
                   'Content-Type': self.headers.get('Content-Type', 'application/x-www-form-urlencoded')}
        if self.headers.get('Cookie'): headers['Cookie'] = self.headers['Cookie']  # сессия корзины
        req = urllib.request.Request(ORIGIN + path, data=body, method=self.command, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=20) as r: code, hdrs, data = r.status, r.headers, r.read()
        except urllib.error.HTTPError as e: code, hdrs, data = e.code, e.headers, e.read()
        except Exception as e: code, hdrs, data = 502, {}, str(e).encode()
        self.send_response(code)
        self.send_header('Content-Type', hdrs.get('Content-Type', 'application/octet-stream'))
        for c in (hdrs.get_all('Set-Cookie') or []) if hasattr(hdrs, 'get_all') else []:
            c = re.sub(r';\s*(Domain=[^;]*|Secure|SameSite=[^;]*)', '', c, flags=re.I)  # cookie → localhost
            self.send_header('Set-Cookie', c)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        if self.path.split('?', 1)[0] in self.BLOCKED: return self.do_POST()
        return super().do_GET() if self._local() else self._proxy()
    BLOCKED = ('/local/cart/ajax/submit.php', '/local/cart/ajax/hit.php')  # заказ и аналитика — не из прототипа
    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0) or 0)
        body = self.rfile.read(n) if n else None
        if self.path.split('?', 1)[0] in self.BLOCKED:
            data = b'{"success":false,"error":"disabled in prototype"}'
            self.send_response(403); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(data)))
            self.end_headers(); self.wfile.write(data); return
        self._proxy(body)
    def log_message(self, *a): pass

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
for p in range(port, port + 20):  # порт занят — берём следующий свободный
    try:
        srv = http.server.ThreadingHTTPServer(('', p), H)
        break
    except OSError:
        continue
else:
    sys.exit(f'Нет свободного порта в диапазоне {port}–{port + 19}')
print(f'http://localhost:{p}')
srv.serve_forever()
