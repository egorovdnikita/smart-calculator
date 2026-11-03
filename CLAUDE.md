# Smart Calculator — паспорт проекта

## Что это

Прототип адаптивной страницы подбора техники: параметры поездки слева, рекомендованная модель справа, воронка отбора, финалисты и баннер среды. Статика без сборки. Демо: https://smart-calculator-jet.vercel.app

## Структура

- `index.html` — шапка/подвал сайта + разметка калькулятора.
- `data/catalog.js` — каталог моделей.
- `js/tlsc.js` — логика подбора. `js/enhance.js` — поведение интерфейса.
- `css/` — токены и стили по блокам, `vendor/` — шапка, подвал, корзина.
- `serve.py` — локальный сервер с прокси на исходный сайт, `deploy.sh` + `deploy/vercel.json` — публикация на Vercel.

Подробно — [docs/architecture.md](docs/architecture.md).

## Правила

- `js/tlsc.js` не менять.
- Разметка сохраняет все `data-tlsc-*` хуки и имена полей, на которые опирается `js/tlsc.js`.
- Оформление заказа заблокировано (`serve.py` и `deploy/vercel.json` блокируют `submit.php`/`hit.php`) — не снимать.
- `serve.py` и `deploy.sh` лежат в корне, а не в `scripts/`: оба считают корень проекта от своего расположения, а `.claude/launch.json` запускает `serve.py` из корня.

## Запуск

`python3 serve.py` → http://localhost:5173. Публикация — `./deploy.sh` ([docs/deploy.md](docs/deploy.md)).
