import CellKlass from './Cell.js';
import PoolKlass from './../utils/object/Pool.js';

const GetValue = Phaser.Utils.Objects.GetValue;
var CellsPool = new PoolKlass();
class Table {
    constructor(parent, config) {
        this.parent = parent; // parent: GridTable game object (container)
        this.cells = [];
        this.resetFromJSON(config);
    }

    resetFromJSON(o) {
        this.colCount = undefined;
        this.defaultCellHeightMode = true;
        this._totalRowsHeight = null;
        this.setDefaultCellHeight(GetValue(o, "cellHeight", 30));
        this.setDefaultCellWidth(GetValue(o, "cellWidth", 30));
        this.setCellCount(GetValue(o, "totalcells", 10));
        this.setColumnCount(GetValue(o, "columns", 1));
        return this;
    }

    setUpdateFlag(flag) {
        if (flag === undefined) {
            flag = true;
        }
        this.parent.updateFlag |= flag;
    }

    setDefaultCellHeight(height) {
        this.defaultCellHeight = height;
        return this;
    }

    setDefaultCellWidth(width) {
        this.defaultCellWidth = width;
        return this;
    }

    setCellCount(cnt) {
        var end = this.cellCount;
        if (end === cnt)
            return this;

        var cells = this.cells,
            cell;
        if (end > cnt) {
            for (var i = cnt; i < end; i++) {
                // release lines
                cell = cells[i];
                if (!cell)
                    continue;

                cell.free();
                CellsPool.free(cell);
            }
            cells.length = cnt;
        } else if (end < cnt) {
            cells.length = cnt
            for (var i = end; i < cnt; i++) {
                cells[i] = null;
            }
        }

        if (Math.floor(end / this.colCount) !== Math.floor(cnt / this.colCount))
            this._totalRowsHeight = null;

        this.setUpdateFlag();
        return this;
    }

    setColumnCount(cnt) {
        this.setUpdateFlag(this.colCount !== cnt);

        this.colCount = cnt;
        this._totalRowsHeight = null;
        return this;
    }

    get rowCount() {
        return Math.ceil(this.cellCount / this.colCount);
    }

    get cellCount() {
        return this.cells.length;
    }

    isValidCellIdx(idx) {
        return ((idx >= 0) && (idx < this.cellCount));
    }

    heightToRowIndex(height, isCeil) {
        // defaultCellHeightMode
        if (this.defaultCellHeightMode) {
            var rowIdx = height / this.defaultCellHeight;
            if (isCeil) {
                rowIdx = Math.ceil(rowIdx);
            } else {
                rowIdx = Math.floor(rowIdx);
            }

            return rowIdx;
        }

        // count cell height one by one
        var rowCount = this.rowCount;
        var remain = height,
            cellCount = 0,
            isValidIdx;
        var cell, rowHeight, rowIdx = 0;

        while (1) {
            rowHeight = this.getRowHeight(rowIdx);
            remain -= rowHeight;

            isValidIdx = (rowIdx >= 0) && (rowIdx < rowCount);
            if ((remain > 0) && isValidIdx) {
                rowIdx += 1;
            } else if (remain === 0)
                return rowIdx;
            else {
                if (isCeil) {
                    var preRowIdx = rowIdx;
                    rowIdx += 1;
                    isValidIdx = (rowIdx >= 0) && (rowIdx < rowCount);

                    if (!isValidIdx)
                        rowIdx = preRowIdx;
                }

                return rowIdx;
            }
        }

    }

    widthToColIndex(width, isCeil) {
        var colIdx = width / this.defaultCellWidth;
        if (isCeil) {
            colIdx = Math.ceil(colIdx);
        } else {
            colIdx = Math.floor(colIdx);
        }

        return colIdx;
    }

    colRowToCellIndex(colIdx, rowIdx) {
        return (rowIdx * this.colCount) + colIdx;
    }

    rowIndexToHeight(start, end) {
        // defaultCellHeightMode
        if (this.defaultCellHeightMode) {
            return (end - start + 1) * this.defaultCellHeight;
        }

        var h, sum = 0;
        var allDefaultHeight = true;
        for (var i = start; i <= end; i++) {
            h = this.getRowHeight(i);
            sum += h;

            if (h !== this.defaultCellHeight)
                allDefaultHeight = false;
        }

        if (allDefaultHeight &&
            (start === 0) &&
            (end >= (this.rowCount - 1))) {
            this.defaultCellHeightMode = true;
        }
        return sum;
    }

    colIndexToWidth(start, end) {
        return (end - start + 1) * this.defaultCellWidth;
    };

    getRowHeight(rowIdx) {
        var cnt = this.colCount;
        // single column
        if (cnt <= 1) {
            return this.getCellHeight(this.colRowToCellIndex(0, rowIdx));
        }

        // multiple columns, get the maximum height
        var maxHeight = 0,
            cellHeight;
        for (var i = 0; i < cnt; i++) {
            cellHeight = this.getCellHeight(this.colRowToCellIndex(i, rowIdx));
            if (maxHeight < cellHeight)
                maxHeight = cellHeight;
        }
        return maxHeight;
    }

    getColWidth(idx) {
        return this.defaultCellWidth;
    }

    getCellHeight(cellIdx) {
        if (!this.isValidCellIdx(cellIdx))
            return 0;

        var cellHeight;
        if (this.defaultCellHeightMode)
            cellHeight = this.defaultCellHeight;
        else {
            var cell = this.getCell(cellIdx, false);
            var deltaHeight = (cell) ? cell.deltaHeight : 0;
            cellHeight = this.defaultCellHeight + deltaHeight;
        }

        return cellHeight;
    }

    get totalRowsHeight() {
        if (this._totalRowsHeight === null)
            this._totalRowsHeight = this.rowIndexToHeight(0, this.rowCount - 1);

        return this._totalRowsHeight;
    }

    get totalColumnWidth() {
        return this.colCount * this.defaultCellWidth;
    }

    getCell(cellIdx, createNewCellInst) {
        if (!this.isValidCellIdx(cellIdx)) {
            return null;
        }

        if (createNewCellInst === undefined) {
            createNewCellInst = true;
        }
        if ((this.cells[cellIdx] === null) && createNewCellInst) {
            this.cells[cellIdx] = this.newCell(cellIdx);
        }

        return this.cells[cellIdx];
    }

    newCell(cellIdx) {
        CELL_CONFIG.idx = cellIdx;
        CELL_CONFIG.rowIdx = Math.floor(cellIdx / this.colCount);
        CELL_CONFIG.colIdx = cellIdx % this.colCount;

        var cell = CellsPool.allocate();
        if (cell === null) {
            cell = new CellKlass(this, CELL_CONFIG);
        } else {
            cell.parent = this;
            cell.resetFromJSON(CELL_CONFIG);
        }

        return cell;
    }
}

var CELL_CONFIG = {};

export default Table;