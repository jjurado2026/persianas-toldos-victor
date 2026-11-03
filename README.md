# Persianas y Toldos Víctor — Propuesta de nueva homepage

Prototipo de homepage para **Persianas y Toldos Víctor** ([persianasytoldosvictor.es](https://persianasytoldosvictor.es/)), tienda de Patraix (Calle Lladró y Mallí, 12, Valencia) con más de 60 años de experiencia en venta, instalación y reparación de toldos y persianas.

**Prototipo:** https://jjurado2026.github.io/persianas-toldos-victor/

**El problema que resuelve:** su web es una plantilla de Elementor de 2023 cuyo título en Google sigue siendo «Just another WordPress site». El aviso de cookies tapa su formulario. El teléfono no se puede pulsar, la oferta del 20 % caducó en marzo de 2023 y no dice nada de reparaciones, que es la búsqueda más urgente del sector. Sus fotos de trabajos reales están al final y sin explicar.

## Ronda 2 (3-nov-2026): «Persiana»

Cambios pedidos por Pablo sobre la v1 «Mando» (etiqueta `v1-home`):

- **Hero:** fuera la ventana central. Ahora es **su foto original del hero** (el toldo a rayas sobre la pared amarilla) a toda pantalla y **partida en lamas 3D**. Al abrir, una persiana granate cerrada gira lama a lama hasta enseñar la foto. Al pasar el cursor, las lamas se inclinan como una persiana de verdad, y cada pocos segundos pasa una onda sola. En el móvil, la onda sale al tocar. Su H1 y su frase literales: «Persianas y Toldos Víctor» y «Venta, instalación y reparación de toldos y persianas en Valencia».
- **Tipografía:** **Clash Display** (titulares) y **Satoshi** (texto), de Fontshare. Modernas, con presencia y fáciles de leer; elegidas en una muestra real frente a Cabinet Grotesk, Gambetta y Boska.
- **Botones:** en reposo, todos iguales, solo con trazo. Bajo el cursor, un **rodillo 3D** gira y enseña la cara de color, y solo se colorea el que está bajo el cursor. El icono del teléfono suena de vez en cuando. Nada marcado por defecto, tampoco en la barra del móvil.
- **Nuestros servicios:** la fachada se conserva, y los servicios van debajo en una **cinta en movimiento constante** (se para con el cursor encima). La ficha del servicio, con sus dos botones, va centrada.
- **¿Se te ha roto la persiana?:** fondo rosa suave del mismo granate. Seis averías en tarjetas a los dos lados de la persiana por dentro, redibujada, que marca la pieza con su rótulo.
- **Ofertas:** su título literal («Estate atento a todas nuestras ofertas y novedades»). Las ofertas, una al lado de otra, avanzan sin parar hacia la izquierda.
- **Más de 60 años de experiencia:** su título y sus textos literales. Sus seis puntos fuertes en tarjetas que entran girando y se colorean con el cursor, a los dos lados de la foto de la pérgola de su bloque, con un **rótulo de paletas** que baraja los números hasta quedarse en 1963.
- **¿Qué opina la gente de nosotros?:** su título. Dos cintas en sentidos contrarios: frases suyas en grande arriba y sus tres opiniones completas abajo.
- **Te asesoramos sin compromiso:** su título. El formulario es una **carta que se rellena** («Hola, me llamo… Podéis llamarme al… o escribirme a…») con los mismos campos que su formulario de presupuesto (nombre, teléfono, email, «¿Cómo podemos ayudarte?» y privacidad) y su botón «Obtener presupuesto». Al lado, sus datos de contacto y el horario en vivo.
- **Preguntas frecuentes:** cada pregunta es una **lama que gira** y enseña la respuesta por detrás.

## Identidad
- **Color:** los tres de su web, granate `#820933`, oliva `#767522` y lima `#D4E79E`, más un rosa suave del mismo granate `#F6EBEE` para las bandas. Sombras con tinte granate.
- **Fotos:** las suyas. La del hero y la de la pérgola son las de su home (las fotos de banco que ya usa), las siete de su «Porfolio», la mampara y el stor de sus ofertas, y la veneciana de su bloque de servicios. Las que se ven más grandes que su original se han ampliado con IA (Real-ESRGAN) devolviéndoles el color exacto.
- **SEO:** su H1, su frase del hero y sus títulos de sección («Nuestros servicios», «Más de 60 años de experiencia», «Te asesoramos sin compromiso», «Que opina la gente de nosotros», «Nuestro trabajo»), con enlaces a sus páginas reales.

## Comprobado, no asumido
Con el kit del taller (Chrome headless por DevTools):
- **El hero cabe entero en los 17 tamaños**, de 320×568 a 2560×1440, también en móvil apaisado y descontando la barra fija.
- Sin desbordamiento horizontal en ningún ancho, y las fotos del cliente a su proporción (10/10).
- **68 pruebas de interacción con ratón, clics y teclado reales**, todas en verde (`_interno/herramientas/probar-r2.mjs`). Cubren:
  - la persiana del hero: cerrada al abrir, girando, inclinándose con el cursor y con su onda;
  - **ningún botón coloreado en reposo** y el rodillo solo bajo el cursor;
  - las cuatro cintas, que se mueven despacio y se paran con el cursor;
  - la fachada con la ficha centrada, las averías, las paletas de 1963 y las lamas de las preguntas;
  - el formulario, que pide solo sus campos, y el visor;
  - el móvil y el movimiento reducido;
  - 19 botones con el cursor quieto 2,5 s: ninguno se queda pillado.
- Cero errores de JavaScript, y solo se animan `transform` y `opacity`.

## Validar con el cliente
- La tilde: su web escribe «Victor»; la propuesta, «Víctor».
- La oferta del 20 % en stores era de febrero-marzo de 2023: la home la presenta como «oferta de temporada», sin fechas.
- Que van a medir a domicilio y reparan persianas y toldos de cualquier marca, y su zona de trabajo («Valencia y alrededores»).
- Si tienen un móvil con WhatsApp (hoy solo dan el fijo y el correo).
- Su web no tiene favicon: el de la propuesta es provisional, con sus colores.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Clash Display y Satoshi autoalojadas (120 KB, licencia ITF de Fontshare). Fachada y persiana por dentro en SVG dibujado a mano. Unos 390 KB la primera vista y 830 KB la página entera.

Parámetros útiles: `?ss` (sin animaciones, para capturas) · `?ahora=1-15` (fija el día, de 0 domingo a 6 sábado, y la hora del horario) · `?caducada` (simula la caducidad).

El HTML de esta ronda se monta con `python _interno/ronda-2/montar.py` (plantilla nueva + bloques que se conservan de la v1).

## Caducidad
**Provisional, como si se enviara el 3-nov-2026:** la propuesta se ve hasta el **jueves 12 de noviembre de 2026 a las 23:59** (hora de Madrid). Desde el 13, `index.html` lleva a `caducada.html`: «No puedes ver esta página porque han pasado más de 10 días desde su envío. Si sigues con interés, escríbeme a jjuradogarciadelrio@gmail.com.» y la home entera en miniatura. La fecha está en el primer `<script>` de `index.html` (`Date.UTC(2026, 10, 12, 23, 0)`) y se ajusta al día real de envío. En local no caduca.

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
