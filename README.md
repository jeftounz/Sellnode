# 🏠 Sellnode - Gestión Inmobiliaria

Sistema integral para la administración de usuarios y ventas de inmuebles.

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