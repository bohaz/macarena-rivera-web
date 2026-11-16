# Macarena Rivera Arquitectura — sitio web

Landing page de **Macarena Rivera Arquitectura** (Algarrobo, Litoral Central): permisos de edificación, recepción final, regularización, diseño y tasaciones.

Propuesta de [Tu Plan Digital](https://tuplandigital.cl), basada en el diseño de referencia «Homefy» (Dribbble) y adaptada a la marca de la arquitecta.

## Stack
- HTML + CSS + JavaScript sin dependencias ni build (Plan Web).
- Animaciones en CSS; JS solo activa estados (revelado al hacer scroll, menú activo, testimonios, comparador antes/después, mensaje rápido a WhatsApp).
- Respeta `prefers-reduced-motion`.

## Estructura
```
index.html
assets/
  css/styles.css   # tokens de marca en :root
  js/main.js
  img/             # imágenes en webp + logo en png transparente
```

## Desarrollo local
Abrir `index.html` o servir la carpeta:
```
npx serve .
```

## Pendientes antes de producción
- Reemplazar las imágenes (recortadas de Instagram) por originales en alta resolución.
- Confirmar horario de atención (Instagram: 10:00–17:00 / web actual: 09:00–17:00).
- Confirmar texto completo del testimonio de Juan Patricio Moreno.
