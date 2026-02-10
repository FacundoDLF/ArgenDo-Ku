/**
 * Módulo de interfaz de usuario
 * Maneja el renderizado y interacción de grillas
 */

const engine = new SudokuEngine();
const solutions = {}; // Almacena soluciones

/**
 * Renderiza una grilla de Sudoku en el DOM
 * @param {string} elementId - ID del contenedor
 * @param {Array} gridData - Datos de la grilla
 * @param {boolean} isSolution - Si es página de soluciones
 */
function renderGrid(elementId, gridData, isSolution) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            if (gridData[i][j] !== 0) {
                cell.textContent = gridData[i][j];
                if (!isSolution) cell.classList.add('clue');
            } else if (!isSolution) {
                // Crear input interactivo para celdas vacías
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.maxLength = 1;
                inp.inputMode = 'numeric';
                inp.pattern = '[1-9]';
                inp.placeholder = '';
                inp.dataset.row = i;
                inp.dataset.col = j;

                // Sanitizar entrada y validar
                inp.addEventListener('input', (e) => {
                    let v = e.target.value.replace(/[^1-9]/g, '');
                    v = v.slice(-1);
                    if (e.target.value !== v) e.target.value = v;
                    
                    // Al cambiar, limpiar estado de victoria
                    const gridEl = document.getElementById(elementId);
                    gridEl.classList.remove('win');
                    checkWin(elementId);
                });

                cell.appendChild(inp);
            }
            container.appendChild(cell);
        }
    }
}

/**
 * Verifica si el puzzle está completo y correcto
 * @param {string} elementId - ID de la grilla
 * @returns {boolean}
 */
function checkWin(elementId) {
    const sol = solutions[elementId];
    if (!sol) return false;
    
    const container = document.getElementById(elementId);
    let allFilled = true;
    
    for (let idx = 0; idx < container.children.length; idx++) {
        const cell = container.children[idx];
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        let val = null;
        
        const input = cell.querySelector('input');
        if (input) {
            const v = input.value.trim();
            if (v === '') { 
                allFilled = false; 
                break; 
            }
            val = parseInt(v, 10);
        } else {
            // Pista estática
            val = parseInt(cell.textContent, 10);
        }
        
        if (val !== sol[r][c]) {
            return false;
        }
    }
    
    if (allFilled) {
        // Activar feedback visual de victoria
        container.classList.add('win');
        return true;
    }
    return false;
}

/**
 * Genera dos puzzles nuevos y sus soluciones
 */
function generateBook() {
    const selector = document.getElementById('difficultySelect');
    const holes = parseInt(selector.value);
    const levelName = selector.options[selector.selectedIndex].text;

    // Actualizar textos
    document.getElementById('displayLevel').textContent = levelName.split('(')[0].trim();
    
    const labelA = levelName.includes("Inicial") ? "Inicial" : 
                   (levelName.includes("Intermedio") ? "Intermedio" : "Avanzado");
    const seed = Math.floor(Math.random() * 1000);
    
    document.getElementById('label-A').textContent = `${labelA} #${seed}A`;
    document.getElementById('label-B').textContent = `${labelA} #${seed}B`;
    document.getElementById('sol-label-A').textContent = `Solución #${seed}A`;
    document.getElementById('sol-label-B').textContent = `Solución #${seed}B`;

    // Generar puzzle A
    const fullA = engine.generateBase();
    const puzzleA = engine.createPuzzle(fullA, holes);
    solutions['grid-A'] = fullA;
    document.getElementById('grid-A').classList.remove('win');
    renderGrid('grid-A', puzzleA, false);
    renderGrid('sol-grid-A', fullA, true);

    // Generar puzzle B
    const fullB = engine.generateBase();
    const puzzleB = engine.createPuzzle(fullB, holes);
    solutions['grid-B'] = fullB;
    document.getElementById('grid-B').classList.remove('win');
    renderGrid('grid-B', puzzleB, false);
    renderGrid('sol-grid-B', fullB, true);
}

// Generar al cargar la página
window.addEventListener('DOMContentLoaded', generateBook);
