/**
 * Módulo de interfaz de usuario — ArgenDo-Ku
 * Maneja: renderizado de grillas, interacción de juego,
 * paginación, y estado de progreso.
 */

/* ──────────────────────────────────────────────
   ESTADO GLOBAL
   ────────────────────────────────────────────── */
const engine = new SudokuEngine();

// Array de páginas (juegos). Cada juego contiene puzzleA, puzzleB, fullA, fullB, etc.
let gamesState = [];
let viewMode = 'puzzles'; // 'puzzles' | 'solutions'
let currentPage = 1;

/* ──────────────────────────────────────────────
   RENDERIZADO DE GRILLAS
   ────────────────────────────────────────────── */

function renderGrid(elementId, gridData, isSolution, puzzleData = null, gameIndex = null) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '';

    // Si no es solución, tratamos de recuperar el progreso del usuario guardado
    let userProgress = null;
    if (!isSolution && gameIndex !== null) {
        userProgress = gamesState[gameIndex][`${elementId}Progress`] || {};
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.setAttribute('role', 'gridcell');

            if (gridData[i][j] !== 0) {
                // Es una pista (clue) o es la celda de una solución
                cell.textContent = gridData[i][j];
                if (!isSolution) {
                    cell.classList.add('clue');
                } else if (puzzleData) {
                    // Si es solución, comprobamos si era pista o número a adivinar
                    if (puzzleData[i][j] !== 0) {
                        cell.classList.add('sol-given'); // Pista original
                    } else {
                        cell.classList.add('sol-missing'); // La solución
                    }
                }
            } else if (!isSolution) {
                // Input interactivo para celdas vacías
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.maxLength = 1;
                inp.inputMode = 'numeric';
                inp.pattern = '[1-9]';
                inp.placeholder = '';
                inp.dataset.row = i;
                inp.dataset.col = j;
                inp.setAttribute('aria-label', `Fila ${i + 1}, columna ${j + 1}`);

                // Recuperar estado previo del input si existe
                if (userProgress && userProgress[`${i}-${j}`]) {
                    inp.value = userProgress[`${i}-${j}`];
                }

                inp.addEventListener('input', (e) => {
                    let v = e.target.value.replace(/[^1-9]/g, '').slice(-1);
                    if (e.target.value !== v) e.target.value = v;

                    // Guardar progreso en el estado global
                    if (gameIndex !== null) {
                        if (!gamesState[gameIndex][`${elementId}Progress`]) {
                            gamesState[gameIndex][`${elementId}Progress`] = {};
                        }
                        gamesState[gameIndex][`${elementId}Progress`][`${i}-${j}`] = v;
                    }

                    const gridEl = document.getElementById(elementId);
                    gridEl.classList.remove('win');
                    checkWin(gameIndex, elementId);
                });

                cell.appendChild(inp);
            }

            container.appendChild(cell);
        }
    }
}

/* ──────────────────────────────────────────────
   LÓGICA DE JUEGO
   ────────────────────────────────────────────── */

function checkWin(gameIndex, elementId) {
    if (gameIndex === null || !gamesState[gameIndex]) return false;

    // Identificar si es grid-A o grid-B
    const isGridA = elementId === 'grid-A';
    const sol = isGridA ? gamesState[gameIndex].fullA : gamesState[gameIndex].fullB;

    const container = document.getElementById(elementId);
    if (!container) return false;

    let allFilled = true;

    for (let idx = 0; idx < container.children.length; idx++) {
        const cell = container.children[idx];
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        let val = null;

        const input = cell.querySelector('input');
        if (input) {
            const v = input.value.trim();
            if (v === '') { allFilled = false; break; }
            val = parseInt(v, 10);
        } else {
            val = parseInt(cell.textContent, 10);
        }

        if (val !== sol[r][c]) return false;
    }

    if (allFilled) {
        container.classList.add('win');
        return true;
    }
    return false;
}

/* ──────────────────────────────────────────────
   PAGINACIÓN Y RENDERIZADO DE PÁGINAS
   ────────────────────────────────────────────── */

function renderPage(pageIndex, mode = viewMode) {
    currentPage = pageIndex;
    viewMode = mode;
    const workspaceGrid = document.getElementById('workspace-grid');
    workspaceGrid.innerHTML = ''; // Limpiar lienzo

    if (viewMode === 'puzzles') {
        const gameIndex = pageIndex - 1;
        const game = gamesState[gameIndex];

        // Renderizar hoja de puzzles (Juego N) - Agregada la clase puzzle-page
        workspaceGrid.innerHTML = `
            <div class="sheet puzzle-page" id="page-puzzle" role="article" aria-label="Hoja de juego ${pageIndex}">
                <div class="sheet-header">
                    <div class="main-title">ArgenDo-Ku</div>
                    <div class="subtitle">– El sudoku tradicional –</div>
                </div>
                <div class="puzzles-container">
                    <div class="puzzle-wrapper">
                        <div class="puzzle-label">
                            <div class="puzzle-label-text" id="label-A">${game.labelA} #${game.seed}A</div>
                        </div>
                        <div id="grid-A" class="sudoku-grid" role="grid" aria-label="Puzzle A"></div>
                    </div>
                    <div class="puzzle-wrapper">
                        <div class="puzzle-label">
                            <div class="puzzle-label-text" id="label-B">${game.labelA} #${game.seed}B</div>
                        </div>
                        <div id="grid-B" class="sudoku-grid" role="grid" aria-label="Puzzle B"></div>
                    </div>
                </div>
                <div class="sheet-footer" aria-hidden="true">
                    <div class="guarda-pampa"></div>
                </div>
            </div>
        `;

        renderGrid('grid-A', game.puzzleA, false, null, gameIndex);
        renderGrid('grid-B', game.puzzleB, false, null, gameIndex);

        // Re-check win just in case they return to a finished puzzle
        checkWin(gameIndex, 'grid-A');
        checkWin(gameIndex, 'grid-B');

    } else {
        // Renderizar hoja de soluciones para los juegos correspondientes a esta página
        // Cada página de soluciones contiene 1 juego (2 sudokus, igual que los puzzles)
        const gameIndex = pageIndex - 1;
        const g = gamesState[gameIndex];

        let solutionsHTML = `
            <div class="puzzle-wrapper">
                <div class="puzzle-label">
                    <div class="puzzle-label-text">Solución #${g.seed}A</div>
                </div>
                <div id="sol-grid-${gameIndex}-A" class="sudoku-grid sol-grid" role="grid" aria-label="Solución ${gameIndex + 1} A"></div>
            </div>
            <div class="puzzle-wrapper">
                <div class="puzzle-label">
                    <div class="puzzle-label-text">Solución #${g.seed}B</div>
                </div>
                <div id="sol-grid-${gameIndex}-B" class="sudoku-grid sol-grid" role="grid" aria-label="Solución ${gameIndex + 1} B"></div>
            </div>
        `;

        workspaceGrid.innerHTML = `
            <div class="sheet sheet-solutions solutions-page" id="page-solution" role="article" aria-label="Hoja de soluciones ${pageIndex}">
                <div class="sheet-header">
                    <div class="main-title">Soluciones</div>
                    <div class="subtitle">Verificar resultados</div>
                </div>
                <div class="puzzles-container" id="solutions-container">
                    ${solutionsHTML}
                </div>
                <div class="sheet-footer" aria-hidden="true">
                    <div class="guarda-pampa"></div>
                </div>
            </div>
        `;

        // Renderizar las grillas de soluciones
        renderGrid(`sol-grid-${gameIndex}-A`, g.fullA, true, g.puzzleA);
        renderGrid(`sol-grid-${gameIndex}-B`, g.fullB, true, g.puzzleB);
    }

    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination-pills');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const isPuzzles = viewMode === 'puzzles';
    const totalPages = gamesState.length;

    // Botones numéricos de juegos/páginas
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `btn btn--pill ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => renderPage(i, viewMode);
        paginationContainer.appendChild(btn);
    }

    // Botón de toggle (Soluciones / Puzzles)
    const btnToggle = document.createElement('button');
    btnToggle.className = `btn btn--pill toggle-mode`;
    btnToggle.textContent = isPuzzles ? 'Ver Soluciones' : 'Volver a Puzzles';
    btnToggle.onclick = () => {
        if (isPuzzles) {
            // Ir de puzzles a soluciones
            renderPage(currentPage, 'solutions');
        } else {
            // Ir de soluciones a puzzles
            renderPage(currentPage, 'puzzles');
        }
    };
    paginationContainer.appendChild(btnToggle);
}

/* ──────────────────────────────────────────────
   GENERACIÓN DE PUZZLES (AGREGAR PÁGINA)
   ────────────────────────────────────────────── */

function generateBook() {
    const btn = document.getElementById('btn-generate');
    setButtonLoading(btn, true);

    setTimeout(() => {
        try {
            const selector = document.getElementById('difficultySelect');
            const holes = parseInt(selector.value);
            const levelName = selector.options[selector.selectedIndex].text;

            const seed = Math.floor(Math.random() * 9000) + 1000;

            const fullA = engine.generateBase();
            const puzzleA = engine.createPuzzle(fullA, holes);

            const fullB = engine.generateBase();
            const puzzleB = engine.createPuzzle(fullB, holes);

            // Agregar al estado
            gamesState.push({
                labelA: levelName,
                seed: seed,
                fullA: fullA,
                puzzleA: puzzleA,
                fullB: fullB,
                puzzleB: puzzleB,
                'grid-AProgress': {},
                'grid-BProgress': {}
            });

            // Navegar a la página recién creada
            renderPage(gamesState.length, 'puzzles');

        } finally {
            setButtonLoading(btn, false);
        }
    }, 80);
}


/* ──────────────────────────────────────────────
   UTILIDADES
   ────────────────────────────────────────────── */

function setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
        btn.classList.add('btn--loading');
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
    } else {
        btn.classList.remove('btn--loading');
        btn.disabled = false;
        btn.setAttribute('aria-busy', 'false');
    }
}

/* ──────────────────────────────────────────────
   INICIALIZACIÓN
   ────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    generateBook(); // Generar la primera página
});
