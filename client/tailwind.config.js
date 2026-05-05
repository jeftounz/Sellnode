/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sellnode: {
          primary: '#4f46e5', // El índigo característico
          dark: '#0f172a',    // Slate oscuro para profundidad
          accent: '#10b981',  // Esmeralda para estados positivos
          horror: '#1a1a1a',  // Tono para estéticas minimalistas/oscuras
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem', // Ideal para los contenedores de Settings.jsx
      }
    }
  },
  plugins: [],
}