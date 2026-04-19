# Branko Iriart — Sitio Web Oficial Premium

> Landing page de alta gama para el **Dr. Branko Iriart**, especialista en Estética y Armonización Facial. Este sitio representa la excelencia médica a través de un diseño editorial de lujo, tipografía refinada y efectos visuales de vanguardia.

---

## 🏛️ Descripción del Proyecto

Esta landing page ha sido desarrollada bajo estándares de **UI/UX Pro Max**, enfocándose en la sobriedad y el prestigio. Utiliza un estilo *Dark Luxury* donde el negro profundo contrasta con acentos en oro profesional, evocando precisión y exclusividad.

**Características clave:**
- **Hero Geometrico**: Un efecto visual hipnótico con formas orgánicas y geométricas que reaccionan al scroll.
- **Arquitectura Escalable**: Basada en los principios de `shadcn/ui`, facilitando la mantenibilidad.
- **Rendimiento Optimo**: Construida con Vite para una carga instantánea y animaciones fluidas a 60fps.
- **Mobile First**: Experiencia táctil optimizada para dispositivos de alta resolución.

---

## 🚀 Stack Tecnológico

| Tecnología       | Uso                                      |
|:-----------------|:-----------------------------------------|
| **React 18**     | Biblioteca base para la UI               |
| **Vite**         | Herramienta de compilación ultra rápida  |
| **TypeScript**   | Desarrollo robusto con tipado estático   |
| **Tailwind CSS** | Utilidades de layout y efectos modernos  |
| **SCSS Modules** | Estilos encapsulados con @use y mixins   |
| **Framer Motion**| Motor de animaciones premium             |
| **Lucide React** | Iconografía SVG minimalista y elegante   |

---

## 📁 Estructura del Proyecto

```
branko-iriart-web/
├── src/
│   ├── assets/
│   │   └── hero.png                  # Imagen principal del Dr.
│   ├── components/
│   │   ├── ui/
│   │   │   └── shape-landing-hero.tsx  ← Hero animado premium
│   │   ├── Navbar.tsx / .module.scss
│   │   ├── Hero.tsx
│   │   ├── Services.tsx / .module.scss
│   │   ├── About.tsx / .module.scss
│   │   ├── Results.tsx / .module.scss
│   │   ├── Contact.tsx / .module.scss
│   │   └── Footer.tsx / .module.scss
│   ├── lib/
│   │   └── utils.ts                  # Utilidad cn() de shadcn
│   ├── styles/
│   │   └── variables.scss            ← Design tokens (sass:color)
│   ├── App.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts                 # Declaraciones globales de TS
│   └── index.css                     # Directivas Tailwind
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Design System

### Paleta de Colores
- **Brand Black**: `#080808` (Fondo sofisticado)
- **Brand Gold**: `#C9A96E` (Prestigio y precisión)
- **Brand Cream**: `#F5F0E8` (Legibilidad editorial)

### Tipografía
- **Headings**: `Cormorant Garamond` (Serif de lujo)
- **Body**: `Montserrat` (San-serif moderna y limpia)

---

## 🧩 Componente HeroGeometric

El corazón visual del sitio. Implementado con `framer-motion` para crear un fondo dinámico que no distrae, sino que eleva el contenido.

```tsx
<HeroGeometric
  badge="Estética Facial de Alta Precisión"
  title1="La belleza que ya"
  title2="tenés."
  subtitle="Botox, Plasma PRP, Ácido Hialurónico..."
/>
```

---

## ⚡ Guía de Inicio

> [!CAUTION]
> Asegúrate de estar dentro de la carpeta del proyecto antes de ejecutar comandos.

```bash
# 1. Entrar a la carpeta
cd branko-iriart-web

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Otros Comandos
- `npm run build`: Genera el bundle de producción optimizado.
- `npm run type-check`: Ejecuta la verificación de tipos de TypeScript.
- `npm run preview`: Previsualiza el build de producción localmente.

---

## 📍 Información del Cliente

- **Doctor**: Dr. Branko Iriart (IMP 15.493)
- **Instagram**: [@biesteticafacial](https://instagram.com/biesteticafacial)
- **Ubicación**: Ensenada & La Plata, Argentina.

---

## 📋 Checklist de Calidad UI/UX

- [x] Arquitectura de componentes 100% TypeScript.
- [x] Estilos SCSS con `@use` y manipulación de color moderna.
- [x] Optimización de imágenes y SVG.
- [x] Accesibilidad (Aria-labels y contraste adecuado).
- [x] Responsive Design verificado (Mobile, Tablet, Desktop).

