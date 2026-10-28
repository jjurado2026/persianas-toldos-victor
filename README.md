# Persianas y Toldos Víctor — Propuesta de nueva homepage

Prototipo de homepage para **Persianas y Toldos Víctor** ([persianasytoldosvictor.es](https://persianasytoldosvictor.es/)), tienda familiar de Patraix (C/ Lladró y Mallí, 12, Valencia) que vende, instala y repara toldos, persianas, mosquiteras, rejas, estores, ventanas y mamparas desde 1963.

**Prototipo:** https://jjurado2026.github.io/persianas-toldos-victor/

**El problema que resuelve:** su web es una plantilla de Elementor de 2023 cuyo título en Google sigue siendo «Just another WordPress site». El hero es una foto de banco y el aviso de cookies tapa el formulario. El teléfono no se puede pulsar, la oferta del 20 % caducó en marzo de 2023 y no dice nada de reparaciones, que es la búsqueda más urgente del sector. Sus siete fotos de trabajos reales están al final y sin explicar.

## Dirección estética: «Mando»

La home es una persiana que manejas tú. En el centro del hero hay una ventana con sus trabajos reales detrás de una **persiana motorizada de verdad**, y a su lado **el mando** (▲ ■ ▼), que además es uno de sus servicios. Al abrir, la persiana sube con luz entre las lamas y se queda con unas lamas a la vista. Cada pocos segundos baja, cierra las lamas, cambia de trabajo y vuelve a subir. Con el mando la manejas tú. El titular se lee a los dos lados de la ventana: «Toldos y persianas | en Valencia, desde 1963.»

- **Color:** los tres de su web: granate `#820933`, oliva `#767522` y lima `#D4E79E`, sobre un blanco con un punto de su lima `#F8FAF0`. Sombras con tinte granate.
- **Tipografía:** **Funnel Display** en los titulares y **Funnel Sans** en el texto: una grotesca de 2024 con trampas de tinta, moderna y con oficio, que se lee a la primera. 35 KB en total.
- **Motivo de las lamas, solo en tres sitios:** la persiana del hero, la persiana por dentro de «¿Se te ha roto la persiana?» y el horario en siete lamas.

## La home, de arriba abajo
1. **Cabecera fija** con sus páginas reales (Inicio, Sobre nosotros, Contacto), el teléfono y «Pedir presupuesto». En el móvil, menú a pantalla completa y barra fija con Llamar, Presupuesto y Cómo llegar.
2. **Hero «Mando»:** la ventana con la persiana y el mando, los botones de presupuesto y llamar, y el estado de la tienda en vivo («Abierto ahora, hasta las 13:30» / «Cerrado. Abrimos hoy a las 17:00»). Debajo, la franja de productos.
3. **¿Qué quieres cambiar en casa?** Una fachada de finca valenciana con diez puntos: toldo del ático, persianas, motorización, mosquitera, stor de balcón, estor, ventana, mampara del baño, cerramiento del bar y reja. Cada producto se mueve en la fachada (el toldo se recoge, el stor sube, la persiana baja, la reja se cierra…) y abre su ficha con foto suya y botón «Pedir presupuesto de…», que deja marcado el formulario.
4. **¿Se te ha roto la persiana?** Seis averías en una línea cada una. Al elegir, la persiana abierta por dentro (cajón, eje, polea, motor, cinta, recogedor, guías y lamas) marca la pieza y lo cuenta: la cinta se parte, el paño cae dentro del cajón, una lama se tuerce, el motor parpadea.
5. **Ofertas de la tienda:** mampara fija de ducha desde 190 € en 48 h, con su etiqueta de precio que se mece, y el stor de balcón con un 20 %.
6. **Nuestro trabajo:** sus siete fotos reales con su pie, el sol que cruza la foto al pasar el cursor y visor con flechas.
7. **Más de 60 años dando sombra en Valencia:** el sello «1963» que gira, sus garantías y los cuatro pasos unidos por el brazo articulado de un toldo que se despliega.
8. **Lo que dicen nuestros clientes:** sus tres opiniones, que pasan solas palabra a palabra.
9. **Pide tu presupuesto y ven a la tienda:** formulario corto (qué, dónde, nombre, teléfono, barrio, medidas) que abre el correo ya escrito, y el horario en siete lamas con la hora de ahora.
10. **Preguntas frecuentes** y pie con horario, contacto y sus páginas legales.

## Fotos
Las suyas: las siete de su «Porfolio» (cuadradas, sin recortar), la mampara y el stor de sus ofertas, y la veneciana de su bloque de servicios. Las fotos de banco de su web (el hero de Unsplash, la pérgola de hotel) no se usan. Las que se ven más grandes que su original se han ampliado con IA (Real-ESRGAN, remacri en las lonas y x4plus en la ventana), devolviéndoles el color exacto del original.

## Comprobado, no asumido
Con el kit del taller (Chrome headless por DevTools):
- **El hero cabe entero en los 17 tamaños**, de 320×568 a 2560×1440, también en móvil apaisado y descontando la barra fija.
- Sin desbordamiento horizontal en ningún ancho, y las fotos del cliente a su proporción (10/10).
- **62 pruebas de interacción con ratón, clics y teclado reales**, todas en verde: persiana y mando, horario en seis momentos de la semana, fachada, averías, visor, opiniones, formulario, menú del móvil y movimiento reducido. Incluyen 21 botones con el cursor quieto 2,5 s: ninguno se queda pillado.
- Cero errores de JavaScript, y solo se animan `transform` y `opacity`.
- Con `prefers-reduced-motion`, nada se mueve y el mando funciona al instante.

## Validar con el cliente
- La tilde: su web escribe «Victor»; la propuesta, «Víctor».
- La oferta del 20 % en stores era de febrero-marzo de 2023: la home la presenta como «oferta de temporada», sin fechas.
- Que van a medir a domicilio y reparan persianas y toldos de cualquier marca, y su zona de trabajo («Valencia y alrededores»).
- Si tienen un móvil con WhatsApp (hoy solo dan el fijo y el correo).
- Si motorizan también con el móvil (domótica).

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Funnel Display y Funnel Sans autoalojadas. Fachada y persiana por dentro en SVG dibujado a mano. Unos 350 KB la primera vista y 730 KB la página entera.

Parámetros útiles: `?ss` (sin animaciones, para capturas) · `?ahora=1-15` (fija el día, de 0 domingo a 6 sábado, y la hora del horario) · `?caducada` (simula la caducidad).

## Caducidad
**Provisional, como si se enviara el 28-oct-2026:** la propuesta se ve hasta el **viernes 6 de noviembre de 2026 a las 23:59** (hora de Madrid). Desde el 7, `index.html` lleva a `caducada.html`: «No puedes ver esta página porque han pasado más de 10 días desde su envío. Si sigues con interés, escríbeme a jjuradogarciadelrio@gmail.com.» y la home entera en miniatura. La fecha está en el primer `<script>` de `index.html` (`Date.UTC(2026, 10, 6, 23, 0)`) y se ajusta al día real de envío. En local no caduca.

## Ver en local
```bash
cd prototype && python -m http.server 8000
```

## Publicar
```bash
git subtree push --prefix=prototype origin gh-pages
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
