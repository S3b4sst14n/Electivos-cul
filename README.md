# Electivos CUL

Plataforma web para la inscripción y gestión de cursos electivos de la Corporación Universitaria Latinoamericana (CUL). Permite a estudiantes explorar y registrarse en electivas, y a administradores gestionar cursos, ofertas e inscripciones en tiempo real.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | JWT (8 h) + bcryptjs |

---

## Funcionalidades

### Estudiante
- Catálogo de electivas con filtros por modalidad y cupos disponibles
- Inscripción y cancelación de cursos con actualización automática de cupos
- Historial de inscripciones activas

### Administrador
- Dashboard con métricas: total de electivas, inscripciones activas y tasa de ocupación
- CRUD de electivas (presencial, virtual, mixta)
- Gestión de ofertas académicas (periodo, docente, aula, horario)
- Listado de inscritos por oferta con ordenamiento

---

## Estructura del proyecto

```
Electivos-cul/
├── config/
│   └── supabase.js                 # Cliente Supabase
├── controllers/
│   ├── auth.controller.js          # Registro y login
│   ├── courses.controller.js       # CRUD electivas y ofertas
│   └── enrollments.controller.js   # Inscripciones
├── middleware/
│   └── auth.middleware.js          # Verificación JWT y roles
├── routes/
│   ├── auth.routes.js
│   ├── courses.routes.js
│   └── enrollments.routes.js
├── frontend/
│   └── src/
│       ├── pages/                  # Login, Registro, Catálogo, Dashboard admin…
│       ├── components/             # CourseCard, Toast, Layout, Drawer…
│       ├── context/
│       │   └── AuthContext.jsx     # Estado de sesión global
│       └── api/                    # Clientes Axios por recurso
├── base.sql                        # Esquema de la base de datos
├── server.js                       # Entry point del backend
└── .env.example
```

---

## Instalación

### Requisitos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) con el esquema de `base.sql` aplicado

### 1. Clonar el repositorio

```bash
git clone https://github.com/S3b4sst14n/Electivos-cul.git
cd Electivos-cul
```

### 2. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto a partir del ejemplo:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
JWT_SECRET=tu_jwt_secret_seguro
PORT=3000
```

> Los valores de `SUPABASE_SERVICE_ROLE_KEY` y `JWT_SECRET` se encuentran en **Project Settings → API** de tu panel de Supabase.

### 3. Instalar dependencias

```bash
# Backend
npm install

# Frontend
cd frontend 
npm install
```

---

## Desarrollo

Ejecuta backend y frontend en terminales separadas:

```bash
# Terminal 1 — Backend (con auto-reload)
npm run dev
# → http://localhost:3000

# Terminal 2 — Frontend
cd frontend && npm run dev
# → http://localhost:5173
```

Para producción:

```bash
# Backend
npm start

# Frontend (genera dist/)
cd frontend && npm run build
```

---

## API Reference

### Autenticación con JWT

Los endpoints protegidos requieren el token en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login y tiene validez de **8 horas**.

---

### Auth

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión, retorna JWT | No |

**Registro:**
```json
{
  "first_name": "Juan",
  "last_name": "García",
  "second_last_name": "López",
  "phone": "3001234567",
  "email": "juan@correo.com",
  "identification_type_id": 1,
  "identification_number": "1234567890",
  "password": "mipassword",
  "role_id": 1
}
```

**Login** — usa número de identificación:
```json
{
  "identification_number": "1043671934",
  "password": "admin123"
}
```

---

### Cursos Electivos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/cursos` | Listar todas las electivas | No |
| GET | `/api/cursos/:id` | Obtener electiva por ID | No |
| POST | `/api/cursos` | Crear electiva | Admin |
| PUT | `/api/cursos/:id` | Actualizar electiva | Admin |
| DELETE | `/api/cursos/:id` | Eliminar electiva | Admin |

**Cuerpo para crear/actualizar:**
```json
{
  "name": "Inteligencia Artificial Aplicada",
  "description": "Machine learning y casos de uso empresarial",
  "credits": 3,
  "max_capacity": 30,
  "modality": "virtual"
}
```

> `modality`: `presencial`, `virtual` o `mixta`

---

### Ofertas de Cursos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/cursos/ofertas/lista` | Listar ofertas con detalles | No |
| POST | `/api/cursos/ofertas/nueva` | Crear oferta | Admin |
| PUT | `/api/cursos/ofertas/:id` | Actualizar oferta | Admin |
| DELETE | `/api/cursos/ofertas/:id` | Eliminar oferta | Admin |

**Cuerpo para crear/actualizar:**
```json
{
  "elective_course_id": 1,
  "academic_program_id": 1,
  "academic_period_id": 1,
  "teacher_id": 5,
  "schedule": "Lunes y Miércoles 10:00-12:00",
  "classroom": "Aula 301",
  "available_spots": 30
}
```

---

### Inscripciones

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/inscripciones` | Inscribirse en una oferta | Estudiante |
| DELETE | `/api/inscripciones/:id` | Cancelar inscripción | Estudiante |
| GET | `/api/inscripciones/mis-inscripciones` | Ver mis inscripciones activas | Estudiante |
| GET | `/api/inscripciones/oferta/:offering_id` | Listado de inscritos por oferta | Admin |

**Inscribirse:**
```json
{
  "course_offering_id": 1
}
```

**Ordenar listado por oferta:**
```
GET /api/inscripciones/oferta/1?orden=nombre
GET /api/inscripciones/oferta/1?orden=identificacion
```

---

## Códigos de respuesta HTTP

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Error del cliente (validación, cupo lleno, duplicado) |
| 401 | No autenticado o token inválido |
| 403 | Sin permisos (rol insuficiente) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
