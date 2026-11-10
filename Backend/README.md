# Backend - Plataforma de Tareas

API REST desarrollada con **Node.js**, **Express**, **Sequelize** y **MySQL** para soportar una plataforma de gestión de tareas. Gestiona autenticación de usuarios, creación de tareas, actualización de estado y consulta de tareas propias.

## Tecnologías utilizadas

- Node.js
- Express
- Sequelize
- MySQL
- JWT
- pnpm

## Funcionalidades

- Registro de usuarios.
- Inicio de sesión con autenticación JWT.
- Consulta del perfil autenticado.
- Creación de tareas.
- Listado de tareas propias.
- Consulta de detalle de tarea.
- Actualización de tareas.
- Cambio de estado de tareas.
- Eliminación de tareas.
- Endpoint de verificación de estado del sistema.

## Estructura principal

```bash
Backend/
├── src/
│   ├── app.js
│   ├── config/
│   │   └── baseDatos.js
│   ├── controladores/
│   ├── middleware/
│   ├── modelos/
│   └── rutas/
├── package.json
└── README.md
```

## Requisitos previos

- Node.js 20 o superior
- pnpm 11.x
- MySQL 8 o compatible
- Git

## Instalación y Configuración del Entorno

A continuación se detallan los pasos para preparar tu entorno según tu sistema operativo.

### Instalación en macOS

Te recomendamos usar [Homebrew](https://brew.sh/) para instalar las dependencias fácilmente:

1. **Instalar Node.js y pnpm:**
   ```bash
   brew install node@20
   brew install pnpm
   ```
2. **Instalar e iniciar MySQL:**
   ```bash
   brew install mysql
   brew services start mysql
   ```
3. **Clonar el proyecto y acceder a la carpeta:**
   ```bash
   git clone <url-del-repositorio>
   cd Backend
   ```
4. **Instalar las dependencias del proyecto:**
   ```bash
   pnpm install
   ```

### Instalación en Windows

1. **Instalar Node.js y MySQL:**
   - Descarga e instala **Node.js (LTS)** desde su [página oficial](https://nodejs.org/).
   - Descarga e instala **MySQL Community Server** desde su [página oficial](https://dev.mysql.com/downloads/installer/). Asegúrate de recordar la contraseña del usuario `root`.
2. **Instalar pnpm:**
   Abre PowerShell como administrador y ejecuta:
   ```powershell
   iwr https://get.pnpm.io/install.ps1 -useb | iex
   ```
   *(Alternativa si ya tienes npm):* `npm install -g pnpm`
3. **Clonar el proyecto y acceder a la carpeta:**
   Abre tu terminal (Git Bash, PowerShell o CMD):
   ```bash
   git clone <url-del-repositorio>
   cd Backend
   ```
4. **Instalar las dependencias del proyecto:**
   ```bash
   pnpm install
   ```

## Base de datos

El proyecto utiliza una base de datos llamada:

```sql
CREATE DATABASE tareas_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

**Nota para macOS/Windows:** Puedes ejecutar este comando abriendo tu terminal y entrando a la consola de MySQL (`mysql -u root -p`), o utilizando una interfaz gráfica como MySQL Workbench, DBeaver o TablePlus.

Sequelize crea las tablas `usuarios` y `tareas` al iniciar el backend. No es necesario ejecutar un script SQL. Si ya existe un esquema previo y necesitas aplicar cambios del modelo, activa `DB_SYNC_ALTER=true` temporalmente después de hacer una copia de seguridad.

## Variables de entorno

Desde la carpeta `Backend/`, copia el archivo de ejemplo para crear tus variables locales:

**En macOS:**
```bash
cp .env.example .env
```
**En Windows (PowerShell):**
```powershell
Copy-Item .env.example -Destination .env
```

Completa tus credenciales en el archivo `.env`. Usa un secreto JWT único, por ejemplo el generado con `openssl rand -base64 32` (macOS/Git Bash) o en cualquier generador de tokens online:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tareas_db
DB_USER=root
DB_PASSWORD=tu_contraseña_local
JWT_SECRET=pega_aqui_un_secreto_aleatorio
JWT_EXPIRES_IN=1d
DB_SYNC_ALTER=false
```

## Ejecución en desarrollo

Desde la carpeta `Backend/`, inicia el servidor:

```bash
pnpm dev
```

La API quedará disponible en:

```bash
http://localhost:4000
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Ejecuta la API en desarrollo |
| `pnpm start` | Ejecuta la API en producción |

## Prefijo de la API

La API trabaja con el prefijo:

```bash
/api
```

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesión |
| GET | `/auth/me` | Sí | Obtener perfil autenticado |
| GET | `/tasks` | Sí | Listar tareas propias |
| POST | `/tasks` | Sí | Crear tarea |
| GET | `/tasks/:id` | Sí | Obtener detalle de tarea |
| PUT | `/tasks/:id` | Sí | Actualizar tarea |
| PATCH | `/tasks/:id/status` | Sí | Cambiar estado de tarea |
| DELETE | `/tasks/:id` | Sí | Eliminar tarea |
| GET | `/health` | No | Verificar estado del servicio |

## Modelo de datos

El backend trabaja con una estructura basada en las siguientes tablas:

| Tabla | Descripción |
|---|---|
| `usuarios` | Información de usuarios registrados |
| `tareas` | Información de las tareas creadas por los usuarios |

## Estados de tarea

Las tareas manejan los siguientes estados:

- `PENDIENTE`
- `EN_PROGRESO`
- `COMPLETADA`
- `CANCELADA`

## Notas de desarrollo

- La autenticación se realiza mediante JWT.
- Sequelize administra la comunicación con MySQL.
- La organización del proyecto sigue una separación por rutas, controladores, modelos y middleware.
- El valor `DB_SYNC_ALTER=true` puede usarse temporalmente durante cambios de esquema.

## Licencia

Proyecto académico con fines educativos.