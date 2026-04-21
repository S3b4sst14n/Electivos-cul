# Electivas CUL — Frontend

Interfaz React para la plataforma de inscripción de electivas.

## Instalación

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y proxea `/api` hacia `http://localhost:3000` (backend Express).

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios (con interceptor JWT automático)
- Lucide React (iconos)

## Estructura

```
src/
├── api/         Cliente Axios y endpoints
├── components/  Design system (Cards, Badges, Drawer, Modal, Toast)
├── context/     AuthContext (JWT + usuario)
├── pages/       Vistas por ruta (estudiante y admin)
├── App.jsx      Router
└── main.jsx     Entrada
```

## Rutas

**Estudiante:** `/cursos`, `/mis-inscripciones`
**Admin:** `/admin/dashboard`, `/admin/electivas`, `/admin/ofertas`, `/admin/inscripciones`
**Públicas:** `/login`, `/registro`

## Design tokens (tailwind.config.js)

- Primary: `#1E3A5F` (azul institucional)
- Accent: `#F6A623`
- Success/Warning/Danger semánticos
- Tipografía: Inter
