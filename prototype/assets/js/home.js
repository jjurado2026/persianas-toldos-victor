/* =====================================================================
   Persianas y Toldos Víctor · home
   Persiana con mando, fachada de productos, averías, visor de trabajos,
   opiniones, horario en vivo y formulario que deja el correo escrito.
   Parámetros: ?ss (capturas, quieto) · ?ahora=1-10.5 (día 0-6 y hora) · ?caducada
   ===================================================================== */
(() => {
  'use strict';
  window.PTV = true;
  const d = document.documentElement;
  const quieto = d.classList.contains('quieto');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const reflujo = el => el.getBoundingClientRect();

  /* ── Hora de Madrid y horario ─────────────────────────────────────── */
  const HORARIO = { 1: [[9, 13.5], [17, 19.5]], 2: [[9, 13.5], [17, 19.5]], 3: [[9, 13.5], [17, 19.5]], 4: [[9, 13.5], [17, 19.5]], 5: [[9, 14]], 6: [], 0: [] };
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const hora = h => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

  function madrid() {
    const m = location.search.match(/[?&]ahora=(\d)-([\d.]+)/);
    if (m) return { dia: +m[1], h: +m[2] };
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const o = {};
    for (const p of f.formatToParts(new Date())) o[p.type] = p.value;
    return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), h: (+o.hour % 24) + (+o.minute) / 60 };
  }

  function estadoTienda() {
    const { dia, h } = madrid();
    const tramo = HORARIO[dia].find(([a, b]) => h >= a && h < b);
    if (tramo) return { abierto: true, txt: `Abierto ahora, hasta las ${hora(tramo[1])}`, dia, h };
    for (let k = 0; k < 8; k++) {
      const dd = (dia + k) % 7;
      const sig = HORARIO[dd].find(([a]) => k > 0 || a > h);
      if (sig) {
        const cuando = k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${DIAS[dd]}`;
        return { abierto: false, txt: `Cerrado. Abrimos ${cuando} a las ${hora(sig[0])}`, dia, h };
      }
    }
    return { abierto: false, txt: 'Cerrado', dia, h };
  }

  function pintarEstado() {
    const e = estadoTienda();
    $$('[data-estado]').forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      el.classList.toggle('is-cerrado', !e.abierto);
      $('.estado__txt', el).textContent = e.txt;
    });
    $$('.horario__tabla tr').forEach(tr => {
      const hoy = +tr.dataset.dia === e.dia;
      tr.classList.toggle('is-hoy', hoy);
      if (hoy) tr.style.setProperty('--h', Math.min(21, Math.max(8, e.h)).toFixed(2));
    });
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);

  /* ── «En vista» y bucles en pausa fuera de pantalla ──────────────── */
  const vistos = $$('.titulo, .fachada, .trabajos__rejilla, .oficio__texto, .pasos, .horario');
  if (quieto || !('IntersectionObserver' in window)) vistos.forEach(el => el.classList.add('en-vista'));
  else {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('en-vista'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    vistos.forEach(el => io.observe(el));
  }
  const visibles = new Set();
  if (!quieto && 'IntersectionObserver' in window) {
    const ioBucle = new IntersectionObserver(es => es.forEach(en => {
      en.target.classList.toggle('fuera', !en.isIntersecting);
      if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target);
    }));
    $$('main > section, .pie').forEach(s => ioBucle.observe(s));
  }
  const enPantalla = el => quieto || visibles.has(el);

  /* ── Menú del móvil ───────────────────────────────────────────────── */
  const botonMenu = $('.cab__menu'), menu = $('#menu-movil');
  function menuAbierto(si) {
    botonMenu.setAttribute('aria-expanded', String(si));
    menu.hidden = !si;
    d.style.overflow = si ? 'hidden' : '';
    $('span', botonMenu).textContent = si ? 'Cerrar' : 'Menú';
  }
  botonMenu.addEventListener('click', () => menuAbierto(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) menuAbierto(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { menuAbierto(false); botonMenu.focus(); } });
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) menuAbierto(false); });

  /* ── 1 · Persiana con mando ───────────────────────────────────────── */
  const hero = $('.hero');
  const ventana = $('#ventana');
  const persiana = $('#persiana');
  const pano = $('.persiana__pano');
  const mando = $('.mando');
  const botonesMando = $$('[data-mando]');
  const fotos = $$('.ventana__foto');
  const pie = $('#ventana-pie');
  const N = 18, REPOSO = .23, VEL = 1 / 2.4;           // la persiana recorre la ventana entera en 2,4 s
  let cubre = quieto ? .26 : 1;                       // 0 = subida del todo · 1 = bajada del todo
  let objetivo = null, raf = 0, ultimo = 0, alLlegar = null;
  let fotoActual = 0, auto = !quieto, ultimaMano = 0;

  pano.classList.add('con-lamas');
  for (let i = 0; i < N; i++) {
    const l = document.createElement('span');
    l.className = 'persiana__lama';
    l.style.top = `${(i * 100) / N}%`;
    l.style.transitionDelay = `${(N - 1 - i) * 16}ms`;
    pano.insertBefore(l, pano.firstChild);
  }
  const pintar = () => { pano.style.transform = `translate3d(0, ${((cubre - 1) * 100).toFixed(3)}%, 0)`; };
  if (cubre >= 1) persiana.classList.add('is-cerrada');
  pintar();

  function cargar(img) {
    if (img.dataset.srcset) { img.srcset = img.dataset.srcset; delete img.dataset.srcset; }
    if (!img.getAttribute('src')) img.src = img.srcset.split(',').pop().trim().split(' ')[0].replace('-1280', '-960');
    return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
  }

  async function siguienteFoto() {
    const sig = (fotoActual + 1) % fotos.length;
    await cargar(fotos[sig]);
    fotos[fotoActual].classList.remove('is-actual');
    fotos[sig].classList.add('is-actual');
    fotoActual = sig;
    pie.textContent = fotos[sig].dataset.pie;
    pie.classList.remove('cambia'); reflujo(pie); pie.classList.add('cambia');
    cargar(fotos[(sig + 1) % fotos.length]);
  }

  function marcarBotones() {
    botonesMando.forEach(b => {
      const m = b.dataset.mando;
      b.classList.toggle('is-activo', objetivo !== null && ((m === 'subir' && objetivo < cubre) || (m === 'bajar' && objetivo > cubre)));
    });
  }

  function senal() {
    if (quieto) return;
    [mando, ventana].forEach(el => el.classList.remove('is-envia', 'is-recibe'));
    reflujo(mando);
    mando.classList.add('is-envia'); ventana.classList.add('is-recibe');
  }

  function paso(t) {
    const dt = Math.min(.12, (t - ultimo) / 1000);
    ultimo = t;
    const dir = Math.sign(objetivo - cubre);
    cubre += dir * VEL * dt;
    if (dir === 0 || (dir > 0 && cubre >= objetivo) || (dir < 0 && cubre <= objetivo)) {
      cubre = objetivo; pintar(); raf = 0; llegar(); return;
    }
    pintar();
    raf = requestAnimationFrame(paso);
  }

  function llegar() {
    const fin = objetivo, cb = alLlegar;
    objetivo = null; alLlegar = null;
    marcarBotones();
    if (fin >= 1) {
      persiana.classList.add('is-cerrada');
      siguienteFoto();
    }
    if (cb) cb(true);
  }

  // Lleva la persiana a una altura; la promesa se resuelve al llegar (true) o si se para antes (false)
  function irA(valor) {
    if (alLlegar) { const cb = alLlegar; alLlegar = null; cb(false); }
    return new Promise(res => {
      persiana.classList.remove('is-cerrada');
      objetivo = valor; alLlegar = res;
      marcarBotones();
      if (quieto) { cubre = valor; pintar(); llegar(); return; }
      if (!raf) { ultimo = performance.now(); raf = requestAnimationFrame(paso); }
    });
  }
  function parar() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; objetivo = null;
    if (alLlegar) { const cb = alLlegar; alLlegar = null; cb(false); }
    marcarBotones();
  }

  botonesMando.forEach(b => b.addEventListener('click', () => {
    ultimaMano = Date.now();
    auto = false;
    mando.classList.add('usado');
    senal();
    const m = b.dataset.mando;
    if (m === 'parar') parar();
    else irA(m === 'subir' ? 0 : 1);
  }));

  // Recorrido solo: sube al abrir; cada pocos segundos baja, cambia de trabajo y vuelve a subir.
  // Se para fuera de pantalla y cuando se usa el mando; vuelve tras 25 s sin tocarlo.
  async function esperaVisible(ms) {
    let t = 0;
    while (t < ms) { await espera(250); if (enPantalla(hero) && !document.hidden) t += 250; }
  }
  async function recorrido() {
    while (true) {
      await esperaVisible(6500);
      if (!auto) {
        if (Date.now() - ultimaMano > 25000 && objetivo === null) { auto = true; mando.classList.remove('usado'); }
        continue;
      }
      if (!(await irA(1)) || !auto) continue;
      await espera(650);
      if (!auto) continue;
      await irA(REPOSO);
    }
  }
  if (!quieto) {
    const arranque = async () => {
      await espera(700);
      senal();
      await irA(REPOSO);
      recorrido();
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(arranque);
    // La siguiente foto, ya cargada para el primer cambio
    window.addEventListener('load', () => cargar(fotos[1]), { once: true });
  }

  /* ── 2 · Fachada de productos ─────────────────────────────────────── */
  const fachada = $('.fachada');
  const pestanas = $$('.productos [role="tab"]');
  const pins = $$('.pin');
  const fichas = $$('.ficha');
  const piezas = Object.fromEntries($$('[data-fz]').map(el => [el.dataset.fz, el]));
  const orden = pestanas.map(t => t.dataset.producto);
  let elegido = null, tour = !quieto, tourI = 0;
  pins.forEach((p, i) => p.style.setProperty('--n', i));

  function jugar(id) {
    if (quieto) return;
    const el = piezas[id];
    if (!el) return;
    el.classList.remove('juega'); reflujo(fachada); el.classList.add('juega');
    if (id === 'motorizacion') {
      fachada.classList.remove('motor'); reflujo(fachada); fachada.classList.add('motor');
      clearTimeout(jugar.t); jugar.t = setTimeout(() => fachada.classList.remove('motor'), 3200);
    }
  }
  $$('[data-fz]').forEach(el => el.addEventListener('animationend', e => { if (e.target === el || el.contains(e.target)) { if (!el.getAnimations || !el.getAnimations({ subtree: true }).length) el.classList.remove('juega'); } }));

  function mostrarFicha(id) {
    fichas.forEach(f => f.classList.toggle('is-visible', id ? f.id === `p-${id}` : f.id === 'p-inicio'));
  }
  mostrarFicha(null);

  function elegir(id, { foco = false } = {}) {
    tour = false;
    pins.forEach(p => p.classList.remove('is-tour'));
    pestanas.forEach(t => t.classList.remove('is-tour'));
    elegido = id;
    pestanas.forEach(t => {
      const si = t.dataset.producto === id;
      t.setAttribute('aria-selected', String(si));
      t.tabIndex = si ? 0 : -1;
      if (si && foco) t.focus();
    });
    pins.forEach(p => p.classList.toggle('is-activo', p.dataset.ir === id));
    mostrarFicha(id);
    jugar(id);
  }
  pestanas.forEach((t, i) => {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', () => elegir(t.dataset.producto));
    t.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); const j = (pestanas.indexOf(t) + k + pestanas.length) % pestanas.length; elegir(pestanas[j].dataset.producto, { foco: true }); }
      if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); elegir(pestanas[e.key === 'Home' ? 0 : pestanas.length - 1].dataset.producto, { foco: true }); }
    });
  });
  const pantallaAncha = matchMedia('(min-width: 1000px)');
  pins.forEach(p => p.addEventListener('click', () => {
    elegir(p.dataset.ir);
    if (!pantallaAncha.matches) $('.ficha-caja').scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'nearest' });
  }));
  $$('[data-ir]').forEach(a => { if (a.tagName === 'A') a.addEventListener('click', () => elegir(a.dataset.ir)); });

  // Recorrido de la fachada mientras nadie elige: cada pieza se mueve por turnos
  (async () => {
    if (quieto) return;
    const seccion = $('#servicios');
    while (tour) {
      await espera(3300);
      if (!tour || !enPantalla(seccion) || document.hidden || !fachada.classList.contains('en-vista')) continue;
      const id = orden[tourI++ % orden.length];
      pins.forEach(p => p.classList.toggle('is-tour', p.dataset.ir === id));
      pestanas.forEach(t => t.classList.toggle('is-tour', t.dataset.producto === id));
      jugar(id);
    }
  })();

  /* ── Botones «Pedir presupuesto de…»: rellenan el formulario ──────── */
  const form = $('#formulario');
  $$('[data-pedir]').forEach(a => a.addEventListener('click', () => {
    const que = form.querySelector(`input[name="que"][value="${a.dataset.pedir}"]`);
    if (que) que.checked = true;
    if (a.dataset.donde) { const r = form.querySelector(`input[name="donde"][value="${a.dataset.donde}"]`); if (r) r.checked = true; }
  }));

  /* ── 3 · Averías ──────────────────────────────────────────────────── */
  const AVERIAS = {
    cinta: '<strong>Cinta rota.</strong> Cambiamos la cinta y, si hace falta, el recogedor. Es la avería más habitual.',
    atascada: '<strong>No sube o no baja.</strong> Suele ser el eje, un rodamiento o una lama atascada en la guía. Te decimos qué es antes de cambiar nada.',
    caida: '<strong>Caída dentro del cajón.</strong> No tires más de la cinta. Abrimos el cajón y la volvemos a enganchar al eje.',
    lamas: '<strong>Lamas rotas o torcidas.</strong> Cambiamos solo las lamas dañadas, o el paño entero si el sol lo ha castigado.',
    motor: '<strong>El motor no responde.</strong> Revisamos motor, mando y pulsador. Si hay que cambiarlo, te damos opciones.',
    dura: '<strong>Va dura o hace ruido.</strong> Limpiamos y ajustamos guías y eje para que vuelva a correr suave.'
  };
  const anatomia = $('#anatomia');
  const diag = $('[data-diagnostico]');
  const opcionesAveria = $$('[data-averia]').filter(b => b.tagName === 'BUTTON');
  function averia(id, foco) {
    opcionesAveria.forEach(b => {
      const si = b.dataset.averia === id;
      b.setAttribute('aria-checked', String(si));
      b.tabIndex = si ? 0 : -1;
      if (si && foco) b.focus();
    });
    anatomia.dataset.averia = id;
    diag.innerHTML = AVERIAS[id];
    diag.classList.remove('cambia'); reflujo(diag); diag.classList.add('cambia');
  }
  opcionesAveria.forEach((b, i) => {
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener('click', () => averia(b.dataset.averia));
    b.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const j = (opcionesAveria.indexOf(b) + k + opcionesAveria.length) % opcionesAveria.length;
      averia(opcionesAveria[j].dataset.averia, true);
    });
  });

  /* ── 5 · Visor de trabajos ────────────────────────────────────────── */
  const visor = $('#visor');
  const visorImg = $('#visor-img');
  const visorPie = $('#visor-pie');
  const trabajos = $$('[data-visor]').map(b => {
    const img = $('img', b);
    return { src: img.getAttribute('src').replace(/-\d+\.webp$/, '-1280.webp'), alt: img.alt, pie: $('.trabajo__pie', b).textContent };
  });
  let visorI = 0, origenVisor = null;
  function verTrabajo(i) {
    visorI = (i + trabajos.length) % trabajos.length;
    const t = trabajos[visorI];
    const pre = new Image();
    pre.src = t.src;
    visorImg.classList.add('cambia');
    const poner = () => { visorImg.src = t.src; visorImg.alt = t.alt; visorPie.textContent = t.pie; requestAnimationFrame(() => visorImg.classList.remove('cambia')); };
    (pre.decode ? pre.decode() : Promise.resolve()).then(poner, poner);
    new Image().src = trabajos[(visorI + 1) % trabajos.length].src;
  }
  $$('[data-visor]').forEach(b => b.addEventListener('click', () => {
    origenVisor = b;
    verTrabajo(+b.dataset.visor);
    visor.showModal();
  }));
  $$('[data-visor-ir]').forEach(b => b.addEventListener('click', () => verTrabajo(visorI + +b.dataset.visorIr)));
  $('[data-visor-cerrar]').addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor || e.target.classList.contains('visor__dentro')) visor.close(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') verTrabajo(visorI + 1);
    if (e.key === 'ArrowLeft') verTrabajo(visorI - 1);
  });
  visor.addEventListener('close', () => { if (origenVisor) origenVisor.focus(); });

  /* ── 7 · Opiniones ────────────────────────────────────────────────── */
  const seccionOpiniones = $('.opiniones');
  const nombres = $$('[data-opinion]');
  const citas = $$('.cita');
  citas.forEach(c => {
    const p = $('p', c);
    let i = 0;
    p.innerHTML = p.textContent.split(/(\s+)/).map(w => (/\S/.test(w) ? `<span class="palabra" style="--i:${i++}">${w}</span>` : w)).join('');
  });
  function opinion(i, foco) {
    nombres.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; if (i === j && foco) b.focus(); });
    citas.forEach((c, j) => c.classList.toggle('is-visible', i === j));
  }
  opinion(0);
  nombres.forEach((b, i) => {
    b.addEventListener('click', () => opinion(i));
    b.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); opinion((i + k + nombres.length) % nombres.length, true); }
    });
    $('.opiniones__barra span', b).addEventListener('animationend', () => opinion((i + 1) % nombres.length));
  });
  const pausar = si => seccionOpiniones.classList.toggle('pausa', si);
  seccionOpiniones.addEventListener('pointerenter', () => pausar(true));
  seccionOpiniones.addEventListener('pointerleave', () => pausar(seccionOpiniones.contains(document.activeElement)));
  seccionOpiniones.addEventListener('focusin', () => pausar(true));
  seccionOpiniones.addEventListener('focusout', e => { if (!seccionOpiniones.contains(e.relatedTarget)) pausar(false); });

  /* ── 8 · Formulario: deja el correo escrito ───────────────────────── */
  const error = $('#formulario-error');
  const ok = $('#formulario-ok');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = new FormData(form);
    const nombre = (datos.get('nombre') || '').trim();
    const tel = (datos.get('telefono') || '').trim();
    const faltan = [];
    form.nombre.setAttribute('aria-invalid', String(!nombre));
    form.telefono.setAttribute('aria-invalid', String(tel.replace(/\D/g, '').length < 9));
    if (!nombre) faltan.push('tu nombre');
    if (tel.replace(/\D/g, '').length < 9) faltan.push('un teléfono de 9 cifras');
    if (!form.privacidad.checked) faltan.push('aceptar la política de privacidad');
    if (faltan.length) {
      error.textContent = `Para poder llamarte falta ${faltan.join(', ').replace(/, ([^,]*)$/, ' y $1')}.`;
      error.hidden = false; ok.hidden = true;
      (!nombre ? form.nombre : tel.replace(/\D/g, '').length < 9 ? form.telefono : form.privacidad).focus();
      return;
    }
    error.hidden = true;
    const que = datos.getAll('que');
    const lineas = [
      'Hola, quiero pedir presupuesto.', '',
      `Qué necesito: ${que.length ? que.join(', ') : 'Os lo cuento por teléfono'}`,
      datos.get('donde') ? `Dónde va: ${datos.get('donde')}` : '',
      datos.get('medidas') ? `Medidas aproximadas: ${datos.get('medidas')}` : '',
      datos.get('zona') ? `Barrio o población: ${datos.get('zona')}` : '',
      '', `Nombre: ${nombre}`, `Teléfono: ${tel}`
    ].filter((l, i, a) => l !== '' || (a[i - 1] !== '' && i > 0));
    const asunto = `Presupuesto${que.length ? `: ${que.join(', ')}` : ''} (${nombre})`;
    location.href = `mailto:persianasvictor.zz@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(lineas.join('\n'))}`;
    ok.hidden = false;
  });
  $$('input', form).forEach(i => i.addEventListener('input', () => i.removeAttribute('aria-invalid')));
})();
