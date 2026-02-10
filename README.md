# 🎯 Ar-gen-do-ku: Generador Infinito

Un generador de sudokus interactivo con diseño elegante estilo campo argentino. Crea puzzles de Sudoku en tres niveles de dificultad, juega directamente en el navegador o imprime en PDF.

## ✨ Características

- **3 Niveles de Dificultad**: Inicial (Fácil), Intermedio, Avanzado
- **Diseño Responsive**: Optimizado para desktop y dispositivos móviles (4.5", 5", 5.5", 6.5")
- **Juego Interactivo**: Completa los puzzles directamente en el navegador
- **Página de Soluciones**: Verifica tus respuestas en una segunda página
- **Impresión PDF**: Genera hojas listas para imprimir
- **Validación en Tiempo Real**: Feedback visual cuando completas correctamente un puzzle
- **Escarapela Argentina**: Favicon personalizado con los colores nacionales
- **Decoración Temática**: Elementos visuales argentinos (molino, mate)

## 🗂️ Estructura del Proyecto

```
ArgenDo-Ku/
├── index.html                 # Archivo principal (limpio)
├── css/
│   ├── reset.css             # Reset CSS para empezar de cero
│   └── styles.css            # Estilos personalizados
├── js/
│   ├── sudoku-engine.js      # Motor de generación y resolución de Sudoku
│   └── ui.js                 # Lógica de interfaz de usuario
├── assets/
│   └── favicon.svg           # Escarapela argentina
├── .github/workflows/
│   └── pages.yml             # GitHub Actions para deploy
├── .nojekyll                 # Desactiva Jekyll en GitHub Pages
├── package.json
└── README.md                 # Este archivo
```

## 🚀 Inicio Rápido

### En el Navegador
1. Abre el sitio en GitHub Pages o localmente
2. Selecciona el nivel de dificultad
3. Haz clic en "Generar Nueva Hoja"
4. ¡Comienza a jugar!

### Para Imprimir
1. Selecciona el nivel deseado
2. Haz clic en "Imprimir PDF"
3. Tu navegador abrirá el diálogo de impresión
4. Ajusta preferencias y imprime

## 💻 Desarrollo Local

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Opcional: VS Code o editor de texto

### Setup
```bash
# Clona el repositorio
git clone https://github.com/FacundoDLF/ArgenDo-Ku.git
cd ArgenDo-Ku

# Abre index.html en tu navegador
# No requiere servidor ni instalación
```

### Estructura de Carpetas
- **css/**: Estilos de la aplicación
  - `reset.css`: Reset CSS puro
  - `styles.css`: Estilos personalizados (layout, colores, responsive)
  
- **js/**: Lógica de la aplicación
  - `sudoku-engine.js`: Generador de puzzles usando backtracking
  - `ui.js`: Renderizado, interacción y validación
  
- **assets/**: Recursos estáticos
  - `favicon.svg`: Escarapela argentina en SVG

## 🎮 Cómo Funciona

### Motor de Sudoku
1. **Generación**: Utiliza backtracking para crear grillas válidas
2. **Validación**: Verifica reglas de Sudoku (filas, columnas, cajas 3x3)
3. **Creación de Puzzle**: Remueve números aleatoriamente según dificultad

### Interfaz
- Inputs interactivos en celdas vacías
- Validación en tiempo real mientras escribes
- Feedback visual (fondo verde) cuando resuelves correctamente
- Dos páginas: juego y soluciones

## 📱 Responsividad

### Puntos de Quiebre
- **Desktop** (900px+): Layout completo con títulos y decoración
- **Tablet** (421-900px): Grillas ajustadas, espaciado reducido
- **Mobile Pequeños** (≤430px): Solo grillas visibles, títulos ocultos
  - Pantallas 4.5", 5", 5.5", 6.5"
  - Sin encabezado de controles
  - Grillas 100% del ancho

## 🔧 Niveles de Dificultad

| Nivel | Números Removidos | Complejidad |
|-------|-------------------|------------|
| Inicial (Fácil) | 35 | Fácil de resolver |
| Intermedio | 45 | Requiere estrategia |
| Avanzado | 52 | Muy desafiante |

## 📖 Cómo Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/MiFeature`)
3. Commit tus cambios (`git commit -m 'Agrego MiFeature'`)
4. Push a la rama (`git push origin feature/MiFeature`)
5. Abre un Pull Request

## 🎨 Personalización

### Cambiar Colores
Edita `css/styles.css` y busca:
- `background-color: #2b2b2b` (fondo oscuro)
- `#3E2723` (marrón oscuro)
- `#8D6E63` (marrón claro)
- `#Fdfbf7` (beige/papel)

### Cambiar Niveles de Dificultad
En `index.html`, edita el selector:
```html
<select id="difficultySelect">
    <option value="20">Mi Nivel Personalizado</option>
    <!-- value = cantidad de números a remover -->
</select>
```

### Agregar Decoración
En `index.html` hay un bloque SVG con assets. Agrega nuevos símbolos y úsalos en el footer.

## 🐛 Bugs Conocidos

Ninguno reportado. ¡Si encuentras uno, abre un Issue!

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir

## 👤 Autor

**Facundo D**
- GitHub: [@FacundoDLF](https://github.com/FacundoDLF)
- Proyecto: [ArgenDo-Ku](https://github.com/FacundoDLF/ArgenDo-Ku)

## 🙏 Créditos

- Algoritmo de Sudoku: Backtracking clásico
- Tipografía: Google Fonts (Playfair Display, Lato)
- Inspiración: Cultura argentina

---

**Estado**: ✅ Activo y funcionando en GitHub Pages

**Última actualización**: Febrero 2026
