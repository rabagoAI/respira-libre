# 🚭 Respira Libre

Una aplicación web para ayudar a las personas a dejar de fumar, visualizando sus beneficios de salud y ahorros económicos.

## ✨ Características

- 📊 **Dashboard personalizado** con estadísticas en tiempo real
- 📝 **Registro diario** del consumo, con la opción de apuntar días pasados
- 📈 **Gráfica de evolución** de los últimos 30 días y tendencia
- 💰 **Cálculo de ahorro económico** basado en tu consumo real
- 🫁 **Timeline de beneficios de salud** basados en estudios médicos
- 🎯 **Objetivos de ahorro** con 20+ metas predefinidas
- 💾 **Copia de seguridad** exportable e importable en JSON
- 📱 **Diseño responsive** que funciona en todos los dispositivos
- 🔒 **Privacidad total** - tus datos solo se guardan en tu navegador

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Recharts** - Gráficas
- **date-fns** - Manejo de fechas
- **Lucide React** - Iconos
- **Vitest** - Tests

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/rabagoAI/respira-libre.git

# Entrar al directorio
cd respira-libre

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🧪 Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Ejecuta los tests una vez |
| `npm run test:watch` | Tests en modo observación |
| `npm run lint` | Revisa el código con ESLint |
| `npm run build` | Build para producción en `dist/` |
| `npm run preview` | Sirve el build de producción |

## 📁 Estructura

```
src/
├── components/   # Componentes de la interfaz
├── hooks/        # Hooks reutilizables (localStorage, formularios, diálogos)
├── utils/        # Cálculos, fechas, validación y copias (con sus tests)
├── data/         # Objetivos de ahorro predefinidos
└── test/         # Configuración de Vitest
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado por [Paco Rábago](https://github.com/rabagoAI)
