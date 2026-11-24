(function () {
  var lang = document.documentElement.lang || 'de';
  var T = lang === 'de'
    ? { one: '1 Kapitel gefunden', many: ' Kapitel gefunden' }
    : { one: '1 chapter found', many: ' chapters found' };
  var q = document.getElementById('q');
  var count = document.getElementById('count');
  var none = document.getElementById('none');
  var toc = document.getElementById('toc');
  var sections = Array.prototype.slice.call(document.querySelectorAll('#hbody section'));
  var links = {};
  toc.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });

  // Mobile: Inhaltsverzeichnis auf- und zuklappen
  var btn = toc.querySelector('.tocbtn');
  btn.addEventListener('click', function () {
    var open = toc.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  toc.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth <= 860) { toc.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });

  // Aktives Kapitel markieren
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle('on', k === en.target.id); });
        }
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function clearMarks() {
    document.querySelectorAll('#hbody mark').forEach(function (m) {
      var p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
    });
  }

  function mark(section, terms) {
    var walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    var re = new RegExp('(' + terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    nodes.forEach(function (n) {
      if (!re.test(n.nodeValue)) return;
      re.lastIndex = 0;
      var frag = document.createDocumentFragment();
      n.nodeValue.split(re).forEach(function (part, i) {
        if (i % 2) { var m = document.createElement('mark'); m.textContent = part; frag.appendChild(m); }
        else if (part) frag.appendChild(document.createTextNode(part));
      });
      n.parentNode.replaceChild(frag, n);
    });
  }

  function markFirst() {
    var done = false;
    sections.forEach(function (s) { var f = !done && !s.classList.contains('hidden'); s.classList.toggle('first', f); if (f) done = true; });
  }
  markFirst();

  var timer;
  q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 120); });

  function run() {
    clearMarks();
    var raw = q.value.trim();
    var terms = raw.split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) {
      sections.forEach(function (s) { s.classList.remove('hidden'); links[s.id].parentNode.classList.remove('hidden'); });
      none.classList.add('hidden'); count.textContent = ''; markFirst(); return;
    }
    var nt = terms.map(norm), hits = 0, first = null;
    sections.forEach(function (s) {
      var text = norm(s.textContent);
      var ok = nt.every(function (t) { return text.indexOf(t) !== -1; });
      s.classList.toggle('hidden', !ok);
      links[s.id].parentNode.classList.toggle('hidden', !ok);
      if (ok) { hits++; mark(s, terms); if (!first) first = s; }
    });
    markFirst();
    none.classList.toggle('hidden', hits > 0);
    count.textContent = hits ? (hits === 1 ? T.one : hits + T.many) : '';
  }

  q.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var m = document.querySelector('#hbody mark'); if (m) m.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (e.key === 'Escape') { q.value = ''; run(); }
  });

  // Suche über URL, z. B. hilfe.html?q=DXF
  var pre = new URLSearchParams(location.search).get('q');
  if (pre) { q.value = pre; run(); }
})();
