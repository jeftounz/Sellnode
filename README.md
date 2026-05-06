# Sellnode - Real Estate Management 
SystemSellnode es una plataforma integral diseñada para la administración de inventario inmobiliario y la gestión de equipos de trabajo. Permite un control exhaustivo sobre las propiedades, su estatus de venta y el acceso de los colaboradores al sistema administrativo.  

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **ORM:** Sequelize
- **Database:** PostgreSQL

## Security focus
Este proyecto sigue las guías de **OWASP** para garantizar:
- Validación de entradas robusta.
- Gestión segura de sesiones (JWT + HttpOnly Cookies).
- Prevención de SQL Injection.
- Hasheo de contraseñas con Argon2/Bcrypt.

## Structure
```bash
real-estate-management/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── config/         # DB (Sequelize) y variables
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Auth, ErrorHandler, Validations
│   │   ├── models/         # User, House
│   │   ├── routes/         # Definición de Endpoints
│   │   └── app.js          # Punto de entrada
│   ├── .env
│   └── package.json
├── client/                 # Frontend React (Vite)
│   ├── src/
│   │   ├── components/     # UI reusable
│   │   ├── context/        # AuthContext (Estado global)
│   │   ├── pages/          # Vistas (Login, Register, Dashboard)
│   │   ├── services/       # Axios API calls
│   │   └── utils/          # Helpers
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```


## Features

- Gestión de Inmuebles: Listado con búsqueda en tiempo real, filtrado por estatus y paginación de 6 elementos por página.
- Administración de Usuarios: Control de acceso para el equipo con visualización en tabla y scroll automático para optimización de UI.
- Seguridad y Validación: Sanitización de entradas anti-XSS, límite estricto de 250 caracteres por campo y validación de precios no negativos.  
- Autenticación: Login seguro con visor de contraseña y registro con doble verificación de clave.  


## Installation. 

1. Clonar el repositorio
```bash
clone https://github.com/tu-usuario/sellnode.git
cd sellnode
```
2. Configurar el BackendBashcd server
```bash
npm install
```

# Configure su archivo .env con las credenciales de PostgreSQL

```bash
npm run dev
```

3. Configurar el FrontendBash
```bash
cd ../client
npm install
npm run dev
```

## Database Configuration

La aplicación utiliza una base de datos PostgreSQL llamada real_estate_magnament. 
Ejecute los siguientes queries en orden:
SchemaSQL-- 
1. Activar extensión para UUIDs
```bash
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Usuarios
CREATE TABLE "Users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

```bash
-- 3. Tabla de Inmuebles
CREATE TABLE "Houses" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "address" TEXT NOT NULL,
    "price" DECIMAL(12, 2) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'disponible',
    "sellerId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

```

### Seeds
Utilice estos datos para habilitar el acceso administrativo inicial y visualizar la paginación:  
SQL-- Acceso: admin@sellnode.com | admin123
```bash
INSERT INTO "Users" ("name", "email", "password", "createdAt", "updatedAt")
VALUES ('Admin Sellnode', 'admin@sellnode.com', '$2b$10$Y56mXgJkE.TupYlUvUq7BuK7.eXGgQZ1VzG2iH0K6H3K6H3K6H3K6', NOW(), NOW());
```
-- Inmuebles de prueba

```bash
INSERT INTO "Houses" ("address", "price", "status", "sellerId", "createdAt", "updatedAt")
VALUES 
('Avenida Los Próceres #45', 125000.00, 'disponible', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW()),
('Calle Liminal 123', 85400.50, 'disponible', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW()),
('Residencias Altamira 4B', 210000.00, 'vendido', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW()),
('Sector La Morita, Casa 12', 45000.00, 'disponible', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW()),
('Quinta Aurora, Las Delicias', 320000.00, 'disponible', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW()),
('Calle Falsa 123', 15000.99, 'disponible', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW()),
('Backrooms Level 0', 999.00, 'disponible', (SELECT id FROM "Users" LIMIT 1), NOW(), NOW());

```

## APIS

### 🔐 Autenticación (Auth)

POST /api/auth/login: Valida las credenciales (email y contraseña) de un colaborador para permitirle el acceso al dashboard.  

POST /api/auth/register: Registra un nuevo usuario en la plataforma, almacenando su nombre, correo corporativo y contraseña.  

### 🏠 Gestión de Inmuebles (Houses)

GET /api/houses: Recupera el listado completo de todas las propiedades registradas en el inventario.  

POST /api/houses: Crea un nuevo registro de inmueble con datos como dirección, precio y estado inicial.  

PUT /api/houses/:id: Permite modificar los datos existentes de una propiedad específica (como actualizar un precio o cambiar su estado a "vendido").  

DELETE /api/houses/:id: Elimina de forma permanente el registro de un inmueble de la base de datos.  

### 👥 Administración de Usuarios (Users)

GET /api/users: Obtiene la lista de todos los colaboradores que tienen acceso al sistema.  

PUT /api/users/:id: Actualiza la información de un colaborador, permitiendo cambiar su nombre, correo o activar/desactivar su cuenta.  

DELETE /api/users/:id: Remueve a un usuario del equipo administrativo permanentemente.