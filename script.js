/* Сырой огонь — интерактив */

(function () {
  'use strict';

  /* ---------- шапка ---------- */
  var header = document.getElementById('site-header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- мобильное меню ---------- */
  var burger = document.querySelector('.js-toggle-menu');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    mobileMenu.hidden = !open;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', function () {
    setMenu(mobileMenu.hidden);
  });
  document.querySelectorAll('.js-close-menu').forEach(function (el) {
    el.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- меню блюд ---------- */
  var tabs = document.querySelectorAll('.menu-tab');
  var lists = document.querySelectorAll('.menu-list');
  var moreBtn = document.querySelector('.js-menu-more');
  var moreLabel = moreBtn.querySelector('.label');
  var expanded = false;

  function renderMore() {
    lists.forEach(function (list) {
      list.querySelectorAll('.menu-extra').forEach(function (item) {
        item.hidden = !(expanded && list.dataset.menuList === activeMenu());
      });
    });
    var visible = document.querySelector('.menu-list:not([hidden])');
    var extras = visible ? visible.querySelectorAll('.menu-extra').length : 0;
    moreBtn.hidden = extras === 0;
    moreBtn.classList.toggle('is-open', expanded);
    moreLabel.textContent = expanded ? 'Свернуть меню' : 'Смотреть полное меню';
  }

  function activeMenu() {
    var t = document.querySelector('.menu-tab.is-active');
    return t ? t.dataset.menu : 'food';
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.classList.toggle('menu-tab-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      lists.forEach(function (list) {
        list.hidden = list.dataset.menuList !== tab.dataset.menu;
      });
      renderMore();
    });
  });

  moreBtn.addEventListener('click', function () {
    expanded = !expanded;
    renderMore();
  });

  lists.forEach(function (list) {
    list.hidden = list.dataset.menuList !== 'food';
  });
  tabs.forEach(function (t) {
    t.classList.toggle('menu-tab-active', t.classList.contains('is-active'));
  });
  renderMore();

  /* ---------- галерея ---------- */
  var slides = [
    { src: 'assets/gallery-flame.jpg', alt: 'Повар готовит блюдо на открытом огне', title: 'Живой огонь', note: 'Высокая температура. Чистый вкус.' },
    { src: 'assets/gallery-grill.jpg', alt: 'Повар работает у гриля в дыму', title: 'Дым', note: 'Тонкий аромат вместо тяжести.' },
    { src: 'assets/gallery-dish.jpg', alt: 'Шеф-повар оформляет авторское блюдо', title: 'Подача', note: 'Последний штрих перед залом.' },
    { src: 'assets/gallery-lobster.jpg', alt: 'Морепродукты готовятся на открытом огне', title: 'Продукт', note: 'Огонь подчёркивает, а не скрывает.' }
  ];

  var current = 0;
  var img = document.getElementById('gallery-img');
  var idx = document.getElementById('gallery-index');
  var title = document.getElementById('gallery-title');
  var note = document.getElementById('gallery-note');
  var dotsWrap = document.getElementById('gallery-dots');
  var viewer = document.querySelector('.gallery-viewer');

  slides.forEach(function (s, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Фотография ' + (i + 1));
    dot.addEventListener('click', function () { show(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('button');

  function show(i) {
    current = (i + slides.length) % slides.length;
    var s = slides[current];
    img.src = s.src;
    img.alt = s.alt;
    idx.textContent = String(current + 1).padStart(2, '0');
    title.textContent = s.title;
    note.textContent = s.note;
    dots.forEach(function (d, di) { d.classList.toggle('is-active', di === current); });
  }

  document.querySelector('.gallery-arrow-left').addEventListener('click', function () { show(current - 1); });
  document.querySelector('.gallery-arrow-right').addEventListener('click', function () { show(current + 1); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  show(0);

  /* ---------- бронирование ---------- */
  var modal = document.getElementById('booking-modal');
  var form = document.getElementById('booking-form');
  var noteEl = document.getElementById('form-note');
  var lastFocus = null;

  function openModal() {
    setMenu(false);
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input');
    if (first) first.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    noteEl.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.js-open-booking').forEach(function (b) {
    b.addEventListener('click', openModal);
  });
  document.querySelectorAll('.js-close-booking').forEach(function (b) {
    b.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    noteEl.hidden = false;
    form.reset();
    setTimeout(closeModal, 2200);
  });

  /* ---------- появление блоков ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
