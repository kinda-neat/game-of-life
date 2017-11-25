import equal = require("deep-equal");
import es6BindAll = require("es6bindall");
import {ICell, IBoard, IModel} from "./interfaces";
import Cell from "./cell";

class Model implements IModel {
  private boardStates: IBoard[] = [];
  public board: IBoard;
  public width: number;
  public height: number;
  private stopGame: boolean;
  private bindMethods: string[] = ["boardInit", "nextBoardState", "getNewBoard", "isExistingBoardState", "hasBoardAliveCells", "toggleCellAliveState", "changeWidth", "changeHeight", "reBuildBoard", "copyExistingCells","changeStopGameStatus", "isGameStop", "getCurrentBoard", "getBoardWidth", "clearBoardStates"];
  constructor(width: number, height: number) {
    this.board = {};
    this.width = width;
    this.height = height;
    this.stopGame = false;
    es6BindAll(this, this.bindMethods);
  }
  public boardInit(): void {
    let currentCell: ICell;
    this.board = {};
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        currentCell = new Cell(i, j, false);
        this.board[getCellRepresentation(i, j)] = currentCell;
      }
    }
  }
  public nextBoardState() {
    const newBoard: IBoard = this.getNewBoard(this.board);
    const isExistingBoardState = this.isExistingBoardState(newBoard);
    const hasBoardAliveCells = this.hasBoardAliveCells();
    if (isExistingBoardState || !hasBoardAliveCells) {
      this.changeStopGameStatus(true);
      return;
    }
    this.boardStates.push(newBoard);
    this.board = newBoard;
  }
  public toggleCellAliveState(key: string): void {
    const cellAlive = this.board[key].alive;
    if (cellAlive) {
      this.board[key].alive = false;
    } else {
      this.board[key].alive = true;
    }
  }
  public changeStopGameStatus(stopGame: boolean): void {
    this.stopGame = stopGame;
  }
  public isGameStop(): boolean {
    return this.stopGame;
  }
  public getCurrentBoard(): IBoard {
    return this.board;
  }
  public getBoardWidth(): number {
    return this.width;
  }
  public clearBoardStates(): void {
    this.boardStates = [];
  }
  public changeWidth(newWidth: number): void {
    this.width = newWidth;
    this.reBuildBoard();
  }
  public changeHeight(newHeight: number): void {
    this.height = newHeight;
    this.reBuildBoard();
  }
  public getModel(): IModel {
    return {
      boardInit: this.boardInit,
      nextBoardState: this.nextBoardState,
      toggleCellAliveState: this.toggleCellAliveState,
      changeStopGameStatus: this.changeStopGameStatus,
      isGameStop: this.isGameStop,
      getCurrentBoard: this.getCurrentBoard,
      getBoardWidth: this.getBoardWidth,
      clearBoardStates: this.clearBoardStates,
      changeWidth: this.changeWidth,
      changeHeight: this.changeHeight,
    };
  }
  private getNewBoard(currentBoard: IBoard) {
    const newBoard =jQuery.extend(true, {}, currentBoard);
    Object.keys(newBoard).map((cell) => {
      const tempCell: ICell = this.calculateNextCellState(cell);
      newBoard[cell] = tempCell;
    });
    return newBoard;
  }
  private isExistingBoardState(newBoard: IBoard): boolean {
    return this.boardStates.some((boardState) => {
      return objectsEqual(newBoard, boardState) === true;
    });
  }
  private hasBoardAliveCells(): boolean {
    return Object.keys(this.board).some((cell) => {
      return this.board[cell].alive === true;
    });
  }
  private reBuildBoard(): void {
    const prevBoard = jQuery.extend(true, {}, this.board);
    this.boardInit();
    this.copyExistingCells(prevBoard);
  }
  private copyExistingCells(prevBoard: IBoard): void {
    Object.keys(this.board).map((cell) => {
        Object.keys(prevBoard).map((prevBoardCell) => {
          if (cell === prevBoardCell) {
            this.board[getCellRepresentation(prevBoard[cell].x, prevBoard[cell].y)] = prevBoard[cell];
          }
        });
    });
  }
  private calculateNextCellState(key: string): ICell {
    const cell: ICell = this.board[key];
    const tempCell: ICell = {x: cell.x, y: cell.y, alive: cell.alive};
    const livingNeighbours: number = this.getAliveNeighborsCount(cell.x, cell.y);
    if (tempCell.alive) {
      if (livingNeighbours === 2 || livingNeighbours === 3) {
        tempCell.alive = true;
      } else {
          tempCell.alive = false;
      }
    } else {
      if (livingNeighbours === 3) {
        tempCell.alive = true;
      }
    }

    return tempCell;
  }
  private getAliveNeighborsCount(x: number, y: number): number {
    const neighborsPositionRange = [-1, 0, 1];
    return neighborsPositionRange.reduce((aliveCount, positionX) => {
      neighborsPositionRange.map((positionY) => {
        if (positionX === 0 && positionX === positionY) {
          return;
        } else {
          const currentCell = this.getCellAt(getCellRepresentation(x + positionX, y + positionY));
          if (currentCell && currentCell.alive) {
            aliveCount++;
          }
        }
      });
      return aliveCount;
    }, 0);
  }
  private getCellAt(key: string): ICell {
    return this.board[key];
  }
}

function getCellRepresentation(x: number, y: number): string {
  return "x" + x + "y" + y;
}

function objectsEqual(a: IBoard, b: IBoard): boolean {
  return equal(a, b);
}

export default Model;
