# Electivos CUL

Plataforma web para la inscripción y gestión de cursos electivos de la Corporación Universitaria Latinoamericana (CUL). Permite a estudiantes explorar y registrarse en electivas, y a administradores gestionar cursos, ofertas e inscripciones en tiempo real.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js 20 + Express 5 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | JWT (8 h) + bcryptjs |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Arquitectura

Monorepo con dos paquetes independientes:

```
electivos-cul/
├── backend/                          # API REST (Express + Supabase)
│   ├── src/
│   │   ├── config/                  # env y cliente Supabase
│   │   ├── modules/                 # módulos por dominio
│   │   │   ├── auth/                # routes → controller → service → repository
│   │   │   ├── courses/
│   │   │   └── enrollments/
│   │   ├── middleware/              # auth, validate, error, notFound
│   │   ├── utils/                   # ApiError, asyncHandler, logger
│   │   ├── routes/                  # agregador de módulos
│   │   ├── app.js                   # crea la app Express
│   │   └── server.js                # entry point (listen)
│   ├── scripts/hash-password.js
│   ├── .env.example
│   ├── railway.json
│   └── package.json
└── frontend/                         # SPA React
    ├── src/{api,components,context,pages}/
    ├── .env.example
    ├── vercel.json
    └── package.json
```

### Patrón por capas (backend)

Cada módulo sigue la misma pirámide:

- **Routes** → declara endpoints, aplica middleware (auth, validate, asyncHandler).
- **Validators** → validación de entrada por endpoint.
- **Controller** → orquesta: lee la request, delega al service, formatea la response.
- **Service** → reglas de negocio (lo que tiene la lógica del dominio).
- **Repository** → única capa que habla con Supabase. Sin lógica de negocio.

Beneficios: tests más fáciles (mockeas el repo), reemplazas Supabase sin tocar el dominio, errores centralizados con `ApiError` + `errorHandler`.

---

## Desarrollo local

### Requisitos

- Node.js ≥ 18 (recomendado 20)
- Cuenta en Supabase con el esquema cargado (tablas `users`, `roles`, `elective_courses`, `course_offerings`, `enrollments`, etc.)

### Backend

```bash
cd backend
cp .env.example .env       # rellena con tus credenciales
npm install
npm run dev                # node --watch, puerto 3000
```

Endpoints:
- `GET /` → ping
- `GET /health` → healthcheck (usado por Railway)
- `POST /api/auth/login`, `POST /api/auth/register`
- `GET /api/cursos`, `GET /api/cursos/ofertas/lista`, etc.
- `POST /api/inscripciones`, `GET /api/inscripciones/mis-inscripciones`

### Frontend

```bash
cd frontend
cp .env.example .env       # en dev déjalo vacío para usar el proxy
npm install
npm run dev                # Vite en puerto 5173
```

Vite hace proxy de `/api → http://localhost:3000` durante desarrollo, así que `VITE_API_URL` puede quedar vacío localmente.

### Generar hash de contraseña para seed

```bash
cd backend
npm run hash MiPassword123
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `SUPABASE_URL` | ✅ | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Clave service-role (NUNCA exponer al frontend) |
| `SUPABASE_ANON_KEY` | ⛔ no se usa hoy | Reservada para usos públicos |
| `JWT_SECRET` | ✅ | Mínimo 32 bytes aleatorios |
| `JWT_EXPIRES_IN` | – | Default `8h` |
| `PORT` | – | Default `3000` (Railway lo inyecta) |
| `NODE_ENV` | – | `development` o `production` |
| `LOG_LEVEL` | – | `error`, `warn`, `info`, `debug` |
| `CORS_ORIGINS` | ✅ en prod | Lista separada por comas. Ej: `https://electivos-cul.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL completa del backend en prod (ej: `https://electivos-cul.up.railway.app/api`). Vacío en dev. |
| `VITE_DEV_PROXY_TARGET` | Solo dev: target del proxy si el back no está en `localhost:3000`. |

---

## Despliegue

### Backend → Railway

1. Crea un proyecto en [Railway](https://railway.app) → **Deploy from GitHub**.
2. Selecciona este repo. En **Settings → Root Directory** pon `backend`.
3. En **Variables** copia todo lo del `.env` (sin `PORT`, Railway lo inyecta) y agrega:
   ```
   NODE_ENV=production
   CORS_ORIGINS=https://<tu-app>.vercel.app
   ```
4. Railway detectará `nixpacks.toml` y `railway.json`. El healthcheck usa `/health`.
5. Al desplegar, copia la URL pública (algo como `https://electivos-cul-production.up.railway.app`).

### Frontend → Vercel

1. Crea un proyecto en [Vercel](https://vercel.com) → **Import Git Repository**.
2. En **Root Directory** pon `frontend`. Framework: **Vite** (autodetectado).
3. En **Environment Variables** añade:
   ```
   VITE_API_URL=https://<tu-app>.up.railway.app/api
   ```
4. Deploy. Vercel detecta `vercel.json` para los rewrites de SPA.
5. Vuelve a Railway y actualiza `CORS_ORIGINS` con la URL final de Vercel.

### Supabase

- Asegúrate de tener el esquema de tablas creado.
- Si las llaves del `.env` que ves en este repo se commitearon en algún momento, **rótalas en Supabase** (Project Settings → API → Reset service role key) y regenera `JWT_SECRET` con:
  ```bash
  openssl rand -base64 48
  ```

---

## Estructura de errores

Todas las respuestas de error siguen el formato:

```json
{ "error": "Mensaje legible", "details": { /* opcional */ } }
```

En desarrollo (`NODE_ENV !== production`) los 500 incluyen el stack para depurar.

---

## Scripts útiles

```bash
# Backend
cd backend
npm run dev          # desarrollo con --watch
npm start            # producción
npm run hash <pass>  # genera bcrypt hash

# Frontend
cd frontend
npm run dev          # dev server
npm run build        # build a /dist
npm run preview      # sirve el build localmente
```
