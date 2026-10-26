/* Поведение интерфейса поверх js/tlsc.js. Логику подбора не трогает — только отображение и доступность. */
(function () {
  'use strict';

  function init() {
    var root = document.getElementById('tlsc');
    if (!root) return;
    var $ = function (s, r) { return (r || root).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
    var header = document.querySelector('.header');
    var headerH = function () { return header ? header.offsetHeight : 0; };
    document.documentElement.style.setProperty('--site-header-h', headerH() + 'px');
    function observe(node, fn, opts) {
      if (!node) return;
      var t;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(fn, 60); })
        .observe(node, opts || { subtree: true, childList: true, characterData: true });
      fn();
    }

    /* Подпись совпадения — те же пороги, что в matchCaptionFor() */
    function caption(p) {
      return p >= 95 ? 'Практически идеально' : p >= 90 ? 'Отлично подходит' : p >= 83 ? 'Очень хорошее совпадение'
        : p >= 74 ? 'Хорошо подходит' : p >= 64 ? 'Подходит с компромиссами' : 'Слабое совпадение';
    }

    /* Галерея: видно 5 фото (на <1200 — 3), стрелки листают по одному без зацикливания */
    var gallery = $('[data-tlsc-gallery]'), steps = $$('[data-tlsc-gallery-step]');
    function galleryItems() { return $$('.tlsc-gallery__item', gallery); }
    function syncGallery() {
      var items = galleryItems(), i = items.findIndex(function (b) { return b.classList.contains('is-active'); });
      steps.forEach(function (btn) {
        var off = +btn.dataset.tlscGalleryStep < 0 ? i <= 0 : i >= items.length - 1;
        btn.setAttribute('aria-disabled', off ? 'true' : 'false');
      });
      var cur = items[i];
      if (!cur) return;
      var row = getComputedStyle(gallery).flexDirection === 'row';
      var pos = row ? cur.offsetLeft - gallery.offsetLeft : cur.offsetTop - gallery.offsetTop;
      var size = row ? cur.offsetWidth : cur.offsetHeight, view = row ? gallery.clientWidth : gallery.clientHeight;
      var scroll = row ? gallery.scrollLeft : gallery.scrollTop, next = scroll;
      if (pos - 4 < scroll) next = pos - 4;
      else if (pos + size + 4 > scroll + view) next = pos + size + 4 - view;
      if (next !== scroll) gallery.scrollTo(row ? { left: next } : { top: next });
    }
    steps.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-disabled') === 'true') return;
        var items = galleryItems(), i = items.findIndex(function (b) { return b.classList.contains('is-active'); });
        var next = items[i + (+btn.dataset.tlscGalleryStep)];
        if (next) next.click();
      });
    });
    if (gallery) {
      new MutationObserver(function () { requestAnimationFrame(syncGallery); }).observe(gallery, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
      syncGallery();
    }

    /* Прокрутка цифр: при смене текста числа плавно идут от старого значения к новому (формат — как в новом тексте) */
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var NUM = /\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
    function parse(t) { return (t.match(NUM) || []).map(function (m) { return { v: parseFloat(m.replace(/[ \u00a0\u202f]/g, '').replace(',', '.')), d: (m.split(',')[1] || '').length, sep: (m.match(/[ \u00a0\u202f]/) || [''])[0] }; }); }
    function fmt(v, n) {
      var p = v.toFixed(n.d).split('.'), i = p[0];
      if (n.sep) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, n.sep);
      return i + (p[1] ? ',' + p[1] : '');
    }
    function countUp(node, dur) {
      if (!node || reduce) return;
      var shown = node.textContent, written = null, raf = 0;
      new MutationObserver(function () {
        var target = node.textContent;
        if (target === written) return;
        cancelAnimationFrame(raf);
        var from = parse(shown), to = parse(target), tpl = target.replace(NUM, '#');
        if (!from.length || from.length !== to.length || shown.replace(NUM, '#') !== tpl || from.every(function (f, i) { return f.v === to[i].v; })) { shown = target; return; }
        var t0 = performance.now(), parts = tpl.split('#');
        (function step(now) {
          var k = Math.min(1, (now - t0) / (dur || 650)), e = 1 - Math.pow(1 - k, 3), out = parts[0];
          to.forEach(function (n, i) { out += fmt(k < 1 ? from[i].v + (n.v - from[i].v) * e : n.v, n) + parts[i + 1]; });
          if (k >= 1) out = target;
          shown = written = out;
          if (node.textContent !== out) node.textContent = out;
          if (k < 1) raf = requestAnimationFrame(step);
        })(t0);
      }).observe(node, { childList: true, characterData: true, subtree: true });
    }
    ['[data-tlsc-price]', '[data-tlsc-match]', '[data-tlsc-budget-delta]', '[data-tlsc-budget-market-label]', '[data-tlsc-journey-price]', '[data-tlsc-journey-match]', '[data-tlsc-compare-alt-price]']
      .forEach(function (sel) { countUp($(sel)); });
    $$('[data-tlsc-journey-count]').forEach(function (n) {
      countUp(n, 800);
      var step = n.closest('.tlsc-journey-step');
      new MutationObserver(function () { step.classList.remove('is-changed'); void step.offsetWidth; step.classList.add('is-changed'); }).observe(n, { childList: true, characterData: true, subtree: true });
    });

    /* Метрики: «9,5/10» → крупное значение (с прокруткой) + «/ 10» */
    $$('.tlsc-metric').forEach(function (row) {
      var src = $('[data-tlsc-metric-value]', row), out = document.createElement('span');
      out.className = 'tlsc-metric__value';
      out.innerHTML = '<b></b> <small></small>';
      row.appendChild(out);
      var b = $('b', out), small = $('small', out);
      countUp(b);
      observe(src, function () {
        var m = src.textContent.trim().match(/^([^/]+)\/\s*(\d+)$/);
        b.textContent = m ? m[1].trim() : src.textContent.trim();
        small.textContent = m ? '/ ' + m[2] : '';
      });
    });

    /* Радар профиля: форма перетекает к новым значениям */
    var shape = $('[data-tlsc-profile-shape]');
    if (shape && !reduce) {
      var pts = function (a) { return a.trim().split(/[\s,]+/).map(Number); }, shownPts = shape.getAttribute('points'), wrote = null, praf = 0;
      new MutationObserver(function () {
        var target = shape.getAttribute('points');
        if (target === wrote) return;
        var a = pts(shownPts), z = pts(target);
        cancelAnimationFrame(praf);
        if (a.length !== z.length) { shownPts = target; return; }
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - k, 3), v = [];
          for (var i = 0; i < z.length; i += 2) v.push((a[i] + (z[i] - a[i]) * e).toFixed(1) + ',' + (a[i + 1] + (z[i + 1] - a[i + 1]) * e).toFixed(1));
          shownPts = wrote = k < 1 ? v.join(' ') : target;
          shape.setAttribute('points', shownPts);
          if (k < 1) praf = requestAnimationFrame(step);
        })(t0);
      }).observe(shape, { attributes: true, attributeFilter: ['points'] });
    }

    /* Сравнение: при смене альтернативы карточка и вывод появляются заново */
    var altName = $('[data-tlsc-compare-alt-name]');
    if (altName) new MutationObserver(function () {
      [altName.closest('.tlsc-compare-card'), $('[data-tlsc-compare-verdict]')].forEach(function (el) {
        if (!el) return; el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap');
      });
    }).observe(altName, { childList: true, characterData: true, subtree: true });

    /* Экспертные настройки раскрыты по умолчанию — как в дизайне */
    var pToggle = $('[data-tlsc-precision-toggle]');
    if (pToggle && pToggle.getAttribute('aria-expanded') !== 'true') pToggle.click();

    /* Экспертные настройки: счётчик активных */
    var controls = $('[data-tlsc-controls]'), counter = $('[data-tlsc-expert-count]');
    function count() {
      var n = $$('[data-tlsc-priority]:checked').filter(function (i) { return i.value !== '0'; }).length;
      if ($('[data-tlsc-brand]').value) n++;
      if ($('[name="available_only"]').checked) n++;
      if ($('[name="strict_budget"]').checked) n++;
      counter.textContent = n;
      counter.hidden = !n;
    }
    /* Приоритеты: ползунок на 3 позиции; значение по-прежнему хранят исходные радиокнопки (name=priority_*) */
    var ranges = $$('.tlsc-priority').map(function (set) {
      var radios = $$('input[type="radio"]', set), legend = $('legend', set), holder = $('.tlsc-priority__choices', set);
      var range = document.createElement('input');
      range.type = 'range'; range.min = 0; range.max = 2; range.step = 1;
      range.className = 'tlsc-range tlsc-range--priority';
      range.setAttribute('aria-label', legend ? legend.textContent.trim() : 'Приоритет');
      holder.appendChild(range);
      function fromRadios() {
        var on = radios.filter(function (r) { return r.checked; })[0], v = on ? on.value : '0';
        range.value = v; range.dataset.value = v;
        range.setAttribute('aria-valuetext', ['Не важно', 'Важно', 'Максимум'][+v]);
      }
      range.addEventListener('input', function () {
        var r = radios.filter(function (x) { return x.value === range.value; })[0];
        if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
        fromRadios();
      });
      fromRadios();
      return fromRadios;
    });
    function syncRanges() { ranges.forEach(function (fn) { fn(); }); }

    if (controls && counter) {
      controls.addEventListener('change', function () { count(); syncRanges(); });
      var reset = $('[data-tlsc-precision-reset]');
      if (reset) reset.addEventListener('click', function () { setTimeout(function () { count(); syncRanges(); }, 0); });
      count();
    }

    /* Наличие показывается всегда: tlsc.js пишет его только у моделей с цветами — иначе берём available из каталога (те же подписи) */
    var stock = $('[data-tlsc-color-stock]'), pLink = $('[data-tlsc-product-link]'), byUrl = {};
    try { JSON.parse($('#tlsc-catalog-data').textContent).forEach(function (p) { byUrl[p.url] = p; }); } catch (e) {}
    function syncStock() {
      var p = byUrl[pLink.getAttribute('href')];
      if (!stock.textContent.trim() && p) stock.textContent = p.available === 'N' ? 'Нет в наличии' : 'В наличии';
      stock.parentNode.classList.toggle('is-out', stock.textContent.trim() === 'Нет в наличии');
    }
    if (stock && pLink) {
      new MutationObserver(syncStock).observe(stock, { childList: true, characterData: true, subtree: true });
      new MutationObserver(syncStock).observe(pLink, { attributes: true, attributeFilter: ['href'] });
      syncStock();
    }

    /* Финалисты: % в кольце (--p) */
    observe($('[data-tlsc-journey-finalists-list]'), function () {
      $$('.tlsc-journey-finalist').forEach(function (btn) {
        var b = $('.tlsc-journey-finalist__meta b', btn);
        if (b) btn.style.setProperty('--p', parseInt(b.textContent, 10) || 0);
      });
    });

    /* Выбранный финалист: подпись совпадения */
    var jMatch = $('[data-tlsc-journey-match]'), jEp = $('[data-tlsc-journey-epithet]');
    observe(jMatch, function () {
      var p = parseInt(jMatch.textContent, 10);
      if (jEp) jEp.textContent = isNaN(p) ? '' : caption(p);
    });

    /* Вкладки: роли и стрелки ← → (ТЗ 2.9) */
    var tabs = $$('[data-tlsc-tab]');
    tabs.forEach(function (tab) {
      var panel = $('[data-tlsc-panel="' + tab.dataset.tlscTab + '"]');
      tab.setAttribute('role', 'tab');
      tab.id = 'tlsc-tab-' + tab.dataset.tlscTab;
      if (panel) {
        panel.id = 'tlsc-panel-' + tab.dataset.tlscTab;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        tab.setAttribute('aria-controls', panel.id);
      }
    });
    function syncTabs() { tabs.forEach(function (t) { var on = t.classList.contains('is-active'); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; }); }
    tabs.forEach(function (t) { new MutationObserver(syncTabs).observe(t, { attributes: true, attributeFilter: ['class'] }); });
    syncTabs();
    var tablist = $('[data-tlsc-tabs]');
    if (tablist) tablist.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var visible = tabs.filter(function (t) { return !t.hidden; }), i = visible.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var next = visible[(i + (e.key === 'ArrowRight' ? 1 : -1) + visible.length) % visible.length];
      next.click();
      next.focus();
    });

    /* Модалка «Ваш подбор»: aria-modal, подпись, ловушка и возврат фокуса */
    var passport = $('[data-tlsc-passport]'), card = $('.tlsc-passport__card'), opener = null;
    if (passport && card) {
      var title = $('.tlsc-passport__eyebrow span', card);
      if (title) { title.id = 'tlsc-passport-label'; card.setAttribute('aria-labelledby', 'tlsc-passport-label'); }
      card.setAttribute('aria-modal', 'true');
      root.addEventListener('click', function (e) { var o = e.target.closest('[data-tlsc-passport-open]'); if (o) opener = o; }, true);
      new MutationObserver(function () {
        if (!passport.classList.contains('is-open') && opener) { opener.focus({ preventScroll: true }); opener = null; }
      }).observe(passport, { attributes: true, attributeFilter: ['class'] });
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !passport.classList.contains('is-open')) return;
        var f = $$('a[href], button:not([disabled])', card).filter(function (n) { return n.offsetParent; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      });
    }

    /* Единая формулировка ссылок «Открыть модель» (tlsc.js пишет «Открыть выбранную модель ↗») */
    var tLink = $('[data-tlsc-territory-link]');
    observe(tLink, function () { if (tLink.textContent.trim() !== 'Открыть модель') tLink.textContent = 'Открыть модель'; });

    /* Карточки моделей открываются на исходном сайте — других страниц в прототипе нет */
    root.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="/"]');
      if (!a) return;
      e.preventDefault();
      window.open('https://turbolemons.ru' + a.getAttribute('href'), '_blank', 'noopener');
    });

    /* Сравнение: в чипах — только роль альтернативы (без цены); вывод — заголовок + текст */
    var cmpSel = $('[data-tlsc-compare-selector]');
    observe(cmpSel, function () {
      $$('button', cmpSel).forEach(function (b) { var t = b.textContent, k = t.indexOf(' · '); if (k > 0) b.textContent = t.slice(0, k); });
    }, { childList: true });
    var verdict = $('[data-tlsc-compare-verdict]');
    observe(verdict, function () {
      var st = $('strong', verdict);
      if (!st || verdict.dataset.done === verdict.innerHTML) return;
      st.textContent = st.textContent.replace(/:\s*$/, '');
      var rest = st.nextSibling;
      if (rest && rest.nodeType === 3) rest.textContent = rest.textContent.replace(/^\s*(\S)/, function (m, c) { return c.toUpperCase(); });
      verdict.dataset.done = verdict.innerHTML;
    }, { childList: true });

    /* Профиль: «9,5/10» → «9,5 / 10» как у метрик */
    var legend = $('[data-tlsc-profile-legend]');
    observe(legend, function () {
      $$('.tlsc-profile-stat strong', legend).forEach(function (st) {
        if ($('b', st)) return;
        var sm = $('small', st), v = st.firstChild ? st.firstChild.textContent : '';
        st.innerHTML = '<b>' + v.trim() + '</b> <small>/ ' + (sm ? sm.textContent.replace('/', '').trim() : '10') + '</small>';
      });
    }, { childList: true });

    /* <1200: параметры в шторке «Фильтры»; кнопка прикреплена к низу экрана */
    var form = $('[data-tlsc-controls]');
    if (form) {
      var mq = window.matchMedia('(max-width: 1199px)');
      var head = document.createElement('div');
      head.className = 'tlsc-sheet__head';
      head.innerHTML = '<span id="tlsc-sheet-title">Фильтры</span><button type="button" class="tlsc-square-btn tlsc-sheet__close" aria-label="Закрыть фильтры"></button>';
      form.insertBefore(head, form.firstChild);
      var backdrop = document.createElement('div');
      backdrop.className = 'tlsc-sheet-backdrop';
      root.appendChild(backdrop);
      var bar = document.createElement('div');
      bar.className = 'tlsc-filters-bar';
      bar.innerHTML = '<button type="button" class="tlsc-btn tlsc-btn--primary" aria-controls="tlsc-filters" aria-expanded="false">Фильтры</button>';
      root.appendChild(bar);
      var openBtn = $('button', bar);
      var setOpen = function (on) {
        root.classList.toggle('is-filters-open', on);
        openBtn.setAttribute('aria-expanded', on);
        document.documentElement.style.overflow = on ? 'hidden' : '';
        if (on) { form.scrollTop = 0; $('.tlsc-sheet__close', head).focus({ preventScroll: true }); }
        else openBtn.focus({ preventScroll: true });
      };
      var sync = function () {
        head.hidden = bar.hidden = !mq.matches;
        if (mq.matches) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); form.setAttribute('aria-labelledby', 'tlsc-sheet-title'); }
        else { ['role', 'aria-modal', 'aria-labelledby'].forEach(function (a) { form.removeAttribute(a); }); if (root.classList.contains('is-filters-open')) setOpen(false); }
      };
      openBtn.addEventListener('click', function () { setOpen(true); });
      $('.tlsc-sheet__close', head).addEventListener('click', function () { setOpen(false); });
      backdrop.addEventListener('click', function () { setOpen(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('is-filters-open')) setOpen(false); });
      (mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync));
      sync();
    }
  }

  /* Шапка и подвал: ссылки ведут на исходный сайт, формы из прототипа не отправляются */
  function site() {
    Array.prototype.forEach.call(document.querySelectorAll('.header a[href^="/"], .footer a[href^="/"], .header-menu a[href^="/"], .mega-menu a[href^="/"]'), function (a) {
      a.href = 'https://turbolemons.ru' + a.getAttribute('href');
      a.target = '_blank'; a.rel = 'noopener';
    });
    Array.prototype.forEach.call(document.querySelectorAll('.footer form'), function (f) {
      f.addEventListener('submit', function (e) { e.preventDefault(); e.stopImmediatePropagation(); }, true);
    });
  }

  function start() { init(); site(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
