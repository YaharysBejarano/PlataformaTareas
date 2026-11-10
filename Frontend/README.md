# Frontend - Plataforma de Tareas

Aplicación web desarrollada con **React** y **Vite** para la gestión de tareas personales. Permite a los usuarios registrarse, iniciar sesión, crear tareas, actualizar su estado, filtrar por prioridad y ver el listado de tareas activas.

## Tecnologías utilizadas

* React 19
* Vite
* React Router
* Axios
* CSS

## Funcionalidades

* Registro de usuarios.
* Inicio de sesión.
* Consulta del perfil autenticado.
* Visualización de tareas propias.
* Creación de tareas.
* Edición de tareas.
* Cambios de estado de tareas.
* Eliminación de tareas.
* Integración de contacto por WhatsApp.

## Estructura principal

```bash
Frontend/
├── src/
│   ├── api/
│   ├── componentes/
│   ├── contextos/
│   ├── paginas/
│   └── utilidades/
├── public/
├── package.json
└── README.md
```

## Requisitos previos

* Node.js 20 o superior
* pnpm 11.x
* Git
* Backend del proyecto en ejecución

## Instalación y Configuración del Entorno

A continuación se detallan los pasos para preparar tu entorno según tu sistema operativo.

### Instalación en macOS

Te recomendamos usar [Homebrew](https://brew.sh/) para instalar las dependencias fácilmente:

1. **Instalar Node.js y pnpm:**
   ```bash
   brew install node@20
   brew install pnpm
   ```
2. **Clonar el proyecto y acceder a la carpeta:**
   ```bash
   git clone <url-del-repositorio>
   cd Frontend
   ```
3. **Instalar las dependencias del proyecto:**
   ```bash
   pnpm install
   ```

### Instalación en Windows

1. **Instalar Node.js:**
   * Descarga e instala **Node.js (LTS)** desde su [página oficial](https://nodejs.org/).
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
   cd Frontend
   ```
4. **Instalar las dependencias del proyecto:**
   ```bash
   pnpm install
   ```

## Variables de entorno

Crea un archivo `.env` dentro de la carpeta `Frontend/`. Puedes hacerlo manualmente o desde tu terminal:

**En macOS:**
```bash
echo "VITE_WHATSAPP_SUPPORT=573001234567" > .env
```

**En Windows (PowerShell):**
```powershell
Set-Content .env "VITE_WHATSAPP_SUPPORT=573001234567"
```

El contenido de tu archivo `.env` debe lucir así:

```env
VITE_WHATSAPP_SUPPORT=573001234567
```

Esta variable se usa para definir el número de contacto por WhatsApp mostrado en la aplicación.

## Ejecución en desarrollo

Asegúrate de estar en la carpeta `Frontend/` y ejecuta:

```bash
pnpm dev
```

La aplicación se ejecutará normalmente en:

```bash
http://localhost:5173
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera la versión de producción |
| `pnpm preview` | Previsualiza el build generado |
| `pnpm lint` | Ejecuta ESLint |

## Conexión con el backend

El frontend consume la API REST del backend desde:

```bash
http://localhost:4000/api
```

Por eso, para que todas las funcionalidades trabajen correctamente, el backend debe estar ejecutándose antes o al mismo tiempo que el frontend.

## Flujo general de uso

1. El usuario accede a la aplicación.
2. Puede registrarse o iniciar sesión.
3. Crea una tarea.
4. Consulta el listado de tareas propias.
5. Actualiza el estado o los detalles de una tarea.
6. Elimina tareas completadas o no deseadas.

## Notas de desarrollo

* La aplicación está organizada por páginas, componentes reutilizables, contextos globales y cliente API.
* Axios se usa para centralizar las peticiones HTTP.
* React Router maneja la navegación entre vistas.
* La interfaz está pensada como SPA (Single Page Application).

## Licencia

Proyecto académico con fines educativos.