import * as $ from "jquery";
import es6BindAll = require("es6bindall");
import {IModel, IView, IController} from "./interfaces";

class Controller implements IController {
  private model: IModel;
  private view: IView;
  private timer: number;
  private bindMethods: string[] = ["startGame", "pauseGame", "restartGame", "changeWidth", "changeHeight", "cellClicked"];
  public init() {
    es6BindAll(this, this.bindMethods);
    this.initGame();
    this.initSubscribers();
  }
  private initGame(): void {
    this.model.boardInit();
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public startGame(): void {
    this.timer = window.setInterval( () => {
      const gameStopStatus = this.model.isGameStop();
      if (!gameStopStatus) {
        this.model.changeStopGame(false);
        this.model.nextBoardState();
        const currentBoard = this.model.getCurrentBoard();
        const boardWidth = this.model.getBoardWidth();
        this.view.draw(currentBoard, boardWidth);
      } else {
        alert("Game is over!");
        clearTimeout(this.timer);
        this.model.changeStopGame(true);
        this.model.clearBoardStates();
      }
    }, 1000);
  }
  public pauseGame(): void {
    clearTimeout(this.timer);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public restartGame(): void {
    clearTimeout(this.timer);
    this.model.boardInit();
    this.model.clearBoardStates();
    this.model.changeStopGame(false);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public changeHeight(newHeight: number): void {
    this.model.changeHeight(newHeight);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public changeWidth(newWidth: number): void {
    this.model.changeWidth(newWidth);
    const currentBoard = this.model.getCurrentBoard();
    const boardWidth = this.model.getBoardWidth();
    this.view.draw(currentBoard, boardWidth);
  }
  public cellClicked(cellKey: string): void {
    this.model.editCellAliveState(cellKey);
  }
  public setModel(model: IModel): void {
    this.model = model;
  }
  public setView(view: IView): void {
    this.view = view;
  }
  private initSubscribers(): void {
    this.view.subscribe("startGame", this.startGame);
    this.view.subscribe("pauseGame", this.pauseGame);
    this.view.subscribe("restartGame", this.restartGame);
    this.view.subscribe("changeWidth", this.changeWidth);
    this.view.subscribe("changeHeight", this.changeHeight);
    this.view.subscribe("cellClicked", this.cellClicked);
  }
}

export default Controller;
