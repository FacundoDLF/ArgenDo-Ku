/**
 * Clase SudokuEngine
 * Genera y resuelve puzzles de Sudoku usando backtracking
 */
class SudokuEngine {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
    }

    /**
     * Valida si un número puede colocarse en una celda
     * @param {Array} grid - La grilla actual
     * @param {number} row - Fila
     * @param {number} col - Columna
     * @param {number} num - Número a validar
     * @returns {boolean}
     */
    isValid(grid, row, col, num) {
        // Chequear fila y columna
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }
        // Chequear caja 3x3
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    /**
     * Resuelve la grilla usando Backtracking
     * @param {Array} grid - La grilla a resolver
     * @returns {boolean}
     */
    solve(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    // Probar números 1-9 aleatoriamente para variedad
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (this.isValid(grid, i, j, num)) {
                            grid[i][j] = num;
                            if (this.solve(grid)) return true;
                            grid[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Genera un Sudoku completo
     * @returns {Array} Grilla completa resuelta
     */
    generateBase() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
        // Llenar diagonales primero (independientes)
        this.fillDiagonal();
        // Resolver el resto
        this.solve(this.grid);
        return JSON.parse(JSON.stringify(this.grid)); // Copia profunda
    }

    /**
     * Llena las cajas diagonales (patrón inicial)
     */
    fillDiagonal() {
        for (let i = 0; i < 9; i = i + 3) {
            this.fillBox(i, i);
        }
    }

    /**
     * Llena una caja 3x3 con números válidos
     * @param {number} row - Fila inicial
     * @param {number} col - Columna inicial
     */
    fillBox(row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!this.isSafeInBox(row, col, num));
                this.grid[row + i][col + j] = num;
            }
        }
    }

    /**
     * Valida si un número es seguro en una caja 3x3
     * @param {number} rowStart - Fila inicial de la caja
     * @param {number} colStart - Columna inicial de la caja
     * @param {number} num - Número a verificar
     * @returns {boolean}
     */
    isSafeInBox(rowStart, colStart, num) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[rowStart + i][colStart + j] === num) return false;
            }
        }
        return true;
    }

    /**
     * Crea un puzzle removiendo números de la solución
     * @param {Array} fullGrid - Grilla completa resuelta
     * @param {number} holes - Cantidad de números a remover
     * @returns {Array}
     */
    createPuzzle(fullGrid, holes) {
        let puzzle = JSON.parse(JSON.stringify(fullGrid));
        let attempts = holes;
        while (attempts > 0) {
            let r = Math.floor(Math.random() * 9);
            let c = Math.floor(Math.random() * 9);
            if (puzzle[r][c] !== 0) {
                puzzle[r][c] = 0;
                attempts--;
            }
        }
        return puzzle;
    }
}
