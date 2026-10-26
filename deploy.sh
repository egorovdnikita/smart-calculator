#!/bin/sh
# Публикация на Vercel: собирает сайт во временной папке вне git (иначе Vercel блокирует деплой по автору коммита),
# страница кладётся как app.html, чтобы «/?tlsc_api=…» уходил в прокси на исходный сайт (deploy/vercel.json).
set -e
cd "$(dirname "$0")"
DIST=$(mktemp -d)
mkdir -p "$DIST/.vercel"
cp -R assets css data js vendor "$DIST/"
cp index.html "$DIST/app.html"
cp deploy/vercel.json "$DIST/"
[ -f .vercel/project.json ] && cp .vercel/project.json "$DIST/.vercel/"
# Шрифты и картинки шапки (/local/...) — копией в сборку: через прокси Vercel тяжёлые файлы обрываются,
# а шрифты с чужого домена без CORS браузер не загрузит. Фото /upload браузер берёт с исходного сайта напрямую (редирект).
{ grep -ohE "/local/[A-Za-z0-9_./%-]+\.(woff2?|ttf|otf|png|jpe?g|svg|webp|gif|ico)" index.html vendor/*.css vendor/*.js css/*.css js/*.js
  grep -ohE "tl-territory-[a-z]+\.webp" js/tlsc.js | sed 's|^|/local/templates/turbolemons-template/img/|'; } | sort -u |  # фоны «Среды» собираются в JS
while read -r f; do mkdir -p "$DIST$(dirname "$f")"; curl -sfL -m 60 -o "$DIST$f" "https://turbolemons.ru$f" || echo "не скачан: $f"; done
cd "$DIST" && npx -y vercel@latest deploy --prod --yes "$@"
